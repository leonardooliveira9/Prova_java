'use client';

import { useState } from 'react';
import { Product, Review } from '@/lib/models/product';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';
import { storageService } from '@/lib/services/storage-service';
import { useToast } from '@/hooks/use-toast';

interface ProductReviewsProps {
  product: Product;
  onReviewAdded: () => void;
}

export function ProductReviews({ product, onReviewAdded }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      product.addReview(name, rating, comment);
      storageService.updateProduct(product.id, product);
      setName('');
      setComment('');
      setRating(5);
      onReviewAdded();
      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-16 border-t pt-12">
      <h2 className="text-2xl font-bold mb-8">Avaliações ({product.reviews.length})</h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          {product.reviews.length === 0 ? (
            <p className="text-muted-foreground">Este produto ainda não tem avaliações. Seja o primeiro a avaliar!</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-foreground text-foreground' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-muted/30 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-semibold mb-4">Escreva uma avaliação</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Sua nota</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${i < rating ? 'fill-foreground text-foreground' : 'text-muted-foreground/30'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Seu nome</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: João Silva"
                required 
                className="bg-background"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Seu comentário</label>
              <Textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="O que você achou do produto?"
                required 
                className="bg-background"
              />
            </div>
            
            <Button type="submit" className="w-full">Enviar Avaliação</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
