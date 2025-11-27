// Utilidade para conectar ao MySQL e executar queries
import mysql from "mysql2/promise"

let connection: mysql.Connection | null = null

/**
 * Parse uma connection string MySQL no formato: mysql://user:password@host:port/database
 */
function parseConnectionString(connectionString: string): Record<string, string | number> {
  const url = new URL(connectionString.replace(/^mysql:\/\//, "mysql://"))

  return {
    host: url.hostname || "localhost",
    user: url.username || "root",
    password: url.password || "",
    database: url.pathname.slice(1) || "neurobyte",
    port: url.port ? Number.parseInt(url.port) : 3306,
  }
}

/**
 * Cria ou retorna uma conexão existente com o MySQL
 * Aceita connection string no formato: mysql://user:password@host:port/database
 * Ou variáveis de ambiente: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT
 */
export async function getConnection(connectionString?: string): Promise<mysql.Connection> {
  if (connection) {
    return connection
  }

  try {
    let config: Record<string, string | number>

    if (connectionString) {
      config = parseConnectionString(connectionString)
    } else {
      config = {
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "neurobyte",
        port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
      }
    }

    connection = await mysql.createConnection({
      host: config.host as string,
      user: config.user as string,
      password: config.password as string,
      database: config.database as string,
      port: config.port as number,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    })

    console.log("[v0] MySQL connection established successfully")
    return connection
  } catch (error) {
    console.error("[v0] Failed to connect to MySQL:", error)
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Fecha a conexão com o MySQL
 */
export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end()
    connection = null
    console.log("[v0] MySQL connection closed")
  }
}

/**
 * Executa uma query genérica no MySQL
 */
export async function executeQuery(sql: string, values: any[] = []): Promise<any> {
  try {
    const conn = await getConnection()
    const [results] = await conn.execute(sql, values)
    return results
  } catch (error) {
    console.error("[v0] Query execution error:", error)
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
