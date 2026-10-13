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