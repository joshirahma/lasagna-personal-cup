import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  X,
  ExternalLink,
  Clock,
  MapPin,
  Utensils,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import { formatRupiah, createCustomerWhatsAppUrl } from '../../lib/formatters'
import { DEFAULT_WHATSAPP } from '../../lib/constants'

export default function OrderSuccessModal({ order, onClose }) {
  const [copied, setCopied] = React.useState(false)

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e54335', '#f59e0b', '#bc8c33', '#10b981']
      })
    } catch (e) {
      // safe fallback
    }
  }, [])

  if (!order) return null

  const waUrl = createCustomerWhatsAppUrl(order, DEFAULT_WHATSAPP)

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crust-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-warmbg-300 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-amber-600" />
        </div>

        <div className="text-center mb-4">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 mb-1 border border-amber-300">
            Status: Menunggu Verifikasi Pembayaran
          </span>
          <h3 className="text-xl font-extrabold text-crust-950">
            Pesanan & Bukti Bayar Diterima!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Penjual akan memverifikasi mutasi transfer QRIS Anda secara manual sebelum pesanan mulai diproses/dimasak.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-warmbg-100/80 rounded-2xl p-4 border border-warmbg-300 space-y-2.5 text-xs text-slate-700 mb-4">
          {/* Order Number Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-warmbg-300/80">
            <span className="font-semibold text-slate-500">Nomor Pesanan:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-sm text-tomato-600 bg-white px-2 py-0.5 rounded-md border border-warmbg-300">
                #{order.order_number}
              </span>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1 rounded hover:bg-warmbg-200 text-slate-500 hover:text-slate-700 transition"
                title="Salin nomor pesanan"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Nama Pemesan:</span>
            <span className="font-bold text-crust-900">{order.customer_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status / Kelas:</span>
            <span className="font-medium text-crust-800">{order.customer_role}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Jumlah Cup:</span>
            <span className="font-bold text-crust-900">{order.quantity} Cup Lasagna</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Total Pembayaran:</span>
            <span className="font-extrabold text-sm text-tomato-600">
              {formatRupiah(order.total_price)}
            </span>
          </div>

          {/* Bukti Bayar Thumbnail Preview */}
          {order.payment_proof && (
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={order.payment_proof}
                    alt="Bukti Bayar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-emerald-700 text-[11px] block leading-tight">
                    Bukti Transfer QRIS Terlampir
                  </span>
                  <span className="text-[10px] text-slate-400">Siap diverifikasi penjual</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-warmbg-300/80 space-y-1.5">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-tomato-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500">Titik Pengambilan: </span>
                <span className="font-semibold text-crust-900">{order.cod_location || 'Lapangan Politeknik STMI Jakarta'}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-tomato-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500">Waktu Pengambilan: </span>
                <span className="font-semibold text-crust-900">{order.cod_time || 'Dihubungi via WhatsApp saat siap diambil'}</span>
              </div>
            </div>
            {order.notes && (
              <div className="p-2 bg-white rounded-lg border border-warmbg-300 text-[11px] text-slate-600 italic">
                "{order.notes}"
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Button Redirect */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Kirim Konfirmasi Pesanan ke WhatsApp</span>
            <ExternalLink className="w-4 h-4 text-emerald-200" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
