import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Sun, 
  Sunset, 
  Moon, 
  Clock,
  Bell,
  BellOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AlarmBadge from './Alarmbadge';

const categoryIcons = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
  anytime: Clock,
};

const categoryColors = {
  morning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  afternoon: 'from-blue-500/20 to-cyan-400/20 border-blue-400/30',
  evening: 'from-indigo-500/20 to-blue-600/20 border-indigo-400/30',
  anytime: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete, onToggleAlarm }) {
  const CategoryIcon = categoryIcons[task.category] || Clock;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border backdrop-blur-xl p-5",
        "bg-gradient-to-br",
        categoryColors[task.category],
        task.is_completed && "opacity-60"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start gap-4">
        {/* Complete button */}
        <button
          onClick={() => onToggleComplete(task)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
            task.is_completed
              ? "bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400"
              : "border-slate-500 hover:border-violet-400 hover:bg-violet-400/20"
          )}
        >
          {task.is_completed && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3
                className={cn(
                  "font-semibold text-white text-lg leading-tight transition-all",
                  task.is_completed && "line-through text-slate-400"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                <DropdownMenuItem onClick={() => onEdit(task)} className="text-slate-200 focus:bg-slate-800">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleAlarm(task)} className="text-slate-200 focus:bg-slate-800">
                  {task.alarm_enabled ? (
                    <>
                      <BellOff className="w-4 h-4 mr-2" />
                      Disable Alarm
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Enable Alarm
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-400 focus:bg-slate-800 focus:text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <AlarmBadge time={task.alarm_time} enabled={task.alarm_enabled} />
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
              <CategoryIcon className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400 capitalize">{task.category}</span>
            </div>

            {task.repeat_days?.length > 0 && (
              <div className="flex gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  const isActive = task.repeat_days?.includes(dayNames[i]);
                  return (
                    <span
                      key={i}
                      className={cn(
                        "w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center",
                        isActive
                          ? "bg-violet-500/30 text-violet-300 border border-violet-500/50"
                          : "bg-slate-800/50 text-slate-600"
                      )}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}