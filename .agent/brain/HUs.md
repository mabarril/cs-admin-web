# Histórias de Usuário (User Stories) - Sistema de Gestão de Clube de Desbravadores

## Módulo 1: Autenticação e Controle de Acesso

### HU-001: Cadastro de Usuário
**Como** um novo usuário  
**Eu quero** me cadastrar no sistema escolhendo meu papel (Admin, Diretor, Conselheiro ou Pai/Responsável)  
**Para que** eu possa acessar as funcionalidades apropriadas ao meu nível de permissão

**Critérios de Aceitação:**
- O formulário deve solicitar: email, senha, nome completo e papel
- A senha deve ter no mínimo 8 caracteres
- O email deve ser único no sistema
- Após o cadastro, o usuário deve ser redirecionado para a tela de login
- O sistema deve exibir mensagem de sucesso ou erro apropriada

---

### HU-002: Login no Sistema
**Como** um usuário cadastrado  
**Eu quero** fazer login com meu email e senha  
**Para que** eu possa acessar o sistema de acordo com minhas permissões

**Critérios de Aceitação:**
- O formulário deve solicitar email e senha
- Credenciais inválidas devem exibir mensagem de erro clara
- Login bem-sucedido deve redirecionar para o Dashboard
- O token de autenticação deve ser armazenado de forma segura
- O sistema deve manter a sessão do usuário

---

### HU-003: Logout do Sistema
**Como** um usuário autenticado  
**Eu quero** fazer logout do sistema  
**Para que** eu possa encerrar minha sessão de forma segura

**Critérios de Aceitação:**
- Deve haver um botão de logout visível na interface
- Ao fazer logout, o token deve ser removido
- O usuário deve ser redirecionado para a tela de login
- Tentativas de acessar páginas protegidas devem redirecionar para login

---

## Módulo 2: Gestão de Unidades

### HU-004: Cadastrar Unidade
**Como** um Diretor ou Admin  
**Eu quero** cadastrar uma nova unidade (ex: Águias, Tigres)  
**Para que** eu possa organizar os desbravadores em grupos

**Critérios de Aceitação:**
- O formulário deve solicitar: nome da unidade, descrição e diretor responsável
- Todos os campos são obrigatórios
- O nome da unidade deve ser único
- Após cadastro, a unidade deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-005: Listar Unidades
**Como** um usuário autenticado  
**Eu quero** visualizar todas as unidades cadastradas  
**Para que** eu possa ter uma visão geral da organização do clube

**Critérios de Aceitação:**
- A listagem deve exibir: nome, descrição e diretor de cada unidade
- Deve ser possível visualizar em formato de cards ou tabela
- A interface deve ser responsiva
- Unidades vazias devem exibir mensagem apropriada

---

### HU-006: Editar Unidade
**Como** um Diretor ou Admin  
**Eu quero** editar informações de uma unidade existente  
**Para que** eu possa manter os dados atualizados

**Critérios de Aceitação:**
- Deve haver um botão de edição em cada unidade
- O formulário deve vir preenchido com os dados atuais
- Alterações devem ser salvas no banco de dados
- Mensagem de sucesso deve ser exibida após atualização

---

### HU-007: Excluir Unidade
**Como** um Admin  
**Eu quero** excluir uma unidade  
**Para que** eu possa remover unidades que não existem mais

**Critérios de Aceitação:**
- Deve haver um botão de exclusão em cada unidade
- Deve exibir confirmação antes de excluir
- Após exclusão, a unidade deve ser removida da listagem
- Mensagem de sucesso deve ser exibida

---

## Módulo 3: Gestão de Classes

### HU-008: Cadastrar Classe
**Como** um Diretor ou Admin  
**Eu quero** cadastrar uma nova classe (ex: Amigo, Companheiro, Pesquisador)  
**Para que** eu possa organizar os desbravadores por faixa etária

**Critérios de Aceitação:**
- O formulário deve solicitar: nome da classe e descrição
- Nome da classe deve ser único
- Após cadastro, a classe deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-009: Listar Classes
**Como** um usuário autenticado  
**Eu quero** visualizar todas as classes cadastradas  
**Para que** eu possa conhecer as divisões por idade do clube

