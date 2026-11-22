import React from 'react'
import {
  ClipboardList,
  Calculator,
  TrendingUp,
  LogOut,
  RotateCcw,
  Database,
  HardDrive
} from 'lucide-react'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminHeader({
  activeTab,
  onTabChange,
  onLogout,
  onResetData,
  totalOrdersCount = 0,
  activeCupsCount = 0
}) {
  const tabs = [
    {
      id: 'orders',
      label: 'Rekap Pesanan & COD',
      shortLabel: 'Pesanan',
      icon: ClipboardList,
      badge: totalOrdersCount,
    },
    {
      id: 'bom',
      label: 'Kalkulator BOM & Belanja',
      shortLabel: 'Kalkulator BOM',
      icon: Calculator,
      badge: `${activeCupsCount} cup`,
    },
    {
      id: 'finance',
      label: 'Keuangan & Master Resep',
      shortLabel: 'Keuangan',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="bg-white border-b border-warmbg-300 shadow-xs mb-6">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* Top bar with Admin Title and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-warmbg-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-crust-950">
                Dashboard Tim Produksi
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
                title={
                  isSupabaseConfigured
                    ? 'Tersambung ke Supabase Cloud'
                    : 'Berjalan di mode LocalStorage Offline/Demo'
                }
              >
                {isSupabaseConfigured ? (
                  <>
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>Supabase Cloud</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3 h-3 text-amber-600" />
                    <span>LocalStorage Demo</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola pesanan, distribusi COD, dan Bill of Materials (BOM) otomatis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-warmbg-100 hover:bg-warmbg-200 border border-warmbg-300 active:scale-95 transition"
              title="Reset data pesanan & bahan ke simulasi awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 transition"
              title="Keluar dari mode admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-tomato-500 text-white shadow-md shadow-tomato-500/20'
                    : 'text-slate-600 hover:text-crust-950 hover:bg-warmbg-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-warmbg-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
