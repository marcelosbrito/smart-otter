export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          clerk_id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          clerk_id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          clerk_id?: string;
          email?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: number;
          user_id: string;
          profession: string;
          resource_name: string;
          resource_url: string;
          category: string;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          profession: string;
          resource_name: string;
          resource_url: string;
          category: string;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          profession?: string;
          resource_name?: string;
          resource_url?: string;
          category?: string;
          explanation?: string | null;
          created_at?: string;
        };
      };
      knowledge_cache: {
        Row: {
          query_key: string;
          response: Json;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          query_key: string;
          response: Json;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          query_key?: string;
          response?: Json;
          created_at?: string;
          expires_at?: string;
        };
      };
    };
  };
}
