import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Customer/Hero'
import IngredientsShowcase from './components/Customer/IngredientsShowcase'
import OrderForm from './components/Customer/OrderForm'
import OrderSuccessModal from './components/Customer/OrderSuccessModal'
import OrderTrackerModal from './components/Customer/OrderTrackerModal'
import AdminLogin from './components/Admin/AdminLogin'
import AdminHeader from './components/Admin/AdminHeader'
import TabOrders from './components/Admin/TabOrders'
import TabBOMCalculator from './components/Admin/TabBOMCalculator'
import TabFinanceMaster from './components/Admin/TabFinanceMaster'
import AddOrderModal from './components/Admin/AddOrderModal'

import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getIngredients,
  updateIngredient,
  resetDemoData
} from './lib/storage'
import { INITIAL_BOM_INGREDIENTS, BRAND_NAME, CAMPUS_NAME, DEFAULT_WHATSAPP } from './lib/constants'
import { MessageCircle, Heart, Shield, Sparkles } from 'lucide-react'

// Helper untuk mengecek parameter URL ?admin=true
function checkIsAdminParam() {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('admin') === 'true'
}

export default function App() {
  // Navigation: 'customer' or 'admin' (Hanya 'admin' jika URL memiliki ?admin=true)
  const [currentView, setCurrentView] = useState(() => {
    return checkIsAdminParam() ? 'admin' : 'customer'
  })

  // Admin auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('lpc_admin_auth') === 'true'
  })

  // Admin tab: 'orders' | 'bom' | 'finance'
  const [adminTab, setAdminTab] = useState('orders')

  // Data states
  const [orders, setOrders] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)

  // Pantau perubahan URL / popstate / hash
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminParam()) {
        setCurrentView('admin')
      } else {
        setCurrentView('customer')
      }
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  // Load initial data
  const loadData = async () => {
    setLoading(true)
    try {
      const [loadedOrders, loadedIngredients] = await Promise.all([
        getOrders(),
        getIngredients(),
      ])
      setOrders(loadedOrders)
      setIngredients(loadedIngredients)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Navigation handlers
  const handleNavigate = (view) => {
    setCurrentView(view)
    try {
      const url = new URL(window.location.href)
      if (view === 'admin') {
        url.searchParams.set('admin', 'true')
        url.hash = ''
        window.history.pushState({}, '', url.toString())
      } else {
        url.searchParams.delete('admin')
        url.hash = ''
        const newUrl = url.pathname + (url.search ? url.search : '')
        window.history.pushState({}, '', newUrl)
      }
    } catch (e) {
      console.error(e)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    sessionStorage.setItem('lpc_admin_auth', 'true')
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    sessionStorage.removeItem('lpc_admin_auth')
    handleNavigate('customer')
  }

  // Order Handlers
  const handleCreateOrder = async (orderFormData) => {
    const res = await createOrder(orderFormData)
    if (res && res.order) {
      setOrders((prev) => [res.order, ...prev])
      setLastSubmittedOrder(res.order)
      return res.order
    }
    throw new Error('Gagal menyimpan pesanan.')
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
  }

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder(orderId)
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId))
  }

  // Ingredient Handlers
  const handleUpdateIngredient = async (ingredientId, patch) => {
    await updateIngredient(ingredientId, patch)
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === ingredientId ? { ...ing, ...patch } : ing))
    )
  }

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin me-reset data simulasi ke awal (3 pesanan seed total 15 cup)?')) {
      const restored = resetDemoData()
      setOrders(restored.orders)
      setIngredients(restored.ingredients)
    }
  }

  const handleResetIngredientsOnly = () => {
    localStorage.setItem('lpc_bom_ingredients_v1', JSON.stringify(INITIAL_BOM_INGREDIENTS))
    setIngredients(INITIAL_BOM_INGREDIENTS)
  }

  const scrollToOrder = () => {
    const el = document.getElementById('order-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Active production cups for badge
  const activeCupsCount = orders
    .filter((o) => ['Menunggu Verifikasi', 'Pending', 'Diproses', 'Siap COD', 'Siap Diambil'].includes(o.status))
    .reduce((sum, o) => sum + (o.quantity || 0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-warmbg-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <div>
            {/* Hero Section */}
            <Hero onOrderClick={scrollToOrder} />

            {/* Ingredients Transparency Section */}
            <IngredientsShowcase />

            {/* Pre-Order Form Section */}
            <OrderForm onOrderSubmitted={handleCreateOrder} />
          </div>
        ) : (
          /* Admin / Internal Team Area */
          <div>
            {!isAdminLoggedIn ? (
              <AdminLogin
                onLoginSuccess={handleAdminLoginSuccess}
                onBackToCustomer={() => handleNavigate('customer')}
              />
            ) : (
              <div>
                <AdminHeader
                  activeTab={adminTab}
                  onTabChange={setAdminTab}
                  onLogout={handleAdminLogout}
                  onResetData={handleResetData}
                  totalOrdersCount={orders.length}
                  activeCupsCount={activeCupsCount}
                />

                <div className="max-w-5xl mx-auto px-4 pb-16">
                  {adminTab === 'orders' && (
                    <TabOrders
                      orders={orders}
                      onUpdateStatus={handleUpdateStatus}
                      onDeleteOrder={handleDeleteOrder}
                      onOpenAddModal={() => setIsAddOrderOpen(true)}
                    />
                  )}

                  {adminTab === 'bom' && (
                    <TabBOMCalculator
                      orders={orders}
                      ingredients={ingredients}
                    />
                  )}

                  {adminTab === 'finance' && (
                    <TabFinanceMaster
                      orders={orders}
                      ingredients={ingredients}
                      onUpdateIngredient={handleUpdateIngredient}
                      onResetIngredients={handleResetIngredientsOnly}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {lastSubmittedOrder && (
        <OrderSuccessModal
          order={lastSubmittedOrder}
          onClose={() => setLastSubmittedOrder(null)}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackerModal
          orders={orders}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

      {isAddOrderOpen && (
        <AddOrderModal
          onAddOrder={handleCreateOrder}
          onClose={() => setIsAddOrderOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-warmbg-300 py-6 text-center text-xs text-slate-500">
        <div className="max-w-md mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 font-bold text-crust-950">
            <span>{BRAND_NAME}</span>
            <span>•</span>
            <span>{CAMPUS_NAME}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Praktis, Hangat, & Creamy. Dibuat dengan cinta untuk civitas akademika kampus.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Penjual (0858-8916-7365)</span>
            </a>
            {currentView === 'admin' && (
              <>
                <span>•</span>
                <button
                  onClick={() => handleNavigate('customer')}
                  className="text-slate-500 font-medium hover:text-tomato-600"
                >
                  Kembali ke Menu Pembeli
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
