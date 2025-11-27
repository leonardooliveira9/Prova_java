export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }>
  private maxAttempts: number
  private windowMs: number

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.attempts = new Map()
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  // Check if an action is allowed for a given key (IP, email, etc)
  isAllowed(key: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now > record.resetTime) {
      // First attempt or window reset
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs })
      return true
    }

    if (record.count < this.maxAttempts) {
      record.count++
      return true
    }

    return false
  }

  getRemainingTime(key: string): number {
    const record = this.attempts.get(key)
    if (!record) return 0

    const remaining = record.resetTime - Date.now()
    return remaining > 0 ? remaining : 0
  }
}

export const checkoutRateLimiter = new RateLimiter(10, 300000) // 10 attempts per 5 minutes
export const adminLoginRateLimiter = new RateLimiter(5, 900000) // 5 attempts per 15 minutes
