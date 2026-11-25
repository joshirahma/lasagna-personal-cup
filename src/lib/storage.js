import { supabase, isSupabaseConfigured } from "./supabase"
import { INITIAL_ORDERS, INITIAL_BOM_INGREDIENTS, PRICE_PER_CUP } from "./constants"

const ORDERS_KEY = "lpc_orders_v1"
const INGREDIENTS_KEY = "lpc_bom_ingredients_v1"

/**
 * Inisialisasi local storage dengan seed data jika masih kosong
 */
export function initializeLocalStorage() {
  if (typeof window === "undefined") return

  const existingOrders = localStorage.getItem(ORDERS_KEY)
  if (!existingOrders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS))
  }

  const existingIngredients = localStorage.getItem(INGREDIENTS_KEY)
  if (!existingIngredients) {
    localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(INITIAL_BOM_INGREDIENTS))
  }
}

// Inisialisasi langsung saat script dimuat
initializeLocalStorage()

/**
 * Generate nomor pesanan unik misal LPC-1004, LPC-1005 dst.
 * Maksimal 15 karakter agar tidak melanggar VARCHAR(20) di Supabase.
 */
export function generateOrderNumber(existingOrders = []) {
  const currentMax = existingOrders.reduce((max, ord) => {
    const numPart = parseInt((ord.order_number || "").replace(/\D/g, ""), 10)
    return !isNaN(numPart) && numPart > max ? numPart : max
  }, 1000)

  return `LPC-${currentMax + 1}`
}

/**
 * Normalisasi objek pesanan saat diambil dari database:
 * - Ekstrak bukti bayar jika tersimpan di kolom payment_proof atau di dalam tag [BUKTI_BAYAR:...] di notes
 * - Petakan status database ('Pending' -> 'Menunggu Verifikasi', 'Siap COD' -> 'Siap Diambil')
 */
export function normalizeOrderFromDb(order) {
  if (!order) return order

  let payment_proof = order.payment_proof || ""
  let cleanNotes = order.notes || ""

  if (cleanNotes.includes("[BUKTI_BAYAR:")) {
    const match = cleanNotes.match(/\[BUKTI_BAYAR:(data:image\/[^\]]+)\]/)
    if (match) {
      if (!payment_proof) {
        payment_proof = match[1]
      }
      cleanNotes = cleanNotes.replace(/\[BUKTI_BAYAR:[^\]]+\]\n?/, "").trim()
    }
  }

  // Pemetaan status untuk tampilan UI
  let displayStatus = order.status
  if (order.status === "Pending") {
    displayStatus = "Menunggu Verifikasi"
  } else if (order.status === "Siap COD") {
    displayStatus = "Siap Diambil"
  }

  return {
    ...order,
    payment_proof,
    notes: cleanNotes,
    status: displayStatus,
  }
}

/**
 * Petakan status UI ke status yang diizinkan oleh check constraint database Supabase:
 * 'Menunggu Verifikasi' -> 'Pending'
 * 'Siap Diambil' -> 'Siap COD'
 */
export function mapStatusToDb(uiStatus) {
  if (uiStatus === "Menunggu Verifikasi") return "Pending"
  if (uiStatus === "Siap Diambil") return "Siap COD"
  return uiStatus
}

/**
 * Ambil semua data pesanan dari Supabase (atau fallback localStorage jika offline)
 */
export async function getOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Supabase getOrders warning:", error)
        return getOrdersFromLocalStorage()
      }

      if (data) {
        const normalizedList = data.map(normalizeOrderFromDb)
        // Simpan mirror ke local storage
        localStorage.setItem(ORDERS_KEY, JSON.stringify(normalizedList))
        return normalizedList
      }
    } catch (err) {
      console.warn("Supabase fetch failed:", err)
      return getOrdersFromLocalStorage()
    }
  }

  return getOrdersFromLocalStorage()
}

function getOrdersFromLocalStorage() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS))
      return INITIAL_ORDERS.map(normalizeOrderFromDb)
    }
    const parsed = JSON.parse(raw)
    return parsed.map(normalizeOrderFromDb)
  } catch (err) {
    console.error("Error reading orders from localStorage:", err)
    return INITIAL_ORDERS.map(normalizeOrderFromDb)
  }
}

