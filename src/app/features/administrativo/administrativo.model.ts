// =====================================================
// MÓDULO ADMINISTRATIVO — Interfaces alinhadas ao schema Supabase
// =====================================================

// ----------------------
// PATRIMÔNIO (assets)
// ----------------------

export type AssetStatus = 'active' | 'maintenance' | 'inactive' | 'disposed';

export interface Asset {
  id?: string;
  asset_code: string;
  name: string;
  description?: string;
  category?: string;
  acquisition_date?: string;       // DATE → ISO string
  acquisition_value?: number;
  current_value?: number;
  status?: AssetStatus;
  location?: string;
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

export interface Ata {
  id?: string;
  meeting_number: number;
  meeting_date: string;            // DATE → ISO string
  meeting_type?: string;
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

export interface Ato {
  id?: string;
  act_number: number;
  act_date: string;                // DATE → ISO string
  act_type?: string;
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
