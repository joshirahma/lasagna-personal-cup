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
  Loader2,
  QrCode,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Image as ImageIcon
} from 'lucide-react'
import {
  PRICE_PER_CUP,
  DEFAULT_PICKUP_LOCATION,
  DEFAULT_PICKUP_TIME_INFO,
  QRIS_IMAGE_URL
} from '../../lib/constants'
import { formatRupiah } from '../../lib/formatters'
import { compressImage } from '../../lib/imageCompressor'

export default function OrderForm({ onOrderSubmitted }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_role: '',
    whatsapp_number: '',
    quantity: 1,
    notes: '',
  })

  // State untuk bukti transfer QRIS
  const [paymentProof, setPaymentProof] = useState('')
  const [paymentProofFileName, setPaymentProofFileName] = useState('')
  const [compressionInfo, setCompressionInfo] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalPrice = formData.quantity * PRICE_PER_CUP

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleQuantityChange = (delta) => {
    setFormData((prev) => {
      const next = Math.max(1, prev.quantity + delta)
      return { ...prev, quantity: next }
    })
  }

  const handleQuantityInput = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) {
      setFormData((prev) => ({ ...prev, quantity: val }))
    } else if (e.target.value === '') {
      setFormData((prev) => ({ ...prev, quantity: 1 }))
    }
  }

  // Handle upload bukti bayar dengan kompresi otomatis
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setError('File bukti pembayaran harus berupa gambar (JPG, PNG, JPEG, WebP)')
      return
    }

    try {
      setIsCompressing(true)
      setError('')

      // Kompres otomatis gambar sebelum disimpan
      const result = await compressImage(file, 1000, 0.72)
      setPaymentProof(result.dataUrl)
      setPaymentProofFileName(file.name)

      const origKb = Math.round(result.originalSize / 1024)
      const compKb = Math.round(result.compressedSize / 1024)
      setCompressionInfo(`${origKb} KB ➔ ${compKb} KB (Hemat ${(100 - (compKb / origKb) * 100).toFixed(0)}%)`)
    } catch (err) {
      console.error('Image compression error:', err)
      setError('Gagal memproses gambar bukti bayar: ' + (err.message || 'File tidak didukung'))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleRemoveProof = () => {
    setPaymentProof('')
    setPaymentProofFileName('')
    setCompressionInfo('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Validasi input nama
    if (!formData.customer_name.trim()) {
      setError('Mohon masukkan nama lengkap pemesan')
      return
    }

    // 2. Validasi input kelas / peran
    if (!formData.customer_role.trim()) {
      setError('Mohon masukkan kelas atau status (cth: Mahasiswa TI-2A / Dosen / Staf)')
      return
    }

    // 3. Validasi nomor WhatsApp
    const cleanPhone = formData.whatsapp_number.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('Mohon masukkan nomor WhatsApp yang valid (minimal 8 digit angka)')
      return
    }

    // 4. Validasi jumlah cup
    if (formData.quantity < 1) {
      setError('Minimal pemesanan adalah 1 cup')
      return
    }

    // 5. Validasi wajib upload bukti bayar QRIS
    if (!paymentProof) {
      setError('Wajib mengunggah bukti transfer pembayaran QRIS sebelum menyelesaikan pesanan!')
      const el = document.getElementById('qris-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      return
    }

    try {
      setLoading(true)
      setError('')

      const orderPayload = {
        customer_name: formData.customer_name.trim(),
        customer_role: formData.customer_role.trim(),
        whatsapp_number: formData.whatsapp_number.trim(),
        quantity: formData.quantity,
        notes: (formData.notes || '').trim(),
        cod_location: DEFAULT_PICKUP_LOCATION,
        cod_time: DEFAULT_PICKUP_TIME_INFO,
        payment_proof: paymentProof,
        status: 'Menunggu Verifikasi',
      }

      await onOrderSubmitted(orderPayload)
    } catch (err) {
      console.error('Order submission error:', err)
      const errorMsg = err.message || 'Gagal menyimpan pesanan ke database Supabase. Periksa koneksi internet Anda.'
      setError(errorMsg)
      alert('⚠️ Gagal Menyimpan Pesanan:\n' + errorMsg)
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
              Pembayaran QRIS & tersinkronisasi langsung ke Supabase
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="my-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-2.5 shadow-xs animate-shake">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-900">Perhatian:</span>
              <span>{error}</span>
            </div>
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
              Notifikasi saat pesanan siap diambil akan dikirimkan ke nomor WhatsApp ini.
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
              <span className="text-xs font-medium text-crust-800">Total Yang Harus Ditransfer:</span>
              <span className="text-base font-extrabold text-tomato-600">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          {/* 5. Titik Pengambilan Tetap: Lapangan Politeknik STMI Jakarta */}
          <div className="p-3.5 rounded-2xl bg-warmbg-100/80 border border-warmbg-300 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-tomato-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Titik Pengambilan Pesanan
                </span>
                <span className="text-xs md:text-sm font-extrabold text-crust-950">
                  {DEFAULT_PICKUP_LOCATION}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Informasi Waktu Pengambilan via WhatsApp */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-950 block mb-0.5">
                Waktu Pengambilan & Notifikasi:
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Anda akan dihubungi langsung via <span className="font-semibold text-emerald-800">WhatsApp</span> ketika pesanan lasagna Anda sudah siap dan hangat untuk diambil di Lapangan STMI Jakarta.
              </p>
            </div>
          </div>

          {/* 7. Catatan Tambahan (Opsional) */}
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
              placeholder="Contoh: Ekstra saus bechamel, jangan terlalu pedas, dll."
              className="w-full px-3.5 py-2 rounded-xl border border-warmbg-300 text-xs focus:outline-none focus:ring-2 focus:ring-tomato-500 focus:border-transparent transition resize-none"
            ></textarea>
          </div>

          {/* 8. SEKSI PEMBAYARAN QRIS & UPLOAD BUKTI TRANSFER (WAJIB) */}
          <div className="pt-2" id="qris-section">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-warmbg-100 via-cheese-50 to-warmbg-50 border-2 border-tomato-200 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-warmbg-300">
                <div className="w-7 h-7 rounded-xl bg-tomato-600 text-white flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-crust-950 uppercase tracking-wide">
                    Pembayaran QRIS DANA / E-Wallet / Bank
                  </h3>
                  <p className="text-[10px] text-slate-500">Scan QRIS menggunakan aplikasi e-wallet / mobile banking</p>
                </div>
              </div>

              {/* Total Bayar Prominent Tag */}
              <div className="bg-white rounded-2xl p-3 border border-cheese-300 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block leading-none">
                    Nominal Transfer Tepat:
                  </span>
                  <span className="text-lg font-black text-tomato-600">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-tomato-100 text-tomato-800 px-2.5 py-1 rounded-full">
                  {formData.quantity} Cup Lasagna
                </span>
              </div>

              {/* QRIS Image Display */}
              <div className="bg-white rounded-2xl p-3 border border-warmbg-300 text-center shadow-xs">
                <div className="max-w-[220px] mx-auto overflow-hidden rounded-xl border border-slate-200 shadow-sm p-1 bg-white">
                  <img
                    src={QRIS_IMAGE_URL}
                    alt="QRIS Pembayaran Lasagna Personal Cup"
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/WhatsApp Image 2026-11-23 at 16.48.23.jpeg'
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">
                  Atas Nama: <span className="font-bold text-crust-900">Lasagna Personal Cup (DANA 0858-8916-7365)</span>
                </p>
              </div>

              {/* Peringatan Verifikasi Manual */}
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">PENTING - Verifikasi Manual:</span>
                  <span>Pembayaran QRIS dicek manual oleh penjual sebelum pesanan diproses. Jika pembayaran belum masuk / belum terverifikasi, pesanan <b>belum akan diproses</b>.</span>
                </div>
              </div>

              {/* Input Upload Bukti Pembayaran */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-crust-950 flex items-center justify-between">
                  <span>Unggah Bukti Transfer QRIS <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-semibold text-rose-600">Wajib Diisi</span>
                </label>

                {!paymentProof ? (
                  <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-tomato-300 hover:border-tomato-500 bg-white hover:bg-tomato-50/40 cursor-pointer transition text-center group">
                    {isCompressing ? (
                      <div className="py-2 flex flex-col items-center gap-1.5 text-tomato-600">
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-xs font-bold">Mengompres Foto Bukti Bayar...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-tomato-500 group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-bold text-crust-900">
                          Klik untuk Upload Bukti Pembayaran
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Screenshot bukti transfer (JPG, PNG - Otomatis Terkompres)
                        </span>
                      </>
                    )}
                    {/* CATATAN: Atribut required sengaja TIDAK ditaruh di sini agar browser tidak memblokir submit dengan error 'An invalid form control is not focusable' */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3 rounded-2xl bg-white border border-emerald-300 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={paymentProof}
                          alt="Preview Bukti Bayar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bukti Berhasil Diunggah</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                          {paymentProofFileName || 'bukti-transfer.jpg'}
                        </p>
                        {compressionInfo && (
                          <span className="inline-block text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                            {compressionInfo}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveProof}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                      title="Hapus / Ganti Bukti"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isCompressing}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-tomato-500 via-tomato-600 to-tomato-700 text-white font-bold text-sm shadow-warm hover:shadow-warm-lg disabled:opacity-60 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Pesanan ke Supabase...</span>
              </>
            ) : isCompressing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Foto...</span>
              </>
            ) : (
              <>
                <span>Kirim Pesanan • {formatRupiah(totalPrice)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
