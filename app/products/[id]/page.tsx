'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storageService } from '@/lib/services/storage-service';
import { Product } from '@/lib/models/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoreHeader } from '@/components/store-header';
import { CartDrawer } from '@/components/cart-drawer';
import { CheckoutDialog } from '@/components/checkout-dialog';
import { OrderItem, Order } from '@/lib/models/order';
import { Customer } from '@/lib/models/customer';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ProductReviews } from '@/components/product-reviews';
import Image from 'next/image';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);

  const loadProduct = useCallback(() => {
    try {
      const foundProduct = storageService.getProduct(params.id as string);
      setProduct(foundProduct);
      
      const related = storageService.getProductsByCategory(foundProduct.category)
        .filter(p => p.id !== foundProduct.id)
        .slice(0, 3);
      setRelatedProducts(related);
    } catch (error) {
      toast({
        title: "Produto não encontrado",
        description: "O produto que você procura não existe.",
        variant: "destructive"
      });
      router.push('/');
    }
  }, [params.id, router, toast]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = () => {
    if (!product) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? new OrderItem(item.product, item.quantity + quantity, item.priceAtPurchase)
            : item
        );
      }
      return [...prev, new OrderItem(product, quantity, product.price)];
    });
    
    setIsCartOpen(true);
    toast({
      title: "Adicionado ao carrinho",
      description: `${quantity}x ${product.name} adicionado.`,
    });
  };

  const handleNotifyMe = () => {
    if (!product || !notificationEmail) return;
    
    storageService.addStockNotification(product.id, notificationEmail);
    setIsNotifyDialogOpen(false);
    setNotificationEmail('');
    
    toast({
      title: "Notificação ativada",
      description: `Você será avisado quando ${product.name} voltar ao estoque.`,
    });
  };

  // Cart handlers
  const handleUpdateQuantity = (productId: string, qty: number) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? new OrderItem(item.product, qty, item.priceAtPurchase) : item));
  };
  const handleRemoveItem = (productId: string) => setCartItems(prev => prev.filter(item => item.product.id !== productId));
  const handleCheckout = () => setIsCheckoutOpen(true);
  const handleConfirmOrder = (data: any) => {
    const customer = new Customer(data.name, data.email, data.phone, data.address);
    storageService.addCustomer(customer);
    const order = new Order(customer, cartItems);
    storageService.addOrder(order);
    cartItems.forEach(item => {
      const p = storageService.getProduct(item.product.id);
      p.decreaseStock(item.quantity);
      storageService.updateProduct(p.id, p);
    });
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    router.push(`/order-confirmation/${order.id}`);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StoreHeader cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 pl-0 hover:bg-transparent hover:text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="rounded-full px-3">{product.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-foreground text-foreground mr-1" />
                <span className="font-medium text-foreground">{product.getAverageRating().toFixed(1)}</span>
                <span className="mx-1">·</span>
                <span>{product.reviews.length} avaliações</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            <p className="text-3xl font-light mb-8">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
            
            <div className="prose prose-lg text-muted-foreground mb-12">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              {product.isAvailable() ? (
                <>
                  <div className="flex items-center border border-input rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="flex-1 h-12 text-lg gap-2 rounded-full" onClick={handleAddToCart}>
                    <ShoppingBag className="h-5 w-5" />
                    Adicionar ao Carrinho
                  </Button>
                </>
              ) : (
                <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" className="flex-1 h-12 text-lg gap-2 rounded-full">
                      <Bell className="h-5 w-5" />
                      Avise-me quando chegar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notificação de Estoque</DialogTitle>
                      <DialogDescription>
                        Insira seu email para ser notificado quando {product.name} estiver disponível novamente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleNotifyMe}>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Estoque disponível: {product.stock} unidades</p>
              <p className="mt-2">Frete grátis para todo o Brasil.</p>
            </div>
          </div>
        </div>

        <ProductReviews product={product} onReviewAdded={loadProduct} />

        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-8">Você também pode gostar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <div key={p.id} className="group cursor-pointer" onClick={() => router.push(`/products/${p.id}`)}>
                  <div className="aspect-square bg-muted relative overflow-hidden mb-4 rounded-md border border-gray-200 dark:border-gray-800">
                    <Image src={p.imageUrl || "/placeholder.svg"} alt={p.name} fill className="object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-medium text-lg">{p.name}</h3>
                  <p className="text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

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
        total={cartItems.reduce((sum, item) => sum + item.getSubtotal(), 0)} 
      />
      <Toaster />
    </div>
  );
}
