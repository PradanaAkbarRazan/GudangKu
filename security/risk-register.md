# Risk Register — GudangKu

## 1. Tujuan

Dokumen ini mencatat lima risiko prioritas dari threat model GudangKu. Penilaian digunakan untuk menentukan kontrol keamanan yang perlu dikembangkan pada tugas berikutnya.

Penilaian berdasarkan kondisi produk pada Tugas 1: aplikasi React masih menggunakan mock data, transaksi baru disimpan sementara dalam state browser, belum ada backend/database, dan komponen digital signature belum terintegrasi dengan antarmuka PemWeb.

## 2. Metode Penilaian

Kemungkinan dan dampak dinilai menggunakan skala 1–3.

### Kemungkinan (Likelihood)

| Nilai | Kategori | Keterangan |
|---|---|---|
| 1 | Rendah | Memerlukan kondisi khusus atau tidak mudah terjadi pada kondisi saat ini. |
| 2 | Sedang | Dapat terjadi dengan akses dan kemampuan yang relatif wajar. |
| 3 | Tinggi | Keterbatasan kontrol saat ini membuat skenario mudah terjadi atau belum dapat dicegah. |

### Dampak (Impact)

| Nilai | Kategori | Keterangan |
|---|---|---|
| 1 | Rendah | Dampak terbatas pada tampilan atau pengujian lokal. |
| 2 | Sedang | Dapat menyebabkan data transaksi tidak valid, kehilangan data sementara, atau informasi stok keliru. |
| 3 | Tinggi | Dapat memengaruhi keandalan pencatatan stok dan kepercayaan terhadap transaksi jika produk digunakan secara operasional. |

Skor risiko dihitung dengan rumus:

**Skor Risiko = Kemungkinan × Dampak**

| Skor | Tingkat Risiko |
|---|---|
| 1–2 | Rendah |
| 3–4 | Sedang |
| 6 | Tinggi |
| 9 | Sangat Tinggi |

## 3. Lima Risiko Prioritas

| Prioritas | ID Threat | Elemen DFD | Aset | Risiko | Kemungkinan | Dampak | Skor | Tingkat |
|---|---|---|---|---|---|---|---:|---|
| P-01 | T-03 | P-01, P-02, D-03 | A-02, A-03 | Validasi sisi klien dapat dilewati sehingga transaksi dengan nilai yang tidak sesuai dapat masuk ke state aplikasi. | 3 — Tinggi | 2 — Sedang | 6 | Tinggi |
| P-02 | T-05 | P-01, P-02, D-03 | A-02, A-03 | Tidak adanya audit trail permanen membuat tindakan transaksi sulit ditelusuri dan transaksi yang hilang setelah sesi berakhir tidak dapat dipulihkan. | 3 — Tinggi | 2 — Sedang | 6 | Tinggi |
| P-03 | T-12 | P-04, P-05, D-05, D-06 | A-02, A-04, A-05 | Digital signature telah diuji secara terpisah, tetapi transaksi pada UI belum melewati proses signing dan verification. Perubahan data pada UI belum dilindungi oleh komponen tersebut. | 3 — Tinggi | 2 — Sedang | 6 | Tinggi |
| P-04 | T-01 | E-01, P-01, P-02 | A-02, A-03 | Belum adanya autentikasi berarti aplikasi tidak dapat membedakan identitas pengguna. Jika digunakan bersama setelah deployment, tindakan transaksi tidak dapat dikaitkan dengan pengguna yang berwenang. | 2 — Sedang | 3 — Tinggi | 6 | Tinggi |
| P-05 | T-04 | D-01, D-02, D-04, P-03 | A-01, A-02, A-06 | Mock data dan source code dapat diubah sebelum dijalankan sehingga informasi stok atau riwayat transaksi yang ditampilkan tidak lagi sesuai dengan data yang diharapkan. | 2 — Sedang | 2 — Sedang | 4 | Sedang |

## 4. Justifikasi Risiko

### P-01 — Validasi transaksi hanya di sisi klien

**Alasan kemungkinan:** Form transaksi menggunakan validasi JavaScript pada browser. Pengguna yang dapat memanipulasi state atau kode yang berjalan di browser berpotensi melewati validasi tersebut. Tidak terdapat validasi backend karena backend belum dibuat.

**Alasan dampak:** Data transaksi yang tidak valid dapat menghasilkan informasi stok yang salah. Pada prototype saat ini dampaknya masih terbatas karena data bersifat sementara, tetapi dapat menjadi lebih serius saat terhubung ke database.

