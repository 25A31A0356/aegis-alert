import React from 'react';
import { Sparkles, Globe, Cpu, Satellite, Radio, Users, Brain, ArrowUpRight } from 'lucide-react';

export const FutureUpdatesPage: React.FC = () => {
  const roadmapItems = [
    {
      title: '22 Scheduled Regional Indian Languages Support',
      icon: Globe,
      status: 'Planned / Future',
      timeline: 'Q3 2026',
      description:
        'Full voice and text emergency synthesis in Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Odia, and Malayalam using low-latency on-device TTS/STT.',
    },
    {
      title: 'Quantized On-Device Edge AI (WebLLM / SLM)',
      icon: Cpu,
      status: 'Planned / Future',
      timeline: 'Q4 2026',
      description:
        'Local browser-executed 1.5B parameter quantized small language model for offline natural language conversation without requiring server relays.',
    },
    {
      title: 'ISRO MOSDAC & Cartosat Satellite Inundation Fusion',
      icon: Satellite,
      status: 'Planned / Future',
      timeline: 'Q1 2027',
      description:
        'Direct automated ingestion of Synthetic Aperture Radar (SAR) flood depth maps from ISRO Bhuvan and Sentinel-1 to auto-update road blockages.',
    },
    {
      title: 'LoRa 433/868 MHz Long-Range Citizen Mesh Nodes',
      icon: Radio,
      status: 'Planned / Future',
      timeline: 'Q2 2027',
      description:
        'Integration with sub-GHz ESP32 LoRa hardware beacons for 15km peer-to-peer SOS relay during total cellular telecommunication blackouts.',
    },
    {
      title: 'NDRF & SDRF Tactical Unit Dispatch Console',
      icon: Users,
      status: 'Planned / Future',
      timeline: 'Q3 2027',
      description:
        'Dedicated authority portal for real-time rescue boat telemetry, fuel logistics, victim tracking, and drone reconnaissance video feeds.',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>AEGISALERT INNOVATION ROADMAP & FUTURE CAPABILITIES</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Planned technological advancements for next-generation disaster management and citizen resilience.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
          SIH LONG-TERM VISION
        </span>
      </div>

      {/* Roadmap Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmapItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-orange text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                      {item.timeline}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Architecture Target: v2.0</span>
                <span className="text-cyan-400 flex items-center gap-0.5">
                  Research Documented <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
