-- Harvey DSS Schema for Supabase

-- 1. Users (P3A leaders / PPL)
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text unique,
  created_at timestamptz default now()
);

-- 2. Fields (lahan/plot master data)
create table if not exists fields (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  name text not null,
  area_hectares decimal(6,2) not null,
  crop_type text not null,
  variety text,
  plant_date date not null,
  soil_type text,
  latitude decimal(9,6),
  longitude decimal(9,6),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Crop phases (calculated from plant_date + crop cycle)
create table if not exists crop_phases (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  phase text check (phase in ('vegetatif', 'generatif', 'matang', 'panen')),
  week_number int,
  calculated_date date,
  created_at timestamptz default now()
);

-- 4. Weather data (from OpenWeatherMap)
create table if not exists weather_data (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  rainfall_mm decimal(6,2),
  temperature_c decimal(5,2),
  humidity_percent int,
  wind_speed decimal(6,2),
  recorded_at timestamptz default now()
);

-- 5. Field observations (manual PPL input)
create table if not exists field_observations (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  is_dry boolean default false,
  soil_cracks boolean default false,
  wilt_symptoms boolean default false,
  water_available boolean,
  notes text,
  observed_at timestamptz default now()
);

-- 6. Risk scores (calculated daily)
create table if not exists risk_scores (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  score decimal(3,2) check (score >= 0 and score <= 1),
  weather_component decimal(3,2),
  phase_component decimal(3,2),
  soil_component decimal(3,2),
  observation_component decimal(3,2),
  calculated_at timestamptz default now()
);

-- 7. Priority rankings (daily output)
create table if not exists priority_rankings (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  rank int,
  risk_score_id uuid references risk_scores(id),
  created_at date default current_date
);

-- 8. Recommendations
create table if not exists recommendations (
  id uuid default gen_random_uuid() primary key,
  field_id uuid references fields(id) on delete cascade,
  priority_rank int,
  recommended_action text,
  reason text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_fields_user on fields(user_id);
create index if not exists idx_crop_phases_field on crop_phases(field_id);
create index if not exists idx_weather_field on weather_data(field_id);
create index if not exists idx_risk_field on risk_scores(field_id);
create index if not exists idx_rankings_field_date on priority_rankings(field_id, created_at);
