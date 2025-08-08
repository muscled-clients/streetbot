-- Update the search function to include latitude and longitude for Google Maps links
CREATE OR REPLACE FUNCTION search_services_by_location(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters INTEGER DEFAULT 5000,
    max_results INTEGER DEFAULT 20,
    filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    category TEXT,
    description TEXT,
    address_street TEXT,
    address_city TEXT,
    phone TEXT,
    website TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
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
        s.latitude,
        s.longitude,
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

-- Test to verify latitude and longitude are returned
SELECT id, title, latitude, longitude, distance_km 
FROM search_services_by_location(
    43.6561,  -- Yonge and Dundas latitude
    -79.3802, -- Yonge and Dundas longitude
    2000,     -- 2km radius
    5         -- top 5 results
);