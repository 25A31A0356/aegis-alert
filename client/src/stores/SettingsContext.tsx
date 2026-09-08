import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@shared';
import { ApiService } from '../services/api';

interface SettingsContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  language: string;
  setLanguage: (lang: string) => void;
  webLink: string;
  logout: () => void;
}

const defaultProfile: UserProfile = {
  id: 'usr_default_01',
  name: 'Sai Teja',
  phone: '+91 98765 43210',
  bloodGroup: 'O+ Positive',
  medicalConditions: ['Asthma (Inhaler needed)'],
  emergencyContact: {
    name: 'Kalyan Kumar',
    phone: '+91 98765 00001',
    relationship: 'Father',
  },
  preferredLanguage: 'en',
  locationPreferences: {
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530001',
    autoDetect: true,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('aegis_profile');
    return cached ? JSON.parse(cached) : defaultProfile;
  });

  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('aegis_lang') || 'en';
  });

  const [webLink, setWebLink] = useState<string>('');

  useEffect(() => {
    // Determine the active application URL dynamically
    setWebLink(window.location.origin);

    // Fetch live profile from backend
    ApiService.getProfile().then((res) => {
      if (res.success && res.data) {
        setProfileState(res.data);
        localStorage.setItem('aegis_profile', JSON.stringify(res.data));
      }
    });
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    localStorage.setItem('aegis_profile', JSON.stringify(newProfile));
    ApiService.updateProfile(newProfile);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('aegis_lang', lang);
  };

  const logout = () => {
    localStorage.removeItem('aegis_profile');
    localStorage.removeItem('aegis_auth_token');
    window.location.reload();
  };

  return (
    <SettingsContext.Provider
      value={{
        profile,
        setProfile,
        language,
        setLanguage,
        webLink,
        logout,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
