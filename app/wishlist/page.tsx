'use client';

import { useEffect, useState } from 'react';
import { storageService } from '@/lib/services/storage-service';
import { Product } from '@/lib/models/product';
import { ProductCard } from '@/components/product-card';
import { StoreHeader } from '@/components/store-header';
import { CartDrawer } from '@/components/cart-drawer';
import { OrderItem } from '@/lib/models/order';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  const { toast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Mock user ID for demo
  const GUEST_ID = 'guest_user';

  useEffect(() => {
    // In a real app, we would fetch this from the server or local storage
    // For this demo, we'll use the storageService which persists in memory
    const products = storageService.getWishlist(GUEST_ID);
    setWishlistProducts(products);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? new OrderItem(item.product, item.quantity + 1, item.priceAtPurchase)
            : item
        );
      }
      return [...prev, new OrderItem(product, 1, product.price)];
    });
    
    setIsCartOpen(true);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} adicionado com sucesso.`,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    storageService.removeFromWishlist(GUEST_ID, product.id);
    setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
    toast({
      title: "Removido dos favoritos",
      description: `${product.name} removido da sua lista.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StoreHeader cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold">Meus Favoritos</h1>
            <p className="text-muted-foreground">Gerencie os produtos que você mais gostou.</p>
          </div>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                isWishlisted={true}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-lg bg-muted/30">
            <Heart className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h2 className="text-xl font-medium mb-2">Sua lista está vazia</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Você ainda não salvou nenhum produto. Explore nossa loja e clique no coração para salvar o que gostar.
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={() => {}} // Simplified for wishlist page
        onRemoveItem={() => {}} // Simplified for wishlist page
        onCheckout={() => {}} // Simplified for wishlist page
      />
      <Toaster />
    </div>
  );
}
