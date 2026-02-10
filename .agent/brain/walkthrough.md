# Walkthrough: Implementação do Módulo de Autenticação

## Objetivo
Implementar módulo completo de autenticação com login, controle de acesso baseado em roles, guards de rota e componentes de UI.

## Mudanças Implementadas

### 📦 Core - Models

#### [user-profile.model.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/models/user-profile.model.ts)
- Tipo `UserRole` com 5 perfis: admin, secretary, treasury, counselor, board
- Interface `UserProfile` com campos do banco de dados
- Constantes `ROLE_NAMES` para exibição em português
- Mapeamento `ROLE_PERMISSIONS` para controle de acesso

---

### 🔧 Core - Services

#### [auth.service.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/services/auth.service.ts)
**Métodos de autenticação:**
- `signIn()` - Login com email/senha
- `signOut()` - Logout e redirect para login
- `signUp()` - Registro de usuário (aguarda aprovação de admin)
- `resetPassword()` - Envio de email de recuperação
- `updatePassword()` - Atualização de senha

**Gerenciamento de estado:**
- `currentUserProfile$` - Observable do perfil do usuário
- `isAuthenticated` - Verifica se usuário está autenticado e ativo
- `hasRole()` / `hasAnyRole()` - Verificação de permissões
- `isAdmin` - Atalho para verificar se é admin

#### [user-profile.service.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/services/user-profile.service.ts)
**CRUD de perfis:**
- `getProfile()` - Buscar perfil por ID
- `getAllProfiles()` - Listar todos os perfis
- `getProfilesByRole()` - Filtrar por role
- `getActiveProfiles()` - Apenas perfis ativos
- `createProfile()` - Criar novo perfil (admin only)
- `updateProfile()` - Atualizar perfil
- `activateProfile()` / `deactivateProfile()` - Soft delete
- `deleteProfile()` - Hard delete (admin only)

---

### 🛡️ Core - Guards

#### [auth.guard.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/guards/auth.guard.ts)
- Protege rotas que requerem autenticação
- Redireciona para `/login` se não autenticado
- Preserva URL de destino em `returnUrl` query param

#### [role.guard.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/guards/role.guard.ts)
- Factory function que recebe array de roles permitidos
- Admin tem acesso a tudo automaticamente
- Redireciona para `/access-denied` se sem permissão
- Exemplo: `roleGuard(['admin', 'secretary'])`

---

### 🔌 Core - Interceptors

#### [auth.interceptor.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/interceptors/auth.interceptor.ts)
- Adiciona token JWT em todas as requisições HTTP
- Trata erros 401 (não autorizado)
- Redirect automático para login em caso de sessão expirada

---

### 🎨 Features - Auth Components

#### [LoginComponent](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/login/login.component.ts)
**Funcionalidades:**
- Formulário reativo com validações (email, senha mínimo 6 caracteres)
- Loading state durante autenticação
- Exibição de mensagens de erro
- Redirect para `returnUrl` após login bem-sucedido
- Link para recuperação de senha

**Design:**
- Gradiente azul/indigo no fundo
- Card centralizado com shadow
- Campos com focus ring indigo
- Botão com loading spinner
- Responsivo (mobile-first)

#### [ForgotPasswordComponent](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/forgot-password/forgot-password.component.ts)
- Formulário para solicitar reset de senha
- Mensagens de sucesso/erro
- Link para voltar ao login

#### [AccessDeniedComponent](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/access-denied/access-denied.component.ts)
- Página amigável de acesso negado
- Ícone de alerta
- Explicação sobre permissões necessárias
- Botão para voltar ao dashboard

---

### 🧩 Shared - Components

#### [HeaderComponent](file:///home/barril/workspace/cs-admin-web/src/app/shared/components/header/header.component.ts)
**Funcionalidades:**
- Exibe nome do usuário logado
- Badge com role (em português)
- Avatar com iniciais do nome
- Menu dropdown com:
  - Link para perfil
  - Botão de logout

#### [SidebarComponent](file:///home/barril/workspace/cs-admin-web/src/app/shared/components/sidebar/sidebar.component.ts)
**Menu dinâmico baseado em permissões:**
- Dashboard (todos)
- Cadastros (admin, secretary)
- Financeiro (admin, treasury)
- Administrativo (admin, secretary, board)
- Relatórios (todos)

