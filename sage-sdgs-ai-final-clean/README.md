# Sage SDGs AI

Sage SDGs AI is a responsive, modern web application that provides insights into the UN Sustainable Development Goals using AI agents.

This project is fully deployable online to platforms like Lovable, Vercel, or Netlify. **It is NOT a local-only app.** The frontend relies on a deployed serverless function (`ai-chat`) to securely communicate with OpenRouter without exposing any API keys to the browser.

## Features
- **Modern AI Dashboard**: Clean UI with glassmorphism and Tailwind CSS.
- **Multiple Specialized Agents**: Sage Core, Quality Education, MindCare, Climate Action, Data Research.
- **Voice Synthesis**: Auto-read responses using the browser's SpeechSynthesis API.
- **Demo Mode Fallback**: Works beautifully even if the OpenRouter API key is missing.
- **Secure Backend Integration**: Utilizes Edge/Serverless functions to keep API keys hidden on the server.

## How the `ai-chat` Backend Works Online
The frontend makes a secure POST request to the deployed `ai-chat` edge function.
- On **Lovable / Supabase**, this runs via `supabase/functions/ai-chat/index.ts`.
- On **Vercel**, this runs via `api/ai-chat.ts`.
- On **Netlify**, this runs via `netlify/functions/ai-chat.ts`.

This serverless function runs on the deployment provider's servers. It reads the `OPENROUTER_API_KEY` from the secure environment variables, attaches it to the request header, and forwards the payload to OpenRouter.
If the API key is not configured, the backend catches this and returns a `demoMode: true` flag, gracefully falling back to offline responses.

## Deployment Instructions

### Option 1: Lovable (Primary Target)
1. Upload this clean project to a new GitHub repository.
2. Import the GitHub repo into Lovable.
3. Add the following to your Lovable/Supabase project secrets (Environment Variables):
   - `OPENROUTER_API_KEY`: Your real OpenRouter API key.
   - `AI_MODEL`: `openrouter/auto` (or your preferred model).
4. Deploy the app! Lovable will automatically detect the Supabase Edge Function in `supabase/functions/ai-chat`.
5. Open the deployed Chat Dashboard and confirm that the AI works online. The frontend will call the deployed `ai-chat` function, completely ignoring localhost.

### Option 2: Vercel
1. Push this repository to GitHub.
2. Go to Vercel and import your new GitHub repository.
3. In the "Environment Variables" section before deploying, add:
   - `OPENROUTER_API_KEY`: Your real OpenRouter key.
   - `AI_MODEL`: `openrouter/auto`
4. Deploy! Vercel automatically detects Vite and builds it. It also automatically hosts the `api/ai-chat.ts` function.

### Option 3: Netlify
1. Push this repository to GitHub.
2. Go to Netlify and create a new site from your Git repository.
3. Add `OPENROUTER_API_KEY` and `AI_MODEL` to "Environment variables".
4. The Netlify Edge function at `netlify/functions/ai-chat.ts` will automatically be deployed.

## Security Warning
**DO NOT COMMIT REAL API KEYS.**
Always keep your `OPENROUTER_API_KEY` in your deployment platform's secret manager. If you accidentally commit a real API key, you must revoke and rotate it immediately.

## Local Development (For testing only)
To test or edit locally:
1. `npm install`
2. Create a `.env` file based on `.env.example`.
3. `npm run dev`
*(Note: If you want to test the full OpenRouter functionality locally, you must run the serverless proxy via `npx vercel dev`, `netlify dev`, or `supabase functions serve`. Otherwise, the frontend will automatically fallback to Demo Mode.)*
