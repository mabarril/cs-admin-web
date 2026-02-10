-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Políticas de segurança baseadas em roles
-- =====================================================

-- =====================================================
-- FUNCTION: Obter role do usuário atual
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS VARCHAR AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_role() IS 'Retorna o role do usuário autenticado';

-- =====================================================
-- FUNCTION: Verificar se usuário é admin
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin' AND active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin() IS 'Verifica se o usuário autenticado é admin';

-- =====================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathfinders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathfinder_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exit_authorizations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS: user_profiles
-- =====================================================

-- Admin tem acesso total
CREATE POLICY "Admin full access on user_profiles" 
  ON public.user_profiles
  FOR ALL 
  USING (public.is_admin());

-- Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Usuários podem atualizar seus próprios dados (exceto role)
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- POLÍTICAS: Cadastros Base (units, classes, etc.)
-- =====================================================

-- Todos podem ler cadastros base
CREATE POLICY "All authenticated users can read units" 
  ON public.units FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can read classes" 
  ON public.classes FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can read specialty_types" 
  ON public.specialty_types FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can read specialties" 
  ON public.specialties FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin e Secretaria podem gerenciar cadastros base
CREATE POLICY "Admin and secretary can manage units" 
  ON public.units FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary'));

CREATE POLICY "Admin and secretary can manage classes" 
  ON public.classes FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary'));

CREATE POLICY "Admin and secretary can manage specialty_types" 
  ON public.specialty_types FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary'));

CREATE POLICY "Admin and secretary can manage specialties" 
  ON public.specialties FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary'));

-- =====================================================
-- POLÍTICAS: Pathfinders
-- =====================================================

-- Todos podem ler desbravadores
CREATE POLICY "All authenticated users can read pathfinders" 
  ON public.pathfinders FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Conselheiros podem gerenciar desbravadores
CREATE POLICY "Admin, secretary and counselors can manage pathfinders" 
  ON public.pathfinders FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'counselor'));

-- =====================================================
-- POLÍTICAS: Pathfinder Specialties
-- =====================================================

-- Todos podem ler especialidades dos desbravadores
CREATE POLICY "All authenticated users can read pathfinder_specialties" 
  ON public.pathfinder_specialties FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Conselheiros podem gerenciar especialidades
CREATE POLICY "Admin, secretary and counselors can manage pathfinder_specialties" 
  ON public.pathfinder_specialties FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'counselor'));

-- =====================================================
-- POLÍTICAS: Módulo Financeiro
-- =====================================================

-- Todos podem ler categorias de transações
CREATE POLICY "All authenticated users can read transaction_categories" 
  ON public.transaction_categories FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin e Tesouraria podem gerenciar categorias
CREATE POLICY "Admin and treasury can manage transaction_categories" 
  ON public.transaction_categories FOR ALL 
  USING (public.get_user_role() IN ('admin', 'treasury'));

-- Todos podem ler mensalidades
CREATE POLICY "All authenticated users can read monthly_fees" 
  ON public.monthly_fees FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Tesouraria podem gerenciar mensalidades
CREATE POLICY "Admin, secretary and treasury can manage monthly_fees" 
  ON public.monthly_fees FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'treasury'));

-- Todos podem ler transações
CREATE POLICY "All authenticated users can read cash_transactions" 
  ON public.cash_transactions FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin e Tesouraria podem gerenciar transações
CREATE POLICY "Admin and treasury can manage cash_transactions" 
  ON public.cash_transactions FOR ALL 
  USING (public.get_user_role() IN ('admin', 'treasury'));

-- Todos podem ler custos
CREATE POLICY "All authenticated users can read costs" 
  ON public.costs FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Tesouraria e Diretoria podem gerenciar custos
CREATE POLICY "Admin, treasury and board can manage costs" 
  ON public.costs FOR ALL 
  USING (public.get_user_role() IN ('admin', 'treasury', 'board'));

-- =====================================================
-- POLÍTICAS: Módulo Administrativo
-- =====================================================

-- Todos podem ler patrimônio
CREATE POLICY "All authenticated users can read assets" 
  ON public.assets FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin e Secretaria podem gerenciar patrimônio
CREATE POLICY "Admin and secretary can manage assets" 
  ON public.assets FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary'));

-- Todos podem ler atas
CREATE POLICY "All authenticated users can read minutes" 
  ON public.minutes FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Diretoria podem gerenciar atas
CREATE POLICY "Admin, secretary and board can manage minutes" 
  ON public.minutes FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'board'));

-- Todos podem ler atos
CREATE POLICY "All authenticated users can read acts" 
  ON public.acts FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Diretoria podem gerenciar atos
CREATE POLICY "Admin, secretary and board can manage acts" 
  ON public.acts FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'board'));

-- Todos podem ler autorizações de saída
CREATE POLICY "All authenticated users can read exit_authorizations" 
  ON public.exit_authorizations FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Admin, Secretaria e Conselheiros podem gerenciar autorizações
CREATE POLICY "Admin, secretary and counselors can manage exit_authorizations" 
  ON public.exit_authorizations FOR ALL 
  USING (public.get_user_role() IN ('admin', 'secretary', 'counselor'));
