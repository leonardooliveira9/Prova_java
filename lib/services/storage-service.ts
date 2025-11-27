import { Product } from '../models/product';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { PromoCode } from '../models/promo-code';
import {
  ProductNotFoundException,
  CustomerNotFoundException,
  OrderNotFoundException,
} from '../exceptions/ecommerce-exceptions';

class StorageService {
  private products: Map<string, Product>;
  private customers: Map<string, Customer>;
  private orders: Map<string, Order>;
  private productsByCategory: Map<string, Set<string>>;
  private promoCodes: Map<string, PromoCode>;
  private wishlists: Map<string, Set<string>>; // customerId (or 'guest') -> Set<productId>
  private stockNotifications: Map<string, Set<string>>; // productId -> Set<email>
  private comparisonList: Set<string>; // Set<productId>

  constructor() {
    this.products = new Map();
    this.customers = new Map();
    this.orders = new Map();
    this.productsByCategory = new Map();
    this.promoCodes = new Map();
    this.wishlists = new Map();
    this.stockNotifications = new Map();
    this.comparisonList = new Set();
    this.initializeSampleData();
    
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Save comparison list
      localStorage.setItem('comparisonList', JSON.stringify(Array.from(this.comparisonList)));
      
      // Save wishlist (guest only for now)
      const guestWishlist = this.wishlists.get('guest_user');
      if (guestWishlist) {
        localStorage.setItem('guestWishlist', JSON.stringify(Array.from(guestWishlist)));
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Load comparison list
      const comparisonData = localStorage.getItem('comparisonList');
      if (comparisonData) {
        const ids = JSON.parse(comparisonData);
        this.comparisonList = new Set(ids);
      }

      // Load wishlist
      const wishlistData = localStorage.getItem('guestWishlist');
      if (wishlistData) {
        const ids = JSON.parse(wishlistData);
        this.wishlists.set('guest_user', new Set(ids));
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Product methods
  addProduct(product: Product): void {
    this.products.set(product.id, product);
    
    if (!this.productsByCategory.has(product.category)) {
      this.productsByCategory.set(product.category, new Set());
    }
    this.productsByCategory.get(product.category)!.add(product.id);
  }

  getProduct(id: string): Product {
    const product = this.products.get(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductsByCategory(category: string): Product[] {
    const productIds = this.productsByCategory.get(category);
    if (!productIds) return [];
    
    return Array.from(productIds)
      .map(id => this.products.get(id))
      .filter((p): p is Product => p !== undefined);
  }

  getCategories(): string[] {
    return Array.from(this.productsByCategory.keys());
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const product = this.getProduct(id);
    Object.assign(product, updates);
  }

  deleteProduct(id: string): void {
    const product = this.getProduct(id);
    this.products.delete(id);
    
    const categorySet = this.productsByCategory.get(product.category);
    if (categorySet) {
      categorySet.delete(id);
    }
  }

  // Customer methods
  addCustomer(customer: Customer): void {
    this.customers.set(customer.id, customer);
  }

  getCustomer(id: string): Customer {
    const customer = this.customers.get(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }

  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }

  updateCustomer(id: string, updates: Partial<Customer>): void {
    const customer = this.getCustomer(id);
    Object.assign(customer, updates);
  }

  deleteCustomer(id: string): void {
    this.customers.delete(id);
  }

  // Order methods
  addOrder(order: Order): void {
    this.orders.set(order.id, order);
  }

  getOrder(id: string): Order {
    const order = this.orders.get(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.getAllOrders().filter(order => order.customer.id === customerId);
  }

  updateOrder(id: string, updates: Partial<Order>): void {
    const order = this.getOrder(id);
    Object.assign(order, updates);
  }

  deleteOrder(id: string): void {
    this.orders.delete(id);
  }

  // Promo Code methods
  addPromoCode(promoCode: PromoCode): void {
    this.promoCodes.set(promoCode.code, promoCode);
  }

  getPromoCode(code: string): PromoCode | undefined {
    return this.promoCodes.get(code.toUpperCase());
  }

  getAllPromoCodes(): PromoCode[] {
    return Array.from(this.promoCodes.values());
  }

  // Wishlist methods
  addToWishlist(customerId: string, productId: string): void {
    if (!this.wishlists.has(customerId)) {
      this.wishlists.set(customerId, new Set());
    }
    this.wishlists.get(customerId)!.add(productId);
    if (customerId === 'guest_user') this.saveToStorage();
  }

  removeFromWishlist(customerId: string, productId: string): void {
    if (this.wishlists.has(customerId)) {
      this.wishlists.get(customerId)!.delete(productId);
      if (customerId === 'guest_user') this.saveToStorage();
    }
  }

  getWishlist(customerId: string): Product[] {
    const productIds = this.wishlists.get(customerId);
    if (!productIds) return [];

    return Array.from(productIds)
      .map(id => this.products.get(id))
      .filter((p): p is Product => p !== undefined);
  }

  isInWishlist(customerId: string, productId: string): boolean {
    return this.wishlists.get(customerId)?.has(productId) || false;
  }

  // Comparison List methods
  addToComparison(productId: string): void {
    if (this.comparisonList.size >= 4) {
      throw new Error('Máximo de 4 produtos para comparação');
    }
    this.comparisonList.add(productId);
    this.saveToStorage();
  }

  removeFromComparison(productId: string): void {
    this.comparisonList.delete(productId);
    this.saveToStorage();
  }

  getComparisonList(): Product[] {
    if (typeof window !== 'undefined' && this.comparisonList.size === 0) {
        this.loadFromStorage();
    }
    
    return Array.from(this.comparisonList)
      .map(id => this.products.get(id))
      .filter((p): p is Product => p !== undefined);
  }

  clearComparison(): void {
    this.comparisonList.clear();
    this.saveToStorage();
  }

  isInComparison(productId: string): boolean {
    return this.comparisonList.has(productId);
  }

  private initializeSampleData(): void {
    // Sample products
    const products = [
      new Product('Notebook Dell XPS 13', 'Notebook ultrafino com processador Intel i7', 5499.99, 15, 'Eletrônicos'),
      new Product('Mouse Logitech MX Master', 'Mouse ergonômico sem fio', 349.99, 50, 'Acessórios'),
      new Product('Teclado Mecânico Keychron', 'Teclado mecânico RGB', 599.99, 30, 'Acessórios'),
      new Product('Monitor LG UltraWide', 'Monitor 34 polegadas ultrawide', 2199.99, 10, 'Eletrônicos'),
      new Product('Webcam Logitech C920', 'Webcam Full HD 1080p', 449.99, 25, 'Acessórios'),
      new Product('Headset HyperX Cloud', 'Headset gamer com microfone', 399.99, 40, 'Acessórios'),
    ];

    products.forEach(product => this.addProduct(product));

    // Sample customers
    const customers = [
      new Customer('João Silva', 'joao@email.com', '(11) 98765-4321', 'Rua das Flores, 123'),
      new Customer('Maria Santos', 'maria@email.com', '(21) 99876-5432', 'Av. Paulista, 456'),
    ];

    customers.forEach(customer => this.addCustomer(customer));

    // Sample Promo Codes
    this.addPromoCode(new PromoCode('BEMVINDO10', 'percentage', 10));
    this.addPromoCode(new PromoCode('VERCEL20', 'fixed', 20, 100));
    this.addPromoCode(new PromoCode('PROMO50', 'percentage', 50));
  }
}

export const storageService = new StorageService();