**Critérios de Aceitação:**
- A listagem deve exibir nome e descrição de cada classe
- Interface responsiva
- Classes vazias devem exibir mensagem apropriada

---

## Módulo 4: Gestão de Especialidades (Honors)

### HU-010: Cadastrar Especialidade
**Como** um Diretor ou Admin  
**Eu quero** cadastrar uma nova especialidade  
**Para que** os desbravadores possam conquistar badges de conhecimento

**Critérios de Aceitação:**
- O formulário deve solicitar: nome, categoria e requisitos
- Todos os campos são obrigatórios
- Após cadastro, a especialidade deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-011: Listar Especialidades
**Como** um usuário autenticado  
**Eu quero** visualizar todas as especialidades disponíveis  
**Para que** eu possa conhecer as opções de conquistas

**Critérios de Aceitação:**
- A listagem deve exibir: nome, categoria e requisitos
- Deve ser possível filtrar por categoria
- Interface responsiva

---

## Módulo 5: Gestão de Desbravadores

### HU-012: Cadastrar Desbravador
**Como** um Diretor ou Conselheiro  
**Eu quero** cadastrar um novo desbravador com informações pessoais e dos responsáveis  
**Para que** eu possa gerenciar os membros do clube

**Critérios de Aceitação:**
- O formulário deve solicitar:
  - Nome completo
  - Data de nascimento
  - Unidade
  - Classe
  - Nome do responsável
  - Email do responsável
  - Telefone do responsável
  - Endereço
- Campos obrigatórios: nome, data de nascimento, unidade, classe, nome do responsável, email e telefone
- Após cadastro, o desbravador deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-013: Listar Desbravadores
**Como** um usuário autenticado  
**Eu quero** visualizar todos os desbravadores cadastrados  
**Para que** eu possa ter uma visão geral dos membros

**Critérios de Aceitação:**
- A listagem deve exibir: nome, idade, unidade, classe e informações do responsável
- Deve calcular a idade automaticamente a partir da data de nascimento
- Interface responsiva com tabela ou cards
- Deve exibir avatar com iniciais do nome

---

### HU-014: Editar Desbravador
**Como** um Diretor ou Conselheiro  
**Eu quero** editar informações de um desbravador  
**Para que** eu possa manter os dados atualizados

**Critérios de Aceitação:**
- Deve haver botão de edição para cada desbravador
- Formulário deve vir preenchido com dados atuais
- Alterações devem ser salvas
- Mensagem de sucesso deve ser exibida

---

### HU-015: Excluir Desbravador
**Como** um Admin  
**Eu quero** excluir um desbravador  
**Para que** eu possa remover membros que não fazem mais parte do clube

**Critérios de Aceitação:**
- Deve haver botão de exclusão
- Deve exibir confirmação antes de excluir
- Após exclusão, o desbravador deve ser removido da listagem
- Mensagem de sucesso deve ser exibida

---

## Módulo 6: Gestão Financeira - Mensalidades

### HU-016: Cadastrar Mensalidade
**Como** um Diretor ou Admin  
**Eu quero** cadastrar uma mensalidade para um desbravador  
**Para que** eu possa controlar os pagamentos mensais

**Critérios de Aceitação:**
- O formulário deve solicitar: desbravador, mês/ano, valor e status (pago/não pago)
- Todos os campos são obrigatórios
- Após cadastro, a mensalidade deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-017: Atualizar Status de Pagamento
**Como** um Diretor ou Admin  
**Eu quero** marcar uma mensalidade como paga ou não paga  
**Para que** eu possa manter o controle financeiro atualizado

**Critérios de Aceitação:**
- Deve haver opção para alterar o status
- A alteração deve ser refletida imediatamente na interface
- Dashboard deve atualizar os totais de mensalidades pagas/não pagas
- Mensagem de sucesso deve ser exibida

---

### HU-018: Visualizar Mensalidades
**Como** um Pai/Responsável  
**Eu quero** visualizar as mensalidades do meu filho  
**Para que** eu possa acompanhar os pagamentos

