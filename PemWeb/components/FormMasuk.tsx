"use client";

import { useActionState } from "react";

import { masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};

const kolom =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2";

export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const g = status.galat;

  return (
    <form action={aksi} className="mt-6 space-y-5">
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={kolom}
          aria-invalid={!!g?.email}
          aria-describedby="galat-email"
        />

        <p id="galat-email" className="mt-1 text-sm text-red-700">
          {g?.email?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kataSandi" className="block font-medium">
          Kata Sandi
        </label>

        <input
          id="kataSandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className={kolom}
          aria-invalid={!!g?.kataSandi}
          aria-describedby="galat-kataSandi"
        />

        <p
          id="galat-kataSandi"
          className="mt-1 text-sm text-red-700"
        >
          {g?.kataSandi?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>

      <p role="status" aria-live="polite" className="text-sm text-red-700">
        {status.pesan}
      </p>
    </form>
  );
}