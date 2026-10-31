import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";

import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import TombolHapusBarang from "@/components/TombolHapusBarang";
import { ambilBarang } from "@/lib/data";

export const metadata: Metadata = {
  title: "Detail Barang",
};

type DetailBarangProps = {
  params: Promise<{ id: string }>;
};

export default function DetailBarangPage({ params }: DetailBarangProps) {
  return (
    <Suspense fallback={<p>Memuat detail barang...</p>}>
      <KontenDetailBarang params={params} />
    </Suspense>
  );
}

async function KontenDetailBarang({ params }: DetailBarangProps) {
  await connection();

  const { id } = await params;
  const product = await ambilBarang(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Detail Barang"
        description="Informasi persediaan untuk satu barang."
      />

      <article className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-sm font-medium text-blue-700">
          {product.category}
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Stok saat ini</p>
            <p className="mt-2 text-2xl font-bold">
              {product.stock} {product.unit}
            </p>
          </section>

          <section className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Batas stok minimum
            </p>
            <p className="mt-2 text-2xl font-bold">
              {product.minimumStock} {product.unit}
            </p>
          </section>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm text-slate-500">
            Status persediaan
          </p>

          <StatusBadge
            stock={product.stock}
            minimumStock={product.minimumStock}
          />
        </div>

        <p className="mt-5 text-sm text-slate-600">
          Kode barang: {product.id}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={`/barang/${product.routeId}/edit`}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Edit Barang
          </Link>

          <TombolHapusBarang id={product.routeId} />

          <Link
            href="/barang"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Kembali ke daftar barang
          </Link>
        </div>
      </article>
    </div>
  );
}