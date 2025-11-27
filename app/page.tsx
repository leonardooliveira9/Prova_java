"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { storageService } from "@/lib/services/storage-service"
import type { Product } from "@/lib/models/product"
import { ProductCard } from "@/components/product-card"
import { StoreHeader } from "@/components/store-header"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { OrderItem, Order } from "@/lib/models/order"
import { Customer } from "@/lib/models/customer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Package, ShieldCheck, Zap, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Home() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set())
  const [currentDiscount, setCurrentDiscount] = useState<{ code: string; value: number } | null>(null)

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [minRating, setMinRating] = useState<number>(0)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>("default")
  const [showFilters, setShowFilters] = useState(false)

  const GUEST_ID = "guest_user"

  useEffect(() => {
    const allProducts = storageService.getAllProducts()
    setProducts(allProducts)
    setCategories(storageService.getCategories())

    const wishlist = storageService.getWishlist(GUEST_ID)
    setWishlistIds(new Set(wishlist.map((p) => p.id)))

    const comparison = storageService.getComparisonList()
    setComparisonIds(new Set(comparison.map((p) => p.id)))
  }, [])

  const searchQuery = searchParams.get("search")

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Price range filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.getAverageRating() >= minRating)
    }

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0)
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => b.getAverageRating() - a.getAverageRating())
        break
      default:
        break
    }

    return filtered
  }, [products, selectedCategory, searchQuery, priceRange, minRating, showInStockOnly, sortBy])

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id ? new OrderItem(item.product, item.quantity + 1, item.priceAtPurchase) : item,
        )
      }
      return [...prev, new OrderItem(product, 1, product.price)]
    })

    setIsCartOpen(true)
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} adicionado com sucesso.`,
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? new OrderItem(item.product, quantity, item.priceAtPurchase) : item,
      ),
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleCheckout = (appliedDiscount?: { code: string; value: number }) => {
    setCurrentDiscount(appliedDiscount || null)
    setIsCheckoutOpen(true)
  }

  const handleConfirmOrder = (data: any) => {
    const customer = new Customer(data.name, data.email, data.phone, data.address)

    const subtotal = cartItems.reduce((sum, item) => sum + item.getSubtotal(), 0)
    const discountAmount = data.appliedDiscount ? data.appliedDiscount.value : 0
    const orderTotal = Math.max(0, subtotal - discountAmount)

    const pointsEarned = Math.floor(orderTotal)
    customer.addLoyaltyPoints(pointsEarned)

    storageService.addCustomer(customer)
    localStorage.setItem("customerEmail", data.email)

    const order = new Order(customer, cartItems)
    if (data.appliedDiscount) {
      order["_appliedDiscount"] = data.appliedDiscount
      order["_finalTotal"] = orderTotal
    }
    storageService.addOrder(order)

    cartItems.forEach((item) => {
      const product = storageService.getProduct(item.product.id)
      product.decreaseStock(item.quantity)
      storageService.updateProduct(product.id, product)
    })

    setCartItems([])
    setIsCheckoutOpen(false)
    setIsCartOpen(false)

    toast({
      title: "Pedido realizado!",
      description: `Pedido confirmado! Você ganhou ${pointsEarned} pontos de fidelidade.`,
    })

    window.location.href = `/order-confirmation/${order.id}`
  }

  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.has(product.id)) {
      storageService.removeFromWishlist(GUEST_ID, product.id)
      setWishlistIds((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
      toast({
        title: "Removido dos favoritos",
        description: `${product.name} removido.`,
      })
    } else {
      storageService.addToWishlist(GUEST_ID, product.id)
      setWishlistIds((prev) => {
        const next = new Set(prev)
        next.add(product.id)
        return next
      })
      toast({
        title: "Adicionado aos favoritos",
        description: `${product.name} salvo na sua lista.`,
      })
    }
  }

  const handleToggleComparison = (product: Product) => {
    try {
      if (comparisonIds.has(product.id)) {
        storageService.removeFromComparison(product.id)
        setComparisonIds((prev) => {
          const next = new Set(prev)
          next.delete(product.id)
          return next
        })
        toast({
          title: "Removido da comparação",
          description: `${product.name} removido.`,
        })
      } else {
        storageService.addToComparison(product.id)
        setComparisonIds((prev) => {
          const next = new Set(prev)
          next.add(product.id)
          return next
        })
        toast({
          title: "Adicionado à comparação",
          description: `${product.name} adicionado. ${comparisonIds.size + 1}/4 produtos.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const scrollToProducts = () => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StoreHeader
        cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section - Vercel Style */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-gray-200 dark:border-gray-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>

          <div className="container relative mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              O futuro do e-commerce
              <br />
              começa aqui.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Uma plataforma completa para gerenciar produtos, clientes e pedidos com a elegância e performance que sua
              marca merece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base rounded-full" onClick={scrollToProducts}>
                Explorar Coleção
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm"
              >
                Ver Documentação
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <Zap className="h-8 w-8 mb-4 text-foreground" />
                <h3 className="text-2xl font-bold mb-2">Ultra Rápido</h3>
                <p className="text-muted-foreground">Performance otimizada para a melhor experiência de compra.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border-l border-r border-gray-200 dark:border-gray-800">
                <ShieldCheck className="h-8 w-8 mb-4 text-foreground" />
                <h3 className="text-2xl font-bold mb-2">Seguro</h3>
                <p className="text-muted-foreground">Proteção total dos seus dados e transações.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Package className="h-8 w-8 mb-4 text-foreground" />
                <h3 className="text-2xl font-bold mb-2">Escalável</h3>
                <p className="text-muted-foreground">Cresça seu negócio sem se preocupar com infraestrutura.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section" className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Categorias</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Todos os Produtos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full justify-start mb-4 bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtros Avançados
                </Button>

                {showFilters && (
                  <div className="space-y-6 p-4 border rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Faixa de Preço</Label>
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Avaliação Mínima</Label>
                      <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Todas</SelectItem>
                          <SelectItem value="1">1+ estrelas</SelectItem>
                          <SelectItem value="2">2+ estrelas</SelectItem>
                          <SelectItem value="3">3+ estrelas</SelectItem>
                          <SelectItem value="4">4+ estrelas</SelectItem>
                          <SelectItem value="5">5 estrelas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={showInStockOnly}
                        onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
                      />
                      <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                        Apenas em estoque
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {comparisonIds.size > 0 && (
                <Button className="w-full" variant="secondary" onClick={() => (window.location.href = "/compare")}>
                  Comparar ({comparisonIds.size})
                </Button>
              )}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {selectedCategory ||
                    (searchParams.get("search") ? `Resultados para "${searchParams.get("search")}"` : "Destaques")}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{filteredProducts.length} produtos</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Padrão</SelectItem>
                      <SelectItem value="price-asc">Menor preço</SelectItem>
                      <SelectItem value="price-desc">Maior preço</SelectItem>
                      <SelectItem value="name">Nome (A-Z)</SelectItem>
                      <SelectItem value="rating">Melhor avaliados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isWishlisted={wishlistIds.has(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      isInComparison={comparisonIds.has(product.id)}
                      onToggleComparison={handleToggleComparison}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed rounded-lg">
                  <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange([0, 10000])
                      setMinRating(0)
                      setShowInStockOnly(false)
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-muted/20">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Neurobyte</h4>
            <p className="text-sm text-muted-foreground">
              A plataforma definitiva para suas compras online. Qualidade, segurança e rapidez em um só lugar.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
              <Button size="sm">Assinar</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
          © 2025 Neurobyte. Todos os direitos reservados.
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onConfirm={handleConfirmOrder}
        subtotal={cartItems.reduce((sum, item) => sum + item.getSubtotal(), 0)}
        appliedDiscount={currentDiscount}
      />
      <Toaster />
    </div>
  )
}
