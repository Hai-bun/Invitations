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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      event_locations: {
        Row: {
          address: string
          created_at: string
          event_title: string
          google_map_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          address?: string
          created_at?: string
          event_title?: string
          google_map_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          address?: string
          created_at?: string
          event_title?: string
          google_map_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_locations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_invitations: {
        Row: {
          blessing_message: string | null
          created_at: string
          guest_name: string
          id: string
          invitation_status: Database["public"]["Enums"]["invitation_status"]
          invitation_token: string
          rsvp_status: Database["public"]["Enums"]["rsvp_status"]
          rsvp_submitted_at: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          blessing_message?: string | null
          created_at?: string
          guest_name: string
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invitation_token?: string
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          rsvp_submitted_at?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          blessing_message?: string | null
          created_at?: string
          guest_name?: string
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invitation_token?: string
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          rsvp_submitted_at?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_invitations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_gallery: {
        Row: {
          display_order: number
          id: string
          image_url: string
          uploaded_at: string
          wedding_id: string
        }
        Insert: {
          display_order?: number
          id?: string
          image_url: string
          uploaded_at?: string
          wedding_id: string
        }
        Update: {
          display_order?: number
          id?: string
          image_url?: string
          uploaded_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_gallery_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wedding_gifts: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          khqr_image_url: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          khqr_image_url?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          khqr_image_url?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: true
            referencedRelation: "wedding_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_profiles: {
        Row: {
          accent_color: string | null
          background_image_url: string | null
          body_font: string | null
          bride_name: string
          bride_parent_names: string | null
          created_at: string
          groom_name: string
          groom_parent_names: string | null
          heading_font: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
          show_countdown: boolean | null
          theme: string
          updated_at: string
          user_id: string | null
          wedding_date_time: string
        }
        Insert: {
          accent_color?: string | null
          background_image_url?: string | null
          body_font?: string | null
          bride_name?: string
          bride_parent_names?: string | null
          created_at?: string
          groom_name?: string
          groom_parent_names?: string | null
          heading_font?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_countdown?: boolean | null
          theme?: string
          updated_at?: string
          user_id?: string | null
          wedding_date_time?: string
        }
        Update: {
          accent_color?: string | null
          background_image_url?: string | null
          body_font?: string | null
          bride_name?: string
          bride_parent_names?: string | null
          created_at?: string
          groom_name?: string
          groom_parent_names?: string | null
          heading_font?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_countdown?: boolean | null
          theme?: string
          updated_at?: string
          user_id?: string | null
          wedding_date_time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      invitation_status: "sent" | "opened" | "not_opened"
      rsvp_status: "pending" | "attending" | "not_attending"
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
      invitation_status: ["sent", "opened", "not_opened"],
      rsvp_status: ["pending", "attending", "not_attending"],
    },
  },
} as const
