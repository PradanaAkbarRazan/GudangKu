
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { skemaBarang } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

export async function simpanBarang(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Memastikan pengguna sudah login.
  if (!(await bacaSesi())) {
    return {
      pesan: "Silakan masuk terlebih dahulu.",
    };
  }

  const mentah = Object.fromEntries(formData);

  // Menyimpan kembali nilai input jika validasi gagal.
  const nilai = {
    name: String(mentah.name ?? ""),
    category: String(mentah.category ?? ""),
    stock: String(mentah.stock ?? ""),
    minimumStock: String(mentah.minimumStock ?? ""),
    unit: String(mentah.unit ?? ""),
    tersedia: mentah.tersedia ? "on" : "",
  };

  // 2. Validasi data menggunakan Zod.
  const hasil = skemaBarang.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  try {
    // 3. Memeriksa apakah nama produk sudah digunakan.
    const namaSudahAda = await prisma.produk.findFirst({
      where: {
        nama: {
          equals: hasil.data.name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (namaSudahAda) {
      return {
        galat: {
          name: ["Nama barang sudah terdaftar."],
        },
        pesan: "Gunakan nama barang yang berbeda.",
        nilai,
      };
    }

    // 4. Membuat kode produk berikutnya.
    const daftarKode = await prisma.produk.findMany({
      select: {
        kodeRute: true,
      },
    });

    const nomorBerikutnya =
      daftarKode.reduce((maksimum, produk) => {
        const cocok = /^PRD(\d+)$/.exec(produk.kodeRute);

        return cocok
          ? Math.max(maksimum, Number(cocok[1]))
          : maksimum;
      }, 0) + 1;

    const kodeRute = `PRD${String(nomorBerikutnya).padStart(3, "0")}`;

    // 5. Menyimpan produk melalui Prisma ke PostgreSQL.
    const produk = await prisma.produk.create({
      data: {
        kodeRute,
        nama: hasil.data.name,
        kategori: hasil.data.category,
        stok: hasil.data.stock,
        stokMinimum: hasil.data.minimumStock,
        satuan: hasil.data.unit,
        tersedia: hasil.data.tersedia,
      },
    });

    // 6. Memperbarui halaman daftar barang dan dashboard.
    revalidatePath("/barang");
    revalidatePath("/");

    // 7. Membuka halaman detail produk yang baru dibuat.
    redirect(`/barang/${produk.id}`);
  } catch (error) {
    // Redirect Next.js harus diteruskan, bukan dianggap sebagai kegagalan.
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }

    // Menangani pelanggaran constraint unik PostgreSQL.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        galat: {
          name: ["Nama atau kode barang sudah terdaftar."],
        },
        pesan: "Data barang sudah tersedia.",
        nilai,
      };
    }

    console.error("simpanBarang gagal:", error);

    return {
      pesan: "Barang gagal disimpan. Coba lagi.",
      nilai,
    };
  }
}


export async function ubahBarang(
  id: string,
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Memastikan pengguna sudah login.
  if (!(await bacaSesi())) {
    return {
      pesan: "Silakan masuk terlebih dahulu.",
    };
  }

  const mentah = Object.fromEntries(formData);

  // 2. Menyimpan nilai input untuk ditampilkan kembali jika validasi gagal.
  const nilai = {
    name: String(mentah.name ?? ""),
    category: String(mentah.category ?? ""),
    stock: String(mentah.stock ?? ""),
    minimumStock: String(mentah.minimumStock ?? ""),
    unit: String(mentah.unit ?? ""),
    tersedia: mentah.tersedia ? "on" : "",
  };

  // 3. Validasi menggunakan Zod.
  const hasil = skemaBarang.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  try {
    // 4. Memperbarui produk melalui Prisma.
    await prisma.produk.update({
      where: {
        id,
      },
      data: {
        nama: hasil.data.name,
        kategori: hasil.data.category,
        stok: hasil.data.stock,
        stokMinimum: hasil.data.minimumStock,
        satuan: hasil.data.unit,
        tersedia: hasil.data.tersedia,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Nama atau kode produk sudah digunakan.
      if (error.code === "P2002") {
        return {
          galat: {
            name: ["Nama barang sudah digunakan."],
          },
          pesan: "Gunakan nama barang yang berbeda.",
          nilai,
        };
      }

      // Produk tidak ditemukan atau sudah dihapus.
      if (error.code === "P2025") {
        return {
          pesan: "Barang tidak ditemukan atau sudah dihapus.",
          nilai,
        };
      }
    }

    console.error("ubahBarang gagal:", error);

    return {
      pesan: "Barang gagal diperbarui. Coba lagi.",
      nilai,
    };
  }

  // 5. Memperbarui halaman yang menggunakan data produk.
  revalidatePath("/");
  revalidatePath("/barang");
  revalidatePath(`/barang/${id}`);

  return {
    pesan: "Perubahan barang berhasil disimpan.",
  };
}

export async function hapusBarang(
  id: string,
  _sebelumnya: StatusForm,
  _formData: FormData
): Promise<StatusForm> {
    void _sebelumnya;
  void _formData;
  // 1. Memastikan pengguna sudah login.
  if (!(await bacaSesi())) {
    return {
      pesan: "Silakan masuk terlebih dahulu.",
    };
  }

  try {
    // 2. Menghapus produk melalui Prisma.
    await prisma.produk.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Produk masih memiliki riwayat stok.
      if (error.code === "P2003") {
        return {
          pesan:
            "Barang tidak dapat dihapus karena masih memiliki riwayat stok.",
        };
      }

      // Produk sudah tidak ditemukan.
      if (error.code === "P2025") {
        return {
          pesan: "Barang tidak ditemukan atau sudah dihapus.",
        };
      }
    }

    console.error("hapusBarang gagal:", error);

    return {
      pesan: "Barang gagal dihapus. Silakan coba lagi.",
    };
  }

  // 3. Memperbarui halaman yang menampilkan data produk.
  revalidatePath("/");
  revalidatePath("/barang");
  revalidatePath("/transaksi");

  // 4. Kembali ke daftar barang.
  redirect("/barang");
}