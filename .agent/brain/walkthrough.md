# Walkthrough — cs-admin-web

## 1. Angular 18 Modernization

**Branch**: `feature/angular-modernization` → merged to `develop`
**Build**: ✅ 0 errors

### Files Changed

| File | Change |
|---|---|
| `auth.service.ts` | Migrated `BehaviorSubject` → Angular `signal()` + `computed()` |
| `profile.service.ts` | Extracted `user_profiles` DB ops from `AuthService` (SRP) |
| `header.component.ts` | Signals, computed initials/role, SVG icons, mobile nav |
| `sidebar.component.ts` | `visibleMenuItems` as `computed()`, SVG icons, `linkClicked` output |
| `main-layout.component.ts` | New shell component with hamburger toggle, mobile overlay |
| `app.routes.ts` | All protected routes under `MainLayoutComponent` parent |
| `error.interceptor.ts` | Global 401/403/0 HTTP error handling with redirects |
| `auth.guard.ts` / `role.guard.ts` | Updated to call Signals as functions `()` |

---

## 2. Módulo de Cadastros

**Branch**: `feature/cadastros-module` → merged to `develop`
**Build**: ✅ 0 errors

### Files Created

| File | Description |
|---|---|
| `cadastros.model.ts` | Interfaces `Unidade`, `Classe`, `Desbravador` |
| `unidade.service.ts` | CRUD → tabela `units` (soft-delete) |
| `classe.service.ts` | CRUD → tabela `classes` |
| `desbravador.service.ts` | CRUD → tabela `pathfinders` (join units + classes) |
| `unidades.component.ts` | List + modal form + confirm dialog |
| `classes.component.ts` | Card grid + modal + color picker |
| `desbravadores.component.ts` | Table com avatars, badges de classe, cálculo de idade |
| `cadastros.routes.ts` | Rotas lazy-loaded para as 3 sub-páginas |

**Decisões de design**:
- Soft-delete (`active = false`) em todas as entidades
- Estado local com `signal()` em todos os componentes
- Dialogs de confirmação inline (sem `window.confirm`)

---

## 3. Módulo Financeiro

**Branch**: `feature/financeiro-module` → merged to `develop`
**Build**: ✅ 0 errors
**Commits**:
- `6e0b5d3` feat: implement Financeiro module
- `9b8d1b8` fix: select desbravador by name in mensalidades form
- `f66e5fa` fix: align financeiro module with real Supabase schema

### Bug corrigido: schema desalinhado

| Antes (errado) | Correto (schema real) |
|---|---|
| tabela `mensalidades` | `monthly_fees` |
| `desbravador_id` | `pathfinder_id` |
| `mes` + `ano` (int) | `reference_month` (DATE) |
| `valor` | `amount` |
| `data_pagamento` | `payment_date` |
| `observacao` | `notes` |
| tabela `lancamentos_caixa` | `cash_transactions` |
| `tipo` | `type` (`income` / `expense`) |
| `data` | `transaction_date` |
| tabela `custos` (estrutura fantasiosa) | `costs` (`project_name`, `estimated_amount`, `actual_amount`) |

### Arquivos criados/corrigidos

| File | Description |
|---|---|
| `financeiro.model.ts` | Interfaces alinhadas ao schema: `Mensalidade`, `LancamentoCaixa`, `Custo` |
| `mensalidade.service.ts` | CRUD → `monthly_fees`. `marcarPago()` usa status `paid` |
| `caixa.service.ts` | CRUD → `cash_transactions`. `calcularSaldo()` usa `type` income/expense |
| `custo.service.ts` | CRUD → `costs`. Sem soft-delete |
| `mensalidades.component.ts` | Select de desbravador por nome, botão "Pagar" inline, badges de status |
| `caixa.component.ts` | Cards Entradas / Saídas / Saldo, tabela colorida por tipo |
| `custos.component.ts` | Tabela com `estimated_amount` vs `actual_amount` |
| `financeiro.routes.ts` | Lazy-loaded: mensalidades (default), caixa, custos |

---

## 4. Módulo Administrativo

**Branch**: `feature/administrativo-module` → merged to `develop`
**Build**: ✅ 0 errors
**Commits**:
- `ef1557b` feat: implement Módulo Administrativo (Patrimônio, Atas, Atos, Autorizações)
- `8bdb904` fix(ux): locale pt-BR + sub-navegação por abas
- `d62c1d2` fix(header): título duplicado no header removido

### Arquivos criados

| File | Tabela Supabase | Destaques |
|---|---|---|
| `administrativo.model.ts` | — | Interfaces `Asset`, `Ata`, `Ato`, `Autorizacao` |
| `patrimonio.service.ts` | `assets` | CRUD, hard delete |
| `patrimonio.component.ts` | — | Tabela + filtro por status + modal |
| `ata.service.ts` | `minutes` | CRUD |
| `atas.component.ts` | — | Participantes via vírgula → `string[]` |
| `ato.service.ts` | `acts` | CRUD, hard delete |
| `atos.component.ts` | — | Badge de número circular |
| `autorizacao.service.ts` | `exit_authorizations` | JOIN com `pathfinders` para nome |
| `autorizacoes.component.ts` | — | Select desbravador por nome, campos de horário |
| `administrativo-shell.component.ts` | — | Shell com abas de navegação (🏛️/📋/📜/✅) |
| `administrativo.routes.ts` | — | Shell como parent, 4 sub-rotas como children |

### Correções de usabilidade (teste estático)

| Problema | Correção |
|---|---|
| `currency:'BRL'` sem locale → `BRL 150.00` | `registerLocaleData(localePt)` + `LOCALE_ID: 'pt'` em `app.config.ts` |
| Sem sub-navegação entre sub-páginas | `AdministrativoShellComponent` com abas via `routerLinkActive` |
| Título "Clube de Desbravadores" duplicado no header | `HeaderComponent` refatorado para renderizar apenas o user menu |

---

## Estado atual do projeto

```
develop (53253ad — 2026-02-19)
├── Angular 18 modernization (Signals, interceptor, layout)
├── Módulo Cadastros (Unidades, Classes, Desbravadores)
├── Módulo Financeiro (Mensalidades, Caixa, Custos)
└── Módulo Administrativo ✅
    ├── Shell com abas de navegação
    ├── Patrimônio (assets)
    ├── Atas (minutes)
    ├── Atos (acts)
    └── Autorizações de Saída (exit_authorizations)

Próximo: Módulo Relatórios
```
