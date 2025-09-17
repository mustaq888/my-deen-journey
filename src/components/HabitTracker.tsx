import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Plus, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  streak: number;
  category: 'spiritual' | 'health' | 'learning';
}

export const HabitTracker = () => {
  const { toast } = useToast();
  
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Fajr Namaz',
      icon: '🌅',
      completed: true,
      streak: 7,
      category: 'spiritual'
    },
    {
      id: '2',
      name: 'Quran Reading',
      icon: '📖',
      completed: true,
      streak: 5,
      category: 'spiritual'
    },
    {
      id: '3',
      name: 'Morning Dhikr',
      icon: '🤲',
      completed: false,
      streak: 3,
      category: 'spiritual'
    },
    {
      id: '4',
      name: 'Exercise',
      icon: '💪',
      completed: true,
      streak: 4,
      category: 'health'
    },
    {
      id: '5',
      name: 'Learning (30min)',
      icon: '📚',
      completed: false,
      streak: 2,
      category: 'learning'
    },
    {
      id: '6',
      name: 'Evening Dhikr',
      icon: '🌙',
      completed: false,
      streak: 6,
      category: 'spiritual'
    },
    {
    id: '7',
      name: 'WitR Namaz',
      icon: '🙏',
      completed: false,
      streak: 6,
      category: 'spiritual'
  },
  ]);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completed;
        const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        
        if (newCompleted) {
          toast({
            title: "MashaAllah!🎉",
            description: `${habit.name} completed! Streak: ${newStreak} days`,
            duration: 2000,
          });
        }
        
        return {
          ...habit,
          completed: newCompleted,
          streak: newStreak
        };
      }
      return habit;
    }));
  };

  const getCompletedCount = () => {
    return habits.filter(habit => habit.completed).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedCount() / habits.length) * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spiritual':
        return 'text-spiritual';
      case 'health':
        return 'text-secondary';
      case 'learning':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 card-spiritual">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-spiritual" />
          <h2 className="text-2xl font-semibold text-foreground">
            Daily Habits
          </h2>
        </div>
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-spiritual">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-sm text-muted-foreground">
            {getCompletedCount()}/{habits.length} completed
          </span>
        </div>
        <Progress 
          value={getProgressPercentage()} 
          className="progress-spiritual h-3"
        />
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-smooth"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="data-[state=checked]:bg-spiritual data-[state=checked]:border-spiritual"
              />
              
              <div className="flex items-center gap-2">
                <span className="text-lg">{habit.icon}</span>
                <div>
                  <p className={`font-medium ${habit.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {habit.name}
                  </p>
                  <p className={`text-xs ${getCategoryColor(habit.category)}`}>
                    {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Streak Counter */}
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {habit.streak}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      {getCompletedCount() === habits.length && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg animate-scale-in">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Alhamdulillah, all my habits are completed today 🎉</span>
          </div>
        </div>
      )}
    </Card>
  );
};