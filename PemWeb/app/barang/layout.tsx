
import type { ReactNode } from "react";
import KolomCatatan from "@/components/KolomCatatan";

export default function BarangLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 space-y-5">
      <aside
        aria-label="Panel pengujian layout"
        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <h2 className="mb-3 font-semibold text-slate-900">
          Pengujian Layout
        </h2>

        <KolomCatatan label="Catatan di layout" />
      </aside>

      {children}
    </section>
  );
}
