
"use client";

import { useId, useState } from "react";

export default function KolomCatatan({
  label,
}: {
  label: string;
}) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        value={catatan}
        onChange={(event) => setCatatan(event.target.value)}
        placeholder="Ketik catatan untuk pengujian..."
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
