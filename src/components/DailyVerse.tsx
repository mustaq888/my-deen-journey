import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface Verse {
  arabic: string;
  translation: string;
  reference: string;
  reflection: string;
}

export const DailyVerse = () => {
  const { data } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verses: Verse[] = [
    {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      translation: "And whoever fears Allah - He will make for him a way out.",
      reference: "Surah At-Talaq 65:2",
      reflection: "Trust in Allah's wisdom during difficult times. He always provides a path forward for those who maintain their faith and righteousness."
    },
    {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "For indeed, with hardship [will be] ease.",
      reference: "Surah Ash-Sharh 94:5",
      reflection: "Every challenge in life comes with relief. This verse reminds us to remain patient and optimistic during trying times."
    },
    {
      arabic: "وَاذْكُر رَّبَّكَ كَثِيرًا وَسَبِّحْ بِالْعَشِيِّ وَالْإِبْكَارِ",
      translation: "And remember your Lord much and exalt [Him with praise] in the evening and the morning.",
      reference: "Surah Ali 'Imran 3:41",
      reflection: "Consistent remembrance of Allah throughout the day brings peace to the heart and strengthens our connection with the Divine."
    },
    {
      arabic: "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
      translation: "Allah intends only to remove from you the impurity [of sin], O people of the [Prophet's] household, and to purify you with [extensive] purification.",
      reference: "Surah Al-Ahzab 33:33",
      reflection: "Spiritual purification is a continuous process. Allah guides us toward cleanliness of heart, mind, and soul."
    }
  ];


  const currentVerse = verses[data.dailyVerseIndex] || verses[0];

  const getNewVerse = () => {
    setIsLoading(true);
    

    setTimeout(() => {
     
      const availableVerses = verses.filter((_, index) => index !== data.dailyVerseIndex);
      const randomVerse = availableVerses[Math.floor(Math.random() * availableVerses.length)];
      const newIndex = verses.indexOf(randomVerse);
      
     
      setIsLoading(false);
      
      toast({
        title: "New verse loaded",
        description: "May this verse bring you peace and guidance",
        duration: 2000,
      });
    }, 1000);
  };

  const shareVerse = () => {
    if (currentVerse && navigator.share) {
      navigator.share({
        title: 'Daily Quranic Verse',
        text: `${currentVerse.arabic}\n\n"${currentVerse.translation}"\n\n${currentVerse.reference}`,
      });
    } else {
      
      toast({
        title: "Share feature",
        description: "Copy the verse text to share it manually",
        duration: 3000,
      });
    }
  };

  if (!currentVerse) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 card-spiritual">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-spiritual" />
          <h2 className="text-2xl font-semibold text-foreground">
            Daily Verse
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={shareVerse}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-spiritual"
          >
            <Share className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={getNewVerse}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="text-muted-foreground hover:text-spiritual"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="text-center mb-6">
        <div className="text-2xl md:text-3xl font-arabic leading-relaxed text-spiritual mb-4 p-4 bg-spiritual/5 rounded-lg">
          {currentVerse.arabic}
        </div>
      </div>

      {/* Translation */}
      <div className="mb-4">
        <blockquote className="text-lg italic text-foreground leading-relaxed border-l-4 border-spiritual pl-4">
          "{currentVerse.translation}"
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          — {currentVerse.reference}
        </p>
      </div>

      {/* Reflection */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
          Reflection
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {currentVerse.reflection}
        </p>
      </div>
    </Card>
  );
};