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




## Bantuan AI — Praktikum Pengembangan Aplikasi Web Modul 7

### 1. Tool yang Digunakan
**Tool:** ChatGPT.

AI digunakan sebagai alat bantu selama pengerjaan Praktikum Pengembangan Aplikasi Web Modul 7 pada proyek GudangKu. Penggunaan AI berfokus pada pemahaman kode, analisis akar penyebab galat, pemberian saran perbaikan, konfigurasi debugger, serta penyusunan dokumentasi teknis.

### 2. Tujuan Penggunaan
AI digunakan untuk membantu memahami alur kerja aplikasi Next.js, menelusuri galat pada komponen React dan Server Action, memahami validasi data menggunakan Zod, serta menganalisis galat yang berkaitan dengan Prisma dan proses penghapusan data.

AI juga digunakan untuk membantu memahami hasil validasi proyek dan menyusun dokumentasi berdasarkan proses pengerjaan serta bukti pengujian.

### 3. Perintah Utama kepada AI
Berikut merupakan ringkasan instruksi utama yang diberikan selama pengerjaan:

- Membantu menganalisis akar penyebab galat berdasarkan gejala, langkah reproduksi, dan bukti yang ditemukan.
- Menjelaskan cara menggunakan debugger Visual Studio Code untuk menelusuri kode server-side dan client-side.
- Membantu mengevaluasi solusi perbaikan kode dengan mempertimbangkan perilaku aplikasi dan alternatif implementasinya.
- Membantu menganalisis pesan galat dari Next.js, Prisma, React, dan Zod.
- Membantu meninjau hasil ESLint, TypeScript, dan Next.js production build serta menjelaskan penyebab kegagalannya.
- Membantu menyusun Issue GitHub dan Dokumen Teknis Modul 7 berdasarkan hasil pengerjaan.

### 4. Bagian Kode yang Dibantu AI
AI memberikan saran konfigurasi, contoh implementasi, penjelasan, dan arahan penyesuaian pada beberapa bagian proyek berikut:

| Berkas | Bentuk bantuan AI |
|---|---|
| `.vscode/launch.json` | Membantu menyusun konfigurasi debugger server-side, client-side, dan full-stack. |
| `PemWeb/lib/prisma.ts` | Membantu memahami dan menyesuaikan konfigurasi log query Prisma. |
| `PemWeb/components/FormEditBarang.tsx` | Membantu meninjau dan menyesuaikan input status ketersediaan barang. |
| `PemWeb/components/TransactionsClient.tsx` | Membantu menerapkan penghitung karakter menggunakan React state dan nilai turunan saat render. |
| `PemWeb/app/barang/[id]/error.tsx` | Membantu menyusun komponen error boundary untuk halaman detail barang. |
| `PemWeb/app/layout.tsx` | Membantu menganalisis dan menyesuaikan penggunaan Suspense pada layout. |
| `PemWeb/app/transaksi/page.tsx` | Membantu memisahkan pengambilan data runtime ke dalam komponen yang dibungkus Suspense. |

AI juga membantu menganalisis kode pada `PemWeb/lib/skema.ts` dan `PemWeb/app/barang/actions.ts`, terutama untuk memahami validasi status, perilaku `redirect()`, serta penanganan galat Prisma P2003.

**Catatan:** Saran dan contoh kode dari AI ditinjau serta disesuaikan kembali sebelum diterapkan. Implementasi akhir, pengujian, dan keputusan penerapan perubahan dilakukan oleh saya. Implementasi `z.stringbool()`, penanganan Prisma P2003, dan pemanggilan `redirect()` di luar blok `try/catch` telah tersedia pada basis kode yang digunakan. Ketiga bagian tersebut dianalisis dan diperiksa, bukan diklaim sebagai perubahan baru pada branch Modul 7.

### 5. Galat yang Ditemukan dan Perubahan yang Dilakukan
AI membantu proses analisis terhadap empat Issue GitHub berikut:

