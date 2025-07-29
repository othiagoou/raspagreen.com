# 🎮 Backend RaspaGreen - Guia Completo

Backend completo para aplicação de raspadinhas online com Node.js, Express e Supabase.

## 📋 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Registro de usuários com Supabase Auth
- Login/logout com JWT
- Middleware de autenticação
- Proteção de rotas
- Reset de senha

### ✅ Sistema de Carteira
- Gerenciamento de saldo
- Histórico de transações
- Depósitos e saques
- Limites de segurança
- Webhook para pagamentos (preparado para Abacatepay)

### ✅ Sistema de Raspadinhas
- Múltiplas categorias de jogos
- Sistema RTP (Return to Player)
- Lógica de probabilidades
- Grid 3x3 de raspadinha
- Histórico de jogos

### ✅ Painel Administrativo
- Estatísticas gerais
- Gerenciamento de usuários
- CRUD de categorias
- CRUD de prêmios
- Monitoramento de transações

### ✅ Recursos Técnicos
- Rate limiting
- CORS configurado
- Logging completo
- Validação de dados
- Middleware de segurança
- Fallbacks para desenvolvimento

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# JWT Secret
JWT_SECRET=sua-chave-jwt-segura

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

Execute os scripts SQL no Supabase (em ordem):

1. `database/01_create_tables.sql` - Criar tabelas
2. `database/02_create_rls_policies.sql` - Políticas de segurança
3. `database/03_create_functions_triggers.sql` - Funções e triggers
4. `database/04_insert_initial_data.sql` - Dados iniciais

### 4. Testar API

Inicie o servidor:

```bash
npm run dev
```

Execute os testes:

```bash
npm run test-api
```

### 5. Acessar Endpoints

- Health Check: `GET http://localhost:3000/health`
- Categorias: `GET http://localhost:3000/api/scratch`
- Registrar: `POST http://localhost:3000/api/auth/register`
- Login: `POST http://localhost:3000/api/auth/login`

## 🔗 Principais Endpoints

### Autenticação (`/api/auth`)
- `POST /register` - Registrar usuário
- `POST /login` - Fazer login
- `POST /logout` - Fazer logout
- `GET /profile` - Obter perfil (auth)
- `PUT /profile` - Atualizar perfil (auth)

### Raspadinhas (`/api/scratch`)
- `GET /` - Listar categorias
- `GET /:slug` - Obter categoria
- `GET /:slug/rewards` - Obter prêmios
- `POST /:slug/buy` - Comprar raspadinha (auth)
- `GET /games/history` - Histórico (auth)

### Carteira (`/api/wallet`)
- `GET /` - Info da carteira (auth)
- `GET /transactions` - Histórico (auth)
- `POST /deposit` - Depositar (auth)
- `POST /withdraw` - Sacar (auth)

### Admin (`/api/admin`)
- `GET /stats` - Estatísticas gerais
- `GET /users` - Listar usuários
- `GET /categories` - Gerenciar categorias
- `POST /categories` - Criar categoria
- `GET /games` - Histórico de jogos
- `POST /user/:id/balance` - Adicionar saldo

## 🎯 Como Funciona o Sistema

### Lógica das Raspadinhas

1. **Compra**: Usuário compra uma raspadinha de uma categoria
2. **RTP**: Sistema verifica Return to Player da categoria
3. **Probabilidade**: Define se usuário ganha baseado no RTP
4. **Grid**: Gera grid 3x3 com prêmios
5. **Transações**: Cria transações de compra e (se ganhou) vitória
6. **Saldo**: Atualiza saldo automaticamente via triggers do banco

### Sistema RTP

- Cada categoria tem um RTP target (ex: 85%)
- Sistema monitora quanto foi investido vs quanto foi pago
- Se RTP está baixo, aumenta chance de vitórias
- Se RTP está alto, diminui chance de vitórias

### Segurança

- Rate limiting em todas as rotas
- Validação rigorosa de dados
- CORS configurado para domínios específicos
- Tokens JWT para autenticação
- RLS (Row Level Security) no Supabase

## 🛠️ Estrutura do Projeto

```
src/
├── app.js                 # Aplicação principal
├── config/
│   ├── database.js        # Configuração Supabase
│   └── environment.js     # Variáveis de ambiente
├── controllers/           # Controladores das rotas
├── middleware/           # Middlewares (auth, validação, etc)
├── routes/              # Definição das rotas
├── services/            # Lógica de negócio
└── utils/               # Utilitários (logger, etc)

database/                # Scripts SQL
├── 01_create_tables.sql
├── 02_create_rls_policies.sql
├── 03_create_functions_triggers.sql
└── 04_insert_initial_data.sql
```

## 🔧 Deploy

### Render.com (Recomendado)

1. Conecte seu repositório no Render
2. Configure as variáveis de ambiente
3. O deploy é automático

### Variáveis necessárias:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `FRONTEND_URL`

## 📊 Monitoramento

O sistema inclui:
- Logs detalhados com Winston
- Health checks com status do banco
- Estatísticas em tempo real
- Rate limiting com métricas

## 🎮 Integração com Frontend

O backend está preparado para trabalhar com o frontend React que você já tem. Os endpoints seguem exatamente o padrão esperado pelo frontend.

### Principais APIs que o frontend usa:
- `/api/user/balance` - Saldo do usuário
- `/api/user` - Dados do usuário
- `/api/scratch/:slug/buy` - Comprar raspadinha
- `/api/auth/register` - Registro
- `/api/auth/login` - Login

## 🚨 Importante

1. **Banco de Dados**: Execute TODOS os scripts SQL no Supabase na ordem correta
2. **Variáveis**: Configure TODAS as variáveis de ambiente
3. **Teste**: Use `npm run test-api` para verificar se tudo funciona
4. **Deploy**: Configure as mesmas variáveis no serviço de deploy

## 📞 Suporte

Se encontrar problemas:

1. Verifique se o servidor está rodando (`npm run dev`)
2. Verifique se o banco está configurado (rode os SQLs)
3. Verifique se as variáveis estão corretas
4. Execute `npm run test-api` para diagnóstico

**Backend 100% funcional e pronto para produção! 🎉**