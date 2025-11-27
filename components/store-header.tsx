"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // ✅ App Router
import Link from "next/link"
import { ShoppingBag, Menu, Search, User, X, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface StoreHeaderProps {
  cartItemCount: number
  onOpenCart: () => void
}

export function StoreHeader({ cartItemCount, onOpenCart }: StoreHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Menu Mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Loja</Link>
          <Link href="/wishlist" className="hover:text-foreground transition-colors">Favoritos</Link>
          <Link href="/orders" className="hover:text-foreground transition-colors">Meus Pedidos</Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">Comparar</Link>
          <Link href="/database" className="hover:text-foreground transition-colors">Base de Dados</Link>
          <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
        </nav>

        {/* Logo Central */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground text-background flex items-center justify-center rounded-sm font-bold text-xs">N</div>
            <span className="text-xl font-bold tracking-tight">Neurobyte</span>
          </Link>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-2">
          {/* Barra de Busca */}
          {isSearchOpen ? (
            <form
              onSubmit={handleSearch}
              className="absolute inset-x-0 top-0 h-16 bg-background flex items-center px-4 z-50 border-b animate-in fade-in slide-in-from-top-2"
            >
              <Search className="h-4 w-4 text-muted-foreground absolute left-8" />
              <Input
                autoFocus
                placeholder="Buscar produtos..."
                className="h-10 pl-10 pr-10 w-full max-w-2xl mx-auto bg-muted/50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-4"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Outros ícones */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/orders">
            <Button variant="ghost" size="icon" className="hidden sm:flex" title="Meus Pedidos">
              <Package className="h-5 w-5" />
            </Button>
          </Link>

          {/* Carrinho */}
          <Button variant="ghost" size="icon" className="relative" onClick={onOpenCart}>
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] rounded-full bg-foreground text-background">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
