export type Product = {
  id: string; // Kode bisnis barang, misalnya PRD001
  routeId: string; // ID numerik yang digunakan pada URL /barang/[id]
  name: string;
  category: string;
  stock: number;
  minimumStock: number;
  unit: string;
  tersedia?: boolean;
};

export type StockTransaction = {
  id: string;
  productName: string;
  type: "IN" | "OUT";
  quantity: number;
  date: string;
  note: string;
};

export const mockProducts: Product[] = [
  { id: "PRD001", routeId: "1", name: "Beras Premium", category: "Sembako", stock: 45, minimumStock: 20, unit: "kg" },
  { id: "PRD002", routeId: "2", name: "Minyak Goreng", category: "Sembako", stock: 12, minimumStock: 15, unit: "liter" },
  { id: "PRD003", routeId: "3", name: "Indomie Goreng", category: "Makanan", stock: 120, minimumStock: 30, unit: "pcs" },
  { id: "PRD004", routeId: "4", name: "Gula Pasir", category: "Sembako", stock: 8, minimumStock: 10, unit: "kg" },
  { id: "PRD005", routeId: "5", name: "Air Mineral", category: "Minuman", stock: 80, minimumStock: 20, unit: "botol" },
  { id: "PRD006", routeId: "6", name: "Tepung Terigu", category: "Bahan Kue", stock: 25, minimumStock: 10, unit: "kg" },
];

export const mockTransactions: StockTransaction[] = [
  { id: "TRX001", productName: "Beras Premium", type: "IN", quantity: 20, date: "2026-10-13", note: "Restock barang" },
  { id: "TRX002", productName: "Indomie Goreng", type: "OUT", quantity: 15, date: "2026-10-13", note: "Pengeluaran barang" },
  { id: "TRX003", productName: "Minyak Goreng", type: "OUT", quantity: 8, date: "2026-10-12", note: "Pengeluaran barang" },
  { id: "TRX004", productName: "Air Mineral", type: "IN", quantity: 30, date: "2026-10-12", note: "Restock barang" },
  { id: "TRX005", productName: "Gula Pasir", type: "OUT", quantity: 5, date: "2026-10-11", note: "Pengeluaran barang" },
];
