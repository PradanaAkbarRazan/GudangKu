
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import PageHeader from "@/components/PageHeader";
import InventoryClient from "@/components/InventoryClient";
import { ambilDaftarBarang } from "@/lib/data";

export const metadata: Metadata = {
  title: "Daftar Barang",
};

export default function HomePage() {
  return (
    <Suspense fallback={<p>Memuat daftar barang...</p>}>
      <KontenHalamanUtama />
    </Suspense>
  );
}

async function KontenHalamanUtama() {
  await connection();

  const daftarBarang = await ambilDaftarBarang();

  return (
    <div>
      <PageHeader
        title="Daftar Barang"
        description="Lihat dan cari barang yang terdaftar di inventori."
      />

      <InventoryClient products={daftarBarang} />
    </div>
  );
}
