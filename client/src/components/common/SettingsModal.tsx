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
} from 'lucide-react';
import { useSettings } from '../../stores/SettingsContext';
import { useTheme } from '../../stores/ThemeContext';

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
    bloodGroup: profile.bloodGroup || '',
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyContactRelation: profile.emergencyContact.relationship,
    city: profile.locationPreferences.city,
    state: profile.locationPreferences.state,
    pincode: profile.locationPreferences.pincode,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: formData.name,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
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
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const languages = [
    { code: 'en', name: 'English (Default)', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-56 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col justify-between overflow-x-auto md:overflow-x-visible">
          <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-0">
            <div className="hidden md:block px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              System Settings
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Your Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'language'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Language</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'theme'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('weblink')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'weblink'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>Web Link</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'help'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & Guide</span>
            </button>
          </div>

          <div className="hidden md:block pt-3 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              {activeTab === 'profile' && 'Citizen Emergency Profile'}
              {activeTab === 'language' && 'Regional Language Selection'}
              {activeTab === 'theme' && 'Interface Display Theme'}
              {activeTab === 'weblink' && 'Application Web Link'}
              {activeTab === 'help' && 'Emergency Feature Assistance'}
            </div>
            <button
              onClick={onClose}
              aria-label="Close settings"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-slate-200">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="font-bold text-slate-300 mb-2 flex items-center gap-1.5 text-xs text-red-400">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Emergency Contact Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Emergency Phone</label>
                      <input
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="font-bold text-slate-300 mb-2 flex items-center gap-1.5 text-xs text-cyan-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location Preferences</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  {savedSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* 2. Language Tab */}
            {activeTab === 'language' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400">
                  Select your preferred language. AegisAlert emergency advisories and AI voice response will adapt to your choice.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        language === lang.code
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{lang.native}</div>
                        <div className="text-xs text-slate-400">{lang.name}</div>
                      </div>
                      {language === lang.code && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  Choose your interface theme. Dark mode provides low-glare night emergency readability, while Light mode offers high-contrast sunlight visibility.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      theme === 'dark'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-cyan-glow'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-8 h-8 text-cyan-400" />
                    <div className="text-center">
                      <div className="font-bold text-sm">Dark Command Mode</div>
                      <div className="text-[11px] text-slate-400">Emergency Tactical Center</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      theme === 'light'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-cyan-glow'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-8 h-8 text-amber-400" />
                    <div className="text-center">
                      <div className="font-bold text-sm">Light High-Contrast</div>
                      <div className="text-[11px] text-slate-400">Daylight & Outdoor Clarity</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Web Link Tab */}
            {activeTab === 'weblink' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="text-slate-400 mb-1 font-semibold">Active Application Web Link</div>
                  <div className="font-mono text-cyan-400 text-sm break-all font-bold">{webLink}</div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    During local development, this reflects your localhost URL. In production, it dynamically resolves to your deployed domain.
                  </div>
                </div>
              </div>
            )}

            {/* 5. Help Tab */}
            {activeTab === 'help' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="font-bold text-sm text-cyan-400 mb-1">🚨 SOS Emergency Beacon</div>
                  <p className="text-slate-300">
                    Broadcasting SOS broadcasts your GPS coordinates and situation parameters to local rescue dispatchers. It includes a confirmation step to prevent accidental triggers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="font-bold text-sm text-emerald-400 mb-1">🛡️ Safe Evacuation & Shelters</div>
                  <p className="text-slate-300">
                    Provides verified high-ground shelter coordinates, live bed/food capacity, and elevation-aware evacuation routes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="font-bold text-sm text-amber-400 mb-1">🤖 Ask Aegis Offline AI</div>
                  <p className="text-slate-300">
                    Operates without an active internet connection using a built-in NDMA disaster safety knowledge base for instant survival guidance.
                  </p>
                </div>

                <div className="text-center pt-2 text-slate-400 font-mono text-[11px]">
                  National Emergency Helpline: <span className="text-red-400 font-bold">112</span> • Disaster Services: <span className="text-cyan-400 font-bold">1070 / 1077</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
