# AI_LOG.md

## 1. Tool
ChatGPT

## 2. Tujuan Penggunaan
AI digunakan sebagai alat bantu dalam perancangan dan implementasi komponen kriptografi pada produk GudangKu.

## 3. Ringkasan Perintah
AI diminta membantu:
- Menentukan kebutuhan kriptografi produk.
- Merancang penggunaan digital signature untuk transaksi inventory.
- Membantu menulis implementasi TypeScript.
- Membantu membuat skenario automated test.
- Membantu menyusun dokumentasi README.

## 4. Bagian yang Digunakan atau Diubah
Hasil bantuan AI digunakan sebagai referensi untuk:
- Rancangan digital signature.
- Struktur kode TypeScript.
- Skenario pengujian.
- Dokumentasi project.

Kode dan isi project diperiksa dan disesuaikan dengan kebutuhan GudangKu.

## 5. Cara Memeriksa
Kode dijalankan secara lokal menggunakan Node.js dan automated test menggunakan Vitest.

Pengujian dilakukan dengan 4 skenario:
1. Transaksi asli.
2. Data transaksi diubah.
3. Signature diubah.
4. ID transaksi diubah.

Hasil pengujian menunjukkan seluruh 4 test berhasil.

## 6. Tanggung Jawab
Mahasiswa bertanggung jawab memahami, memeriksa, dan memastikan kebenaran kode yang digunakan dalam repository.

## Bantuan AI — Tugas 1 Keamanan Komputasi dan Siber

### Bagian yang dibantu AI
AI digunakan untuk membantu menyusun dan merapikan dokumentasi keamanan GudangKu, meliputi:
- Inventaris aset dan klasifikasi data.
- Data Flow Diagram (DFD), ID elemen, aliran data, dan trust boundaries.
- Identifikasi ancaman menggunakan metode STRIDE.
- Penilaian likelihood dan impact serta pemilihan risiko prioritas.
- Rencana kontrol keamanan untuk milestone berikutnya.

### Konteks dan batasan
Dokumentasi disusun berdasarkan kondisi prototipe GudangKu pada Tugas 1. Antarmuka menggunakan React, TypeScript, dan Tailwind CSS. Data produk masih berupa mock data, sedangkan transaksi baru disimpan sementara di React state. Komponen tanda tangan digital Ed25519 dibuat terpisah dan belum terintegrasi dengan antarmuka transaksi.

Karena itu, dokumentasi tidak mengasumsikan bahwa backend, database permanen, autentikasi, atau integrasi tanda tangan digital sudah tersedia.

### Verifikasi dan tanggung jawab
AI membantu menghasilkan rancangan awal dan penjelasan dokumentasi. Saya bertanggung jawab memeriksa kesesuaian dokumen dengan implementasi GudangKu, memperbaiki ketidaksesuaian, serta menjalankan pemeriksaan dan proses Git secara mandiri.

Dokumen akan diperiksa kembali melalui konsistensi ID aset dan elemen DFD, kesesuaian ancaman dengan aset yang terdampak, konsistensi penilaian risiko, dan pemeriksaan hasil Git sebelum dikumpulkan.