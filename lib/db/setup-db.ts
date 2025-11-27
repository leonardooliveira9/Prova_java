// Script para criar as tabelas necessárias no MySQL
import { getConnection } from "./mysql-client"

/**
 * Cria as tabelas necessárias no banco de dados
 */
export async function setupDatabase(): Promise<void> {
  try {
    const connection = await getConnection()

    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        stock INT DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `

    await connection.execute(createProductsTable)
    console.log("[v0] Products table created or already exists")

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `

    await connection.execute(createCategoriesTable)
    console.log("[v0] Categories table created or already exists")
  } catch (error) {
    console.error("[v0] Database setup error:", error)
    throw new Error(`Database setup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
