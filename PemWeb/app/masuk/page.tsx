import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FormMasuk from "@/components/FormMasuk";

export const metadata: Metadata = {
  title: "Masuk | GudangKu",
};

export default function HalamanMasuk() {
  return (
    <div>
      <PageHeader
        title="Masuk"
        description="Masuk ke GudangKu untuk mengelola inventori."
      />

      <section className="max-w-md rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
        <FormMasuk />
      </section>
    </div>
  );
}