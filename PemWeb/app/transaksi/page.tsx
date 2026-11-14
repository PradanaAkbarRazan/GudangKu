
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import PageHeader from "@/components/PageHeader";
import TransactionsClient from "@/components/TransactionsClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Transaksi Stok",
};

// Seluruh data runtime diproses di dalam Suspense.
async function KontenTransaksi() {
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
    <TransactionsClient
      produk={daftarProduk}
      riwayat={daftarRiwayat}
    />
  );
}

export default function TransaksiPage() {
  return (
    <div>
      <PageHeader
        title="Transaksi Stok"
        description="Catat barang masuk dan barang keluar."
      />

      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600"
          >
            Memuat data transaksi stok...
          </div>
        }
      >
        <KontenTransaksi />
      </Suspense>
    </div>
  );
}
