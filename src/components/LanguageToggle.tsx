import React from 'react';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  currentLanguage: 'fr' | 'en';
  onLanguageChange: (language: 'fr' | 'en') => void;
  className?: string;
}

/**
 * Composant de bascule de langue accessible avec support clavier complet
 * Conforme WCAG 2.2 AA
 */
export function LanguageToggle({ currentLanguage, onLanguageChange, className = '' }: LanguageToggleProps) {
  const handleToggle = () => {
    onLanguageChange(currentLanguage === 'fr' ? 'en' : 'fr');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`inline-flex rounded-lg bg-muted p-1 ${className}`} role="group" aria-label="Sélection de langue">
      <button
        type="button"
        onClick={() => onLanguageChange('fr')}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-normal
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${currentLanguage === 'fr' 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
          }
        `}
        aria-pressed={currentLanguage === 'fr'}
        aria-label="Passer à l'interface en français"
      >
        <span className="font-semibold">FR</span>
        <span className="text-xs opacity-80">Français</span>
      </button>
      
      <Languages className="mx-2 h-4 w-4 text-muted-foreground self-center" aria-hidden="true" />
      
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-normal
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${currentLanguage === 'en' 
            ? 'bg-secondary text-secondary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
          }
        `}
        aria-pressed={currentLanguage === 'en'}
        aria-label="Switch to English interface"
      >
        <span className="font-semibold">EN</span>
        <span className="text-xs opacity-80">English</span>
      </button>
    </div>
  );
}