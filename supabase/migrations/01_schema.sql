-- =====================================================
-- SCHEMA DO BANCO DE DADOS - CLUB MANAGEMENT SYSTEM
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Schema completo com todas as tabelas do sistema
-- =====================================================

-- =====================================================
-- 1. AUTENTICAÇÃO E PERFIS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'secretary', 'treasury', 'counselor', 'board')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'Perfis de usuários do sistema com controle de acesso por role';
COMMENT ON COLUMN public.user_profiles.role IS 'Perfil de acesso: admin, secretary, treasury, counselor, board';

-- =====================================================
-- 2. CADASTROS BASE
-- =====================================================

-- Unidades
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.units IS 'Unidades do clube (ex: Tigres, Leões, Águias)';

-- Classes
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  order_index INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.classes IS 'Classes de desbravadores (Amigo, Companheiro, Pesquisador, etc.)';
COMMENT ON COLUMN public.classes.color_hex IS 'Cor da classe em formato hexadecimal (#RRGGBB)';
COMMENT ON COLUMN public.classes.order_index IS 'Ordem de exibição das classes';

-- Tipos de Especialidades
CREATE TABLE IF NOT EXISTS public.specialty_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.specialty_types IS 'Tipos de especialidades (Habilidades, Artes, Ciências, etc.)';

-- Especialidades
CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  specialty_type_id UUID REFERENCES public.specialty_types(id),
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.specialties IS 'Especialidades disponíveis para os desbravadores';

-- Desbravadores
CREATE TABLE IF NOT EXISTS public.pathfinders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code VARCHAR(50) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  birth_date DATE NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female')),
  unit_id UUID REFERENCES public.units(id),
  class_id UUID REFERENCES public.classes(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.pathfinders IS 'Cadastro de desbravadores';
COMMENT ON COLUMN public.pathfinders.user_code IS 'Código único do desbravador';
COMMENT ON COLUMN public.pathfinders.position IS 'Cargo/função no clube';

-- Especialidades dos Desbravadores
CREATE TABLE IF NOT EXISTS public.pathfinder_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathfinder_id UUID REFERENCES public.pathfinders(id) ON DELETE CASCADE,
  specialty_id UUID REFERENCES public.specialties(id),
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pathfinder_id, specialty_id)
);

COMMENT ON TABLE public.pathfinder_specialties IS 'Especialidades conquistadas pelos desbravadores';

-- =====================================================
-- 3. MÓDULO FINANCEIRO
-- =====================================================

-- Mensalidades
CREATE TABLE IF NOT EXISTS public.monthly_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathfinder_id UUID REFERENCES public.pathfinders(id),
  reference_month DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.monthly_fees IS 'Controle de mensalidades dos desbravadores';
COMMENT ON COLUMN public.monthly_fees.reference_month IS 'Mês de referência da mensalidade';
COMMENT ON COLUMN public.monthly_fees.status IS 'Status: pending, paid, overdue, cancelled';

-- Categorias de Transações
CREATE TABLE IF NOT EXISTS public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.transaction_categories IS 'Categorias para classificação de transações financeiras';

-- Transações de Caixa
CREATE TABLE IF NOT EXISTS public.cash_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES public.transaction_categories(id),
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  notes TEXT,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.cash_transactions IS 'Registro de todas as transações financeiras (entradas e saídas)';

-- Custos/Projetos
CREATE TABLE IF NOT EXISTS public.costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_amount DECIMAL(10,2),
  actual_amount DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.costs IS 'Controle de custos e projetos do clube';

-- =====================================================
-- 4. MÓDULO ADMINISTRATIVO
-- =====================================================

-- Patrimônio
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  acquisition_date DATE,
  acquisition_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('active', 'maintenance', 'inactive', 'disposed')),
  location VARCHAR(255),
  responsible_id UUID REFERENCES public.user_profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.assets IS 'Controle de patrimônio do clube';
COMMENT ON COLUMN public.assets.asset_code IS 'Código único do bem patrimonial';

-- Atas
CREATE TABLE IF NOT EXISTS public.minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_number INTEGER NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  attendees TEXT[],
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.minutes IS 'Livro de atas de reuniões';
COMMENT ON COLUMN public.minutes.attendees IS 'Array com nomes dos participantes';

-- Atos
CREATE TABLE IF NOT EXISTS public.acts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  act_number INTEGER NOT NULL,
  act_date DATE NOT NULL,
  act_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.acts IS 'Livro de atos administrativos';

-- Autorizações de Saída
CREATE TABLE IF NOT EXISTS public.exit_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathfinder_id UUID REFERENCES public.pathfinders(id),
  event_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  departure_time TIME,
  return_time TIME,
  destination VARCHAR(255),
  responsible_person VARCHAR(255),
  authorized_by VARCHAR(255),
  authorization_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.exit_authorizations IS 'Autorizações de saída para eventos e atividades';
