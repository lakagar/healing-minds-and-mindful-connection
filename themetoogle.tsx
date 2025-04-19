import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export default function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "dropdown" | "buttons" }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, updateUserMutation } = useAuth();
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // If user is logged in, save preference
    if (user) {
      updateUserMutation.mutate({ theme: newTheme });
    }
  };
  
  if (variant === "buttons") {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("theme.toggle")}:</p>
        <div className="flex space-x-2">
          <Button 
            variant={theme === "light" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleThemeChange("light")}
            className="flex items-center gap-2"
          >
            <Sun size={16} />
            <span>Light</span>
          </Button>
          <Button 
            variant={theme === "dark" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleThemeChange("dark")}
            className="flex items-center gap-2"
          >
            <Moon size={16} />
            <span>Dark</span>
          </Button>
          <Button 
            variant={theme === "system" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleThemeChange("system")}
            className="flex items-center gap-2"
          >
            <Monitor size={16} />
            <span>System</span>
          </Button>
        </div>
      </div>
    );
  }
  
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : theme === "system" ? (
              <Monitor className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">{t("theme.toggle")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // Default icon button
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
      aria-label={t("theme.toggle")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
