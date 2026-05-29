import { AgentId, Message } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function generateResponse(
  agentId: AgentId,
  messages: Message[],
  systemPrompt?: string
): Promise<string> {

  const formattedHistory = messages.slice(0, -1).map(m => ({
    role: m.role,
    content: m.content,
  }));

  const lastMessage = messages[messages.length - 1];
  
  // Decide endpoint: if Lovable/Supabase URL is available, use it.
  // Otherwise, use relative /api/ai-chat for Vercel/Netlify.
  const endpoint = SUPABASE_URL 
    ? `${SUPABASE_URL}/functions/v1/ai-chat`
    : '/api/ai-chat';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
          ...formattedHistory, 
          { role: 'user', content: lastMessage?.content || '' }
        ],
        selectedAgent: agentId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.demoMode || response.status === 404) {
        // If 404, it means we're probably running locally without a backend, fallback to demo mode safely.
        console.log('Falling back to demo mode (404 or explicit demoMode flag).');
        return getDemoResponse(agentId);
      }
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.demoMode) {
      console.log('Running in demo mode - no API key configured');
      return getDemoResponse(agentId);
    }
    
    // OpenRouter returns choices[0].message.content
    return data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('AI Provider Error:', error);
    // Fallback to demo mode if fetch fails completely (e.g. offline or route not found)
    console.log('Falling back to demo mode due to network error or missing local backend setup.');
    return getDemoResponse(agentId);
  }
}

function getDemoResponse(agentId: AgentId): string {
  const demoResponses: Record<string, string> = {
    'sage-core': `I'd be happy to help you learn about the Sustainable Development Goals!

The UN established 17 SDGs in 2015 as a blueprint for peace and prosperity. They address global challenges including poverty, inequality, climate change, environmental degradation, peace, and justice.

**Key SDGs you might explore:**
- **SDG 3**: Good Health and Well-being
- **SDG 4**: Quality Education
- **SDG 13**: Climate Action

Each goal has specific targets to be achieved by 2030. Would you like me to explain any of these in detail?`,

    'quality-education': `Quality education means that all children and adults have access to learning opportunities, but also that the education they receive is effective and meaningful.

**Key Challenges in Education:**
- Access to schools in rural and remote areas
- Quality of teaching and learning materials
- Gender disparities in education access
- Teacher training and support
- Infrastructure and resources

**Practical Solutions:**
1. Community-based schooling for remote areas
2. Teacher professional development programs
3. Parent and community involvement
4. Digital learning tools for underserved areas
5. Scholarships for girls' education

What aspect of education would you like to explore further?`,

    'mindcare': `Thank you for sharing with me. Your feelings are valid, and it takes courage to reach out.

**Here are some small steps you might try:**
1. Take a few deep breaths – inhale for 4 counts, hold for 2, exhale for 6
2. Go for a short walk, even just around your room
3. Write down one thing that went okay today
4. Talk to someone you trust about how you're feeling

Remember, feeling overwhelmed is something many people experience. You're not alone in this, and support is available.

How long have you been feeling this way?`,

    'climate-action': `Climate change is one of the most pressing challenges of our time. Let me explain it simply.

**What is Climate Change?**
The Earth's temperature is rising because of greenhouse gases like CO2 from burning fossil fuels. This causes:
- More extreme weather (floods, heatwaves, droughts)
- Rising sea levels
- Loss of biodiversity
- Food and water security challenges

**What You Can Do:**
1. Reduce, reuse, recycle
2. Use public transport or walk/bike
3. Save energy at home (turn off lights, use efficient appliances)
4. Eat more plant-based meals
5. Support climate-aware businesses and policies

Every action counts. Would you like specific ideas for schools or communities?`,

    'data-research': `SDG data helps us track progress toward sustainable development goals.

**How SDG Progress is Measured:**
Each SDG has specific indicators – for example, SDG 4 uses literacy rates, enrollment ratios, and teacher qualifications.

**Key Data Sources:**
- UN SDG Database (unstats.un.org)
- World Bank Open Data
- UNESCO Institute for Statistics
- National statistics offices

**Understanding Data:**
When looking at SDG statistics, consider:
- The methodology used
- Data collection frequency
- Geographic coverage
- Margins of error

Would you like to learn about data for a specific SDG?`,
  };

  return demoResponses[agentId] || "I'm here to help with SDG-related questions. What would you like to know?";
}
