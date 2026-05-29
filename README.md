# Sage SDGs AI

AI-powered guidance for Sustainable Development Goals. A multi-agent AI assistant focused on SDG 3 (Good Health and Well-being), SDG 4 (Quality Education), and SDG 13 (Climate Action).

## Features

- **Multi-Agent Architecture**: Specialized AI agents for different SDG domains
  - Sage Core: General SDG assistant
  - Quality Education: SDG 4 specialist
  - MindCare: SDG 3 mental health support
  - Climate Action: SDG 13 specialist
  - Data Research: Evidence-based insights

- **Responsive Design**: Works on desktop and mobile
- **Demo Mode**: Works without API keys for demonstration
- **Chat Persistence**: Messages saved to Supabase database
- **Safety-First MindCare**: Proper escalation for crisis language

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_ANTHROPIC_API_KEY` | Anthropic Claude API key | Optional |
| `VITE_OPENAI_API_KEY` | OpenAI API key | Optional |
| `VITE_NVIDIA_API_KEY` | NVIDIA NIM API key | Optional |

If no AI API key is provided, the app runs in demo mode with mock responses.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

## Important Disclaimers

- This app is for **educational purposes only**
- MindCare is **not a substitute for professional mental health care**
- For emergencies, contact local emergency services immediately

## License

MIT