1. **Issue #3 — Status ketersediaan selalu true.**  
   Menganalisis perilaku konversi string menjadi boolean dan hubungan antara nilai input formulir dengan validasi Zod. Galat berhasil direproduksi sebanyak 5 dari 5 percobaan sebelum perbaikan.

2. **Issue #4 — Penghapusan barang berhasil tetapi redirect gagal.**  
   Membantu memahami mekanisme `NEXT_REDIRECT` pada Next.js dan alasan pemanggilan `redirect()` perlu ditempatkan di luar blok `try/catch`. Galat direproduksi satu kali untuk pengambilan bukti.

3. **Issue #5 — Penghapusan barang dengan riwayat stok menghasilkan pesan galat generik.**  
   Membantu memahami kode galat Prisma P2003 dan pilihan penanganan berdasarkan aturan relasi data. Galat direproduksi satu kali untuk pengambilan bukti.

4. **Issue #6 — Penghitung karakter keterangan transaksi tidak diperbarui.**  
   Membantu menganalisis penggunaan React state dan nilai turunan saat render agar jumlah karakter tersisa mengikuti perubahan input. Galat direproduksi satu kali untuk pengambilan bukti.

Bukti penelusuran dan hasil pengujian disimpan dalam folder `docs/praktikum/modul-07/`.

### 6. Cara Verifikasi
Saran AI tidak langsung dianggap benar. Saya memeriksa dan menguji perubahan secara lokal melalui:

- **Debugger Visual Studio Code:** menelusuri eksekusi kode server-side dan client-side.
- **Browser Developer Tools:** memeriksa Network dan React Developer Tools.
- **Log Prisma:** memeriksa query dan informasi galat basis data.
- **Pemeriksaan kode:** meninjau perubahan dan membandingkan perilaku sebelum serta sesudah penyesuaian.
- **ESLint:** memeriksa kualitas dan konsistensi kode.
- **TypeScript:** memeriksa kesalahan tipe.
- **Next.js production build:** memeriksa proses kompilasi dan prerendering aplikasi.

Hasil validasi akhir:

1. `npm run lint` — berhasil.
2. `npx tsc --noEmit` — berhasil.
3. `npm run build` — berhasil.

Bukti tangkapan layar penelusuran dan pengujian disertakan pada dokumentasi Modul 7.

### 7. Kendala dan Penyelesaian
Selama pengerjaan ditemukan beberapa kendala, antara lain generated types Next.js yang tidak sinkron, penggunaan `usePathname()` di luar batas Suspense, serta akses data runtime pada halaman transaksi yang perlu ditempatkan di dalam Suspense.

AI membantu menjelaskan penyebab dan memberikan alternatif penyelesaian. Saya kemudian meninjau dan menerapkan penyesuaian pada kode, membersihkan cache `.next` ketika diperlukan, serta menjalankan ulang proses validasi. Setelah penyesuaian, ESLint, TypeScript, dan Next.js production build berhasil dijalankan.

### 8. Verifikasi dan Tanggung Jawab
AI berperan sebagai alat bantu untuk memberikan penjelasan, analisis, contoh implementasi, dan saran perbaikan. Saya bertanggung jawab untuk:

- Menilai kesesuaian saran AI dengan kebutuhan aplikasi GudangKu.
- Meninjau dan menyesuaikan kode sebelum menerapkannya.
- Menjalankan aplikasi serta seluruh pengujian secara lokal.
- Memastikan hasil perbaikan melalui bukti dan validasi.
- Membuat Issue GitHub dan mengambil tangkapan layar.
- Melakukan seluruh operasi Git, termasuk commit, push, dan pembuatan Pull Request secara mandiri.

Seluruh saran AI tetap diperiksa kembali agar implementasi akhir sesuai dengan kebutuhan aplikasi, hasil pengujian, dan ketentuan Praktikum Pengembangan Aplikasi Web Modul 7.