-- Seed parameters for CBC (id: 21f11403-5182-4416-8326-ab9964ef55da)
INSERT INTO test_parameters (test_id, name, unit, reference_range_male, reference_range_female, display_order) VALUES
  ('21f11403-5182-4416-8326-ab9964ef55da', 'Hemoglobin (Hb)', 'g/dL', '13.0 - 17.0', '12.0 - 15.0', 1),
  ('21f11403-5182-4416-8326-ab9964ef55da', 'Total RBC Count', 'mill/cumm', '4.5 - 5.5', '4.0 - 5.0', 2),
  ('21f11403-5182-4416-8326-ab9964ef55da', 'Total WBC Count', 'cells/cumm', '4000 - 11000', '4000 - 11000', 3),
  ('21f11403-5182-4416-8326-ab9964ef55da', 'Platelet Count', 'lacs/cumm', '1.5 - 4.5', '1.5 - 4.5', 4);

-- Seed parameters for LFT (id: 31f11403-5182-4416-8326-ab9964ef55db)
INSERT INTO test_parameters (test_id, name, unit, reference_range_male, reference_range_female, display_order) VALUES
  ('31f11403-5182-4416-8326-ab9964ef55db', 'Bilirubin Total', 'mg/dL', '0.2 - 1.2', '0.2 - 1.2', 1),
  ('31f11403-5182-4416-8326-ab9964ef55db', 'SGPT (ALT)', 'U/L', '0 - 40', '0 - 40', 2),
  ('31f11403-5182-4416-8326-ab9964ef55db', 'SGOT (AST)', 'U/L', '0 - 37', '0 - 37', 3);
