-- Enable RLS on every application table
alter table categories enable row level security;
alter table items enable row level security;
alter table item_images enable row level security;
alter table item_units enable row level security;
alter table rentals enable row level security;
alter table rental_items enable row level security;

-- Categories: any authenticated user can CRUD
create policy "Allow all to authenticated users"
  on categories
  for all
  to authenticated
  using (true)
  with check (true);

-- Items: any authenticated user can CRUD
-- This also cascades to storage references through the application code

create policy "Allow all to authenticated users"
  on items
  for all
  to authenticated
  using (true)
  with check (true);

-- Item images: any authenticated user can CRUD
create policy "Allow all to authenticated users"
  on item_images
  for all
  to authenticated
  using (true)
  with check (true);

-- Item units: any authenticated user can CRUD
create policy "Allow all to authenticated users"
  on item_units
  for all
  to authenticated
  using (true)
  with check (true);

-- Rentals: any authenticated user can CRUD
create policy "Allow all to authenticated users"
  on rentals
  for all
  to authenticated
  using (true)
  with check (true);

-- Rental items: any authenticated user can CRUD
create policy "Allow all to authenticated users"
  on rental_items
  for all
  to authenticated
  using (true)
  with check (true);

-- Storage policies for item_images bucket (if you use Supabase Storage)
-- Replace 'item-images' with your actual bucket name or remove if you only use ImgBB

create policy "Allow all to authenticated users"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'item-images')
  with check (bucket_id = 'item-images');
