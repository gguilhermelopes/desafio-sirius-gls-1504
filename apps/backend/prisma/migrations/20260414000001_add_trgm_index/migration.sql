CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_process_number_trgm ON "Process" USING gin (number public.gin_trgm_ops);
