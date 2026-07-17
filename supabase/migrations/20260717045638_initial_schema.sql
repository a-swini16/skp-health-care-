-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'receptionist', 'technician', 'pathologist', 'doctor', 'patient', 'collection_center');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE order_status AS ENUM ('pending', 'partial', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');
CREATE TYPE sample_status AS ENUM ('pending_collection', 'collected', 'received', 'processing', 'completed', 'rejected', 'retest');
CREATE TYPE report_status AS ENUM ('pending', 'draft', 'ready_for_approval', 'approved', 'published');

-- 1. USERS (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'patient',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uhid TEXT UNIQUE NOT NULL, -- Unique Health Identification Number (e.g., SKP202600001)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender gender NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  blood_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTORS (Referrals)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  clinic_name TEXT,
  phone TEXT,
  email TEXT,
  commission_percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DEPARTMENTS (e.g. Hematology, Biochemistry)
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTS (Master Test List)
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL, -- e.g. CBC, LFT
  name TEXT NOT NULL,
  method TEXT, -- e.g. "Automated Cell Counter"
  sample_type TEXT NOT NULL, -- e.g. "EDTA Blood", "Serum"
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  turn_around_time_hours INTEGER DEFAULT 24,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEST PARAMETERS (e.g. Hemoglobin, RBC inside CBC)
CREATE TABLE public.test_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT,
  reference_range_male TEXT,
  reference_range_female TEXT,
  min_critical_value NUMERIC,
  max_critical_value NUMERIC,
  display_order INTEGER DEFAULT 0,
  is_numeric BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TEST PACKAGES
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapping Tests to Packages
CREATE TABLE public.package_tests (
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, test_id)
);

-- 8. ORDERS (Billing and Invoices)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- e.g., ORD-2026-0001
  patient_id UUID REFERENCES public.patients(id) ON DELETE RESTRICT NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL, -- Referral
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  order_status order_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Receptionist/Admin
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE SET NULL, -- Null if package
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL, -- Null if individual test
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (test_id IS NOT NULL OR package_id IS NOT NULL)
);

-- 10. SAMPLES (Barcode Tracking)
CREATE TABLE public.samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  barcode TEXT UNIQUE NOT NULL,
  sample_type TEXT NOT NULL, -- e.g., "EDTA Blood"
  status sample_status NOT NULL DEFAULT 'pending_collection',
  collected_at TIMESTAMPTZ,
  collected_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  received_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample to Order Items Mapping (Which tests belong to this tube/sample)
CREATE TABLE public.sample_order_items (
  sample_id UUID REFERENCES public.samples(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  PRIMARY KEY (sample_id, order_item_id)
);

-- 11. RESULTS (Test values entered by Technician/Machine)
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  parameter_id UUID REFERENCES public.test_parameters(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  is_critical BOOLEAN DEFAULT FALSE,
  entered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  machine_id TEXT -- For future integration with lab machines
);

-- 12. REPORTS (Final PDF Data & Approval)
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE RESTRICT NOT NULL, -- One report per department usually
  status report_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Pathologist
  approved_at TIMESTAMPTZ,
  pdf_url TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_patients_uhid ON public.patients(uhid);
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_orders_patient_id ON public.orders(patient_id);
CREATE INDEX idx_samples_barcode ON public.samples(barcode);
CREATE INDEX idx_results_order_id ON public.results(order_id);
CREATE INDEX idx_reports_order_id ON public.reports(order_id);

-- RLS Boilerplate (Policies to be refined later)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
