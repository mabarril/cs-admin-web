# Walkthrough: Parametrização e IDs de Negócio Auto-incrementais

Nesta funcionalidade, a integridade dos dados foi aprimorada substituindo atributos textuais vulneráveis por listas tipadas restritas e blindando a edição de IDs sistêmicos por segurança e automação.

## 🚀 Alterações Realizadas

### 1. Parametrização de Interfaces e Enums
Vários campos que anteriormente aceitavam `strings` livres (como *"Mesa", "Portaria", "Diretor", "PIX"*) passaram a exigir valores predefinidos através de _Enums_ definidos no TypeScript. 

*   **Desbravadores** (`position`): Limitado para os cargos oficiais (Diretor, Conselheiro, etc).
*   **Caixa e Finanças** (`payment_method`): Limitado para métodos conhecidos (PIX, Boleto, Dinheiro, etc).
*   **Patrimônio** (`category`, `location`): Limitado para as áreas da organização (Acampamento, Cozinha, Sede, etc).
*   **Atas e Atos** (`meeting_type`, `act_type`): Limitado para Reunião de Diretoria, Regular, Portaria, Resolução, etc.

🔄 **Impacto de UI:** Nos formulários de cadastro, os componentes `<input type="text">` destes campos foram substituídos por menus suspensos `<select>` gerados dinamicamente com as novas regras.

### 2. IDs Auto-incrementais e Seguros
*   **Desbravadores (`user_code`):** O formulário agora checa se o usuário está criando (campo habilitado) ou editando (campo `readonly` congelado).
*   **Banco de Dados (PostgreSQL/Supabase):** Criada a migração `02_ajustes_schema.sql` contendo:
    *   *Sequences* nativas para inteiros `meeting_number` e `act_number` (Atas/Atos).
    *   *Sequence* + *Database Trigger* para geração dinâmica de strings formatadas `PAT-XXXX` toda vez que um novo `asset_code` nulo for tentado submeter no Patrimônio.
*   **Frontend (Atas, Atos, Patrimônio):** Removidos/Desabilitados das telas os campos de digitação de Código, recebendo o aviso "Gerado Automaticamente" não enviando mais esse payload no momento do `.POST / .INSERT`.

### 🗂️ Arquivos Modificados (Diffs Relevantes)

**Modelos de Domínio:** Configuração base das regras e `as const` arrays.
*   `src/app/core/models/cadastros.model.ts`
*   `src/app/core/models/financeiro.model.ts`
*   `src/app/features/administrativo/administrativo.model.ts`

**Componentes Formulários (UI & Regras):** Substituição de TextInputs por Dropdowns (Selects) e Type Casting robusto.
*   `src/app/features/cadastros/desbravadores/desbravadores.component.ts`
*   `src/app/features/financeiro/caixa/caixa.component.ts`
*   `src/app/features/administrativo/patrimonio/patrimonio.component.ts`
*   `src/app/features/administrativo/atas/atas.component.ts`
*   `src/app/features/administrativo/atos/atos.component.ts`

**Migrations (Backend):**
*   [NEW] `supabase/migrations/02_ajustes_schema.sql`

## ✅ Como Validar (Verificação Manual)
1. Antes de iniciar, garanta no seu terminal que as *sequences* e *triggers* estão aplicadas com: `supabase db reset`.
2. Após o reset e rodar no `npm run start`, acesse "Atos" ou "Atas" ou "Patrimônio", clique em *Novo*, adicione dados mínimos sem um código.
3. Observe as requisições na aba _Network_ / Banco de retornando o _ID sequencial_ ou do formato numérico desejado para o _asset_ (`PAT-0001`, `PAT-0002`).
4. Verifique a tela de _Edição_ de desbravadores, notando que seu campo _Código_ está bloqueado com fundo cinza e impossível de re-escrever.
5. Verifique a limitação de seleção nas categorias descritas no _Step 1_.
