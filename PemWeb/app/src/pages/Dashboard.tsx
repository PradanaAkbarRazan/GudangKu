import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import ProductTable from "../components/ProductTable";
import { mockProducts, mockTransactions } from "../data/mockData";

export default function Dashboard() {
  const lowStockProducts = mockProducts.filter(
    (product) => product.stock <= product.minimumStock
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan kondisi inventori GudangKu."
      />

      <section
        aria-label="Ringkasan inventori"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <StatCard
          title="Jenis Barang"
          value={mockProducts.length}
          description="Barang yang terdaftar"
        />

        <StatCard
          title="Stok Menipis"
          value={lowStockProducts.length}
          description="Barang mencapai batas stok minimum"
        />

        <StatCard
          title="Riwayat Transaksi"
          value={mockTransactions.length}
          description="Transaksi contoh yang tercatat"
        />
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Barang yang Perlu Diperhatikan
        </h3>

        <ProductTable products={lowStockProducts} />
      </section>

      <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-950">
          Prediksi Stok
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-900">
          GudangKu dirancang untuk memprediksi barang yang berpotensi
          habis berdasarkan riwayat transaksi. Pada versi ini,
          fitur prediksi masih berupa rancangan dan belum dihitung
          dari data historis.
        </p>
      </section>
    </div>
  );
}