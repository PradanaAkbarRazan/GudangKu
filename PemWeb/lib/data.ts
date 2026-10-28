import "server-only";

import { mockProducts } from "./mockData";
import type { Product } from "./mockData";
import type { MasukanBarang } from "./skema";

export const daftarBarang = mockProducts;

// Memeriksa apakah nama barang sudah digunakan
export function namaBarangSudahAda(name: string): boolean {
  const namaDicari = name.trim().toLowerCase();

  return daftarBarang.some(
    (barang) =>
      barang.name.trim().toLowerCase() === namaDicari
  );
}

// Menambahkan barang baru ke data inventori
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