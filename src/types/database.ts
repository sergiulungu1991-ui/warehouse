export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          brand: string | null
          model: string | null
          quantity: number
          attributes: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          brand?: string | null
          model?: string | null
          quantity?: number
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          brand?: string | null
          model?: string | null
          quantity?: number
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'items_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      item_units: {
        Row: {
          id: string
          item_id: string
          inventory_code: string | null
          serial_number: string | null
          condition: string | null
          status: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          inventory_code?: string | null
          serial_number?: string | null
          condition?: string | null
          status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          inventory_code?: string | null
          serial_number?: string | null
          condition?: string | null
          status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'item_units_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'items'
            referencedColumns: ['id']
          },
        ]
      }
      item_images: {
        Row: {
          id: string
          item_id: string
          url: string
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          url: string
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          url?: string
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'item_images_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'items'
            referencedColumns: ['id']
          },
        ]
      }
      rentals: {
        Row: {
          id: string
          renter_name: string
          renter_phone: string | null
          renter_email: string | null
          rented_at: string
          expected_return_at: string | null
          returned_at: string | null
          status: 'Active' | 'Overdue' | 'Canceled' | 'Returned'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          renter_name: string
          renter_phone?: string | null
          renter_email?: string | null
          rented_at?: string
          expected_return_at?: string | null
          returned_at?: string | null
          status?: 'Active' | 'Overdue' | 'Canceled' | 'Returned'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          renter_name?: string
          renter_phone?: string | null
          renter_email?: string | null
          rented_at?: string
          expected_return_at?: string | null
          returned_at?: string | null
          status?: 'Active' | 'Overdue' | 'Canceled' | 'Returned'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      rental_items: {
        Row: {
          id: string
          rental_id: string
          item_id: string
          item_unit_id: string | null
          quantity: number
          returned_quantity: number
          condition_out: string | null
          condition_in: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rental_id: string
          item_id: string
          item_unit_id?: string | null
          quantity?: number
          returned_quantity?: number
          condition_out?: string | null
          condition_in?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rental_id?: string
          item_id?: string
          item_unit_id?: string | null
          quantity?: number
          returned_quantity?: number
          condition_out?: string | null
          condition_in?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rental_items_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rentals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rental_items_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rental_items_item_unit_id_fkey'
            columns: ['item_unit_id']
            isOneToOne: false
            referencedRelation: 'item_units'
            referencedColumns: ['id']
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
