# Lasagna Personal Cup 🍲 (Politeknik STMI Jakarta)

Aplikasi web full-stack *mobile-first* untuk usaha kuliner kampus **"Lasagna Personal Cup"**, menyajikan lasagna panggang personal cup lezat, higienis, dan praktis untuk civitas akademika Politeknik STMI Jakarta dan sekitarnya.

---

## 🚀 Fitur Utama

### 1. Halaman Pembeli (Public / Customer View)
- **Hero & Branding Hangat:**
  - Nama Brand **"Lasagna Personal Cup"**
  - Badge **"Ready to Eat • Porsi Personal"** & Badge Status **Batch Pre-Order Aktif**
  - Harga jelas: **Rp 12.000 / cup**
  - Ilustrasi visual cup lasagna *appetizing* berlapis saus bolognese, béchamel, dan lelehan keju panggang emas dalam cup aluminium foil 150ml.
- **Blok Transparansi & Komposisi Bahan (*Ingredients Showcase*):**
  - Section khusus **"Komposisi & Bahan Berkualitas"** sebelum form pemesanan:
    - **Bahan Utama:** Pasta lasagna pilihan, daging sapi giling, saus bolognese gurih, saus putih béchamel creamy (susu UHT, margarin, terigu), dan keju cheddar panggang.
    - **Bumbu & Rempah Alami:** Saus tomat, bawang bombai, bawang putih, oregano, lada, kaldu, garam, gula.
    - **Kemasan Higienis & Siap Santap:** Cup aluminium foil tahan oven + sendok makan sekali pakai + stiker label.
    - **Catatan Alergen:** Informasi olahan susu & gluten gandum.
- **Form Pemesanan Pre-Order (PO) Interaktif:**
  - Input Nama, Kelas / Status Kampus (Mahasiswa / Dosen / Staf), dan No. WhatsApp aktif.
  - Stepper jumlah cup dengan kalkulasi otomatis total harga (`jumlah * 12.000`).
  - Dropdown Titik COD Kampus (*Selasar Gedung A*, *Kantin Kampus*, *Lobi Utama*, *Area Parkir / Gerbang Utama*).
  - Dropdown Jam COD (*Istirahat Pagi*, *Istirahat Siang*, *Sore Pulang Kuliah*).
  - Catatan preferensi tambahan.
- **Konfirmasi Pesanan & WhatsApp Redirect:**
  - Modal sukses dengan animasi selebrasi *confetti* dan nomor pesanan unik (misal: `#LPC-1004`).
  - Tombol **"Konfirmasi via WhatsApp Sekarang"** yang langsung membuka WhatsApp penjual (`0858-8916-7365`) dengan format pesan pemesanan yang rapi.
- **Fitur Lacak Pesanan:**
  - Modal **"Cek Pesanan"** di navbar untuk memantau status pesanan kapan saja.

---

### 2. Halaman Admin Tim Produksi (`/admin` atau tombol "Admin Tim")
- **Proteksi PIN Keamanan:**
  - Layar login PIN interaktif (Default PIN: `1234` atau via env `VITE_ADMIN_PIN`).
- **Tab 1: Rekap Pesanan & Distribusi COD:**
  - Quick status cards (Pending, Diproses, Siap COD, Selesai).
  - Filter pesanan berdasarkan status, jam COD, titik COD, dan pencarian instan.
  - Tombol ubah status 1-klik (`Pending` ➔ `Diproses` ➔ `Siap COD` ➔ `Selesai`).
  - Tombol **"Chat Pemesan"** untuk menghubungi pembeli via WhatsApp langsung.
  - Tombol **"Export Rekap ke CSV"** untuk laporan keuangan atau tugas kewirausahaan.
  - Tombol **"+ Pesanan Manual"** untuk mencatat transaksi *cash/walk-in*.
