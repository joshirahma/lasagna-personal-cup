import React, { useState } from 'react'
import { Lock, KeyRound, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { DEFAULT_ADMIN_PIN, BRAND_NAME } from '../../lib/constants'

export default function AdminLogin({ onLoginSuccess, onBackToCustomer }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const expectedPin = import.meta.env.VITE_ADMIN_PIN || DEFAULT_ADMIN_PIN

  const handleDigitClick = (digit) => {
    if (pin.length < 6) {
      const nextPin = pin + digit
      setPin(nextPin)
      setError(false)
      if (nextPin === expectedPin) {
        onLoginSuccess()
      }
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(false)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (pin === expectedPin) {
      onLoginSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-warmbg-300 text-center animate-in fade-in duration-300">
        {/* Back button */}
        <button
          onClick={onBackToCustomer}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-4 transition self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Menu Pembeli</span>
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-crust-800 text-cheese-300 mx-auto flex items-center justify-center mb-3 shadow-md">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-extrabold text-crust-950">
          Akses Tim Internal
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Masukkan 4-digit PIN keamanan tim {BRAND_NAME}
        </p>

        {/* PIN Dots Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-tomato-600 scale-125'
                    : 'bg-slate-200 border border-slate-300'
                }`}
              />
            )
          })}
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>PIN salah. Silakan coba lagi!</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitClick(String(num))}
              className="h-12 rounded-xl bg-warmbg-100 hover:bg-cheese-100 active:bg-tomato-500 active:text-white font-bold text-base text-crust-950 border border-warmbg-300 shadow-xs active:scale-95 transition"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('')}
            className="h-12 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 active:scale-95 transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="h-12 rounded-xl bg-warmbg-100 hover:bg-cheese-100 active:bg-tomato-500 active:text-white font-bold text-base text-crust-950 border border-warmbg-300 shadow-xs active:scale-95 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 active:scale-95 transition"
          >
            ⌫ Hapus
          </button>
        </div>

        {/* Demo Helper Note */}
        <div className="p-2.5 rounded-xl bg-cheese-50 border border-cheese-200 text-[11px] text-crust-800 text-left">
          <p className="font-semibold text-center">
            💡 Demo PIN Default: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-tomato-600">1234</code>
          </p>
        </div>
      </div>
    </div>
  )
}
