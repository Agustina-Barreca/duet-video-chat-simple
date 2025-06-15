
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
          background: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800',
          cardBackground: 'bg-gradient-to-br from-slate-800/90 to-indigo-900/80 backdrop-blur-sm',
          textPrimary: 'text-white',
          textSecondary: 'text-purple-200',
          buttonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          buttonSecondary: 'bg-white/10 hover:bg-white/20',
          accent: 'from-purple-500 to-pink-500',
          border: 'border-purple-400/30'
        };
      case 'professional':
        return {
          background: 'bg-slate-900',
          cardBackground: 'bg-slate-800/95 border border-slate-700/50',
          textPrimary: 'text-slate-100',
          textSecondary: 'text-slate-400',
          buttonPrimary: 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20',
          buttonSecondary: 'bg-slate-700/80 hover:bg-slate-600/80 border border-slate-600/50',
          accent: 'from-blue-500 to-blue-600',
          border: 'border-slate-600/40'
        };
      case 'minimalist':
        return {
          background: 'bg-gradient-to-br from-stone-200 via-neutral-100 to-stone-200',
          cardBackground: 'bg-stone-50/95 backdrop-blur-sm border border-stone-300/60',
          textPrimary: 'text-stone-800',
          textSecondary: 'text-stone-600',
          buttonPrimary: 'bg-stone-700 hover:bg-stone-800 text-white',
          buttonSecondary: 'bg-stone-200/80 hover:bg-stone-300/80',
          accent: 'from-stone-600 to-stone-700',
          border: 'border-stone-300/60'
        };
      case 'dark':
        return {
          background: 'bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900',
          cardBackground: 'bg-gradient-to-br from-zinc-800/90 to-slate-800/90 backdrop-blur-sm',
          textPrimary: 'text-white',
          textSecondary: 'text-zinc-300',
          buttonPrimary: 'bg-gradient-to-r from-zinc-600 to-neutral-600 hover:from-zinc-700 hover:to-neutral-700',
          buttonSecondary: 'bg-zinc-700/60 hover:bg-zinc-600/60',
          accent: 'from-zinc-500 to-neutral-600',
          border: 'border-zinc-600/50'
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
