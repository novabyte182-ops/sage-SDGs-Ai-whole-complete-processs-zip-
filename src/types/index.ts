export type AgentId =
  | 'sage-core'
  | 'quality-education'
  | 'mindcare'
  | 'climate-action'
  | 'data-research';

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  shortDescription: string;
  sdg: string[];
  color: string;
  bgColor: string;
  icon: string;
  systemPrompt: string;
  suggestedPrompts: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId?: AgentId;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  agentId: AgentId;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIProvider {
  name: string;
  generateResponse(agentId: AgentId, messages: Message[], systemPrompt: string): Promise<string>;
}

export interface SDGInfo {
  number: number;
  name: string;
  color: string;
  icon: string;
  description: string;
  whyItMatters: string;
  commonProblems: string[];
  practicalActions: string[];
}
