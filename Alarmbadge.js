import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AlarmBadge({ time, enabled, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
        enabled
          ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/20 text-blue-300 border border-blue-400/30"
          : "bg-slate-800/50 text-slate-500 border border-slate-700/50",
        className
      )}
    >
      {enabled ? (
        <Bell className="w-3 h-3 animate-pulse" />
      ) : (
        <BellOff className="w-3 h-3" />
      )}
      <span>{time}</span>
    </div>
  );
}
