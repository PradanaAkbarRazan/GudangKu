import { useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import { mockProducts, mockTransactions } from "../data/mockData";
import type { StockTransaction } from "../data/mockData";

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<StockTransaction[]>(mockTransactions);

  const [productId, setProductId] = useState(mockProducts[0]?.id ?? "");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const selectedProduct = mockProducts.find(
      (product) => product.id === productId
    );
    const amount = Number(quantity);

    if (!selectedProduct) {
      setError("Silakan pilih barang terlebih dahulu.");
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Jumlah harus berupa bilangan bulat lebih dari 0.");
      return;
    }

    if (type === "OUT" && amount > selectedProduct.stock) {
      setError(
        `Stok ${selectedProduct.name} hanya ${selectedProduct.stock} ${selectedProduct.unit}.`
      );
      return;
    }

    const newTransaction: StockTransaction = {
      id: `TRX${Date.now()}`,
      productName: selectedProduct.name,
      type,
      quantity: amount,
      date: new Date().toISOString().slice(0, 10),
      note: note.trim() || "Tidak ada keterangan",
    };

    setTransactions((previous) => [newTransaction, ...previous]);
    setQuantity("1");
    setNote("");
    setSuccess(
      "Transaksi berhasil ditambahkan ke prototype. Data belum tersimpan permanen."
    );
  }

  return (
    <div>
      <PageHeader
        title="Transaksi Stok"
        description="Catat barang masuk dan barang keluar."
      />

      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-lg font-semibold text-slate-900">
          Tambah Transaksi
        </h3>

        <form
  onSubmit={handleSubmit}
  className="space-y-5"
  noValidate
>
          <div>
            <label
              htmlFor="product"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nama Barang
            </label>

            <select
              id="product"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <option value="">Pilih barang</option>
              {mockProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — stok {product.stock} {product.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="transaction-type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Jenis Transaksi
            </label>

            <select
              id="transaction-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as "IN" | "OUT")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <option value="IN">Barang Masuk</option>
              <option value="OUT">Barang Keluar</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Jumlah
            </label>

            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Keterangan
            </label>

            <input
              id="note"
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: Restock dari pemasok"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            Simpan Transaksi
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Riwayat Transaksi
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <caption className="sr-only">
              Riwayat transaksi barang masuk dan keluar
            </caption>

            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">Tanggal</th>
                <th scope="col" className="px-4 py-3">Barang</th>
                <th scope="col" className="px-4 py-3">Jenis</th>
                <th scope="col" className="px-4 py-3">Jumlah</th>
                <th scope="col" className="px-4 py-3">Keterangan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="whitespace-nowrap px-4 py-3">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {transaction.productName}
                  </td>
                  <td className="px-4 py-3">
                    {transaction.type === "IN" ? "Barang Masuk" : "Barang Keluar"}
                  </td>
                  <td className="px-4 py-3">
                    {transaction.quantity}
                  </td>
                  <td className="px-4 py-3">
                    {transaction.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Data transaksi baru hanya tersimpan sementara di halaman ini dan akan kembali ke mock data awal jika halaman dimuat ulang.
        </p>
      </section>
    </div>
  );
}