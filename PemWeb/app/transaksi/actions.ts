"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

const skemaRiwayat = z.object({
  produkId: z.string().min(1, "Pilih barang terlebih dahulu."),
  jenis: z.enum(["MASUK", "KELUAR"]),
  jumlah: z
    .number()
    .int("Jumlah harus berupa bilangan bulat.")
    .min(1, "Jumlah minimal 1.")
    .max(100000, "Jumlah maksimal 100000."),
  catatan: z.string().max(500, "Keterangan maksimal 500 karakter."),
});

type JenisPergerakan = "MASUK" | "KELUAR";

class GalatRiwayat extends Error {
  constructor(
    public kode: "PRODUK_TIDAK_ADA" | "RIWAYAT_TIDAK_ADA" | "STOK_TIDAK_CUKUP",
    pesan: string
  ) {
    super(pesan);
    this.name = "GalatRiwayat";
  }
}

function efekStok(jenis: JenisPergerakan, jumlah: number): number {
  return jenis === "MASUK" ? jumlah : -jumlah;
}

function bacaMasukan(formData: FormData) {
  const mentah = {
    produkId: String(formData.get("produkId") ?? ""),
    jenis: String(formData.get("jenis") ?? ""),
    jumlah: Number(formData.get("jumlah")),
    catatan: String(formData.get("catatan") ?? "").trim(),
  };

  const hasil = skemaRiwayat.safeParse(mentah);

  const nilai = {
    produkId: mentah.produkId,
    jenis: mentah.jenis,
    jumlah: Number.isNaN(mentah.jumlah) ? "" : String(mentah.jumlah),
    catatan: mentah.catatan,
  };

  return { hasil, nilai };
}

function tanganiGalat(error: unknown, nilai: Record<string, string>): StatusForm {
  if (error instanceof GalatRiwayat) {
    return {
      pesan: error.message,
      nilai,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      return {
        galat: {
          produkId: ["Produk yang dipilih tidak ditemukan."],
        },
        pesan: "Riwayat stok harus terhubung dengan produk yang valid.",
        nilai,
      };
    }

    if (error.code === "P2025") {
      return {
        pesan: "Data riwayat stok atau produk tidak ditemukan.",
        nilai,
      };
    }
  }

  console.error("Operasi RiwayatStok gagal:", error);

  return {
    pesan: "Operasi riwayat stok gagal. Silakan coba lagi.",
    nilai,
  };
}

function perbaruiHalaman() {
  revalidatePath("/transaksi");
  revalidatePath("/barang");
  revalidatePath("/");
}

// CREATE: menambahkan riwayat stok dan memperbarui saldo produk.
export async function simpanRiwayatStok(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const { hasil, nilai } = bacaMasukan(formData);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  const data = hasil.data;

  try {
    await prisma.$transaction(async (tx) => {
      const produk = await tx.produk.findUnique({
        where: { id: data.produkId },
        select: { id: true, stok: true },
      });

      if (!produk) {
        throw new GalatRiwayat(
          "PRODUK_TIDAK_ADA",
          "Produk yang dipilih tidak ditemukan."
        );
      }

      const stokBaru = produk.stok + efekStok(data.jenis, data.jumlah);

      if (stokBaru < 0) {
        throw new GalatRiwayat(
          "STOK_TIDAK_CUKUP",
          `Stok tidak mencukupi. Stok saat ini ${produk.stok}.`
        );
      }

      await tx.produk.update({
        where: { id: produk.id },
        data: { stok: stokBaru },
      });

      await tx.riwayatStok.create({
        data: {
          produkId: data.produkId,
          jenis: data.jenis,
          jumlah: data.jumlah,
          catatan: data.catatan || null,
        },
      });
    });
  } catch (error) {
    return tanganiGalat(error, nilai);
  }

  perbaruiHalaman();

  return {
    pesan: "Riwayat stok berhasil ditambahkan.",
  };
}

