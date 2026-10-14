# Asset Inventory — GudangKu

## 1. Tujuan

Dokumen ini mencatat aset, data, dan komponen yang perlu diperhatikan dari GudangKu sebagai dasar threat modeling dan analisis risiko pada Tugas 1 Keamanan Komputasi dan Siber.

## 2. Konteks Produk

GudangKu adalah aplikasi Inventory Management & Stock Prediction yang dirancang untuk mencatat barang masuk dan barang keluar, menampilkan kondisi stok, serta dikembangkan untuk memprediksi stok yang berpotensi habis.

Pada kondisi Tugas 1, aplikasi web menggunakan React, TypeScript, Tailwind CSS, dan mock data. Transaksi baru disimpan sementara dalam state aplikasi dan belum menggunakan backend maupun database. Komponen digital signature Ed25519 telah dibuat pada bagian Kriptografi, tetapi belum terintegrasi dengan antarmuka PemWeb.

## 3. Daftar Aset

| ID | Aset/Data | Lokasi atau Kondisi Saat Ini | Kebutuhan Keamanan | Prioritas |
|---|---|---|---|---|
| A-01 | Data barang dan jumlah stok | Mock data pada `PemWeb/app/src/data/mockData.ts` | Integritas dan ketersediaan agar informasi stok tidak berubah tanpa disengaja | Tinggi |
| A-02 | Riwayat transaksi barang masuk dan keluar | Mock data pada `mockData.ts` dan state React pada halaman transaksi | Integritas dan keaslian pencatatan transaksi | Tinggi |
| A-03 | Input formulir transaksi | Form pada `PemWeb/app/src/pages/Transactions.tsx` | Validitas input dan integritas data sebelum diproses | Tinggi |
| A-04 | Digital signature transaksi | Komponen terpisah pada `Kriptografi/src/signature.ts`; belum terhubung ke PemWeb | Integritas data dan verifikasi signature | Tinggi |
| A-05 | Pasangan private key dan public key | Dibuat saat pengujian komponen Kriptografi; tidak disimpan sebagai kunci permanen | Kerahasiaan private key dan keaslian public key yang digunakan untuk verifikasi | Tinggi |
| A-06 | Source code aplikasi | Folder `PemWeb/`, `Kriptografi/`, dan repository GitHub GudangKu | Integritas kode dan pengendalian perubahan | Tinggi |
| A-07 | Konfigurasi dan dependency project | `package.json`, `package-lock.json`, `tsconfig.json`, serta konfigurasi Vite | Integritas konfigurasi dan keamanan dependency | Sedang |
| A-08 | Dokumentasi desain dan pengujian | Folder `docs/` dan `security/` di repository | Integritas dan ketersediaan dokumentasi | Sedang |

## 4. Klasifikasi Data

| Jenis Data | Contoh | Kerahasiaan | Integritas | Ketersediaan |
|---|---|---|---|---|
| Data barang | Nama, kategori, jumlah stok | Rendah pada mock data | Tinggi | Tinggi |
| Data transaksi | Jenis transaksi, jumlah, tanggal | Rendah pada data sintetis | Tinggi | Tinggi |
| Kunci privat | Private key untuk digital signature | Tinggi | Tinggi | Sedang |
| Source code | Komponen React dan Kriptografi | Rendah pada repository publik | Tinggi | Tinggi |
| Dokumen keamanan | DFD, threat model, risk register | Rendah pada dokumen tugas | Tinggi | Sedang |

Kerahasiaan data barang dan transaksi dinilai rendah untuk kondisi saat ini karena menggunakan data sintetis. Penilaian dapat berubah ketika aplikasi memakai data inventori nyata atau data pengguna.

## 5. Status Perlindungan Kriptografi

Komponen Ed25519 digunakan untuk membuat dan memverifikasi digital signature pada contoh data transaksi. Komponen tersebut telah memiliki automated test, tetapi masih terpisah dari antarmuka PemWeb.

Oleh karena itu, data transaksi yang ditampilkan dalam aplikasi web belum dapat dianggap otomatis terlindungi oleh digital signature. Integrasi signing dan verification merupakan pengembangan lanjutan.

Private key tidak disimpan di repository. Data yang digunakan dalam pengujian merupakan data sintetis.

## 6. Batasan Inventaris

Inventaris ini menggambarkan kondisi GudangKu pada Tugas 1. Aplikasi belum memiliki backend, database permanen, autentikasi pengguna, atau layanan prediksi stok yang sebenarnya. Analisis ancaman dan risiko harus mempertimbangkan keterbatasan tersebut dan tidak menganggap kontrol yang belum dibuat sebagai fitur yang sudah berjalan.