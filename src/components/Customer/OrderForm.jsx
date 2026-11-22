import React, { useState } from 'react'
import {
  ShoppingBag,
  User,
  GraduationCap,
  Phone,
  MapPin,
  Clock,
  FileText,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { PRICE_PER_CUP, COD_LOCATIONS, COD_TIMES } from '../../lib/constants'
import { formatRupiah } from '../../lib/formatters'

export default function OrderForm({ onOrderSubmitted }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_role: '',
    whatsapp_number: '',
    quantity: 1,
    cod_location: COD_LOCATIONS[0],
    cod_time: COD_TIMES[1], // Default istirahat siang
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalPrice = formData.quantity * PRICE_PER_CUP

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleQuantityChange = (delta) => {
    setFormData(prev => {
      const next = Math.max(1, prev.quantity + delta)
      return { ...prev, quantity: next }
    })
  }

  const handleQuantityInput = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) {
      setFormData(prev => ({ ...prev, quantity: val }))
    } else if (e.target.value === '') {
      setFormData(prev => ({ ...prev, quantity: 1 }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Mohon masukkan nama lengkap pemesan')
      return
    }
    if (!formData.customer_role.trim()) {
      setError('Mohon masukkan kelas atau status (cth: Mahasiswa TI-2A / Dosen / Staf)')
      return
    }
    if (!formData.whatsapp_number.trim() || formData.whatsapp_number.replace(/\D/g, '').length < 8) {
      setError('Mohon masukkan nomor WhatsApp yang valid (min. 8 digit)')
      return
    }
    if (formData.quantity < 1) {
      setError('Minimal pemesanan adalah 1 cup')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onOrderSubmitted(formData)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pesanan. Silakan coba kembali.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-4 mb-16" id="order-section">
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-md border-2 border-tomato-100">
        {/* Header Form */}
        <div className="flex items-center gap-2.5 mb-1 pb-3 border-b border-warmbg-200">
          <div className="w-10 h-10 rounded-2xl bg-tomato-500 text-white flex items-center justify-center shadow-md shadow-tomato-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-crust-950">
              Form Pemesanan Pre-Order
            </h2>
            <p className="text-xs text-slate-500">
              Isi data dan konfirmasi cepat via WhatsApp
            </p>
          </div>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* 1. Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-tomato-500" />
              <span>Nama Lengkap Pembeli <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Contoh: Aurel Tiara"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* 2. Kelas / Status */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-tomato-500" />
              <span>Kelas / Status Kampus <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              name="customer_role"
              value={formData.customer_role}
              onChange={handleChange}
              placeholder="Contoh: Mahasiswa TI-2A / Dosen Otomotif / Staf BAAK"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* 3. Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-tomato-500" />
              <span>Nomor WhatsApp Aktif <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="tel"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Untuk konfirmasi pesanan dan notifikasi saat pesanan siap diambil.
            </p>
          </div>

          {/* 4. Jumlah Cup & Kalkulasi Harga */}
          <div className="p-3.5 rounded-2xl bg-cheese-50/80 border border-cheese-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-crust-950 flex items-center gap-1.5">
                <span>Jumlah Cup Lasagna</span>
                <span className="text-[11px] font-normal text-slate-500">(@ {formatRupiah(PRICE_PER_CUP)})</span>
              </label>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-cheese-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={formData.quantity <= 1}
                  className="w-7 h-7 rounded-lg bg-warmbg-100 hover:bg-warmbg-200 disabled:opacity-40 flex items-center justify-center text-crust-900 font-bold active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quantity}
                  onChange={handleQuantityInput}
                  className="w-10 text-center font-extrabold text-sm text-crust-950 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-7 h-7 rounded-lg bg-tomato-500 hover:bg-tomato-600 text-white flex items-center justify-center font-bold active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Total Ringkasan */}
            <div className="flex items-center justify-between pt-2 border-t border-cheese-200/80">
              <span className="text-xs font-medium text-crust-800">Total Pembayaran:</span>
              <span className="text-base font-extrabold text-tomato-600">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          {/* 5. Pilihan Titik COD di Kampus */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-tomato-500" />
              <span>Titik Pengambilan (COD) Kampus <span className="text-rose-500">*</span></span>
            </label>
            <select
              name="cod_location"
              value={formData.cod_location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition"
            >
              {COD_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Pilihan Jam COD */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-tomato-500" />
              <span>Waktu Pengambilan (Jam COD) <span className="text-rose-500">*</span></span>
            </label>
            <select
              name="cod_time"
              value={formData.cod_time}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition"
            >
              {COD_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Catatan Tambahan / Preferensi Bahan */}
          <div>
            <label className="block text-xs font-bold text-crust-900 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-tomato-500" />
              <span>Catatan Tambahan / Preferensi Bahan <span className="text-[10px] font-normal text-slate-400">(Opsional)</span></span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Contoh: Ekstra saus bechamel, jangan terlalu pedas, titip di sekre, dll."
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmbg-300 text-sm focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-tomato-500 via-tomato-600 to-tomato-700 text-white font-bold text-sm shadow-warm hover:shadow-warm-lg disabled:opacity-60 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <span>Pesan Sekarang • {formatRupiah(totalPrice)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
