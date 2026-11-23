export const BRAND_NAME = "Lasagna Personal Cup"
export const BRAND_TAGLINE = "Hangat, Gurih & Creamy – Porsi Personal Pas Buat Ngampus"
export const CAMPUS_NAME = "Politeknik STMI Jakarta"
export const PRICE_PER_CUP = 12000
export const DEFAULT_WHATSAPP = "6285889167365"
export const DEFAULT_ADMIN_PIN = "1234"

export const DEFAULT_PICKUP_LOCATION = "Lapangan Politeknik STMI Jakarta"
export const DEFAULT_PICKUP_TIME_INFO = "Dihubungi via WhatsApp saat siap diambil"

export const PRODUCT_IMAGE_URL = "/lasagna.jpg"
export const QRIS_IMAGE_URL = "/qris.jpg"

export const COD_LOCATIONS = [
  "Lapangan Politeknik STMI Jakarta",
  "Selasar Gedung A",
  "Kantin Kampus",
  "Lobi Utama",
]

export const COD_TIMES = [
  "Dihubungi via WhatsApp saat siap diambil",
  "Istirahat Pagi (09.30 - 10.00)",
  "Istirahat Siang (12.00 - 13.00)",
  "Sore Pulang Kuliah (15.30 - 16.30)",
]

export const ORDER_STATUSES = [
  { id: "Semua", label: "Semua Pesanan", color: "bg-slate-100 text-slate-700" },
  { id: "Menunggu Verifikasi", label: "Menunggu Verifikasi", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "Diproses", label: "Diproses", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "Siap Diambil", label: "Siap Diambil", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "Selesai", label: "Selesai", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "Dibatalkan", label: "Dibatalkan", color: "bg-rose-100 text-rose-800 border-rose-300" },
]

export const INITIAL_BOM_INGREDIENTS = [
  {
    id: "ing-1",
    code: "daging_sapi",
    name: "Daging sapi giling",
    category: "Bahan Utama",
    amount_per_cup: 24, // gram
    unit: "gram",
    unit_price: 150, // Rp/gram
    package_size: 600, // gram per pack
    package_price: 90000,
    package_unit: "gram",
    notes: "Daging sapi segar giling halus (Rp 90.000 / 600 gr)",
  },
  {
    id: "ing-2",
    code: "la_fonte_lasagna",
    name: "La Fonte lasagna sheet",
    category: "Bahan Utama",
    amount_per_cup: 0.08, // pack
    unit: "pack",
    unit_price: 24000, // Rp/pack
    package_size: 1,
    package_price: 24000,
    package_unit: "pack",
    notes: "Pasta lasagna instan (Rp 48.000 / 2 pack = Rp 24.000/pack)",
  },
  {
    id: "ing-3",
    code: "susu_uht_plain",
    name: "Susu UHT plain",
    category: "Bahan Utama",
    amount_per_cup: 40, // ml
    unit: "ml",
    unit_price: 20, // Rp/ml
    package_size: 1000,
    package_price: 20000,
    package_unit: "ml",
    notes: "Susu cair putih untuk saus bechamel (Rp 20.000 / 1000 ml)",
  },
  {
    id: "ing-4",
    code: "saus_tomat",
    name: "Saus tomat",
    category: "Bahan Utama",
    amount_per_cup: 20, // gram
    unit: "gram",
    unit_price: 30, // Rp/gram
    package_size: 500,
    package_price: 15000,
    package_unit: "gram",
    notes: "Saus tomat bolognese base (Rp 15.000 / 500 gr)",
  },
  {
    id: "ing-5",
    code: "keju_cheddar",
    name: "Keju cheddar parut",
    category: "Bahan Utama",
    amount_per_cup: 10, // gram
    unit: "gram",
    unit_price: 120, // Rp/gram
    package_size: 250,
    package_price: 30000,
    package_unit: "gram",
    notes: "Keju cheddar topping panggang lumer (Rp 30.000 / 250 gr)",
  },
  {
    id: "ing-6",
    code: "margarin",
    name: "Margarin",
    category: "Bahan Utama",
    amount_per_cup: 8, // gram
    unit: "gram",
    unit_price: 40, // Rp/gram
    package_size: 200,
    package_price: 8000,
    package_unit: "gram",
    notes: "Untuk tumis saus daging dan roux béchamel (Rp 8.000 / 200 gr)",
  },
  {
    id: "ing-7",
    code: "tepung_terigu",
    name: "Tepung terigu",
    category: "Bahan Utama",
    amount_per_cup: 10, // gram
    unit: "gram",
    unit_price: 20, // Rp/gram
    package_size: 250,
    package_price: 5000,
    package_unit: "gram",
    notes: "Pengental saus putih béchamel (Rp 5.000 / 250 gr)",
  },
  {
    id: "ing-8",
    code: "bawang_bombai",
    name: "Bawang bombai",
    category: "Bumbu & Rempah",
    amount_per_cup: 0.04, // buah
    unit: "buah",
    unit_price: 5000, // Rp/buah
    package_size: 1,
    package_price: 5000,
    package_unit: "buah",
    notes: "Bawang bombai segar cincang (Rp 5.000 / buah)",
  },
  {
    id: "ing-9",
    code: "bawang_putih",
    name: "Bawang putih",
    category: "Bumbu & Rempah",
    amount_per_cup: 0.04, // bonggol
    unit: "bonggol",
    unit_price: 4000, // Rp/bonggol
    package_size: 1,
    package_price: 4000,
    package_unit: "bonggol",
    notes: "Bawang putih kating aromatik (Rp 4.000 / bonggol)",
  },
  {
    id: "ing-10",
    code: "bumbu_pelengkap",
    name: "Bumbu & pelengkap (oregano, lada, garam, gula, kaldu)",
    category: "Bumbu & Rempah",
    amount_per_cup: 1, // porsi
    unit: "porsi",
    unit_price: 400, // Rp/porsi
    package_size: 1,
    package_price: 400,
    package_unit: "porsi",
    notes: "Rempah oregano kering, merica, kaldu sapi, garam, gula",
  },
  {
    id: "ing-11",
    code: "kemasan_cup_set",
    name: "Kemasan (Aluminium foil box + sendok + stiker label)",
    category: "Kemasan & Operasional",
    amount_per_cup: 1, // set
    unit: "set",
    unit_price: 1000, // Rp/set
    package_size: 1,
    package_price: 1000,
    package_unit: "set",
    notes: "Cup aluminium foil tahan oven + sendok makan higienis + stiker brand",
  },
  {
    id: "ing-12",
    code: "alokasi_gas_listrik",
    name: "Alokasi Gas & Listrik Oven",
    category: "Kemasan & Operasional",
    amount_per_cup: 1, // porsi
    unit: "porsi",
    unit_price: 400, // Rp/porsi
    package_size: 1,
    package_price: 400,
    package_unit: "porsi",
    notes: "Biaya utilitas pemanggangan oven per cup",
  },
]

