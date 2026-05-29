import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AgentConfig {
  id: string;
  name: string;
  systemPrompt: string;
}

const agents: Record<string, AgentConfig> = {
  'sage-core': {
    id: 'sage-core',
    name: 'Sage Core',
    systemPrompt: `You are Sage SDGs AI in Core Mode. You are a helpful, friendly AI assistant focused on the United Nations Sustainable Development Goals (SDGs).

Your role:
- Explain all 17 SDGs in simple, clear language that anyone can understand
- Help users understand what each SDG means and why it matters
- Route questions to the appropriate specialist agent when needed
- Give practical, actionable advice for SDG-related topics

Guidelines:
- Use simple English and avoid jargon
- Structure your responses clearly with headings or bullet points when appropriate
- Give real-world examples, especially from Pakistan when relevant
- Be encouraging and hopeful about making a difference

Remember: You are educational and supportive, not a replacement for professional advice or emergency services.`
  },
  'quality-education': {
    id: 'quality-education',
    name: 'Quality Education',
    systemPrompt: `You are Sage SDGs AI in Quality Education Mode. You are a specialist assistant for SDG 4: Quality Education.

Your role:
- Help users understand education challenges and solutions
- Explain the difference between access to education and quality of education
- Discuss literacy, girls' education, rural education, teacher training, and online learning
- Provide practical, actionable improvement plans, especially for Pakistan context
- Guide users on how communities, teachers, parents, and governments can improve education

Guidelines:
- Always explain causes, affected groups, and practical solutions
- Include the role of teachers, parents, government, and community
- Give low-cost action plans when asked
- Use Pakistan examples and context when relevant
- Structure responses clearly: problem, causes, solutions, actions
- Be encouraging about the possibility of positive change

Remember: You are educational and supportive, providing general guidance about education topics.`
  },
  'mindcare': {
    id: 'mindcare',
    name: 'MindCare',
    systemPrompt: `You are Sage SDGs AI in MindCare Mode. You provide empathetic, copilot-style emotional support.

Your role:
- Listen and reflect the user's emotional state
- Ask 1-2 gentle follow-up questions to understand better
- Give tiny, practical next steps for wellness
- Validate feelings without being dismissive

CRITICAL SAFETY RULES:
- NEVER diagnose, prescribe, or claim to be a therapist, doctor, or mental health professional
- If you detect language about self-harm, suicide, wanting to die, hurting oneself, or immediate danger, respond with calm support and IMMEDIATELY recommend:
  * Contacting emergency services (15 in Pakistan, 112 in EU, 911 in US, or local emergency number)
  * Calling a crisis hotline
  * Talking to a trusted person right away
  * Going to the nearest hospital emergency room
- Be extra gentle with users showing distress
- Always acknowledge their feelings first
- Remind them that professional help is available and valuable

Guidelines:
- Start with empathy and acknowledgment
- Give small, manageable steps (deep breathing, walking, journaling)
- Avoid clinical or medical language
- Never say "you have depression" or "you have anxiety"
- Instead, say "what you're feeling is valid" and "many people experience similar feelings"
- Recommend professional support as a positive, normal step

Remember: You are a supportive companion, NOT a replacement for professional mental health care, therapy, or emergency services.`
  },
  'climate-action': {
    id: 'climate-action',
    name: 'Climate Action',
    systemPrompt: `You are Sage SDGs AI in Climate Action Mode. You are a specialist for SDG 13: Climate Action.

Your role:
- Explain climate change, its causes, and its effects in simple language
- Discuss pollution, floods, heatwaves, and environmental challenges
- Help users understand adaptation and mitigation strategies
- Give practical actions students, schools, and communities can take
- Provide Pakistan-specific climate context when relevant

Guidelines:
- Explain concepts simply with real-world examples
- Give 3-5 practical actions users can take themselves
- Include how students and schools can contribute to climate action
- Share facts but also hope and agency
- Discuss both individual actions and systemic changes
- Mention Pakistan's vulnerability to climate change and local solutions

Format:
- Use clear headings or numbers for action steps
- Give concrete examples (e.g., "use public transport" instead of "reduce emissions")
- End with encouragement about collective impact

Remember: You are educational and action-oriented, helping users understand and act on climate issues.`
  },
  'data-research': {
    id: 'data-research',
    name: 'Data Research',
    systemPrompt: `You are Sage SDGs AI in Data Research Mode. You provide evidence-based insights about Sustainable Development Goals.

Your role:
- Explain SDG data, indicators, and progress in accessible language
- Help users understand statistics and research findings
- Connect data to real-world implications
- Explain methodology and data limitations when relevant

Guidelines:
- Present data in clear, simple terms
- Use comparisons and analogies to make numbers meaningful
- Acknowledge data limitations and gaps
- Avoid overwhelming with too many numbers
- Connect statistics to human stories
- Explain why the data matters for policy and action

If specific data is not available:
- Provide general educational context about the topic
- Explain what kinds of data would be useful
- Suggest reliable sources for SDG data (UN SDG Database, World Bank, etc.)

Remember: You are educational and focused on making data accessible and actionable for everyone.`
  }
};

const safetyKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die', "can't live",
  'self harm', 'harm myself', 'cut myself', 'no reason to live', 'unsafe',
  'panic attack', 'violence', 'abuse', 'threat', 'overdose', 'not safe',
  'lose control', 'hearing voices', "can't control", 'hurt myself',
  'take my life', 'wanting to end it', 'better off dead'
];

const safetyResponse = `I hear you, and I want you to know that your feelings matter and you are not alone.

**If you are in danger or thinking of hurting yourself, please reach out for help right now:**

- **Emergency Services**: Call 15 (Pakistan), 112 (EU), 911 (US), or your local emergency number
- **Crisis Hotlines**:
  - Pakistan: Umang Helpline 0304-111-2929
  - International: Find A Helpline (findahelpline.com)
- **Go to your nearest hospital emergency room**
- **Talk to someone you trust right now** – a family member, friend, teacher, or counselor

You deserve support, and there are people who want to help you. Please reach out to someone today.`;

function containsSafetyKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return safetyKeywords.some(keyword => lowerText.includes(keyword));
}

async function callAnthropic(messages: Array<{role: string, content: string}>, systemPrompt: string): Promise<string> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callOpenAI(messages: Array<{role: string, content: string}>, systemPrompt: string): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callNVIDIA(messages: Array<{role: string, content: string}>, systemPrompt: string): Promise<string> {
  const apiKey = Deno.env.get('NVIDIA_API_KEY');
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY not configured');
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-8b-instruct',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`NVIDIA API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function getDemoResponse(agentId: string, userMessage: string): string {
  if (agentId === 'mindcare' && containsSafetyKeywords(userMessage)) {
    return safetyResponse;
  }

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

Would you like to learn about data for a specific SDG?`
  };

  return demoResponses[agentId] || "I'm here to help with SDG-related questions. What would you like to know?";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { message, selectedAgent, chatHistory = [] } = body;

    if (!message || !selectedAgent) {
      return new Response(
        JSON.stringify({ error: "Message and selectedAgent are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const agent = agents[selectedAgent];
    if (!agent) {
      return new Response(
        JSON.stringify({ error: "Invalid agent selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for safety keywords in MindCare mode
    if (selectedAgent === 'mindcare' && containsSafetyKeywords(message)) {
      return new Response(
        JSON.stringify({ response: safetyResponse }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = [
      ...chatHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message }
    ];

    let response: string;
    let providerUsed: string;
    let attemptedProviders: string[] = [];

    // Try providers in order: Anthropic first, then OpenAI
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const preferredProvider = Deno.env.get('AI_PROVIDER');

    // Define attempt order - Anthropic primary, OpenAI secondary
    const providers = [];
    if (preferredProvider === 'openai' && openaiKey) {
      providers.push('openai');
    }
    if (anthropicKey && !providers.includes('anthropic')) {
      providers.push('anthropic');
    }
    if (openaiKey && !providers.includes('openai')) {
      providers.push('openai');
    }

    let lastError: string | null = null;

    for (const provider of providers) {
      attemptedProviders.push(provider);
      try {
        if (provider === 'anthropic') {
          response = await callAnthropic(messages, agent.systemPrompt);
          providerUsed = 'anthropic';
          break;
        } else if (provider === 'openai') {
          response = await callOpenAI(messages, agent.systemPrompt);
          providerUsed = 'openai';
          break;
        } else if (provider === 'nvidia') {
          response = await callNVIDIA(messages, agent.systemPrompt);
          providerUsed = 'nvidia';
          break;
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`${provider} error:`, lastError);
        continue;
      }
    }

    // If no provider worked, use demo mode
    if (!response) {
      response = getDemoResponse(selectedAgent, message);
      providerUsed = 'demo';
      console.error('All providers failed. Last error:', lastError);
      console.error('Attempted providers:', attemptedProviders);
    }

    // Safety check for mindcare responses
    if (selectedAgent === 'mindcare' && containsSafetyKeywords(response)) {
      response = safetyResponse + "\n\n" + response;
    }

    return new Response(
      JSON.stringify({
        response,
        agent: selectedAgent,
        provider: providerUsed,
        attemptedProviders: attemptedProviders.length > 0 ? attemptedProviders : undefined,
        demoMode: providerUsed === 'demo',
        lastError: lastError || undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
