
import "server-only";

import { redirect } from "next/navigation";

import {
  bacaSesi,
  type SesiAktif,
} from "@/lib/sesi";

type Role = SesiAktif["role"];

export async function wajibLogin(): Promise<SesiAktif> {
  const sesi = await bacaSesi();

  if (!sesi) {
    redirect("/masuk");
  }

  return sesi;
}

export async function wajibRole(
  ...roles: Role[]
): Promise<SesiAktif> {
  const sesi = await wajibLogin();

  if (!roles.includes(sesi.role)) {
    redirect("/akses-ditolak");
  }

  return sesi;
}
