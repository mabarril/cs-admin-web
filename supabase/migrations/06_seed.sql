-- =====================================================
-- SEED DATA - Dados Iniciais
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Dados iniciais para popular o banco de dados
-- =====================================================

-- =====================================================
-- CLASSES PADRÃO
-- =====================================================

INSERT INTO public.classes (name, color_hex, order_index) VALUES
  ('Amigo', '#0066CC', 1),
  ('Companheiro', '#CC0000', 2),
  ('Pesquisador', '#00CC00', 3),
  ('Pioneiro', '#FF9900', 4),
  ('Excursionista', '#9933CC', 5),
  ('Guia', '#CC6600', 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TIPOS DE ESPECIALIDADES
-- =====================================================

INSERT INTO public.specialty_types (name, color_hex) VALUES
  ('Habilidades Domésticas', '#FF6B6B'),
  ('Ciência e Saúde', '#4ECDC4'),
  ('Atividades Missionárias', '#95E1D3'),
  ('Atividades Recreativas', '#F38181'),
  ('Artes e Habilidades Manuais', '#AA96DA'),
  ('Estudo da Natureza', '#FCBAD3'),
  ('Atividades Agrícolas', '#A8E6CF'),
  ('Habilidades Profissionais', '#FFD93D')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CATEGORIAS DE TRANSAÇÕES FINANCEIRAS
-- =====================================================

INSERT INTO public.transaction_categories (name, type) VALUES
  -- Receitas
  ('Mensalidades', 'income'),
  ('Doações', 'income'),
  ('Eventos', 'income'),
  ('Vendas', 'income'),
  ('Patrocínios', 'income'),
  
  -- Despesas
  ('Material de Consumo', 'expense'),
  ('Uniformes', 'expense'),
  ('Alimentação', 'expense'),
  ('Transporte', 'expense'),
  ('Manutenção', 'expense'),
  ('Eventos e Atividades', 'expense'),
  ('Equipamentos', 'expense'),
  ('Serviços', 'expense'),
  ('Outros', 'expense')
ON CONFLICT DO NOTHING;

-- =====================================================
-- UNIDADES EXEMPLO (OPCIONAL)
-- =====================================================

-- Descomente as linhas abaixo se quiser criar unidades de exemplo
-- INSERT INTO public.units (name, description) VALUES
--   ('Tigres', 'Unidade dos Tigres'),
--   ('Leões', 'Unidade dos Leões'),
--   ('Águias', 'Unidade das Águias'),
--   ('Falcões', 'Unidade dos Falcões')
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- ESPECIALIDADES EXEMPLO (OPCIONAL)
-- =====================================================

-- Descomente as linhas abaixo se quiser criar especialidades de exemplo
-- Primeiro, obtenha os IDs dos tipos de especialidades
-- DO $$
-- DECLARE
--   tipo_ciencia UUID;
--   tipo_natureza UUID;
--   tipo_artes UUID;
-- BEGIN
--   SELECT id INTO tipo_ciencia FROM public.specialty_types WHERE name = 'Ciência e Saúde';
--   SELECT id INTO tipo_natureza FROM public.specialty_types WHERE name = 'Estudo da Natureza';
--   SELECT id INTO tipo_artes FROM public.specialty_types WHERE name = 'Artes e Habilidades Manuais';
--   
--   INSERT INTO public.specialties (name, specialty_type_id, description) VALUES
--     ('Primeiros Socorros', tipo_ciencia, 'Conhecimentos básicos de primeiros socorros'),
--     ('Astronomia', tipo_ciencia, 'Estudo dos astros e constelações'),
--     ('Aves', tipo_natureza, 'Identificação e estudo de aves'),
--     ('Árvores', tipo_natureza, 'Identificação e estudo de árvores'),
--     ('Pintura', tipo_artes, 'Técnicas de pintura artística'),
--     ('Música', tipo_artes, 'Conhecimentos musicais')
--   ON CONFLICT DO NOTHING;
-- END $$;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- 1. O usuário admin inicial deve ser criado via Supabase Auth
-- 2. Após criar o usuário no Auth, adicione o perfil manualmente:
--
-- INSERT INTO public.user_profiles (id, full_name, role) VALUES
--   ('<UUID_DO_USUARIO_AUTH>', 'Administrador', 'admin');
--
-- 3. Para obter o UUID do usuário, acesse o Supabase Dashboard > Authentication > Users
