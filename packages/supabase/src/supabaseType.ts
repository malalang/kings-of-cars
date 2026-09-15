export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, string>;
    Functions: Record<string, never>;
    Views: Record<string, never>;
    Tables: {
      KingsOfCars_vehicles: {
        Row: {
          id: string;
          stock_number: string | null;
          slug: string;
          make: string;
          model: string;
          variant: string | null;
          year: number | null;
          mileage: number | null;
          price: number | null;
          monthly_payment: number | null;
          body_type: string | null;
          transmission: string | null;
          fuel_type: string | null;
          colour: string | null;
          engine_size: string | null;
          power_kw: number | null;
          description: string | null;
          overview: string | null;
          features: string[];
          health_check: Json;
          image_url: string | null;
          gallery_urls: string[];
          status: string;
          featured: boolean;
          source_url: string | null;
          source_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stock_number?: string | null;
          slug: string;
          make: string;
          model: string;
          variant?: string | null;
          year?: number | null;
          mileage?: number | null;
          price?: number | null;
          monthly_payment?: number | null;
          body_type?: string | null;
          transmission?: string | null;
          fuel_type?: string | null;
          colour?: string | null;
          engine_size?: string | null;
          power_kw?: number | null;
          description?: string | null;
          overview?: string | null;
          features?: string[];
          health_check?: Json;
          image_url?: string | null;
          gallery_urls?: string[];
          status?: string;
          featured?: boolean;
          source_url?: string | null;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_vehicles"]["Row"]
        >;
        Relationships: [];
      };
      KingsOfCars_vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          image_url: string;
          sort_order: number;
          is_primary: boolean;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          image_url: string;
          sort_order?: number;
          is_primary?: boolean;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_vehicle_images"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_vehicle_images_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_leads: {
        Row: {
          id: string;
          vehicle_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          message: string | null;
          source: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_leads"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_finance_applications: {
        Row: {
          id: string;
          vehicle_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          employment_status: string | null;
          gross_income: number | null;
          deposit: number | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          employment_status?: string | null;
          gross_income?: number | null;
          deposit?: number | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_finance_applications"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_finance_applications_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      KingsOfCars_testimonials: {
        Row: {
          id: string;
          author: string;
          rating: number;
          content: string;
          published: boolean;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      KingsOfCars_branches: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          province: string | null;
          phone: string | null;
          email: string | null;
          latitude: number | null;
          longitude: number | null;
          opening_hours: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
  };
};
