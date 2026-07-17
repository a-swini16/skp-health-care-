ALTER TABLE public.results ADD CONSTRAINT results_order_test_param_key UNIQUE (order_id, test_id, parameter_id);