/**
 * Tambah pesanan baru langsung ke Supabase
 */
export async function createOrder(orderInput) {
  const allCurrent = getOrdersFromLocalStorage()
  const orderNumber = orderInput.order_number || generateOrderNumber(allCurrent)
  const quantity = Math.max(1, parseInt(orderInput.quantity, 10) || 1)
  const unitPrice = orderInput.unit_price || PRICE_PER_CUP
  const totalPrice = quantity * unitPrice
  const rawNotes = (orderInput.notes || "").trim()
  const paymentProof = orderInput.payment_proof || ""

  // Siapkan notes dengan tag [BUKTI_BAYAR:...] agar gambar bukti transfer
  // tetap tersimpan 100% di Supabase meskipun kolom payment_proof belum dibuat di tabel
  const notesWithProof = paymentProof
    ? `[BUKTI_BAYAR:${paymentProof}]\n${rawNotes}`
    : rawNotes

  const dbStatus = mapStatusToDb(orderInput.status || "Menunggu Verifikasi")

  const newOrder = {
    id: "ord-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    order_number: orderNumber,
    customer_name: orderInput.customer_name.trim(),
    customer_role: orderInput.customer_role.trim(),
    whatsapp_number: orderInput.whatsapp_number.trim(),
    quantity: quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    cod_location: orderInput.cod_location || "Lapangan Politeknik STMI Jakarta",
    cod_time: orderInput.cod_time || "Dihubungi via WhatsApp saat siap diambil",
    notes: rawNotes,
    payment_proof: paymentProof,
    status: orderInput.status || "Menunggu Verifikasi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Jika Supabase terkonfigurasi, wajib insert ke Supabase!
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Coba insert dengan kolom payment_proof terlebih dahulu
      const { data: firstTryData, error: firstTryError } = await supabase
        .from("orders")
        .insert([{
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_role: newOrder.customer_role,
          whatsapp_number: newOrder.whatsapp_number,
          quantity: newOrder.quantity,
          unit_price: newOrder.unit_price,
          total_price: newOrder.total_price,
          cod_location: newOrder.cod_location,
          cod_time: newOrder.cod_time,
          notes: notesWithProof,
          payment_proof: paymentProof,
          status: dbStatus,
        }])
        .select()
        .single()

      if (!firstTryError && firstTryData) {
        const normalized = normalizeOrderFromDb({
          ...firstTryData,
          payment_proof: paymentProof || firstTryData.payment_proof,
        })
        saveOrderToLocalStorage(normalized)
        return { success: true, order: normalized }
      }

      // 2. Jika error karena kolom payment_proof belum ada di skema database Supabase (PGRST204)
      if (firstTryError && (firstTryError.code === "PGRST204" || firstTryError.message?.includes("payment_proof"))) {
        console.warn("Kolom payment_proof tidak ada di Supabase, menyimpan bukti bayar ke kolom notes...")

        const { data: retryData, error: retryError } = await supabase
          .from("orders")
          .insert([{
            order_number: newOrder.order_number,
            customer_name: newOrder.customer_name,
            customer_role: newOrder.customer_role,
            whatsapp_number: newOrder.whatsapp_number,
            quantity: newOrder.quantity,
            unit_price: newOrder.unit_price,
            total_price: newOrder.total_price,
            cod_location: newOrder.cod_location,
            cod_time: newOrder.cod_time,
            notes: notesWithProof,
            status: dbStatus,
          }])
          .select()
          .single()

        if (!retryError && retryData) {
          const normalized = normalizeOrderFromDb({
            ...retryData,
            payment_proof: paymentProof,
          })
          saveOrderToLocalStorage(normalized)
          return { success: true, order: normalized }
        }

        if (retryError) {
          console.error("Supabase insert error (retry):", retryError)
          throw new Error(`Gagal menyimpan ke Supabase: ${retryError.message || retryError.details || "Database error"}`)
        }
      } else if (firstTryError) {
        console.error("Supabase insert error:", firstTryError)
        throw new Error(`Gagal menyimpan ke Supabase: ${firstTryError.message || firstTryError.details || "Database error"}`)
      }
    } catch (err) {
      console.error("createOrder error:", err)
      // Throw error agar dapat ditangkap dan ditampilkan di alert/toast form
      throw err
    }
  }

  // Jika Supabase tidak dikonfigurasi, simpan ke localStorage
  saveOrderToLocalStorage(newOrder)
  return { success: true, order: newOrder }
}

