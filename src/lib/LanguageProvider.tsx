import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, getStoredLanguage, setStoredLanguage } from "./i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage());

  useEffect(() => {
    setStoredLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export default LanguageProvider;
