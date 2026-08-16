import { Database } from './database';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type Item = Database['public']['Tables']['items']['Row'];
export type ItemInsert = Database['public']['Tables']['items']['Insert'];
export type ItemUpdate = Database['public']['Tables']['items']['Update'];

export type ItemUnit = Database['public']['Tables']['item_units']['Row'];
export type ItemUnitInsert = Database['public']['Tables']['item_units']['Insert'];
export type ItemUnitUpdate = Database['public']['Tables']['item_units']['Update'];

export type ItemImage = Database['public']['Tables']['item_images']['Row'];
export type ItemImageInsert = Database['public']['Tables']['item_images']['Insert'];
export type ItemImageUpdate = Database['public']['Tables']['item_images']['Update'];

export type Rental = Database['public']['Tables']['rentals']['Row'];
export type RentalInsert = Database['public']['Tables']['rentals']['Insert'];
export type RentalUpdate = Database['public']['Tables']['rentals']['Update'];

export type RentalItem = Database['public']['Tables']['rental_items']['Row'];
export type RentalItemInsert = Database['public']['Tables']['rental_items']['Insert'];
export type RentalItemUpdate = Database['public']['Tables']['rental_items']['Update'];
