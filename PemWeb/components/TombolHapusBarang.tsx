"use client";

import { useActionState } from "react";
import { hapusBarang } from "@/app/barang/actions";
import type { StatusForm } from "@/lib/status-form";

type Props = {
  id: string;
};

const awal: StatusForm = {};

export default function TombolHapusBarang({ id }: Props) {
  const aksiHapusTerikat = hapusBarang.bind(null, id);

  const [status, aksi, pending] = useActionState(
    aksiHapusTerikat,
    awal
  );

  return (
    <div>
      <form
        action={aksi}
        onSubmit={(event) => {
          const yakin = window.confirm(
            "Apakah kamu yakin ingin menghapus barang ini?"
          );

          if (!yakin) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? "Menghapus..." : "Hapus Barang"}
        </button>
      </form>

      {status.pesan && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-3 text-sm text-red-700"
        >
          {status.pesan}
        </p>
      )}
    </div>
  );
}