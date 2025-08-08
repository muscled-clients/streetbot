-- Drop the old function first
DROP FUNCTION IF EXISTS search_services_by_location(DOUBLE PRECISION, DOUBLE PRECISION, INTEGER, INTEGER, TEXT);

-- Create the fixed function with proper type casting
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
        ROUND((ST_Distance(
            s.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) / 1000)::NUMERIC, 2)::TEXT || ' km' as distance_km
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

-- Now test it
SELECT * FROM search_services_by_location(
    43.6436,  -- Queen and Bloor latitude
    -79.4256, -- Queen and Bloor longitude
    5000,     -- 5km radius
    10        -- top 10 results
);