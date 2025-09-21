-- Hacer el campo schedule opcional en la tabla workshops
ALTER TABLE workshops ALTER COLUMN schedule DROP NOT NULL;