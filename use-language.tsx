import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./use-auth";

type Language = "en" | "es" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageName: string;
};

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const { user, updateUserMutation } = useAuth();
  const [language, setLanguageState] = useState<Language>((user?.language as Language) || "en");

  useEffect(() => {
    // When user logs in, set language to user preference if available
    if (user?.language) {
      setLanguageState(user.language as Language);
      i18n.changeLanguage(user.language);
    }
  }, [user, i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    
    // If user is logged in, save language preference
    if (user) {
      updateUserMutation.mutate({ language: lang });
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageName: languageNames[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
