import { Product } from '@/lib/models/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  isInComparison?: boolean;
  onToggleComparison?: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  isWishlisted = false, 
  onToggleWishlist,
  isInComparison = false,
  onToggleComparison
}: ProductCardProps) {
  const isAvailable = product.isAvailable();

  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4 rounded-lg">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm px-3 py-1">Esgotado</Badge>
            </div>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-white/90 text-xs backdrop-blur-sm">
                Últimas unidades
              </Badge>
            </div>
          )}
        </Link>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {onToggleWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                isWishlisted && "opacity-100 translate-x-0 text-red-500 hover:text-red-600"
              )}
              onClick={(e) => {
                e.preventDefault();
                onToggleWishlist(product);
              }}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </Button>
          )}
          
          {onToggleComparison && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 delay-75",
                isInComparison && "opacity-100 translate-x-0 text-blue-500 hover:text-blue-600"
              )}
              onClick={(e) => {
                e.preventDefault();
                onToggleComparison(product);
              }}
              title="Comparar"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/products/${product.id}`} className="text-lg font-serif font-medium hover:underline decoration-1 underline-offset-4">
            {product.name}
          </Link>
          <span className="font-medium">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.category}</p>
        
        <Button 
          className="w-full mt-auto rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onAddToCart(product)}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>
      </div>
    </div>
  );
}
