
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'rainbow' | 'minimalist' | 'dark' | 'professional';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  getThemeClasses: () => {
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    buttonPrimary: string;
    buttonSecondary: string;
    accent: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('rainbow');

  const getThemeClasses = () => {
    switch (themeMode) {
      case 'rainbow':
        return {
          background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          cardBackground: 'bg-gradient-to-br from-slate-800 to-slate-900',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-300',
          buttonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          buttonSecondary: 'bg-white/10 hover:bg-white/20',
          accent: 'from-green-500 to-blue-500',
          border: 'border-white/30'
        };
      case 'professional':
        return {
          background: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-800',
          cardBackground: 'bg-gradient-to-br from-slate-800/90 to-indigo-900/90',
          textPrimary: 'text-white',
          textSecondary: 'text-blue-200',
          buttonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
          buttonSecondary: 'bg-white/10 hover:bg-white/20',
          accent: 'from-blue-500 to-indigo-600',
          border: 'border-blue-300/30'
        };
      case 'minimalist':
        return {
          background: 'bg-gray-50',
          cardBackground: 'bg-white/95',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-600',
          buttonPrimary: 'bg-gray-900 hover:bg-gray-800',
          buttonSecondary: 'bg-gray-200 hover:bg-gray-300',
          accent: 'from-gray-700 to-gray-800',
          border: 'border-gray-300'
        };
      case 'dark':
        return {
          background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
          cardBackground: 'bg-gradient-to-br from-gray-800/90 to-slate-900/90',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-300',
          buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
          buttonSecondary: 'bg-gray-700/60 hover:bg-gray-600/60',
          accent: 'from-emerald-500 to-teal-500',
          border: 'border-gray-600/50'
        };
      default:
        return getThemeClasses();
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};