// UPDATE: mengoreksi riwayat dan menghitung ulang dampaknya pada stok.
export async function ubahRiwayatStok(
  id: string,
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const { hasil, nilai } = bacaMasukan(formData);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  const data = hasil.data;

  try {
    await prisma.$transaction(async (tx) => {
      const riwayatLama = await tx.riwayatStok.findUnique({
        where: { id },
      });

      if (!riwayatLama) {
        throw new GalatRiwayat(
          "RIWAYAT_TIDAK_ADA",
          "Riwayat stok tidak ditemukan atau sudah dihapus."
        );
      }

      const idProduk = [
        ...new Set([riwayatLama.produkId, data.produkId]),
      ];

      const daftarProduk = await tx.produk.findMany({
        where: { id: { in: idProduk } },
        select: { id: true, stok: true },
      });

      const saldo = new Map(
        daftarProduk.map((produk) => [produk.id, produk.stok])
      );

      if (
        !saldo.has(riwayatLama.produkId) ||
        !saldo.has(data.produkId)
      ) {
        throw new GalatRiwayat(
          "PRODUK_TIDAK_ADA",
          "Produk yang terkait dengan riwayat tidak ditemukan."
        );
      }

      // Batalkan dampak transaksi lama.
      const saldoProdukLama =
        saldo.get(riwayatLama.produkId)! -
        efekStok(riwayatLama.jenis, riwayatLama.jumlah);

      saldo.set(riwayatLama.produkId, saldoProdukLama);

      // Terapkan dampak transaksi yang baru.
      const saldoProdukBaru =
        saldo.get(data.produkId)! + efekStok(data.jenis, data.jumlah);

      saldo.set(data.produkId, saldoProdukBaru);

      for (const [produkId, stokAkhir] of saldo) {
        if (stokAkhir < 0) {
          throw new GalatRiwayat(
            "STOK_TIDAK_CUKUP",
            "Perubahan ditolak karena akan menyebabkan stok menjadi negatif."
          );
        }

        await tx.produk.update({
          where: { id: produkId },
          data: { stok: stokAkhir },
        });
      }

      await tx.riwayatStok.update({
        where: { id },
        data: {
          produkId: data.produkId,
          jenis: data.jenis,
          jumlah: data.jumlah,
          catatan: data.catatan || null,
        },
      });
    });
  } catch (error) {
    return tanganiGalat(error, nilai);
  }

  perbaruiHalaman();

  return {
    pesan: "Riwayat stok berhasil diperbarui.",
  };
}

// DELETE: menghapus riwayat dan mengembalikan dampaknya pada saldo produk.
export async function hapusRiwayatStok(
  id: string,
  _sebelumnya: StatusForm,
  _formData: FormData
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
      void _sebelumnya;
  void _formData;
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const riwayat = await tx.riwayatStok.findUnique({
        where: { id },
      });

      if (!riwayat) {
        throw new GalatRiwayat(
          "RIWAYAT_TIDAK_ADA",
          "Riwayat stok tidak ditemukan atau sudah dihapus."
        );
      }

      const produk = await tx.produk.findUnique({
        where: { id: riwayat.produkId },
        select: { id: true, stok: true },
      });

      if (!produk) {
        throw new GalatRiwayat(
          "PRODUK_TIDAK_ADA",
          "Produk terkait tidak ditemukan."
        );
      }

      // Membatalkan dampak riwayat yang dihapus.
      const stokBaru =
        produk.stok - efekStok(riwayat.jenis, riwayat.jumlah);

      if (stokBaru < 0) {
        throw new GalatRiwayat(
          "STOK_TIDAK_CUKUP",
          "Riwayat tidak dapat dihapus karena akan menyebabkan stok negatif."
        );
      }

      await tx.produk.update({
        where: { id: produk.id },
        data: { stok: stokBaru },
      });

      await tx.riwayatStok.delete({
        where: { id },
      });
    });
  } catch (error) {
    return tanganiGalat(error, {});
  }

  perbaruiHalaman();

  return {
    pesan: "Riwayat stok berhasil dihapus.",
  };
}