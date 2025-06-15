
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
          accent: 'from-purple-500 to-pink-500',
          border: 'border-white/30'
        };
      case 'professional':
        return {
          background: 'bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900',
          cardBackground: 'bg-gradient-to-br from-slate-700/90 to-slate-800/90',
          textPrimary: 'text-white',
          textSecondary: 'text-slate-300',
          buttonPrimary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800',
          buttonSecondary: 'bg-white/10 hover:bg-white/15',
          accent: 'from-slate-500 to-slate-600',
          border: 'border-slate-400/30'
        };
      case 'minimalist':
        return {
          background: 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200',
          cardBackground: 'bg-white/90 backdrop-blur-sm',
          textPrimary: 'text-slate-800',
          textSecondary: 'text-slate-600',
          buttonPrimary: 'bg-slate-800 hover:bg-slate-900 text-white',
          buttonSecondary: 'bg-slate-200/80 hover:bg-slate-300/80',
          accent: 'from-slate-600 to-slate-700',
          border: 'border-slate-300/50'
        };
      case 'dark':
        return {
          background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
          cardBackground: 'bg-gradient-to-br from-gray-800/90 to-slate-900/90',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-300',
          buttonPrimary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800',
          buttonSecondary: 'bg-gray-700/60 hover:bg-gray-600/60',
          accent: 'from-slate-500 to-slate-600',
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
