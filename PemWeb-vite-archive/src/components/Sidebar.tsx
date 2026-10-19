import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/" },
  { label: "Daftar Barang", path: "/inventory" },
  { label: "Transaksi Stok", path: "/transactions" },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          GudangKu
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Inventory Management
        </p>
      </div>

      <nav aria-label="Navigasi utama">
        <ul className="flex flex-wrap gap-2 lg:flex-col">
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}