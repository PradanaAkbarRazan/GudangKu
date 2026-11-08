
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { skemaMasuk } from "@/lib/skema";
import { prisma } from "@/lib/prisma";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import { verifikasiKataSandi } from "@/lib/password";
import type { StatusForm } from "@/lib/status-form";

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaMasuk.safeParse(
    Object.fromEntries(formData)
  );

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
    };
  }

  const email = hasil.data.email.trim().toLowerCase();
  const { kataSandi } = hasil.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (
    !user ||
    !(await verifikasiKataSandi(user.passwordHash, kataSandi))
  ) {
    return {
      pesan: "Email atau kata sandi salah.",
    };
  }

  await buatSesi(user.id);

  redirect("/barang");
}

export async function keluar() {
  await hapusSesi();
  redirect("/masuk");
}
