-- CreateEnum
CREATE TYPE "JenisPergerakan" AS ENUM ('MASUK', 'KELUAR');

-- CreateTable
CREATE TABLE "Produk" (
    "id" TEXT NOT NULL,
    "kodeRute" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "stokMinimum" INTEGER NOT NULL DEFAULT 0,
    "satuan" TEXT NOT NULL,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatStok" (
    "id" TEXT NOT NULL,
    "produkId" TEXT NOT NULL,
    "jenis" "JenisPergerakan" NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "catatan" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatStok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produk_kodeRute_key" ON "Produk"("kodeRute");

-- CreateIndex
CREATE UNIQUE INDEX "Produk_nama_key" ON "Produk"("nama");

-- AddForeignKey
ALTER TABLE "RiwayatStok" ADD CONSTRAINT "RiwayatStok_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
