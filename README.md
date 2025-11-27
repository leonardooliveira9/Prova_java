# Neurobyte - Sistema de E-Commerce Completo

![Neurobyte Store](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production-success)

## 📋 Descrição do Projeto

**Neurobyte** é um sistema de e-commerce robusto e seguro desenvolvido em **Next.js 16** com **TypeScript**, aplicando conceitos avançados de **Programação Orientada a Objetos (POO)**, **Collections**, **Exception Handling** e **Segurança**.

O sistema oferece uma experiência completa de compra online com integração a banco de dados MySQL, painel administrativo seguro, sistema de avaliações, cupons promocionais, lista de desejos e muito mais.

---

## ✨ Funcionalidades Principais

### Para Clientes
- **Vitrine de Produtos**: Listagem responsiva com filtros por categoria, preço e avaliação
- **Busca Inteligente**: Busca em tempo real por nome de produto
- **Carrinho de Compras**: Interface intuitiva com adicionar/remover itens e atualizar quantidades
- **Cupons Promocionais**: Sistema de desconto por código (BEMVINDO10, VERCEL20, PROMO50)
- **Avaliações de Produtos**: Sistema de 5 estrelas com comentários
- **Lista de Desejos**: Salvar produtos favoritos localmente
- **Comparação de Produtos**: Comparar até 4 produtos lado a lado
- **Histórico de Pedidos**: Rastrear pedidos anteriores por email
- **Notificação de Estoque**: Receber alerta quando produto voltar ao estoque
- **Pontos de Fidelidade**: Acumular pontos em cada compra

### Para Administradores
- **Autenticação Segura**: Login com senha criptografada (admin123)
- **Gestão de Produtos**: CRUD completo de produtos
- **Dashboard com Analytics**: Gráficos de vendas, receita e categorias populares
- **Gestão de Pedidos**: Rastrear e atualizar status de pedidos
- **Gestão de Clientes**: Visualizar lista completa de clientes
- **Cupons Promocionais**: Criar e gerenciar códigos de desconto
- **Backup de Dados**: Exportar dados completos do sistema

### Banco de Dados
- **Conexão MySQL**: Interface para conectar banco de dados externo
- **Visualização de Produtos**: Exibir produtos salvos no MySQL com imagens
- **Sincronização**: Opção de importar/exportar dados

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

\`\`\`
neurobyte/
├── app/
│   ├── page.tsx                 # Página principal (vitrine)
│   ├── products/[id]/           # Detalhes do produto
│   ├── admin/                   # Painel administrativo
│   ├── wishlist/                # Lista de desejos
│   ├── orders/                  # Histórico de pedidos
│   ├── compare/                 # Comparação de produtos
│   ├── order-confirmation/      # Confirmação de pedido
│   ├── database/                # Conexão MySQL
│   ├── api/                     # Rotas de API
│   ├── layout.tsx               # Layout principal
│   └── globals.css              # Estilos globais
│
├── components/
│   ├── store-header.tsx         # Cabeçalho com navegação
│   ├── product-card.tsx         # Card de produto
│   ├── cart-drawer.tsx          # Drawer do carrinho
│   ├── checkout-dialog.tsx      # Modal de checkout
│   ├── product-reviews.tsx      # Sistema de avaliações
│   ├── hero-section.tsx         # Seção hero da home
│   └── ui/                      # Componentes shadcn/ui
│
├── lib/
│   ├── models/
│   │   ├── product.ts           # Classe Product (POO)
│   │   ├── customer.ts          # Classe Customer
│   │   ├── order.ts             # Classe Order
│   │   └── promo-code.ts        # Classe PromoCode
│   │
│   ├── services/
│   │   └── storage-service.ts   # Gerenciamento de dados (Collections)
│   │
│   ├── exceptions/
│   │   └── ecommerce-exceptions.ts  # Exceções customizadas
│   │
│   ├── validators/
│   │   └── input-validator.ts   # Validação de entrada
│   │
│   ├── security/
│   │   ├── rate-limiter.ts      # Rate limiting
│   │   └── encryption.ts        # Encriptação de dados
│   │
│   ├── db/
│   │   ├── mysql-client.ts      # Cliente MySQL
│   │   ├── product-repository.ts # Repositório de produtos
│   │   └── setup-db.ts          # Setup do banco
│   │
│   └── utils/
│       ├── product-images.ts    # Mapeamento de imagens
│       └── cn.ts                # Utilitários CSS
│
├── public/
│   └── products/                # Imagens dos produtos
│
├── scripts/                     # Scripts de setup (SQL)
│
├── docs/
│   ├── SECURITY.md             # Documentação de segurança
│   └── API.md                  # Documentação de API
│
└── package.json
\`\`\`

---

## 🔒 Segurança Implementada

### 1. **Autenticação e Autorização**
- Senhas com hash (bcrypt ready)
- Sessão do administrador com localStorage
- Validação de acesso a páginas restritas

### 2. **Validação de Entrada**
- Validação de email com regex
- Validação de telefone (Brasil e Internacional)
- Sanitização de dados para evitar XSS
- Validação de limites (quantidades, preços)

### 3. **Rate Limiting**
- Proteção contra brute force no login admin
- Limite de requisições por IP
- Throttling de operações críticas

### 4. **Encriptação**
- Dados sensíveis armazenados com hash
- Suporte a encriptação de dados no banco

### 5. **Validação de Negócio**
- Verificação de estoque antes de compra
- Validação de cupons por data e uso
- Verificação de integridade de pedidos

---

## 🚀 Como Usar

### Instalação

\`\`\`bash
# Clonar o repositório
git clone https://github.com/seu-usuario/neurobyte.git
cd neurobyte

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

A aplicação será disponível em `http://localhost:3000`

