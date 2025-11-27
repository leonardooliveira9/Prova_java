// API para buscar produtos do MySQL
import { type NextRequest, NextResponse } from "next/server"
import { getAllProductsFromDB } from "@/lib/db/product-repository"

export async function GET(request: NextRequest) {
  try {
    const products = await getAllProductsFromDB()

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar produtos" },
      { status: 500 },
    )
  }
}
