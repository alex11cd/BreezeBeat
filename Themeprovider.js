import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const ThemeContext = createContext({
  themeColor: 'blue',
  soundEnabled: true,
  timeFormat: '12h',
});

export const useTheme = () => useContext(ThemeContext);

export const themeGradients = {
  blue: {
    primary: 'from-blue-500 via-cyan-500 to-blue-600',
    button: 'from-blue-500 via-cyan-500 to-violet-500',
    background: ['bg-blue-500/10', 'bg-cyan-500/10', 'bg-violet-500/5', 'bg-blue-400/8'],
    accent: 'text-cyan-400',
    accentBg: 'from-blue-500/20 to-cyan-400/20',
    border: 'border-blue-400/30',
    alarm: 'from-blue-600 via-cyan-600 to-violet-600',
    alarmIcon: 'from-blue-500 to-cyan-500',
    alarmText: 'text-blue-300',
    filter: 'from-blue-500 to-cyan-500',
    filterHover: 'hover:border-blue-500/50 hover:text-blue-300',
    shadow: 'shadow-blue-500/25',
    spinner: 'border-blue-500',
    categories: {
      morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      afternoon: 'from-blue-500/20 to-cyan-400/20 border-blue-400/30',
      evening: 'from-indigo-500/20 to-blue-600/20 border-indigo-400/30',
      anytime: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30',
    }
  },
  purple: {
    primary: 'from-violet-500 via-purple-500 to-fuchsia-600',
    button: 'from-violet-500 via-purple-500 to-fuchsia-500',
    background: ['bg-violet-500/10', 'bg-purple-500/10', 'bg-fuchsia-500/5', 'bg-violet-400/8'],
    accent: 'text-violet-400',
    accentBg: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    alarm: 'from-violet-600 via-purple-600 to-fuchsia-600',
    alarmIcon: 'from-violet-500 to-purple-600',
    alarmText: 'text-violet-300',
    filter: 'from-violet-500 to-purple-600',
    filterHover: 'hover:border-violet-500/50 hover:text-violet-300',
    shadow: 'shadow-violet-500/25',
    spinner: 'border-violet-500',
    categories: {
      morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      evening: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      anytime: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30',
    }
  },
  green: {
    primary: 'from-emerald-500 via-green-500 to-teal-600',
    button: 'from-emerald-500 via-green-500 to-teal-500',
    background: ['bg-emerald-500/10', 'bg-green-500/10', 'bg-teal-500/5', 'bg-emerald-400/8'],
    accent: 'text-emerald-400',
    accentBg: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    alarm: 'from-emerald-600 via-green-600 to-teal-600',
    alarmIcon: 'from-emerald-500 to-green-500',
    alarmText: 'text-emerald-300',
    filter: 'from-emerald-500 to-green-500',
    filterHover: 'hover:border-emerald-500/50 hover:text-emerald-300',
    shadow: 'shadow-emerald-500/25',
    spinner: 'border-emerald-500',
    categories: {
      morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      evening: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      anytime: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    }
  },
  pink: {
    primary: 'from-pink-500 via-rose-500 to-red-500',
    button: 'from-pink-500 via-rose-500 to-red-500',
    background: ['bg-pink-500/10', 'bg-rose-500/10', 'bg-red-500/5', 'bg-pink-400/8'],
    accent: 'text-pink-400',
    accentBg: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    alarm: 'from-pink-600 via-rose-600 to-red-600',
    alarmIcon: 'from-pink-500 to-rose-500',
    alarmText: 'text-pink-300',
    filter: 'from-pink-500 to-rose-500',
    filterHover: 'hover:border-pink-500/50 hover:text-pink-300',
    shadow: 'shadow-pink-500/25',
    spinner: 'border-pink-500',
    categories: {
      morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      evening: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      anytime: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    }
  },
  orange: {
    primary: 'from-orange-500 via-amber-500 to-yellow-500',
    button: 'from-orange-500 via-amber-500 to-yellow-500',
    background: ['bg-orange-500/10', 'bg-amber-500/10', 'bg-yellow-500/5', 'bg-orange-400/8'],
    accent: 'text-orange-400',
    accentBg: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30',
    alarm: 'from-orange-600 via-amber-600 to-yellow-600',
    alarmIcon: 'from-orange-500 to-amber-500',
    alarmText: 'text-orange-300',
    filter: 'from-orange-500 to-amber-500',
    filterHover: 'hover:border-orange-500/50 hover:text-orange-300',
    shadow: 'shadow-orange-500/25',
    spinner: 'border-orange-500',
    categories: {
      morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      evening: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      anytime: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
    }
  },
};

export default function ThemeProvider({ children }) {
  const [settings, setSettings] = useState({
    themeColor: 'blue',
    soundEnabled: true,
    timeFormat: '12h',
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setSettings({
        themeColor: user.theme_color || 'blue',
        soundEnabled: user.sound_enabled ?? true,
        timeFormat: user.time_format || '12h',
      });
    }
  }, [user]);

  return (
    <ThemeContext.Provider value={settings}>
      {children}
    </ThemeContext.Provider>
  );
}