### P-02 — Tidak adanya audit trail permanen

**Alasan kemungkinan:** Aplikasi hanya menambahkan transaksi ke state React dan belum mencatat identitas pengguna atau menyimpan riwayat secara permanen. Data baru dapat hilang ketika halaman dimuat ulang.

**Alasan dampak:** Pengguna tidak dapat menelusuri atau memulihkan transaksi dari penyimpanan permanen. Pada sistem inventori operasional, hal tersebut menyulitkan investigasi jika terjadi selisih stok.

### P-03 — Digital signature belum terintegrasi dengan UI

**Alasan kemungkinan:** Implementasi Ed25519 tersedia pada komponen Kripto, tetapi halaman Transaksi Stok belum memanggil fungsi signing atau verification. Karena itu, transaksi UI saat ini tidak mendapatkan perlindungan digital signature.

**Alasan dampak:** Sistem belum dapat memanfaatkan signature untuk memeriksa integritas transaksi UI. Jika data nantinya disimpan secara permanen, perubahan transaksi dapat sulit dibedakan dari catatan yang sah apabila tidak ada kontrol tambahan.

### P-04 — Tidak adanya autentikasi pengguna

**Alasan kemungkinan:** Aplikasi Tugas 1 belum memiliki mekanisme login atau identifikasi pengguna.

**Alasan dampak:** Jika aplikasi digunakan oleh beberapa pengguna setelah deployment, sistem belum bisa menentukan siapa yang boleh memasukkan atau mengelola transaksi. Pada prototype lokal, risiko operasional masih terbatas karena belum terdapat layanan inventori multi-pengguna.

### P-05 — Perubahan mock data atau source code

**Alasan kemungkinan:** Data barang dan transaksi awal disimpan dalam file frontend. Pengembang atau pihak yang dapat mengubah file tersebut dapat mengubah angka yang digunakan oleh aplikasi.

**Alasan dampak:** Dashboard dan halaman inventori dapat menampilkan informasi yang tidak sesuai dengan data yang diharapkan. Dalam versi sekarang dampak terutama pada demonstrasi dan ketepatan informasi prototype.

## 5. Rencana Kontrol

| ID Risiko | Rencana Kontrol | Risiko yang Dikurangi | Pemetaan Pengembangan |
|---|---|---|---|
| P-01 | Terapkan validasi pada backend, pemeriksaan tipe dan rentang nilai, serta penolakan transaksi yang tidak valid sebelum penyimpanan. | Mengurangi kemungkinan input tidak valid diterima oleh sistem. | Tugas 2 |
| P-02 | Tambahkan audit log dengan ID transaksi, waktu, jenis transaksi, identitas pengguna, dan hasil operasi. Batasi perubahan terhadap catatan audit. | Meningkatkan keterlacakan dan membantu investigasi transaksi. | Tugas 2 |
| P-03 | Integrasikan digital signature dengan alur transaksi, verifikasi signature sebelum transaksi diterima, dan kelola private key secara aman. | Membantu mendeteksi perubahan data dan memastikan signature berasal dari pemegang private key yang sesuai. | Tugas 3 |
| P-04 | Tambahkan autentikasi, pengelolaan sesi, serta otorisasi berdasarkan peran sebelum sistem digunakan oleh banyak pengguna. | Mengurangi risiko transaksi dilakukan oleh pengguna yang tidak teridentifikasi atau tidak berwenang. | Tugas 2 |
| P-05 | Pindahkan penyimpanan data operasional ke backend/database, batasi akses pengubahan data, dan lakukan pencatatan perubahan. | Mengurangi ketergantungan pada mock data frontend dan meningkatkan integritas data. | Tugas 2 |

Pemetaan Tugas 2 dan Tugas 3 di atas merupakan rencana awal. Implementasi kontrol akan disesuaikan dengan persyaratan masing-masing tugas ketika diberikan oleh dosen.

## 6. Kesimpulan

Lima risiko prioritas GudangKu berfokus pada validasi transaksi, keterlacakan transaksi, integrasi kriptografi, autentikasi pengguna, dan integritas data inventori.

Pada Tugas 1, risiko diidentifikasi dan rencana kontrol ditetapkan. Kontrol belum dianggap diterapkan hanya karena telah direncanakan dalam dokumen. Implementasinya dilakukan pada milestone berikutnya sesuai kebutuhan produk.

Register risiko ini menjadi dasar evaluasi ulang ancaman serta pelaksanaan kontrol keamanan pada Tugas 2, Tugas 3, dan Final Project.