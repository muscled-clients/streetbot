-- Step 1: Add geography column to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS location geography(POINT, 4326);

-- Step 2: Populate location from existing lat/lng coordinates
UPDATE services 
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL 
  AND longitude IS NOT NULL
  AND location IS NULL;

-- Step 3: Create spatial index for fast location queries
CREATE INDEX IF NOT EXISTS idx_services_location 
ON services USING GIST(location);

-- Step 4: Create function for location-based search
CREATE OR REPLACE FUNCTION search_services_by_location(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters INTEGER DEFAULT 5000,
    max_results INTEGER DEFAULT 20,
    filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    category TEXT,
    description TEXT,
    address_street TEXT,
    address_city TEXT,
    phone TEXT,
    website TEXT,
    distance_meters DOUBLE PRECISION,
    distance_km TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.category,
        s.description,
        s.address_street,
        s.address_city,
        s.phone,
        s.website,
        ST_Distance(
            s.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) as distance_meters,
        ROUND(ST_Distance(
            s.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) / 1000, 2)::TEXT || ' km' as distance_km
    FROM services s
    WHERE 
        s.location IS NOT NULL
        AND ST_DWithin(
            s.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
            radius_meters
        )
        AND (filter_category IS NULL OR s.category = filter_category)
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

-- Step 5: Test the function with Queen and Bloor coordinates
-- This should return services within 5km of Queen and Bloor
SELECT * FROM search_services_by_location(
    43.6436,  -- Queen and Bloor latitude
    -79.4256, -- Queen and Bloor longitude
    5000,     -- 5km radius
    10        -- top 10 results
);

-- Step 6: Create a view for Toronto services with valid coordinates
CREATE OR REPLACE VIEW toronto_services_with_location AS
SELECT 
    id,
    title,
    category,
    address_city,
    latitude,
    longitude,
    location
FROM services
WHERE location IS NOT NULL
  AND (LOWER(address_city) LIKE '%toronto%' 
       OR address_city IS NULL);

-- Step 7: Check how many services have valid locations
SELECT 
    COUNT(*) as total_services,
    COUNT(location) as services_with_location,
    COUNT(*) - COUNT(location) as services_without_location,
    ROUND(COUNT(location)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as percentage_with_location
FROM services;