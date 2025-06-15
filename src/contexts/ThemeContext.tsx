
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'rainbow' | 'minimalist' | 'dark';

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
      case 'minimalist':
        return {
          background: 'bg-gray-50',
          cardBackground: 'bg-white',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-600',
          buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
          buttonSecondary: 'bg-gray-100 hover:bg-gray-200',
          accent: 'from-blue-500 to-blue-600',
          border: 'border-gray-200'
        };
      case 'dark':
        return {
          background: 'bg-black',
          cardBackground: 'bg-gray-900',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-400',
          buttonPrimary: 'bg-gray-800 hover:bg-gray-700',
          buttonSecondary: 'bg-gray-700 hover:bg-gray-600',
          accent: 'from-gray-700 to-gray-800',
          border: 'border-gray-700'
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
