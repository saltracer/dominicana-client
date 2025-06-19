export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          content: string
          content_type: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          media_attachments: Json | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          tags: Json | null
          title: string
          updated_at: string
          word_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          content: string
          content_type?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          media_attachments?: Json | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: Json | null
          title: string
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          content?: string
          content_type?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          media_attachments?: Json | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: Json | null
          title?: string
          updated_at?: string
          word_count?: number | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          category: Database["public"]["Enums"]["book_category"]
          cover_image: string | null
          created_at: string
          description: string
          epub_path: string | null
          epub_sample_path: string | null
          id: number
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          author: string
          category: Database["public"]["Enums"]["book_category"]
          cover_image?: string | null
          created_at?: string
          description: string
          epub_path?: string | null
          epub_sample_path?: string | null
          id?: number
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          author?: string
          category?: Database["public"]["Enums"]["book_category"]
          cover_image?: string | null
          created_at?: string
          description?: string
          epub_path?: string | null
          epub_sample_path?: string | null
          id?: number
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      daily_offices: {
        Row: {
          alternative_celebrations: Json | null
          celebration_id: string
          component_overrides: Json | null
          created_at: string
          date: string
          id: string
          templates: Json
          updated_at: string
        }
        Insert: {
          alternative_celebrations?: Json | null
          celebration_id: string
          component_overrides?: Json | null
          created_at?: string
          date: string
          id?: string
          templates: Json
          updated_at?: string
        }
        Update: {
          alternative_celebrations?: Json | null
          celebration_id?: string
          component_overrides?: Json | null
          created_at?: string
          date?: string
          id?: string
          templates?: Json
          updated_at?: string
        }
        Relationships: []
      }
      liturgy_components: {
        Row: {
          antiphon: string | null
          author: string | null
          citation: string | null
          content: Json
          created_at: string
          has_gloria: boolean | null
          id: string
          language: string
          liturgical_use: Database["public"]["Enums"]["liturgical_use_type"]
          meter: string | null
          psalm_number: number | null
          rank: number | null
          rubrics: string | null
          title: string | null
          type: Database["public"]["Enums"]["liturgy_component_type"]
          updated_at: string
        }
        Insert: {
          antiphon?: string | null
          author?: string | null
          citation?: string | null
          content: Json
          created_at?: string
          has_gloria?: boolean | null
          id?: string
          language?: string
          liturgical_use: Database["public"]["Enums"]["liturgical_use_type"]
          meter?: string | null
          psalm_number?: number | null
          rank?: number | null
          rubrics?: string | null
          title?: string | null
          type: Database["public"]["Enums"]["liturgy_component_type"]
          updated_at?: string
        }
        Update: {
          antiphon?: string | null
          author?: string | null
          citation?: string | null
          content?: Json
          created_at?: string
          has_gloria?: boolean | null
          id?: string
          language?: string
          liturgical_use?: Database["public"]["Enums"]["liturgical_use_type"]
          meter?: string | null
          psalm_number?: number | null
          rank?: number | null
          rubrics?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["liturgy_component_type"]
          updated_at?: string
        }
        Relationships: []
      }
      liturgy_templates: {
        Row: {
          components: Json
          created_at: string
          hour: string
          id: string
          name: string
          rank: string
          season_overrides: Json | null
          updated_at: string
        }
        Insert: {
          components: Json
          created_at?: string
          hour: string
          id?: string
          name: string
          rank: string
          season_overrides?: Json | null
          updated_at?: string
        }
        Update: {
          components?: Json
          created_at?: string
          hour?: string
          id?: string
          name?: string
          rank?: string
          season_overrides?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_liturgy_preferences: {
        Row: {
          audio_enabled: boolean | null
          audio_types: Json | null
          bible_translation: string | null
          calendar_type: string
          chant_notation: string | null
          chant_notation_enabled: boolean | null
          created_at: string
          display_mode: string | null
          display_options: Json
          font_size: string | null
          language: string
          memorial_preference: string
          primary_language: string | null
          secondary_language: string | null
          show_rubrics: boolean | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_enabled?: boolean | null
          audio_types?: Json | null
          bible_translation?: string | null
          calendar_type?: string
          chant_notation?: string | null
          chant_notation_enabled?: boolean | null
          created_at?: string
          display_mode?: string | null
          display_options?: Json
          font_size?: string | null
          language?: string
          memorial_preference?: string
          primary_language?: string | null
          secondary_language?: string | null
          show_rubrics?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_enabled?: boolean | null
          audio_types?: Json | null
          bible_translation?: string | null
          calendar_type?: string
          chant_notation?: string | null
          chant_notation_enabled?: boolean | null
          created_at?: string
          display_mode?: string | null
          display_options?: Json
          font_size?: string | null
          language?: string
          memorial_preference?: string
          primary_language?: string | null
          secondary_language?: string | null
          show_rubrics?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      migrate_initial_books: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      blog_post_status: "draft" | "published" | "archived"
      book_category:
        | "Theology"
        | "Philosophy"
        | "Spiritual"
        | "Mysticism"
        | "Science"
        | "Natural History"
      liturgical_use_type:
        | "ordinary"
        | "proper_of_seasons"
        | "proper_of_saints"
        | "common_of_saints"
        | "special"
      liturgy_component_type:
        | "invitatory"
        | "hymn"
        | "antiphon"
        | "psalm"
        | "canticle"
        | "reading"
        | "responsory"
        | "gospel_canticle"
        | "intercessions"
        | "concluding_prayer"
        | "blessing"
      user_role: "free" | "authenticated" | "subscribed" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_post_status: ["draft", "published", "archived"],
      book_category: [
        "Theology",
        "Philosophy",
        "Spiritual",
        "Mysticism",
        "Science",
        "Natural History",
      ],
      liturgical_use_type: [
        "ordinary",
        "proper_of_seasons",
        "proper_of_saints",
        "common_of_saints",
        "special",
      ],
      liturgy_component_type: [
        "invitatory",
        "hymn",
        "antiphon",
        "psalm",
        "canticle",
        "reading",
        "responsory",
        "gospel_canticle",
        "intercessions",
        "concluding_prayer",
        "blessing",
      ],
      user_role: ["free", "authenticated", "subscribed", "admin"],
    },
  },
} as const
