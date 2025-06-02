"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStore } from "@/lib/store"

export default function BuilderPage() {
  const router = useRouter()
  const createForm = useFormStore((state) => state.createForm)

  useEffect(() => {
    const formId = createForm("Untitled Form")
    router.replace(`/builder/${formId}`)
  }, [createForm, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          We&apos;re creating your form. Please don&apos;t close this tab.
        </p>
      </div>
    </div>
  )
}