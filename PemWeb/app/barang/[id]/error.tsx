"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorBarangProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorBarang({ error, retry }: ErrorBarangProps) {
  useEffect(() => {
    console.error("Kesalahan pada halaman detail barang:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <section
        role="alert"
        className="rounded-lg border border-red-200 bg-white p-5"
      >
        <h2 className="text-lg font-semibold text-red-700">
          Barang gagal diproses
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Terjadi kesalahan saat memproses halaman barang. Silakan coba lagi.
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Kode rujukan: {error.digest ?? "Tidak tersedia"}
        </p>

        <button
          type="button"
          onClick={() => retry()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Coba lagi
        </button>
        <div className="mt-4 flex flex-wrap items-center gap-4">
  <button
    type="button"
    onClick={() => retry()}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
  >
    Coba lagi
  </button>

  <Link
    href="/barang"
    className="font-semibold text-teal-800 underline"
  >
    Kembali ke daftar barang
  </Link>
</div>
</section>
    </main>
  );
}