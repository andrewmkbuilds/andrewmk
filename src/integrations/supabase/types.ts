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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          archived: boolean
          author: string
          author_id: string | null
          canonical_url: string | null
          category: string
          content: string
          cover_image: string | null
          cover_image_alt: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          og_image: string | null
          published: boolean
          published_at: string | null
          reading_minutes: number
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          author?: string
          author_id?: string | null
          canonical_url?: string | null
          category?: string
          content?: string
          cover_image?: string | null
          cover_image_alt?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          og_image?: string | null
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          author?: string
          author_id?: string | null
          canonical_url?: string | null
          category?: string
          content?: string
          cover_image?: string | null
          cover_image_alt?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          og_image?: string | null
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_note: string | null
          client_hash: string | null
          created_at: string
          delivery_error: string | null
          delivery_status: string
          email: string
          handled_at: string | null
          handled_by: string | null
          id: string
          message: string
          name: string
          source_path: string | null
          spam_score: number
          user_agent: string | null
        }
        Insert: {
          admin_note?: string | null
          client_hash?: string | null
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          email: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          message: string
          name: string
          source_path?: string | null
          spam_score?: number
          user_agent?: string | null
        }
        Update: {
          admin_note?: string | null
          client_hash?: string | null
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          email?: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          message?: string
          name?: string
          source_path?: string | null
          spam_score?: number
          user_agent?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string
          caption: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string
          path: string
          size_bytes: number
          title: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt?: string
          caption?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          path: string
          size_bytes?: number
          title?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt?: string
          caption?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          path?: string
          size_bytes?: number
          title?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          archived: boolean
          author_id: string | null
          built: string[]
          canonical_url: string | null
          category: string
          challenges: Json | null
          created_at: string
          demo: string | null
          description: string
          end_date: string | null
          featured: boolean
          featured_image: string | null
          features: string[]
          filters: string[]
          full_description: string
          gallery: Json | null
          github: string | null
          id: string
          image_alt: string | null
          images: Json
          learned: string | null
          live: string | null
          metrics: Json | null
          name: string
          og_image: string | null
          platform: string | null
          previously: string | null
          problem: string | null
          process: string | null
          published: boolean
          results: Json | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          solution: string | null
          sort_order: number
          stack: Json | null
          start_date: string | null
          status: string
          tech: string[]
          updated_at: string
        }
        Insert: {
          archived?: boolean
          author_id?: string | null
          built?: string[]
          canonical_url?: string | null
          category?: string
          challenges?: Json | null
          created_at?: string
          demo?: string | null
          description?: string
          end_date?: string | null
          featured?: boolean
          featured_image?: string | null
          features?: string[]
          filters?: string[]
          full_description?: string
          gallery?: Json | null
          github?: string | null
          id?: string
          image_alt?: string | null
          images?: Json
          learned?: string | null
          live?: string | null
          metrics?: Json | null
          name: string
          og_image?: string | null
          platform?: string | null
          previously?: string | null
          problem?: string | null
          process?: string | null
          published?: boolean
          results?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          stack?: Json | null
          start_date?: string | null
          status?: string
          tech?: string[]
          updated_at?: string
        }
        Update: {
          archived?: boolean
          author_id?: string | null
          built?: string[]
          canonical_url?: string | null
          category?: string
          challenges?: Json | null
          created_at?: string
          demo?: string | null
          description?: string
          end_date?: string | null
          featured?: boolean
          featured_image?: string | null
          features?: string[]
          filters?: string[]
          full_description?: string
          gallery?: Json | null
          github?: string | null
          id?: string
          image_alt?: string | null
          images?: Json
          learned?: string | null
          live?: string | null
          metrics?: Json | null
          name?: string
          og_image?: string | null
          platform?: string | null
          previously?: string | null
          problem?: string | null
          process?: string | null
          published?: boolean
          results?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          stack?: Json | null
          start_date?: string | null
          status?: string
          tech?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
