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