export const INITIAL_ORDERS = [
  {
    id: "ord-seed-001",
    order_number: "LPC-1001",
    customer_name: "Aurel Tiara",
    customer_role: "Mahasiswa TI - 2A",
    whatsapp_number: "081298765432",
    quantity: 5,
    unit_price: 12000,
    total_price: 60000,
    cod_location: "Lapangan Politeknik STMI Jakarta",
    cod_time: "Dihubungi via WhatsApp saat siap diambil",
    notes: "Extra saus bechamel kalau bisa ya kak, terima kasih!",
    payment_proof: "/qris.jpg",
    status: "Diproses",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "ord-seed-002",
    order_number: "LPC-1002",
    customer_name: "Pak Dimas Prasetyo",
    customer_role: "Dosen Otomotif",
    whatsapp_number: "085612345678",
    quantity: 6,
    unit_price: 12000,
    total_price: 72000,
    cod_location: "Lapangan Politeknik STMI Jakarta",
    cod_time: "Dihubungi via WhatsApp saat siap diambil",
    notes: "Untuk rapat dosen prodi di ruang rapat.",
    payment_proof: "/qris.jpg",
    status: "Menunggu Verifikasi",
    created_at: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
  },
  {
    id: "ord-seed-003",
    order_number: "LPC-1003",
    customer_name: "Nabila Shafa",
    customer_role: "Staf Akademik BAAK",
    whatsapp_number: "087811223344",
    quantity: 4,
    unit_price: 12000,
    total_price: 48000,
    cod_location: "Lapangan Politeknik STMI Jakarta",
    cod_time: "Dihubungi via WhatsApp saat siap diambil",
    notes: "Siap ambil di lapangan saat jam istirahat ya kak.",
    payment_proof: "/qris.jpg",
    status: "Siap Diambil",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
]
