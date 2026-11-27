import { z } from "zod";

const skemaStok = (nama: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${nama} wajib diisi.` })
    .regex(/^-?\d+$/, {
      error: `${nama} harus berupa bilangan bulat.`,
    })
    .transform(Number)
    .pipe(
      z
        .number()
        .int({ error: `${nama} harus berupa bilangan bulat.` })
        .min(0, { error: `${nama} tidak boleh negatif.` })
        .max(100000, {
          error: `${nama} maksimal 100.000.`,
        })
    );

export const skemaBarang = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: "Nama barang minimal 3 karakter." })
    .max(80, { error: "Nama barang maksimal 80 karakter." }),

  category: z.enum(
    ["Sembako", "Makanan", "Minuman", "Bahan Kue"],
    { error: "Pilih kategori barang yang valid." }
  ),

  stock: skemaStok("Stok"),

  minimumStock: skemaStok("Stok minimum"),

  unit: z.enum(
    ["kg", "liter", "pcs", "botol"],
    { error: "Pilih satuan barang yang valid." }
  ),

  tersedia: z.stringbool().default(false),
});

export type MasukanBarang = z.infer<typeof skemaBarang>;

export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid."),
  kataSandi: z
    .string()
    .min(8, { error: "Kata sandi minimal 8 karakter." }),
});



// Skema khusus REST API Modul 8.
// Body API menggunakan JSON, bukan string dari FormData.

export const KATEGORI_API = [
  "Sembako",
  "Makanan",
  "Minuman",
  "Bahan Kue",
] as const;

export const SATUAN_API = [
  "kg",
  "liter",
  "pcs",
  "botol",
] as const;

const skemaProdukDasar = z.object({
  nama: z.string().trim().min(3).max(80),

  kategori: z.enum(KATEGORI_API, {
    error: "Kategori barang tidak dikenal.",
  }),

  stok: z.number().int().min(0).max(100000),

  stokMinimum: z.number().int().min(0).max(100000),

  satuan: z.enum(SATUAN_API, {
    error: "Satuan barang tidak dikenal.",
  }),

  tersedia: z.boolean(),
});

// POST: tersedia boleh tidak dikirim, default false
export const skemaProdukBaru = skemaProdukDasar.extend({
  tersedia: z.boolean().default(false),
});

// PATCH: semua field opsional, minimal satu harus dikirim
export const skemaProdukUbah = skemaProdukDasar
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "Kirim minimal satu field yang ingin diubah.",
  });

// GET daftar: pagination dan filter kategori
export const skemaKueriProduk = z.object({
  halaman: z.coerce.number().int().min(1).default(1),
  batas: z.coerce.number().int().min(1).max(50).default(10),
  kategori: z.enum(KATEGORI_API).optional(),
});

// ID Produk berupa CUID, bukan angka
export const skemaId = z.cuid();
