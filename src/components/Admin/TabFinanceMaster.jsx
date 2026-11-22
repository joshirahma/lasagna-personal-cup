import React, { useState } from 'react'
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Percent,
  Edit2,
  RotateCcw,
  Plus,
  Coins,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react'
import { formatRupiah, formatNumber } from '../../lib/formatters'
import { PRICE_PER_CUP, INITIAL_BOM_INGREDIENTS } from '../../lib/constants'
import EditIngredientModal from './EditIngredientModal'

export default function TabFinanceMaster({
  orders,
  ingredients,
  onUpdateIngredient,
  onResetIngredients
}) {
  const [editingIngredient, setEditingIngredient] = useState(null)

  // Hitung total cup terpesan (pesanan yang tidak dibatalkan)
  const validOrders = orders.filter((o) => o.status !== 'Dibatalkan')
  const totalCups = validOrders.reduce((sum, o) => sum + (o.quantity || 0), 0)

  // Hitung HPP per cup standar saat ini dari daftar bahan
  const hppPerCup = ingredients.reduce((sum, ing) => {
    return sum + (ing.amount_per_cup || 0) * (ing.unit_price || 0)
  }, 0)

  // Kalkulasi Keuangan Bisnis
  const estimasiOmzetKotor = totalCups * PRICE_PER_CUP
  const totalHPP = totalCups * hppPerCup
  const estimasiLabaBersih = estimasiOmzetKotor - totalHPP
  const marginKeuntungan =
    estimasiOmzetKotor > 0 ? (estimasiLabaBersih / estimasiOmzetKotor) * 100 : 0

  return (
    <div className="space-y-6">
      {/* 5 Real-Time Financial Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-crust-950 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-tomato-500" />
            <span>Ringkasan Finansial Usaha Real-Time</span>
          </h2>
          <span className="text-xs text-slate-500">
            Dihitung dari {validOrders.length} pesanan sah ({totalCups} cup)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Cup */}
          <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              Total Cup Terpesan
            </span>
            <div className="text-2xl font-black text-crust-950">
              {totalCups} <span className="text-xs font-normal text-slate-500">cup</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              @ Rp 12.000 / cup
            </span>
          </div>

          {/* Card 2: Estimasi Omzet Kotor */}
          <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              Estimasi Omzet Kotor
            </span>
            <div className="text-xl font-extrabold text-tomato-600">
              {formatRupiah(estimasiOmzetKotor)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Penerimaan kotor penjualan
            </span>
          </div>

          {/* Card 3: Total HPP */}
          <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              Total Biaya HPP
            </span>
            <div className="text-xl font-extrabold text-crust-800">
              {formatRupiah(totalHPP)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Bahan baku & operasional
            </span>
          </div>

          {/* Card 4: HPP per Cup */}
          <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              HPP per 1 Cup
            </span>
            <div className="text-xl font-extrabold text-crust-950">
              {formatRupiah(hppPerCup)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Laba kotor: {formatRupiah(PRICE_PER_CUP - hppPerCup)}/cup
            </span>
          </div>

          {/* Card 5: Estimasi Laba Bersih & Margin */}
          <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-700 p-4 rounded-2xl text-white shadow-md shadow-emerald-500/20">
            <span className="text-[11px] text-emerald-100 font-semibold block mb-1">
              Estimasi Laba Bersih
            </span>
            <div className="text-xl font-extrabold text-white">
              {formatRupiah(estimasiLabaBersih)}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-emerald-100">
              <span>Margin Laba:</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">
                {marginKeuntungan.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Master Bahan & Resep Setting Table */}
      <div className="bg-white rounded-3xl border border-warmbg-300 shadow-xs overflow-hidden">
        <div className="p-4 md:p-5 bg-warmbg-100/60 border-b border-warmbg-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-crust-950">
              Master Bahan & Resep Standar (12 Item)
            </h3>
            <p className="text-xs text-slate-500">
              Klik <b>"Edit"</b> pada bahan untuk mengubah takaran resep atau harga pasar.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Kembalikan semua bahan ke resep dan harga standar awal?')) {
                onResetIngredients()
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-warmbg-300 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Resep Standar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warmbg-50 text-slate-600 border-b border-warmbg-200 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Bahan</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Takaran / Cup</th>
                <th className="py-3 px-3">Harga Satuan</th>
                <th className="py-3 px-3">Basis Kemasan Beli</th>
                <th className="py-3 px-3 text-right">Biaya / Cup</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmbg-200">
              {ingredients.map((ing) => {
                const costThisCup = (ing.amount_per_cup || 0) * (ing.unit_price || 0)
                return (
                  <tr key={ing.id} className="hover:bg-warmbg-50/70 transition">
                    <td className="py-3 px-4 font-bold text-crust-950">
                      <div>{ing.name}</div>
                      {ing.notes && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          {ing.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-warmbg-200 text-slate-700 whitespace-nowrap">
                        {ing.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {formatNumber(ing.amount_per_cup, 2)} {ing.unit}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                      {formatRupiah(ing.unit_price)} / {ing.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {formatRupiah(ing.package_price)} / {formatNumber(ing.package_size)} {ing.package_unit}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-tomato-600 whitespace-nowrap">
                      {formatRupiah(costThisCup)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setEditingIngredient(ing)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-tomato-700 bg-tomato-50 hover:bg-tomato-100 border border-tomato-200 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-warmbg-100 font-extrabold text-xs text-crust-950 border-t-2 border-warmbg-300">
              <tr>
                <td colSpan="5" className="py-3 px-4 text-right">
                  TOTAL HPP RESEP PER 1 CUP LASAGNA:
                </td>
                <td className="py-3 px-3 text-right text-sm text-tomato-600">
                  {formatRupiah(hppPerCup)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingIngredient && (
        <EditIngredientModal
          ingredient={editingIngredient}
          onSave={onUpdateIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </div>
  )
}
