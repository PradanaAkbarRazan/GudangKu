import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { daftarBarang } from "@/lib/data";

export const metadata: Metadata = { title: "Detail Barang" };

export function generateStaticParams() {
  return daftarBarang.map((product) => ({ id: product.routeId }));
}

export default async function DetailBarangPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // URL hanya menerima bilangan bulat positif tanpa nol di depan.
  if (!/^[1-9]\d*$/.test(id)) notFound();

 const product = daftarBarang.find((item) => item.routeId === id);
  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Detail Barang" description="Informasi persediaan untuk satu barang." />
      <article className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-sm font-medium text-blue-700">{product.category}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{product.name}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Stok saat ini</p>
            <p className="mt-2 text-2xl font-bold">{product.stock} {product.unit}</p>
          </section>
          <section className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Batas stok minimum</p>
            <p className="mt-2 text-2xl font-bold">{product.minimumStock} {product.unit}</p>
          </section>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-sm text-slate-500">Status persediaan</p>
          <StatusBadge stock={product.stock} minimumStock={product.minimumStock} />
        </div>
        <p className="mt-5 text-sm text-slate-600">Kode barang: {product.id}</p>
        <Link href="/barang" className="mt-7 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Kembali ke daftar barang
        </Link>
      </article>
    </div>
  );
}
