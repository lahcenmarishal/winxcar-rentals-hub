export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agences: {
        Row: {
          adresse: string | null
          created_at: string | null
          email: string | null
          horaires: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          telephone: string | null
          ville: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          horaires?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          telephone?: string | null
          ville: string
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          horaires?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          telephone?: string | null
          ville?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_naissance: string | null
          email: string
          id: string
          nom: string
          permis_date_emission: string | null
          permis_numero: string | null
          prenom: string
          telephone: string
          updated_at: string | null
          user_id: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email: string
          id?: string
          nom: string
          permis_date_emission?: string | null
          permis_numero?: string | null
          prenom: string
          telephone: string
          updated_at?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string
          id?: string
          nom?: string
          permis_date_emission?: string | null
          permis_numero?: string | null
          prenom?: string
          telephone?: string
          updated_at?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      options: {
        Row: {
          created_at: string | null
          description: string | null
          icone: string | null
          id: string
          nom: string
          prix_jour: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          nom: string
          prix_jour: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          nom?: string
          prix_jour?: number
        }
        Relationships: []
      }
      reservations: {
        Row: {
          agence_retour_id: string | null
          agence_retrait_id: string | null
          client_id: string | null
          created_at: string | null
          date_debut: string
          date_fin: string
          heure_retour: string | null
          heure_retrait: string | null
          id: string
          notes: string | null
          numero_reservation: string
          options_ids: string[] | null
          prix_options: number | null
          prix_total: number
          prix_voiture: number
          statut: string
          updated_at: string | null
          voiture_id: string
        }
        Insert: {
          agence_retour_id?: string | null
          agence_retrait_id?: string | null
          client_id?: string | null
          created_at?: string | null
          date_debut: string
          date_fin: string
          heure_retour?: string | null
          heure_retrait?: string | null
          id?: string
          notes?: string | null
          numero_reservation?: string
          options_ids?: string[] | null
          prix_options?: number | null
          prix_total: number
          prix_voiture: number
          statut?: string
          updated_at?: string | null
          voiture_id: string
        }
        Update: {
          agence_retour_id?: string | null
          agence_retrait_id?: string | null
          client_id?: string | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string
          heure_retour?: string | null
          heure_retrait?: string | null
          id?: string
          notes?: string | null
          numero_reservation?: string
          options_ids?: string[] | null
          prix_options?: number | null
          prix_total?: number
          prix_voiture?: number
          statut?: string
          updated_at?: string | null
          voiture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_agence_retour_id_fkey"
            columns: ["agence_retour_id"]
            isOneToOne: false
            referencedRelation: "agences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_agence_retrait_id_fkey"
            columns: ["agence_retrait_id"]
            isOneToOne: false
            referencedRelation: "agences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_voiture_id_fkey"
            columns: ["voiture_id"]
            isOneToOne: false
            referencedRelation: "voitures"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voitures: {
        Row: {
          agence_id: string | null
          boite: string
          caracteristiques: Json | null
          carburant: string
          categorie: string
          climatisation: boolean | null
          created_at: string | null
          description: string | null
          disponible: boolean | null
          id: string
          image_url: string | null
          images: string[] | null
          marque: string
          modele: string
          places: number
          portes: number
          prix_jour: number
          updated_at: string | null
        }
        Insert: {
          agence_id?: string | null
          boite: string
          caracteristiques?: Json | null
          carburant: string
          categorie: string
          climatisation?: boolean | null
          created_at?: string | null
          description?: string | null
          disponible?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          marque: string
          modele: string
          places?: number
          portes?: number
          prix_jour: number
          updated_at?: string | null
        }
        Update: {
          agence_id?: string | null
          boite?: string
          caracteristiques?: Json | null
          carburant?: string
          categorie?: string
          climatisation?: boolean | null
          created_at?: string | null
          description?: string | null
          disponible?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          marque?: string
          modele?: string
          places?: number
          portes?: number
          prix_jour?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voitures_agence_id_fkey"
            columns: ["agence_id"]
            isOneToOne: false
            referencedRelation: "agences"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_voiture_disponibilite: {
        Args: {
          p_date_debut: string
          p_date_fin: string
          p_exclude_reservation_id?: string
          p_voiture_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
