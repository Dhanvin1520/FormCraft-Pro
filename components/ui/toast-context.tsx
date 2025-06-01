"use client"

import { createContext, useContext, useState } from "react"

type Toast = {
  id: number
  title: string
  description?: string
}

type ToastContextType = {
  toasts: Toast[]
  toast: (t: Omit<Toast, "id">) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description }: Omit<Toast, "id">) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), title, description },
    ])

    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}

      {/* Render the toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-black text-white px-4 py-2 rounded shadow"
          >
            <strong>{t.title}</strong>
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}