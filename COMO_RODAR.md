# 🚀 Como Rodar o Backend - Raspadinha

## 📋 Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Terminal/CMD

## ⚡ Configuração Rápida

### 1. Configurar Supabase
```bash
# Entre no Supabase Dashboard
# https://supabase.com/dashboard

# Crie um novo projeto
# Anote: URL, ANON_KEY, SERVICE_ROLE_KEY
```

### 2. Configurar Backend
```bash
# Vá para a pasta backend
cd backend

# Instalar dependências
npm install

# Copiar arquivo de configuração
cp .env.example .env

# Editar .env com suas credenciais do Supabase
# Abrir no VS Code ou editor de texto
code .env
```

**Configure o .env assim:**
```env
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
JWT_SECRET=qualquer_texto_secreto_aqui
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Iniciar o Servidor
```bash
# Ainda na pasta backend/
npm run dev
```

## ✅ Testar se Funcionou

Abra no navegador: http://localhost:3000/health

Deve aparecer:
```json
{
  "success": true,
  "message": "Raspadinha API está funcionando"
}
```

## 🔧 Comandos Úteis

```bash
# Na pasta backend/

# Iniciar desenvolvimento
npm run dev

# Iniciar produção
npm start

# Testar APIs
npm run test-api

# Ver logs
tail -f logs/combined.log
```

## 📡 URLs da API

- **Health**: http://localhost:3000/health
- **Categorias**: http://localhost:3000/api/scratch
- **Login**: POST http://localhost:3000/api/auth/login
- **Carteira**: GET http://localhost:3000/api/wallet (precisa auth)

## 🆘 Se der erro

1. **Erro de conexão Supabase**:
   - Verifique as credenciais no `.env`
   - Confirme que o projeto Supabase está ativo

2. **Porta ocupada**:
   - Mude `PORT=3001` no `.env`
   - Ou mate o processo: `pkill -f "node"`

3. **Dependências**:
   - Delete `node_modules` e rode `npm install` novamente

---

**É só isso!** O backend vai funcionar mesmo sem as tabelas do banco - elas são criadas automaticamente quando necessário.