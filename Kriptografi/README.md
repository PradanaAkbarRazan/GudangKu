# GudangKu

## 1. Deskripsi Produk

GudangKu adalah sistem Inventory Management & Stock Prediction untuk membantu pengguna mencatat barang masuk dan barang keluar.

Sistem menyimpan riwayat transaksi dan pada pengembangan berikutnya dapat digunakan untuk memprediksi kondisi stok.

---

## 2. Kebutuhan Kriptografi

| Data | Tujuan Keamanan | Prioritas |
|---|---|---|
| Password pengguna | Melindungi kredensial pengguna | Tinggi |
| Riwayat transaksi stok | Mendeteksi perubahan atau manipulasi data | Tinggi |
| Data profil pengguna | Menjaga kerahasiaan data pengguna | Sedang |

Pada Tugas 1, komponen yang diimplementasikan adalah **digital signature pada data transaksi stok**.

Digital signature digunakan untuk memeriksa apakah data transaksi masih sesuai dengan data yang ditandatangani.

---

## 3. Rancangan Komponen Kriptografi

### Input

Data transaksi stok:

```json
{
  "transactionId": "TR001",
  "productId": "P001",
  "type": "OUT",
  "quantity": 10,
  "date": "2026-10-08"
}

```

### Proses

1. Sistem membuat pasangan private key dan public key.
2. Data transaksi dibuat dalam format yang konsisten.
3. Private key digunakan untuk membuat digital signature.
4. Public key digunakan untuk memverifikasi signature.

### Output

Hasil verifikasi berupa:
- VALID jika data sesuai dengan signature.
- INVALID jika data atau signature telah berubah.

### Alur

Data Transaksi
      ↓
Digital Signature
      ↓
Signature

### Verifikasi

Data + Signature + Public Key
            ↓
        Verifikasi
            ↓
      VALID / INVALID

---

## 4. Algoritma dan Library

Algoritma yang digunakan adalah Ed25519 Digital Signature.
Implementasi menggunakan modul kriptografi bawaan Node.js node:crypto.
Sandi klasik tidak digunakan untuk melindungi data produk.

---

## 5. Representasi Data

Data transaksi direpresentasikan sebagai objek TypeScript yang terdiri dari:
- transactionId
- productId
- type
- quantity
- date
Digital signature direpresentasikan dalam bentuk Base64 string.

---

## 6. Sumber Keacakan

Pasangan key dibuat menggunakan mekanisme pembuatan key pada modul node:crypto untuk algoritma Ed25519.
Kunci dibuat saat program dijalankan dan tidak disimpan di repository.

---

## 7. Struktur File
Kriptografi/
├── src/
│   └── signature.ts
└── tests/
    └── signature.test.ts

signature.ts berisi implementasi digital signature.

signature.test.ts berisi automated test.

---

## 8. Cara Menjalankan

Pastikan Node.js dan npm sudah terinstall.

Install dependency:
npm install

Memeriksa TypeScript:
npx tsc --noEmit

Menjalankan automated test:
npm test

---

## 9. Pengujian

Terdapat 4 skenario automated test:

No	Skenario	Hasil yang Diharapkan
1	Transaksi asli	Valid
2	Jumlah transaksi diubah	Invalid
3	Signature diubah	Invalid
4	ID transaksi diubah	Invalid

Hasil pengujian:

Test Files  1 passed
Tests       4 passed

Seluruh 4 skenario berhasil dijalankan.

Test nomor 2, 3, dan 4 merupakan negative test karena sistem harus menolak data atau signature yang tidak sesuai.

---

## 10. Keamanan Repository

Repository tidak menyimpan:

- Private key
- Password asli
- Token
- Secret
- Data pribadi

Data yang digunakan untuk pengujian merupakan data sintetis.

---
## Tugas 2 — Enkripsi Terautentikasi dan Integritas Data

### 1. Tujuan

Melindungi kerahasiaan dan integritas data transaksi stok menggunakan AES-256-GCM serta mempertahankan tanda tangan digital Ed25519 dari Tugas 1.

AES-256-GCM digunakan untuk mengenkripsi dan mengautentikasi paket transaksi, sedangkan Ed25519 digunakan untuk memverifikasi tanda tangan digital transaksi.

### 2. Implementasi

| File | Fungsi |
|---|---|
| `src/signature.ts` | Membuat dan memverifikasi tanda tangan Ed25519 |
| `src/encryption.ts` | Enkripsi dan dekripsi AES-256-GCM |
| `src/key.ts` | Membaca master key dan derivasi HKDF |
| `src/secure-transaction.ts` | Integrasi tanda tangan dan enkripsi |
| `tests/signature.test.ts` | Pengujian Tugas 1 |
| `tests/secure-transaction.test.ts` | Pengujian integrasi dan keamanan |
| `tests/key.test.ts` | Pengujian manajemen kunci |
| `scripts/demo-tugas2.ts` | Demonstrasi end-to-end |

### 3. Parameter Kriptografi

| Parameter | Nilai |
|---|---|
| Algoritma enkripsi | AES-256-GCM |
| Panjang kunci enkripsi | 256 bit (32 byte) |
| Panjang nonce | 96 bit (12 byte) |
| Authentication tag | 128 bit (16 byte) |
| Derivasi kunci | HKDF-SHA256 |
| Sumber nonce | Node.js `crypto.randomBytes()` |
| Encoding paket | Base64 |
| AAD | Versi, ID transaksi, dan ID produk |

