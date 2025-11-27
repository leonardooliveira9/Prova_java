'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storageService } from '@/lib/services/storage-service';
import { Order } from '@/lib/models/order';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const foundOrder = storageService.getOrder(params.id as string);
      setOrder(foundOrder);
    } catch (error) {
      router.push('/');
    }
  }, [params.id, router]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Pedido Confirmado!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Obrigado pela sua compra, {order.customer.name}.<br/>
          Enviamos um email de confirmação para {order.customer.email}.
        </p>

        <div className="bg-muted/50 p-6 text-left mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <span className="font-medium">Número do Pedido</span>
            <span className="font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.getSubtotal())}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8 text-left text-sm">
          <div className="p-4 border bg-background">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <Truck className="h-4 w-4" /> Endereço de Entrega
            </div>
            <p className="text-muted-foreground">{order.customer.address}</p>
          </div>
          <div className="p-4 border bg-background">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <Package className="h-4 w-4" /> Previsão de Entrega
            </div>
            <p className="text-muted-foreground">3 a 5 dias úteis</p>
          </div>
        </div>

        <Button asChild size="lg" className="w-full md:w-auto gap-2">
          <Link href="/">
            Continuar Comprando <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
