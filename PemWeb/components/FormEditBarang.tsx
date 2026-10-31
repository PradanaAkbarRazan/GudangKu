"use client";

import { useActionState } from "react";
import { ubahBarang } from "@/app/barang/actions";
import type { StatusForm } from "@/lib/status-form";
import type { Product } from "@/lib/mockData";

type Props = {
  barang: Product;
};

const awal: StatusForm = {};

const kolom =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2";

export default function FormEditBarang({ barang }: Props) {
  const aksiUbah = ubahBarang.bind(null, barang.routeId);
  const [status, aksi, pending] = useActionState(aksiUbah, awal);

  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="space-y-5">
      <div>
        <label htmlFor="name" className="block font-medium">
          Nama Barang
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={80}
          defaultValue={n?.name ?? barang.name}
          className={kolom}
          aria-invalid={!!g?.name}
          aria-describedby="galat-name"
        />
        <p id="galat-name" className="mt-1 text-sm text-red-700">
          {g?.name?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block font-medium">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          required
          key={n?.category ?? barang.category}
          defaultValue={n?.category ?? barang.category}
          className={kolom}
          aria-invalid={!!g?.category}
          aria-describedby="galat-category"
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          <option value="Sembako">Sembako</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Bahan Kue">Bahan Kue</option>
        </select>
        <p id="galat-category" className="mt-1 text-sm text-red-700">
          {g?.category?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="stock" className="block font-medium">
          Stok
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          required
          min={0}
          max={100000}
          step={1}
          defaultValue={n?.stock ?? barang.stock}
          className={kolom}
          aria-invalid={!!g?.stock}
          aria-describedby="galat-stock"
        />
        <p id="galat-stock" className="mt-1 text-sm text-red-700">
          {g?.stock?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="minimumStock" className="block font-medium">
          Stok Minimum
        </label>
        <input
          id="minimumStock"
          name="minimumStock"
          type="number"
          required
          min={0}
          max={100000}
          step={1}
          defaultValue={n?.minimumStock ?? barang.minimumStock}
          className={kolom}
          aria-invalid={!!g?.minimumStock}
          aria-describedby="galat-minimumStock"
        />
        <p id="galat-minimumStock" className="mt-1 text-sm text-red-700">
          {g?.minimumStock?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="unit" className="block font-medium">
          Satuan
        </label>
        <select
          id="unit"
          name="unit"
          required
          key={n?.unit ?? barang.unit}
          defaultValue={n?.unit ?? barang.unit}
          className={kolom}
          aria-invalid={!!g?.unit}
          aria-describedby="galat-unit"
        >
          <option value="" disabled>
            Pilih satuan
          </option>
          <option value="kg">Kilogram (kg)</option>
          <option value="liter">Liter</option>
          <option value="pcs">Pcs</option>
          <option value="botol">Botol</option>
        </select>
        <p id="galat-unit" className="mt-1 text-sm text-red-700">
          {g?.unit?.[0]}
        </p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="tersedia"
          defaultChecked={
            n ? n.tersedia === "on" : barang.tersedia === true
          }
          className="h-4 w-4"
        />
        Barang tersedia
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Perbarui Barang"}
      </button>

      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {status.pesan}
      </p>
    </form>
  );
}