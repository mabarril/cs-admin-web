-- =====================================================
-- 2. ALTERAÇÕES PARA AUTO-INCREMENTO (Atas, Atos, Patrimônio)
-- =====================================================

-- =====================================================
-- 1. ATAS (minutes) - Auto incremento
-- =====================================================
-- A tabela minutes já possui dados? Se sim, precisamos lidar com isso.
-- Vamos alterar as colunas para usarem IDENTITY
-- Como o schema foi recentemente criado, o mais seguro é criar uma SEQUENCE.

-- Criando a sequence para minutes (caso não seja identity nativo)
CREATE SEQUENCE IF NOT EXISTS minutes_meeting_number_seq;

-- Atrelar a sequence à coluna existente
ALTER TABLE public.minutes
    ALTER COLUMN meeting_number SET DEFAULT nextval('minutes_meeting_number_seq');

-- =====================================================
-- 2. ATOS (acts) - Auto incremento
-- =====================================================

CREATE SEQUENCE IF NOT EXISTS acts_act_number_seq;

ALTER TABLE public.acts
    ALTER COLUMN act_number SET DEFAULT nextval('acts_act_number_seq');

-- =====================================================
-- 3. PATRIMÔNIO (assets) - Máscara Auto-incremental (PAT-XXXX)
-- =====================================================

-- Criar a sequência que gera o número (0001, 0002, etc)
CREATE SEQUENCE IF NOT EXISTS asset_code_seq START 1;

-- Criar a função que aplica o formato PAT-XXXX
CREATE OR REPLACE FUNCTION generate_asset_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o asset_code for nulo ou vazio no momento do insert, nós geramos
    IF NEW.asset_code IS NULL OR NEW.asset_code = '' THEN
        NEW.asset_code := 'PAT-' || LPAD(nextval('asset_code_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- O asset_code na tabela é REQUIRED, então a constraint DEFAULT pode não bastar para strings dinâmicas.
-- Vamos remover a obrigatoriedade (pois a trigger vai preencher).
-- O NOT NULL pode se manter contanto que a trigger dispare ANTES do insert.

-- Deletar a trigger se ela existir para evitar erros
DROP TRIGGER IF EXISTS set_asset_code_trigger ON public.assets;

-- Criar a trigger BEFORE INSERT
CREATE TRIGGER set_asset_code_trigger
BEFORE INSERT ON public.assets
FOR EACH ROW
EXECUTE FUNCTION generate_asset_code();
