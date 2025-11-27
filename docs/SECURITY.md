# Política de Segurança - Neurobyte E-commerce

## Visão Geral
Este documento detalha as medidas de segurança implementadas no sistema Neurobyte.

## 1. Validação de Entrada (Input Validation)

### InputValidator Class
Localização: `lib/validators/input-validator.ts`

Implementa validação rigorosa para todos os dados de entrada do usuário:

- **sanitizeString()**: Remove tags HTML e caracteres perigosos
  - Previne ataques XSS (Cross-Site Scripting)
  - Limite máximo de 500 caracteres
  - Exemplo: `<script>alert('xss')</script>` → `scriptalert('xss')/script`

- **validateEmail()**: Valida formato de email com regex
  - Verifica padrão `nome@dominio.extensão`
  - Sanitiza antes de validar

- **validatePhone()**: Aceita apenas dígitos, espaços, parênteses e hífens
  - Rejeita caracteres especiais

- **validateAddress()**: Sanitiza endereços até 500 caracteres
  - Remove HTML e javascript

- **validatePositiveNumber()**: Valida números positivos e finitos
  - Evita ataques com Infinity ou NaN
  - Arredonda a 2 casas decimais (importante para moeda)

- **validatePromoCode()**: Apenas letras maiúsculas e números

## 2. Rate Limiting

### RateLimiter Class
Localização: `lib/security/rate-limiter.ts`

Protege contra ataques de força bruta:

\`\`\`typescript
const adminLoginRateLimiter = new RateLimiter(5, 900000); // 5 tentativas por 15 minutos
const checkoutRateLimiter = new RateLimiter(10, 300000); // 10 checkouts por 5 minutos
\`\`\`

Implementação:
- Rastreia tentativas por chave (IP, email, sessão)
- Bloqueia após exceder limite
- Retorna tempo de espera até próxima tentativa
- Reseta automaticamente após janela de tempo

## 3. Encriptação de Dados

### EncryptionService Class
Localização: `lib/security/encryption.ts`

- Usa AES-256-CBC para dados sensíveis
- Função `encrypt()`: Encripta informações sensíveis
- Função `decrypt()`: Descriptografa dados
- Função `hash()`: Hash SHA-256 para comparação de senhas
- Armazenamento de IV (Initialization Vector) junto ao dado encriptado

**Nota**: Em produção, use proper key management (AWS KMS, HashiCorp Vault)

## 4. Tratamento de Exceções

### Exception Hierarchy
Localização: `lib/exceptions/ecommerce-exceptions.ts`

\`\`\`
ECommerceException (base)
├── ProductNotFoundException
├── InsufficientStockException
├── CustomerNotFoundException
├── OrderNotFoundException
├── InvalidOrderStatusException
└── ValidationException
\`\`\`

Vantagens:
- Erros específicos para diferentes situações
- Mensagens de erro informativas em português
- Permite tratamento diferenciado por tipo
- Não expõe detalhes internos do sistema

## 5. Validação no Checkout

**CheckoutDialog Component** (`components/checkout-dialog.tsx`)

- Validação obrigatória de todos os campos
- Feedback visual de erros por campo
- Sanitização de entrada antes da submissão
- Exibição de total com desconto para confirmação

## 6. Autenticação Admin

**Admin Dashboard** (`app/admin/page.tsx`)

- Rate limiting: 5 tentativas por 15 minutos
- Comparison de hash SHA-256 (não plain text)
- Sessão armazenada em localStorage
- Timestamp de login registrado
- Feedback de tentativas restantes ao usuário

## 7. Boas Práticas Implementadas

### ✓ Implementado
- Input sanitization e validação
- Rate limiting para login e checkout
- Encriptação de dados sensíveis (abstração)
- Hash de senhas
- Exceções customizadas
- Validação de quantidades e preços
- Prevenção de XSS

### ⚠️ Para Produção
- Implementar HTTPS/TLS
- Usar bcrypt ao invés de SHA-256 para senhas
- Implementar CSRF tokens
- Usar proper secret management (variáveis de ambiente)
- Implementar WAF (Web Application Firewall)
- Logging e monitoramento de segurança
- Implementar autenticação OAuth2/JWT
- Data encryption at rest (banco de dados)
- Backup e disaster recovery
- Penetration testing regular

## 8. Exemplos de Uso

### Validando Email no Checkout
\`\`\`typescript
const email = InputValidator.validateEmail(userInput);
// Lança ValidationException se inválido
\`\`\`

### Rate Limiting em Login
\`\`\`typescript
if (!adminLoginRateLimiter.isAllowed(clientId)) {
  const waitTime = adminLoginRateLimiter.getRemainingTime(clientId);
  // Bloqueia e retorna tempo de espera
}
\`\`\`

### Encriptando Dados Sensíveis
\`\`\`typescript
const encrypted = EncryptionService.encrypt(customerPhone);
const decrypted = EncryptionService.decrypt(encrypted);
\`\`\`

## 9. Testes de Segurança

Para validar a segurança, teste:

1. **XSS**: Tente adicionar `<script>alert('xss')</script>` em campos
2. **Força Bruta**: Faça 6 tentativas de login em 1 minuto
3. **Injeção**: Tente inserir SQL ou código malicioso
4. **Valores Negativos**: Tente adicionar quantidade negativa ao carrinho
5. **Preços Inválidos**: Tente inserir preço inválido em produto

Todos devem ser bloqueados ou sanitizados.
\`\`\`

Implementei medidas robustas de segurança no sistema Neurobyte: validação e sanitização de entrada com `InputValidator` em todos os pontos críticos (checkout, customer, admin), rate limiting para login (5 tentativas por 15 minutos) e checkout (10 por 5 minutos) com feedback do tempo de espera, e uma classe `EncryptionService` para proteger dados sensíveis. Adicionei validação visual de erro em tempo real no checkout e documentação detalhada das práticas de segurança implementadas. O sistema agora está muito mais resiliente contra XSS, force brute, injeção de dados e outros ataques comuns.