function saveOrderToLocalStorage(order) {
  try {
    const list = getOrdersFromLocalStorage()
    const updated = [order, ...list.filter(item => item.id !== order.id && item.order_number !== order.order_number)]
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error("saveOrderToLocalStorage error:", e)
  }
}

/**
 * Update status pesanan
 */
export async function updateOrderStatus(orderId, newStatus) {
  const dbStatus = mapStatusToDb(newStatus)

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: dbStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select()
        .single()

      if (!error && data) {
        updateOrderInLocalStorage(orderId, { status: newStatus })
        return { success: true, order: normalizeOrderFromDb(data) }
      }
      if (error) console.warn("Supabase updateOrderStatus error:", error)
    } catch (err) {
      console.warn("Supabase updateOrderStatus failed:", err)
    }
  }

  updateOrderInLocalStorage(orderId, { status: newStatus })
  return { success: true }
}

function updateOrderInLocalStorage(orderId, patch) {
  try {
    const list = getOrdersFromLocalStorage()
    const updated = list.map(item => {
      if (item.id === orderId) {
        return { ...item, ...patch, updated_at: new Date().toISOString() }
      }
      return item
    })
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error("updateOrderInLocalStorage error:", e)
  }
}

/**
 * Hapus pesanan
 */
export async function deleteOrder(orderId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)

      if (error) console.warn("Supabase deleteOrder error:", error)
    } catch (err) {
      console.warn("Supabase deleteOrder failed:", err)
    }
  }

  try {
    const list = getOrdersFromLocalStorage()
    const filtered = list.filter(item => item.id !== orderId)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (e) {
    console.error("deleteOrder error:", e)
    return { success: false, error: e }
  }
}

/**
 * Ambil master bahan & resep (BOM)
 */
export async function getIngredients() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bom_ingredients")
        .select("*")
        .order("created_at", { ascending: true })

      if (!error && data && data.length > 0) {
        return data
      }
      console.warn("Supabase getIngredients empty or error, falling back to localStorage:", error)
    } catch (err) {
      console.warn("Supabase getIngredients failed:", err)
    }
  }

  return getIngredientsFromLocalStorage()
}

function getIngredientsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(INGREDIENTS_KEY)
    if (!raw) {
      localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(INITIAL_BOM_INGREDIENTS))
      return INITIAL_BOM_INGREDIENTS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error("Error reading ingredients from localStorage:", e)
    return INITIAL_BOM_INGREDIENTS
  }
}

/**
 * Update resep atau harga bahan
 */
export async function updateIngredient(ingredientId, updatedFields) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bom_ingredients")
        .update({
          ...updatedFields,
          updated_at: new Date().toISOString()
        })
        .eq("id", ingredientId)
        .select()
        .single()

      if (!error && data) {
        updateIngredientInLocalStorage(ingredientId, updatedFields)
        return { success: true, ingredient: data }
      }
      console.warn("Supabase updateIngredient error:", error)
    } catch (err) {
      console.warn("Supabase updateIngredient failed:", err)
    }
  }

  updateIngredientInLocalStorage(ingredientId, updatedFields)
  return { success: true }
}

function updateIngredientInLocalStorage(ingredientId, patch) {
  try {
    const list = getIngredientsFromLocalStorage()
    const updated = list.map(item => {
      if (item.id === ingredientId) {
        return { ...item, ...patch, updated_at: new Date().toISOString() }
      }
      return item
    })
    localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error("updateIngredientInLocalStorage error:", e)
  }
}

/**
 * Reset data demo ke seed awal (berguna saat pengujian)
 */
export function resetDemoData() {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS))
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(INITIAL_BOM_INGREDIENTS))
  return {
    orders: INITIAL_ORDERS.map(normalizeOrderFromDb),
    ingredients: INITIAL_BOM_INGREDIENTS,
  }
}
