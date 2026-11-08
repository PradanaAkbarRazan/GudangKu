
import Link from "next/link";

export default function AksesDitolakPage() {
  return (
    <main className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-red-700">
        Akses Ditolak
      </h1>

      <p className="mt-3 text-slate-600">
        Kamu tidak memiliki izin untuk melakukan tindakan
        atau mengakses halaman ini.
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white"
      >
        Kembali ke Dashboard
      </Link>
    </main>
  );
}
