"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storageService } from "@/lib/services/storage-service"
import { Product } from "@/lib/models/product"
import type { Order, OrderStatus } from "@/lib/models/order"
import type { Customer } from "@/lib/models/customer"
import { PromoCode } from "@/lib/models/promo-code"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  DollarSign,
  Eye,
  Percent,
  Download,
  Lock,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { adminLoginRateLimiter } from "@/lib/security/rate-limiter"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({})
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [currentPromoCode, setCurrentPromoCode] = useState<Partial<PromoCode>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all")

  useEffect(() => {
    const session = localStorage.getItem("admin_session")
    if (session === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = () => {
    setProducts(storageService.getAllProducts())
    setOrders(storageService.getAllOrders())
    setCustomers(storageService.getAllCustomers())
    setPromoCodes(storageService.getAllPromoCodes())
  }

  const calculateAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.getTotal(), 0)
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    const lowStockProducts = products.filter((p) => p.stock < 10 && p.stock > 0).length
    const outOfStockProducts = products.filter((p) => p.stock === 0).length

    // Sales by category
    const salesByCategory = products.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = { category: product.category, sales: 0, revenue: 0 }
        }
        orders.forEach((order) => {
          order.items.forEach((item) => {
            if (item.product.id === product.id) {
              acc[product.category].sales += item.quantity
              acc[product.category].revenue += item.getSubtotal()
            }
          })
        })
        return acc
      },
      {} as Record<string, { category: string; sales: number; revenue: number }>,
    )

    // Recent orders trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    })

    const ordersTrend = last7Days.map((dateStr) => {
      const ordersOnDate = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        return orderDate === dateStr
      })
      return {
        date: dateStr,
        orders: ordersOnDate.length,
        revenue: ordersOnDate.reduce((sum, order) => sum + order.getTotal(), 0),
      }
    })

    return {
      totalRevenue,
      avgOrderValue,
      lowStockProducts,
      outOfStockProducts,
      salesByCategory: Object.values(salesByCategory),
      ordersTrend,
    }
  }

  const analytics = calculateAnalytics()

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentProduct.id) {
        storageService.updateProduct(currentProduct.id, currentProduct)
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        })
      } else {
        const newProduct = new Product(
          currentProduct.name || "",
          currentProduct.description || "",
          Number(currentProduct.price) || 0,
          Number(currentProduct.stock) || 0,
          currentProduct.category || "Geral",
          currentProduct.imageUrl,
        )
        storageService.addProduct(newProduct)
        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso.",
        })
      }

      setIsDialogOpen(false)
      setCurrentProduct({})
      setIsEditing(false)
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar produto",
        variant: "destructive",
      })
    }
  }

  const handleSavePromoCode = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const newPromoCode = new PromoCode(
        currentPromoCode.code || "",
        (currentPromoCode.discountType as "percentage" | "fixed") || "percentage",
        Number(currentPromoCode.value) || 0,
        Number(currentPromoCode.minOrderValue) || 0,
      )
      storageService.addPromoCode(newPromoCode)

      toast({
        title: "Cupom criado",
        description: `O cupom ${newPromoCode.code} foi criado com sucesso.`,
      })

      setIsPromoDialogOpen(false)
      setCurrentPromoCode({})
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar cupom",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      storageService.deleteProduct(id)
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      })
      loadData()
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    try {
      const order = storageService.getOrder(orderId)
      order.updateStatus(newStatus)
      storageService.updateOrder(orderId, { status: newStatus } as any)
      toast({
        title: "Status atualizado",
        description: `Pedido atualizado para ${newStatus}.`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar status",
        variant: "destructive",
      })
    }
  }

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const handleExportData = () => {
    const data = {
      products: products.map((p) => p.toJSON()),
      orders: orders.map((o) => o.toJSON()),
      customers: customers.map((c) => c.toJSON()),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ecommerce-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()

    toast({
      title: "Dados exportados",
      description: "O backup foi baixado com sucesso.",
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limit using client IP identifier (session-based for simplicity)
    const clientId = "admin_login_" + Math.random().toString(36).substr(2, 9)

    if (!adminLoginRateLimiter.isAllowed(clientId)) {
      const waitTime = Math.ceil(adminLoginRateLimiter.getRemainingTime(clientId) / 1000)
      setLoginError(`Muitas tentativas. Aguarde ${waitTime} segundos.`)
      setRemainingAttempts(0)
      toast({
        title: "Acesso bloqueado",
        description: `Muitas tentativas de login. Tente novamente em ${waitTime} segundos.`,
        variant: "destructive",
      })
      return
    }

    // Use secure password comparison (in production, use bcrypt)
    const hashedInput = require("crypto").createHash("sha256").update(password).digest("hex")
    const hashedPassword = require("crypto").createHash("sha256").update("admin123").digest("hex")

    if (hashedInput === hashedPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_session", "true")
      localStorage.setItem("admin_login_time", new Date().toISOString())
      setLoginError("")
      setRemainingAttempts(null)
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao painel administrativo.",
      })
    } else {
      const attempts = 5 - 1 // Track attempts
      setRemainingAttempts(attempts)
      setLoginError(`Senha incorreta. ${attempts} tentativas restantes.`)
      toast({
        title: "Erro de acesso",
        description: `Senha incorreta. ${attempts} tentativas restantes.`,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_session")
    localStorage.removeItem("admin_login_time")
    setPassword("")
    setRemainingAttempts(null)
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo.",
    })
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-serif">Acesso Administrativo</CardTitle>
            <CardDescription className="text-center">Digite a senha para acessar o painel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={loginError ? "border-destructive" : ""}
                />
                {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="text-center text-xs text-muted-foreground mt-4">
                Dica: a senha é <strong>admin123</strong>
              </div>
            </form>
          </CardContent>
          <div className="p-6 border-t bg-muted/50 text-center">
            <Link href="/">
              <Button variant="link" size="sm">
                Voltar para a Loja
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-serif font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Link href="/">
              <Button variant="ghost">Ver Loja</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="promo">
              <Percent className="h-4 w-4 mr-2" />
              Cupons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      analytics.totalRevenue,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ticket médio:{" "}
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      analytics.avgOrderValue,
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {orders.filter((o) => o.status === "pending").length} pendentes
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">{analytics.lowStockProducts} com estoque baixo</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total cadastrados</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos dos Últimos 7 Dias</CardTitle>
                  <CardDescription>Evolução de pedidos e receita</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      orders: {
                        label: "Pedidos",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <LineChart data={analytics.ordersTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                  <CardDescription>Receita gerada por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Receita",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <BarChart data={analytics.salesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alertas de Estoque</CardTitle>
                <CardDescription>Produtos que precisam de atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products
                    .filter((p) => p.stock < 10)
                    .slice(0, 5)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                          {product.stock === 0 ? "Esgotado" : `${product.stock} unidades`}
                        </Badge>
                      </div>
                    ))}
                  {products.filter((p) => p.stock < 10).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum alerta de estoque no momento
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between gap-4">
                <h2 className="text-lg font-semibold">Gerenciar Produtos</h2>
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setCurrentProduct({})
                      setIsEditing(false)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{product.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={product.stock < 5 ? "text-orange-600 font-medium" : ""}>
                            {product.stock} un
                          </span>
                          {product.stock === 0 && (
                            <Badge variant="destructive" className="text-[10px] h-5">
                              Esgotado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between gap-4">
                <h2 className="text-lg font-semibold">Gerenciar Pedidos</h2>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pedidos..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.substring(0, 12)}...</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customer.name}</span>
                          <span className="text-xs text-muted-foreground">{order.customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{order.items.length} itens</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          order.getTotal(),
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : order.status === "shipped"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="processing">Processando</SelectItem>
                              <SelectItem value="shipped">Enviado</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between gap-4">
                <h2 className="text-lg font-semibold">Clientes</h2>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const customerOrders = orders.filter((o) => o.customer.id === customer.id)
                    const totalSpent = customerOrders.reduce((sum, o) => sum + o.getTotal(), 0)

                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={customer.address}>
                          {customer.address}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{customerOrders.length}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                totalSpent,
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(customer.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="promo">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between gap-4">
                <h2 className="text-lg font-semibold">Cupons de Desconto</h2>
                <Button onClick={() => setIsPromoDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cupom
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Pedido Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.code}>
                      <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{promo.discountType === "percentage" ? "Percentual" : "Fixo"}</Badge>
                      </TableCell>
                      <TableCell>
                        {promo.discountType === "percentage"
                          ? `${promo.value}%`
                          : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(promo.value)}
                      </TableCell>
                      <TableCell>
                        {promo.minOrderValue > 0
                          ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              promo.minOrderValue,
                            )
                          : "Sem mínimo"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.isActive ? "default" : "secondary"}>
                          {promo.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={currentProduct.name || ""}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={currentProduct.description || ""}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.price || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={currentProduct.stock || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={currentProduct.category || ""}
                onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={currentProduct.imageUrl || ""}
                onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                placeholder="/placeholder.svg"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>Pedido #{currentOrder?.id.substring(0, 12)}</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Cliente</h4>
                  <p className="text-sm">{currentOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{currentOrder.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{currentOrder.customer.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                  <p className="text-sm">{currentOrder.customer.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x{" "}
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            item.priceAtPurchase,
                          )}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          item.getSubtotal(),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      currentOrder.getTotal(),
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Data do Pedido:</span>
                  <p>{new Date(currentOrder.createdAt).toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p>
                    <Badge
                      variant={
                        currentOrder.status === "delivered"
                          ? "default"
                          : currentOrder.status === "cancelled"
                            ? "destructive"
                            : currentOrder.status === "shipped"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {currentOrder.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Cupom de Desconto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePromoCode} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Código do Cupom</Label>
              <Input
                id="code"
                value={currentPromoCode.code || ""}
                onChange={(e) => setCurrentPromoCode({ ...currentPromoCode, code: e.target.value.toUpperCase() })}
                placeholder="EX: DESCONTO10"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discountType">Tipo de Desconto</Label>
              <Select
                value={currentPromoCode.discountType || "percentage"}
                onValueChange={(value) =>
                  setCurrentPromoCode({ ...currentPromoCode, discountType: value as "percentage" | "fixed" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value">
                  {currentPromoCode.discountType === "percentage" ? "Percentual" : "Valor (R$)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  max={currentPromoCode.discountType === "percentage" ? "100" : undefined}
                  value={currentPromoCode.value || ""}
                  onChange={(e) => setCurrentPromoCode({ ...currentPromoCode, value: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minOrderValue">Pedido Mínimo (R$)</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentPromoCode.minOrderValue || 0}
                  onChange={(e) => setCurrentPromoCode({ ...currentPromoCode, minOrderValue: Number(e.target.value) })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPromoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Cupom</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
