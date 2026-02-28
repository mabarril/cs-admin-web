// =====================================================
// MÓDULO ADMINISTRATIVO — Interfaces alinhadas ao schema Supabase
// =====================================================

// ----------------------
// PATRIMÔNIO (assets)
// ----------------------

export const ASSET_CATEGORIES = ['Acampamento', 'Cozinha', 'Escritório', 'Uniformes', 'Materiais Esportivos', 'Banda/Fanfarra', 'Ferramentas'] as const;
export type AssetCategory = typeof ASSET_CATEGORIES[number];

export const ASSET_LOCATIONS = ['Sede (Igreja)', 'Almoxarifado', 'Com um membro (Empréstimo)'] as const;
export type AssetLocation = typeof ASSET_LOCATIONS[number];

export type AssetStatus = 'active' | 'maintenance' | 'inactive' | 'disposed';

export interface Asset {
  id?: string;
  asset_code: string;
  name: string;
  description?: string;
  category?: AssetCategory;
  acquisition_date?: string;       // DATE → ISO string
  acquisition_value?: number;
  current_value?: number;
  status?: AssetStatus;
  location?: AssetLocation;
  responsible_id?: string;         // FK → user_profiles.id
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  active: 'Ativo',
  maintenance: 'Em manutenção',
  inactive: 'Inativo',
  disposed: 'Descartado',
};

// ----------------------
// ATAS (minutes)
// ----------------------

export const MEETING_TYPES = ['Reunião Regular (Clube)', 'Reunião de Diretoria', 'Reunião de Pais e Responsáveis', 'Comissão Disciplinar', 'Comissão Extraordinária'] as const;
export type MeetingType = typeof MEETING_TYPES[number];

export interface Ata {
  id?: string;
  meeting_number: number;
  meeting_date: string;            // DATE → ISO string
  meeting_type?: MeetingType;
  title: string;
  content: string;
  attendees?: string[];            // TEXT[]
  created_by?: string;             // FK → user_profiles.id
  created_at?: string;
  updated_at?: string;
}

// ----------------------
// ATOS (acts)
// ----------------------

export const ACT_TYPES = ['Admissão em Lenço', 'Investidura de Classe', 'Investidura de Especialidade', 'Nomeação de Cargo', 'Medida Disciplinar', 'Transferência', 'Exclusão'] as const;
export type ActType = typeof ACT_TYPES[number];

export interface Ato {
  id?: string;
  act_number: number;
  act_date: string;                // DATE → ISO string
  act_type?: ActType;
  title: string;
  content: string;
  created_by?: string;             // FK → user_profiles.id
  created_at?: string;
  updated_at?: string;
}

// ----------------------
// AUTORIZAÇÕES DE SAÍDA (exit_authorizations)
// ----------------------

export interface Autorizacao {
  id?: string;
  pathfinder_id?: string;          // FK → pathfinders.id
  pathfinder_name?: string;        // join field — não existe na tabela
  event_name: string;
  event_date: string;              // DATE → ISO string
  departure_time?: string;         // TIME → string HH:mm
  return_time?: string;            // TIME → string HH:mm
  destination?: string;
  responsible_person?: string;
  authorized_by?: string;
  authorization_date?: string;     // DATE → ISO string
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
