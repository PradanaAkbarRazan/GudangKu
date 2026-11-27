import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bacaId, problem } from "@/lib/api/problem";

type KonteksRoute = {
  params: Promise<{ id: string }>;
};

const skemaKueri = z.object({
  halaman: z.coerce.number().int().min(1).default(1),
  batas: z.coerce.number().int().min(1).max(50).default(10),
});

// GET /api/v1/barang/{id}/riwayat-stok
export async function GET(
  request: Request,
  { params }: KonteksRoute
) {
  const id = await bacaId(params);

  if (!id) {
    return problem(400, "Bad Request", {
      detail: "ID barang tidak valid.",
    });
  }

  const url = new URL(request.url);
  const hasilKueri = skemaKueri.safeParse(
    Object.fromEntries(url.searchParams)
  );

  if (!hasilKueri.success) {
    return problem(400, "Bad Request", {
      detail: "Parameter kueri tidak valid.",
      errors: z.flattenError(hasilKueri.error).fieldErrors,
    });
  }

  try {
    const produk = await prisma.produk.findUnique({
      where: { id },
      select: {
        id: true,
        kodeRute: true,
        nama: true,
      },
    });

    if (!produk) {
      return problem(404, "Not Found", {
        detail: "Barang tidak ditemukan.",
      });
    }

    const { halaman, batas } = hasilKueri.data;

    const where = { produkId: id };

    const [data, total] = await prisma.$transaction([
      prisma.riwayatStok.findMany({
        where,
        orderBy: [
          { dibuatPada: "desc" },
          { id: "desc" },
        ],
        skip: (halaman - 1) * batas,
        take: batas,
      }),
      prisma.riwayatStok.count({ where }),
    ]);

    return Response.json({
      produk,
      data,
      meta: {
        halaman,
        batas,
        total,
        totalHalaman: Math.ceil(total / batas),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/v1/barang/[id]/riwayat-stok gagal:",
      error
    );

    return problem(500, "Internal Server Error", {
      detail: "Gagal mengambil riwayat stok barang.",
    });
  }
}