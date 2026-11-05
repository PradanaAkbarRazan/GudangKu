# Keputusan Desain Kriptografi Tugas 2

## 1. Kebutuhan

GudangKu membutuhkan perlindungan kerahasiaan dan integritas
data transaksi stok produk. Data harus terlindungi dari
pembacaan maupun perubahan oleh pihak yang tidak berwenang.

Implementasi Tugas 2 juga harus terintegrasi dengan tanda
tangan digital Ed25519 dari Tugas 1.

## 2. Mekanisme yang Dipilih

Mekanisme yang digunakan adalah AES-256-GCM sebagai
Authenticated Encryption with Associated Data (AEAD).

AES-GCM dipilih karena menyediakan:
- Kerahasiaan data melalui enkripsi AES.
- Integritas ciphertext melalui authentication tag.
- Autentikasi metadata melalui Additional Authenticated Data
  (AAD).

Tanda tangan digital Ed25519 dari Tugas 1 tetap digunakan
untuk memverifikasi keaslian transaksi.

## 3. Alur Integrasi

1. Data transaksi ditandatangani menggunakan Ed25519.
2. Data transaksi dan tanda tangannya digabungkan.
3. Gabungan data dienkripsi menggunakan AES-256-GCM.
4. Saat diterima, paket didekripsi dan autentikasinya diperiksa.
5. Tanda tangan Ed25519 diverifikasi menggunakan public key.
6. Data hanya diterima apabila seluruh pemeriksaan berhasil.

## 4. Parameter Kriptografi

| Parameter | Keputusan |
|---|---|
| Algoritma | AES-256-GCM |
| Panjang kunci enkripsi | 256 bit (32 byte) |
| Panjang nonce | 96 bit (12 byte) |
| Authentication tag | 128 bit (16 byte) |
| Fungsi derivasi kunci | HKDF-SHA256 |
| Sumber nonce | CSPRNG (`randomBytes`) |
| Format penyimpanan | Base64 |
| AAD | Versi, ID transaksi, dan ID produk |

Nonce dibuat baru pada setiap proses enkripsi.
Nonce tidak bersifat rahasia, tetapi tidak boleh digunakan
ulang dengan kunci yang sama.

AAD mengautentikasi metadata transaksi tanpa mengenkripsinya.
Karena itu, metadata tersebut tetap dapat terlihat.

## 5. Manajemen Kunci

Master key:
- Dibuat menggunakan `crypto.randomBytes(32)`.
- Disimpan sebagai 64 karakter heksadesimal.
- Disimpan di luar repository pada folder profil pengguna.
- Tidak disimpan dalam source code, Git, atau dokumentasi.

Lokasi penyimpanan pada lingkungan pengembangan Windows:

`%USERPROFILE%\.gudangku\master.key`

Kunci enkripsi diturunkan dari master key menggunakan
HKDF-SHA256 dengan informasi khusus aplikasi.

Pemisahan kunci berdasarkan tujuan membantu menghindari
penggunaan satu kunci untuk beberapa fungsi kriptografi.

## 6. Validasi dan Penanganan Kegagalan

Implementasi memvalidasi:
- Panjang dan format kunci.
- Identitas transaksi dan produk.
- Jenis dan jumlah transaksi.
- Format nonce, ciphertext, dan authentication tag.
- Struktur paket serta isi hasil dekripsi.

Jika autentikasi atau verifikasi gagal, proses dihentikan.
Plaintext tidak dikembalikan ketika autentikasi AES-GCM gagal.

## 7. Pengujian

Pengujian dilakukan menggunakan Vitest.

Skenario pengujian:
1. Transaksi valid berhasil diproses.
2. Nonce berbeda pada setiap enkripsi.
3. Ciphertext yang dimodifikasi ditolak.
4. Authentication tag yang dimodifikasi ditolak.
5. Kunci enkripsi yang salah ditolak.
6. Metadata AAD yang diubah ditolak.
7. Public key yang salah ditolak.

Pengujian tanda tangan digital Tugas 1 tetap dipertahankan.

## 8. Kesimpulan

AES-256-GCM digunakan untuk melindungi kerahasiaan dan
integritas paket transaksi, sedangkan Ed25519 digunakan
untuk memverifikasi tanda tangan transaksi.

Kombinasi keduanya memberikan perlindungan berlapis
terhadap data transaksi GudangKu.