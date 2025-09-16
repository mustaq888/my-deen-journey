import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, RotateCcw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export const TasbeehCounter = () => {
  const { data, updateTasbeehCount, resetTasbeeh } = useApp();
  const { toast } = useToast();
  const count = data.tasbeehCount;
  const goal = data.tasbeehGoal;

  const handleIncrement = () => {
    const newCount = count + 1;
    updateTasbeehCount(newCount);

    // Check for milestones
    if (newCount === goal) {
      toast({
        title: "🎉 Subhan Allah!",
        description: `You've reached your goal of ${goal} tasbeeh!`,
        duration: 3000,
      });
    } else if (newCount % 33 === 0 && newCount > 0) {
      toast({
        title: "✨ Milestone Reached",
        description: `${newCount} tasbeeh completed!`,
        duration: 2000,
      });
    }
  };

  const getProgressPercentage = () => {
    return Math.min(Math.round((count / goal) * 100), 100);
  };

  const getDhikrText = () => {
    const dhikrOptions = [
      "سُبْحَانَ اللّهِ",
      "الْحَمْدُ لِلّهِ", 
      "لَا إِلَهَ إِلَّا اللّهُ",
      "اللّهُ أَكْبَرُ"
    ];
    
    const cycleIndex = Math.floor(count / 33) % dhikrOptions.length;
    return dhikrOptions[cycleIndex];
  };

  return (
    <Card className="p-6 card-spiritual">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-spiritual" />
        <h2 className="text-2xl font-semibold text-foreground">
          Digital Tasbeeh
        </h2>
      </div>

      {/* Current Dhikr */}
      <div className="text-center mb-8">
        <div className="text-3xl md:text-4xl font-arabic mb-2 text-spiritual">
          {getDhikrText()}
        </div>
        <p className="text-sm text-muted-foreground">
          Current Dhikr
        </p>
      </div>

      {/* Counter Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl md:text-7xl font-bold text-spiritual transition-transform duration-150`}>
          {count}
        </div>
        <p className="text-muted-foreground mt-2">
          out of {goal} goal
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {getProgressPercentage()}%
          </span>
        </div>
        <Progress 
          value={getProgressPercentage()} 
          className="progress-spiritual h-3"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleIncrement}
          size="lg"
          className="btn-spiritual h-16 text-lg font-semibold transition-bounce active:scale-95"
        >
          <Heart className="h-5 w-5 mr-2" />
          Count
        </Button>
        
        <Button
          onClick={resetTasbeeh}
          variant="outline"
          size="lg"
          className="h-16"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Achievement Badge */}
      {count >= goal && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg animate-scale-in">
          <div className="flex items-center gap-2 text-success">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Daily Goal Achieved!</span>
          </div>
        </div>
      )}
    </Card>
  );
};