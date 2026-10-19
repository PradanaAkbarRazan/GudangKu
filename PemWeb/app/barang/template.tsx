
import type { ReactNode } from "react";
import KolomCatatan from "@/components/KolomCatatan";

export default function BarangTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-3 font-semibold text-slate-900">
          Pengujian Template
        </h2>

        <KolomCatatan label="Catatan di template" />
      </aside>

      {children}
    </div>
  );
}
