'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storageService } from '@/lib/services/storage-service';
import { Product } from '@/lib/models/product';
import { StoreHeader } from '@/components/store-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, X, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ComparePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(storageService.getComparisonList());
  }, []);

  const handleRemove = (productId: string) => {
    storageService.removeFromComparison(productId);
    setProducts(storageService.getComparisonList());
    toast({
      title: 'Produto removido',
      description: 'Produto removido da comparação.',
    });
  };

  const handleClear = () => {
    storageService.clearComparison();
    setProducts([]);
    toast({
      title: 'Comparação limpa',
      description: 'Todos os produtos foram removidos.',
    });
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader cartItemCount={0} onOpenCart={() => {}} />
        <main className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para loja
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum produto para comparar</h3>
              <p className="text-muted-foreground mb-4">Adicione produtos à comparação para ver as diferenças.</p>
              <Button onClick={() => router.push('/')}>Explorar produtos</Button>
            </CardContent>
          </Card>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader cartItemCount={0} onOpenCart={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para loja
            </Button>
            <h1 className="text-4xl font-bold mb-2">Comparar Produtos</h1>
            <p className="text-muted-foreground">Compare até 4 produtos lado a lado</p>
          </div>
          <Button variant="outline" onClick={handleClear}>Limpar tudo</Button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max">
            {products.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleRemove(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-6 space-y-4">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Categoria</p>
                      <p className="text-sm">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Estoque</p>
                      <p className="text-sm">{product.stock} unidades</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Avaliação</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.getAverageRating().toFixed(1)} ({product.reviews.length} avaliações)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Descrição</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => router.push(`/products/${product.id}`)}>
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