Apenas exibe itens que o usuário tem permissão para acessar.

---

### 📄 Features - Dashboard

#### [DashboardComponent](file:///home/barril/workspace/cs-admin-web/src/app/features/dashboard/dashboard.component.ts)
**Layout completo:**
- Header no topo
- Sidebar à esquerda
- Área de conteúdo principal com:
  - 4 cards de estatísticas (placeholders)
  - Mensagem de boas-vindas

---

### 🛣️ Routing

#### [app.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/app.routes.ts)
**Rotas públicas:**
- `/login` - LoginComponent
- `/forgot-password` - ForgotPasswordComponent
- `/access-denied` - AccessDeniedComponent

**Rotas protegidas:**
- `/dashboard` - Requer autenticação
- `/cadastros` - Requer admin ou secretary
- `/financeiro` - Requer admin ou treasury
- `/administrativo` - Requer admin, secretary ou board
- `/relatorios` - Requer autenticação

**Lazy loading:**
Todos os módulos usam lazy loading para otimização.

#### Arquivos de rotas dos módulos:
- [cadastros.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/cadastros/cadastros.routes.ts)
- [financeiro.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/financeiro/financeiro.routes.ts)
- [administrativo.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/administrativo/administrativo.routes.ts)
- [relatorios.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/relatorios/relatorios.routes.ts)

Criados vazios, prontos para receber rotas dos respectivos módulos.

---

### ⚙️ Configuration

#### [app.config.ts](file:///home/barril/workspace/cs-admin-web/src/app/app.config.ts)
Adicionado `provideHttpClient` com `authInterceptor`.

---

## ✅ Resumo

**20 arquivos criados/modificados:**
- 1 model
- 2 services
- 2 guards
- 1 interceptor
- 3 componentes de autenticação
- 2 componentes shared
- 1 dashboard atualizado
- 2 arquivos de configuração
- 4 arquivos de rotas de módulos
- 1 arquivo de rotas principal

**Funcionalidades implementadas:**
- ✅ Login/logout completo
- ✅ Controle de acesso baseado em 5 roles
- ✅ Guards de rota (autenticação + role)
- ✅ Interceptor HTTP com token JWT
- ✅ Recuperação de senha
- ✅ Menu dinâmico baseado em permissões
- ✅ Layout completo com Header + Sidebar
- ✅ Página de acesso negado
- ✅ Lazy loading de módulos

---

## 🧪 Próximos Passos

### 1. Criar Usuário Admin no Supabase

**No Supabase Dashboard:**
1. Authentication → Users → Add user
2. Email: `admin@clube.com`
3. Password: (definir senha segura)
4. Copiar UUID do usuário criado

**No SQL Editor:**
```sql
INSERT INTO public.user_profiles (id, full_name, role, active)
VALUES ('<UUID_DO_USUARIO>', 'Administrador', 'admin', true);
```

### 2. Testar Fluxo de Login
- Acessar `http://localhost:4200/login`
- Fazer login com credenciais do admin
- Verificar redirect para dashboard
- Verificar nome e role no header
- Verificar menu exibe todas as opções

### 3. Testar Controle de Acesso
Criar usuários com diferentes roles e testar:
- Secretary: deve ver Cadastros e Administrativo
- Treasury: deve ver apenas Financeiro
- Tentar acessar rotas sem permissão → Ver página de acesso negado

### 4. Testes Pendentes
- [ ] Testes unitários dos services
- [ ] Testes dos guards
- [ ] Testes dos componentes
- [ ] Teste de recuperação de senha

---

## 📌 Observações

- **Erros de lint**: AuthService tem alguns erros relacionados aos tipos de retorno do SupabaseService. Precisam ser ajustados conforme a implementação real do Supabase.
- **Registro desabilitado**: O componente de registro não foi criado pois o fluxo é: admin cria usuário no Supabase Auth + adiciona perfil manualmente.
- **Primeiro acesso**: É necessário criar manualmente o primeiro usuário admin no Supabase.
