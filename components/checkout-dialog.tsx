"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputValidator } from "@/lib/validators/input-validator"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (customerData: {
    name: string
    email: string
    phone: string
    address: string
    appliedDiscount?: { code: string; value: number }
  }) => void
  subtotal: number
  appliedDiscount?: { code: string; value: number }
}

export function CheckoutDialog({ open, onOpenChange, onConfirm, subtotal, appliedDiscount }: CheckoutDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const discountAmount = appliedDiscount ? appliedDiscount.value : 0
  const finalTotal = Math.max(0, subtotal - discountAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    try {
      // Validate each field
      if (!formData.name.trim()) {
        errors.name = "Nome é obrigatório"
      } else {
        InputValidator.sanitizeString(formData.name, 100)
      }

      if (!formData.email.trim()) {
        errors.email = "Email é obrigatório"
      } else {
        InputValidator.validateEmail(formData.email)
      }

      if (!formData.phone.trim()) {
        errors.phone = "Telefone é obrigatório"
      } else {
        InputValidator.validatePhone(formData.phone)
      }

      if (!formData.address.trim()) {
        errors.address = "Endereço é obrigatório"
      } else {
        InputValidator.validateAddress(formData.address)
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({})
      onConfirm({ ...formData, appliedDiscount })
      setFormData({ name: "", email: "", phone: "", address: "" })
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({ form: error.message })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription>Preencha seus dados para concluir o pedido.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {validationErrors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {validationErrors.form}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={validationErrors.name ? "border-red-500" : ""}
              placeholder="João Silva"
            />
            {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={validationErrors.email ? "border-red-500" : ""}
              placeholder="seu@email.com"
            />
            {validationErrors.email && <p className="text-xs text-red-500">{validationErrors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={validationErrors.phone ? "border-red-500" : ""}
              placeholder="(11) 99999-9999"
            />
            {validationErrors.phone && <p className="text-xs text-red-500">{validationErrors.phone}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Endereço de Entrega</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={validationErrors.address ? "border-red-500" : ""}
              placeholder="Rua das Flores, 123"
            />
            {validationErrors.address && <p className="text-xs text-red-500">{validationErrors.address}</p>}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}</span>
            </div>
            {appliedDiscount && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Desconto ({appliedDiscount.code})</span>
                <span>
                  -{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t font-bold">
              <span>Total a pagar:</span>
              <span className="text-lg text-primary">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(finalTotal)}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
