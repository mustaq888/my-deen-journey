import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Bell } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export const PrayerTimes = () => {
  const { data, updatePrayerCompletion } = useApp();
  const prayers = data.prayers;
  const currentTime = data.currentTime;
  
  const location = "New Delhi, India";

  const togglePrayerCompletion = (prayerName: string) => {
    updatePrayerCompletion(prayerName);
  };

  const getNextPrayer = () => {
    return prayers.find(prayer => prayer.isNext);
  };

  const getTimeUntilNext = () => {
    const nextPrayer = getNextPrayer();
    if (!nextPrayer) return "";
    
    // Parse 12-hour format time
    const timeStr = nextPrayer.time.replace(/\s?(AM|PM)/i, '');
    const [hours, minutes] = timeStr.split(':').map(Number);
    const isPM = nextPrayer.time.toUpperCase().includes('PM');
    
    const nextPrayerTime = new Date();
    let adjustedHours = hours;
    
    // Convert to 24-hour format for calculation
    if (isPM && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (!isPM && hours === 12) {
      adjustedHours = 0;
    }
    
    nextPrayerTime.setHours(adjustedHours, minutes, 0, 0);
    
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