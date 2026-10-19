import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TransactionsClient from "@/components/TransactionsClient";

export const metadata: Metadata = { title: "Transaksi Stok" };

export default function TransaksiPage() {
  return (
    <div>
      <PageHeader title="Transaksi Stok" description="Catat barang masuk dan barang keluar." />
      <TransactionsClient />
    </div>
  );
}
