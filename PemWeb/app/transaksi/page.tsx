import type { Metadata } from "next";
import { connection } from "next/server";

import PageHeader from "@/components/PageHeader";
import TransactionsClient from "@/components/TransactionsClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Transaksi Stok",
};

export default async function TransaksiPage() {
  await connection();

  const [produk, riwayat] = await Promise.all([
    prisma.produk.findMany({
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        kodeRute: true,
        nama: true,
        stok: true,
        satuan: true,
        tersedia: true,
      },
    }),

    prisma.riwayatStok.findMany({
      orderBy: {
        dibuatPada: "desc",
      },
      include: {
        produk: {
          select: {
            nama: true,
            kodeRute: true,
          },
        },
      },
    }),
  ]);

  const daftarProduk = produk.map((item) => ({
    id: item.id,
    kodeRute: item.kodeRute,
    nama: item.nama,
    stok: item.stok,
    satuan: item.satuan,
    tersedia: item.tersedia,
  }));

  const daftarRiwayat = riwayat.map((item) => ({
    id: item.id,
    produkId: item.produkId,
    namaProduk: item.produk.nama,
    kodeRute: item.produk.kodeRute,
    jenis: item.jenis,
    jumlah: item.jumlah,
    catatan: item.catatan ?? "",
    dibuatPada: item.dibuatPada.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Transaksi Stok"
        description="Catat barang masuk dan barang keluar."
      />

      <TransactionsClient
        produk={daftarProduk}
        riwayat={daftarRiwayat}
      />
    </div>
  );
}