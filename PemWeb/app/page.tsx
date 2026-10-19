import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import InventoryClient from "@/components/InventoryClient";

export const metadata: Metadata = { title: "Daftar Barang" };

export default function BarangPage() {
  return (
    <div>
      <PageHeader title="Daftar Barang" description="Lihat dan cari barang yang terdaftar di inventori." />
      <InventoryClient />
    </div>
  );
}
