import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
  completed: boolean;
  isNext: boolean;
}

interface AppData {
  currentTime: Date;
  prayers: PrayerTime[];
  tasbeehCount: number;
  tasbeehGoal: number;
  dailyVerseIndex: number;
  lastUpdated: string;
}

interface AppContextType {
  data: AppData;
  updatePrayerCompletion: (prayerName: string) => void;
  updateTasbeehCount: (count: number) => void;
  resetTasbeeh: () => void;
  refreshPrayerTimes: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Prayer time calculation helper
const calculatePrayerTimes = (date: Date) => {
  // This is a simplified calculation for New Delhi, India
  // In a real app, you'd use a proper prayer time calculation library
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Approximate prayer times that vary slightly by season
  const seasonalOffset = Math.sin((month - 3) * Math.PI / 6) * 30; // ±30 minutes seasonal variation
  
  const baseTimes = {
    fajr: { hour: 5, minute: 45 },
    dhuhr: { hour: 13, minute: 30 },
    asr: { hour: 17, minute: 15 },
    maghrib: { hour: 18, minute: 35 },
    isha: { hour: 20, minute: 30 }
  };
  
  // Apply seasonal adjustments (simplified)
  const adjustedTimes = Object.entries(baseTimes).map(([name, time]) => {
    const adjustedMinutes = time.minute + (name === 'fajr' || name === 'maghrib' ? seasonalOffset : 0);
    const finalHour = time.hour + Math.floor(adjustedMinutes / 60);
    const finalMinute = Math.abs(adjustedMinutes % 60);
    
    // Convert to 12-hour format
    const hour12 = finalHour > 12 ? finalHour - 12 : (finalHour === 0 ? 12 : finalHour);
    const ampm = finalHour >= 12 ? 'PM' : 'AM';
    
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      time: `${hour12}:${finalMinute.toString().padStart(2, '0')} ${ampm}`,
      arabic: getArabicName(name),
      completed: false,
      isNext: false
    };
  });
  
  return adjustedTimes;
};

const getArabicName = (name: string) => {
  const arabicNames: { [key: string]: string } = {
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء'
  };
  return arabicNames[name] || '';
};

const getNextPrayer = (prayers: PrayerTime[], currentTime: Date) => {
  // Simple logic to determine next prayer
  const currentHour = currentTime.getHours();
  
  if (currentHour < 6) return 0; // Fajr
  if (currentHour < 12) return 1; // Dhuhr
  if (currentHour < 15) return 2; // Asr
  if (currentHour < 18) return 3; // Maghrib
  if (currentHour < 20) return 4; // Isha
  return 0; // Next day Fajr
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [data, setData] = useState<AppData>(() => {
    // Load from localStorage or set defaults
    const saved = localStorage.getItem('deenRoutineData');
    const now = new Date();
    
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedDate = new Date(parsed.lastUpdated);
      
      // Check if it's a new day
      if (savedDate.toDateString() !== now.toDateString()) {
        // Reset daily data for new day
        const newPrayers = calculatePrayerTimes(now);
        const nextPrayerIndex = getNextPrayer(newPrayers, now);
        newPrayers[nextPrayerIndex].isNext = true;
        
        return {
          currentTime: now,
          prayers: newPrayers,
          tasbeehCount: 0,
          tasbeehGoal: parsed.tasbeehGoal || 300,
          dailyVerseIndex: Math.floor(Math.random() * 4), // New verse for new day
          lastUpdated: now.toISOString(),
        };
      }
      
      // Same day, restore data but update time
      parsed.currentTime = now;
      return parsed;
    }
    
    // First time setup
    const prayers = calculatePrayerTimes(now);
    const nextPrayerIndex = getNextPrayer(prayers, now);
    prayers[nextPrayerIndex].isNext = true;
    
    return {
      currentTime: now,
      prayers,
      tasbeehCount: 0,
      tasbeehGoal: 300,
      dailyVerseIndex: Math.floor(Math.random() * 4),
      lastUpdated: now.toISOString(),
    };
  });

  // Auto-update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setData(prev => {
        const updated = { ...prev, currentTime: now };
        
        // Check if day changed
        const lastDate = new Date(prev.lastUpdated);
        if (lastDate.toDateString() !== now.toDateString()) {
          // New day - reset daily progress
          const newPrayers = calculatePrayerTimes(now);
          const nextPrayerIndex = getNextPrayer(newPrayers, now);
          newPrayers[nextPrayerIndex].isNext = true;
          
          updated.prayers = newPrayers;
          updated.tasbeehCount = 0;
          updated.dailyVerseIndex = Math.floor(Math.random() * 4);
          updated.lastUpdated = now.toISOString();
          
          toast({
            title: "🌅 New Day Begins",
            description: "Your daily progress has been reset. Have a blessed day!",
            duration: 4000,
          });
        }
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('deenRoutineData', JSON.stringify(data));
  }, [data]);

  // Auto-update next prayer indicator
  useEffect(() => {
    const updateNextPrayer = () => {
      setData(prev => {
        const nextPrayerIndex = getNextPrayer(prev.prayers, prev.currentTime);
        const updatedPrayers = prev.prayers.map((prayer, index) => ({
          ...prayer,
          isNext: index === nextPrayerIndex
        }));
        
        return { ...prev, prayers: updatedPrayers };
      });
    };

    // Update next prayer every minute
    const timer = setInterval(updateNextPrayer, 60000);
    updateNextPrayer(); // Initial update
    
    return () => clearInterval(timer);
  }, []);

  const updatePrayerCompletion = (prayerName: string) => {
    setData(prev => ({
      ...prev,
      prayers: prev.prayers.map(prayer => {
        if (prayer.name === prayerName) {
          const newCompleted = !prayer.completed;
          
          if (newCompleted) {
            toast({
              title: "Allahu Akbar! 🤲",
              description: `${prayer.name} prayer marked as completed`,
              duration: 2000,
            });
          }
          
          return { ...prayer, completed: newCompleted };
        }
        return prayer;
      })
    }));
  };

  const updateTasbeehCount = (count: number) => {
    setData(prev => ({ ...prev, tasbeehCount: count }));
  };

  const resetTasbeeh = () => {
    setData(prev => ({ ...prev, tasbeehCount: 0 }));
    toast({
      title: "Counter Reset",
      description: "Starting fresh with your tasbeeh",
      duration: 2000,
    });
  };

  const refreshPrayerTimes = () => {
    const now = new Date();
    const newPrayers = calculatePrayerTimes(now);
    const nextPrayerIndex = getNextPrayer(newPrayers, now);
    newPrayers[nextPrayerIndex].isNext = true;
    
    setData(prev => ({
      ...prev,
      prayers: newPrayers,
      lastUpdated: now.toISOString()
    }));
    
    toast({
      title: "Prayer Times Updated",
      description: "Times have been recalculated for today",
      duration: 2000,
    });
  };

  return (
    <AppContext.Provider value={{
      data,
      updatePrayerCompletion,
      updateTasbeehCount,
      resetTasbeeh,
      refreshPrayerTimes
    }}>
      {children}
    </AppContext.Provider>
  );
};