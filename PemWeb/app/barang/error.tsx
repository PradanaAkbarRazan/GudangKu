"use client";

export default function BarangError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section role="alert" className="rounded-xl border border-red-200 bg-white p-5">
      <h2 className="font-semibold text-red-800">Data barang tidak dapat ditampilkan.</h2>
      <p className="mt-2 text-sm text-slate-600">Terjadi kendala saat membuka halaman barang.</p>
      {error.digest ? <p className="mt-1 text-xs text-slate-500">Kode: {error.digest}</p> : null}
      <button type="button" onClick={() => reset()} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Coba lagi
      </button>
    </section>
  );
}
