import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

type LanguageOption = {
  code: "en" | "es" | "fr";
  label: string;
  nativeLabel: string;
  flag: string;
};

export default function LanguageSelector({ variant = "dropdown" }: { variant?: "dropdown" | "buttons" }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  const languageOptions: LanguageOption[] = [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
    { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
    { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  ];
  
  if (variant === "buttons") {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("language.select")}:</p>
        <div className="flex space-x-2">
          {languageOptions.map((lang) => (
            <Button 
              key={lang.code} 
              variant={language === lang.code ? "default" : "outline"} 
              size="sm" 
              onClick={() => setLanguage(lang.code)}
              className="flex items-center gap-2"
            >
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  const currentLanguage = languageOptions.find(lang => lang.code === language);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe size={16} />
          <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeLabel}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
