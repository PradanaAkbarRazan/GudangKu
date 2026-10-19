import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductTable from "../components/ProductTable";
import { mockProducts } from "../data/mockData";

export default function Inventory() {
  const [search, setSearch] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Daftar Barang"
        description="Lihat dan cari barang yang terdaftar di inventori."
      />

      <section
        aria-labelledby="inventory-heading"
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <h3
          id="inventory-heading"
          className="mb-4 text-lg font-semibold text-slate-900"
        >
          Semua Barang
        </h3>

        <div className="mb-5 max-w-md">
          <label
            htmlFor="inventory-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Cari barang
          </label>

          <input
            id="inventory-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nama atau kategori barang"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          />
        </div>

        <ProductTable products={filteredProducts} />

        <p className="mt-4 text-sm text-slate-500">
          Menampilkan {filteredProducts.length} dari {mockProducts.length} barang.
        </p>
      </section>
    </div>
  );
}