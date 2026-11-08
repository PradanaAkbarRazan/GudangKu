
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const NAMA_COOKIE = "gudangku_session";
const DELAPAN_JAM = 60 * 60 * 8;

export type SesiAktif = {
  userId: string;
  email: string;
  role: "ADMIN" | "PETUGAS";
};

function hashToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function buatSesi(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + DELAPAN_JAM * 1000);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(NAMA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
    expires: expiresAt,
  });
}

export async function bacaSesi(): Promise<SesiAktif | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE)?.value;

  if (!token || token.length > 128) {
    return null;
  }

  const sesi = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!sesi || sesi.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    userId: sesi.user.id,
    email: sesi.user.email,
    role: sesi.user.role,
  };
}

export async function hapusSesi(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  cookieStore.delete(NAMA_COOKIE);
}
