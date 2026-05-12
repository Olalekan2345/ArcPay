-- ArcPay Supabase Schema
-- Run this in your Supabase SQL editor: supabase.com → SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations table
create table organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  industry text,
  size text,
  created_at timestamptz default now()
);

-- Profiles (linked to Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  org_id uuid references organizations(id),
  full_name text,
  role text default 'admin',
  wallet_address text,
  created_at timestamptz default now()
);

-- Employees table
create table employees (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  name text not null,
  email text not null,
  role text,
  department text,
  salary_usdc numeric(18,6) not null,
  wallet_address text,
  preferred_currency text default 'USD',
  payment_schedule text default 'Monthly',
  location text,
  status text default 'active' check (status in ('active', 'pending', 'inactive')),
  join_date date default current_date,
  created_at timestamptz default now()
);

-- Payroll runs
create table payroll_runs (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  total_amount_usdc numeric(18,6) not null,
  employee_count integer not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  confidential boolean default true,
  tx_hash text,
  scheduled_date timestamptz,
  executed_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- Individual payroll payments
create table payroll_payments (
  id uuid default uuid_generate_v4() primary key,
  run_id uuid references payroll_runs(id) not null,
  employee_id uuid references employees(id) not null,
  amount_usdc numeric(18,6) not null,
  recipient_wallet text not null,
  status text default 'pending',
  tx_hash text,
  created_at timestamptz default now()
);

-- Treasury transactions
create table treasury_transactions (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  type text not null check (type in ('deposit', 'payroll', 'invoice', 'other')),
  amount_usdc numeric(18,6) not null,
  description text,
  tx_hash text,
  created_at timestamptz default now()
);

-- Invoices
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  client_name text not null,
  amount_usdc numeric(18,6) not null,
  description text,
  status text default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  due_date date,
  issued_date date default current_date,
  tx_hash text,
  created_at timestamptz default now()
);

-- Job postings
create table job_postings (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  title text not null,
  department text,
  type text default 'Full-time',
  location text default 'Remote',
  salary_range text,
  description text,
  status text default 'active' check (status in ('active', 'closed', 'paused')),
  created_at timestamptz default now()
);

-- Row Level Security
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table employees enable row level security;
alter table payroll_runs enable row level security;
alter table payroll_payments enable row level security;
alter table treasury_transactions enable row level security;
alter table invoices enable row level security;
alter table job_postings enable row level security;

-- RLS Policies (users can only see their org's data)
create policy "Users see own profile" on profiles for all using (auth.uid() = id);

create policy "Users see own org employees" on employees for all
  using (org_id in (select org_id from profiles where id = auth.uid()));

create policy "Users see own org payroll" on payroll_runs for all
  using (org_id in (select org_id from profiles where id = auth.uid()));

create policy "Users see own org treasury" on treasury_transactions for all
  using (org_id in (select org_id from profiles where id = auth.uid()));

create policy "Users see own org invoices" on invoices for all
  using (org_id in (select org_id from profiles where id = auth.uid()));

create policy "Users see own org jobs" on job_postings for all
  using (org_id in (select org_id from profiles where id = auth.uid()));

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
