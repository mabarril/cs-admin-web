-- =====================================================
-- TRIGGER DE AUTENTICAÇÃO
-- =====================================================
-- Versão: 1.0.0
-- Descrição: Function e Trigger para criar o user_profile após o signUp
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário Sem Nome'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'counselor'), -- papel padrão se não especificado
    false -- O sistema exige que o Admin ative o usuário explicitamente
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove a trigger anterior caso exista (Idempotência)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria a trigger conectando auth.users com a função handle_new_user()
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
