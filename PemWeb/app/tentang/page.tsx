import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Tentang" };

export default function TentangPage() {
  return (
    <div>
      <PageHeader title="Tentang GudangKu" description="Inventory Management & Stock Prediction untuk toko kecil dan UMKM." />
      <section className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 leading-7 shadow-sm sm:p-7">
        <p>GudangKu membantu pemilik toko kecil, UMKM, dan petugas inventori memantau persediaan, melihat kondisi stok, serta mencatat barang masuk dan barang keluar.</p>
        <h2 className="mt-6 text-lg font-semibold">Fitur utama</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Dashboard ringkasan kondisi inventori.</li>
          <li>Daftar barang dengan pencarian dan status stok.</li>
          <li>Detail setiap barang berdasarkan ID.</li>
          <li>Form transaksi barang masuk dan keluar.</li>
          <li>Rencana pengembangan prediksi stok pada milestone berikutnya.</li>
        </ul>
        <p className="mt-6 text-sm text-slate-500">Versi ini masih menggunakan mock data; belum menggunakan backend atau database permanen.</p>
      </section>
    </div>
  );
}
