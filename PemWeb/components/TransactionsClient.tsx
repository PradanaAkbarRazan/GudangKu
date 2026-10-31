"use client";

import { useActionState, useState } from "react";

import {
  simpanRiwayatStok,
  ubahRiwayatStok,
  hapusRiwayatStok,
} from "@/app/transaksi/actions";

type Produk = {
  id: string;
  kodeRute: string;
  nama: string;
  stok: number;
  satuan: string;
  tersedia: boolean;
};

type Riwayat = {
  id: string;
  produkId: string;
  namaProduk: string;
  kodeRute: string;
  jenis: "MASUK" | "KELUAR";
  jumlah: number;
  catatan: string;
  dibuatPada: string;
};

type Props = {
  produk: Produk[];
  riwayat: Riwayat[];
};

const kolom =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

function BarisRiwayat({
  item,
  produk,
}: {
  item: Riwayat;
  produk: Produk[];
}) {
  const [sedangEdit, setSedangEdit] = useState(false);

  const aksiUbahTerikat = ubahRiwayatStok.bind(null, item.id);
  const [statusUbah, aksiUbah, pendingUbah] = useActionState(
    aksiUbahTerikat,
    {}
  );

  const aksiHapusTerikat = hapusRiwayatStok.bind(null, item.id);
  const [statusHapus, aksiHapus, pendingHapus] = useActionState(
    aksiHapusTerikat,
    {}
  );

  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="whitespace-nowrap px-4 py-3">
          {new Date(item.dibuatPada).toLocaleString("id-ID")}
        </td>

        <td className="px-4 py-3">
          <p className="font-medium">{item.namaProduk}</p>
          <p className="text-xs text-slate-500">{item.kodeRute}</p>
        </td>

        <td className="px-4 py-3">
          {item.jenis === "MASUK" ? (
            <span className="font-medium text-emerald-700">
              Barang Masuk
            </span>
          ) : (
            <span className="font-medium text-red-700">
              Barang Keluar
            </span>
          )}
        </td>

        <td className="px-4 py-3">{item.jumlah}</td>

        <td className="px-4 py-3">
          {item.catatan || "-"}
        </td>

        <td className="whitespace-nowrap px-4 py-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSedangEdit(!sedangEdit)}
              className="font-medium text-blue-700 hover:underline"
            >
              {sedangEdit ? "Tutup" : "Edit"}
            </button>

            <form action={aksiHapus}>
              <button
                type="submit"
                disabled={pendingHapus}
                className="font-medium text-red-700 hover:underline disabled:opacity-50"
              >
                {pendingHapus ? "Menghapus..." : "Hapus"}
              </button>
            </form>
          </div>

          {statusHapus.pesan && (
            <p role="status" className="mt-2 text-xs text-red-700">
              {statusHapus.pesan}
            </p>
          )}
        </td>
      </tr>

      {sedangEdit && (
        <tr className="border-t border-slate-100 bg-slate-50">
          <td colSpan={6} className="p-4">
            <form
              key={`${item.produkId}-${item.jenis}-${item.jumlah}`}
              action={aksiUbah}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label
                  htmlFor={`produk-${item.id}`}
                  className="mb-1 block text-sm font-medium"
                >
                  Nama Barang
                </label>

                <select
                  id={`produk-${item.id}`}
                  name="produkId"
                  required
                  defaultValue={statusUbah.nilai?.produkId ?? item.produkId}
                  className={kolom}
                >
                  <option value="">Pilih barang</option>

                  {produk.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} — stok {p.stok} {p.satuan}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-xs text-red-700">
                  {statusUbah.galat?.produkId?.[0]}
                </p>
              </div>

              <div>
                <label
                  htmlFor={`jenis-${item.id}`}
                  className="mb-1 block text-sm font-medium"
                >
                  Jenis Transaksi
                </label>

                <select
                  id={`jenis-${item.id}`}
                  name="jenis"
                  required
                  defaultValue={statusUbah.nilai?.jenis ?? item.jenis}
                  className={kolom}
                >
                  <option value="MASUK">Barang Masuk</option>
                  <option value="KELUAR">Barang Keluar</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={`jumlah-${item.id}`}
                  className="mb-1 block text-sm font-medium"
                >
                  Jumlah
                </label>

                <input
                  id={`jumlah-${item.id}`}
                  name="jumlah"
                  type="number"
                  required
                  min={1}
                  max={100000}
                  step={1}
                  defaultValue={
                    statusUbah.nilai?.jumlah ?? String(item.jumlah)
                  }
                  className={kolom}
                />

                <p className="mt-1 text-xs text-red-700">
                  {statusUbah.galat?.jumlah?.[0]}
                </p>
              </div>

              <div>
                <label
                  htmlFor={`catatan-${item.id}`}
                  className="mb-1 block text-sm font-medium"
                >
                  Keterangan
                </label>

                <input
                  id={`catatan-${item.id}`}
                  name="catatan"
                  type="text"
                  maxLength={500}
                  defaultValue={
                    statusUbah.nilai?.catatan ?? item.catatan
                  }
                  className={kolom}
                />

                <p className="mt-1 text-xs text-red-700">
                  {statusUbah.galat?.catatan?.[0]}
                </p>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={pendingUbah}
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {pendingUbah ? "Menyimpan..." : "Simpan Perubahan"}
                </button>

                <p
                  role="status"
                  aria-live="polite"
                  className="mt-2 text-sm text-slate-700"
                >
                  {statusUbah.pesan}
                </p>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

export default function TransactionsClient({
  produk,
  riwayat,
}: Props) {
  const produkAktif = produk.filter((item) => item.tersedia);

  const [statusTambah, aksiTambah, pendingTambah] = useActionState(
    simpanRiwayatStok,
    {}
  );

  return (
    <div>
      {/* Form Create */}
      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          Tambah Transaksi
        </h2>

        <form action={aksiTambah} className="space-y-5">
          <div>
            <label
              htmlFor="produkId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nama Barang
            </label>

            <select
              id="produkId"
              name="produkId"
              required
              defaultValue={statusTambah.nilai?.produkId ?? ""}
              className={kolom}
            >
              <option value="">Pilih barang</option>

              {produkAktif.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} — stok {item.stok} {item.satuan}
                </option>
              ))}
            </select>

            <p className="mt-1 text-sm text-red-700">
              {statusTambah.galat?.produkId?.[0]}
            </p>
          </div>

          <div>
            <label
              htmlFor="jenis"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Jenis Transaksi
            </label>

            <select
              id="jenis"
              name="jenis"
              required
              defaultValue={statusTambah.nilai?.jenis ?? "MASUK"}
              className={kolom}
            >
              <option value="MASUK">Barang Masuk</option>
              <option value="KELUAR">Barang Keluar</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="jumlah"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Jumlah
            </label>

            <input
              id="jumlah"
              name="jumlah"
              type="number"
              min={1}
              max={100000}
              step={1}
              required
              defaultValue={statusTambah.nilai?.jumlah ?? "1"}
              className={kolom}
            />

            <p className="mt-1 text-sm text-red-700">
              {statusTambah.galat?.jumlah?.[0]}
            </p>
          </div>

          <div>
            <label
              htmlFor="catatan"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Keterangan
            </label>

            <input
              id="catatan"
              name="catatan"
              type="text"
              maxLength={500}
              defaultValue={statusTambah.nilai?.catatan ?? ""}
              placeholder="Contoh: Restock dari pemasok"
              className={kolom}
            />
          </div>

          {statusTambah.pesan && (
            <p
              role="status"
              aria-live="polite"
              className="text-sm text-slate-700"
            >
              {statusTambah.pesan}
            </p>
          )}

          <button
            type="submit"
            disabled={pendingTambah || produkAktif.length === 0}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
          >
            {pendingTambah ? "Menyimpan..." : "Simpan Transaksi"}
          </button>

          {produkAktif.length === 0 && (
            <p className="text-sm text-red-700">
              Belum ada barang yang tersedia untuk transaksi.
            </p>
          )}
        </form>
      </section>

      {/* Tabel Read */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Riwayat Transaksi
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[850px] text-left text-sm">
            <caption className="sr-only">
              Riwayat transaksi barang masuk dan keluar
            </caption>

            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">Tanggal</th>
                <th scope="col" className="px-4 py-3">Barang</th>
                <th scope="col" className="px-4 py-3">Jenis</th>
                <th scope="col" className="px-4 py-3">Jumlah</th>
                <th scope="col" className="px-4 py-3">Keterangan</th>
                <th scope="col" className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {riwayat.length > 0 ? (
                riwayat.map((item) => (
                  <BarisRiwayat
                    key={item.id}
                    item={item}
                    produk={produk}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Data transaksi tersimpan secara permanen di PostgreSQL melalui Prisma.
        </p>
      </section>
    </div>
  );
}