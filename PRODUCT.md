# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS vanilla with local JSON question banks

## Users

Murid SMK yang mengakses latihan soal secara mandiri melalui HP.

## Product Purpose

Ruang Soal memberi murid akses cepat ke paket soal ujian sekolah untuk latihan mandiri tanpa login dan tanpa penilaian otomatis.

## Operating Context

Murid memilih paket berdasarkan kelas dan mata pelajaran, menjawab soal satu per satu, berpindah antarsoal, lalu meninjau ringkasan jawaban. Jawaban tersimpan di browser.

## Capabilities and Constraints

Paket soal dimuat dari file JSON lokal. Platform mempertahankan pemilihan paket, navigasi soal, penyimpanan jawaban lokal, mode tinjau, mulai ulang, serta tampilan responsif mobile-first. Tidak ada backend, akun, atau kunci jawaban otomatis.

## Evidence on Hand

Lima bank soal JSON tersedia di `bank-soal/` untuk kelas X AKL, X BDP, X RPL, XI RPL, dan XII RPL.

## Product Principles

- Murid menemukan paket yang tepat dalam hitungan detik.
- Teks soal dan kode harus mudah dibaca di layar kecil.
- Status jawaban selalu terlihat.
- Latihan tidak menghakimi murid dengan nilai otomatis.
- Interaksi tetap ringan dan dapat dipakai tanpa akun.
