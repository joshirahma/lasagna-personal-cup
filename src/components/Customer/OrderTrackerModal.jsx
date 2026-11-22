import React, { useState } from 'react'
import { Search, X, Package, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { formatRupiah, formatDateTime } from '../../lib/formatters'
import { ORDER_STATUSES } from '../../lib/constants'

export default function OrderTrackerModal({ orders, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const trimmed = searchTerm.trim().toLowerCase()
  const filtered = trimmed
    ? orders.filter(
        (o) =>
          (o.order_number && o.order_number.toLowerCase().includes(trimmed)) ||
          (o.whatsapp_number && o.whatsapp_number.includes(trimmed)) ||
          (o.customer_name && o.customer_name.toLowerCase().includes(trimmed))
      )
    : []

  const getStatusBadge = (status) => {
    const s = ORDER_STATUSES.find((item) => item.id === status)
    return s ? s.color : 'bg-slate-100 text-slate-700'
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

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-tomato-100 text-tomato-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-crust-950">Lacak Pesanan PO</h3>
            <p className="text-xs text-slate-500">Cek status lasagna pesananmu</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ketik No. Pesanan (mis: LPC-1001) / No. WA..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-warmbg-300 text-xs focus:outline-none focus:ring-2 focus:ring-tomato-500 transition"
            autoFocus
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
          {trimmed && filtered.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Pesanan tidak ditemukan. Pastikan nomor pesanan atau no. WhatsApp sudah benar.
            </div>
          )}

          {!trimmed && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Masukkan nomor pesanan atau nomor WhatsApp yang kamu gunakan saat memesan.
            </div>
          )}

          {filtered.map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-2xl bg-warmbg-50 border border-warmbg-300/80 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-tomato-600">
                  #{ord.order_number}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                    ord.status
                  )}`}
                >
                  {ord.status}
                </span>
              </div>

              <div className="flex justify-between text-slate-700">
                <span className="font-semibold">{ord.customer_name}</span>
                <span className="font-bold text-crust-950">
                  {ord.quantity} Cup ({formatRupiah(ord.total_price)})
                </span>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-warmbg-200">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-tomato-500" />
                  <span>{ord.cod_location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-tomato-500" />
                  <span>{ord.cod_time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
