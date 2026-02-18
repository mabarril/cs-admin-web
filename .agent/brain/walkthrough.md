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

Os serviços inicialmente usavam nomes de tabela/coluna incorretos. Após inspeção do `01_schema.sql`, todos os arquivos foram corrigidos:

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
| `financeiro.model.ts` | Interfaces alinhadas ao schema: `Mensalidade`, `LancamentoCaixa`, `Custo` + helpers `toReferenceMonth()` / `fromReferenceMonth()` |
| `mensalidade.service.ts` | CRUD → `monthly_fees`. Filtra por `reference_month` range. `marcarPago()` usa status `paid` |
| `caixa.service.ts` | CRUD → `cash_transactions`. `calcularSaldo()` usa `type` income/expense |
| `custo.service.ts` | CRUD → `costs`. Sem soft-delete (coluna `active` não existe) |
| `mensalidades.component.ts` | Tabela com competência formatada, select de desbravador por nome, botão "Pagar" inline, badges de status |
| `caixa.component.ts` | Cards Entradas / Saídas / Saldo, tabela colorida por tipo, modal com `transaction_date` |
| `custos.component.ts` | Tabela de projetos com `estimated_amount` vs `actual_amount`, modal com status do projeto |
| `financeiro.routes.ts` | Lazy-loaded: mensalidades (default), caixa, custos |

### Melhorias UX
- Seleção de desbravador por **nome** (select ordenado alfabeticamente) em vez de UUID
- Formulário de mensalidade usa campos `mes`/`ano` separados, convertidos para `reference_month` ao salvar
- Botão de ação inline renomeado de "✓ Pago" → **"Pagar"**
- Erros do Supabase logados no console com `console.error` para facilitar debug

---

## Estado atual do projeto

```
develop
├── Angular 18 modernization (Signals, interceptor, layout)
├── Módulo Cadastros (Unidades, Classes, Desbravadores)
└── Módulo Financeiro (Mensalidades, Caixa, Custos)

Próximo: Módulo Administrativo (Patrimônio, Atas, Atos)
```
