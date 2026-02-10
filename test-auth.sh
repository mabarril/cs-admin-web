#!/bin/bash

# Script de teste manual do módulo de autenticação
# Execute este script e siga as instruções

echo "=========================================="
echo "  TESTES DO MÓDULO DE AUTENTICAÇÃO"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Credenciais de teste
EMAIL="mabarril@gmail.com"
PASSWORD="071294"

echo "📋 CHECKLIST DE TESTES MANUAIS"
echo ""
echo "Abra o navegador em: http://localhost:4200/"
echo ""

# Teste 1: Redirect para Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 1: Redirect para Login"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Acesse http://localhost:4200/"
echo "2. Verifique se redireciona automaticamente para /login"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 2: Página de Login
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 2: Página de Login"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verifique os seguintes elementos:"
echo "  [ ] Título: 'Sistema de Gerenciamento'"
echo "  [ ] Subtítulo: 'Clube de Desbravadores'"
echo "  [ ] Campo de Email"
echo "  [ ] Campo de Senha"
echo "  [ ] Botão 'Entrar'"
echo "  [ ] Link 'Esqueceu sua senha?'"
echo "  [ ] Design com gradiente azul/indigo"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 3: Login com credenciais inválidas
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 3: Login com Credenciais Inválidas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Digite email: teste@invalido.com"
echo "2. Digite senha: senhaerrada"
echo "3. Clique em 'Entrar'"
echo "4. Verifique se aparece mensagem de erro"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 4: Login com credenciais válidas
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 4: Login com Credenciais Válidas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Credenciais do Admin:"
echo "  Email: ${YELLOW}${EMAIL}${NC}"
echo "  Senha: ${YELLOW}${PASSWORD}${NC}"
echo ""
echo "1. Digite as credenciais acima"
echo "2. Clique em 'Entrar'"
echo "3. Verifique se redireciona para /dashboard"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 5: Dashboard
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 5: Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verifique os seguintes elementos:"
echo "  [ ] Header no topo com nome do usuário"
echo "  [ ] Role exibida: 'Administrador'"
echo "  [ ] Avatar com iniciais do nome"
echo "  [ ] Sidebar à esquerda"
echo "  [ ] Menu com 5 opções (Dashboard, Cadastros, Financeiro, Administrativo, Relatórios)"
echo "  [ ] 4 cards de estatísticas"
echo "  [ ] Mensagem de boas-vindas"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 6: Menu do Usuário
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 6: Menu do Usuário"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Clique no avatar no header"
echo "2. Verifique dropdown com:"
echo "   [ ] Link 'Meu Perfil'"
echo "   [ ] Botão 'Sair'"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 7: Logout
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 7: Logout"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Clique em 'Sair'"
echo "2. Verifique se redireciona para /login"
echo "3. Verifique se sessão foi encerrada"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 8: AuthGuard
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 8: AuthGuard (Proteção de Rotas)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Estando deslogado, tente acessar: http://localhost:4200/dashboard"
echo "2. Verifique se redireciona para: /login?returnUrl=/dashboard"
echo "3. Faça login novamente"
echo "4. Verifique se redireciona de volta para /dashboard"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 9: Recuperação de Senha
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 9: Recuperação de Senha"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Na página de login, clique em 'Esqueceu sua senha?'"
echo "2. Verifique redirect para /forgot-password"
echo "3. Digite um email válido"
echo "4. Clique em 'Enviar Email de Recuperação'"
echo "5. Verifique mensagem de sucesso"
echo "6. Clique em 'Voltar para Login'"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Teste 10: Navegação no Menu
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ TESTE 10: Navegação no Menu"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Faça login e teste cada item do menu:"
echo "  [ ] Dashboard - deve funcionar"
echo "  [ ] Cadastros - deve carregar (página vazia por enquanto)"
echo "  [ ] Financeiro - deve carregar (página vazia por enquanto)"
echo "  [ ] Administrativo - deve carregar (página vazia por enquanto)"
echo "  [ ] Relatórios - deve carregar (página vazia por enquanto)"
echo ""
read -p "Pressione ENTER quando completar este teste..."

# Resumo
echo ""
echo "=========================================="
echo "  ${GREEN}✓ TESTES CONCLUÍDOS${NC}"
echo "=========================================="
echo ""
echo "Se todos os testes passaram, o módulo de autenticação está funcionando corretamente!"
echo ""
echo "Próximos passos:"
echo "1. Reportar qualquer problema encontrado"
echo "2. Fazer merge da branch feature/auth-module para develop"
echo "3. Iniciar desenvolvimento do próximo módulo"
echo ""
