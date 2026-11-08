
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { dataAwal } from "./data-awal";
import { hashKataSandi } from "../lib/password";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur di file .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {

    // Membaca kredensial akun pengujian dari environment.
  const adminEmail = process.env.SEED_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  const petugasEmail = process.env.SEED_PETUGAS_EMAIL
    ?.trim()
    .toLowerCase();

  const petugasPassword = process.env.SEED_PETUGAS_PASSWORD;

  if (
    !adminEmail ||
    !adminPassword ||
    !petugasEmail ||
    !petugasPassword
  ) {
    throw new Error(
      "Konfigurasi akun Admin dan Petugas belum lengkap."
    );
  }

  if (
    adminEmail === petugasEmail ||
    adminPassword.length < 12 ||
    petugasPassword.length < 12
  ) {
    throw new Error(
      "Email harus berbeda dan password minimal 12 karakter."
    );
  }

  // Hash password menggunakan Argon2id.
  const [adminHash, petugasHash] = await Promise.all([
    hashKataSandi(adminPassword),
    hashKataSandi(petugasPassword),
  ]);

  // Membuat atau memperbarui akun Admin.
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Membuat atau memperbarui akun Petugas.
  await prisma.user.upsert({
    where: { email: petugasEmail },
    update: {
      passwordHash: petugasHash,
      role: "PETUGAS",
    },
    create: {
      email: petugasEmail,
      passwordHash: petugasHash,
      role: "PETUGAS",
    },
  });

  console.log("Seed akun Admin dan Petugas berhasil.");

  // Seed data produk menggunakan upsert
  const produkBerdasarkanKode = new Map<string, string>();

  for (const data of dataAwal) {
    const produk = await prisma.produk.upsert({
      where: {
        kodeRute: data.kodeRute,
      },
      update: {},
      create: data,
    });

    produkBerdasarkanKode.set(produk.kodeRute, produk.id);
  }

  // Mengambil ID produk yang sudah dibuat
  const berasId = produkBerdasarkanKode.get("PRD001");
  const minyakId = produkBerdasarkanKode.get("PRD002");
  const gulaId = produkBerdasarkanKode.get("PRD003");

  if (!berasId || !minyakId || !gulaId) {
    throw new Error("Produk untuk seed riwayat stok tidak ditemukan");
  }

  // Seed data riwayat stok
  const dataRiwayat = [
    {
      id: "RS001",
      produkId: berasId,
      jenis: "MASUK" as const,
      jumlah: 100,
      catatan: "Stok awal beras",
    },
    {
      id: "RS002",
      produkId: berasId,
      jenis: "KELUAR" as const,
      jumlah: 10,
      catatan: "Pengeluaran beras",
    },
    {
      id: "RS003",
      produkId: minyakId,
      jenis: "MASUK" as const,
      jumlah: 50,
      catatan: "Stok awal minyak",
    },
    {
      id: "RS004",
      produkId: gulaId,
      jenis: "MASUK" as const,
      jumlah: 75,
      catatan: "Stok awal gula",
    },
  ];

  for (const data of dataRiwayat) {
    await prisma.riwayatStok.upsert({
      where: {
        id: data.id,
      },
      update: {},
      create: data,
    });
  }

  const jumlahProduk = await prisma.produk.count();
  const jumlahRiwayat = await prisma.riwayatStok.count();

  console.log(
    `Seed selesai: ${jumlahProduk} produk, ${jumlahRiwayat} riwayat stok`
  );
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
