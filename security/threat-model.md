# Threat Model — GudangKu

## 1. Tujuan

Dokumen ini mengidentifikasi ancaman terhadap GudangKu menggunakan metode STRIDE. Setiap ancaman dikaitkan dengan elemen pada `dfd.md` dan aset pada `asset-inventory.md`.

Analisis dibuat berdasarkan kondisi produk pada Tugas 1, yaitu aplikasi React dengan mock data, transaksi sementara di state browser, serta komponen digital signature Ed25519 yang belum terintegrasi dengan antarmuka web.

## 2. Skala Penilaian

### Kemungkinan (Likelihood)

| Nilai | Arti |
|---|---|
| Rendah | Membutuhkan kondisi khusus atau peluang terjadinya relatif kecil pada kondisi produk saat ini. |
| Sedang | Ancaman dapat terjadi dengan kemampuan dan akses yang relatif wajar. |
| Tinggi | Ancaman mudah terjadi karena kontrol yang diperlukan belum tersedia atau kelemahannya langsung terlihat pada implementasi. |

### Dampak (Impact)

| Nilai | Arti |
|---|---|
| Rendah | Dampak terbatas pada tampilan atau pengujian lokal. |
| Sedang | Dapat menyebabkan informasi stok keliru, transaksi tidak valid, atau gangguan penggunaan prototype. |
| Tinggi | Dapat merusak keandalan pencatatan persediaan atau mengekspos data penting apabila aplikasi digunakan dengan data inventori nyata. |

Penilaian mempertimbangkan dua kondisi: prototype saat ini yang masih memakai data sintetis dan kemungkinan pengembangan produk dengan data inventori nyata. Keduanya dibedakan dalam alasan penilaian.

## 3. Daftar Ancaman STRIDE

| ID | Kategori STRIDE | Elemen DFD | Aset Terdampak | Ancaman Spesifik | Kemungkinan | Dampak |
|---|---|---|---|---|---|---|
| T-01 | Spoofing | E-01, P-01, P-02 | A-02, A-03 | Pengguna yang tidak teridentifikasi dapat mengirim formulir transaksi karena aplikasi belum memiliki autentikasi. Jika aplikasi nantinya diakses bersama, sistem tidak dapat memastikan siapa yang melakukan transaksi. | Sedang | Tinggi |
| T-02 | Spoofing | P-04, P-05, D-05 | A-04, A-05 | Fungsi verifikasi menerima public key sebagai parameter, tetapi belum ada mekanisme yang mengikat public key dengan identitas penanda tangan yang dipercaya. Signature yang valid secara matematis belum membuktikan bahwa penanda tangannya adalah pihak yang berwenang. | Sedang | Sedang |
| T-03 | Tampering | P-02, P-01, D-03 | A-02, A-03 | Validasi formulir berjalan di sisi klien. Pengguna yang memodifikasi JavaScript atau state melalui browser dapat melewati validasi antarmuka. Karena belum ada backend, validasi server-side belum tersedia. | Tinggi | Sedang |
| T-04 | Tampering | D-01, D-02, D-04, P-03 | A-01, A-02, A-06 | Perubahan pada mock data atau source code sebelum aplikasi dijalankan dapat mengubah jumlah stok maupun riwayat transaksi yang ditampilkan. Prototype belum memiliki sumber data terpusat yang dapat memverifikasi perubahan tersebut. | Sedang | Sedang |
| T-05 | Repudiation | P-01, P-02, D-03 | A-02, A-03 | Setelah transaksi ditambahkan, aplikasi tidak menyimpan identitas pelaku atau audit trail permanen. Ketika terjadi perselisihan mengenai transaksi, tidak ada catatan yang cukup untuk mengetahui siapa yang melakukan tindakan tersebut. | Tinggi | Tinggi |
| T-06 | Repudiation | P-04, P-05, D-06 | A-02, A-04, A-05 | Komponen signature belum terintegrasi dengan transaksi UI dan belum menyimpan bukti signature bersama catatan transaksi permanen. Karena itu, sistem belum dapat menggunakan signature untuk membuktikan riwayat transaksi pada aplikasi web. | Tinggi | Sedang |
| T-07 | Information Disclosure | D-01, D-02, D-04, P-01 | A-01, A-02, A-06 | Jika data inventori nyata dimasukkan langsung ke mock data frontend, data tersebut dapat dibaca dari source code atau resource yang dikirim ke browser. Risiko saat ini lebih rendah karena data yang digunakan masih sintetis. | Rendah | Tinggi |
| T-08 | Information Disclosure | P-04, P-05, D-05, D-06 | A-04, A-05 | Private key dapat terekspos apabila pada pengembangan berikutnya kunci dicetak ke log, ditulis ke source code, atau dimasukkan ke repository. Implementasi saat ini membuat key pair saat pengujian dan tidak dirancang menyimpan private key secara permanen. | Rendah | Tinggi |
| T-09 | Denial of Service | P-01, P-02, D-03 | A-02, A-03 | Pengiriman transaksi berulang tanpa batas menambah elemen pada state React. Jika dilakukan terus-menerus, jumlah data di memori dan pekerjaan rendering dapat meningkat sehingga antarmuka melambat. | Sedang | Sedang |
| T-10 | Denial of Service | P-02, D-03 | A-02, A-03 | Kolom keterangan belum membatasi panjang input. Teks yang sangat panjang dan transaksi berulang dapat menambah penggunaan memori pada state sementara dan menurunkan responsivitas browser. | Rendah | Rendah |
| T-11 | Elevation of Privilege | P-01, P-02, D-03 | A-01, A-02, A-03 | Aplikasi belum mempunyai role dan otorisasi. Jika nanti terdapat peran seperti petugas dan administrator, tanpa pemeriksaan izin yang memadai pengguna biasa dapat melakukan operasi yang seharusnya dibatasi. Saat ini belum ada pembagian peran yang dapat dieksploitasi. | Sedang untuk pengembangan berikutnya | Tinggi |
| T-12 | Tampering | P-04, P-05, D-05, D-06 | A-02, A-04, A-05 | Jika hasil verifikasi signature tidak diwajibkan sebelum transaksi diterima oleh sistem yang menyimpan data, data yang telah diubah dapat tetap diproses. Kondisi sekarang belum memiliki alur integrasi signature dengan transaksi UI. | Tinggi | Tinggi |

## 4. Catatan Kondisi Ancaman

Tidak seluruh ancaman memiliki tingkat risiko yang sama pada prototype saat ini.

- Aplikasi belum memiliki backend dan database, sehingga transaksi baru belum disimpan secara permanen.
- Belum adanya autentikasi dan otorisasi merupakan keterbatasan yang harus diperhatikan apabila aplikasi dikembangkan untuk banyak pengguna.
- Data barang dan transaksi yang digunakan saat ini masih berupa mock data sintetis.
- Komponen digital signature Ed25519 sudah memiliki automated test, tetapi belum dipanggil oleh halaman transaksi PemWeb.
- Private key dibuat saat pengujian dan tidak disimpan sebagai kunci permanen di repository.

Dengan demikian, ancaman yang berhubungan dengan data inventori nyata, otorisasi pengguna, dan penyimpanan transaksi perlu ditinjau ulang ketika backend serta database mulai diimplementasikan.

## 5. Dasar Pemilihan Risiko Prioritas

Pemilihan lima risiko prioritas akan dijelaskan dalam `risk-register.md` dengan mempertimbangkan kemungkinan, dampak, keterbatasan prototype, serta kebutuhan pengembangan GudangKu pada Tugas 2 dan Tugas 3.