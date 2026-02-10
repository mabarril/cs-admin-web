# Plano de Implementação - Módulo de Autenticação

## Objetivo

Implementar o módulo completo de autenticação do sistema, incluindo:
- Login e registro de usuários
- Controle de acesso baseado em roles (5 perfis)
- Guards de rota para proteção de páginas
- Serviço de gerenciamento de perfis
- Interface de usuário responsiva

## User Review Required

> [!IMPORTANT]
> **Histórias de Usuário**: Este plano implementa as HU-001 (Login no Sistema) e HU-002 (Controle de Acesso por Perfil).

> [!WARNING]
> **Primeiro Usuário Admin**: Após implementação, será necessário criar manualmente o primeiro usuário admin no Supabase e adicionar seu perfil na tabela `user_profiles`.

## Proposed Changes

### Core - Services

#### [NEW] [auth.service.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/services/auth.service.ts)
Serviço de autenticação que estende o SupabaseService:
- Login/logout
- Registro de usuários
- Gerenciamento de sessão
- Observables de estado de autenticação
- Métodos helper para verificação de permissões

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserProfile$ = new BehaviorSubject<UserProfile | null>(null);
  
  async login(email: string, password: string): Promise<void>
  async logout(): Promise<void>
  async register(email: string, password: string, fullName: string): Promise<void>
  getUserProfile(): Observable<UserProfile | null>
  hasRole(role: string): boolean
  hasAnyRole(roles: string[]): boolean
}
```

#### [NEW] [user-profile.service.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/services/user-profile.service.ts)
Serviço para gerenciar perfis de usuários:
- CRUD de perfis
- Atualização de perfil do usuário logado
- Listagem de usuários por role

---

### Core - Models

#### [NEW] [user-profile.model.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/models/user-profile.model.ts)
Interface e tipos para perfis de usuário:

```typescript
export type UserRole = 'admin' | 'secretary' | 'treasury' | 'counselor' | 'board';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### Core - Guards

#### [NEW] [auth.guard.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/guards/auth.guard.ts)
Guard para proteger rotas que requerem autenticação:
- Verifica se usuário está autenticado
- Redireciona para login se não autenticado
- Preserva URL de destino para redirect após login

#### [NEW] [role.guard.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/guards/role.guard.ts)
Guard para controle de acesso baseado em roles:
- Verifica se usuário tem role necessário
- Suporta múltiplos roles permitidos
- Redireciona para página de acesso negado

```typescript
export const roleGuard = (allowedRoles: UserRole[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }
    return router.createUrlTree(['/access-denied']);
  };
};
```

---

### Core - Interceptors

#### [NEW] [auth.interceptor.ts](file:///home/barril/workspace/cs-admin-web/src/app/core/interceptors/auth.interceptor.ts)
Interceptor HTTP para adicionar token de autenticação:
- Adiciona token JWT em requisições
- Trata erros 401 (não autorizado)
- Refresh automático de token

---

### Features - Auth Module

#### [NEW] [login.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/login/login.component.ts)
Componente de login:
- Formulário reativo com validações
- Exibição de erros
- Loading state
- Link para recuperação de senha
- Redirect após login bem-sucedido

#### [NEW] [login.component.html](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/login/login.component.html)
Template do login:
- Design responsivo
- Campos de email e senha
- Botão de submit com loading
- Mensagens de erro
- Link para registro (se habilitado)

#### [NEW] [register.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/register/register.component.ts)
Componente de registro (opcional, pode ser desabilitado):
- Formulário com nome, email, senha e confirmação
- Validações customizadas
- Criação de usuário no Supabase Auth
- Aguarda aprovação de admin para ativar perfil

#### [NEW] [forgot-password.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/forgot-password/forgot-password.component.ts)
Componente de recuperação de senha:
- Envio de email de reset
- Feedback de sucesso/erro

#### [NEW] [access-denied.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/features/auth/access-denied/access-denied.component.ts)
Página de acesso negado:
- Mensagem amigável
- Link para voltar ao dashboard
- Informação sobre permissões necessárias

---

### Shared - Components

#### [NEW] [header.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/shared/components/header/header.component.ts)
Cabeçalho da aplicação:
- Nome do usuário logado
- Avatar/iniciais
- Menu dropdown com perfil e logout
- Navegação principal

