import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Plus, Sparkles, Heart, GraduationCap, Leaf, ChartBar as BarChart3, Loader as Loader2, Volume2, VolumeX, Speaker } from 'lucide-react';
import { AgentId, Message } from '../types';
import { agents, getAgentById } from '../lib/utils';
import { generateResponse } from '../lib/aiProvider';
import { useSpeech } from '../hooks/useSpeech';

const agentIcons: Record<string, React.ElementType> = {
  Sparkles,
  Heart,
  GraduationCap,
  Leaf,
  BarChart3,
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function Chat() {
  const { agentId: urlAgentId } = useParams<{ agentId?: string }>();
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>((urlAgentId as AgentId) || 'sage-core');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentTestQuestion = useRef(false);

  const { speak, stop, isSpeaking, isSupported, autoRead, toggleAutoRead } = useSpeech({ autoRead: false });
  const lastResponseRef = useRef<string>('');

  useEffect(() => {
    if (urlAgentId && agents.some(a => a.id === urlAgentId)) {
      setSelectedAgentId(urlAgentId as AgentId);
    }
  }, [urlAgentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-read new AI responses
  useEffect(() => {
    if (autoRead && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.content !== lastResponseRef.current) {
        lastResponseRef.current = lastMessage.content;
        speak(lastMessage.content);
      }
    }
  }, [messages, autoRead, speak]);

  const selectedAgent = getAgentById(selectedAgentId);
  const AgentIcon = agentIcons[selectedAgent?.icon || 'Sparkles'] || Sparkles;

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(
        selectedAgentId,
        [...messages, userMessage],
        selectedAgent?.systemPrompt || ''
      );

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        agentId: selectedAgentId,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(null);
    lastResponseRef.current = '';
    hasSentTestQuestion.current = false;
    stop();
  };

  // Check for test question on mount and send it
  useEffect(() => {
    if (hasSentTestQuestion.current || messages.length > 0 || isLoading) return;

    const testQuestion = sessionStorage.getItem('sage-test-question');
    const autoSend = sessionStorage.getItem('sage-test-auto-send');

    if (testQuestion && autoSend === 'true') {
      sessionStorage.removeItem('sage-test-question');
      sessionStorage.removeItem('sage-test-auto-send');
      hasSentTestQuestion.current = true;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: testQuestion,
        timestamp: new Date(),
      };

      setMessages([userMessage]);
      setIsLoading(true);

      generateResponse(
        selectedAgentId,
        [userMessage],
        selectedAgent?.systemPrompt || ''
      )
        .then((response) => {
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: response,
            agentId: selectedAgentId,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to get response.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []); // Only run on mount

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  if (!selectedAgent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="glass-card p-4 sticky top-24">
            <h2 className="font-semibold text-slate-900 mb-4">Select Agent</h2>
            <div className="space-y-2">
              {agents.map((agent) => {
                const Icon = agentIcons[agent.icon] || Sparkles;
                const isSelected = agent.id === selectedAgentId;

                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      handleNewChat();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-sage-100 text-sage-900 border-2 border-sage-300'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${agent.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs opacity-70">{agent.shortDescription}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNewChat}
              className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-sage-300 hover:text-sage-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>

            {/* Voice Controls */}
            {isSupported && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Auto-read responses</span>
                  <button
                    onClick={toggleAutoRead}
                    className={`p-2 rounded-lg transition-colors ${
                      autoRead ? 'bg-sage-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {autoRead ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
                {isSpeaking && (
                  <button
                    onClick={stop}
                    className="mt-2 w-full text-xs text-red-500 hover:text-red-600"
                  >
                    Stop speaking
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Agent Header */}
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selectedAgent.bgColor} flex items-center justify-center`}>
                  <AgentIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">{selectedAgent.name}</h1>
                  <p className="text-sm text-slate-500">{selectedAgent.sdg.join(', ')}</p>
                </div>
              </div>

              {/* Mobile Voice Toggle */}
              {isSupported && (
                <button
                  onClick={toggleAutoRead}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    autoRead ? 'bg-sage-100 text-sage-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {autoRead ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Mobile Agent Selector */}
            <div className="mt-4 lg:hidden">
              <select
                value={selectedAgentId}
                onChange={(e) => {
                  setSelectedAgentId(e.target.value as AgentId);
                  handleNewChat();
                }}
                className="input-base text-sm"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 glass-card p-4 mb-4 overflow-y-auto">
            {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className={`w-16 h-16 rounded-2xl ${selectedAgent.bgColor} flex items-center justify-center mb-4`}>
                  <AgentIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Chat with {selectedAgent.name}
                </h2>
                <p className="text-slate-500 text-sm mb-6 max-w-md">
                  {selectedAgent.description}
                </p>

                {/* Suggested Prompts */}
                <div className="w-full max-w-lg">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">
                    Try asking
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.suggestedPrompts.slice(0, 4).map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handlePromptClick(prompt)}
                        className="text-sm px-3 py-2 bg-slate-100 hover:bg-sage-100 text-slate-600 hover:text-sage-700 rounded-lg transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user'
                          ? 'chat-bubble-user'
                          : 'chat-bubble-assistant'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-50">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {/* Speak button for assistant messages */}
                        {message.role === 'assistant' && isSupported && (
                          <button
                            onClick={() => handleSpeakMessage(message.content)}
                            className="text-xs text-slate-400 hover:text-sage-600 flex items-center gap-1"
                          >
                            <Speaker className="w-3 h-3" />
                            {isSpeaking ? 'Playing' : 'Read'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-assistant flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-sage-500" />
                      <span className="text-sm text-slate-500">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="glass-card p-4">
            {messages.length === 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedAgent.suggestedPrompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-sage-100 text-slate-600 hover:text-sage-700 rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="input-base flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
