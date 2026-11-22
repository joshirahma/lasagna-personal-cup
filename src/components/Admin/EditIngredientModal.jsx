import React, { useState } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { formatRupiah } from '../../lib/formatters'

export default function EditIngredientModal({ ingredient, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: ingredient.name || '',
    category: ingredient.category || 'Bahan Utama',
    amount_per_cup: ingredient.amount_per_cup || 0,
    unit: ingredient.unit || 'gram',
    unit_price: ingredient.unit_price || 0,
    package_size: ingredient.package_size || 1,
    package_price: ingredient.package_price || 0,
    package_unit: ingredient.package_unit || ingredient.unit || 'gram',
    notes: ingredient.notes || '',
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(ingredient.id, formData)
      onClose()
    } catch (err) {
      alert('Gagal menyimpan perubahan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const costPerCup = (formData.amount_per_cup || 0) * (formData.unit_price || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crust-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-warmbg-300 animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-crust-950 mb-1">
          Edit Master Bahan & Resep
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Perubahan takaran atau harga akan otomatis memperbarui kalkulator BOM dan HPP usaha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nama Bahan */}
          <div>
            <label className="block font-bold text-crust-900 mb-1">Nama Bahan</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300 focus:ring-2 focus:ring-tomato-500"
              required
            />
          </div>

          {/* Kategori & Satuan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-crust-900 mb-1">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300 bg-white"
              >
                <option value="Bahan Utama">Bahan Utama</option>
                <option value="Bumbu & Rempah">Bumbu & Rempah</option>
                <option value="Kemasan & Operasional">Kemasan & Operasional</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">Satuan Takar</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="gram / ml / pack / buah / set"
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
                required
              />
            </div>
          </div>

          {/* Takaran per cup & Harga Satuan */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-warmbg-50 border border-warmbg-200">
            <div>
              <label className="block font-bold text-crust-900 mb-1">
                Takaran / 1 Cup ({formData.unit})
              </label>
              <input
                type="number"
                step="any"
                name="amount_per_cup"
                value={formData.amount_per_cup}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300 font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">
                Harga per Satuan (Rp)
              </label>
              <input
                type="number"
                step="any"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300 font-bold"
                required
              />
            </div>
            <div className="col-span-2 pt-1 border-t border-warmbg-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">Biaya Bahan per 1 Cup:</span>
              <span className="font-extrabold text-tomato-600 text-sm">
                {formatRupiah(costPerCup)}
              </span>
            </div>
          </div>

          {/* Ukuran Kemasan Beli & Harga Kemasan */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-crust-900 mb-1">
                Ukuran Kemasan
              </label>
              <input
                type="number"
                step="any"
                name="package_size"
                value={formData.package_size}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">
                Satuan Kemasan
              </label>
              <input
                type="text"
                name="package_unit"
                value={formData.package_unit}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">
                Harga 1 Kemasan (Rp)
              </label>
              <input
                type="number"
                step="any"
                name="package_price"
                value={formData.package_price}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300 font-bold"
                required
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block font-bold text-crust-900 mb-1">
              Catatan / Basis Pembelian Pasar
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh: Daging sapi giling (Rp 90.000 / 600 gr)"
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-warmbg-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tomato-500 hover:bg-tomato-600 text-white font-bold transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