**Critérios de Aceitação:**
- Deve exibir apenas mensalidades do filho do responsável logado
- Deve mostrar: mês/ano, valor e status
- Interface clara e de fácil compreensão

---

## Módulo 7: Gestão Financeira - Fluxo de Caixa

### HU-019: Registrar Entrada de Caixa
**Como** um Diretor ou Admin  
**Eu quero** registrar uma entrada financeira  
**Para que** eu possa controlar as receitas do clube

**Critérios de Aceitação:**
- O formulário deve solicitar: descrição, valor, data e categoria
- Tipo deve ser automaticamente definido como "income"
- Após registro, a entrada deve aparecer na listagem
- Dashboard deve atualizar o total de receitas

---

### HU-020: Registrar Saída de Caixa
**Como** um Diretor ou Admin  
**Eu quero** registrar uma despesa  
**Para que** eu possa controlar os gastos do clube

**Critérios de Aceitação:**
- O formulário deve solicitar: descrição, valor, data e categoria
- Tipo deve ser automaticamente definido como "expense"
- Após registro, a despesa deve aparecer na listagem
- Dashboard deve atualizar o total de despesas

---

### HU-021: Visualizar Fluxo de Caixa
**Como** um Diretor ou Admin  
**Eu quero** visualizar todas as movimentações financeiras  
**Para que** eu possa ter uma visão completa das finanças

**Critérios de Aceitação:**
- Deve exibir lista de todas as transações
- Deve diferenciar visualmente entradas (verde) e saídas (vermelho)
- Deve mostrar: descrição, valor, data, categoria e tipo
- Deve calcular e exibir o saldo líquido

---

## Módulo 8: Gestão de Patrimônio (Inventário)

### HU-022: Cadastrar Item de Patrimônio
**Como** um Diretor ou Admin  
**Eu quero** cadastrar um item do patrimônio do clube  
**Para que** eu possa controlar os bens e equipamentos

**Critérios de Aceitação:**
- O formulário deve solicitar: nome, descrição, quantidade, valor unitário, localização, data de aquisição e condição
- Campos obrigatórios: nome, quantidade, valor unitário e condição
- Condição deve ter opções: Excelente, Bom, Regular, Ruim
- Valor total deve ser calculado automaticamente (quantidade × valor unitário)
- Após cadastro, o item deve aparecer na listagem

---

### HU-023: Listar Patrimônio
**Como** um usuário autenticado  
**Eu quero** visualizar todos os itens do patrimônio  
**Para que** eu possa conhecer os bens do clube

**Critérios de Aceitação:**
- Deve exibir: nome, quantidade, valor unitário, valor total, localização e condição
- Deve calcular e exibir o valor total do patrimônio
- Interface responsiva

---

### HU-024: Editar Item de Patrimônio
**Como** um Diretor ou Admin  
**Eu quero** editar informações de um item do patrimônio  
**Para que** eu possa manter o inventário atualizado

**Critérios de Aceitação:**
- Deve haver botão de edição para cada item
- Formulário deve vir preenchido com dados atuais
- Valor total deve ser recalculado automaticamente
- Mensagem de sucesso deve ser exibida

---

## Módulo 9: Secretaria - Atas

### HU-025: Criar Ata de Reunião
**Como** um Diretor ou Admin  
**Eu quero** criar uma ata de reunião  
**Para que** eu possa documentar oficialmente as reuniões do clube

**Critérios de Aceitação:**
- O formulário deve solicitar: título, data, participantes e conteúdo
- Todos os campos são obrigatórios
- Conteúdo deve suportar texto formatado
- Após criação, a ata deve aparecer na listagem
- Mensagem de sucesso deve ser exibida

---

### HU-026: Listar Atas
**Como** um usuário autenticado  
**Eu quero** visualizar todas as atas de reunião  
**Para que** eu possa consultar o histórico de reuniões

**Critérios de Aceitação:**
- Deve exibir: título, data e participantes
- Deve permitir visualizar o conteúdo completo
- Deve ordenar por data (mais recentes primeiro)

---

## Módulo 10: Secretaria - Autorizações de Saída

