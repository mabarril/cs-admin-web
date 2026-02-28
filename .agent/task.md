# Planejamento da Análise de Parametrização e IDs de Negócio

- [x] Levantar e analisar os modelos de domínio do sistema (`cadastros`, `financeiro`, `administrativo`)
- [x] Identificar atributos que atualmente são texto livre (strings) e podem ser convertidos para *enums*, tabelas de domínio ou listas de opções
- [x] Sugestões apresentadas e mescladas no Plano de Implementação (`implementation_plan.md`)
- [x] **Execução**: Adequar IDs de Negócio (Códigos / Numbers):
  - [x] Criar nova migration (`02_ajustes_schema.sql`) para transformar `meeting_number` e `act_number` em contadores seriais automáticos.
  - [x] Criar sequence e trigger na migration para auto-preencher `asset_code` com lógica sequencial literal (ex `PAT-0001`, `PAT-0002`).
  - [x] Atualizar formulários Angular dos módulos Administrativos (ocultar os campos de "Código" ou colocar em *readonly* indicando ao usuário que a geração é automática).
  - [x] Atualizar formulário do `Desbravador`: Habilitar a edição do campo `user_code` **somente** no cadastro inicial (bloquear campo na edição de um existente).
- [x] **Execução**: Implementar as parametrizações sugeridas nos formulários (`cadastros`, `financeiro`, `administrativo`) utilizando Listas Combinadas/Selects em vez de Input Texts limitando os tipos que o usuário pode ingressar.
- [x] **Verificação**: Testar integridade de tabelas com inserções testando auto-incremento garantido e validações tipadas na interface gráfica.
