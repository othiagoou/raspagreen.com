# 🗃️ Instruções para Criar o Banco de Dados

## ⚡ Método Recomendado: Dashboard do Supabase

### 1. Acesse o Dashboard
- URL: https://pomwdxozwhmdwyufxrcu.supabase.co/project/default
- Vá em **"SQL Editor"** no menu lateral

### 2. Execute os Scripts em Ordem

#### 📋 Script 1: Criar Tabelas
Copie e execute o conteúdo de: `backend/database/01_create_tables.sql`

#### 🔒 Script 2: Políticas RLS
Copie e execute o conteúdo de: `backend/database/02_create_rls_policies.sql`

#### ⚙️ Script 3: Funções e Triggers
Copie e execute o conteúdo de: `backend/database/03_create_functions_triggers.sql`

#### 💾 Script 4: Dados Iniciais
Copie e execute o conteúdo de: `backend/database/04_insert_initial_data.sql`

## ✅ Verificação

Após executar todos os scripts, verifique se as tabelas foram criadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve retornar:
- game_sessions
- prizes  
- rtp_control
- scratch_categories
- transactions
- user_profiles

## 🔍 Verificar Dados

```sql
-- Verificar categorias criadas
SELECT name, slug, price FROM scratch_categories;

-- Verificar prêmios criados
SELECT COUNT(*) as total_prizes FROM prizes;

-- Verificar RLS ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

## 🛠️ Alternativa: Via Node.js

Se preferir executar via script:

```bash
cd backend
npm run setup-db
```

**Nota:** O script pode apresentar avisos, mas isso é normal. O importante é que as tabelas sejam criadas.

## 📊 Resultado Esperado

Após a execução:
- ✅ 6 tabelas criadas
- ✅ 3 categorias de raspadinha
- ✅ 30+ prêmios configurados
- ✅ Políticas RLS ativas
- ✅ Triggers funcionando
- ✅ Sistema pronto para uso

## 🔗 Links Úteis

- **Dashboard**: https://pomwdxozwhmdwyufxrcu.supabase.co/project/default
- **SQL Editor**: https://pomwdxozwhmdwyufxrcu.supabase.co/project/default/sql
- **Table Editor**: https://pomwdxozwhmdwyufxrcu.supabase.co/project/default/editor