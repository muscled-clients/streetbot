-- Add original_id column to preserve the original service IDs
-- This allows us to use UUIDs as primary keys while keeping reference to original IDs

-- Add the column if it doesn't exist
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS original_id TEXT;

-- Create index for fast lookups by original ID
CREATE INDEX IF NOT EXISTS idx_services_original_id 
ON services(original_id);

-- Optional: Add comment explaining the column
COMMENT ON COLUMN services.original_id IS 'Original service ID from the data source, preserved for reference while using UUID as primary key';