"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", path: "/" },
  { label: "Daftar Barang", path: "/barang" },
  { label: "Transaksi Stok", path: "/transaksi" },
  { label: "Tentang", path: "/tentang" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-5">
        <Link href="/" className="text-2xl font-bold text-slate-900">GudangKu</Link>
        <p className="mt-1 text-sm text-slate-500">Inventory Management</p>
      </div>
      <nav aria-label="Navigasi utama">
        <ul className="flex flex-wrap gap-2 lg:flex-col">
          {navigation.map((item) => {
            const active = item.path === "/" ? pathname === "/" : pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
