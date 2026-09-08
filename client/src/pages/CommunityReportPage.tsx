import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Send,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  ThumbsUp,
  Filter,
} from 'lucide-react';
import { CommunityReport, CommunityReportCategory, SeverityLevel } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';

export const CommunityReportPage: React.FC = () => {
  const { userLocation } = useEmergency();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [category, setCategory] = useState<CommunityReportCategory>('Flooding');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(userLocation.address || 'Beach Road, Sector 4');
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const res = await ApiService.getCommunityReports();
    if (res.success && res.data) {
      setReports(res.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await ApiService.submitCommunityReport({
        category,
        title,
        description,
        location,
        coordinates: userLocation,
        severity,
      });

      if (res.success && res.data) {
        setReports((prev) => [res.data!, ...prev]);
        setTitle('');
        setDescription('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Submit report failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: CommunityReportCategory[] = [
    'Flooding',
    'Road Blockage',
    'Fallen Trees',
    'Infrastructure Damage',
    'People Needing Assistance',
    'Shelter Issues',
    'Other',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Users className="w-5 h-5" />
            <span>6. CROWDSOURCED COMMUNITY HAZARD REPORTING</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit on-ground incident observations (flooding, road blockage, structural damage) to assist responders.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono font-bold">
          {reports.length} ACTIVE INCIDENTS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Incident Submission Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            File Ground Incident Report
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityReportCategory)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Incident Title</label>
              <input
                type="text"
                placeholder="e.g. Submerged Underpass / High-Tension Cable Fallen"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Location / Landmark</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Severity Assessment</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as SeverityLevel[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 rounded-lg font-bold border transition-all ${
                      severity === sev
                        ? sev === 'HIGH'
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : sev === 'MEDIUM'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Describe danger level, approximate water depth, road passability..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              ></textarea>
            </div>

            {submitSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Report Submitted (Status: Submitted)
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-cyan-glow"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Report...' : 'Submit Incident Report'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Live Crowdsourced Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Recent Community Incidents & Ground Telemetry
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-Time Community Feed</span>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                No incident reports filed in this sector yet.
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 text-[10px] font-bold">
                          {report.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            report.severity === 'HIGH'
                              ? 'badge-red'
                              : report.severity === 'MEDIUM'
                              ? 'badge-yellow'
                              : 'badge-green'
                          }`}
                        >
                          {report.severity} SEVERITY
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Status: {report.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100">{report.title}</h4>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{report.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotes || 1} Confirmations</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