#### [NEW] [sidebar.component.ts](file:///home/barril/workspace/cs-admin-web/src/app/shared/components/sidebar/sidebar.component.ts)
Menu lateral com controle de acesso:
- Exibe apenas opções permitidas para o role
- Ícones e labels
- Indicador de rota ativa
- Responsivo (collapse em mobile)

---

### Routing

#### [MODIFY] [app.routes.ts](file:///home/barril/workspace/cs-admin-web/src/app/app.routes.ts)
Configuração de rotas com guards:

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cadastros',
    loadChildren: () => import('./features/cadastros/cadastros.routes'),
    canActivate: [authGuard, roleGuard(['admin', 'secretary'])]
  },
  // ... outras rotas com guards apropriados
];
```

---

### Configuration

#### [MODIFY] [app.config.ts](file:///home/barril/workspace/cs-admin-web/src/app/app.config.ts)
Adicionar providers de guards e interceptors:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // ... outros providers
  ]
};
```

---

## Verification Plan

### Automated Tests

#### 1. Testes Unitários dos Serviços
```bash
ng test --include='**/auth.service.spec.ts'
ng test --include='**/user-profile.service.spec.ts'
```

Verifica:
- Login com credenciais válidas/inválidas
- Logout limpa sessão
- Verificação de roles funciona corretamente
- Observables emitem valores corretos

#### 2. Testes dos Guards
```bash
ng test --include='**/auth.guard.spec.ts'
ng test --include='**/role.guard.spec.ts'
```

Verifica:
- Guard bloqueia acesso não autenticado
- Role guard valida permissões corretamente
- Redirects funcionam

#### 3. Testes dos Componentes
```bash
ng test --include='**/login.component.spec.ts'
```

Verifica:
- Formulário valida campos
- Botão submit desabilitado quando inválido
- Mensagens de erro exibidas

### Manual Verification

#### 1. Criar Usuário Admin
No Supabase Dashboard:
1. Authentication → Users → Add user
2. Criar usuário com email e senha
3. Copiar UUID do usuário

No SQL Editor:
```sql
INSERT INTO public.user_profiles (id, full_name, role) 
VALUES ('<UUID>', 'Admin Sistema', 'admin');
```

#### 2. Testar Fluxo de Login
- [ ] Acessar `/login`
- [ ] Tentar login com credenciais inválidas → Ver erro
- [ ] Fazer login com admin criado → Redirecionar para dashboard
- [ ] Ver nome do admin no header
- [ ] Verificar menu exibe todas as opções (admin tem acesso total)

#### 3. Testar Controle de Acesso
Criar usuários com diferentes roles e testar:

**Secretaria:**
- [ ] Deve ver menu de Cadastros
- [ ] Não deve ver menu de Tesouraria
- [ ] Tentar acessar `/financeiro` diretamente → Acesso negado

**Tesouraria:**
- [ ] Deve ver menu Financeiro
- [ ] Não deve ver menu de Cadastros
- [ ] Tentar acessar `/cadastros` diretamente → Acesso negado

#### 4. Testar Guards
- [ ] Logout e tentar acessar `/dashboard` → Redirecionar para login
- [ ] URL de destino preservada após login
- [ ] Sessão expira após inatividade (configurar timeout)

#### 5. Testar Recuperação de Senha
- [ ] Acessar `/forgot-password`
- [ ] Inserir email válido
- [ ] Verificar recebimento de email do Supabase
- [ ] Clicar no link e redefinir senha
- [ ] Fazer login com nova senha

---

## Ordem de Execução

1. **Criar models e interfaces** (user-profile.model.ts)
2. **Criar serviços** (auth.service.ts, user-profile.service.ts)
3. **Criar guards** (auth.guard.ts, role.guard.ts)
4. **Criar interceptor** (auth.interceptor.ts)
5. **Criar componentes de autenticação** (login, register, forgot-password, access-denied)
6. **Criar componentes shared** (header, sidebar)
7. **Configurar rotas** com guards
8. **Atualizar app.config.ts** com providers
9. **Criar testes unitários**
10. **Testar manualmente** todos os fluxos
11. **Criar usuário admin** no Supabase
12. **Validar controle de acesso** com diferentes roles

---

## Próximos Passos (Após Aprovação)

1. Criar todos os arquivos listados
2. Implementar lógica de cada componente/serviço
3. Criar testes unitários
4. Testar fluxo completo de autenticação
5. Documentar processo de criação de usuários
6. Fazer merge da feature branch para develop
