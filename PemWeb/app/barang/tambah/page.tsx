import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import FormBarang from "@/components/FormBarang";
import { bacaSesi } from "@/lib/sesi";
import { keluar } from "@/app/masuk/actions";

export const metadata: Metadata = {
  title: "Tambah Barang",
};

export default function TambahBarangPage() {
  return (
    <div>
      <PageHeader
        title="Tambah Barang"
        description="Tambahkan barang baru ke dalam inventori GudangKu."
      />

      <Suspense
        fallback={
          <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5">
            Memeriksa session...
          </section>
        }
      >
        <KontenTambahBarang />
      </Suspense>
    </div>
  );
}

async function KontenTambahBarang() {
  await connection();

  const sesi = await bacaSesi();

  if (!sesi) {
    redirect("/masuk");
  }

  return (
    <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Masuk sebagai <strong>{sesi.email}</strong>
        </p>

        <form action={keluar}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Keluar
          </button>
        </form>
      </div>

      <FormBarang />

      <Link
        href="/barang"
        className="mt-5 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Kembali ke daftar barang
      </Link>
    </section>
  );
}