import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 transition-smooth hover:bg-spiritual/10"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-secondary transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-spiritual transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};