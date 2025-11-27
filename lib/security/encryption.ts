import crypto from "crypto"

export class EncryptionService {
  private static readonly ALGORITHM = "aes-256-cbc"
  private static readonly ENCODING = "hex"

  // Simple encryption for sensitive data (in production, use proper key management)
  static encrypt(text: string, key: string = process.env.ENCRYPTION_KEY || "default-key-change-in-production"): string {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(this.ALGORITHM, Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)

      let encrypted = cipher.update(text, "utf8", this.ENCODING)
      encrypted += cipher.final(this.ENCODING)

      return iv.toString(this.ENCODING) + ":" + encrypted
    } catch (error) {
      console.error("Encryption error:", error)
      return text // Fallback to plain text
    }
  }

  // Decrypt sensitive data
  static decrypt(
    encryptedText: string,
    key: string = process.env.ENCRYPTION_KEY || "default-key-change-in-production",
  ): string {
    try {
      const parts = encryptedText.split(":")
      if (parts.length !== 2) return encryptedText

      const iv = Buffer.from(parts[0], this.ENCODING)
      const decipher = crypto.createDecipheriv(this.ALGORITHM, Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)

      let decrypted = decipher.update(parts[1], this.ENCODING, "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } catch (error) {
      console.error("Decryption error:", error)
      return encryptedText
    }
  }

  // Hash password-like data (one-way encryption)
  static hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex")
  }
}
