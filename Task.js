import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Sun, 
  Sunset, 
  Moon, 
  Clock, 
  CheckCircle2, 
  ListTodo,
  Bell,
  Sparkles,
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTheme, themeGradients } from '@/components/tasks/ThemeProvider';

import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import AlarmNotification from '@/components/tasks/AlarmNotification';

const filters = [
  { value: 'all', label: 'All', icon: ListTodo },
  { value: 'morning', label: 'Morning', icon: Sun },
  { value: 'afternoon', label: 'Afternoon', icon: Sunset },
  { value: 'evening', label: 'Evening', icon: Moon },
  { value: 'anytime', label: 'Anytime', icon: Clock },
];

export default function Tasks() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { themeColor, timeFormat } = useTheme();
  const theme = themeGradients[themeColor] || themeGradients.blue;

  const queryClient = useQueryClient();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsFormOpen(false);
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleSubmit = (formData) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleToggleComplete = (task) => {
    updateMutation.mutate({
      id: task.id,
      data: { is_completed: !task.is_completed },
    });
  };

  const handleToggleAlarm = (task) => {
    updateMutation.mutate({
      id: task.id,
      data: { alarm_enabled: !task.alarm_enabled },
    });
  };

  const filteredTasks = activeFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.category === activeFilter);

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const activeAlarmsCount = tasks.filter((t) => t.alarm_enabled && !t.is_completed).length;

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12h',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={cn("absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl", theme.background[0])} />
        <div className={cn("absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl", theme.background[1])} />
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl", theme.background[2])} />
        <div className={cn("absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl", theme.background[3])} />
      </div>

      {/* Alarm notification */}
      <AlarmNotification
        tasks={tasks}
        onDismiss={() => {}}
        onComplete={handleToggleComplete}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-end mb-4">
            <Link to={createPageUrl('Settings')}>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <Sparkles className={cn("w-4 h-4", theme.accent)} />
            <span className="text-sm text-slate-300">{formattedDate}</span>
          </div>
          
          <h1 className={cn("text-5xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-3", theme.primary)}>
            {formattedTime}
          </h1>
          <p className="text-slate-400 text-lg">Your daily routines, beautifully organized</p>
        </motion.header>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className={cn("w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br flex items-center justify-center", theme.accentBg)}>
              <Bell className={cn("w-5 h-5", theme.accent)} />
            </div>
            <p className="text-2xl font-bold text-white">{activeAlarmsCount}</p>
            <p className="text-xs text-slate-500">Active Alarms</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200",
                  activeFilter === filter.value
                    ? `bg-gradient-to-r ${theme.filter} text-white shadow-lg ${theme.shadow}`
                    : `bg-slate-800/50 text-slate-400 border border-slate-700/50 ${theme.filterHover}`
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-4 mb-24">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className={cn("w-8 h-8 border-2 border-t-transparent rounded-full animate-spin", theme.spinner)} />
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                <ListTodo className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No tasks yet</h3>
              <p className="text-slate-500">Create your first routine task to get started</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={(t) => deleteMutation.mutate(t.id)}
                  onToggleComplete={handleToggleComplete}
                  onToggleAlarm={handleToggleAlarm}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2"
        >
          <Button
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className={cn("h-14 px-8 rounded-full bg-gradient-to-r text-white font-medium shadow-2xl transition-all duration-300 hover:scale-105", theme.button, theme.shadow)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Routine
          </Button>
        </motion.div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}