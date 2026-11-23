import React, { useState } from 'react'
import { X, Plus, ShoppingBag } from 'lucide-react'
import { PRICE_PER_CUP, COD_LOCATIONS, COD_TIMES } from '../../lib/constants'
import { formatRupiah } from '../../lib/formatters'

export default function AddOrderModal({ onAddOrder, onClose }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_role: 'Mahasiswa',
    whatsapp_number: '',
    quantity: 1,
    cod_location: 'Lapangan Politeknik STMI Jakarta',
    cod_time: 'Dihubungi via WhatsApp saat siap diambil',
    notes: 'Pesanan manual / walk-in',
    status: 'Diproses',
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.customer_name.trim()) {
      alert('Nama pemesan harus diisi')
      return
    }
    setSaving(true)
    try {
      await onAddOrder(formData)
      onClose()
    } catch (err) {
      alert('Gagal menambah pesanan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const total = formData.quantity * PRICE_PER_CUP

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crust-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-warmbg-300 animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-tomato-100 text-tomato-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-crust-950">
              Tambah Pesanan Manual
            </h3>
            <p className="text-xs text-slate-500">
              Input pesanan via offline, cash, atau titipan grup
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-crust-900 mb-1">Nama Pemesan</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Contoh: Rian Pratama"
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300 focus:ring-2 focus:ring-tomato-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-crust-900 mb-1">Status / Kelas</label>
              <input
                type="text"
                name="customer_role"
                value={formData.customer_role}
                onChange={handleChange}
                placeholder="Mahasiswa TI-3B / Dosen"
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">No. WhatsApp</label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="08123456789"
                className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-warmbg-50 border border-warmbg-200">
            <div>
              <label className="block font-bold text-crust-900 mb-1">Jumlah Cup</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-xl border border-warmbg-300 font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-crust-900 mb-1">Total Bayar</label>
              <div className="pt-1.5 font-extrabold text-tomato-600 text-sm">
                {formatRupiah(total)}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-crust-900 mb-1">Titik COD</label>
            <select
              name="cod_location"
              value={formData.cod_location}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300 bg-white"
            >
              {COD_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-crust-900 mb-1">Jam COD</label>
            <select
              name="cod_time"
              value={formData.cod_time}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300 bg-white"
            >
              {COD_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-crust-900 mb-1">Status Awal</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300 bg-white"
            >
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diproses">Diproses</option>
              <option value="Siap Diambil">Siap Diambil</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-crust-900 mb-1">Catatan</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-warmbg-300"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-tomato-500 hover:bg-tomato-600 text-white font-bold transition shadow-sm"
            >
              {saving ? 'Menyimpan...' : 'Tambah Pesanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
