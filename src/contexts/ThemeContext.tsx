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
          background: 'bg-gradient-to-br from-neutral-800 via-gray-700 to-stone-800',
          cardBackground: 'bg-neutral-800/95 backdrop-blur-sm border border-neutral-600/50',
          textPrimary: 'text-neutral-100',
          textSecondary: 'text-neutral-300',
          buttonPrimary: 'bg-neutral-600 hover:bg-neutral-700 text-white',
          buttonSecondary: 'bg-neutral-700/80 hover:bg-neutral-600/80',
          accent: 'from-neutral-500 to-neutral-600',
          border: 'border-neutral-600/50'
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
