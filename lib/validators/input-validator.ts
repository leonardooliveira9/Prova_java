import { ValidationException } from "../exceptions/ecommerce-exceptions"

export class InputValidator {
  // Sanitize user input to prevent XSS attacks
  static sanitizeString(input: string, maxLength = 500): string {
    if (!input || typeof input !== "string") {
      throw new ValidationException("Input must be a non-empty string")
    }

    if (input.length > maxLength) {
      throw new ValidationException(`Input exceeds maximum length of ${maxLength} characters`)
    }

    // Remove HTML tags and dangerous characters
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .trim()
  }

  // Validate email format
  static validateEmail(email: string): string {
    const sanitized = this.sanitizeString(email, 255)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(sanitized)) {
      throw new ValidationException("Email format is invalid")
    }

    return sanitized
  }

  // Validate phone number
  static validatePhone(phone: string): string {
    const sanitized = this.sanitizeString(phone, 20)
    // Accept digits, spaces, hyphens, parentheses, and plus sign (for country codes)
    const phoneRegex = /^[\d\s\-()+ ]+$/

    if (!phoneRegex.test(sanitized)) {
      throw new ValidationException("Phone format is invalid")
    }

    return sanitized
  }

  // Validate address
  static validateAddress(address: string): string {
    return this.sanitizeString(address, 500)
  }

  // Validate positive number (for prices, quantities)
  static validatePositiveNumber(value: number, fieldName: string): number {
    if (typeof value !== "number" || value <= 0 || !isFinite(value)) {
      throw new ValidationException(`${fieldName} must be a positive number`)
    }

    return Math.round(value * 100) / 100 // Round to 2 decimal places
  }

  // Validate product quantity
  static validateQuantity(quantity: number): number {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
      throw new ValidationException("Quantity must be between 1 and 1000")
    }

    return quantity
  }

  // Validate product ID
  static validateProductId(id: string): string {
    const sanitized = this.sanitizeString(id, 100)

    if (!/^[a-zA-Z0-9\-_]+$/.test(sanitized)) {
      throw new ValidationException("Invalid product ID format")
    }

    return sanitized
  }

  // Validate promo code
  static validatePromoCode(code: string): string {
    const sanitized = this.sanitizeString(code, 50)

    if (!/^[A-Z0-9]{1,50}$/.test(sanitized)) {
      throw new ValidationException("Promo code must contain only uppercase letters and numbers")
    }

    return sanitized
  }
}
