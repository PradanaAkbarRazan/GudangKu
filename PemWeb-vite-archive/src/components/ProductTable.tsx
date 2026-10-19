import type { Product } from "../data/mockData";
import StatusBadge from "./StatusBadge";

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Daftar barang dan kondisi persediaan GudangKu
        </caption>

        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-5 py-4 font-semibold">
              Nama Barang
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Kategori
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Stok
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-slate-50"
            >
              <td className="px-5 py-4 font-medium text-slate-900">
                {product.name}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {product.category}
              </td>

              <td className="px-5 py-4 text-slate-700">
                {product.stock} {product.unit}
              </td>

              <td className="px-5 py-4">
                <StatusBadge
                  stock={product.stock}
                  minimumStock={product.minimumStock}
                />
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-5 py-8 text-center text-slate-500"
              >
                Belum ada data barang.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}