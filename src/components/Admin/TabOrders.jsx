import React, { useState } from 'react'
import {
  Download,
  Plus,
  Search,
  Filter,
  Phone,
  Clock,
  MapPin,
  Trash2,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Image as ImageIcon,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react'
import {
  ORDER_STATUSES,
  COD_LOCATIONS,
  PRICE_PER_CUP
} from '../../lib/constants'
import {
  formatRupiah,
  formatDateTime,
  exportOrdersToCSV,
  createAdminToCustomerWhatsAppUrl
} from '../../lib/formatters'

export default function TabOrders({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onOpenAddModal
}) {
  const [selectedStatus, setSelectedStatus] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')

  // State untuk modal preview bukti bayar
  const [viewingProofOrder, setViewingProofOrder] = useState(null)

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (selectedStatus !== 'Semua') {
      if (selectedStatus === 'Menunggu Verifikasi') {
        if (order.status !== 'Menunggu Verifikasi' && order.status !== 'Pending') return false
      } else if (selectedStatus === 'Siap Diambil') {
        if (order.status !== 'Siap Diambil' && order.status !== 'Siap COD') return false
      } else if (order.status !== selectedStatus) {
        return false
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      const matchName = (order.customer_name || '').toLowerCase().includes(term)
      const matchRole = (order.customer_role || '').toLowerCase().includes(term)
      const matchNumber = (order.order_number || '').toLowerCase().includes(term)
      const matchPhone = (order.whatsapp_number || '').includes(term)
      if (!matchName && !matchRole && !matchNumber && !matchPhone) return false
    }

    return true
  })

  // Quick stats
  const totalCups = filteredOrders.reduce((sum, o) => sum + (o.quantity || 0), 0)
  const totalOmzet = filteredOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)

  const verifikasiCount = orders.filter((o) => o.status === 'Menunggu Verifikasi' || o.status === 'Pending').length
  const diprosesCount = orders.filter((o) => o.status === 'Diproses').length
  const siapAmbilCount = orders.filter((o) => o.status === 'Siap Diambil' || o.status === 'Siap COD').length
  const selesaiCount = orders.filter((o) => o.status === 'Selesai').length

  const getStatusBadge = (status) => {
    const s = ORDER_STATUSES.find((item) => item.id === status)
    if (s) return s.color
    if (status === 'Pending') return 'bg-amber-100 text-amber-800 border-amber-300'
    if (status === 'Siap COD') return 'bg-purple-100 text-purple-800 border-purple-300'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-5">
      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          onClick={() => setSelectedStatus('Menunggu Verifikasi')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Menunggu Verifikasi'
              ? 'bg-amber-100/90 border-amber-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <span>Perlu Verifikasi</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {verifikasiCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Diproses')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Diproses'
              ? 'bg-blue-100/90 border-blue-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-800 font-semibold mb-1">
            <span>Diproses</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {diprosesCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Siap Diambil')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Siap Diambil'
              ? 'bg-purple-100/90 border-purple-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
            <span>Siap Diambil</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {siapAmbilCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Selesai')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Selesai'
              ? 'bg-emerald-100/90 border-emerald-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
            <span>Selesai</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {selesaiCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Filters, and Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-warmbg-300 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama pemesan, no. pesanan, status kelas, atau no. WhatsApp..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-warmbg-300 text-xs focus:outline-none focus:ring-2 focus:ring-tomato-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => exportOrdersToCSV(filteredOrders)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition active:scale-95"
              title="Unduh laporan pesanan ke format CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-tomato-500 hover:bg-tomato-600 transition shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Pesanan Manual</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-warmbg-200 text-xs">
          <span className="text-slate-500 shrink-0 font-medium">Filter Status:</span>
          {['Semua', 'Menunggu Verifikasi', 'Diproses', 'Siap Diambil', 'Selesai'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStatus === st
                  ? 'bg-tomato-500 text-white shadow-xs'
                  : 'bg-warmbg-100 hover:bg-warmbg-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Menampilkan <b>{filteredOrders.length}</b> pesanan (Total: <b>{totalCups}</b> cup • <b>{formatRupiah(totalOmzet)}</b>)
          </span>
          {(selectedStatus !== 'Semua' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStatus('Semua')
                setSearchTerm('')
              }}
              className="text-tomato-600 font-semibold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-warmbg-300 text-slate-400">
            <p className="text-sm">Tidak ada pesanan yang sesuai filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const customerWaUrl = createAdminToCustomerWhatsAppUrl(order)
            const isNeedVerification = order.status === 'Menunggu Verifikasi' || order.status === 'Pending'

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-4 border shadow-xs hover:border-tomato-200 transition space-y-3 ${
                  isNeedVerification ? 'border-amber-300 bg-amber-50/20' : 'border-warmbg-300'
                }`}
              >
                {/* Header Card: Order #, Customer, and Status */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-extrabold text-xs text-tomato-600 bg-tomato-50 border border-tomato-200 px-2.5 py-1 rounded-lg">
                      #{order.order_number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-crust-950 leading-tight">
                        {order.customer_name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.customer_role} • {order.whatsapp_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid: Cup, Total, Location & Waktu */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-warmbg-100/70 border border-warmbg-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Jumlah Cup
                    </span>
                    <span className="font-extrabold text-crust-950 text-sm">
                      {order.quantity} Cup
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Total Bayar
                    </span>
                    <span className="font-extrabold text-tomato-600 text-sm">
                      {formatRupiah(order.total_price)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-tomato-500" />
                      Titik Pengambilan
                    </span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {order.cod_location || 'Lapangan STMI'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-tomato-500" />
                      Waktu Pengambilan
                    </span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {order.cod_time || 'Dihubungi via WA'}
                    </span>
                  </div>
                </div>

                {/* Bukti Bayar Section in Card */}
                {order.payment_proof ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-warmbg-50 border border-warmbg-300 shadow-2xs">
                    <div
                      onClick={() => setViewingProofOrder(order)}
                      className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-300 cursor-pointer hover:opacity-90 hover:scale-102 transition shrink-0 group relative bg-white shadow-xs"
                      title="Klik untuk memperbesar bukti transfer"
                    >
                      <img
                        src={order.payment_proof}
                        alt={`Bukti Bayar ${order.order_number}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bukti Pembayaran QRIS Terlampir</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Nominal pesanan: <span className="font-bold text-crust-950">{formatRupiah(order.total_price)}</span>
                      </p>
                      <button
                        onClick={() => setViewingProofOrder(order)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-tomato-600 hover:text-tomato-700 hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Perbesar & Periksa Bukti</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                    <span className="font-semibold text-slate-600">Bukti Transfer:</span>
                    <span className="text-[11px] italic text-slate-400">Tidak ada (Pesanan Manual / Tunai)</span>
                  </div>
                )}

                {/* Notes if any */}
                {order.notes && (
                  <div className="text-xs text-slate-600 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 italic">
                    <span className="font-bold text-amber-900 not-italic">Catatan: </span>
                    "{order.notes}"
                  </div>
                )}

                {/* Bottom Action Bar: Status Transitions & Contact */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-warmbg-200">
                  {/* Status quick switcher */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">Ubah Status:</span>
                    
                    {/* Tombol aksi cepat Verifikasi jika status Menunggu Verifikasi */}
                    {isNeedVerification && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Diproses')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        title="Verifikasi pembayaran masuk dan mulai proses memasak"
                      >
                        ✓ Verifikasi & Proses
                      </button>
                    )}

                    {!isNeedVerification && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Menunggu Verifikasi')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                      >
                        Menunggu Verif
                      </button>
                    )}

                    {order.status !== 'Diproses' && !isNeedVerification && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Diproses')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        Diproses
                      </button>
                    )}

                    {order.status !== 'Siap Diambil' && order.status !== 'Siap COD' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Siap Diambil')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        Siap Diambil
                      </button>
                    )}

                    {order.status !== 'Selesai' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Selesai')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                      >
                        Selesai
                      </button>
                    )}
                  </div>

                  {/* WhatsApp Contact & Delete */}
                  <div className="flex items-center gap-2">
                    <a
                      href={customerWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                      title="Hubungi pemesan via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                      <span>Chat Pemesan</span>
                    </a>

                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus pesanan #${order.order_number} (${order.customer_name})?`)) {
                          onDeleteOrder(order.id)
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus pesanan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* MODAL PREVIEW BUKTI BAYAR QRIS */}
      {viewingProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crust-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-warmbg-300 animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              onClick={() => setViewingProofOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-tomato-100 text-tomato-600 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-crust-950">
                  Bukti Pembayaran QRIS
                </h3>
                <p className="text-xs text-slate-500">
                  Pesanan #{viewingProofOrder.order_number} • {viewingProofOrder.customer_name}
                </p>
              </div>
            </div>

            {/* Rincian Tagihan */}
            <div className="p-3 bg-warmbg-100/70 rounded-2xl border border-warmbg-200 flex items-center justify-between text-xs mb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Total Yang Harus Dibayar:</span>
                <span className="text-base font-black text-tomato-600">
                  {formatRupiah(viewingProofOrder.total_price)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">({viewingProofOrder.quantity} Cup)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-semibold block">Status Saat Ini:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(viewingProofOrder.status)}`}>
                  {viewingProofOrder.status}
                </span>
              </div>
            </div>

            {/* Gambar Bukti Bayar */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden max-h-[60vh] flex items-center justify-center p-2 border border-slate-700 shadow-inner">
              <img
                src={viewingProofOrder.payment_proof}
                alt={`Bukti Bayar ${viewingProofOrder.order_number}`}
                className="max-h-[55vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-warmbg-200 mt-4">
              <a
                href={viewingProofOrder.payment_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-tomato-600 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Gambar Asli</span>
              </a>

              <div className="flex items-center gap-2">
                {viewingProofOrder.status !== 'Diproses' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(viewingProofOrder.id, 'Diproses')
                      setViewingProofOrder((prev) => ({ ...prev, status: 'Diproses' }))
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verifikasi & Ubah ke 'Diproses'</span>
                  </button>
                )}

                <button
                  onClick={() => setViewingProofOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
