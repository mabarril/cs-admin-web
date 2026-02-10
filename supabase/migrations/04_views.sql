-- =====================================================
-- VIEWS PARA RELATÓRIOS E CONSULTAS
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Views para facilitar consultas e relatórios
-- =====================================================

-- =====================================================
-- VIEW: Fluxo de Caixa com Saldo Acumulado
-- =====================================================

CREATE OR REPLACE VIEW public.vw_cash_flow AS
SELECT 
  ct.id,
  ct.transaction_date,
  ct.description,
  tc.name as category_name,
  ct.type,
  ct.amount,
  ct.payment_method,
  ct.notes,
  SUM(
    CASE 
      WHEN ct.type = 'income' THEN ct.amount 
      ELSE -ct.amount 
    END
  ) OVER (ORDER BY ct.transaction_date, ct.created_at) as balance
FROM public.cash_transactions ct
LEFT JOIN public.transaction_categories tc ON ct.category_id = tc.id
ORDER BY ct.transaction_date DESC, ct.created_at DESC;

COMMENT ON VIEW public.vw_cash_flow IS 'Fluxo de caixa com saldo acumulado';

-- =====================================================
-- VIEW: Detalhes Completos dos Desbravadores
-- =====================================================

CREATE OR REPLACE VIEW public.vw_pathfinder_details AS
SELECT 
  p.id,
  p.user_code,
  p.full_name,
  p.position,
  p.birth_date,
  public.calculate_age(p.birth_date) as age,
  p.gender,
  u.name as unit_name,
  c.name as class_name,
  c.color_hex as class_color,
  p.active,
  COUNT(DISTINCT ps.specialty_id) as specialties_count,
  p.created_at,
  p.updated_at
FROM public.pathfinders p
LEFT JOIN public.units u ON p.unit_id = u.id
LEFT JOIN public.classes c ON p.class_id = c.id
LEFT JOIN public.pathfinder_specialties ps ON p.id = ps.pathfinder_id
GROUP BY p.id, u.name, c.name, c.color_hex;

COMMENT ON VIEW public.vw_pathfinder_details IS 'Detalhes completos dos desbravadores com unidade, classe e contagem de especialidades';

-- =====================================================
-- VIEW: Resumo de Mensalidades
-- =====================================================

CREATE OR REPLACE VIEW public.vw_monthly_fees_summary AS
SELECT 
  DATE_TRUNC('month', mf.reference_month) as month,
  COUNT(*) as total_fees,
  COUNT(*) FILTER (WHERE mf.status = 'paid') as paid_count,
  COUNT(*) FILTER (WHERE mf.status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE mf.status = 'overdue') as overdue_count,
  SUM(mf.amount) as total_amount,
  SUM(mf.amount) FILTER (WHERE mf.status = 'paid') as paid_amount,
  SUM(mf.amount) FILTER (WHERE mf.status = 'pending') as pending_amount,
  SUM(mf.amount) FILTER (WHERE mf.status = 'overdue') as overdue_amount
FROM public.monthly_fees mf
GROUP BY DATE_TRUNC('month', mf.reference_month)
ORDER BY month DESC;

COMMENT ON VIEW public.vw_monthly_fees_summary IS 'Resumo mensal de mensalidades por status';

-- =====================================================
-- VIEW: Especialidades por Desbravador
-- =====================================================

CREATE OR REPLACE VIEW public.vw_pathfinder_specialties AS
SELECT 
  p.id as pathfinder_id,
  p.full_name as pathfinder_name,
  s.id as specialty_id,
  s.name as specialty_name,
  st.name as specialty_type_name,
  st.color_hex as specialty_type_color,
  ps.completion_date,
  ps.created_at
FROM public.pathfinder_specialties ps
INNER JOIN public.pathfinders p ON ps.pathfinder_id = p.id
INNER JOIN public.specialties s ON ps.specialty_id = s.id
INNER JOIN public.specialty_types st ON s.specialty_type_id = st.id
WHERE p.active = true AND s.active = true
ORDER BY p.full_name, st.name, s.name;

COMMENT ON VIEW public.vw_pathfinder_specialties IS 'Especialidades conquistadas por cada desbravador';

-- =====================================================
-- VIEW: Patrimônio Ativo
-- =====================================================

CREATE OR REPLACE VIEW public.vw_active_assets AS
SELECT 
  a.id,
  a.asset_code,
  a.name,
  a.category,
  a.acquisition_date,
  a.acquisition_value,
  a.current_value,
  a.status,
  a.location,
  up.full_name as responsible_name,
  a.updated_at
FROM public.assets a
LEFT JOIN public.user_profiles up ON a.responsible_id = up.id
WHERE a.status IN ('active', 'maintenance')
ORDER BY a.category, a.name;

COMMENT ON VIEW public.vw_active_assets IS 'Patrimônio ativo e em manutenção';

-- =====================================================
-- VIEW: Resumo Financeiro por Categoria
-- =====================================================

CREATE OR REPLACE VIEW public.vw_financial_summary_by_category AS
SELECT 
  tc.name as category_name,
  tc.type,
  COUNT(*) as transaction_count,
  SUM(ct.amount) as total_amount,
  MIN(ct.transaction_date) as first_transaction,
  MAX(ct.transaction_date) as last_transaction
FROM public.cash_transactions ct
INNER JOIN public.transaction_categories tc ON ct.category_id = tc.id
GROUP BY tc.id, tc.name, tc.type
ORDER BY tc.type, total_amount DESC;

COMMENT ON VIEW public.vw_financial_summary_by_category IS 'Resumo financeiro agrupado por categoria';

-- =====================================================
-- VIEW: Desbravadores por Unidade
-- =====================================================

CREATE OR REPLACE VIEW public.vw_pathfinders_by_unit AS
SELECT 
  u.id as unit_id,
  u.name as unit_name,
  COUNT(p.id) as pathfinder_count,
  COUNT(p.id) FILTER (WHERE p.active = true) as active_count,
  COUNT(p.id) FILTER (WHERE p.gender = 'male') as male_count,
  COUNT(p.id) FILTER (WHERE p.gender = 'female') as female_count,
  ROUND(AVG(public.calculate_age(p.birth_date)), 1) as average_age
FROM public.units u
LEFT JOIN public.pathfinders p ON u.id = p.unit_id
WHERE u.active = true
GROUP BY u.id, u.name
ORDER BY u.name;

COMMENT ON VIEW public.vw_pathfinders_by_unit IS 'Estatísticas de desbravadores por unidade';
