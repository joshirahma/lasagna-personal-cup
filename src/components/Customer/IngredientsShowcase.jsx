import React from 'react'
import { UtensilsCrossed, ShieldAlert, Sparkles, PackageCheck, Soup, Leaf } from 'lucide-react'

export default function IngredientsShowcase() {
  return (
    <section className="max-w-md mx-auto px-4 py-6" id="ingredients-section">
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-warmbg-300">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-tomato-100 flex items-center justify-center text-tomato-700">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-crust-950 leading-tight">
              Komposisi & Bahan Berkualitas
            </h2>
            <p className="text-xs text-slate-500">
              Transparansi resep teruji higienis & halal
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Kami mengutamakan cita rasa otentik yang creamy dan kaya rempah dengan komposisi bahan pangan pilihan:
        </p>

        {/* 3 Blocks of Ingredients */}
        <div className="space-y-3.5">
          {/* 1. Bahan Utama */}
          <div className="p-3.5 rounded-2xl bg-warmbg-100/70 border border-warmbg-300/80">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-lg bg-tomato-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                🥩
              </span>
              <h3 className="text-xs font-bold text-crust-900 uppercase tracking-wide">
                Bahan Utama Pilihan
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Pasta lasagna lembaran pilihan, daging sapi giling berkualitas, saus bolognese gurih, saus putih creamy béchamel (<span className="text-crust-900 font-medium">susu UHT plain, margarin premium, tepung terigu</span>), serta taburan keju cheddar panggang hingga keemasan.
            </p>
          </div>

          {/* 2. Bumbu & Rempah Alami */}
          <div className="p-3.5 rounded-2xl bg-cheese-50 border border-cheese-200">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-lg bg-cheese-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                🌿
              </span>
              <h3 className="text-xs font-bold text-crust-900 uppercase tracking-wide">
                Bumbu & Rempah Alami
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Saus tomat segar, rajangan bawang bombai, bawang putih aromatik, oregano kering Italia, lada hitam & putih, kaldu sapi, garam beryodium, dan sentuhan gula penyeimbang rasa gurih-asam yang pas di lidah.
            </p>
          </div>

          {/* 3. Kemasan Higienis & Praktis */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-lg bg-crust-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                📦
              </span>
              <h3 className="text-xs font-bold text-crust-900 uppercase tracking-wide">
                Kemasan Higienis & Siap Santap
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Disajikan dalam <span className="font-semibold text-slate-800">cup aluminium foil tahan panas</span> standar food-grade (bisa langsung disantap hangat tanpa perlu piring tambahan) lengkap dengan <span className="font-semibold text-slate-800">sendok makan sekali pakai</span> higienis dan stiker label brand.
            </p>
          </div>
        </div>

        {/* Small informative allergy/preference notice */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-800">
            <span className="font-semibold">Catatan Alergen:</span> Mengandung produk olahan susu & gluten gandum. Silakan cantumkan di catatan pesanan bila memiliki permintaan atau preferensi khusus.
          </p>
        </div>
      </div>
    </section>
  )
}
