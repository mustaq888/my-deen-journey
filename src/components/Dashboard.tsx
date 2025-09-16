import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Sun, 
  Clock, 
  BookOpen, 
  Heart,
  CheckCircle2,
  Target,
  Calendar
} from "lucide-react";
import { TasbeehCounter } from "./TasbeehCounter";
import { DailyVerse } from "./DailyVerse";
import { HabitTracker } from "./HabitTracker";
import { PrayerTimes } from "./PrayerTimes";
import { ThemeToggle } from "./ThemeToggle";

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for demonstration
  const todayProgress = {
    prayers: 3,
    totalPrayers: 5,
    tasbeeh: 150,
    tasbeehGoal: 300,
    habits: 4,
    totalHabits: 6,
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "السلام عليكم";
    return "مساء الخير";
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="min-h-screen pattern-bg">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-spiritual opacity-10" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {getGreeting()}
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Welcome to My Deen Routine
              </p>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="animate-fade-in">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12 -mt-6">
        {/* Daily Progress Overview */}
        <Card className="mb-8 p-6 card-spiritual animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-spiritual" />
            <h2 className="text-2xl font-semibold text-foreground">
              Today's Progress
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prayers Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-spiritual" />
                  <span className="font-medium">Prayers</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {todayProgress.prayers}/{todayProgress.totalPrayers}
                </span>
              </div>
              <Progress 
                value={getProgressPercentage(todayProgress.prayers, todayProgress.totalPrayers)} 
                className="progress-spiritual"
              />
            </div>

            {/* Tasbeeh Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Tasbeeh</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {todayProgress.tasbeeh}/{todayProgress.tasbeehGoal}
                </span>
              </div>
              <Progress 
                value={getProgressPercentage(todayProgress.tasbeeh, todayProgress.tasbeehGoal)} 
                className="h-2"
              />
            </div>

            {/* Habits Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-medium">Habits</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {todayProgress.habits}/{todayProgress.totalHabits}
                </span>
              </div>
              <Progress 
                value={getProgressPercentage(todayProgress.habits, todayProgress.totalHabits)} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Prayer Times */}
            <div className="animate-slide-up">
              <PrayerTimes />
            </div>
            
            {/* Tasbeeh Counter */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <TasbeehCounter />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Daily Verse */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <DailyVerse />
            </div>
            
            {/* Habit Tracker */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <HabitTracker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};