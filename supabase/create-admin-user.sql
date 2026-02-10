-- Script para criar usuário admin no Supabase
-- Execute este script no SQL Editor do Supabase após criar o usuário via Auth

-- PASSO 1: Criar usuário via Supabase Dashboard
-- 1. Acesse: Authentication → Users → Add user
-- 2. Email: admin@clube.com
-- 3. Password: (defina uma senha segura)
-- 4. Copie o UUID do usuário criado

-- PASSO 2: Execute o comando abaixo substituindo <UUID_DO_USUARIO>
-- pelo UUID copiado no passo anterior

INSERT INTO public.user_profiles (id, full_name, role, active)
VALUES (
  '<UUID_DO_USUARIO>',  -- Substitua pelo UUID do usuário criado
  'Administrador do Sistema',
  'admin',
  true
);

-- PASSO 3: Verificar se o perfil foi criado corretamente
SELECT * FROM public.user_profiles WHERE role = 'admin';

-- OPCIONAL: Criar outros usuários de teste
-- Secretaria
-- INSERT INTO public.user_profiles (id, full_name, role, active)
-- VALUES ('<UUID>', 'Secretário Teste', 'secretary', true);

-- Tesouraria
-- INSERT INTO public.user_profiles (id, full_name, role, active)
-- VALUES ('<UUID>', 'Tesoureiro Teste', 'treasury', true);

-- Conselheiro
-- INSERT INTO public.user_profiles (id, full_name, role, active)
-- VALUES ('<UUID>', 'Conselheiro Teste', 'counselor', true);

-- Diretoria
-- INSERT INTO public.user_profiles (id, full_name, role, active)
-- VALUES ('<UUID>', 'Diretor Teste', 'board', true);
