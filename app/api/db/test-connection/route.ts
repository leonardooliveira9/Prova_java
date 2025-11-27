// API para testar conexão com MySQL
import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { host, user, password, database, port } = body

    if (!host || !user || !database) {
      return NextResponse.json({ error: "Credenciais incompletas" }, { status: 400 })
    }

    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port: Number.parseInt(port || "3306"),
    })

    // Se chegou aqui, a conexão foi bem-sucedida
    await connection.end()

    return NextResponse.json({ success: true, message: "Conexão estabelecida" })
  } catch (error) {
    console.error("[v0] Connection test error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha na conexão" }, { status: 500 })
  }
}
