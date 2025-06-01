"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Type, AlignLeft, ChevronDown, CheckSquare, Circle, Calendar, Mail, Phone, Hash, Upload } from "lucide-react"
import { useFormStore, type FormField } from "@/lib/store"

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "textarea", label: "Textarea", icon: AlignLeft },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio Button", icon: Circle },
  { type: "date", label: "Date Picker", icon: Calendar },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "number", label: "Number", icon: Hash },
  { type: "file", label: "File Upload", icon: Upload },
] as const

function DraggableField({ type, label, icon: Icon }: { type: string; label: string; icon: any }) {
  const addField = useFormStore((state) => state.addField)

  const handleClick = () => {
    const newField: Omit<FormField, "id"> = {
      type: type as FormField["type"],
      label: label,
      placeholder: type === "textarea" ? "Enter your message..." : `Enter ${label.toLowerCase()}...`,
      required: false,
      step: 1,
    }

    if (type === "select" || type === "checkbox" || type === "radio") {
      newField.options = ["Option 1", "Option 2", "Option 3"]
    }

    addField(newField)
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function FieldPalette() {
  return (
    <div className="space-y-2">
      {fieldTypes.map((fieldType) => (
        <DraggableField key={fieldType.type} type={fieldType.type} label={fieldType.label} icon={fieldType.icon} />
      ))}
    </div>
  )
}
