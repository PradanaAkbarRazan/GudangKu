import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum dikonfigurasi.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function kodeError(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }

  return null;
}

async function main() {
  // Ambil produk PRD001 (Beras Premium).
  const produk = await prisma.produk.findUnique({
    where: { kodeRute: "PRD001" },
  });

  if (!produk) {
    throw new Error("Produk PRD001 tidak ditemukan.");
  }

  const sebelum = await prisma.riwayatStok.count({
    where: { produkId: produk.id },
  });

  console.log("Produk:", produk.nama);
  console.log("Riwayat stok sebelum pengujian:", sebelum);

  if (sebelum < 1) {
    throw new Error("Produk tidak memiliki riwayat stok untuk diuji.");
  }

  // Uji 1: mencoba menghapus produk secara langsung.
  try {
    await prisma.produk.delete({
      where: { id: produk.id },
    });

    throw new Error("Penghapusan langsung ternyata berhasil.");
  } catch (error) {
    if (kodeError(error) !== "P2003") {
      throw error;
    }

    console.log("P2003 terdeteksi: penghapusan ditolak oleh foreign key.");
  }

  // Uji 2: transaksi sengaja dibuat gagal pada operasi kedua.
  try {
    await prisma.$transaction([
      prisma.riwayatStok.deleteMany({
        where: { produkId: produk.id },
      }),
      prisma.produk.delete({
        where: { id: `${produk.id}-ID-TIDAK-ADA` },
      }),
    ]);

    throw new Error("Transaksi ternyata berhasil, padahal seharusnya gagal.");
  } catch (error) {
    if (kodeError(error) !== "P2025") {
      throw error;
    }

    console.log("P2025 terdeteksi: operasi kedua gagal.");
    console.log("Transaksi dibatalkan (rollback).");
  }

  // Verifikasi bahwa semua perubahan transaksi dibatalkan.
  const produkSesudah = await prisma.produk.findUnique({
    where: { id: produk.id },
  });

  const sesudah = await prisma.riwayatStok.count({
    where: { produkId: produk.id },
  });

  console.log("Produk masih tersedia:", produkSesudah !== null);
  console.log("Riwayat stok setelah rollback:", sesudah);

  if (!produkSesudah || sebelum !== sesudah) {
    throw new Error("Verifikasi rollback gagal.");
  }

  console.log("BERHASIL: rollback mempertahankan seluruh data.");
}

main()
  .catch((error) => {
    console.error("Pengujian gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });