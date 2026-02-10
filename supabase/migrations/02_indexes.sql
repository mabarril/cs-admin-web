-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE QUERIES
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Índices para melhorar performance das consultas
-- =====================================================

-- =====================================================
-- ÍNDICES EM FOREIGN KEYS
-- =====================================================

-- Pathfinders
CREATE INDEX IF NOT EXISTS idx_pathfinders_unit_id 
  ON public.pathfinders(unit_id) 
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_pathfinders_class_id 
  ON public.pathfinders(class_id) 
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_pathfinders_user_code 
  ON public.pathfinders(user_code) 
  WHERE user_code IS NOT NULL;

-- Pathfinder Specialties
CREATE INDEX IF NOT EXISTS idx_pathfinder_specialties_pathfinder_id 
  ON public.pathfinder_specialties(pathfinder_id);

CREATE INDEX IF NOT EXISTS idx_pathfinder_specialties_specialty_id 
  ON public.pathfinder_specialties(specialty_id);

-- Specialties
CREATE INDEX IF NOT EXISTS idx_specialties_type_id 
  ON public.specialties(specialty_type_id) 
  WHERE active = true;

-- =====================================================
-- ÍNDICES DO MÓDULO FINANCEIRO
-- =====================================================

-- Monthly Fees
CREATE INDEX IF NOT EXISTS idx_monthly_fees_pathfinder_id 
  ON public.monthly_fees(pathfinder_id);

CREATE INDEX IF NOT EXISTS idx_monthly_fees_status 
  ON public.monthly_fees(status);

CREATE INDEX IF NOT EXISTS idx_monthly_fees_reference_month 
  ON public.monthly_fees(reference_month);

CREATE INDEX IF NOT EXISTS idx_monthly_fees_due_date 
  ON public.monthly_fees(due_date);

-- Cash Transactions
CREATE INDEX IF NOT EXISTS idx_cash_transactions_date 
  ON public.cash_transactions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_cash_transactions_type 
  ON public.cash_transactions(type);

CREATE INDEX IF NOT EXISTS idx_cash_transactions_category_id 
  ON public.cash_transactions(category_id);

CREATE INDEX IF NOT EXISTS idx_cash_transactions_created_by 
  ON public.cash_transactions(created_by);

-- Costs
CREATE INDEX IF NOT EXISTS idx_costs_status 
  ON public.costs(status);

CREATE INDEX IF NOT EXISTS idx_costs_created_by 
  ON public.costs(created_by);

-- =====================================================
-- ÍNDICES DO MÓDULO ADMINISTRATIVO
-- =====================================================

-- Assets
CREATE INDEX IF NOT EXISTS idx_assets_asset_code 
  ON public.assets(asset_code);

CREATE INDEX IF NOT EXISTS idx_assets_status 
  ON public.assets(status);

CREATE INDEX IF NOT EXISTS idx_assets_responsible_id 
  ON public.assets(responsible_id);

-- Minutes
CREATE INDEX IF NOT EXISTS idx_minutes_meeting_date 
  ON public.minutes(meeting_date);

CREATE INDEX IF NOT EXISTS idx_minutes_meeting_number 
  ON public.minutes(meeting_number);

-- Acts
CREATE INDEX IF NOT EXISTS idx_acts_act_date 
  ON public.acts(act_date);

CREATE INDEX IF NOT EXISTS idx_acts_act_number 
  ON public.acts(act_number);

-- Exit Authorizations
CREATE INDEX IF NOT EXISTS idx_exit_authorizations_pathfinder_id 
  ON public.exit_authorizations(pathfinder_id);

CREATE INDEX IF NOT EXISTS idx_exit_authorizations_event_date 
  ON public.exit_authorizations(event_date);

-- =====================================================
-- ÍNDICES COMPOSTOS PARA QUERIES COMPLEXAS
-- =====================================================

-- Busca de mensalidades por desbravador e status
CREATE INDEX IF NOT EXISTS idx_monthly_fees_pathfinder_status 
  ON public.monthly_fees(pathfinder_id, status);

-- Busca de transações por data e tipo
CREATE INDEX IF NOT EXISTS idx_cash_transactions_date_type 
  ON public.cash_transactions(transaction_date, type);

-- Busca de desbravadores ativos por unidade
CREATE INDEX IF NOT EXISTS idx_pathfinders_unit_active 
  ON public.pathfinders(unit_id, active);
