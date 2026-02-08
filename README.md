# Sistema de Gerenciamento de Clube de Desbravadores

Sistema web completo para gerenciamento de clube de desbravadores, incluindo cadastros, controle financeiro, administrativo e relatórios.

## 🚀 Tecnologias

- **Frontend**: Angular 18+ com Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Autenticação**: Supabase Auth com Row Level Security
- **Deploy**: Vercel (Frontend) + Supabase Cloud (Backend)

## 📋 Pré-requisitos

- Node.js 18+
- npm 10+
- Conta Supabase

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cs-admin-web.git
cd cs-admin-web
```

2. Instale as dependências
```bash
npm install --legacy-peer-deps
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

4. Inicie o servidor de desenvolvimento
```bash
npm start
```

Acesse http://localhost:4200

## 👥 Perfis de Usuário

- **Admin**: Acesso total ao sistema
- **Secretaria**: Gerenciar cadastros (unidades, classes, especialidades, desbravadores)
- **Tesouraria**: Gerenciar financeiro (mensalidades, caixa, custos)
- **Conselheiros**: Visualização de dados e relatórios
- **Diretoria**: Visualização de relatórios administrativos

## 📚 Módulos do Sistema

### Cadastros
- Unidades
- Classes (com cores padrão)
- Especialidades (por tipo com cores)
- Desbravadores
- Importação via XLSX/CSV

### Financeiro
- Controle de Mensalidades
- Controle de Caixa (entradas e saídas)
- Controle de Custos (projetos)

### Administrativo
- Controle de Patrimônio
- Controle de Atas
- Controle de Atos
- Autorizações de Saída

### Relatórios
- Fluxo de Caixa
- Mensalidades
- Patrimônio
- Desbravadores

## 🧪 Comandos

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Testes
npm test

# Lint
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/           # Serviços, guards, interceptors
│   ├── shared/         # Componentes compartilhados
│   └── features/       # Módulos de funcionalidades
│       ├── auth/
│       ├── cadastros/
│       ├── financeiro/
│       ├── administrativo/
│       └── relatorios/
├── assets/             # Imagens, ícones
├── environments/       # Configurações de ambiente
└── styles/             # Estilos globais
```

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre como contribuir.

## 📝 Versionamento

Usamos [SemVer](http://semver.org/) para versionamento. Veja [CHANGELOG.md](CHANGELOG.md) para histórico.

## 📄 Licença

Este projeto está sob a licença MIT.

## ✨ Status do Projeto

🚧 **Em Desenvolvimento** - Versão 0.1.0

- ✅ Estrutura do projeto configurada
- ✅ Angular + Tailwind CSS
- ⏳ Configuração do Supabase
- ⏳ Módulo de Autenticação
- ⏳ Módulos de Cadastros
- ⏳ Módulos Financeiros
- ⏳ Módulos Administrativos
- ⏳ Módulos de Relatórios
