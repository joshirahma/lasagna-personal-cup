import React from 'react'
import { Flame, Shield, Search, Utensils, Sparkles } from 'lucide-react'
import { BRAND_NAME, CAMPUS_NAME } from '../lib/constants'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Navbar({ currentView, onNavigate, onOpenTracker }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warmbg-200 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => onNavigate('customer')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tomato-500 to-tomato-700 flex items-center justify-center text-white shadow-md shadow-tomato-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-cheese-200 fill-cheese-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base md:text-lg text-crust-950 tracking-tight leading-tight group-hover:text-tomato-600 transition-colors">
                {BRAND_NAME}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tomato-100 text-tomato-800">
                STMI
              </span>
            </div>
            <p className="text-[11px] text-crust-700/80 font-medium leading-none mt-0.5 flex items-center gap-1">
              <span>{CAMPUS_NAME}</span>
            </p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Cek Status Pesanan */}
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-crust-800 bg-warmbg-100 hover:bg-cheese-100 border border-warmbg-300 transition-all active:scale-95"
            title="Lacak status pesanan kamu"
          >
            <Search className="w-3.5 h-3.5 text-tomato-600" />
            <span className="hidden sm:inline">Cek Pesanan</span>
          </button>

          {/* Switch View Customer / Admin */}
          {currentView === 'customer' ? (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-crust-800 hover:bg-crust-900 shadow-sm transition-all active:scale-95"
              title="Akses Dashboard Admin"
            >
              <Shield className="w-3.5 h-3.5 text-cheese-300" />
              <span>Admin Tim</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('customer')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-tomato-700 bg-tomato-50 hover:bg-tomato-100 border border-tomato-200 shadow-sm transition-all active:scale-95"
              title="Kembali ke Halaman Pemesanan"
            >
              <Utensils className="w-3.5 h-3.5 text-tomato-600" />
              <span>Halaman Pembeli</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
