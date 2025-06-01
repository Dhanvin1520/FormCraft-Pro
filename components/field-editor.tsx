"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"
import { type FormField, useFormStore } from "@/lib/store"

interface FieldEditorProps {
  field: FormField
  onClose: () => void
}

export function FieldEditor({ field, onClose }: FieldEditorProps) {
  const updateField = useFormStore((state) => state.updateField)
  const currentForm = useFormStore((state) => state.currentForm)

  const [options, setOptions] = useState(field.options || [])
  const [newOption, setNewOption] = useState("")

  const handleUpdate = (updates: Partial<FormField>) => {
    updateField(field.id, updates)
  }

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()]
      setOptions(updatedOptions)
      handleUpdate({ options: updatedOptions })
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index)
    setOptions(updatedOptions)
    handleUpdate({ options: updatedOptions })
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) => (i === index ? value : option))
    setOptions(updatedOptions)
    handleUpdate({ options: updatedOptions })
  }

  const maxSteps = currentForm?.isMultiStep ? 5 : 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Field Settings</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={field.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>

          <div>
            <Label htmlFor="help-text">Help Text</Label>
            <Textarea
              id="help-text"
              value={field.helpText || ""}
              onChange={(e) => handleUpdate({ helpText: e.target.value })}
              placeholder="Additional help text"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={field.required}
              onCheckedChange={(checked) => handleUpdate({ required: checked })}
            />
          </div>

          {currentForm?.isMultiStep && (
            <div>
              <Label htmlFor="step">Step</Label>
              <Select
                value={field.step?.toString() || "1"}
                onValueChange={(value) => handleUpdate({ step: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxSteps }, (_, i) => i + 1).map((step) => (
                    <SelectItem key={step} value={step.toString()}>
                      Step {step}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Options for select, checkbox, radio */}
        {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
          <div className="space-y-4">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                />
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Settings */}
        {(field.type === "text" || field.type === "textarea" || field.type === "email") && (
          <div className="space-y-4">
            <Label>Validation</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-length">Min Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  value={field.validation?.minLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="max-length">Max Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  value={field.validation?.maxLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Field Type Badge */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Field Type</span>
            <Badge variant="secondary" className="capitalize">
              {field.type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
