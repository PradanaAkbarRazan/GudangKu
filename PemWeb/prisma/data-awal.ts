
type DataAwal = {
  kodeRute: string;
  nama: string;
  kategori: string;
  stok: number;
  stokMinimum: number;
  satuan: string;
  tersedia: boolean;
};

export const dataAwal: DataAwal[] = [
  {
    kodeRute: "PRD001",
    nama: "Beras Premium",
    kategori: "Sembako",
    stok: 90,
    stokMinimum: 10,
    satuan: "kg",
    tersedia: true,
  },
  {
    kodeRute: "PRD002",
    nama: "Minyak Goreng",
    kategori: "Sembako",
    stok: 50,
    stokMinimum: 10,
    satuan: "liter",
    tersedia: true,
  },
  {
    kodeRute: "PRD003",
    nama: "Gula Pasir",
    kategori: "Sembako",
    stok: 75,
    stokMinimum: 15,
    satuan: "kg",
    tersedia: true,
  },
];
