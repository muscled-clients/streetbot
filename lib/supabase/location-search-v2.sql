-- Drop existing function
DROP FUNCTION IF EXISTS search_services_by_location;

-- Create improved function that handles both text locations and coordinates
CREATE OR REPLACE FUNCTION search_services_by_location(
    query_embedding vector(1536),
    user_location TEXT,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    category TEXT,
    description TEXT,
    address_street TEXT,
    address_city TEXT,
    phone TEXT,
    hours_of_operation TEXT,
    similarity FLOAT,
    distance_km FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    user_lat FLOAT;
    user_lng FLOAT;
    is_coordinates BOOLEAN;
BEGIN
    -- Check if user_location is coordinates (format: "lat,lng")
    IF user_location ~ '^-?\d+\.?\d*,-?\d+\.?\d*$' THEN
        is_coordinates := TRUE;
        user_lat := SPLIT_PART(user_location, ',', 1)::FLOAT;
        user_lng := SPLIT_PART(user_location, ',', 2)::FLOAT;
    ELSE
        is_coordinates := FALSE;
    END IF;

    RETURN QUERY
    WITH location_keywords AS (
        SELECT CASE 
            -- Downtown core
            WHEN user_location ILIKE '%yonge%' OR user_location ILIKE '%dundas%' 
                OR user_location ILIKE '%queen%' OR user_location ILIKE '%king%'
                OR user_location ILIKE '%bay%' OR user_location ILIKE '%university%'
                OR user_location ILIKE '%spadina%' OR user_location ILIKE '%downtown%'
            THEN 'Toronto'
            
            -- Scarborough
            WHEN user_location ILIKE '%scarborough%' OR user_location ILIKE '%kennedy%'
                OR user_location ILIKE '%mccowan%' OR user_location ILIKE '%markham rd%'
            THEN 'Scarborough'
            
            -- North York
            WHEN user_location ILIKE '%north york%' OR user_location ILIKE '%sheppard%'
                OR user_location ILIKE '%finch%' OR user_location ILIKE '%steeles%'
            THEN 'North York'
            
            -- Etobicoke
            WHEN user_location ILIKE '%etobicoke%' OR user_location ILIKE '%kipling%'
                OR user_location ILIKE '%islington%' OR user_location ILIKE '%royal york%'
            THEN 'Etobicoke'
            
            -- Default to Toronto
            ELSE 'Toronto'
        END AS city_filter
    )
    SELECT 
        s.id,
        s.title,
        s.category,
        s.description,
        s.address_street,
        s.address_city,
        s.phone,
        s.hours_of_operation,
        1 - (s.embedding <=> query_embedding) AS similarity,
        CASE 
            WHEN is_coordinates AND s.latitude IS NOT NULL AND s.longitude IS NOT NULL THEN
                -- Calculate distance in kilometers using Haversine formula
                6371 * acos(
                    LEAST(1, 
                        cos(radians(user_lat)) * cos(radians(s.latitude)) *
                        cos(radians(s.longitude) - radians(user_lng)) +
                        sin(radians(user_lat)) * sin(radians(s.latitude))
                    )
                )
            ELSE
                NULL
        END AS distance_km
    FROM services s, location_keywords lk
    WHERE 
        s.embedding IS NOT NULL
        -- Basic similarity threshold
        AND 1 - (s.embedding <=> query_embedding) > 0.3
        -- Toronto area services only
        AND s.address_city IN ('Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York')
    ORDER BY 
        -- If we have coordinates, prioritize by distance
        CASE 
            WHEN is_coordinates AND s.latitude IS NOT NULL AND s.longitude IS NOT NULL THEN
                6371 * acos(
                    LEAST(1,
                        cos(radians(user_lat)) * cos(radians(s.latitude)) *
                        cos(radians(s.longitude) - radians(user_lng)) +
                        sin(radians(user_lat)) * sin(radians(s.latitude))
                    )
                )
            ELSE
                999999  -- Large number for services without coordinates
        END,
        -- Then by location text match
        CASE 
            WHEN NOT is_coordinates AND s.address_city = lk.city_filter THEN 0
            WHEN NOT is_coordinates AND s.address_city = 'Toronto' THEN 1
            ELSE 2
        END,
        -- Finally by similarity score
        s.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;