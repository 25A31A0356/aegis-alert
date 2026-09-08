import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { ChatMessage, ChatSource } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';

export const AskAegisPage: React.FC = () => {
  const { isOnline } = useEmergency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'init_01',
    sender: 'aegis',
    text: 'Hello! I am Aegis, your AI Emergency and Disaster Response Assistant. I am fully operational in offline mode with NDMA safety protocols. How can I assist your safety today?',
    timestamp: new Date().toISOString(),
    source: 'OFFLINE_KB',
    actionRecommendations: [
      'Flood Precautions',
      'Cyclone Safety Rules',
      'Earthquake Drop & Cover',
      '72-Hour Survival Kit',
      'First Aid Response',
    ],
  };

  useEffect(() => {
    // Load chat history or start with initial greeting
    ApiService.getChatHistory().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([initialGreeting]);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      source: isOnline && !forceOffline ? 'ONLINE_AI' : 'OFFLINE_KB',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await ApiService.sendChatMessage(query, forceOffline || !isOnline);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
      } else {
        // Fallback local rule matching if network is severed
        const fallbackMsg: ChatMessage = {
          id: `aegis_fb_${Date.now()}`,
          sender: 'aegis',
          text: `[OFFLINE SURVIVAL PROTOCOL]\nYour query regarding "${query}" has been received. Please follow basic emergency safety:\n1. Keep off flooded roadways and avoid downstream areas.\n2. Disconnect electricity and LPG valves.\n3. Gather clean water, ID documents, and power banks.\n4. If in immediate peril, activate the SOS Emergency Beacon.`,
          timestamp: new Date().toISOString(),
          source: 'OFFLINE_KB',
          actionRecommendations: ['Safe Evacuation Map', 'Trigger SOS Beacon'],
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.warn('Chat request fallback triggered:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    'What should I do during a severe flood?',
    'How do I prepare for category 3 cyclone winds?',
    'Earthquake drop, cover, and hold steps',
    'What goes into a 72-hour family survival kit?',
    'Emergency first-aid for bleeding wounds',
  ];

  return (
    <div className="space-y-4 animate-fadeIn flex flex-col h-[calc(100vh-12rem)] min-h-[550px]">
      {/* Header / Mode Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-100">4. ASK AEGIS — EMERGENCY AI ASSISTANT</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                NDMA Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant life-safety instructions, first-aid protocols, and offline evacuation advice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setForceOffline(!forceOffline)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              forceOffline || !isOnline
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {forceOffline || !isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>OFFLINE MODE (LOCAL KB)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>ONLINE ASSISTANT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isAegis = msg.sender === 'aegis';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAegis ? 'justify-start' : 'justify-end'}`}
            >
              {isAegis && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shrink-0 shadow-cyan-glow">
                  <Bot className="w-4 h-4 text-slate-950" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                  isAegis
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium ml-auto'
                }`}
              >
                {/* Source Badge for Assistant */}
                {isAegis && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-800/80">
                    <span className="flex items-center gap-1 font-bold text-cyan-400">
                      <Sparkles className="w-3 h-3" /> AEGIS ASSISTANT
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {msg.source === 'OFFLINE_KB' ? 'LOCAL OFFLINE KB' : 'ONLINE AI'}
                    </span>
                  </div>
                )}

                {/* Message Text with Linebreak Formatting */}
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Action Recommendation Chips */}
                {msg.actionRecommendations && msg.actionRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                    {msg.actionRecommendations.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-[11px] font-semibold border border-slate-700/60 transition-colors"
                      >
                        {chip} →
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] font-mono ${isAegis ? 'text-slate-500' : 'text-cyan-100/70'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {!isAegis && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Aegis is analyzing emergency protocols...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Emergency Prompts Bar */}
      <div className="overflow-x-auto pb-1 flex items-center gap-2 shrink-0 text-xs">
        <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0">SUGGESTIONS:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask anything about flood evacuation, cyclone protection, or first aid..."
          className="flex-1 px-4 py-2.5 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-all shadow-cyan-glow"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Aegis</span>
        </button>
      </form>
    </div>
  );
};
