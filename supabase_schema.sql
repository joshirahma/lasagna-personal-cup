-- =========================================================================
-- SUPABASE SCHEMA: LASAGNA PERSONAL CUP (KAMPUS POLITEKNIK STMI JAKARTA)
-- =========================================================================
-- Schema untuk aplikasi Pre-Order dan Sistem Manajemen Usaha Kuliner Kampus
-- Termasuk tabel 'orders', 'bom_ingredients', Row Level Security (RLS),
-- dan Seed Data Awal (3 pesanan simulasi total 15 cup + 12 standar bahan).
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL ORDERS (PESANAN PRE-ORDER)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_role VARCHAR(100) NOT NULL, -- Contoh: Mahasiswa TI-2A, Dosen Otomotif, Staf
    whatsapp_number VARCHAR(25) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 12000,
    total_price NUMERIC(12, 2) NOT NULL,
    cod_location VARCHAR(100) NOT NULL,  -- Selasar Gedung A, Kantin Kampus, Lobi Utama, Area Parkir / Gerbang Utama
    cod_time VARCHAR(100) NOT NULL,      -- Istirahat Pagi (09.30 - 10.00), Istirahat Siang (12.00 - 13.00), Sore Pulang Kuliah (15.30 - 16.30)
    notes TEXT DEFAULT '',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diproses', 'Siap COD', 'Selesai', 'Dibatalkan')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index untuk filter query cepat
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_cod_time ON public.orders(cod_time);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. TABEL BOM_INGREDIENTS (BILL OF MATERIALS / MASTER BAHAN & RESEP)
CREATE TABLE IF NOT EXISTS public.bom_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Bahan Utama', -- 'Bahan Utama', 'Bumbu & Rempah', 'Kemasan & Operasional'
    amount_per_cup NUMERIC(10, 4) NOT NULL,             -- Takaran per 1 cup
    unit VARCHAR(20) NOT NULL,                           -- gram, pack, ml, buah, bonggol, porsi, set
    unit_price NUMERIC(12, 2) NOT NULL,                  -- Harga satuan per unit (misal Rp 150/gram)
    package_size NUMERIC(10, 2) NOT NULL,               -- Ukuran kemasan beli (misal 600 untuk 600 gr)
    package_price NUMERIC(12, 2) NOT NULL,              -- Harga 1 kemasan di pasar (misal Rp 90.000)
    package_unit VARCHAR(20) NOT NULL,                  -- gram, pack, ml, buah, bonggol, porsi, set
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index kode bahan
CREATE INDEX IF NOT EXISTS idx_bom_code ON public.bom_ingredients(code);

-- 4. FUNCTION & TRIGGER UNTUK AUTO-UPDATE UPDATED_AT
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_bom_ingredients_updated_at ON public.bom_ingredients;
CREATE TRIGGER trigger_bom_ingredients_updated_at
BEFORE UPDATE ON public.bom_ingredients
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- 5. ROW LEVEL SECURITY (RLS)
-- Mengaktifkan RLS agar aman namun tetap mengizinkan operasi public (dengan anon key)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_ingredients ENABLE ROW LEVEL SECURITY;

-- Policy untuk orders: public dapat membaca dan menambahkan pesanan baru, serta update status
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete orders" ON public.orders;
CREATE POLICY "Public can delete orders" ON public.orders
    FOR DELETE USING (true);

-- Policy untuk bom_ingredients: public dapat melihat dan mengedit bahan/resep
DROP POLICY IF EXISTS "Public can view ingredients" ON public.bom_ingredients;
CREATE POLICY "Public can view ingredients" ON public.bom_ingredients
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert ingredients" ON public.bom_ingredients;
CREATE POLICY "Public can insert ingredients" ON public.bom_ingredients
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update ingredients" ON public.bom_ingredients;
CREATE POLICY "Public can update ingredients" ON public.bom_ingredients
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete ingredients" ON public.bom_ingredients;
CREATE POLICY "Public can delete ingredients" ON public.bom_ingredients
    FOR DELETE USING (true);

