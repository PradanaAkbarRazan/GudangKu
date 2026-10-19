import Link from "next/link";

export default function BarangTidakDitemukan() {
  return (
    <main className="rounded-xl border border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-semibold text-blue-700">GudangKu</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Barang tidak ditemukan</h1>
      <p className="mt-3 text-sm text-slate-600">ID barang tidak valid atau barang tidak tersedia dalam data saat ini.</p>
      <Link href="/barang" className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Kembali ke daftar barang
      </Link>
    </main>
  );
}