### Credenciais Padrão

**Painel Administrativo:**
- URL: `/admin`
- Senha: `admin123`

**Cupons Disponíveis:**
- `BEMVINDO10` - 10% de desconto
- `VERCEL20` - R$20 de desconto (mín. R$100)
- `PROMO50` - 50% de desconto (até R$50)

---

## 🗄️ Conectar ao MySQL

### 1. Acesse a Página de Banco de Dados
\`\`\`
http://localhost:3000/database
\`\`\`

### 2. Opção A: Cole a URL de Conexão
\`\`\`
mysql://root:@localhost:3306/neurobyte_systems
\`\`\`

### 3. Opção B: Configure Manualmente
- Host: `localhost`
- Porta: `3306`
- Usuário: `root`
- Senha: (deixe em branco se não tiver)
- Banco: `neurobyte_systems`

### 4. Teste a Conexão
Clique em "🧪 Testar Conexão" para validar

### 5. Visualize Produtos
Os produtos salvos no MySQL aparecerão com suas imagens

---

## 📊 Modelos de Dados (POO)

### Classe Product
\`\`\`typescript
class Product {
  - id: string
  - name: string
  - description: string
  - price: number
  - stock: number
  - category: string
  - imageUrl: string
  - reviews: Review[]
  
  + decreaseStock(quantity): void
  + increaseStock(quantity): void
  + isAvailable(): boolean
  + addReview(userName, rating, comment): void
  + getAverageRating(): number
}
\`\`\`

### Classe Order
\`\`\`typescript
class Order {
  - id: string
  - customerId: string
  - items: OrderItem[]
  - total: number
  - status: OrderStatus
  - shippingAddress: Address
  - createdAt: Date
  
  + calculateTotal(): number
  + updateStatus(newStatus): void
  + getShippingEstimate(): Date
}
\`\`\`

### Classe Customer
\`\`\`typescript
class Customer {
  - id: string
  - name: string
  - email: string
  - phone: string
  - address: Address
  - loyaltyPoints: number
  - createdAt: Date
  
  + addLoyaltyPoints(points): void
  + getDiscount(): number
}
\`\`\`

---

## 📦 Collections Utilizadas

O sistema utiliza `Map` e `Set` do JavaScript/TypeScript para gerenciamento eficiente:

\`\`\`typescript
// StorageService
- products: Map<string, Product>
- orders: Map<string, Order>
- customers: Map<string, Customer>
- promoCodes: Map<string, PromoCode>
- wishlist: Set<string> (IDs de produtos)
- comparison: Set<string> (IDs de produtos)
\`\`\`

---

## ⚠️ Exception Handling

O sistema implementa hierarquia de exceções customizadas:

\`\`\`typescript
ECommerceException (base)
├── ProductNotFoundException
├── InsufficientStockException
├── InvalidPromoCodeException
├── CustomerNotFoundException
├── OrderNotFoundException
└── ValidationException
\`\`\`

---

## 🌐 API Endpoints

### Produtos
\`\`\`
GET  /api/products              # Listar todos
GET  /api/products/:id          # Detalhes
POST /api/products              # Criar (Admin)
PUT  /api/products/:id          # Atualizar (Admin)
DELETE /api/products/:id        # Deletar (Admin)
\`\`\`

### Pedidos
\`\`\`
GET  /api/orders                # Listar meus pedidos
GET  /api/orders/:id            # Detalhes do pedido
POST /api/orders                # Criar pedido
PUT  /api/orders/:id            # Atualizar status (Admin)
\`\`\`

### Banco de Dados
\`\`\`
GET  /api/db/test-connection    # Testar conexão MySQL
GET  /api/db/products           # Listar do MySQL
\`\`\`

---

## 🎨 Design e UX

- **Tema**: Cream & Dark (tons creme/bege com detalhes em coral)
- **Tipografia**: Playfair Display (títulos) + Geist (corpo)
- **Responsividade**: Mobile-first, otimizado para todos os dispositivos
- **Componentes**: shadcn/ui com Tailwind CSS v4

---

## 🧪 Teste Rápido

1. Acesse a home e navegue pelos produtos
2. Clique em "Adicionar ao Carrinho"
3. Aplique o cupom "BEMVINDO10" para desconto
4. Finalize a compra e veja a confirmação
5. Acesse "Meus Pedidos" para rastrear
6. Clique em "Base de Dados" para ver produtos MySQL

---

## 📝 Documentação Adicional

- **[SECURITY.md](./docs/SECURITY.md)** - Detalhes de segurança
- **[API.md](./docs/API.md)** - Referência completa de API

---

## 🛠️ Tecnologias

- **Framework**: Next.js 16 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Banco de Dados**: MySQL (mysql2)
- **Validação**: Zod
- **Gráficos**: Recharts
- **Notificações**: Sonner
- **Form**: React Hook Form

---

## 📄 Licença

MIT - Veja LICENSE para detalhes

---

## 👨‍💻 Desenvolvido com ❤️ por v0

Um e-commerce robusto e educacional que demonstra boas práticas de desenvolvimento web moderno.
