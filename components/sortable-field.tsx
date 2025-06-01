"use client"

import type React from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Trash2, Settings } from "lucide-react"
import { type FormField, useFormStore } from "@/lib/store"

interface SortableFieldProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
}

export function SortableField({ field, isSelected, onSelect }: SortableFieldProps) {
  const deleteField = useFormStore((state) => state.deleteField)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteField(field.id)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : "hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">{field.label}</span>
              {field.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
              {field.step && field.step > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Step {field.step}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{field.type} field</p>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onSelect} className="h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
