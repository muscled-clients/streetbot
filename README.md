# StreetBot - A StreetVoices.ca Tool

StreetBot is an AI-powered chatbot that helps vulnerable populations find essential services in the Greater Toronto Area. Built for Street Voices, it provides a compassionate, accessible interface for finding food, shelter, healthcare, and other critical support services.

## Features

- 🤖 Conversational AI interface powered by GPT-4
- 📍 Location-based service search
- 🎯 Semantic search using vector embeddings
- 💛 Accessible design with Street Voices branding
- 📱 Mobile-responsive interface
- ⚡ Real-time streaming responses

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + pgvector)
- **AI**: OpenAI GPT-4, text-embedding-3-small
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/muscled-clients/streetbot.git
cd streetbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Import service data:
```bash
npm run import-services-v2
```

## Database Setup

1. Create a Supabase project
2. Enable the pgvector extension
3. Run the schema from `lib/supabase/schema.sql`
4. Run the RPC functions from `lib/supabase/location-search.sql`

## Deployment

Deploy to Vercel:
```bash
vercel
```

Remember to set all environment variables in your Vercel project settings.

## Data Import

The project includes scripts to import service data with embeddings:
- `npm run import-services-v2` - Import with real-time progress
- `npm run check-import` - Check import status

Currently 56.6% of services are imported (1,898 out of 3,352).

## About

StreetBot is a [StreetVoices.ca](https://streetvoices.ca) initiative.

Built by [Muscled Inc.](https://www.linkedin.com/in/roadtocode/)

## License

Private repository for Street Voices.