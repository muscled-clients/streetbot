-- Test 1: Check how many services have location data
SELECT 
    COUNT(*) as total_services,
    COUNT(location) as services_with_location,
    ROUND(COUNT(location)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as percentage_with_location
FROM services;

-- Test 2: Find services near Queen and Bloor (5km radius)
SELECT * FROM search_services_by_location(
    43.6436,  -- Queen and Bloor latitude
    -79.4256, -- Queen and Bloor longitude
    5000,     -- 5km radius
    10        -- top 10 results
);

-- Test 3: Find services near Yonge and Dundas (2km radius)
SELECT * FROM search_services_by_location(
    43.6561,  -- Yonge and Dundas latitude
    -79.3802, -- Yonge and Dundas longitude
    2000,     -- 2km radius
    10        -- top 10 results
);

-- Test 4: Check distribution of services by city
SELECT 
    address_city,
    COUNT(*) as service_count,
    COUNT(location) as with_coordinates
FROM services
GROUP BY address_city
ORDER BY service_count DESC
LIMIT 20;