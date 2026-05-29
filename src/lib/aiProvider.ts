import { AgentId, Message } from '../types';
import { getAgentById, containsSafetyKeywords, safetyResponse } from './utils';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER;

const isValidKey = (key: string | undefined): boolean => {
  return !!(key && key.length > 10 && key.startsWith('sk-') || key?.startsWith('nvapi-') || key?.startsWith('eyJ'));
};

const getAvailableProvider = (): string | null => {
  if (AI_PROVIDER && isValidKey(getKeyForProvider(AI_PROVIDER))) {
    return AI_PROVIDER;
  }
  if (isValidKey(ANTHROPIC_API_KEY)) return 'anthropic';
  if (isValidKey(OPENAI_API_KEY)) return 'openai';
  if (isValidKey(NVIDIA_API_KEY)) return 'nvidia';
  return null;
};

const getKeyForProvider = (provider: string): string | undefined => {
  switch (provider) {
    case 'anthropic': return ANTHROPIC_API_KEY;
    case 'openai': return OPENAI_API_KEY;
    case 'nvidia': return NVIDIA_API_KEY;
    default: return undefined;
  }
};

export const isDemoMode = (): boolean => {
  return getAvailableProvider() === null;
};

const generateMockResponse = async (agentId: AgentId, userMessage: string): Promise<string> => {
  const agent = getAgentById(agentId);
  if (!agent) return "I'm here to help. What would you like to know?";

  if (agentId === 'mindcare' && containsSafetyKeywords(userMessage)) {
    return safetyResponse;
  }

  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

  const mockResponses: Record<AgentId, string> = {
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

    'mindcare': containsSafetyKeywords(userMessage) ? safetyResponse :
`Thank you for sharing with me. Your feelings are valid, and it takes courage to reach out.

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
- margins of error

Would you like to learn about data for a specific SDG?`,
  };

  return mockResponses[agentId] || "I'm here to help with SDG-related questions. What would you like to know?";
};

export const generateResponse = async (
  agentId: AgentId,
  messages: Message[],
  systemPrompt: string
): Promise<string> => {
  const provider = getAvailableProvider();

  if (!provider) {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    return generateMockResponse(agentId, lastUserMessage?.content || '');
  }

  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  try {
    if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          system: systemPrompt,
          messages: formattedMessages,
        }),
      });

      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (agentId === 'mindcare' && containsSafetyKeywords(formattedMessages[formattedMessages.length - 1]?.content || '')) {
        return safetyResponse;
      }

      return content || "I apologize, I couldn't generate a response. Please try again.";
    }

    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: systemPrompt },
            ...formattedMessages,
          ],
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (agentId === 'mindcare' && containsSafetyKeywords(formattedMessages[formattedMessages.length - 1]?.content || '')) {
        return safetyResponse;
      }

      return content || "I apologize, I couldn't generate a response. Please try again.";
    }

    if (provider === 'nvidia') {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: systemPrompt },
            ...formattedMessages,
          ],
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (agentId === 'mindcare' && containsSafetyKeywords(formattedMessages[formattedMessages.length - 1]?.content || '')) {
        return safetyResponse;
      }

      return content || "I apologize, I couldn't generate a response. Please try again.";
    }

    return generateMockResponse(agentId, formattedMessages[formattedMessages.length - 1]?.content || '');
  } catch (error) {
    console.error('AI Provider Error:', error);
    return "I'm sorry, I encountered an error. Please try again in a moment.";
  }
};
