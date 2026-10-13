# GudangKu — Pemrograman Web

## 1. Deskripsi Produk

GudangKu adalah aplikasi Inventory Management & Stock Prediction yang dirancang untuk membantu toko kecil dan UMKM mengelola persediaan barang.

Permasalahan yang ingin diselesaikan adalah kesulitan memantau stok, mencatat barang masuk dan keluar, serta mengetahui barang yang perlu diisi ulang.

Pada Milestone 1, pengembangan berfokus pada antarmuka aplikasi menggunakan mock data. Integrasi database dan logika prediksi stok akan dilanjutkan pada milestone berikutnya.

## 2. Sasaran Pengguna

Pemilik toko kecil, UMKM, dan petugas inventori yang membutuhkan pencatatan persediaan secara terstruktur.

## 3. Fitur Awal

- Dashboard yang menampilkan ringkasan inventori.
- Daftar barang beserta kategori, jumlah stok, dan status persediaan.
- Pencarian barang berdasarkan nama atau kategori.
- Form pencatatan barang masuk dan barang keluar.
- Validasi input dan pesan kesalahan.
- Riwayat transaksi menggunakan mock data.
- Tampilan responsif untuk mobile, tablet, dan desktop.

Data pada Milestone 1 belum menggunakan database. Transaksi baru hanya disimpan sementara pada tampilan aplikasi.

## 4. Teknologi

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## 5. Struktur Aplikasi

```text
PemWeb/
├── README.md
└── app/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── data/
    │   ├── pages/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.ts
```

Folder `components` berisi komponen antarmuka yang digunakan ulang, `pages` berisi tiga halaman aplikasi, dan `data` berisi mock data.

## 6. Cara Menjalankan Aplikasi

### Prasyarat

Pastikan Node.js dan npm sudah terpasang.

### Instalasi

Buka terminal pada folder utama repository, kemudian jalankan:

```powershell
cd PemWeb/app
npm install
```

### Menjalankan aplikasi

```powershell
npm run dev
```

Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173/`.

### Pemeriksaan build

```powershell
npm run build
```

## 7. Pengujian Responsivitas

Pengujian dilakukan menggunakan Chrome DevTools pada ukuran layar berikut:

| Perangkat | Ukuran layar |
|---|---|
| Mobile | 390 × 844 px |
| Tablet | 768 × 1024 px |
| Desktop | 1366 × 900 px |

Halaman yang diuji adalah Dashboard, Daftar Barang, dan Transaksi Stok. Pengujian meliputi tampilan navigasi, kartu statistik, tabel barang, dan formulir transaksi.

## 8. Pengujian Lighthouse Accessibility

Pengujian dilakukan menggunakan Chrome Lighthouse dengan kategori Accessibility dan mode Navigation.

| Halaman | Perangkat | Skor Accessibility |
|---|---|---:|
| Dashboard (`/`) | Desktop | 100 |
| Daftar Barang (`/inventory`) | Desktop | 100 |
| Transaksi Stok (`/transactions`) | Desktop | 100 |

Target yang ditetapkan adalah skor Accessibility minimal 85.

## Pengujian Aksesibilitas Manual

Pengujian manual dilakukan menggunakan keyboard untuk memeriksa:
- Navigasi ant halaman melalui tombol Tab.
- Aktivasi tautan menggunakan Enter.
- Fokus keyboard pada elemen interaktif.
- Penggunaan input dan tombol pada formulir transaksi.

Hasil pengujian:
Navigasi dan formulir dapat digunakan menggunakan keyboard.

### Kondisi Pengujian

- Mode: Navigation
- Kategori: Accessibility
- Perangkat yang diemulasikan: Desktop
- Versi Google Chrome: 155.0.8059.40 (Official Build) (64-bit)
- Halaman yang diuji: Dashboard, Daftar Barang, dan Transaksi Stok
- Tanggal pengujian: 13 Oktober 2026

Versi Chrome dapat diperiksa melalui `chrome://version`. Skor di atas berdasarkan hasil pengujian yang diperoleh pada masing-masing halaman.

## 9. Bukti Pengerjaan

Bukti pengujian disimpan pada folder `docs/screenshot/PemWeb/` di repository GudangKu, meliputi:

- Screenshot Dashboard, Daftar Barang, dan Transaksi Stok pada ukuran mobile, tablet, dan desktop.
- Bukti formulir dengan input valid.
- Bukti formulir dengan input tidak valid.
- Screenshot hasil Lighthouse Accessibility.

## 10. Batasan Milestone 1

Versi ini berfokus pada antarmuka dan interaksi dasar. Aplikasi belum menggunakan backend atau database. Data transaksi baru masih bersifat sementara, dan prediksi stok belum menggunakan perhitungan dari riwayat transaksi.

Pengembangan backend, integrasi database, serta logika prediksi akan dilanjutkan pada milestone berikutnya.