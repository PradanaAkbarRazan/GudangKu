import Link from "next/link";

export default function NotFound() {
  return (
    <main className="rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm text-slate-600">URL yang kamu buka tidak cocok dengan rute GudangKu.</p>
      <Link href="/" className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
        Kembali ke dashboard
      </Link>
    </main>
  );
}
