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
  Search,
  Image as ImageIcon,
  X,
  RefreshCw,
  ShieldAlert,
  ChevronDown,
  Check,
  Eye,
  AlertOctagon,
  Sparkles,
  Waves,
  ShieldCheck,
  ArrowLeft,
  Flame,
  LifeBuoy,
  Home,
  CheckSquare,
} from 'lucide-react';
import {
  CommunityReport,
  CommunityReportCategory,
  CommunityReportStatus,
  SeverityLevel,
  GeoCoordinate,
} from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';
import { ActiveView } from '../types';

interface CommunityReportPageProps {
  setActiveView?: (view: ActiveView) => void;
}

interface CategoryOption {
  value: CommunityReportCategory;
  label: string;
  icon: any;
  color: string;
  bg: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: 'Flooding',
    label: 'Flooding',
    icon: Waves,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    value: 'Road blockage',
    label: 'Road blockage',
    icon: AlertOctagon,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    value: 'Fallen trees',
    label: 'Fallen trees',
    icon: AlertTriangle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    value: 'Infrastructure damage',
    label: 'Infrastructure damage',
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
  },
  {
    value: 'People needing assistance',
    label: 'People needing assistance',
    icon: LifeBuoy,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  {
    value: 'Shelter issues',
    label: 'Shelter issues',
    icon: Home,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  {
    value: 'Other emergency situations',
    label: 'Other emergency situations',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
];

const SAMPLE_INCIDENT_PHOTOS = [
  {
    label: 'Waterlogged Underpass',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Uprooted Storm Tree',
    url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Damaged Road Surface',
    url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=600&q=80',
  },
];

export const CommunityReportPage: React.FC<CommunityReportPageProps> = ({
  setActiveView = () => {},
}) => {
  const { userLocation } = useEmergency();

  // Feed State
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [category, setCategory] = useState<CommunityReportCategory>('Flooding');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [locationName, setLocationName] = useState<string>(
    userLocation.address || 'Beach Road, Sector 4, Visakhapatnam'
  );
  const [coordinates, setCoordinates] = useState<GeoCoordinate>({
    lat: userLocation.lat || 17.6868,
    lng: userLocation.lng || 83.2185,
  });
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form Validation & Status
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<CommunityReport | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Lightbox Modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Active Tab View Mode on Mobile/Tablet
  const [activeTab, setActiveTab] = useState<'feed' | 'report'>('feed');

  useEffect(() => {
    loadReports();
  }, [activeStatusFilter, activeCategoryFilter]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.getCommunityReports({
        status: activeStatusFilter !== 'ALL' ? activeStatusFilter : undefined,
        category: activeCategoryFilter !== 'ALL' ? activeCategoryFilter : undefined,
      });

      if (res.success && res.data) {
        setReports(res.data);
      } else {
        // Fallback local storage check if offline
        const localSaved = localStorage.getItem('aegis_community_reports_queue');
        if (localSaved) {
          try {
            setReports(JSON.parse(localSaved));
          } catch {}
        }
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle GPS Refresh
  const handleRefreshGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
        },
        (err) => {
          console.warn('Geolocation failed, retaining default coordinates:', err.message);
        }
      );
    }
  };

  // Handle Image File Upload (Convert to base64 Data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, image: 'Image size must be under 3 MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!category) {
      errors.category = 'Please select a disaster type';
    }

    if (!description.trim()) {
      errors.description = 'Incident description is required';
    } else if (description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters for responders';
    }

    if (!locationName.trim()) {
      errors.location = 'Incident location or landmark is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler (Strictly creates report with status 'Submitted')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<CommunityReport> = {
        category,
        title: title.trim() || `${category} reported at ${locationName.trim()}`,
        description: description.trim(),
        location: locationName.trim(),
        coordinates,
        severity,
        imageUrl: imagePreview || undefined,
        status: 'Submitted', // CRITICAL: Never auto-verify
      };

      const res = await ApiService.submitCommunityReport(payload);

      if (res.success && res.data) {
        setReports((prev) => [res.data!, ...prev]);
        setSubmitSuccess(res.data);
        setTitle('');
        setDescription('');
        setImagePreview(null);
        setFormErrors({});

        // Auto switch back to feed to see newly submitted report
        setTimeout(() => {
          setActiveTab('feed');
        }, 1500);

        setTimeout(() => {
          setSubmitSuccess(null);
        }, 6000);
      } else {
        setSubmitError(res.error || 'Failed to submit report. Please retry.');
      }
    } catch (err: any) {
      console.error('Submit report error:', err);
      setSubmitError(err.message || 'Transmission error while sending report to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote / Confirm Incident
  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r))
      );
      await ApiService.upvoteCommunityReport(id);
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  // Status Simulator / Triage Transition
  const handleStatusChange = async (
    id: string,
    newStatus: CommunityReportStatus,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      await ApiService.updateCommunityReportStatus(id, newStatus);
    } catch (err) {
      console.error('Status transition failed:', err);
      loadReports();
    }
  };

  // Status Styling Helper
  const getStatusBadge = (status: CommunityReportStatus) => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          icon: Clock,
          label: 'Submitted',
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400 animate-pulse',
          icon: Eye,
          label: 'Under Review',
        };
      case 'Verified':
        return {
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
          icon: ShieldCheck,
          label: 'Verified',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          label: 'Resolved',
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          icon: Clock,
          label: status,
        };
    }
  };

  // Severity Styling Helper
  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
    }
  };

  // Filtered reports for search query
  const filteredReports = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  // Calculate status counts
  const submittedCount = reports.filter((r) => r.status === 'Submitted').length;
  const underReviewCount = reports.filter((r) => r.status === 'Under Review').length;
  const verifiedCount = reports.filter((r) => r.status === 'Verified').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
              title="Return to Home Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>6. CROWDSOURCED COMMUNITY HAZARD REPORTING</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time citizen reports on road blockages, flooding, downed power lines, and relief needs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{reports.length} ACTIVE COMMUNITY INCIDENTS</span>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex lg:hidden rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'feed'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400'
                }`}
              >
                Incident Feed
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'report'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400'
                }`}
              >
                + Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN (Cols 1-5): Incident Submission Form
            ========================================================================= */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            activeTab === 'feed' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>FILE GROUND INCIDENT REPORT</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                DB Live Sync
              </span>
            </div>

            {/* Success Banner */}
            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-1 shadow-emerald-glow animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Report Successfully Transmitted & Saved</span>
                </div>
                <p className="text-[11px] text-emerald-400/90 font-mono">
                  Report ID: <span className="underline">{submitSuccess.id}</span> • Initial Status:{' '}
                  <strong className="text-cyan-300">Submitted</strong> (Awaiting Triage Review)
                </p>
              </div>
            )}

            {/* Error Banner */}
            {submitError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 shadow-red-glow">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Field 1: Disaster Type (Category) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>Disaster Type / Category *</span>
                  <span className="text-[10px] font-mono text-cyan-400">Select accurate hazard</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setCategory(cat.value);
                          if (formErrors.category) {
                            setFormErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.category;
                              return copy;
                            });
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <CatIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="text-[11px] truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
                {formErrors.category && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">{formErrors.category}</p>
                )}
              </div>

              {/* Field 2: Incident Title (Optional Headline) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Incident Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${category} near Main Cross Road`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none text-xs"
                />
              </div>

              {/* Field 3: Location & GPS Coordinates */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Location / Landmark *</label>
                  <button
                    type="button"
                    onClick={handleRefreshGps}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Live GPS</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Underpass near RK Beach / RTC Complex Road"
                      value={locationName}
                      onChange={(e) => {
                        setLocationName(e.target.value);
                        if (formErrors.location) {
                          setFormErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.location;
                            return copy;
                          });
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                    <span>GPS Coordinates:</span>
                    <span className="text-cyan-400 font-bold">
                      {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
                {formErrors.location && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">{formErrors.location}</p>
                )}
              </div>

              {/* Field 4: Severity Assessment */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Severity Assessment *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((sev) => {
                    const isSelected = severity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 rounded-xl text-center font-bold border transition-all text-[11px] ${
                          isSelected
                            ? sev === 'CRITICAL'
                              ? 'bg-red-500/20 border-red-500 text-red-300 shadow-red-glow font-black'
                              : sev === 'HIGH'
                              ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-black'
                              : sev === 'MEDIUM'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-black'
                              : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 5: Detailed Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Detailed Incident Description *</label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {description.length} chars (min 10)
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe road passability, water depth, trapped individuals, fallen live electrical cables..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.description;
                        return copy;
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none text-xs leading-relaxed"
                />
                {formErrors.description && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Field 6: Optional Image Attachment */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>Optional Evidence Photo</span>
                  <span className="text-[10px] font-mono text-slate-400">Max 3 MB</span>
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl border border-cyan-500/40 overflow-hidden bg-slate-950 group">
                    <img
                      src={imagePreview}
                      alt="Attached evidence"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-500 transition-colors shadow-md"
                      title="Remove attached photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                      ✓ Image Attached
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 hover:border-cyan-500/50 cursor-pointer transition-all group">
                      <Camera className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 mb-1 transition-colors" />
                      <span className="text-xs text-slate-300 font-semibold group-hover:text-cyan-300">
                        Upload Incident Photo
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                        JPG, PNG, WebP supported
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Sample Photos for Testing */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                      <span className="font-mono text-slate-500 shrink-0">Demo Samples:</span>
                      {SAMPLE_INCIDENT_PHOTOS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImagePreview(sample.url)}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 font-mono transition-colors"
                        >
                          + {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {formErrors.image && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">{formErrors.image}</p>
                )}
              </div>

              {/* Status Notice */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>INITIAL STATUS POLICY:</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  All citizen submissions enter the database with status{' '}
                  <strong className="text-cyan-300">'Submitted'</strong>. Reports are marked{' '}
                  <strong className="text-blue-300">'Verified'</strong> only after on-ground responder review.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-cyan-glow text-xs uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Database...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Incident Report</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (Cols 6-12): Crowdsourced Incident Feed & History
            ========================================================================= */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            activeTab === 'report' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Status Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>FILTER INCIDENTS BY STATUS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Showing {filteredReports.length} of {reports.length} Reports
              </span>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Reports', count: reports.length },
                { id: 'Submitted', label: 'Submitted', count: submittedCount },
                { id: 'Under Review', label: 'Under Review', count: underReviewCount },
                { id: 'Verified', label: 'Verified', count: verifiedCount },
                { id: 'Resolved', label: 'Resolved', count: resolvedCount },
              ].map((tab) => {
                const isSelected = activeStatusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative pt-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search by hazard, street name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Incident Feed List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Loading on-ground community reports...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">
                  No incident reports match your current filter.
                </p>
                <p className="text-[11px] font-mono text-slate-500">
                  Submit a new report from the left form or reset the status filters.
                </p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const statusBadge = getStatusBadge(report.status);
                const StatusIcon = statusBadge.icon;
                const catOption =
                  CATEGORY_OPTIONS.find((c) => c.value === report.category) || CATEGORY_OPTIONS[0];
                const CatIcon = catOption.icon;

                return (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-lg space-y-3 transition-all"
                  >
                    {/* Header Row: Category, Severity, Status Badge, Timestamp */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Pill */}
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                          <CatIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{report.category}</span>
                        </span>

                        {/* Severity Badge */}
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                            report.severity
                          )}`}
                        >
                          {report.severity}
                        </span>

                        {/* Status Badge */}
                        <div
                          className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold flex items-center gap-1 ${statusBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusBadge.label}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(report.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Incident Title & Description */}
                    <div>
                      <h4 className="text-sm font-black text-slate-100 mb-1">{report.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>
                    </div>

                    {/* Attached Image Thumbnail (if present) */}
                    {report.imageUrl && (
                      <div className="pt-1">
                        <div
                          onClick={() => setSelectedImage(report.imageUrl!)}
                          className="relative inline-block rounded-xl overflow-hidden border border-slate-700 cursor-pointer group hover:border-cyan-400 transition-all"
                        >
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="h-28 w-44 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono gap-1">
                            <Eye className="w-3.5 h-3.5" /> Click to enlarge
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location, Upvotes & Status Simulation Controls */}
                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-400 font-mono">
                      {/* Location & GPS */}
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[240px]">{report.location}</span>
                        <span className="text-[10px] text-slate-500">
                          ({report.coordinates?.lat?.toFixed(2)}°, {report.coordinates?.lng?.toFixed(2)}°)
                        </span>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Upvote / Hazard Confirmation */}
                        <button
                          onClick={(e) => handleUpvote(report.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors flex items-center gap-1 text-[11px] font-bold"
                          title="Confirm this hazard observation"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{report.upvotes || 1} Confirmations</span>
                        </button>

                        {/* Status Transition Selector for Triage Testing */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-slate-500 uppercase">Triage:</span>
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(report.id, e.target.value as CommunityReportStatus, e)
                            }
                            className="px-2 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10px] font-mono rounded-lg focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Verified">Verified</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-2"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Expanded incident photo"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