-- 6. SEED DATA AWAL: 12 MASTER BAHAN STANDAR (BOM)
INSERT INTO public.bom_ingredients (code, name, category, amount_per_cup, unit, unit_price, package_size, package_price, package_unit, notes)
VALUES
    ('daging_sapi', 'Daging sapi giling', 'Bahan Utama', 24.0000, 'gram', 150.00, 600.00, 90000.00, 'gram', 'Daging sapi segar giling halus (Rp 90.000 / 600 gr)'),
    ('la_fonte_lasagna', 'La Fonte lasagna sheet', 'Bahan Utama', 0.0800, 'pack', 24000.00, 1.00, 24000.00, 'pack', 'Pasta lasagna instan (Rp 48.000 / 2 pack = Rp 24.000/pack)'),
    ('susu_uht_plain', 'Susu UHT plain', 'Bahan Utama', 40.0000, 'ml', 20.00, 1000.00, 20000.00, 'ml', 'Susu cair putih untuk saus bechamel (Rp 20.000 / 1000 ml)'),
    ('saus_tomat', 'Saus tomat', 'Bahan Utama', 20.0000, 'gram', 30.00, 500.00, 15000.00, 'gram', 'Saus tomat bolognese base (Rp 15.000 / 500 gr)'),
    ('keju_cheddar', 'Keju cheddar parut', 'Bahan Utama', 10.0000, 'gram', 120.00, 250.00, 30000.00, 'gram', 'Keju cheddar leleh topping panggang (Rp 30.000 / 250 gr)'),
    ('margarin', 'Margarin', 'Bahan Utama', 8.0000, 'gram', 40.00, 200.00, 8000.00, 'gram', 'Untuk tumis daging dan roux bechamel (Rp 8.000 / 200 gr)'),
    ('tepung_terigu', 'Tepung terigu', 'Bahan Utama', 10.0000, 'gram', 20.00, 250.00, 5000.00, 'gram', 'Pengental saus putih bechamel (Rp 5.000 / 250 gr)'),
    ('bawang_bombai', 'Bawang bombai', 'Bumbu & Rempah', 0.0400, 'buah', 5000.00, 1.00, 5000.00, 'buah', 'Bawang bombai segar cincang (Rp 5.000 / buah)'),
    ('bawang_putih', 'Bawang putih', 'Bumbu & Rempah', 0.0400, 'bonggol', 4000.00, 1.00, 4000.00, 'bonggol', 'Bawang putih kating aromatik (Rp 4.000 / bonggol)'),
    ('bumbu_pelengkap', 'Bumbu & pelengkap (oregano, lada, garam, gula, kaldu)', 'Bumbu & Rempah', 1.0000, 'porsi', 400.00, 1.00, 400.00, 'porsi', 'Rempah oregano kering, merica, kaldu sapi, garam, gula'),
    ('kemasan_cup_set', 'Kemasan (Cup aluminium foil + sendok + label stiker)', 'Kemasan & Operasional', 1.0000, 'set', 1000.00, 1.00, 1000.00, 'set', 'Cup aluminium foil tahan oven + sendok plastik higienis + stiker brand'),
    ('alokasi_gas_listrik', 'Alokasi gas oven & listrik pemanggang', 'Kemasan & Operasional', 1.0000, 'porsi', 400.00, 1.00, 400.00, 'porsi', 'Biaya utilitas pemanggangan oven per cup')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    amount_per_cup = EXCLUDED.amount_per_cup,
    unit = EXCLUDED.unit,
    unit_price = EXCLUDED.unit_price,
    package_size = EXCLUDED.package_size,
    package_price = EXCLUDED.package_price,
    package_unit = EXCLUDED.package_unit,
    notes = EXCLUDED.notes;

-- 7. SEED DATA AWAL: 3 PESANAN SIMULASI (TOTAL 15 CUP)
-- Untuk demonstrasi awal langsung menghitung omzet Rp 180.000 & kalkulasi BOM aktif
INSERT INTO public.orders (order_number, customer_name, customer_role, whatsapp_number, quantity, unit_price, total_price, cod_location, cod_time, notes, status, created_at)
VALUES
    (
        'LPC-1001',
        'Aurel Tiara',
        'Mahasiswa TI - 2A',
        '081298765432',
        5,
        12000.00,
        60000.00,
        'Kantin Kampus',
        'Istirahat Siang (12.00 - 13.00)',
        'Extra saus bechamel kalau bisa ya kak, terima kasih!',
        'Diproses',
        NOW() - INTERVAL '3 hours'
    ),
    (
        'LPC-1002',
        'Pak Dimas Prasetyo',
        'Dosen Otomotif',
        '085612345678',
        6,
        12000.00,
        72000.00,
        'Lobi Utama',
        'Istirahat Siang (12.00 - 13.00)',
        'Untuk rapat kecil dosen prodi di ruang rapat.',
        'Pending',
        NOW() - INTERVAL '1 hour 30 minutes'
    ),
    (
        'LPC-1003',
        'Nabila Shafa',
        'Staf Akademik BAAK',
        '087811223344',
        4,
        12000.00,
        48000.00,
        'Selasar Gedung A',
        'Istirahat Pagi (09.30 - 10.00)',
        'Langsung antar ke meja BAAK kalau sudah sampai di selasar ya.',
        'Siap COD',
        NOW() - INTERVAL '45 minutes'
    )
ON CONFLICT (order_number) DO NOTHING;

-- Selesai! Schema siap digunakan di Supabase SQL Editor.
