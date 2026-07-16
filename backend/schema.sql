-- Harvey: fields table only

create table if not exists fields (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  area_hectares decimal(6,2),
  latitude decimal(9,6),
  longitude decimal(9,6),
  plant_date date,
  soil_type text,
  crop_type text,
  variety text,
  polygon_points jsonb,
  temp decimal(5,2),
  humidity decimal(5,2),
  wind_speed decimal(6,2),
  rainfall_mm decimal(6,2),
  elevation decimal(7,2),
  description text,
  rainfall30d jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_fields_created on fields(created_at desc);
