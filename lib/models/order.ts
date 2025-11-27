import { Product } from './product';
import { Customer } from './customer';

export class OrderItem {
  constructor(
    public product: Product,
    public quantity: number,
    public priceAtPurchase: number
  ) {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
  }

  getSubtotal(): number {
    return this.priceAtPurchase * this.quantity;
  }

  toJSON() {
    return {
      product: this.product.toJSON(),
      quantity: this.quantity,
      priceAtPurchase: this.priceAtPurchase,
    };
  }
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export class Order {
  private _id: string;
  private _customer: Customer;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(customer: Customer, items: OrderItem[]) {
    this._id = this.generateId();
    this._customer = customer;
    this._items = items;
    this._status = 'pending';
    this._createdAt = new Date();
    this._updatedAt = new Date();

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get customer(): Customer { return this._customer; }
  get items(): OrderItem[] { return [...this._items]; }
  get status(): OrderStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  getTotal(): number {
    return this._items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  addItem(item: OrderItem): void {
    if (this._status !== 'pending') {
      throw new Error('Não é possível adicionar itens a um pedido já processado');
    }
    this._items.push(item);
    this._updatedAt = new Date();
  }

  removeItem(productId: string): void {
    if (this._status !== 'pending') {
      throw new Error('Não é possível remover itens de um pedido já processado');
    }
    this._items = this._items.filter(item => item.product.id !== productId);
    this._updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[this._status].includes(newStatus)) {
      throw new Error(`Transição inválida de ${this._status} para ${newStatus}`);
    }

    this._status = newStatus;
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._customer) {
      throw new Error('Cliente é obrigatório');
    }
    if (!this._items || this._items.length === 0) {
      throw new Error('Pedido deve ter pelo menos um item');
    }
  }

  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this._id,
      customer: this._customer.toJSON(),
      items: this._items.map(item => item.toJSON()),
      status: this._status,
      total: this.getTotal(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  static fromJSON(data: any): Order {
    const customer = Customer.fromJSON(data.customer);
    const items = data.items.map((itemData: any) => 
      new OrderItem(
        Product.fromJSON(itemData.product),
        itemData.quantity,
        itemData.priceAtPurchase
      )
    );
    const order = new Order(customer, items);
    order._id = data.id;
    order._status = data.status;
    order._createdAt = new Date(data.createdAt);
    order._updatedAt = new Date(data.updatedAt);
    return order;
  }
}
