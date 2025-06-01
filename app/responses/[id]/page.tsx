"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar } from "lucide-react"
import Link from "next/link"
import { useFormStore } from "@/lib/store"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResponsesPage() {
  const params = useParams()
  const formId = params.id as string
  const { forms, getFormResponses } = useFormStore()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])

  useEffect(() => {
    const foundForm = forms.find((f) => f.id === formId)
    if (foundForm) {
      setForm(foundForm)
      setResponses(getFormResponses(formId))
    }
  }, [formId, forms, getFormResponses])

  const exportToCSV = () => {
    if (!form || responses.length === 0) return

    const headers = form.fields.map((field) => field.label)
    const csvContent = [
      ["Submission Date", ...headers].join(","),
      ...responses.map((response) =>
        [
          new Date(response.submittedAt).toLocaleString(),
          ...form.fields.map((field) => {
            const value = response.data[field.id]
            if (Array.isArray(value)) {
              return `"${value.join(", ")}"`
            }
            return `"${value || ""}"`
          }),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <Link href="/forms">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forms
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/forms">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Form Responses</h1>
              <p className="text-gray-600 dark:text-gray-300">{form.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {responses.length > 0 && (
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{responses.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{form.fields.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</p>
            </CardContent>
          </Card>
        </div>

        {/* Responses */}
        {responses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No responses yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Share your form to start collecting responses</p>
              <Link href={`/form/${form.id}`}>
                <Button>View Form</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Response #{responses.length - index}</CardTitle>
                    <Badge variant="outline">{new Date(response.submittedAt).toLocaleString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.fields.map((field) => {
                      const value = response.data[field.id]
                      return (
                        <div key={field.id} className="space-y-2">
                          <Label className="font-medium text-gray-900 dark:text-white">{field.label}</Label>
                          <div className="text-gray-600 dark:text-gray-300">
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-1">
                                {value.map((item, i) => (
                                  <Badge key={i} variant="secondary">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : value ? (
                              <p>{value}</p>
                            ) : (
                              <p className="text-gray-400 italic">No response</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
