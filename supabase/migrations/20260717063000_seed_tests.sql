-- Seed Departments
INSERT INTO departments (id, name, description) VALUES
  ('11f11403-5182-4416-8326-ab9964ef55da', 'Hematology', 'Blood disorders'),
  ('b5d259c1-4b10-449e-ba63-df621cbeeb7b', 'Biochemistry', 'Chemical processes');

-- Seed Tests
INSERT INTO tests (id, department_id, code, name, sample_type, price, turn_around_time_hours) VALUES
  ('21f11403-5182-4416-8326-ab9964ef55da', '11f11403-5182-4416-8326-ab9964ef55da', 'CBC', 'Complete Blood Count', 'EDTA Blood', 350.00, 24),
  ('31f11403-5182-4416-8326-ab9964ef55db', 'b5d259c1-4b10-449e-ba63-df621cbeeb7b', 'LFT', 'Liver Function Test', 'Serum', 800.00, 24),
  ('41f11403-5182-4416-8326-ab9964ef55dc', 'b5d259c1-4b10-449e-ba63-df621cbeeb7b', 'KFT', 'Kidney Function Test', 'Serum', 750.00, 24),
  ('51f11403-5182-4416-8326-ab9964ef55dd', 'b5d259c1-4b10-449e-ba63-df621cbeeb7b', 'GLU-F', 'Glucose Fasting', 'Fluoride Plasma', 150.00, 12);
