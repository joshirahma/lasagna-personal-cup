import React, { useState } from 'react'
import {
  Calculator,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  Coins
} from 'lucide-react'
import { formatRupiah, formatNumber, formatShoppingListWhatsApp } from '../../lib/formatters'

export default function TabBOMCalculator({ orders, ingredients }) {
  // Mode: 'active' (otomatis hitung dari pesanan aktif) atau 'custom' (simulasi manual)
  const [calcMode, setCalcMode] = useState('active')
  const [customCups, setCustomCups] = useState(20)
  const [copied, setCopied] = useState(false)

  // Hitung cup dari pesanan aktif (Menunggu Verifikasi + Diproses + Siap Diambil)
  const activeOrders = orders.filter((o) =>
    ['Menunggu Verifikasi', 'Pending', 'Diproses', 'Siap COD', 'Siap Diambil'].includes(o.status)
  )
  const activeCupsCount = activeOrders.reduce(
    (sum, o) => sum + (o.quantity || 0),
    0
  )

  const productionCups =
    calcMode === 'active' ? Math.max(0, activeCupsCount) : Math.max(1, customCups)

  // Hitung detail BOM per bahan
  const bomRows = ingredients.map((ing) => {
    const totalAmount = (ing.amount_per_cup || 0) * productionCups
    const recipeCost = totalAmount * (ing.unit_price || 0)

    // Perhitungan rekomendasi pembulatan kemasan beli
    let recommendedPackages = 1
    if (ing.package_size && ing.package_size > 0) {
      recommendedPackages = Math.max(1, Math.ceil(totalAmount / ing.package_size))
    } else {
      recommendedPackages = Math.max(1, Math.ceil(totalAmount))
    }

    const shoppingOutlay = recommendedPackages * (ing.package_price || ing.unit_price)

    return {
      ...ing,
      total_amount_needed: totalAmount,
      recipe_cost: recipeCost,
      recommended_packages: recommendedPackages,
      shopping_outlay: shoppingOutlay,
    }
  })

  // Total biaya
  const totalRecipeHPP = bomRows.reduce((sum, r) => sum + r.recipe_cost, 0)
  const totalShoppingOutlay = bomRows.reduce((sum, r) => sum + r.shopping_outlay, 0)
  const hppPerCup = productionCups > 0 ? totalRecipeHPP / productionCups : 0

  const handleCopyShoppingList = () => {
    const text = formatShoppingListWhatsApp(bomRows, productionCups)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Target Cup Controller Card */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-warmbg-300 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-warmbg-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-tomato-100 text-tomato-600 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-crust-950">
                Kalkulator Bill of Materials (BOM)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Otomatis menghitung gramasi takaran masak dan kebutuhan belanja kemasan pasar
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-warmbg-100 p-1.5 rounded-2xl border border-warmbg-300 self-start md:self-auto">
            <button
              onClick={() => setCalcMode('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                calcMode === 'active'
                  ? 'bg-white text-tomato-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pesanan Aktif ({activeCupsCount} cup)
            </button>
            <button
              onClick={() => setCalcMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                calcMode === 'custom'
                  ? 'bg-white text-tomato-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulasi Manual
            </button>
          </div>
        </div>

        {/* Cup Target Details */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cheese-400 to-amber-500 text-crust-950 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs font-semibold uppercase leading-none">Target</span>
              <span className="text-xl font-black leading-none mt-0.5">
                {productionCups}
              </span>
              <span className="text-[9px] font-bold uppercase leading-none">Cup</span>
            </div>

            <div>
              <p className="text-xs font-bold text-crust-950">
                {calcMode === 'active'
                  ? `Dihitung dari ${activeOrders.length} Pesanan Aktif (Pending, Diproses, Siap COD)`
                  : 'Simulasi Batch Produksi Terencana'}
              </p>
              <p className="text-[11px] text-slate-500">
                Standar takaran resep proporsional otomatis di bawah:
              </p>
            </div>
          </div>

          {calcMode === 'custom' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">
                Ubah Jumlah Cup:
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={customCups}
                onChange={(e) => setCustomCups(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-1.5 rounded-xl border border-warmbg-300 font-bold text-center text-sm focus:ring-2 focus:ring-tomato-500"
              />
              <span className="text-xs font-medium text-slate-500">cup</span>
            </div>
          )}

          {/* Copy WhatsApp Shopping List Button */}
          <button
            onClick={handleCopyShoppingList}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Berhasil Disalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Daftar Belanja ke WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Financial Impact Cards from BOM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">
            HPP Resep per 1 Cup
          </span>
          <div className="text-xl font-extrabold text-crust-950">
            {formatRupiah(hppPerCup)}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            Harga jual: {formatRupiah(12000)} • Margin {(100 - (hppPerCup / 12000) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">
            Total HPP Resep ({productionCups} cup)
          </span>
          <div className="text-xl font-extrabold text-tomato-600">
            {formatRupiah(totalRecipeHPP)}
          </div>
          <span className="text-[10px] text-slate-400">
            Biaya proporsional bahan habis terpakai
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warmbg-300 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">
            Estimasi Belanja Beli Kemasan Penuh
          </span>
          <div className="text-xl font-extrabold text-blue-600">
            {formatRupiah(totalShoppingOutlay)}
          </div>
          <span className="text-[10px] text-slate-400">
            Uang tunai cash belanja di pasar/supermarket
          </span>
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-white rounded-3xl border border-warmbg-300 shadow-xs overflow-hidden">
        <div className="p-4 bg-warmbg-100/60 border-b border-warmbg-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-crust-950">
            Tabel Kebutuhan Produksi & Belanja (12 Bahan Terstandarisasi)
          </h3>
          <span className="text-xs text-slate-500">
            Basis: {productionCups} cup
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warmbg-50 text-slate-600 border-b border-warmbg-200 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Bahan</th>
                <th className="py-3 px-3">Takaran / Cup</th>
                <th className="py-3 px-3">Total Takaran Masak</th>
                <th className="py-3 px-3">Rekomendasi Beli</th>
                <th className="py-3 px-3 text-right">Biaya Resep</th>
                <th className="py-3 px-4 text-right">Est. Belanja Kemasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmbg-200">
              {bomRows.map((row) => (
                <tr key={row.id} className="hover:bg-warmbg-50/70 transition">
                  {/* Nama Bahan & Kategori */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-crust-950">{row.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-warmbg-200 text-slate-600 font-semibold">
                        {row.category}
                      </span>
                      <span>{row.notes}</span>
                    </div>
                  </td>

                  {/* Takaran per cup */}
                  <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {formatNumber(row.amount_per_cup, 2)} {row.unit}
                  </td>

                  {/* Total takaran masak */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-extrabold text-crust-950 bg-cheese-100 px-2 py-0.5 rounded-md border border-cheese-300">
                      {formatNumber(row.total_amount_needed, 2)} {row.unit}
                    </span>
                  </td>

                  {/* Rekomendasi beli */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {row.recommended_packages} {row.package_unit}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      (@ {formatNumber(row.package_size)} {row.unit})
                    </span>
                  </td>

                  {/* Biaya resep proporsional */}
                  <td className="py-3 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                    {formatRupiah(row.recipe_cost)}
                  </td>

                  {/* Biaya beli kemasan penuh */}
                  <td className="py-3 px-4 text-right font-bold text-tomato-600 whitespace-nowrap">
                    {formatRupiah(row.shopping_outlay)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-warmbg-100 font-extrabold text-xs text-crust-950 border-t-2 border-warmbg-300">
              <tr>
                <td colSpan="4" className="py-3 px-4 text-right">
                  TOTAL KEBUTUHAN BIAYA ({productionCups} CUP):
                </td>
                <td className="py-3 px-3 text-right text-sm text-tomato-600">
                  {formatRupiah(totalRecipeHPP)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-blue-600">
                  {formatRupiah(totalShoppingOutlay)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
