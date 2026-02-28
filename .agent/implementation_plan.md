# Parametrização de Dados e IDs Auto-incrementais

Este plano aborda duas necessidades principais do sistema para garantir integridade e facilidade de uso:
1.  **Parametrização de Atributos**: Substituição de campos de texto livre (`string`) por listas controladas, *enums* e chaves estrangeiras.
2.  **Identificadores de Negócio**: Configuração de auto-incrementos e bloqueios de edição nos IDs (códigos de desbravador, números de ata, patrimônio, etc.).

## User Review Required

> [!IMPORTANT]  
> **Patrimônio**: O código de patrimônio (`asset_code`) atualmente é do tipo `VARCHAR(50)`. 
> Para torná-lo auto-incremental no banco, proponho criarmos uma *Sequence* e uma *Trigger* no PostgreSQL que gere automaticamente o formato `PAT-0001`, `PAT-0002` no momento da inserção, caso o usuário não informe o código na tela. Isso lhe atende?

> [!WARNING]  
> A alteração de colunas como o `meeting_number` e `act_number` para `IDENTITY` será feita via SQL num novo arquivo de migração (`02_ajustes_schema.sql`). 

## Proposed Changes

---

### Módulo Cadastros (Desbravadores)

#### 1. Parametrização de Cargos
O campo `position` (Cargo) no `Desbravador` hoje é um texto livre.
Vamos criar um Enum no frontend e alterar para um select no formulário UI, restringindo os valores para:
`'Diretor' | 'Diretor Associado' | 'Secretário' | 'Tesoureiro' | 'Instrutor' | 'Conselheiro' | 'Conselheiro Associado' | 'Capitão' | 'Secretário de Unidade' | 'Desbravador'`

#### 2. Edição de `user_code`
*   No arquivo `desbravadores.component.ts`, iremos usar a função `disable()` no controle `user_code` se o usuário estiver na tela de *Edição*. Ele só poderá preencher o código no momento de inserção (Novo Cadastro).

---

### Módulo Financeiro

#### 1. Parametrização da Categoria de Transação (`category_id`)
*   Será adicionado um Select dropdown vinculado à tabela `transaction_categories` para selecionar a categoria, evitando que o usuário digite texto livre nas saídas/entradas de caixa.
*   **Forma de pagamento**: Iremos definir em `financeiro.model.ts` e na UI do caixa listas fixas para os relatórios: `PIX`, `Dinheiro`, `Transferência`, `Boleto`, `Cartão`.

---

### Módulo Administrativo (Patrimônio, Atas, Atos)

#### 1. Parametrização de Tipos e Categorias
Para evitar digitação errônea nos campos texto, alteraremos os seguintes atributos para **Selects** (listas de valores):
*   **Patrimônio (`category`)**: Categorizar em blocos como `'Acampamento', 'Cozinha', 'Escritório', 'Uniformes'`, etc.
*   **Patrimônio (`location`)**: Parametrizar locais físicos como `'Sede', 'Almoxarifado'`.
*   **Atas (`meeting_type`)**: Restringir para tipos como `'Reunião Regular', 'Reunião de Diretoria', 'Comissão'`.
*   **Atos (`act_type`)**: Limitar a `'Admissão', 'Investidura', 'Nomeação', 'Medida Disciplinar', 'Transferência', 'Exclusão'`.

#### 2. IDs Auto-incrementais (Back-end)
*   **Arquivo** `02_ajustes_schema.sql` (Novo):
    *   **Atas e Atos**: Alterar as tabelas para preencher `meeting_number` e `act_number` se não informados, baseados no próximo ID sequencial.
    *   **Patrimônio**: Criar sequence `asset_code_seq` para auto-gerar strings `PAT-XXXX`.

#### 3. Frontend dos IDs (Somente Leitura)
*   Em `atas.component.ts`, `atos.component.ts` e `patrimonio.component.ts`: 
    * Ocultar os campos de código no formulário de inclusão/edição e avisar o usuário `(Gerado automaticamente)`.
    * Limpar o envio desses campos nos payloads nas funções `salvar()`.

## Verification Plan

### Automated Tests
*   Rodar `supabase db reset` ou apply migration no backend.

### Manual Verification
*   **Desbravadores**: Editar um cadastro e confirmar que `user_code` e `position` operam corretamente.
*   **Patrimônio / Atas / Atos**: Criar novos registros pela interface UI sem preencher o Código/Número, submeter e observar se aparecerão formatados na Grid (ex: `PAT-0001`, `1`, `1`).
