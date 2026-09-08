import React from 'react';
import { ActiveView } from '../types';
import {
  Home,
  Navigation,
  ShieldAlert,
  Radio,
  BookOpen,
  Users,
  MapPin,
  Clock,
  History,
  Download,
  Sparkles,
} from 'lucide-react';

interface AppLayoutProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ activeView, setActiveView, children }) => {
  const leftNavItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: '1. Home Dashboard', icon: Home },
    { id: 'safe-evacuation', label: '2. Safe Evacuation', icon: Navigation, badge: 'Live Shelters' },
    { id: 'sos-beacon', label: '3. SOS Emergency', icon: ShieldAlert, badge: 'High Priority' },
  ];

  const centerNavItem = { id: 'ask-aegis' as ActiveView, label: '4. Ask Aegis AI', icon: Radio };

  const rightNavItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'survival-guide', label: '5. Survival Guide', icon: BookOpen },
    { id: 'community-report', label: '6. Community Report', icon: Users },
    { id: 'safe-beacon', label: '7. Safe Beacon (Ping)', icon: Radio },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Zone Quick-Switch Bar (Desktop Viewport) */}
      <div className="hidden lg:block bg-slate-900/90 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          {/* Left Zone Controls */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">
              [LEFT ZONE]
            </span>
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    isActive
                      ? item.id === 'sos-beacon'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-red-glow'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Center Zone Controls */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">
              [CENTER ZONE]
            </span>
            <button
              onClick={() => setActiveView(centerNavItem.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeView === centerNavItem.id
                  ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-400/60 shadow-cyan-glow'
                  : 'text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>{centerNavItem.label}</span>
            </button>
          </div>

          {/* Right Zone Controls */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">
              [RIGHT ZONE]
            </span>
            {rightNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Feature View Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 mb-16 lg:mb-4">{children}</main>

      {/* Mobile/Tablet Adaptive Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('safe-evacuation')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeView === 'safe-evacuation'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-5 h-5 mb-0.5" />
          <span>Evacuate</span>
        </button>

        {/* Floating Red SOS Button in Mobile Nav */}
        <button
          onClick={() => setActiveView('sos-beacon')}
          className={`-mt-4 p-3 rounded-full bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-red-glow border-2 border-red-300 flex items-center justify-center transition-transform active:scale-95 ${
            activeView === 'sos-beacon' ? 'ring-4 ring-red-500/40 scale-105' : ''
          }`}
          aria-label="Emergency SOS"
        >
          <ShieldAlert className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveView('ask-aegis')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeView === 'ask-aegis' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span>Ask Aegis</span>
        </button>

        <button
          onClick={() => setActiveView('survival-guide')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeView === 'survival-guide'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Guide</span>
        </button>
      </nav>
    </div>
  );
};
