import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ambilBarang } from "@/lib/data";
import FormEditBarang from "@/components/FormEditBarang";

type Props = {
  params: Promise<{ id: string }>;
};

async function KontenEdit({ id }: { id: string }) {
  await connection();

  const barang = await ambilBarang(id);

  if (!barang) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <Link
          href={`/barang/${id}`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Kembali ke detail barang
        </Link>

        <h1 className="mt-4 text-2xl font-bold">Edit Barang</h1>
        <p className="mt-1 text-slate-600">
          Perbarui informasi barang {barang.name}.
        </p>
      </div>

      <FormEditBarang barang={barang} />
    </main>
  );
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<p className="p-6">Memuat data barang...</p>}>
      <KontenEdit id={id} />
    </Suspense>
  );
}