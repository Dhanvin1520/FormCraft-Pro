"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, QrCode, Mail, MessageSquare } from "lucide-react"
import type { Form } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

interface ShareDialogProps {
  form: Form
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ form, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const formUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/form/${form.id}`
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Please fill out: ${form.title}`)
    const body = encodeURIComponent(`Hi,\n\nPlease fill out this form: ${formUrl}\n\nThanks!`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Please fill out this form: ${formUrl}`)
    window.open(`sms:?body=${message}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>Share your form with others using the options below</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{form.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{form.fields.length} fields</Badge>
                {form.isMultiStep && <Badge variant="outline">{form.steps} steps</Badge>}
              </div>
            </CardHeader>
          </Card>

          {/* Direct Link */}
          <div className="space-y-3">
            <Label>Direct Link</Label>
            <div className="flex gap-2">
              <Input value={formUrl} readOnly className="flex-1" />
              <Button variant="outline" onClick={() => copyToClipboard(formUrl, "Link")}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => window.open(formUrl, "_blank")}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-3">
            <Label>Embed Code</Label>
            <div className="flex gap-2">
              <Input value={embedCode} readOnly className="flex-1 font-mono text-sm" />
              <Button variant="outline" onClick={() => copyToClipboard(embedCode, "Embed code")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label>Share Via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={shareViaEmail} className="justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" onClick={shareViaSMS} className="justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">QR Code would appear here</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Scan to open form on mobile devices
              </p>
            </CardContent>
          </Card>

          {/* Form Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submissions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
