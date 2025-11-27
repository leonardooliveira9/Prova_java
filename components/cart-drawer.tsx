"use client"

import { useState } from "react"
import type { OrderItem } from "@/lib/models/order"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"
import Image from "next/image"
import { storageService } from "@/lib/services/storage-service"
import { useToast } from "@/hooks/use-toast"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: OrderItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: (appliedDiscount?: { code: string; value: number }) => void
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const { toast } = useToast()
  const [promoCode, setPromoCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number } | null>(null)

  const subtotal = items.reduce((sum, item) => sum + item.getSubtotal(), 0)
  const discountAmount = appliedDiscount ? appliedDiscount.value : 0
  const total = Math.max(0, subtotal - discountAmount)

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return

    const code = storageService.getPromoCode(promoCode)
    if (code && code.isActive) {
      if (subtotal >= code.minOrderValue) {
        const discount = code.calculateDiscount(subtotal)
        setAppliedDiscount({ code: code.code, value: discount })
        toast({
          title: "Cupom aplicado!",
          description: `Desconto de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(discount)} aplicado.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Cupom inválido",
          description: `Valor mínimo para este cupom é ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(code.minOrderValue)}.`,
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Cupom inválido",
        description: "Este código promocional não existe ou expirou.",
      })
    }
  }

  const handleRemovePromo = () => {
    setAppliedDiscount(null)
    setPromoCode("")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Seu Carrinho</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Seu carrinho está vazio"
              : `${items.length} ${items.length === 1 ? "item" : "itens"} no carrinho`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p>Adicione produtos para começar</p>
            <Button variant="outline" onClick={onClose}>
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            item.priceAtPurchase,
                          )}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Cupom de Desconto</span>
                </div>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-background p-2 rounded border border-dashed border-green-500/50">
                    <span className="text-sm font-medium text-green-600">{appliedDiscount.code}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground hover:text-destructive"
                      onClick={handleRemovePromo}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código promocional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-9 bg-background"
                    />
                    <Button size="sm" variant="secondary" onClick={handleApplyPromo}>
                      Aplicar
                    </Button>
                  </div>
                )}
              </div>

              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto ({appliedDiscount.code})</span>
                    <span>
                      - {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}</span>
                </div>
              </div>
              <SheetFooter>
                <Button
                  className="w-full h-12 text-lg rounded-full"
                  onClick={() => onCheckout(appliedDiscount || undefined)}
                >
                  Finalizar Compra
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