### HU-027: Criar Autorização de Saída
**Como** um Diretor ou Admin  
**Eu quero** criar uma autorização de saída para um evento  
**Para que** eu possa obter consentimento dos responsáveis

**Critérios de Aceitação:**
- O formulário deve solicitar: nome do evento, data, local, desbravador e status da assinatura
- Campos obrigatórios: nome do evento, data, local e desbravador
- Status deve ter opções: Pendente, Assinado
- Após criação, a autorização deve aparecer na listagem

---

### HU-028: Assinar Autorização de Saída
**Como** um Pai/Responsável  
**Eu quero** assinar digitalmente uma autorização de saída  
**Para que** eu possa autorizar meu filho a participar de eventos

**Critérios de Aceitação:**
- Deve exibir apenas autorizações do filho do responsável logado
- Deve permitir alterar status para "Assinado"
- Deve registrar data e hora da assinatura
- Mensagem de sucesso deve ser exibida

---

### HU-029: Visualizar Autorizações
**Como** um Diretor  
**Eu quero** visualizar todas as autorizações de saída  
**Para que** eu possa verificar quais desbravadores estão autorizados para eventos

**Critérios de Aceitação:**
- Deve exibir: nome do evento, data, desbravador e status
- Deve permitir filtrar por status (Pendente/Assinado)
- Deve diferenciar visualmente eventos futuros e passados

---

## Módulo 11: Dashboard e Relatórios

### HU-030: Visualizar Dashboard
**Como** um usuário autenticado  
**Eu quero** visualizar um dashboard com estatísticas do clube  
**Para que** eu possa ter uma visão geral rápida

**Critérios de Aceitação:**
- Deve exibir:
  - Total de desbravadores
  - Total de unidades
  - Total de classes
  - Total de itens no inventário
  - Total de receitas
  - Total de despesas
  - Saldo líquido
  - Total de mensalidades coletadas
  - Mensalidades pagas vs não pagas
  - Valor total do patrimônio
- Cards devem ter cores e ícones apropriados
- Dados devem ser atualizados em tempo real

---

### HU-031: Gerar Relatório Geral em PDF
**Como** um Diretor ou Admin  
**Eu quero** gerar um relatório geral em PDF  
**Para que** eu possa ter um documento completo sobre o clube

**Critérios de Aceitação:**
- Deve incluir: estatísticas gerais, resumo financeiro e resumo de patrimônio
- PDF deve ter formatação profissional
- Deve incluir data de geração
- Download deve iniciar automaticamente

---

### HU-032: Gerar Relatório Financeiro em PDF
**Como** um Diretor ou Admin  
**Eu quero** gerar um relatório financeiro detalhado em PDF  
**Para que** eu possa analisar as finanças do clube

**Critérios de Aceitação:**
- Deve incluir: receitas, despesas, saldo líquido e detalhamento de transações
- Deve incluir gráficos de receitas vs despesas
- PDF deve ter formatação profissional
- Download deve iniciar automaticamente

---

### HU-033: Gerar Relatório de Patrimônio em PDF
**Como** um Diretor ou Admin  
**Eu quero** gerar um relatório de patrimônio em PDF  
**Para que** eu possa ter um inventário completo dos bens

**Critérios de Aceitação:**
- Deve incluir: lista de todos os itens com detalhes e valor total
- Deve agrupar por condição ou localização
- PDF deve ter formatação profissional
- Download deve iniciar automaticamente

---

## Resumo de Papéis e Permissões

### Admin
- Acesso total a todas as funcionalidades
- Pode criar, editar e excluir qualquer registro
- Pode gerenciar usuários

### Diretor
- Pode gerenciar unidades, classes, especialidades e desbravadores
- Acesso total a finanças e patrimônio
- Pode gerar todos os relatórios
- Pode criar atas e autorizações

### Conselheiro
- Pode gerenciar desbravadores atribuídos
- Pode visualizar classes e especialidades
- Acesso limitado a finanças

### Pai/Responsável
- Pode visualizar informações do próprio filho
- Pode assinar autorizações de saída
- Pode visualizar mensalidades do filho
- Acesso somente leitura

---

**Total de Histórias de Usuário**: 33  
**Última Atualização**: 11 de Fevereiro de 2026
