# GudangKu

**Inventory Management & Stock Prediction**

GudangKu adalah aplikasi pengelolaan inventori untuk mencatat barang masuk dan barang keluar, memantau persediaan barang, serta mengembangkan fitur prediksi stok habis berdasarkan riwayat transaksi.

Proyek ini dikembangkan secara bertahap sebagai produk terintegrasi untuk tiga mata kuliah: Pengembangan Aplikasi Web, Kriptografi, dan Keamanan Komputasi dan Siber.

## Perkembangan Produk

| Versi | Pengembangan |
|---|---|
| v0.1 | Implementasi antarmuka menggunakan React, TypeScript, dan Tailwind CSS, dengan desain responsif dan aksesibilitas. |
| v0.2 | Integrasi Next.js App Router, Server Actions, validasi Zod, PostgreSQL, dan Prisma ORM 7. |

### Fitur v0.2

- Pengelolaan data produk (Create, Read, Update, Delete).
- Pencatatan riwayat stok barang masuk dan barang keluar.
- CRUD riwayat stok yang terhubung dengan produk.
- Validasi masukan di sisi server menggunakan Zod.
- Penyimpanan data secara permanen menggunakan PostgreSQL.
- Pengelolaan relasi produk dan riwayat stok menggunakan Prisma ORM.
- Seed data sintetis yang dapat dijalankan kembali.

## Teknologi

| Teknologi | Penggunaan |
|---|---|
| Next.js App Router | Routing dan logika aplikasi sisi server |
| React | Antarmuka dan komponen interaktif |
| TypeScript | Penulisan kode bertipe |
| Tailwind CSS | Styling dan desain responsif |
| Zod | Validasi masukan |
| PostgreSQL 18 | Basis data relasional |
| Prisma ORM 7 | Pemodelan data, migrasi, dan operasi CRUD |

## Struktur Repository

```text
GudangKu/
├── docs/           # Dokumentasi dan bukti pengujian
│   ├── screenshot/
│   ├── praktikum/
│   └── tugas-2/
│       └── PemWeb/
├── PemWeb/         # Aplikasi web
├── Kriptografi/    # Implementasi dan dokumentasi kriptografi
├── security/       # Artefak keamanan komputasi dan siber
└── README.md
```

## Persyaratan Sistem

- Node.js dan npm.
- PostgreSQL 18.
- Git.

## Cara Menjalankan Aplikasi

### 1. Masuk ke direktori aplikasi

```powershell
cd PemWeb
```

### 2. Instal dependensi

```powershell
npm install
```

### 3. Konfigurasi environment

Salin file contoh:

```powershell
Copy-Item .env.example .env
```

Isi variabel pada file `.env` sesuai konfigurasi lokal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/produk?schema=public"

DEMO_EMAIL=
DEMO_KATA_SANDI=
```

Keterangan:
- `DATABASE_URL`: alamat koneksi PostgreSQL.
- `DEMO_EMAIL`: email akun demo untuk login.
- `DEMO_KATA_SANDI`: kata sandi akun demo untuk login.

Isi variabel akun demo sesuai konfigurasi aplikasi. Jangan menggunakan kredensial pribadi yang sensitif.

**Keamanan:** Jangan mengunggah file `.env` atau kredensial asli ke repository. Gunakan `.env.example` sebagai template tanpa nilai rahasia.

### 4. Jalankan migrasi database

```powershell
npx prisma migrate dev
```

### 5. Generate Prisma Client

```powershell
npx prisma generate
```

### 6. Masukkan data awal

```powershell
npx prisma db seed
```

Seed menggunakan mekanisme upsert sehingga dapat dijalankan kembali tanpa membuat duplikasi berdasarkan identitas data seed.

### 7. Jalankan aplikasi

```powershell
npm run dev
```

Buka aplikasi melalui:

```text
http://localhost:3000
```

### 8. Pemeriksaan tambahan

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

## Dokumentasi dan Pengujian

Dokumentasi teknis dan bukti implementasi dapat ditemukan pada:

- [Dokumentasi Praktikum Modul 6](docs/praktikum/modul-06.md) — mencakup implementasi CRUD, relasi database, dan hasil 10 skenario pengujian (8 CRUD dan 2 relasi).
- [Bukti pengujian Modul 6](docs/praktikum/modul-06/)
- [Bukti validasi server Tugas 2 Web](docs/tugas-2/PemWeb/)

### Bukti Validasi Server Tugas 2

| Pengujian | Hasil yang diharapkan | Bukti |
|---|---|---|
| Nama barang kurang dari 3 karakter | Ditolak oleh Zod | [Screenshot 1](docs/tugas-2/PemWeb/01-validasi-server-nama-minimal.png) |
| Stok negatif | Ditolak oleh Zod | [Screenshot 2](docs/tugas-2/PemWeb/02-validasi-server-stok-negatif.png) |
| Stok minimum melebihi 100.000 | Ditolak oleh Zod | [Screenshot 3](docs/tugas-2/PemWeb/03-validasi-server-stok-maksimum.png) |

## Pembagian Mata Kuliah

- **Pengembangan Aplikasi Web:** Pengembangan antarmuka, routing, Server Actions, validasi, dan integrasi database.
- **Kriptografi:** Implementasi mekanisme kriptografi untuk mendukung kerahasiaan dan integritas data.
- **Keamanan Komputasi dan Siber:** Analisis ancaman, penilaian risiko, autentikasi, kontrol akses, dan hardening sistem.