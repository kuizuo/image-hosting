export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          is_complete: boolean
          created_at: string | null
          id: number
          task: string
          user_id: string
        }
        Insert: {
          is_complete: boolean
          created_at?: string | null
          id?: number
          task: string
          user_id: string
        }
        Update: {
          is_complete?: boolean
          created_at?: string | null
          id?: number
          task?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
