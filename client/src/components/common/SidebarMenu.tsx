import React from 'react';
import {
  X,
  MapPin,
  Clock,
  History as HistoryIcon,
  Sparkles,
  Download,
  Home,
  ShieldAlert,
  Navigation,
  BookOpen,
  Users,
  Radio,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { ActiveView } from '../../types';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
}) => {
  if (!isOpen) return null;

  const menuItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      id: 'home',
      label: 'Home Dashboard',
      icon: Home,
      description: 'Live alerts, risk score, and nearby status',
    },
    {
      id: 'safe-evacuation',
      label: 'Safe Evacuation',
      icon: Navigation,
      description: 'Verified shelters, safe routes, and elevation',
    },
    {
      id: 'sos-beacon',
      label: 'SOS Emergency Beacon',
      icon: ShieldAlert,
      description: 'One-tap emergency broadcast & location sharing',
    },
    {
      id: 'ask-aegis',
      label: 'Ask Aegis (AI Assistant)',
      icon: Radio,
      description: 'Offline/Online disaster safety chatbot',
    },
    {
      id: 'survival-guide',
      label: 'Survival Guide',
      icon: BookOpen,
      description: 'NDMA Do’s & Don’ts, 72h survival checklists',
    },
    {
      id: 'community-report',
      label: 'Community Report',
      icon: Users,
      description: 'Crowdsourced hazard and road damage reports',
    },
    {
      id: 'safe-beacon',
      label: 'Safe Beacon ("I Am Safe")',
      icon: Radio,
      description: 'Sub-1KB low-bandwidth family safety check-in',
    },
    {
      id: 'offline-maps',
      label: 'Offline Maps',
      icon: MapPin,
      description: 'Cached geographic tiles, shelters & safe zones',
    },
    {
      id: 'recent-events',
      label: 'Recent Disaster Events',
      icon: Clock,
      description: 'Past and active regional hazard incident logs',
    },
    {
      id: 'history',
      label: 'Your History',
      icon: HistoryIcon,
      description: 'Your logged SOS, safe pings, and reports',
    },
    {
      id: 'downloads',
      label: 'Downloads & Cache',
      icon: Download,
      description: 'Locally stored offline guides and map data',
    },
    {
      id: 'future-updates',
      label: 'Future Updates (Roadmap)',
      icon: Sparkles,
      description: 'Upcoming multi-language and satellite features',
    },
    {
      id: 'presentation',
      label: 'SIH Presentation Deck',
      icon: Layers,
      description: '4-Slide hackathon presentation pitch (Proposed Solution, Tech, Viability, Impact)',
    },
  ];

  const handleSelect = (id: ActiveView) => {
    setActiveView(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-sm bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100">AEGIS NAVIGATION</div>
              <div className="text-[11px] text-slate-400">Emergency Quick Switcher</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-850/40 hover:bg-slate-800/80 text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-800 text-center text-[11px] text-slate-500 bg-slate-900/60 font-mono">
          AegisAlert System • SIH Disaster Edition
        </div>
      </div>
    </div>
  );
};
