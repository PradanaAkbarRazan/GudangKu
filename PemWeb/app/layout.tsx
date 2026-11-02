
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GudangKu | Manajemen Inventori",
    template: "%s | GudangKu",
  },
  description:
    "Aplikasi pengelolaan persediaan barang untuk toko kecil dan UMKM.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4 focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>

        <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
          <Suspense
            fallback={
              <aside
                className="w-full shrink-0 border-b border-slate-200 bg-white p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"
                aria-label="Navigasi"
              >
                <p role="status" className="text-sm text-slate-500">
                  Memuat navigasi...
                </p>
              </aside>
            }
          >
            <Sidebar />
          </Suspense>

          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
          >
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
