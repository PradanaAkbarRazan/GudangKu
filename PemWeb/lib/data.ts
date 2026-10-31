
import "server-only";

import { prisma } from "./prisma";
import { mockProducts } from "./mockData";
import type { Product } from "./mockData";
import type { MasukanBarang } from "./skema";

// Mengubah format data Prisma menjadi format yang digunakan UI GudangKu.
type DataProduk = {
  id: string;
  kodeRute: string;
  nama: string;
  kategori: string;
  stok: number;
  stokMinimum: number;
  satuan: string;
  tersedia: boolean;
};

function ubahKeProduct(data: DataProduk): Product {
  return {
    id: data.kodeRute,
    routeId: data.id,
    name: data.nama,
    category: data.kategori,
    stock: data.stok,
    minimumStock: data.stokMinimum,
    unit: data.satuan,
    tersedia: data.tersedia,
  };
}

// Membaca seluruh produk dari PostgreSQL.
export async function ambilDaftarBarang(): Promise<Product[]> {
  const produk = await prisma.produk.findMany({
    orderBy: {
      dibuatPada: "desc",
    },
  });

  return produk.map(ubahKeProduct);
}

// Membaca satu produk berdasarkan ID database.
export async function ambilBarang(
  routeId: string
): Promise<Product | null> {
  const produk = await prisma.produk.findUnique({
    where: {
      id: routeId,
    },
  });

  return produk ? ubahKeProduct(produk) : null;
}

// Fungsi lama sementara, akan dihapus setelah Server Action dimigrasikan.
export const daftarBarang = mockProducts;

export function namaBarangSudahAda(name: string): boolean {
  const namaDicari = name.trim().toLowerCase();

  return daftarBarang.some(
    (barang) => barang.name.trim().toLowerCase() === namaDicari
  );
}

export function tambahBarang(masukan: MasukanBarang): Product {
  const nomorRoute =
    Math.max(
      0,
      ...daftarBarang.map((barang) => Number(barang.routeId) || 0)
    ) + 1;

  const nomorKode =
    Math.max(
      0,
      ...daftarBarang.map(
        (barang) => Number(barang.id.replace(/^PRD/, "")) || 0
      )
    ) + 1;

  const barangBaru: Product = {
    ...masukan,
    id: `PRD${String(nomorKode).padStart(3, "0")}`,
    routeId: String(nomorRoute),
  };

  daftarBarang.push(barangBaru);

  return barangBaru;
}
