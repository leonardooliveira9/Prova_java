export class ECommerceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ECommerceException';
  }
}

export class ProductNotFoundException extends ECommerceException {
  constructor(productId: string) {
    super(`Produto não encontrado: ${productId}`);
    this.name = 'ProductNotFoundException';
  }
}

export class InsufficientStockException extends ECommerceException {
  constructor(productName: string, available: number, requested: number) {
    super(`Estoque insuficiente para ${productName}. Disponível: ${available}, Solicitado: ${requested}`);
    this.name = 'InsufficientStockException';
  }
}

export class CustomerNotFoundException extends ECommerceException {
  constructor(customerId: string) {
    super(`Cliente não encontrado: ${customerId}`);
    this.name = 'CustomerNotFoundException';
  }
}

export class OrderNotFoundException extends ECommerceException {
  constructor(orderId: string) {
    super(`Pedido não encontrado: ${orderId}`);
    this.name = 'OrderNotFoundException';
  }
}

export class InvalidOrderStatusException extends ECommerceException {
  constructor(currentStatus: string, newStatus: string) {
    super(`Transição de status inválida: ${currentStatus} -> ${newStatus}`);
    this.name = 'InvalidOrderStatusException';
  }
}

export class ValidationException extends ECommerceException {
  constructor(message: string) {
    super(`Erro de validação: ${message}`);
    this.name = 'ValidationException';
  }
}
