-- Create a function to search services by location and query
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
    location_match BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
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
        (s.address_city = lk.city_filter OR s.address_city = 'Toronto') AS location_match
    FROM services s, location_keywords lk
    WHERE 
        s.embedding IS NOT NULL
        -- Prioritize location matches
        AND (
            s.address_city = lk.city_filter 
            OR s.address_city = 'Toronto'
            OR (lk.city_filter = 'Toronto' AND s.address_city IN ('Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York'))
        )
    ORDER BY 
        -- First sort by location match
        CASE WHEN s.address_city = lk.city_filter THEN 0 ELSE 1 END,
        -- Then by similarity
        s.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;