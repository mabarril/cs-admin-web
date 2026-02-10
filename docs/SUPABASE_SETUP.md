# Guia de Configuração do Supabase

Este documento fornece instruções passo a passo para configurar o Supabase como backend do projeto.

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js e npm instalados
- Projeto Angular configurado

## Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `club-management-system` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **guarde-a com segurança**
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (para desenvolvimento)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos até o projeto ser provisionado

## Passo 2: Obter Credenciais

1. No dashboard do projeto, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública para uso no frontend)

## Passo 3: Configurar Variáveis de Ambiente

1. No projeto Angular, edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://xxxxx.supabase.co', // Cole sua URL aqui
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Cole sua chave aqui
  appName: 'Sistema de Gerenciamento de Clube de Desbravadores',
  appVersion: '0.1.0'
};
```

2. Faça o mesmo para `src/environments/environment.prod.ts` (use as mesmas credenciais ou crie um projeto separado para produção)

## Passo 4: Executar Scripts SQL

Execute os scripts SQL na ordem correta usando o **SQL Editor** do Supabase:

### 4.1. Acessar SQL Editor

1. No dashboard do Supabase, clique em **SQL Editor** no menu lateral
2. Clique em **"New query"**

### 4.2. Executar Scripts na Ordem

Execute cada script abaixo **na ordem**, copiando todo o conteúdo e clicando em **"Run"**:

1. **01_schema.sql** - Cria todas as tabelas
   - Localização: `supabase/migrations/01_schema.sql`
   - ✅ Verifica: 15 tabelas criadas

2. **02_indexes.sql** - Cria índices para otimização
   - Localização: `supabase/migrations/02_indexes.sql`
   - ✅ Verifica: Índices criados

3. **03_triggers.sql** - Cria triggers e functions
   - Localização: `supabase/migrations/03_triggers.sql`
   - ✅ Verifica: Triggers de `updated_at` funcionando

4. **04_views.sql** - Cria views para relatórios
   - Localização: `supabase/migrations/04_views.sql`
   - ✅ Verifica: Views disponíveis

5. **05_rls.sql** - Configura Row Level Security
   - Localização: `supabase/migrations/05_rls.sql`
   - ✅ Verifica: RLS habilitado em todas as tabelas

6. **06_seed.sql** - Insere dados iniciais
   - Localização: `supabase/migrations/06_seed.sql`
   - ✅ Verifica: Classes, tipos de especialidades e categorias criadas

## Passo 5: Criar Usuário Admin

1. No dashboard do Supabase, vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email**: seu email de admin
   - **Password**: senha forte
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **"Create user"**
5. Copie o **UUID** do usuário criado

### 5.1. Criar Perfil do Admin

1. Volte ao **SQL Editor**
2. Execute o seguinte comando (substitua `<UUID>` pelo UUID copiado):

```sql
INSERT INTO public.user_profiles (id, full_name, role) 
VALUES ('<UUID>', 'Administrador', 'admin');
```

## Passo 6: Verificar Instalação

### 6.1. Verificar Tabelas

No SQL Editor, execute:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Resultado esperado**: 15 tabelas listadas

### 6.2. Verificar Dados Iniciais

```sql
SELECT * FROM public.classes ORDER BY order_index;
SELECT * FROM public.specialty_types;
SELECT * FROM public.transaction_categories;
```

**Resultado esperado**: Dados de seed carregados

### 6.3. Verificar RLS

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Resultado esperado**: Múltiplas políticas listadas

## Passo 7: Testar Conexão no Frontend

1. Inicie o servidor de desenvolvimento:

```bash
npm start
```

2. Abra o navegador em `http://localhost:4200`
3. Abra o **DevTools Console** (F12)
4. Verifique se não há erros de conexão com o Supabase

## Troubleshooting

### Erro: "Invalid API key"

- Verifique se copiou a chave correta (anon/public key)
- Certifique-se de que não há espaços extras na chave

### Erro: "Failed to fetch"

- Verifique se a URL do Supabase está correta
- Verifique sua conexão com a internet
- Verifique se o projeto Supabase está ativo

### Erro ao executar scripts SQL

- Execute os scripts na ordem correta
- Verifique se não há erros de sintaxe
- Alguns scripts dependem de outros (execute 01 antes de 02, etc.)

### RLS bloqueando acesso

- Certifique-se de que criou o perfil do usuário admin
- Verifique se o usuário está autenticado
- Verifique as políticas RLS no dashboard

## Próximos Passos

Após configurar o Supabase com sucesso:

1. ✅ Testar autenticação no frontend
2. ✅ Implementar guards de rota
3. ✅ Criar componentes de login
4. ✅ Começar desenvolvimento dos módulos

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)

## Suporte

Se encontrar problemas, consulte:
- Documentação do projeto em `.agent/brain/`
- Issues do repositório
- Documentação oficial do Supabase