HKDF menggunakan SHA-256, salt kosong, dan informasi khusus aplikasi:

`GudangKu:v0.2:AES-256-GCM`

AAD dibentuk menggunakan format:

`GudangKu:v1:transaction:{transactionId}:product:{productId}`

AAD digunakan untuk mengautentikasi metadata transaksi tanpa mengenkripsinya. Oleh karena itu, ID transaksi dan ID produk tetap terlihat pada paket terenkripsi.

Nonce dibuat menggunakan CSPRNG pada setiap proses enkripsi. Nonce tidak bersifat rahasia, tetapi tidak boleh digunakan ulang dengan kunci yang sama.

### 4. Manajemen Kunci

Master key dibuat menggunakan CSPRNG dengan panjang 32 byte dan disimpan dalam format heksadesimal.

Lokasi default:

`%USERPROFILE%\.gudangku\master.key`

Lokasi tersebut berada di luar repository.

Modul `key.ts` menyediakan:

- `loadMasterKey()` untuk membaca dan memvalidasi master key.
- `deriveEncryptionKey()` untuk menghasilkan kunci AES-256-GCM melalui HKDF-SHA256.

Master key dan kunci turunan tidak boleh dimasukkan ke source code, repository, dokumentasi, atau log.

**Catatan Windows:** izin file Windows menggunakan Access Control List (ACL), sehingga tidak identik dengan permission POSIX `600`. Folder penyimpanan menggunakan ACL untuk membatasi akses.

### 5. Alur Integrasi Tugas 1 dan Tugas 2

Implementasi menggabungkan digital signature Ed25519 dengan enkripsi AES-256-GCM dalam satu alur.

**Proses enkripsi:**

1. Data transaksi ditandatangani menggunakan private key Ed25519.
2. Data transaksi dan signature digabungkan.
3. Paket dienkripsi menggunakan AES-256-GCM.
4. Sistem menghasilkan ciphertext, nonce, dan authentication tag.

**Proses dekripsi dan verifikasi:**

1. Paket diterima oleh sistem.
2. AES-256-GCM memverifikasi autentikasi paket.
3. Jika autentikasi berhasil, data transaksi dan signature didekripsi.
4. Signature diverifikasi menggunakan public key Ed25519.
5. Transaksi diterima hanya jika seluruh pemeriksaan berhasil.

Dengan demikian, AES-GCM melindungi kerahasiaan dan integritas paket, sedangkan Ed25519 memverifikasi keaslian tanda tangan transaksi.

### 6. Menjalankan Demo

Jalankan perintah berikut dari direktori root repository `C:\GudangKu`:

```powershell
.\PemWeb\node_modules\.bin\tsx.cmd .\Kriptografi\scripts\demo-tugas2.ts
```

Demo membaca master key dari lokasi default:

`%USERPROFILE%\.gudangku\master.key`

Lokasi alternatif dapat diberikan melalui environment variable `GUDANGKU_MASTER_KEY_PATH`.

Demo menggunakan pasangan key Ed25519 sementara yang dibuat saat program dijalankan.

Contoh keluaran:

```text
=== DEMO GUDANGKU TUGAS 2 ===
Master key berhasil dibaca.
HKDF-SHA256 berhasil menurunkan kunci enkripsi.
Algoritma: aes-256-gcm
Panjang nonce: 12 byte
Panjang authentication tag: 16 byte
Enkripsi dan dekripsi: BERHASIL
Verifikasi Ed25519: BERHASIL
```

### 7. Menjalankan Pengujian

Pastikan Node.js dan npm sudah terpasang.

Install dependency dari direktori root repository:

```powershell
npm install
```

Menjalankan seluruh automated test:

```powershell
npm test
```

Memeriksa TypeScript:

```powershell
npx tsc --noEmit
```

### 8. Skenario dan Hasil Pengujian

Pengujian dilakukan menggunakan Vitest.

| File Pengujian | Skenario | Jumlah |
|---|---|---:|
| `signature.test.ts` | Verifikasi transaksi, perubahan jumlah, signature, dan ID transaksi | 4 |
| `secure-transaction.test.ts` | Integrasi, nonce, ciphertext, tag, kunci salah, AAD, dan public key | 7 |
| `key.test.ts` | Pembacaan master key, validasi, dan derivasi HKDF | 5 |
| **Total** | | **16** |

Hasil pengujian terakhir:

```text
Test Files  3 passed (3)
Tests       16 passed (16)
```

Seluruh 16 skenario berhasil dijalankan.

Pengujian negatif memastikan sistem menolak data atau parameter yang tidak valid, termasuk ciphertext yang dimodifikasi, authentication tag yang diubah, kunci enkripsi yang salah, metadata AAD yang dimodifikasi, dan public key yang salah.

### 9. Batasan Implementasi

Demo membuat pasangan kunci Ed25519 sementara setiap kali dijalankan. Penyimpanan dan pengelolaan private key Ed25519 secara permanen belum menjadi bagian dari demonstrasi ini.

Password pengguna dan data profil pengguna juga belum termasuk dalam implementasi kriptografi Tugas 2.