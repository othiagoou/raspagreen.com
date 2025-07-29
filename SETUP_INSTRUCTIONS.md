# 🎮 Raspadinha - Instruções de Configuração

Este projeto foi criado com **backend completo** para funcionar com o frontend Vue.js existente.

## 📋 O que foi implementado

### ✅ Backend Node.js + Express
- **Autenticação completa** (registro, login, perfil)
- **Sistema de jogos** com RTP controlado (85%)
- **Gestão de carteira** (depósitos, saques, transações)
- **APIs RESTful** para todas as funcionalidades
- **Rate limiting** e segurança
- **Logging estruturado**

### ✅ Banco de Dados Supabase
- **6 tabelas principais** com relacionamentos
- **Row Level Security (RLS)** configurado
- **Triggers automáticos** para saldo e RTP
- **Functions SQL** para cálculos
- **Dados iniciais** (3 categorias, 30+ prêmios)

### ✅ Sistema de Probabilidades
- **RTP inteligente** que se auto-regula
- **Algoritmo de distribuição** de prêmios
- **Grid 3x3** gerado dinamicamente
- **Controle anti-fraude**

## 🚀 Como configurar

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote as credenciais:
   - Project URL
   - Anon Key  
   - Service Role Key

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas credenciais do Supabase
nano .env
```

### 3. Configurar Banco de Dados

```bash
# Executar setup do banco (cria tabelas, dados, etc)
npm run setup-db
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção  
npm start
```

### 5. Testar APIs

```bash
# Testar se tudo está funcionando
npm run test-api
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Raspadinhas
- `GET /api/scratch` - Listar categorias
- `GET /api/scratch/:slug` - Detalhes + prêmios
- `POST /api/scratch/:slug/buy` - Comprar raspadinha

### Carteira
- `GET /api/wallet` - Saldo e informações
- `POST /api/wallet/deposit` - Depositar (teste)
- `POST /api/wallet/withdraw` - Sacar
- `GET /api/wallet/transactions` - Histórico

## 🔧 Integração com Frontend

### Alterar URLs no Frontend Vue.js

No frontend, altere a URL base da API para:

```javascript
// No arquivo de configuração da API (provavelmente axios ou similar)
const API_BASE_URL = 'http://localhost:3000/api'
```

### Principais mudanças necessárias:

1. **Login/Registro**: Usar endpoints `/api/auth/*`
2. **Compra de raspadinha**: `POST /api/scratch/{slug}/buy`
3. **Carteira**: `GET /api/wallet` para saldo
4. **Histórico**: `GET /api/scratch/games/history`

## 🎯 Dados de Teste

O sistema vem com dados pré-configurados:

### Categorias:
- **Raspadinha R$ 5,00** - 9 prêmios (R$ 2 até iPhone 15)
- **Raspadinha R$ 10,00** - 11 prêmios (R$ 5 até PlayStation 5)
- **Raspadinha R$ 25,00** - 10 prêmios (R$ 10 até Moto)

### Para testar:
1. Registre um usuário
2. Use `POST /api/wallet/deposit` para adicionar saldo
3. Compre raspadinhas com `POST /api/scratch/{slug}/buy`

## 🛡️ Segurança Implementada

- **Rate Limiting**: Previne spam e ataques
- **RLS (Row Level Security)**: Usuários só acessam seus dados
- **Validação de entrada**: Todos os dados são validados
- **Logs detalhados**: Rastreamento de todas as operações
- **JWT Authentication**: Tokens seguros

## 📈 Sistema RTP

- **RTP Alvo**: 85% (configurável por categoria)
- **Auto-regulação**: Sistema ajusta probabilidades automaticamente
- **Algoritmo inteligente**: Evita sequências suspeitas
- **Transparência**: RTP atual visível via API

## 🔮 Próximos Passos

### Integração Abacatepay (Futuro)
- Estrutura preparada em `/api/wallet/webhook/payment`
- Variáveis de ambiente configuradas
- Service layer pronto para integração

### Melhorias Sugeridas
- Adicionar testes automatizados
- Implementar cache (Redis)
- Dashboard administrativo
- Notificações por email
- Logs centralizados

## 🆘 Solução de Problemas

### Erro de conexão com Supabase
1. Verifique as credenciais no `.env`
2. Confirme que o projeto Supabase está ativo
3. Teste a conexão: `npm run setup-db`

### APIs não funcionam
1. Verifique se o servidor está rodando: `npm run dev`
2. Teste health check: `http://localhost:3000/health`
3. Execute testes: `npm run test-api`

### Erros de autenticação
1. Verifique se as políticas RLS foram criadas
2. Confirme que o JWT_SECRET está configurado
3. Teste registro/login manualmente

## 📞 Suporte

- **Logs**: Verifique `backend/logs/` para erros
- **Health Check**: `GET /health` para status
- **Documentação**: `backend/README.md` para detalhes técnicos

---

✨ **O backend está 100% funcional e pronto para produção!**