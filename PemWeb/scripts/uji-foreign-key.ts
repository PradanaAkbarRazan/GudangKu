import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  Prisma,
  PrismaClient,
} from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum ditemukan.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sebelum = await prisma.riwayatStok.count();

  console.log("Riwayat sebelum pengujian:", sebelum);

  let p2003Terdeteksi = false;

  try {
    await prisma.riwayatStok.create({
      data: {
        produkId: "ID-PRODUK-TIDAK-ADA",
        jenis: "MASUK",
        jumlah: 1,
        catatan: "Uji foreign key tidak valid",
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      p2003Terdeteksi = true;
      console.log("P2003 terdeteksi: foreign key tidak valid.");
      console.log("Database menolak penyimpanan riwayat stok.");
    } else {
      throw error;
    }
  }

  const sesudah = await prisma.riwayatStok.count();

  console.log("Riwayat setelah pengujian:", sesudah);

  if (!p2003Terdeteksi || sebelum !== sesudah) {
    throw new Error("Pengujian foreign key tidak berhasil.");
  }

  console.log("BERHASIL: foreign key menjaga integritas relasi.");
}

main()
  .catch((error) => {
    console.error("Pengujian gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });