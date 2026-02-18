# Implementation Plan — cs-admin-web

## Estado geral

| Módulo | Status | Branch |
|---|---|---|
| Angular 18 Modernization | ✅ Concluído | merged → develop |
| Cadastros (Unidades, Classes, Desbravadores) | ✅ Concluído | merged → develop |
| Financeiro (Mensalidades, Caixa, Custos) | ✅ Concluído | merged → develop |
| **Administrativo** | 🔲 Próximo | — |
| Relatórios | 🔲 Pendente | — |

---

## Módulo Administrativo (próximo)

O schema já contém as tabelas necessárias (`assets`, `minutes`, `acts`, `exit_authorizations`).

### Tabelas disponíveis no banco

| Tabela | Descrição |
|---|---|
| `assets` | Patrimônio: `asset_code`, `name`, `category`, `acquisition_value`, `status` |
| `minutes` | Atas de reunião: `meeting_number`, `meeting_date`, `content`, `attendees[]` |
| `acts` | Atos administrativos: `act_number`, `act_date`, `title`, `content` |
| `exit_authorizations` | Autorizações de saída: `pathfinder_id`, `event_name`, `event_date`, `responsible_person` |

### Proposed Changes

#### [NEW] `administrativo.model.ts`
Interfaces TypeScript mapeadas ao schema real para `Ativo`, `Ata`, `Ato`, `AutorizacaoSaida`.

#### [NEW] `ativo.service.ts`
CRUD → tabela `assets`.

#### [NEW] `ata.service.ts`
CRUD → tabela `minutes`.

#### [NEW] Componentes
- `AssetsComponent` — lista de patrimônio com status e filtro por categoria
- `MinutesComponent` — livro de atas com visualização de conteúdo
- `ActsComponent` — livro de atos administrativos

#### [MODIFY] `administrativo.routes.ts`
Rotas lazy-loaded para cada sub-módulo.

---

## Padrões estabelecidos no projeto

> Seguir estes padrões em todos os novos módulos:

1. **Schema first** — sempre verificar `01_schema.sql` antes de criar modelos/serviços
2. **Signal-based state** — usar `signal()` e `computed()` nos componentes
3. **Hard-delete vs Soft-delete** — verificar se a tabela tem coluna `active` antes de aplicar soft-delete
4. **Supabase client** — usar `this.supabase.client` (getter público do `SupabaseService`)
5. **Error logging** — sempre incluir `console.error` no `catchError` para facilitar debug
6. **Lazy loading** — cada componente carregado via `loadComponent()` nas rotas

---

## Verification Plan (próximo módulo)

### Automated
```bash
npm run build  # 0 erros TypeScript
```

### Manual
- Verificar CRUD completo de cada entidade em produção/staging
- Verificar filtros e ordenação nas listagens
- Verificar modais de criação/edição e dialogs de exclusão
