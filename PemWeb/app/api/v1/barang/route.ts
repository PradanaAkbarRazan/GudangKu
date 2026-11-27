
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import {
  bacaJson,
  galatValidasi,
  problem,
} from "@/lib/api/problem";
import {
  skemaProdukBaru,
  skemaKueriProduk,
} from "@/lib/skema";

// GET /api/v1/barang
// Mengambil daftar produk dengan pagination dan filter kategori.
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const hasilKueri = skemaKueriProduk.safeParse(
      Object.fromEntries(url.searchParams)
    );

    if (!hasilKueri.success) {
      return problem(400, "Bad Request", {
        detail: "Parameter kueri tidak valid.",
        errors: z.flattenError(hasilKueri.error).fieldErrors,
      });
    }

    const { halaman, batas, kategori } = hasilKueri.data;

    const where = kategori ? { kategori } : {};

    const [data, total] = await prisma.$transaction([
      prisma.produk.findMany({
        where,
        orderBy: { nama: "asc" },
        skip: (halaman - 1) * batas,
        take: batas,
      }),
      prisma.produk.count({ where }),
    ]);

    return Response.json({
      data,
      meta: {
        halaman,
        batas,
        total,
        totalHalaman: Math.ceil(total / batas),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/barang gagal:", error);

    return problem(500, "Internal Server Error", {
      detail: "Gagal mengambil daftar barang.",
    });
  }
}

// POST /api/v1/barang
// Menambahkan produk baru dengan kodeRute otomatis.
export async function POST(request: Request) {
  const body = await bacaJson(request);

  if (!body.ok) {
    return body.res;
  }

  const hasil = skemaProdukBaru.safeParse(body.data);

  if (!hasil.success) {
    return galatValidasi(hasil.error);
  }

  try {
    // Periksa nama barang agar tidak duplikat.
    const namaSudahAda = await prisma.produk.findFirst({
      where: {
        nama: {
          equals: hasil.data.nama,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (namaSudahAda) {
      return problem(409, "Conflict", {
        detail: "Nama barang sudah terdaftar.",
      });
    }

    // Buat kode produk berikutnya, misalnya PRD006.
    const daftarKode = await prisma.produk.findMany({
      select: { kodeRute: true },
    });

    const nomorBerikutnya =
      daftarKode.reduce((maksimum, produk) => {
        const cocok = /^PRD(\d+)$/.exec(produk.kodeRute);

        return cocok
          ? Math.max(maksimum, Number(cocok[1]))
          : maksimum;
      }, 0) + 1;

    const kodeRute = `PRD${String(nomorBerikutnya).padStart(3, "0")}`;

    const produk = await prisma.produk.create({
      data: {
        kodeRute,
        ...hasil.data,
      },
    });

    return Response.json(produk, {
      status: 201,
      headers: {
        Location: `/api/v1/barang/${produk.id}`,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return problem(409, "Conflict", {
        detail: "Nama atau kode barang sudah digunakan.",
      });
    }

    console.error("POST /api/v1/barang gagal:", error);

    return problem(500, "Internal Server Error", {
      detail: "Gagal menyimpan barang.",
    });
  }
}
