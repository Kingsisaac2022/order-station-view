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
      drivers: {
        Row: {
          assigned_truck_id: string | null
          created_at: string
          email: string
          id: string
          last_trip: string | null
          license_no: string
          name: string
          notes: string | null
          phone_number: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_truck_id?: string | null
          created_at?: string
          email: string
          id?: string
          last_trip?: string | null
          license_no: string
          name: string
          notes?: string | null
          phone_number: string
          status: string
          updated_at?: string
        }
        Update: {
          assigned_truck_id?: string | null
          created_at?: string
          email?: string
          id?: string
          last_trip?: string | null
          license_no?: string
          name?: string
          notes?: string | null
          phone_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_driver_truck"
            columns: ["assigned_truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_info: {
        Row: {
          created_at: string
          id: string
          message: string
          purchase_order_id: string
          timestamp: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          purchase_order_id: string
          timestamp?: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          purchase_order_id?: string
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_info_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      location_updates: {
        Row: {
          created_at: string
          id: string
          location: unknown
          purchase_order_id: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: unknown
          purchase_order_id: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: unknown
          purchase_order_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_updates_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          amount_paid: string
          assigned_truck_id: string | null
          authorized_by: string
          authorized_company: string
          authorized_position: string
          bank_name: string
          created_at: string
          current_location: unknown | null
          date: string
          delivery_date: string | null
          depot_location: string
          depot_manager: string
          destination: string
          destination_coords: unknown | null
          driver_id: string | null
          expected_loading_date: string
          id: string
          loading_location: string
          notes: string | null
          origin: unknown | null
          payment_date: string
          payment_reference: string
          payment_type: string
          po_number: string
          price_per_litre: string
          product_type: string
          quantity: string
          status: string
          total_amount: string
          transport_company: string | null
          truck_plate_number: string | null
          updated_at: string
          volume_at_delivery: string | null
          volume_at_loading: string | null
        }
        Insert: {
          amount_paid: string
          assigned_truck_id?: string | null
          authorized_by: string
          authorized_company: string
          authorized_position: string
          bank_name: string
          created_at?: string
          current_location?: unknown | null
          date: string
          delivery_date?: string | null
          depot_location: string
          depot_manager: string
          destination: string
          destination_coords?: unknown | null
          driver_id?: string | null
          expected_loading_date: string
          id?: string
          loading_location: string
          notes?: string | null
          origin?: unknown | null
          payment_date: string
          payment_reference: string
          payment_type: string
          po_number: string
          price_per_litre: string
          product_type: string
          quantity: string
          status: string
          total_amount: string
          transport_company?: string | null
          truck_plate_number?: string | null
          updated_at?: string
          volume_at_delivery?: string | null
          volume_at_loading?: string | null
        }
        Update: {
          amount_paid?: string
          assigned_truck_id?: string | null
          authorized_by?: string
          authorized_company?: string
          authorized_position?: string
          bank_name?: string
          created_at?: string
          current_location?: unknown | null
          date?: string
          delivery_date?: string | null
          depot_location?: string
          depot_manager?: string
          destination?: string
          destination_coords?: unknown | null
          driver_id?: string | null
          expected_loading_date?: string
          id?: string
          loading_location?: string
          notes?: string | null
          origin?: unknown | null
          payment_date?: string
          payment_reference?: string
          payment_type?: string
          po_number?: string
          price_per_litre?: string
          product_type?: string
          quantity?: string
          status?: string
          total_amount?: string
          transport_company?: string | null
          truck_plate_number?: string | null
          updated_at?: string
          volume_at_delivery?: string | null
          volume_at_loading?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_truck"
            columns: ["assigned_truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          assigned_driver_id: string | null
          capacity: string
          created_at: string
          current_location: unknown | null
          fuel_capacity: string
          fuel_level: number | null
          gps_enabled: boolean
          gps_id: string | null
          id: string
          last_maintenance: string | null
          model: string
          notes: string | null
          plate_no: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_driver_id?: string | null
          capacity: string
          created_at?: string
          current_location?: unknown | null
          fuel_capacity: string
          fuel_level?: number | null
          gps_enabled?: boolean
          gps_id?: string | null
          id?: string
          last_maintenance?: string | null
          model: string
          notes?: string | null
          plate_no: string
          status: string
          updated_at?: string
        }
        Update: {
          assigned_driver_id?: string | null
          capacity?: string
          created_at?: string
          current_location?: unknown | null
          fuel_capacity?: string
          fuel_level?: number | null
          gps_enabled?: boolean
          gps_id?: string | null
          id?: string
          last_maintenance?: string | null
          model?: string
          notes?: string | null
          plate_no?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_truck_driver"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
