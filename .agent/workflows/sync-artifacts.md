---
description: Sincronizar artefatos do agente com o repositório Git
---

# Workflow: Sincronizar Artefatos

Este workflow copia todos os artefatos gerados pelo agente para o repositório Git do projeto.

## Quando usar
- Após completar uma tarefa significativa
- Antes de fazer commit de mudanças importantes
- Periodicamente para manter o histórico atualizado

## Passos

### 1. Verificar artefatos existentes
```bash
ls -la ~/.gemini/antigravity/brain/5bf5b450-159f-4f40-abb7-9a519076a4dc/
```

### 2. Copiar artefatos para o repositório
// turbo
```bash
cp -r ~/.gemini/antigravity/brain/5bf5b450-159f-4f40-abb7-9a519076a4dc/* /home/barril/workspace/cs-admin-web/.agent/brain/ 2>/dev/null || true
```

### 3. Verificar arquivos copiados
// turbo
```bash
ls -la /home/barril/workspace/cs-admin-web/.agent/brain/
```

### 4. Adicionar ao Git
```bash
cd /home/barril/workspace/cs-admin-web && git add .agent/
```

### 5. Verificar status
```bash
cd /home/barril/workspace/cs-admin-web && git status
```

## Notas
- Os artefatos são automaticamente copiados para `.agent/brain/`
- Você pode fazer commit quando quiser preservar o estado atual
- Os artefatos incluem: task.md, implementation_plan.md, walkthrough.md e outros
