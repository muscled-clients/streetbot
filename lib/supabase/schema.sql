-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    eligibility TEXT,
    
    -- Address fields
    address_street TEXT,
    address_city TEXT,
    address_province TEXT DEFAULT 'ON',
    
    -- Contact info
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- Additional info
    hours_of_operation TEXT,
    languages TEXT[], -- Array of languages
    accessibility TEXT,
    
    -- Location coordinates
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Search text for full-text search
    search_text TEXT GENERATED ALWAYS AS (
        LOWER(
            COALESCE(title, '') || ' ' ||
            COALESCE(category, '') || ' ' ||
            COALESCE(description, '') || ' ' ||
            COALESCE(eligibility, '') || ' ' ||
            COALESCE(address_city, '')
        )
    ) STORED,
    
    -- Embedding vector for semantic search
    embedding vector(1536) -- OpenAI text-embedding-3-small dimension
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_city ON services(address_city);
CREATE INDEX IF NOT EXISTS idx_services_search ON services USING GIN(to_tsvector('english', search_text));

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_services_embedding ON services 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create function for semantic search
CREATE OR REPLACE FUNCTION search_services(
    query_embedding vector(1536),
    match_count INT DEFAULT 10,
    filter_category TEXT DEFAULT NULL,
    filter_city TEXT DEFAULT NULL
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
    similarity FLOAT
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
        s.hours_of_operation,
        1 - (s.embedding <=> query_embedding) AS similarity
    FROM services s
    WHERE 
        s.embedding IS NOT NULL
        AND (filter_category IS NULL OR s.category = filter_category)
        AND (filter_city IS NULL OR s.address_city = filter_city)
    ORDER BY s.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;