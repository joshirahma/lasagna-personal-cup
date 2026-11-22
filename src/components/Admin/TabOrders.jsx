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
  MoreVertical,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react'
import {
  ORDER_STATUSES,
  COD_LOCATIONS,
  COD_TIMES,
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
  const [selectedLocation, setSelectedLocation] = useState('Semua')
  const [selectedTime, setSelectedTime] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (selectedStatus !== 'Semua' && order.status !== selectedStatus) return false

    // Location filter
    if (selectedLocation !== 'Semua' && order.cod_location !== selectedLocation)
      return false

    // Time filter
    if (selectedTime !== 'Semua' && order.cod_time !== selectedTime) return false

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

  const pendingCount = orders.filter((o) => o.status === 'Pending').length
  const diprosesCount = orders.filter((o) => o.status === 'Diproses').length
  const siapCodCount = orders.filter((o) => o.status === 'Siap COD').length
  const selesaiCount = orders.filter((o) => o.status === 'Selesai').length

  const getStatusBadge = (status) => {
    const s = ORDER_STATUSES.find((item) => item.id === status)
    return s ? s.color : 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-5">
      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          onClick={() => setSelectedStatus('Pending')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Pending'
              ? 'bg-amber-100/80 border-amber-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <span>Pending</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {pendingCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Diproses')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Diproses'
              ? 'bg-blue-100/80 border-blue-400 shadow-sm'
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
          onClick={() => setSelectedStatus('Siap COD')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Siap COD'
              ? 'bg-purple-100/80 border-purple-400 shadow-sm'
              : 'bg-white border-warmbg-300 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
            <span>Siap COD</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-crust-950">
            {siapCodCount} <span className="text-xs font-normal text-slate-500">pesanan</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Selesai')}
          className={`p-3 rounded-2xl border cursor-pointer transition ${
            selectedStatus === 'Selesai'
              ? 'bg-emerald-100/80 border-emerald-400 shadow-sm'
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
              placeholder="Cari nama, no. pesanan, status kelas, atau WhatsApp..."
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-warmbg-200 text-xs">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 shrink-0 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-warmbg-300 bg-white text-xs focus:ring-1 focus:ring-tomato-500"
            >
              {ORDER_STATUSES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Jam COD Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 shrink-0 font-medium">Jam COD:</span>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-warmbg-300 bg-white text-xs focus:ring-1 focus:ring-tomato-500"
            >
              <option value="Semua">Semua Jam COD</option>
              {COD_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Titik COD Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 shrink-0 font-medium">Titik COD:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-warmbg-300 bg-white text-xs focus:ring-1 focus:ring-tomato-500"
            >
              <option value="Semua">Semua Titik COD</option>
              {COD_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Menampilkan <b>{filteredOrders.length}</b> pesanan (Total: <b>{totalCups}</b> cup • <b>{formatRupiah(totalOmzet)}</b>)
          </span>
          {(selectedStatus !== 'Semua' || selectedLocation !== 'Semua' || selectedTime !== 'Semua' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStatus('Semua')
                setSelectedLocation('Semua')
                setSelectedTime('Semua')
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

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-warmbg-300 shadow-xs hover:border-tomato-200 transition space-y-3"
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

                {/* Details Grid: Cup, Total, Location & Time */}
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
                      Titik COD
                    </span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {order.cod_location}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-tomato-500" />
                      Jam COD
                    </span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {order.cod_time}
                    </span>
                  </div>
                </div>

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
                    {order.status !== 'Pending' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Pending')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                      >
                        Pending
                      </button>
                    )}
                    {order.status !== 'Diproses' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Diproses')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        Diproses
                      </button>
                    )}
                    {order.status !== 'Siap COD' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Siap COD')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        Siap COD
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
    </div>
  )
}
