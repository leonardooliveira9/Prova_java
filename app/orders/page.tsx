'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storageService } from '@/lib/services/storage-service';
import { Order } from '@/lib/models/order';
import { StoreHeader } from '@/components/store-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
  processing: { label: 'Processando', icon: Package, color: 'bg-blue-500' },
  shipped: { label: 'Enviado', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('customerEmail');
    if (email) {
      setCustomerEmail(email);
      const allOrders = storageService.getAllOrders();
      const customerOrders = allOrders.filter(order => order.customer.email === email);
      setOrders(customerOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader cartItemCount={0} onOpenCart={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para loja
          </Button>
          <h1 className="text-4xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o status dos seus pedidos</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">Você ainda não realizou nenhuma compra.</p>
              <Button onClick={() => router.push('/')}>Começar a comprar</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">Pedido #{order.id.slice(-8)}</CardTitle>
                        <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${statusConfig[order.status].color}`} />
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.getSubtotal())}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.getTotal())}
                        </span>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                        <p className="text-sm">{order.customer.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
