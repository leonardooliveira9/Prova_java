export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export class Product {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _stock: number;
  private _category: string;
  private _imageUrl: string;
  private _createdAt: Date;
  private _reviews: Review[];

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    imageUrl: string = '/diverse-products-still-life.png'
  ) {
    this._id = this.generateId();
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
    this._category = category;
    this._imageUrl = imageUrl;
    this._createdAt = new Date();
    this._reviews = [];

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get price(): number { return this._price; }
  get stock(): number { return this._stock; }
  get category(): string { return this._category; }
  get imageUrl(): string { return this._imageUrl; }
  get createdAt(): Date { return this._createdAt; }
  get reviews(): Review[] { return this._reviews; }

  // Setters with validation
  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Nome do produto não pode ser vazio');
    }
    this._name = value;
  }

  set price(value: number) {
    if (value < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    this._price = value;
  }

  set stock(value: number) {
    if (value < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
    this._stock = value;
  }

  // Business methods
  decreaseStock(quantity: number): void {
    if (quantity > this._stock) {
      throw new Error(`Estoque insuficiente. Disponível: ${this._stock}`);
    }
    this._stock -= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantidade deve ser positiva');
    }
    this._stock += quantity;
  }

  isAvailable(): boolean {
    return this._stock > 0;
  }

  addReview(userName: string, rating: number, comment: string): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Avaliação deve ser entre 1 e 5');
    }
    this._reviews.push({
      id: Math.random().toString(36).substr(2, 9),
      userName,
      rating,
      comment,
      date: new Date()
    });
  }

  getAverageRating(): number {
    if (this._reviews.length === 0) return 0;
    const sum = this._reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this._reviews.length;
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Nome do produto é obrigatório');
    }
    if (this._price < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    if (this._stock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      stock: this._stock,
      category: this._category,
      imageUrl: this._imageUrl,
      createdAt: this._createdAt.toISOString(),
      reviews: this._reviews
    };
  }

  static fromJSON(data: any): Product {
    const product = new Product(
      data.name,
      data.description,
      data.price,
      data.stock,
      data.category,
      data.imageUrl
    );
    product._id = data.id;
    product._createdAt = new Date(data.createdAt);
    if (data.reviews) {
      product._reviews = data.reviews.map((r: any) => ({
        ...r,
        date: new Date(r.date)
      }));
    }
    return product;
  }
}
