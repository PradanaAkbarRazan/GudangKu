# GudangKu — PemWeb

## 1. Deskripsi Produk

GudangKu adalah aplikasi Inventory Management & Stock Prediction yang dirancang untuk membantu toko kecil dan UMKM mengelola persediaan barang.

Aplikasi ini dikembangkan sebagai antarmuka pengelolaan inventori. Pengguna dapat melihat daftar barang, mencari barang berdasarkan nama atau kategori, melihat detail persediaan, serta membuka halaman transaksi.

Pengembangan pada tahap ini menggunakan mock data. Integrasi database dan prediksi stok akan dikembangkan pada tahap berikutnya.

## 2. Sasaran Pengguna

Pemilik toko kecil, UMKM, dan petugas inventori yang membutuhkan pencatatan persediaan barang secara terstruktur.

## 3. Fitur Aplikasi

- Halaman utama GudangKu.
- Daftar barang dan pencarian berdasarkan nama atau kategori.
- Halaman detail barang berdasarkan ID.
- Informasi stok, batas stok minimum, dan status persediaan.
- Halaman transaksi.
- Halaman informasi tentang aplikasi.
- Navigasi berbasis Next.js App Router.
- Layout, template, loading state, error boundary, dan halaman not-found.

## 4. Teknologi

- Next.js 16.4.2
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- Turbopack untuk proses development dan build

## 5. Peta Rute

| URL | Berkas | Fungsi |
|---|---|---|
| `/` | `app/page.tsx` | Halaman utama |
| `/barang` | `app/barang/page.tsx` | Daftar dan pencarian barang |
| `/barang/[id]` | `app/barang/[id]/page.tsx` | Detail barang berdasarkan ID |
| `/tentang` | `app/tentang/page.tsx` | Informasi aplikasi |
| `/transaksi` | `app/transaksi/page.tsx` | Halaman transaksi |

Rute detail barang menggunakan parameter dinamis `[id]`. Parameter tersebut divalidasi sebelum data barang dicari.

## 6. Struktur Direktori

```text
PemWeb/
├── app/
│   ├── barang/
│   │   ├── [id]/
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── template.tsx
│   ├── tentang/
│   ├── transaksi/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
├── lib/
├── public/
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 7. Menjalankan Aplikasi

Pastikan Node.js dan npm tersedia. Jalankan perintah berikut dari direktori `PemWeb`.

### Instalasi dependensi

```bash
npm ci
```

### Development

```bash
npm run dev
```

Buka `http://localhost:3000` melalui browser.

### Pemeriksaan TypeScript

```bash
npx tsc --noEmit
```

### Pemeriksaan lint

```bash
npm run lint
```

### Build production

```bash
npm run build
```

### Menjalankan hasil build production

```bash
npm run start
```

## 8. Verifikasi Modul 4

Aplikasi telah diuji menggunakan pemeriksaan TypeScript, ESLint, dan build production. Pengujian juga mencakup rute dinamis, validasi parameter, layout dan template, loading, error boundary, serta batas modul `server-only`.

Dokumentasi lengkap dan bukti pengujian tersedia di:

`docs/praktikum/modul-04.md`

## 9. Catatan Pengembangan

Data aplikasi pada tahap ini masih berupa mock data dan belum terhubung ke database. Fitur pengelolaan inventori dan prediksi stok akan dikembangkan secara bertahap sesuai milestone proyek.
