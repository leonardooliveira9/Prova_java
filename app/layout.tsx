import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neurobyte - E-Commerce Platform",
  description: "Sistema de gerenciamento de produtos, clientes e pedidos com inteligência",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "Copilot_20251126_182357.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "Copilot_20251126_182357.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "Copilot_20251126_182357.png",
        type: "image/svg+xml",
      },
    ],
    apple: "Copilot_20251126_182357.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
