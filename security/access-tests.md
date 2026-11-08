
# Access Control Tests â€” GudangKu

## 1. Tujuan

Dokumen ini mencatat pengujian autentikasi dan otorisasi
GudangKu berdasarkan role ADMIN, PETUGAS, dan Guest.

Pengujian menggunakan akun uji dan akses tanpa autentikasi.
Password dan hash asli tidak dicantumkan.

## 2. Role Access Matrix

| Fitur | Guest | PETUGAS | ADMIN |
|---|---|---|---|
| Login | Ya | Ya | Ya |
| Dashboard | Tidak | Ya | Ya |
| Lihat daftar barang | Tidak | Ya | Ya |
| Lihat detail barang | Tidak | Ya | Ya |
| Tambah barang | Tidak | Tidak | Ya |
| Edit barang | Tidak | Tidak | Ya |
| Hapus barang | Tidak | Tidak | Ya |
| Lihat transaksi | Tidak | Ya | Ya |
| Tambah transaksi | Tidak | Ya | Ya |
| Edit transaksi | Tidak | Tidak | Ya |
| Hapus transaksi | Tidak | Tidak | Ya |

Prinsip: default deny dan least privilege.

## 3. Positive Access Tests

| ID | Role | Pengujian | Hasil Aktual | Status |
|---|---|---|---|---|
| P-01 | ADMIN | Login menggunakan akun Admin | Berhasil masuk | PASS |
| P-02 | PETUGAS | Login menggunakan akun Petugas | Berhasil masuk | PASS |
| P-03 | PETUGAS | Membuka halaman transaksi | Halaman berhasil dibuka | PASS |
| P-04 | PETUGAS | Membuka dashboard `/` | Berhasil dibuka | PASS |
| P-05 | PETUGAS | Membuka daftar barang `/barang` | Berhasil dibuka | PASS |
| P-06 | ADMIN | Membuka halaman tambah barang | Berhasil dibuka | PASS |

## 4. Negative Access Tests

| ID | Role | Pengujian | Hasil Aktual | Status |
|---|---|---|---|---|
| N-01 | Guest | Membuka dashboard `/` | Dialihkan ke `/masuk` | PASS |
| N-02 | Guest | Membuka daftar barang | Dialihkan ke `/masuk` | PASS |
| N-03 | Guest | Membuka transaksi | Dialihkan ke `/masuk` | PASS |
| N-04 | Guest | Membuka tambah barang | Dialihkan ke `/masuk` | PASS |
| N-05 | PETUGAS | Membuka `/barang/tambah` | Dialihkan ke `/akses-ditolak` | PASS |
| N-06 | PETUGAS | Membuka halaman edit barang | Dialihkan ke `/akses-ditolak` | PASS |

## 5. Password Security

Password pengguna disimpan menggunakan Argon2id.

Parameter konfigurasi:
- Algorithm: Argon2id
- Version: 19
- Memory cost: 19456 KiB
- Time cost: 2
- Parallelism: 1

Verifikasi format hash dilakukan terhadap akun ADMIN dan PETUGAS.
Hash lengkap dan password tidak ditampilkan dalam bukti.

## 6. Risk Mapping

| Risk ID | Risiko | Kontrol |
|---|---|---|
| P-04 / T-01 | Identitas pengguna tidak dapat diverifikasi | Login dan session berbasis database |
| T-11 | Elevation of Privilege | RBAC dan pembatasan server actions berdasarkan role |

## 7. Kesimpulan

GudangKu telah menerapkan autentikasi berbasis akun,
penyimpanan password menggunakan Argon2id, session berbasis
database, dan otorisasi berbasis role.

Seluruh 6 positive tests dan 6 negative tests telah berhasil diuji dan tercatat PASS.




