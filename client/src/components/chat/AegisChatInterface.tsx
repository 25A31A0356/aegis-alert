import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Radio,
  Wifi,
  WifiOff,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Bot,
  User,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  Navigation,
} from 'lucide-react';
import { ChatMessage, ChatSource } from '@shared';
import { ActiveView } from '../../types';
import { ApiService } from '../../services/api';
import { queryLocalKnowledgeBase } from '../../services/disasterKnowledgeBase';
import { useEmergency } from '../../stores/EmergencyContext';

interface AegisChatInterfaceProps {
  setActiveView: (view: ActiveView) => void;
}

export type ChatMode = 'auto' | 'offline' | 'online';

export const AegisChatInterface: React.FC<AegisChatInterfaceProps> = ({ setActiveView }) => {
  const { isOnline } = useEmergency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<ChatMode>('auto');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested emergency questions
  const SUGGESTED_QUERIES = [
    { label: '🌊 Flood Safety', query: 'What should I do during a flood?' },
    { label: '🎒 Evacuation Pack', query: 'What should I carry during evacuation?' },
    { label: '⚡ Lightning 30-30', query: 'Is it safe to go outside during lightning?' },
    { label: '🏚️ Earthquake Protocol', query: 'What to do during an earthquake?' },
    { label: '☀️ Heat Stroke Care', query: 'How to treat extreme heat stroke?' },
    { label: '⛰️ Landslide Signs', query: 'What are the early warning signs of a landslide?' },
  ];

  // Initial welcome message
  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const res = await ApiService.getChatHistory();
      if (res.success && res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        // Default initial greeting
        setMessages([
          {
            id: 'welcome_msg',
            sender: 'aegis',
            text: `🛡️ **AEGIS EMERGENCY ASSISTANT ONLINE**\n\nI am your 24/7 disaster safety advisor, backed by official **National Disaster Management Authority (NDMA)** protocols.\n\n⚡ **Operating Capabilities:**\n• **Offline Mode**: 100% autonomous local rule-based safety matching.\n• **Online Mode**: Cloud AI for situational reasoning.\n\n*How can I assist your safety right now?*`,
            timestamp: new Date().toISOString(),
            source: 'OFFLINE_KB',
            actionRecommendations: [
              'What should I do during a flood?',
              'What should I carry during evacuation?',
              'Is it safe to go outside during lightning?',
            ],
          },
        ]);
      }
    } catch {
      // Offline fallback initial greeting
      setMessages([
        {
          id: 'welcome_msg_offline',
          sender: 'aegis',
          text: `🛡️ **AEGIS EMERGENCY ADVISOR (OFFLINE MODE)**\n\nOperating in **Zero-Internet Local Mode**. All NDMA disaster protocols (Floods, Cyclones, Earthquakes, Lightning, Heat, Evacuation) are fully accessible without a network connection.`,
          timestamp: new Date().toISOString(),
          source: 'OFFLINE_KB',
          actionRecommendations: [
            'Flood Safety Rules',
            '72-Hour Survival Kit',
            'Lightning Precautions',
          ],
        },
      ]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorBanner(null);
    setInputText('');

    const userMessageId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      source: 'OFFLINE_KB',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const effectiveOffline = chatMode === 'offline' || !isOnline;

    // Check if we can/should use the offline client engine directly
    if (effectiveOffline) {
      setTimeout(() => {
        const localResult = queryLocalKnowledgeBase(text);
        const assistantMsg: ChatMessage = {
          id: `aegis_${Date.now()}`,
          sender: 'aegis',
          text: localResult.response,
          timestamp: new Date().toISOString(),
          source: 'OFFLINE_KB',
          emergencyCategory: localResult.category as any,
          actionRecommendations: localResult.actionRecommendations,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 400);
      return;
    }

    // Attempt backend call (Online AI with backend fallback)
    try {
      const response = await ApiService.sendChatMessage(text, false);
      if (response.success && response.data) {
        const reply = response.data;
        setMessages((prev) => [...prev, reply]);
      } else {
        // Fall back to client local KB
        const localResult = queryLocalKnowledgeBase(text);
        const fallbackMsg: ChatMessage = {
          id: `aegis_${Date.now()}`,
          sender: 'aegis',
          text: `${localResult.response}\n\n*(Note: Operating via local offline fallback due to network interruption)*`,
          timestamp: new Date().toISOString(),
          source: 'OFFLINE_KB',
          emergencyCategory: localResult.category as any,
          actionRecommendations: localResult.actionRecommendations,
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      // Absolute local client fallback
      const localResult = queryLocalKnowledgeBase(text);
      const fallbackMsg: ChatMessage = {
        id: `aegis_${Date.now()}`,
        sender: 'aegis',
        text: `${localResult.response}\n\n*(Note: Operating via local offline cache)*`,
        timestamp: new Date().toISOString(),
        source: 'OFFLINE_KB',
        emergencyCategory: localResult.category as any,
        actionRecommendations: localResult.actionRecommendations,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Clear all emergency conversation messages?')) {
      try {
        await ApiService.clearChatHistory();
      } catch {
        // Ignore network errors
      }
      setMessages([
        {
          id: 'cleared_welcome',
          sender: 'aegis',
          text: '🛡️ Conversation history cleared. Ask any disaster safety or evacuation question below.',
          timestamp: new Date().toISOString(),
          source: 'OFFLINE_KB',
          actionRecommendations: ['Flood Safety', 'Evacuation Pack', 'Earthquake Protocol'],
        },
      ]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionClick = (action: string) => {
    if (action.toLowerCase().includes('shelter') || action.toLowerCase().includes('evacuat')) {
      setActiveView('safe-evacuation');
    } else if (action.toLowerCase().includes('sos') || action.toLowerCase().includes('beacon')) {
      setActiveView('sos-beacon');
    } else if (action.toLowerCase().includes('checklist') || action.toLowerCase().includes('survival')) {
      setActiveView('survival-guide');
    } else if (action.toLowerCase().includes('safe') && action.toLowerCase().includes('ping')) {
      setActiveView('safe-beacon');
    } else {
      // Send as query
      handleSendMessage(action);
    }
  };

  const isActuallyOffline = chatMode === 'offline' || !isOnline;

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] min-h-[580px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
      {/* 1. Tactical Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-cyan-glow">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                <span>Ask Aegis</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  AI v2.4
                </span>
              </h2>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              National Disaster Management Authority (NDMA) Knowledge Engine
            </div>
          </div>
        </div>

        {/* Mode Selector & Clear History */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setChatMode('auto')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chatMode === 'auto'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Auto-switch between Cloud AI and Local Database"
            >
              Auto
            </button>
            <button
              onClick={() => setChatMode('offline')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                chatMode === 'offline'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Force Offline Mode - 100% Local DB (Zero Internet Required)"
            >
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </button>
            <button
              onClick={() => setChatMode('online')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                chatMode === 'online'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Online Cloud AI Mode"
            >
              <Wifi className="w-3 h-3" />
              <span>Online AI</span>
            </button>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Mode & Safety Status Strip */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {isActuallyOffline ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              OFFLINE MODE: LOCAL NDMA KNOWLEDGE BASE ACTIVE (0-DATA)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              ONLINE MODE: CLOUD AI + OFFLINE RETRIEVAL BACKUP
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Advisory Only. In life danger, call <strong>112 / 1078</strong></span>
        </div>
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isOfflineSource = msg.source === 'OFFLINE_KB';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-cyan-glow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 transition-all ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Header tags for assistant messages */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">AEGIS ADVISOR</span>
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          isOfflineSource
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {isOfflineSource ? 'LOCAL NDMA DB' : 'CLOUD AI'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}

                {/* Message Body Content */}
                <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Action Recommendations / Directives */}
                {!isUser && msg.actionRecommendations && msg.actionRecommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1.5 uppercase">
                      Recommended Next Actions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actionRecommendations.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
                        >
                          <span>{act}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] font-mono mt-2 text-right ${
                    isUser ? 'text-cyan-200/80' : 'text-slate-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Radar Animation */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 rounded-tl-none flex items-center gap-3 text-xs font-mono text-cyan-400">
              <div className="flex space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Searching disaster safety knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Emergency Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Suggested:
        </span>
        {SUGGESTED_QUERIES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.query)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 hover:border-cyan-500/30 whitespace-nowrap transition-all active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 5. Input Area */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isActuallyOffline
                ? 'Type emergency question (e.g. "What to do in a flood?", "Evacuation pack?")...'
                : 'Ask Aegis emergency advisor...'
            }
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
