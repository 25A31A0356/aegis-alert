import React, { useState } from 'react';
import {
  X,
  User,
  Globe,
  Sun,
  Moon,
  Link,
  HelpCircle,
  LogOut,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Radio,
  Navigation,
  BookOpen,
  Users,
  AlertTriangle,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { useSettings } from '../../stores/SettingsContext';
import { useTheme } from '../../stores/ThemeContext';
import { UserProfile } from '@shared';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'language' | 'theme' | 'weblink' | 'help' | 'signout';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, setProfile, language, setLanguage, webLink, logout } = useSettings();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    bloodGroup: profile.bloodGroup || 'O+ Positive',
    medicalConditions: profile.medicalConditions || ['Asthma (Inhaler needed)'],
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyContactRelation: profile.emergencyContact.relationship,
    city: profile.locationPreferences.city,
    state: profile.locationPreferences.state,
    pincode: profile.locationPreferences.pincode,
  });

  const [newMedCondition, setNewMedCondition] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...profile,
      name: formData.name,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      medicalConditions: formData.medicalConditions,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelation,
      },
      locationPreferences: {
        ...profile.locationPreferences,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    setProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddMedCondition = () => {
    if (newMedCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newMedCondition.trim()],
      }));
      setNewMedCondition('');
    }
  };

  const handleRemoveMedCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index),
    }));
  };

  const handleCopyWebLink = () => {
    navigator.clipboard.writeText(webLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const languages = [
    { code: 'en', name: 'English (Default)', native: 'English', region: 'National / Global' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'North / Central India' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh / Telangana' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu / Puducherry' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal / Tripura' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala / Lakshadweep' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha Coastal Belt' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] animate-fadeIn">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-60 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col justify-between overflow-x-auto md:overflow-x-visible shrink-0">
          <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-0">
            <div className="hidden md:block px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              SYSTEM SETTINGS
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('language')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'language'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Regional Language</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'theme'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Theme / Display</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weblink')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'weblink'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>App Web Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'help'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & Architecture</span>
            </button>
          </div>

          <div className="hidden md:block pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSignoutConfirm(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* Modal Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
            <div className="font-bold text-xs text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>
                {activeTab === 'profile' && '1. CITIZEN EMERGENCY PROFILE'}
                {activeTab === 'language' && '2. INDIAN REGIONAL LANGUAGES'}
                {activeTab === 'theme' && '3. DUAL DISPLAY THEME MODE'}
                {activeTab === 'weblink' && '4. CONFIGURED APPLICATION URL'}
                {activeTab === 'help' && '5. AEGISALERT FEATURE ARCHITECTURE'}
                {activeTab === 'signout' && '6. SESSION MANAGEMENT'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-slate-200">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  Emergency responders use these medical and contact parameters during active rescue dispatches.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 focus:outline-none"
                  >
                    {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative', 'O+ Positive', 'O- Negative'].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Medical Conditions */}
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Medical Conditions & Daily Medications</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Type 1 Diabetic (Insulin), Cardiac Pacemaker, Asthma"
                      value={newMedCondition}
                      onChange={(e) => setNewMedCondition(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedCondition}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-slate-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formData.medicalConditions.map((cond, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 text-[11px]"
                      >
                        <span>{cond}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedCondition(idx)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Designated Emergency Contact Person</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Preferences */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Primary Disaster Location Ward</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  {savedSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold text-xs font-mono">
                      <CheckCircle2 className="w-4 h-4" /> Profile Successfully Saved in Database!
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl flex items-center gap-2 transition-all shadow-cyan-glow uppercase text-xs"
                  >
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* 2. Language Tab */}
            {activeTab === 'language' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>MULTI-LINGUAL ADVISORY ARCHITECTURE</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    AegisAlert is architected for India's 22 official languages. Selected language controls NDMA disaster advisories, synthesized emergency voice output, and UI terminology.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {languages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-black text-sm">{lang.native}</div>
                          <div className="text-xs text-slate-400">{lang.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{lang.region}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Sun className="w-4 h-4" />
                    <span>HIGH-CONTRAST DUAL THEME ENGINE</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Dark theme provides glare-free situational awareness during night blackouts. Light theme guarantees maximum visibility in bright direct sunlight during field evacuations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      theme === 'dark'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <Moon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="text-center">
                      <div className="font-black text-sm">Dark Command Mode</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">Emergency Tactical Center</div>
                    </div>
                    {theme === 'dark' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black font-mono">
                        ACTIVE THEME
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      theme === 'light'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <Sun className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="text-center">
                      <div className="font-black text-sm">Light High-Contrast Mode</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">Outdoor & Daylight Clarity</div>
                    </div>
                    {theme === 'light' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black font-mono">
                        ACTIVE THEME
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 4. Web Link Tab */}
            {activeTab === 'weblink' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 font-bold font-mono uppercase text-[10px]">
                      Configured Application Endpoint
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      LIVE INSTANCE
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <span className="font-mono text-cyan-400 text-sm font-black break-all">
                      {webLink}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyWebLink}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-mono font-bold flex items-center gap-1 border border-slate-700 transition-colors shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-1">
                    <div className="text-slate-300 font-bold">Deployment Notice:</div>
                    <p className="leading-relaxed">
                      During local development and testing, this reflects your active local host URL (<code className="text-cyan-400 font-bold">{webLink}</code>). In cloud deployment, this automatically resolves to your verified production domain.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Help Tab */}
            {activeTab === 'help' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-red-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>1. SOS Emergency Beacon</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Broadcasts encrypted emergency distress packets with trapped person counts, medical urgency, water level, and GPS coordinates. Features a confirmation modal to avoid false alarms and progresses through 5 lifecycle stages until resolution.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4" />
                    <span>2. Safe Evacuation & Shelters</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Identifies verified high-ground cyclone/flood relief centers with real-time bed capacity, water/medical availability, and elevation-aware evacuation routes with hazard bypass.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />
                    <span>3. Ask Aegis Dual-Engine AI</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Provides zero-internet disaster safety guidance using an embedded 9-domain NDMA knowledge base. Automatically upgrades to cloud LLM intelligence when an internet connection is detected.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>4. NDMA Survival Guide & Go-Bag Kit</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Step-by-step Before, During, and After protocols for 7 disasters, high-contrast Do's/Don'ts matrix, and an interactive 72-hour survival checklist.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>5. Crowdsourced Community Hazard Reporting</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Allows citizens to report flooded roads, fallen trees, and downed power lines. Follows a strict triage progression (Submitted → Under Review → Verified → Resolved).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-[11px] text-slate-400">
                  National Disaster Helpline: <strong className="text-red-400">1078</strong> • Emergency Services: <strong className="text-cyan-400">112</strong> • Ambulance: <strong className="text-emerald-400">108</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      {showSignoutConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-100">Sign Out Session?</h3>
                <p className="text-xs text-slate-400">Clear citizen session and local cache</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Signing out clears your cached citizen credentials, offline session token, and resets local preferences.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSignoutConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-red-glow"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
