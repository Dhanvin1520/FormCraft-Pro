"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Eye, Settings, Palette } from "lucide-react"
import Link from "next/link"
import { useFormStore } from "@/lib/store"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const { forms, templates } = useFormStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">FormCraft Pro</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Build beautiful, responsive forms with drag-and-drop simplicity
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/builder">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Create New Form</CardTitle>
                <CardDescription>Start building your form from scratch</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Use Template</CardTitle>
                <CardDescription>Choose from pre-built templates</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/forms">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>My Forms</CardTitle>
                <CardDescription>View and manage your forms</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Forms */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Recent Forms</h2>
          {forms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No forms created yet</p>
                <Link href="/builder">
                  <Button>Create Your First Form</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.slice(0, 6).map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <CardDescription>
                      {form.fields.length} fields • Created {new Date(form.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/builder/${form.id}`}>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/form/${form.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Drag & Drop</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Intuitive drag-and-drop interface for building forms
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">See your form in real-time as you build it</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Multi-Step</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Create complex multi-step forms with ease</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Responsive</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Forms that look great on all devices</p>
          </div>
        </div>
      </div>
    </div>
  )
}
