# Supabase Migrations

Este diretório contém os scripts SQL para configurar o banco de dados Supabase.

## Ordem de Execução

Execute os scripts **na ordem numérica** usando o SQL Editor do Supabase:

1. **01_schema.sql** - Cria todas as tabelas do sistema (15 tabelas)
2. **02_indexes.sql** - Cria índices para otimização de queries
3. **03_triggers.sql** - Cria triggers e functions (updated_at, etc.)
4. **04_views.sql** - Cria views para relatórios
5. **05_rls.sql** - Configura Row Level Security (RLS)
6. **06_seed.sql** - Insere dados iniciais (classes, categorias, etc.)

## Como Executar

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **"New query"**
5. Copie e cole o conteúdo de cada script
6. Clique em **"Run"**
7. Repita para todos os scripts na ordem

## Verificação

Após executar todos os scripts, verifique:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Verificar dados iniciais
SELECT * FROM public.classes ORDER BY order_index;
```

## Documentação Completa

Para instruções detalhadas, consulte: [docs/SUPABASE_SETUP.md](../docs/SUPABASE_SETUP.md)
