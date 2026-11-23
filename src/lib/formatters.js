import { DEFAULT_WHATSAPP } from "./constants"

/**
 * Format angka ke format Rupiah standar Indonesia
 * Contoh: 12000 -> "Rp 12.000"
 */
export function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return "Rp 0"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

/**
 * Format angka dengan separator ribuan tanpa simbol Rp
 */
export function formatNumber(number, decimals = 0) {
  if (number === null || number === undefined || isNaN(number)) return "0"
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number)
}

/**
 * Format ISO datetime ke format human-readable Indonesia
 */
export function formatDateTime(isoString) {
  if (!isoString) return "-"
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date) + " WIB"
  } catch (e) {
    return isoString
  }
}

/**
 * Membuat link WhatsApp untuk konfirmasi pesanan dari pembeli ke admin/penjual
 */
export function createCustomerWhatsAppUrl(order, targetPhone = DEFAULT_WHATSAPP) {
  const cleanPhone = (targetPhone || DEFAULT_WHATSAPP).replace(/\D/g, "")
  const notesText = order.notes && order.notes.trim() ? order.notes.trim() : "-"

  const message = [
    `Halo Tim Lasagna Personal Cup! 👋`,
    `Saya mau konfirmasi pesanan Pre-Order saya di Politeknik STMI:`,
    ``,
    `📋 *No. Pesanan:* #${order.order_number}`,
    `👤 *Nama:* ${order.customer_name}`,
    `🎓 *Status/Kelas:* ${order.customer_role}`,
    `📱 *WhatsApp:* ${order.whatsapp_number}`,
    `🍲 *Jumlah Pesanan:* ${order.quantity} Cup Lasagna`,
    `💰 *Total Pembayaran:* ${formatRupiah(order.total_price)}`,
    `💳 *Metode Pembayaran:* QRIS (Bukti transfer telah saya unggah di web)`,
    `📍 *Titik Pengambilan:* ${order.cod_location || 'Lapangan Politeknik STMI Jakarta'}`,
    `⏰ *Waktu:* Dihubungi via WhatsApp saat siap diambil`,
    `📌 *Status:* Menunggu Verifikasi Penjual`,
    `📝 *Catatan Tambahan:* ${notesText}`,
    ``,
    `Mohon dicek bukti transfernya ya kak. Terima kasih! 🙏✨`
  ].join("\n")

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Membuat link WhatsApp untuk admin langsung chat ke pembeli
 */
export function createAdminToCustomerWhatsAppUrl(order) {
  let cleanPhone = (order.whatsapp_number || "").replace(/\D/g, "")
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1)
  }

  const message = [
    `Halo ${order.customer_name}! 👋`,
    `Dari Tim *Lasagna Personal Cup* Politeknik STMI Jakarta.`,
    ``,
    `Menginfokan status pesanan #${order.order_number} (${order.quantity} cup):`,
    `Saat ini berstatus: *${order.status}* 📌`,
    `📍 Titik COD: *${order.cod_location}*`,
    `⏰ Jam COD: *${order.cod_time}*`,
    `💰 Total: *${formatRupiah(order.total_price)}*`,
    ``,
    `Sampai bertemu di kampus nanti ya kak! Terima kasih sudah order 🙌`
  ].join("\n")

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Membuat format teks daftar belanja rapi untuk dishare ke grup WhatsApp
 */
export function formatShoppingListWhatsApp(bomRows, totalCups) {
  const now = new Date()
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now)

  let totalEstBelanja = 0

  const lines = [
    `🛒 *DAFTAR BELANJA BAHAN LASAGNA PERSONAL CUP*`,
    `🎯 Target Produksi: *${totalCups} Cup*`,
    `📅 Hari/Tanggal: ${dateStr}`,
    `=================================`,
    ``
  ]

  // Kelompokkan per kategori
  const categories = ["Bahan Utama", "Bumbu & Rempah", "Kemasan & Operasional"]
  
  categories.forEach(cat => {
    const items = bomRows.filter(r => r.category === cat)
    if (items.length > 0) {
      lines.push(`*-- ${cat.toUpperCase()} --*`)
      items.forEach(item => {
        const estCost = item.recommended_packages * item.package_price
        totalEstBelanja += estCost
        lines.push(
          `[ ] *${item.name}*` +
          `\n    Takaran Masak: ${formatNumber(item.total_amount_needed, 2)} ${item.unit}` +
          `\n    Rekomendasi Beli: *${item.recommended_packages} ${item.package_unit}* (${formatRupiah(estCost)})`
        )
      })
      lines.push(``)
    }
  })

  lines.push(`=================================`)
  lines.push(`💵 *Total Estimasi Uang Belanja:* *${formatRupiah(totalEstBelanja)}*`)
  lines.push(`Semangat tim produksi & dapur! 💪🔥`)

  return lines.join("\n")
}

/**
 * Export data pesanan ke format CSV untuk diunduh
 */
export function exportOrdersToCSV(orders) {
  if (!orders || orders.length === 0) {
    alert("Tidak ada data pesanan untuk diexport.")
    return
  }

  const headers = [
    "No Pesanan",
    "Waktu Pesan",
    "Nama Pembeli",
    "Status / Kelas",
    "No WhatsApp",
    "Jumlah Cup",
    "Harga Satuan",
    "Total Bayar",
    "Titik COD",
    "Jam COD",
    "Status",
    "Catatan",
  ]

  const csvRows = []
  csvRows.push(headers.join(","))

  orders.forEach(order => {
    const row = [
      `"${order.order_number}"`,
      `"${formatDateTime(order.created_at)}"`,
      `"${(order.customer_name || "").replace(/"/g, '""')}"`,
      `"${(order.customer_role || "").replace(/"/g, '""')}"`,
      `"${order.whatsapp_number || ""}"`,
      order.quantity,
      order.unit_price,
      order.total_price,
      `"${order.cod_location || ""}"`,
      `"${order.cod_time || ""}"`,
      `"${order.status || ""}"`,
      `"${(order.notes || "").replace(/"/g, '""')}"`,
    ]
    csvRows.push(row.join(","))
  })

  const csvString = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join("\n"))
  const downloadLink = document.createElement("a")
  downloadLink.setAttribute("href", csvString)
  downloadLink.setAttribute("download", `rekap-pesanan-lasagna-stmi-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
