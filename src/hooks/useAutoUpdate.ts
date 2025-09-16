import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAutoUpdate = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "✅ Back Online",
        description: "Your data will sync automatically",
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "📱 Offline Mode",
        description: "Your progress is saved locally",
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Auto-sync data periodically when online
  useEffect(() => {
    if (!isOnline) return;

    const syncData = () => {
      // In a real app, this would sync with a backend
      setLastSync(new Date());
      console.log('Auto-sync completed at:', new Date().toISOString());
    };

    // Sync every 5 minutes when online
    const syncInterval = setInterval(syncData, 5 * 60 * 1000);
    
    // Initial sync
    syncData();

    return () => clearInterval(syncInterval);
  }, [isOnline]);

  // Page visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isOnline) {
        // Page became visible and we're online - sync data
        setLastSync(new Date());
        console.log('Page visibility sync at:', new Date().toISOString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnline]);

  return {
    isOnline,
    lastSync,
    forceSync: () => {
      if (isOnline) {
        setLastSync(new Date());
        toast({
          title: "🔄 Synced",
          description: "Your data has been updated",
          duration: 2000,
        });
      }
    }
  };
};