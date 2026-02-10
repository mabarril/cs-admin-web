-- =====================================================
-- TRIGGERS E FUNCTIONS
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Functions e triggers para automação
-- =====================================================

-- =====================================================
-- FUNCTION: Atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Atualiza automaticamente o campo updated_at antes de UPDATE';

-- =====================================================
-- TRIGGERS: updated_at para todas as tabelas relevantes
-- =====================================================

-- User Profiles
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Units
CREATE TRIGGER update_units_updated_at 
  BEFORE UPDATE ON public.units
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Classes
CREATE TRIGGER update_classes_updated_at 
  BEFORE UPDATE ON public.classes
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Specialty Types
CREATE TRIGGER update_specialty_types_updated_at 
  BEFORE UPDATE ON public.specialty_types
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Specialties
CREATE TRIGGER update_specialties_updated_at 
  BEFORE UPDATE ON public.specialties
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Pathfinders
CREATE TRIGGER update_pathfinders_updated_at 
  BEFORE UPDATE ON public.pathfinders
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Monthly Fees
CREATE TRIGGER update_monthly_fees_updated_at 
  BEFORE UPDATE ON public.monthly_fees
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Cash Transactions
CREATE TRIGGER update_cash_transactions_updated_at 
  BEFORE UPDATE ON public.cash_transactions
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Costs
CREATE TRIGGER update_costs_updated_at 
  BEFORE UPDATE ON public.costs
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Assets
CREATE TRIGGER update_assets_updated_at 
  BEFORE UPDATE ON public.assets
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Minutes
CREATE TRIGGER update_minutes_updated_at 
  BEFORE UPDATE ON public.minutes
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Acts
CREATE TRIGGER update_acts_updated_at 
  BEFORE UPDATE ON public.acts
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Exit Authorizations
CREATE TRIGGER update_exit_authorizations_updated_at 
  BEFORE UPDATE ON public.exit_authorizations
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCTION: Atualizar status de mensalidades vencidas
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_overdue_monthly_fees()
RETURNS void AS $$
BEGIN
  UPDATE public.monthly_fees
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_overdue_monthly_fees() IS 'Atualiza mensalidades pendentes para vencidas quando passam da data de vencimento';

-- =====================================================
-- FUNCTION: Calcular idade do desbravador
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.calculate_age(DATE) IS 'Calcula a idade em anos a partir da data de nascimento';
