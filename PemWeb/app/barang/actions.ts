"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { bacaSesi } from "@/lib/sesi";

import { skemaBarang } from "@/lib/skema";
import {
  namaBarangSudahAda,
  tambahBarang,
} from "@/lib/data";
import type { StatusForm } from "@/lib/status-form";

export async function simpanBarang(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
  return {
    pesan: "Silakan masuk terlebih dahulu.",
  };
}
  const mentah = Object.fromEntries(formData);

  // Menyimpan nilai input agar tidak hilang saat validasi gagal.
  const nilai = {
    name: String(mentah.name ?? ""),
    category: String(mentah.category ?? ""),
    stock: String(mentah.stock ?? ""),
    minimumStock: String(mentah.minimumStock ?? ""),
    unit: String(mentah.unit ?? ""),
    tersedia: String(mentah.tersedia ?? ""),
  };

  // 1. Validasi bentuk data menggunakan Zod.
  const hasil = skemaBarang.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  // 2. Validasi semantik: nama barang harus unik.
  if (namaBarangSudahAda(hasil.data.name)) {
    return {
      galat: {
        name: ["Nama barang sudah terdaftar."],
      },
      pesan: "Gunakan nama barang yang berbeda.",
      nilai,
    };
  }

  // 3. Simpan data yang lolos semua validasi.
  let routeId: string;

  try {
    routeId = tambahBarang(hasil.data).routeId;
  } catch (error) {
    console.error("simpanBarang gagal:", error);

    return {
      pesan: "Barang gagal disimpan. Coba lagi.",
      nilai,
    };
  }

  // 4. Perbarui halaman daftar barang.
  revalidatePath("/barang");

  // 5. Arahkan ke halaman detail barang baru.
  redirect(`/barang/${routeId}`);
}