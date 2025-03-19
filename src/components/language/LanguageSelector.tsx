import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "",
}) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save language preference to localStorage
    localStorage.setItem("i18nextLng", lng);
  };

  const currentLanguage = i18n.language || "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`flex items-center gap-2 ${className}`}
          aria-label={t("settings.language")}
        >
          <Globe className="h-5 w-5" />
          <span className="absolute -bottom-1 -right-1 text-xs font-bold">
            {currentLanguage.substring(0, 2).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={currentLanguage.startsWith("en") ? "bg-accent" : ""}
        >
          {t("languages.en")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("es")}
          className={currentLanguage.startsWith("es") ? "bg-accent" : ""}
        >
          {t("languages.es")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("vi")}
          className={currentLanguage.startsWith("vi") ? "bg-accent" : ""}
        >
          {t("languages.vi")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
