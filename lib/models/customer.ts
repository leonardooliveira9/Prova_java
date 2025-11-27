import { InputValidator } from "../validators/input-validator"

export class Customer {
  private _id: string
  private _name: string
  private _email: string
  private _phone: string
  private _address: string
  private _createdAt: Date
  private _loyaltyPoints: number

  constructor(name: string, email: string, phone: string, address: string) {
    this._id = this.generateId()
    this._name = InputValidator.sanitizeString(name, 100)
    this._email = InputValidator.validateEmail(email)
    this._phone = InputValidator.validatePhone(phone)
    this._address = InputValidator.validateAddress(address)
    this._createdAt = new Date()
    this._loyaltyPoints = 0

    this.validate()
  }

  // Getters
  get id(): string {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get email(): string {
    return this._email
  }
  get phone(): string {
    return this._phone
  }
  get address(): string {
    return this._address
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get loyaltyPoints(): number {
    return this._loyaltyPoints
  }

  // Setters with validation
  set name(value: string) {
    this._name = InputValidator.sanitizeString(value, 100)
  }

  set email(value: string) {
    this._email = InputValidator.validateEmail(value)
  }

  set phone(value: string) {
    this._phone = InputValidator.validatePhone(value)
  }

  set address(value: string) {
    this._address = InputValidator.validateAddress(value)
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error("Nome do cliente é obrigatório")
    }
    if (!this._email) {
      throw new Error("Email inválido")
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private generateId(): string {
    return `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Loyalty points methods
  addLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new Error("Pontos devem ser positivos")
    }
    this._loyaltyPoints += points
  }

  redeemLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new Error("Pontos devem ser positivos")
    }
    if (points > this._loyaltyPoints) {
      throw new Error("Pontos insuficientes")
    }
    this._loyaltyPoints -= points
  }

  getLoyaltyDiscount(): number {
    // 100 pontos = R$1 de desconto
    return this._loyaltyPoints / 100
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      address: this._address,
      createdAt: this._createdAt.toISOString(),
      loyaltyPoints: this._loyaltyPoints,
    }
  }

  static fromJSON(data: any): Customer {
    const customer = new Customer(data.name, data.email, data.phone, data.address)
    customer._id = data.id
    customer._createdAt = new Date(data.createdAt)
    customer._loyaltyPoints = data.loyaltyPoints || 0
    return customer
  }
}
