import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Palette, 
  Volume2, 
  VolumeX, 
  Clock,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const themeColors = [
  { 
    value: 'blue', 
    label: 'Ocean Blue', 
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    preview: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  { 
    value: 'purple', 
    label: 'Violet Dream', 
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    preview: 'bg-gradient-to-r from-violet-500 to-fuchsia-600'
  },
  { 
    value: 'green', 
    label: 'Forest Green', 
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    preview: 'bg-gradient-to-r from-emerald-500 to-teal-600'
  },
  { 
    value: 'pink', 
    label: 'Rose Pink', 
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    preview: 'bg-gradient-to-r from-pink-500 to-rose-500'
  },
  { 
    value: 'orange', 
    label: 'Sunset Orange', 
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    preview: 'bg-gradient-to-r from-orange-500 to-yellow-500'
  },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    theme_color: 'blue',
    sound_enabled: true,
    time_format: '12h',
  });

  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user) {
      setSettings({
        theme_color: user.theme_color || 'blue',
        sound_enabled: user.sound_enabled ?? true,
        time_format: user.time_format || '12h',
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme_color: theme }));
    updateMutation.mutate({ theme_color: theme });
  };

  const handleSoundToggle = (enabled) => {
    setSettings(prev => ({ ...prev, sound_enabled: enabled }));
    updateMutation.mutate({ sound_enabled: enabled });
  };

  const handleTimeFormatChange = (format) => {
    setSettings(prev => ({ ...prev, time_format: format }));
    updateMutation.mutate({ time_format: format });
  };

  const currentTheme = themeColors.find(t => t.value === settings.theme_color) || themeColors[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Tasks')}>
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white mb-6 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Settings
            </h1>
          </div>
          <p className="text-slate-400 ml-[60px]">Customize your experience</p>
        </motion.header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Theme Color Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Color Theme</h2>
                  <p className="text-sm text-slate-400">Choose your vibe</p>
                </div>
              </div>

              <div className="space-y-3">
                {themeColors.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                      settings.theme_color === theme.value
                        ? "bg-slate-700/50 border-slate-600"
                        : "bg-slate-800/30 border-slate-700/30 hover:border-slate-600"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-lg shadow-lg", theme.preview)} />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{theme.label}</p>
                    </div>
                    {settings.theme_color === theme.value && (
                      <Check className="w-5 h-5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Sound Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    {settings.sound_enabled ? (
                      <Volume2 className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Alarm Sound</h2>
                    <p className="text-sm text-slate-400">
                      {settings.sound_enabled ? 'Sound enabled' : 'Sound disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.sound_enabled}
                  onCheckedChange={handleSoundToggle}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </motion.div>

            {/* Time Format Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Time Format</h2>
                  <p className="text-sm text-slate-400">Choose 12-hour or 24-hour</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTimeFormatChange('12h')}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200",
                    settings.time_format === '12h'
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <div className="text-sm font-medium">12-Hour</div>
                  <div className="text-xs mt-1 opacity-80">2:30 PM</div>
                </button>
                <button
                  onClick={() => handleTimeFormatChange('24h')}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200",
                    settings.time_format === '24h'
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <div className="text-sm font-medium">24-Hour</div>
                  <div className="text-xs mt-1 opacity-80">14:30</div>
                </button>
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-4">Preview</h3>
              <div className={cn(
                "h-24 rounded-xl shadow-2xl flex items-center justify-center bg-gradient-to-r",
                currentTheme.gradient
              )}>
                <span className="text-3xl font-bold text-white">
                  {settings.time_format === '12h' ? '2:30 PM' : '14:30'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}