import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlarmNotification({ tasks, onDismiss, onComplete }) {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);
  const checkedRef = useRef(new Set());

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

      tasks.forEach((task) => {
        if (
          task.alarm_enabled &&
          !task.is_completed &&
          task.alarm_time === currentTime &&
          !checkedRef.current.has(`${task.id}-${currentTime}`)
        ) {
          // Check if task should trigger today
          const shouldTrigger = !task.repeat_days?.length || task.repeat_days.includes(currentDay);
          
          if (shouldTrigger) {
            checkedRef.current.add(`${task.id}-${currentTime}`);
            setActiveAlarm(task);
            
            // Play notification sound
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`⏰ ${task.title}`, {
                body: task.description || 'Time for your routine task!',
                icon: '/favicon.ico',
              });
            }
          }
        }
      });
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkAlarms, 1000);
    checkAlarms();

    return () => clearInterval(interval);
  }, [tasks]);

  // Clear old checked alarms every minute
  useEffect(() => {
    const clearOld = setInterval(() => {
      checkedRef.current.clear();
    }, 60000);
    return () => clearInterval(clearOld);
  }, []);

  const handleDismiss = () => {
    if (onDismiss && activeAlarm) onDismiss(activeAlarm);
    setActiveAlarm(null);
  };

  const handleComplete = () => {
    if (onComplete && activeAlarm) onComplete(activeAlarm);
    setActiveAlarm(null);
  };

  return (
    <AnimatePresence>
      {activeAlarm && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-[100]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-violet-600 p-1 shadow-2xl shadow-blue-500/50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Alarm
                  </p>
                  <h3 className="text-white font-semibold text-lg truncate">
                    {activeAlarm.title}
                  </h3>
                  {activeAlarm.description && (
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                      {activeAlarm.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}