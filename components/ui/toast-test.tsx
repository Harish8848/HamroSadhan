"use client"

import React from "react"
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport, ToastAction } from "./toast"
import { Button } from "./button"

export default function ToastTest() {
  const [open, setOpen] = React.useState(false)

  return (
    <ToastProvider>
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Show Toast</Button>
        <Toast open={open} onOpenChange={setOpen} duration={4000}>
          <ToastTitle>Test Notification</ToastTitle>
          <ToastDescription>This is a test toast notification.</ToastDescription>
          <ToastAction altText="Close" />
          <ToastClose />
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  )
}