- **Tab 2: Kalkulator Otomatis Bill of Materials (BOM) & Kebutuhan Belanja:**
  - Otomatis menghitung total cup dari pesanan aktif (`Pending` + `Diproses` + `Siap COD`) atau opsi simulasi batch manual.
  - Mengalikan total cup dengan takaran standar 12 bahan resep:
    1. Daging sapi giling (24 gram/cup | Rp 150/gr)
    2. La Fonte lasagna (0.08 pack/cup | Rp 24.000/pack)
    3. Susu UHT plain (40 ml/cup | Rp 20/ml)
    4. Saus tomat (20 gram/cup | Rp 30/gr)
    5. Keju cheddar parut (10 gram/cup | Rp 120/gr)
    6. Margarin (8 gram/cup | Rp 40/gr)
    7. Tepung terigu (10 gram/cup | Rp 20/gr)
    8. Bawang bombai (0.04 buah/cup | Rp 5.000/buah)
    9. Bawang putih (0.04 bonggol/cup | Rp 4.000/bonggol)
    10. Bumbu & pelengkap (1 porsi/cup | Rp 400/porsi)
    11. Kemasan foil + sendok + stiker (1 set/cup | Rp 1.000/set)
    12. Alokasi Gas & Listrik Oven (1 porsi/cup | Rp 400/porsi)
  - Menampilkan **Tabel Kebutuhan Produksi & Belanja**: total takaran resep, rekomendasi pembulatan kemasan beli di pasar (*ceil*), biaya resep proporsional, dan estimasi uang belanja kemasan penuh.
  - Tombol **"Copy Daftar Belanja ke WhatsApp"** yang langsung memformat daftar belanja lengkap dengan checkbox untuk dibagikan ke grup WA tim produksi.
- **Tab 3: Ringkasan Keuangan & Master Resep:**
  - Metrik finansial *real-time*: **Total Cup Terpesan**, **Estimasi Omzet Kotor**, **Total Estimasi HPP**, **HPP per Cup** (Rp 10.800), **Estimasi Laba Bersih**, dan **Margin Keuntungan (%)**.
  - Form editor modal pada tabel **Master Bahan & Resep**: ubah takaran per cup atau harga pasar langsung dari web dengan auto-recalculate ke semua tab.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide React + Canvas Confetti.
- **Backend / Database:** 
  - **Supabase** (`@supabase/supabase-js`) untuk sinkronisasi database cloud.
  - **Hybrid Fallback:** Otomatis berjalan di mode `localStorage` jika environment variables Supabase belum diisi, sehingga siap di-demo tanpa setup awal atau offline di Netlify.
- **Database Schema:** `supabase_schema.sql` di root proyek siap di-copy ke Supabase SQL Editor (lengkap dengan RLS policies, trigger `updated_at`, dan 3 pesanan simulasi awal total 15 cup).

---

## 📦 Menjalankan Proyek Lokal

1. **Jalankan development server:**
   ```bash
   npm run dev
   ```
2. **Build untuk produksi:**
   ```bash
   npm run build
   ```
3. **Preview build produksi:**
   ```bash
   npm run preview
   ```

---

## ☁️ Menghubungkan ke Supabase (Opsional)

Jika ingin data tersinkronisasi antar-perangkat:
1. Buat project baru di [Supabase](https://supabase.com).
2. Buka **SQL Editor** di dashboard Supabase, lalu jalankan seluruh query dari file [`supabase_schema.sql`](file:///c:/Users/HP/Downloads/lasagna-personal-cup/supabase_schema.sql).
3. Buat file `.env` dan isi:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_PIN=1234
   VITE_WHATSAPP_NUMBER=6285889167365
   ```
4. Restart development server (`npm run dev`). Status di dashboard admin akan otomatis beralih dari `LocalStorage Demo` ke `Supabase Cloud`.

---

## 🌐 Deploy ke Netlify

1. Upload repository atau folder ini ke GitHub / Netlify.
2. Build Settings di Netlify:
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`
3. Aplikasi akan langsung aktif dan dapat langsung dites karena memiliki fallback `localStorage` cerdas!
