
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type ThemeType = 'light' | 'dark' | 'system';
type LanguageType = 'ar' | 'en';

interface SettingsContextType {
  theme: ThemeType;
  language: LanguageType;
  businessInfo: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    tax: number;
  };
  setTheme: (theme: ThemeType) => void;
  setLanguage: (language: LanguageType) => void;
  updateBusinessInfo: (info: Partial<SettingsContextType['businessInfo']>) => void;
}

const defaultSettings: SettingsContextType = {
  theme: 'light',
  language: 'ar',
  businessInfo: {
    name: 'اسم المتجر',
    logo: '',
    address: 'عنوان المتجر',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    tax: 15,
  },
  setTheme: () => {},
  setLanguage: () => {},
  updateBusinessInfo: () => {},
};

const SETTINGS_STORAGE_KEY = 'app-settings';

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Omit<SettingsContextType, 'setTheme' | 'setLanguage' | 'updateBusinessInfo'>>(
    () => {
      // Load settings from localStorage if available
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
  );

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setTheme = (theme: ThemeType) => {
    setSettings(prev => ({ ...prev, theme }));
    toast({
      title: "تم تغيير المظهر",
      description: `تم تغيير المظهر إلى ${theme === 'light' ? 'الفاتح' : theme === 'dark' ? 'الداكن' : 'النظام'}`,
    });
  };

  const setLanguage = (language: LanguageType) => {
    setSettings(prev => ({ ...prev, language }));
    toast({
      title: "تم تغيير اللغة",
      description: `تم تغيير اللغة إلى ${language === 'ar' ? 'العربية' : 'الإنجليزية'}`,
    });
  };

  const updateBusinessInfo = (info: Partial<SettingsContextType['businessInfo']>) => {
    setSettings(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        ...info
      }
    }));
    toast({
      title: "تم تحديث معلومات المتجر",
      description: "تم تحديث معلومات المتجر بنجاح",
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setLanguage,
        updateBusinessInfo
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
