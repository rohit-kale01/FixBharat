import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Complaint, Notification, ActivityFeedItem } from '@/types';
import { complaints as initialComplaints, notifications as initialNotifications, activityFeed as initialActivity } from '@/data/demoData';
import type { Language } from '@/lib/i18n';

interface AppState {
  complaints: Complaint[];
  notifications: Notification[];
  activity: ActivityFeedItem[];
  language: Language;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  markResolved: (id: string, evidence?: Complaint['resolutionEvidence']) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  addActivity: (item: ActivityFeedItem) => void;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activity, setActivity] = useState<ActivityFeedItem[]>(initialActivity);
  const [language, setLanguage] = useState<Language>('en');

  const addComplaint = useCallback((complaint: Complaint) => {
    setComplaints((prev) => [complaint, ...prev]);
  }, []);

  const updateComplaint = useCallback((id: string, updates: Partial<Complaint>) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const markResolved = useCallback((id: string, evidence?: Complaint['resolutionEvidence']) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updatedTimeline = c.timeline.map((t) => ({
          ...t,
          status: 'completed' as const,
          timestamp: t.timestamp || new Date().toISOString(),
        }));
        return {
          ...c,
          status: 'RESOLVED' as const,
          resolutionEvidence: evidence || c.resolutionEvidence,
          timeline: updatedTimeline,
          slaRemaining: 0,
        };
      })
    );
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const addActivity = useCallback((item: ActivityFeedItem) => {
    setActivity((prev) => [item, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        complaints,
        notifications,
        activity,
        language,
        addComplaint,
        updateComplaint,
        markResolved,
        addNotification,
        markNotificationRead,
        addActivity,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
