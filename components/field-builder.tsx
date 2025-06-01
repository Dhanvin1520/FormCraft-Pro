"use client"

import { useState } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Share2, Undo, Redo, Monitor, Tablet, Smartphone, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { useFormStore } from "@/lib/store"
import { FieldPalette } from "@/components/field-palette"
import { SortableField } from "@/components/sortable-field"
import { FieldEditor } from "@/components/field-editor"
import { FormPreview } from "@/components/form-preview"
import { ShareDialog } from "@/components/share-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export function FormBuilder() {
  const { currentForm, updateForm, reorderFields, undo, redo, canUndo, canRedo, saveToHistory } = useFormStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showShareDialog, setShowShareDialog] = useState(false)

  if (!currentForm) return null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = currentForm.fields.findIndex((field) => field.id === active.id)
      const newIndex = currentForm.fields.findIndex((field) => field.id === over.id)
      reorderFields(oldIndex, newIndex)
    }

    setActiveId(null)
  }

  const handleSave = () => {
    saveToHistory()
    const { toast } = useToast()
    toast({
      title: "Form Saved",
      description: "Your form has been saved successfully.",
    })
  }

  const selectedField = currentForm.fields.find((field) => field.id === selectedFieldId)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <Input
                value={currentForm.title}
                onChange={(e) => updateForm(currentForm.id, { title: e.target.value })}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                placeholder="Form Title"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentForm.fields.length} fields</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo()}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo()}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Link href={`/form/${currentForm.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Field Palette */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Fields</h3>
            <FieldPalette />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Builder */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Form Builder</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="multi-step" className="text-sm">
                        Multi-step
                      </Label>
                      <Switch
                        id="multi-step"
                        checked={currentForm.isMultiStep}
                        onCheckedChange={(checked) => updateForm(currentForm.id, { isMultiStep: checked })}
                      />
                    </div>
                  </div>
                  <Textarea
                    value={currentForm.description || ""}
                    onChange={(e) => updateForm(currentForm.id, { description: e.target.value })}
                    placeholder="Form description (optional)"
                    className="mt-2"
                  />
                </CardHeader>
                <CardContent>
                  <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={currentForm.fields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {currentForm.fields.map((field) => (
                          <SortableField
                            key={field.id}
                            field={field}
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeId ? (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
                          Dragging field...
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>

                  {currentForm.fields.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Drag fields from the left panel to start building your form</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Preview & Field Editor */}
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <Tabs defaultValue="preview" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("tablet")}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>

                <div
                  className={`border rounded-lg overflow-hidden transition-all ${
                    previewMode === "mobile" ? "max-w-sm" : previewMode === "tablet" ? "max-w-md" : "w-full"
                  }`}
                >
                  <FormPreview form={currentForm} mode={previewMode} />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                {selectedField ? (
                  <FieldEditor field={selectedField} onClose={() => setSelectedFieldId(null)} />
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a field to edit its properties</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ShareDialog form={currentForm} open={showShareDialog} onOpenChange={setShowShareDialog} />
    </div>
  )
}
