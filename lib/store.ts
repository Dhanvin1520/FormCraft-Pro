import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FormField {
  id: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "date" | "email" | "phone" | "number" | "file"
  label: string
  placeholder?: string
  required: boolean
  helpText?: string
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  step?: number
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  isMultiStep: boolean
  steps: number
  createdAt: string
  updatedAt: string
}

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  fields: FormField[]
  category: string
}

interface FormStore {
  forms: Form[]
  responses: FormResponse[]
  templates: Template[]
  currentForm: Form | null
  history: Form[]
  historyIndex: number

  // Form management
  createForm: (title: string) => string
  updateForm: (id: string, updates: Partial<Form>) => void
  deleteForm: (id: string) => void
  setCurrentForm: (form: Form | null) => void

  // Field management
  addField: (field: Omit<FormField, "id">) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  deleteField: (id: string) => void
  reorderFields: (startIndex: number, endIndex: number) => void

  // Response management
  addResponse: (formId: string, data: Record<string, any>) => void
  getFormResponses: (formId: string) => FormResponse[]

  // History management
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Template management
  loadTemplate: (templateId: string) => void
  saveAsTemplate: (name: string, description: string, category: string) => void
}

const defaultTemplates: Template[] = [
  {
    id: "contact-us",
    name: "Contact Us",
    description: "Basic contact form with name, email, and message",
    category: "Business",
    fields: [
      {
        id: "1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        step: 1,
      },
      {
        id: "2",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
        step: 1,
      },
      {
        id: "3",
        type: "phone",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        required: false,
        step: 1,
      },
      {
        id: "4",
        type: "textarea",
        label: "Message",
        placeholder: "Enter your message",
        required: true,
        validation: { minLength: 10 },
        step: 1,
      },
    ],
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Multi-step customer feedback survey",
    category: "Survey",
    fields: [
      {
        id: "1",
        type: "radio",
        label: "How satisfied are you with our service?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        step: 1,
      },
      {
        id: "2",
        type: "select",
        label: "How did you hear about us?",
        required: true,
        options: ["Google Search", "Social Media", "Friend Referral", "Advertisement", "Other"],
        step: 1,
      },
      {
        id: "3",
        type: "checkbox",
        label: "Which features do you use most?",
        required: false,
        options: ["Feature A", "Feature B", "Feature C", "Feature D"],
        step: 2,
      },
      {
        id: "4",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Share any additional feedback",
        required: false,
        step: 2,
      },
    ],
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Complete event registration form",
    category: "Events",
    fields: [
      {
        id: "1",
        type: "text",
        label: "First Name",
        placeholder: "Enter your first name",
        required: true,
        step: 1,
      },
      {
        id: "2",
        type: "text",
        label: "Last Name",
        placeholder: "Enter your last name",
        required: true,
        step: 1,
      },
      {
        id: "3",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
        step: 1,
      },
      {
        id: "4",
        type: "phone",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        required: true,
        step: 2,
      },
      {
        id: "5",
        type: "select",
        label: "T-Shirt Size",
        required: true,
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        step: 2,
      },
      {
        id: "6",
        type: "checkbox",
        label: "Dietary Restrictions",
        required: false,
        options: ["Vegetarian", "Vegan", "Gluten-Free", "Nut Allergy", "None"],
        step: 2,
      },
    ],
  },
]

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [],
      responses: [],
      templates: defaultTemplates,
      currentForm: null,
      history: [],
      historyIndex: -1,

      createForm: (title: string) => {
        const id = crypto.randomUUID()
        const newForm: Form = {
          id,
          title,
          description: "",
          fields: [],
          isMultiStep: false,
          steps: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          forms: [newForm, ...state.forms],
          currentForm: newForm,
          history: [newForm],
          historyIndex: 0,
        }))

        return id
      },

      updateForm: (id: string, updates: Partial<Form>) => {
        set((state) => {
          const updatedForms = state.forms.map((form) =>
            form.id === id ? { ...form, ...updates, updatedAt: new Date().toISOString() } : form,
          )
          const updatedCurrentForm =
            state.currentForm?.id === id
              ? { ...state.currentForm, ...updates, updatedAt: new Date().toISOString() }
              : state.currentForm

          return {
            forms: updatedForms,
            currentForm: updatedCurrentForm,
          }
        })
      },

      deleteForm: (id: string) => {
        set((state) => ({
          forms: state.forms.filter((form) => form.id !== id),
          responses: state.responses.filter((response) => response.formId !== id),
          currentForm: state.currentForm?.id === id ? null : state.currentForm,
        }))
      },

      setCurrentForm: (form: Form | null) => {
        set({
          currentForm: form,
          history: form ? [form] : [],
          historyIndex: form ? 0 : -1,
        })
      },

      addField: (field: Omit<FormField, "id">) => {
        const id = crypto.randomUUID()
        const newField: FormField = { ...field, id }

        set((state) => {
          if (!state.currentForm) return state

          const updatedForm = {
            ...state.currentForm,
            fields: [...state.currentForm.fields, newField],
            updatedAt: new Date().toISOString(),
          }

          return {
            currentForm: updatedForm,
            forms: state.forms.map((form) => (form.id === updatedForm.id ? updatedForm : form)),
          }
        })

        get().saveToHistory()
      },

      updateField: (id: string, updates: Partial<FormField>) => {
        set((state) => {
          if (!state.currentForm) return state

          const updatedForm = {
            ...state.currentForm,
            fields: state.currentForm.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
            updatedAt: new Date().toISOString(),
          }

          return {
            currentForm: updatedForm,
            forms: state.forms.map((form) => (form.id === updatedForm.id ? updatedForm : form)),
          }
        })

        get().saveToHistory()
      },

      deleteField: (id: string) => {
        set((state) => {
          if (!state.currentForm) return state

          const updatedForm = {
            ...state.currentForm,
            fields: state.currentForm.fields.filter((field) => field.id !== id),
            updatedAt: new Date().toISOString(),
          }

          return {
            currentForm: updatedForm,
            forms: state.forms.map((form) => (form.id === updatedForm.id ? updatedForm : form)),
          }
        })

        get().saveToHistory()
      },

      reorderFields: (startIndex: number, endIndex: number) => {
        set((state) => {
          if (!state.currentForm) return state

          const fields = [...state.currentForm.fields]
          const [reorderedField] = fields.splice(startIndex, 1)
          fields.splice(endIndex, 0, reorderedField)

          const updatedForm = {
            ...state.currentForm,
            fields,
            updatedAt: new Date().toISOString(),
          }

          return {
            currentForm: updatedForm,
            forms: state.forms.map((form) => (form.id === updatedForm.id ? updatedForm : form)),
          }
        })

        get().saveToHistory()
      },

      addResponse: (formId: string, data: Record<string, any>) => {
        const response: FormResponse = {
          id: crypto.randomUUID(),
          formId,
          data,
          submittedAt: new Date().toISOString(),
        }

        set((state) => ({
          responses: [response, ...state.responses],
        }))
      },

      getFormResponses: (formId: string) => {
        return get().responses.filter((response) => response.formId === formId)
      },

      saveToHistory: () => {
        set((state) => {
          if (!state.currentForm) return state

          const newHistory = state.history.slice(0, state.historyIndex + 1)
          newHistory.push({ ...state.currentForm })

          return {
            history: newHistory.slice(-50), // Keep last 50 states
            historyIndex: Math.min(newHistory.length - 1, 49),
          }
        })
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state

          const newIndex = state.historyIndex - 1
          const previousForm = state.history[newIndex]

          return {
            currentForm: { ...previousForm },
            historyIndex: newIndex,
            forms: state.forms.map((form) => (form.id === previousForm.id ? previousForm : form)),
          }
        })
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state

          const newIndex = state.historyIndex + 1
          const nextForm = state.history[newIndex]

          return {
            currentForm: { ...nextForm },
            historyIndex: newIndex,
            forms: state.forms.map((form) => (form.id === nextForm.id ? nextForm : form)),
          }
        })
      },

      canUndo: () => {
        const state = get()
        return state.historyIndex > 0
      },

      canRedo: () => {
        const state = get()
        return state.historyIndex < state.history.length - 1
      },

      loadTemplate: (templateId: string) => {
        const template = get().templates.find((t) => t.id === templateId)
        if (!template) return

        const id = get().createForm(template.name)
        const newForm: Form = {
          id,
          title: template.name,
          description: template.description,
          fields: template.fields.map((field) => ({ ...field, id: crypto.randomUUID() })),
          isMultiStep: template.fields.some((f) => f.step && f.step > 1),
          steps: Math.max(...template.fields.map((f) => f.step || 1)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          forms: state.forms.map((form) => (form.id === id ? newForm : form)),
          currentForm: newForm,
          history: [newForm],
          historyIndex: 0,
        }))
      },

      saveAsTemplate: (name: string, description: string, category: string) => {
        const state = get()
        if (!state.currentForm) return

        const template: Template = {
          id: crypto.randomUUID(),
          name,
          description,
          category,
          fields: state.currentForm.fields,
        }

        set((state) => ({
          templates: [template, ...state.templates],
        }))
      },
    }),
    {
      name: "form-builder-storage",
      partialize: (state) => ({
        forms: state.forms,
        responses: state.responses,
        templates: state.templates,
      }),
    },
  ),
)
