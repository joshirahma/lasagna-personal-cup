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
 */
export function generateOrderNumber(existingOrders = []) {
  const currentMax = existingOrders.reduce((max, ord) => {
    const numPart = parseInt((ord.order_number || "").replace(/\D/g, ""), 10)
    return !isNaN(numPart) && numPart > max ? numPart : max
  }, 1000)

  return `LPC-${currentMax + 1}`
}

/**
 * Ambil semua data pesanan
 */
export async function getOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Supabase getOrders error, falling back to localStorage:", error)
        return getOrdersFromLocalStorage()
      }
      return data || []
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
      return INITIAL_ORDERS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error("Error reading orders from localStorage:", err)
    return INITIAL_ORDERS
  }
}

/**
 * Tambah pesanan baru
 */
export async function createOrder(orderInput) {
  const allCurrent = getOrdersFromLocalStorage()
  const orderNumber = orderInput.order_number || generateOrderNumber(allCurrent)
  const quantity = Math.max(1, parseInt(orderInput.quantity, 10) || 1)
  const unitPrice = orderInput.unit_price || PRICE_PER_CUP
  const totalPrice = quantity * unitPrice

  const newOrder = {
    id: "ord-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    order_number: orderNumber,
    customer_name: orderInput.customer_name.trim(),
    customer_role: orderInput.customer_role.trim(),
    whatsapp_number: orderInput.whatsapp_number.trim(),
    quantity: quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    cod_location: orderInput.cod_location,
    cod_time: orderInput.cod_time,
    notes: (orderInput.notes || "").trim(),
    status: "Pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
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
          notes: newOrder.notes,
          status: newOrder.status,
        }])
        .select()
        .single()

      if (!error && data) {
        // Simpan juga ke local mirror
        saveOrderToLocalStorage(data)
        return { success: true, order: data }
      }
      console.warn("Supabase createOrder error, saved to localStorage only:", error)
    } catch (err) {
      console.warn("Supabase createOrder failed:", err)
    }
  }

  // Fallback LocalStorage
  saveOrderToLocalStorage(newOrder)
  return { success: true, order: newOrder }
}

function saveOrderToLocalStorage(order) {
  try {
    const list = getOrdersFromLocalStorage()
    const updated = [order, ...list]
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error("saveOrderToLocalStorage error:", e)
  }
}

/**
 * Update status pesanan
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select()
        .single()

      if (!error && data) {
        updateOrderInLocalStorage(orderId, { status: newStatus })
        return { success: true, order: data }
      }
      console.warn("Supabase updateOrderStatus error:", error)
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
    orders: INITIAL_ORDERS,
    ingredients: INITIAL_BOM_INGREDIENTS,
  }
}
