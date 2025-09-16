import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
  completed: boolean;
  isNext: boolean;
}

export const PrayerTimes = () => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location] = useState("Dubai, UAE"); // Mock location
  
  // Mock prayer times - in a real app, this would come from an API
  const [prayers, setPrayers] = useState<PrayerTime[]>([
    {
      name: "Fajr",
      time: "05:12",
      arabic: "الفجر",
      completed: true,
      isNext: false
    },
    {
      name: "Dhuhr",
      time: "12:28",
      arabic: "الظهر",
      completed: true,
      isNext: false
    },
    {
      name: "Asr",
      time: "15:45",
      arabic: "العصر",
      completed: true,
      isNext: false
    },
    {
      name: "Maghrib",
      time: "18:12",
      arabic: "المغرب",
      completed: false,
      isNext: true
    },
    {
      name: "Isha",
      time: "19:38",
      arabic: "العشاء",
      completed: false,
      isNext: false
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const togglePrayerCompletion = (prayerName: string) => {
    setPrayers(prev => prev.map(prayer => {
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
    }));
  };

  const getNextPrayer = () => {
    return prayers.find(prayer => prayer.isNext);
  };

  const getTimeUntilNext = () => {
    const nextPrayer = getNextPrayer();
    if (!nextPrayer) return "";
    
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const nextPrayerTime = new Date();
    nextPrayerTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const timeDiff = nextPrayerTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Now";
    
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else {
      return `${minutesLeft}m`;
    }
  };

  const completedPrayers = prayers.filter(p => p.completed).length;

  return (
    <Card className="p-6 card-spiritual">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-spiritual" />
          <h2 className="text-2xl font-semibold text-foreground">
            Prayer Times
          </h2>
        </div>
        
        <Badge variant="secondary" className="bg-spiritual/10 text-spiritual border-spiritual/20">
          {completedPrayers}/5 completed
        </Badge>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>

      {/* Next Prayer Highlight */}
      {getNextPrayer() && (
        <div className="mb-6 p-4 bg-spiritual/5 border border-spiritual/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-spiritual">Next Prayer</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-medium text-foreground">
                  {getNextPrayer()?.name} • {getNextPrayer()?.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  in {getTimeUntilNext()}
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-spiritual hover:text-spiritual/80">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-smooth ${
              prayer.isNext 
                ? 'bg-spiritual/10 border border-spiritual/20' 
                : 'bg-surface hover:bg-surface-elevated'
            }`}
            onClick={() => togglePrayerCompletion(prayer.name)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                prayer.completed ? 'bg-spiritual' : 'bg-muted border-2 border-muted-foreground'
              }`} />
              
              <div>
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${
                    prayer.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {prayer.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-arabic">
                    {prayer.arabic}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-mono ${
                prayer.isNext ? 'text-spiritual font-semibold' : 'text-muted-foreground'
              }`}>
                {prayer.time}
              </p>
              {prayer.isNext && (
                <p className="text-xs text-spiritual">
                  {getTimeUntilNext()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Tap any prayer to mark as completed
        </p>
      </div>
    </Card>
  );
};