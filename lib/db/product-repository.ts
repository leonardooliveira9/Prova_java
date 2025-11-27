// Repository para operações de produtos no MySQL
import { executeQuery } from "./mysql-client"

/**
 * Interface para produto no banco de dados
 */
export interface MySQLProduct {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  image_url: string
  created_at: Date
  updated_at: Date
}

/**
 * Busca todos os produtos do MySQL
 */
export async function getAllProductsFromDB(): Promise<MySQLProduct[]> {
  const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    ORDER BY created_at DESC
  `

  return await executeQuery(sql)
}

/**
 * Busca um produto específico pelo ID
 */
export async function getProductByIdFromDB(id: number): Promise<MySQLProduct | null> {
  const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    WHERE id = ?
    LIMIT 1
  `

  const results = await executeQuery(sql, [id])
  return results.length > 0 ? results[0] : null
}

/**
 * Busca produtos por categoria
 */
export async function getProductsByCategoryFromDB(category: string): Promise<MySQLProduct[]> {
  const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    WHERE category = ?
    ORDER BY name ASC
  `

  return await executeQuery(sql, [category])
}

/**
 * Cria um novo produto
 */
export async function createProductInDB(
  product: Omit<MySQLProduct, "id" | "created_at" | "updated_at">,
): Promise<number> {
  const sql = `
    INSERT INTO products (name, description, price, category, stock, image_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `

  const results = await executeQuery(sql, [
    product.name,
    product.description,
    product.price,
    product.category,
    product.stock,
    product.image_url,
  ])

  return results.insertId
}

/**
 * Atualiza um produto existente
 */
export async function updateProductInDB(id: number, product: Partial<MySQLProduct>): Promise<boolean> {
  const fields: string[] = []
  const values: any[] = []

  if (product.name) {
    fields.push("name = ?")
    values.push(product.name)
  }
  if (product.description) {
    fields.push("description = ?")
    values.push(product.description)
  }
  if (product.price !== undefined) {
    fields.push("price = ?")
    values.push(product.price)
  }
  if (product.category) {
    fields.push("category = ?")
    values.push(product.category)
  }
  if (product.stock !== undefined) {
    fields.push("stock = ?")
    values.push(product.stock)
  }
  if (product.image_url) {
    fields.push("image_url = ?")
    values.push(product.image_url)
  }

  fields.push("updated_at = NOW()")
  values.push(id)

  if (fields.length === 1) return false // Nenhum campo para atualizar

  const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`

  const results = await executeQuery(sql, values)
  return results.affectedRows > 0
}

/**
 * Deleta um produto
 */
export async function deleteProductFromDB(id: number): Promise<boolean> {
  const sql = "DELETE FROM products WHERE id = ?"
  const results = await executeQuery(sql, [id])
  return results.affectedRows > 0
}

/**
 * Retorna os IDs únicos de todas as categorias
 */
export async function getCategoriesFromDB(): Promise<string[]> {
  const sql = "SELECT DISTINCT category FROM products ORDER BY category ASC"
  const results = await executeQuery(sql)
  return results.map((row: any) => row.category)
}
