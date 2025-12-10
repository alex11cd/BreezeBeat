import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Sun, Sunset, Moon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'morning', label: 'Morning', icon: Sun, color: 'from-amber-500 to-orange-500' },
  { value: 'afternoon', label: 'Afternoon', icon: Sunset, color: 'from-blue-500 to-cyan-400' },
  { value: 'evening', label: 'Evening', icon: Moon, color: 'from-indigo-500 to-blue-600' },
  { value: 'anytime', label: 'Anytime', icon: Clock, color: 'from-cyan-500 to-blue-500' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TaskForm({ task, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alarm_time: '08:00',
    alarm_enabled: true,
    repeat_days: [],
    category: 'anytime',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        alarm_time: task.alarm_time || '08:00',
        alarm_enabled: task.alarm_enabled ?? true,
        repeat_days: task.repeat_days || [],
        category: task.category || 'anytime',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        alarm_time: '08:00',
        alarm_enabled: true,
        repeat_days: [],
        category: 'anytime',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      repeat_days: prev.repeat_days.includes(day)
        ? prev.repeat_days.filter(d => d !== day)
        : [...prev.repeat_days, day]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-violet-500/10" />
                <div className="relative flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    {task ? 'Edit Task' : 'New Routine Task'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Task Name</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Morning Meditation"
                    required
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add some details..."
                    rows={2}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Alarm Time */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      Alarm Time
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {formData.alarm_enabled ? 'On' : 'Off'}
                      </span>
                      <Switch
                        checked={formData.alarm_enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, alarm_enabled: checked })}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  </div>
                  <Input
                    type="time"
                    value={formData.alarm_time}
                    onChange={(e) => setFormData({ ...formData, alarm_time: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 [color-scheme:dark]"
                  />
                </div>

                {/* Repeat Days */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Repeat</Label>
                  <div className="flex gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-xs font-medium transition-all duration-200",
                          formData.repeat_days.includes(day)
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-blue-500/50"
                        )}
                      >
                        {day.slice(0, 1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.value })}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200",
                            formData.category === cat.value
                              ? `bg-gradient-to-br ${cat.color} border-transparent text-white shadow-lg`
                              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 hover:from-blue-600 hover:via-cyan-600 hover:to-violet-600 text-white font-medium py-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {task ? 'Save Changes' : 'Create Task'}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}