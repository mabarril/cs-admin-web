# Análise e Sugestões de Parametrização

Como analista sênior, realizei uma varredura nos principais modelos e entidades do sistema (`cadastros.model.ts`, `financeiro.model.ts` e `administrativo.model.ts`). 

A principal causa de dados "sujos" ou divergentes em um sistema é a utilização excessiva de campos de texto livre (`string`) para valores que possuem um domínio conhecido. Quando deixamos o usuário digitar livremente, corremos o risco de ter no banco de dados variações do mesmo termo (ex: `"Pix"`, `"PIX"`, `"Transferência Pix"`, `"pix"`).

Abaixo detalho os atributos identificados que **devem ser parametrizados**, seja através de novos `tipos (enums/types)` TypeScript e constraints/enums no banco de dados, ou através de **Tabelas de Domínio (Lookups)** caso sejam listas que podem crescer no futuro.

---

## 📌 Módulo de Cadastros (`cadastros.model.ts`)

### 1. Entidade `Desbravador`

*   **`position` (Cargo/Função)**: Atualmente é uma `string` livre.
    *   **Problema:** O usuário pode digitar "Conselheiro", "conselheiro", "Cons.", "Conselheira", etc., o que dificulta filtros e relatórios futuros.
    *   **Solução:** Transformar em Enum ou Tabela de Domínio.
    *   **Sugestão de Parametrização:** `Diretor`, `Diretor Associado`, `Secretário`, `Tesoureiro`, `Instrutor`, `Conselheiro`, `Conselheiro Associado`, `Capitão`, `Secretário de Unidade`, `Desbravador`.

---

## 💰 Módulo Financeiro (`financeiro.model.ts`)

### 2. Entidade `LancamentoCaixa`

*   **`payment_method` (Forma de Pagamento)**: Atualmente é uma `string` opcional nas entradas e saídas de caixa.
    *   **Problema:** Dificultará a conciliação bancária e filtragem exata se houver digitação divergente (Ex: "Dinheiro vivo", "Cash", etc).
    *   **Solução:** Tipagem de Domínio Restrito.
    *   **Sugestão de Parametrização:** `PIX`, `Dinheiro`, `Transferência Bancária`, `Boleto`, `Cartão de Crédito`, `Cartão de Débito`.

*   **`category_id` (Categoria da Transação)**: 
    *   **Boas práticas mantidas:** Já prevê relação com uma categoria (via ID).
    *   **Sugestão:** Garantir que na interface do usuário (UI) isso seja preenchido através de um **Select/Dropdown** tipado puxando da tabela de categorias de finanças, e garantir que um usuário comum não consiga criar categorias ad hoc durante o lançamento.

---

## 🏢 Módulo Administrativo (`administrativo.model.ts`)

Este é o módulo com maior número de campos de texto livre que poderiam gerar inconsistências.

### 3. Entidade `Asset` (Patrimônio)

*   **`category` (Categoria do Item)**: Atualmente `string`.
    *   **Problema:** Variações como "Acampamento", "Camping", "Barracas" podem ser usadas para coisas semelhantes, fragmentando os relatórios de inventário.
    *   **Sugestão de Parametrização:** Transformar em lista fixa como `Acampamento`, `Cozinha`, `Escritório`, `Uniformes`, `Materiais Esportivos`, `Banda/Fanfarra`, `Ferramentas`.

*   **`location` (Local de Armazenamento/Uso)**: Atualmente `string`.
    *   **Problema:** Erros de digitação sobre o local onde o item se encontra.
    *   **Sugestão de Parametrização:** `Sede (Igreja)`, `Almoxarifado`, `Com um membro (Empréstimo)` ou criar de fato uma tabela `locais_armazenamento`.

### 4. Entidade `Ata` (Atas de Reuniões)

*   **`meeting_type` (Tipo de Reunião)**: Atualmente `string`.
    *   **Sugestão de Parametrização:** Limitar as opções para: `Reunião de Diretoria`, `Reunião de Pais e Responsáveis`, `Reunião Regular (Clube)`, `Comissão Disciplinar`, `Comissão Extraordinária`.

### 5. Entidade `Ato` (Atos Administrativos)

*   **`act_type` (Tipo do Ato)**: Atualmente `string`.
    *   **Sugestão de Parametrização:** Restringir para tipos padronizados de atos do manual: `Admissão em Lenço`, `Investidura de Classe`, `Investidura de Especialidade`, `Nomeação de Cargo`, `Medida Disciplinar`, `Transferência`, `Exclusão`.

### 6. Entidade `Autorizacao` (Autorizações de Saída/Eventos)

*   **`event_name` (Nome do Evento)**: Atualmente texto.
    *   **Sugestão Melhoria:** Pode continuar como texto para eventos pontuais, mas se a igreja já possui um cronograma, seria ideal atrelar isso ao **ID de um Evento pré-cadastrado** no sistema `event_id`, garantindo consistência.

*   **`authorized_by` (Autorizado por)**: Atualmente `string` livre.
    *   **Sugestão de Parametrização:** Alterar para `authorized_by_id` pontando como Foreign Key para a tabela `user_profiles` e filtrando por indivíduos que realmente possuem *Role* ou autoridade (ex: Diretor ou Secretário). Documentar quem autorizou via texto livre tira a confiabilidade da auditoria.

---

## 🎯 Conclusão e Próximos Passos

A abordagem recomendada é:
1. Para listas curtas e estáticas (ex: `Forma de pagamento`, `Tipo de Ato`), utilizar o recurso do próprio TypeScript (ex: `type PaymentMethod = 'pix' | 'cash' | 'credit_card'`) somado a constantes para popular os Dropdowns do Angular.
2. Para listas que podem sofrer adições anuais (ex: `Cargos`, `Categorias de Patrimônio`), uma simples tabela de domínio (`lookups`) no Supabase facilita a gestão sem precisar de deploy a cada alteração.

> [!TIP]
> **Como você gostaria de prosseguir?** Podemos começar aplicando essas tipagens estáticas/enums nos modelos hoje mesmo e ajustando os formulários do Angular correspondentes.
