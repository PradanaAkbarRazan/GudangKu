import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  bacaId,
  bacaJson,
  galatValidasi,
  problem,
} from "@/lib/api/problem";
import { skemaProdukUbah } from "@/lib/skema";

type KonteksRoute = {
  params: Promise<{ id: string }>;
};

// GET /api/v1/barang/{id}
export async function GET(
  _request: Request,
  { params }: KonteksRoute
) {
  const id = await bacaId(params);

  if (!id) {
    return problem(400, "Bad Request", {
      detail: "ID barang tidak valid.",
    });
  }

  try {
    const produk = await prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      return problem(404, "Not Found", {
        detail: "Barang tidak ditemukan.",
      });
    }

    return Response.json(produk);
  } catch (error) {
    console.error("GET /api/v1/barang/[id] gagal:", error);
    return problem(500, "Internal Server Error", {
      detail: "Gagal mengambil detail barang.",
    });
  }
}

// PATCH /api/v1/barang/{id}
export async function PATCH(
  request: Request,
  { params }: KonteksRoute
) {
  const id = await bacaId(params);

  if (!id) {
    return problem(400, "Bad Request", {
      detail: "ID barang tidak valid.",
    });
  }

  const body = await bacaJson(request);
  if (!body.ok) return body.res;

  const hasil = skemaProdukUbah.safeParse(body.data);
  if (!hasil.success) return galatValidasi(hasil.error);

  try {
    const produk = await prisma.produk.update({
      where: { id },
      data: hasil.data,
    });

    return Response.json(produk);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2025") {
        return problem(404, "Not Found", {
          detail: "Barang tidak ditemukan.",
        });
      }

      if (error.code === "P2002") {
        return problem(409, "Conflict", {
          detail: "Nama barang sudah digunakan.",
        });
      }
    }

    console.error("PATCH /api/v1/barang/[id] gagal:", error);
    return problem(500, "Internal Server Error", {
      detail: "Gagal memperbarui barang.",
    });
  }
}

// DELETE /api/v1/barang/{id}
export async function DELETE(
  _request: Request,
  { params }: KonteksRoute
) {
  const id = await bacaId(params);

  if (!id) {
    return problem(400, "Bad Request", {
      detail: "ID barang tidak valid.",
    });
  }

  try {
    const produk = await prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      return problem(404, "Not Found", {
        detail: "Barang tidak ditemukan.",
      });
    }

    const jumlahRiwayat = await prisma.riwayatStok.count({
      where: { produkId: id },
    });

    if (jumlahRiwayat > 0) {
      return problem(409, "Conflict", {
        detail: "Barang tidak dapat dihapus karena masih memiliki riwayat stok.",
      });
    }

    await prisma.produk.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2025") {
        return problem(404, "Not Found", {
          detail: "Barang tidak ditemukan.",
        });
      }

      if (error.code === "P2003" || error.code === "P2014") {
        return problem(409, "Conflict", {
          detail: "Barang masih memiliki relasi data dan tidak dapat dihapus.",
        });
      }
    }

    console.error("DELETE /api/v1/barang/[id] gagal:", error);
    return problem(500, "Internal Server Error", {
      detail: "Gagal menghapus barang.",
    });
  }
}