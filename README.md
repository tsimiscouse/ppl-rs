# Proyek Pengujian Perangkat Lunak: Sistem Manajemen Rumah Sakit

**Done By:**
- Muhammad Luthfi Attaqi (496427)
- Gavind Muhammad Pramahita (497221)
- Ryan Krishandi Lukito (497249)

---

## ✅ User Requirements

| No | User Requirement       | Deskripsi                                                                 |
|----|------------------------|---------------------------------------------------------------------------|
| UR1 | Pendaftaran Digital   | Pasien dapat mendaftar antrean secara online tanpa datang langsung.       |
| UR2 | Pemilihan Dokter      | Pasien dapat memilih dokter dari daftar dropdown.                         |
| UR3 | Pemilihan Waktu       | Pasien dapat memilih waktu kunjungan dari pilihan yang tersedia.          |
| UR4 | Input Nama Pasien     | Pasien harus mengisi nama dengan maksimal 50 karakter.                    |
| UR5 | Validasi Formulir     | Sistem menolak pendaftaran jika nama pasien kosong, dan tampilkan error. |
| UR6 | Nomor Antrean Otomatis| Setelah mendaftar, pasien mendapatkan nomor antrean otomatis (misal: A001). |
| UR7 | Konfirmasi Pendaftaran| Sistem menampilkan detail pendaftaran.                                   |
| UR8 | Persistensi Data      | Data antrean tetap tersedia setelah halaman di-refresh.                   |

---

## 🧩 Feature Analysis

| Fitur                | Deskripsi                                                                 | Terkait User Requirement |
|----------------------|--------------------------------------------------------------------------|---------------------------|
| Halaman Formulir     | Terdapat halaman utama dengan form pendaftaran                           | UR1                       |
| Dropdown Dokter      | Dropdown berisi pilihan seperti "Dr. Andi - Spesialis Jantung"           | UR2                       |
| Dropdown Waktu       | Dropdown dengan pilihan jam seperti "09:00", "10:00"                     | UR3                       |
| Input Nama Pasien    | Kolom wajib diisi, maksimal 50 karakter                                  | UR4                       |
| Validasi Nama        | Jika kosong, muncul error: "Nama pasien wajib diisi"                     | UR5                       |
| Tombol Daftar Antrean| Menyimpan data dan menghasilkan nomor antrean                            | UR6                       |
| Konfirmasi Pendaftaran| Menampilkan nomor antrean dan detail input                              | UR7                       |
| Penyimpanan Data     | Gunakan Local Storage atau database agar data tidak hilang saat refresh  | UR8                       |

---

## 🧪 End-to-End Testing (Acceptance Test)

| No | Test Case               | Langkah                                                                 | Expected Result                                             | Terkait       |
|----|--------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------|---------------|
| TC1 | Berhasil daftar antrean| Buka halaman, pilih dokter & waktu, isi nama, klik "Daftar Antrean"    | Muncul nomor antrean, nama, dokter, dan waktu               | UR1–UR4, UR6–UR7 |
| TC2 | Validasi nama kosong    | Buka halaman, pilih dokter & waktu, kosongkan nama, klik daftar        | Muncul pesan: "Nama pasien wajib diisi"                     | UR5           |
| TC3 | Nama > 50 karakter      | Isi nama dengan lebih dari 50 karakter                                 | Form tidak disubmit, tampilkan error                        | UR4           |
| TC4 | Persistensi setelah refresh | Daftar antrean, lalu refresh halaman                              | Informasi antrean tetap tampil                              | UR8           |
| TC5 | Nomor antrean bertambah| Daftar dua kali dengan data berbeda                                    | Nomor antrean naik: A001, A002                              | UR6           |
| TC6 | Dokter & waktu tampil sesuai| Pilih dokter & waktu lalu daftar                                   | Konfirmasi menampilkan dokter & waktu yang dipilih          | UR2, UR3, UR7 |

---

