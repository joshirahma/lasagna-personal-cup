import React from 'react'
import { Sparkles, CheckCircle2, ChevronDown, Flame, Utensils } from 'lucide-react'
import { BRAND_NAME, PRICE_PER_CUP, CAMPUS_NAME, PRODUCT_IMAGE_URL } from '../../lib/constants'
import { formatRupiah } from '../../lib/formatters'
import lasagnaImg from '../../assets/lasagna.jpg'
import lasagnaWideImg from '../../assets/lasagna-wide.jpg'

export default function Hero({ onOrderClick }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 md:py-10">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-tomato-200/50 via-cheese-200/30 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* PO Batch Active Banner */}
      <div className="max-w-md mx-auto px-4 mb-4">
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-tomato-500 to-tomato-600 text-white shadow-md shadow-tomato-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cheese-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cheese-400"></span>
            </span>
            <span className="font-semibold tracking-wide">
              BATCH PRE-ORDER AKTIF
            </span>
          </div>
          <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded-full text-cheese-100">
            Khusus STMI Jakarta
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 text-center">
        {/* Badge Ready to Eat & Porsi Personal */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cheese-100 border border-cheese-300 text-crust-900 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-tomato-500" />
          <span>Ready to Eat • Porsi Personal</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-crust-950 leading-tight mb-2">
          {BRAND_NAME}
        </h1>

        <p className="text-sm md:text-base font-semibold text-tomato-600 mb-4">
          Hangat, Gurih Daging Sapi & Keju Lumer Praktis Masuk Kelas
        </p>

        {/* Real Product Photo Showcase */}
        <div className="relative my-5 mx-auto max-w-xs group">
          <div className="absolute -inset-1 bg-gradient-to-r from-tomato-500 via-cheese-400 to-crust-600 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500"></div>
          
          <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-warmbg-300 overflow-hidden">
            {/* Foto Produk Asli */}
            <div className="relative h-56 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={PRODUCT_IMAGE_URL || lasagnaImg}
                alt="Lasagna Personal Cup Panggang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = lasagnaWideImg || '/lasagna.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-crust-950/70 via-transparent to-black/10 pointer-events-none"></div>

              {/* Price Tag Floating */}
              <div className="absolute top-2.5 right-2.5 bg-tomato-600/95 backdrop-blur-md text-white rounded-xl px-2.5 py-1.5 shadow-lg border-2 border-white transform rotate-2 hover:rotate-0 transition-transform">
                <span className="block text-[10px] uppercase font-bold text-cheese-200 leading-none">Hanya</span>
                <span className="text-base font-extrabold tracking-tight leading-tight">{formatRupiah(PRICE_PER_CUP)}</span>
                <span className="block text-[9px] text-white/90 leading-none">/ cup</span>
              </div>

              {/* Bottom Badge Over Image */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-left">
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-white">
                  <p className="text-[9px] text-cheese-300 font-bold uppercase tracking-wider leading-none">Porsi Personal 150ml</p>
                  <p className="text-[11px] font-extrabold leading-tight">Daging Sapi & Keju Leleh</p>
                </div>
                <div className="bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  100% Halal
                </div>
              </div>
            </div>

            {/* Micro Highlights below image */}
            <div className="grid grid-cols-3 gap-1 pt-3 text-center border-t border-warmbg-200 mt-2">
              <div className="p-1">
                <p className="text-[11px] font-bold text-crust-900">Béchamel</p>
                <p className="text-[10px] text-slate-500">Saus Krim Susu</p>
              </div>
              <div className="p-1 border-x border-warmbg-200">
                <p className="text-[11px] font-bold text-crust-900">Bolognese</p>
                <p className="text-[10px] text-slate-500">Daging Gurih</p>
              </div>
              <div className="p-1">
                <p className="text-[11px] font-bold text-crust-900">Alu-Foil</p>
                <p className="text-[10px] text-slate-500">Tahan Panas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Deskripsi Produk */}
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-5 px-1">
          Lasagna panggang berlapis pasta lembut pilihan, saus bolognese daging sapi cincang berempah, saus putih (<span className="italic font-semibold text-crust-800">béchamel</span>) creamy dari susu UHT, serta lelehan keju cheddar panggang dalam kemasan cup aluminium foil tahan panas yang praktis dibawa ke ruang kelas atau dinikmati saat jam istirahat.
        </p>

        {/* Key Feature Checkpoints */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-700 font-medium mb-6">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Porsi pas & kenyang</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free sendok higienis</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ambil di Lapangan STMI</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onOrderClick}
          className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-tomato-500 via-tomato-600 to-tomato-700 text-white font-bold text-sm shadow-warm hover:shadow-warm-lg active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <Flame className="w-4 h-4 text-cheese-300 group-hover:scale-110 transition-transform" />
          <span>Pesan Pre-Order Sekarang ({formatRupiah(PRICE_PER_CUP)})</span>
          <ChevronDown className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  )
}
