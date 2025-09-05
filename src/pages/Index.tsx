import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Mic, Globe, ChevronRight, Play, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '../components/LanguageToggle';
import { AvatarVoice } from '../components/AvatarVoice';

type Language = 'fr' | 'en';

const Index = () => {
  const [uiLanguage, setUILanguage] = useState<Language>('fr');
  const [currentLesson, setCurrentLesson] = useState(0);

  // Contenu bilingue de la page d'accueil
  const content = {
    fr: {
      title: "Apprenez le français et l'anglais",
      subtitle: "Avec des assistants IA natifs qui vous corrigent en temps réel",
      welcomeMessage: "Bonjour ! Je suis Sophie, votre assistante française.",
      features: [
        {
          icon: Mic,
          title: "Correction en temps réel",
          description: "Nos IA natives corrigent votre accent et prononciation instantanément"
        },
        {
          icon: Users,
          title: "Deux assistants dédiés", 
          description: "Sophie pour le français et James pour l'anglais américain"
        },
        {
          icon: BookOpen,
          title: "Méthode CECRL complète",
          description: "De débutant absolu (A1) à expert (C2) avec progression adaptée"
        },
        {
          icon: Globe,
          title: "100% accessible",
          description: "Utilisable au clavier, lecteur d'écran et hors-ligne"
        }
      ],
      cta: {
        start: "Commencer l'apprentissage",
        test: "Test de niveau gratuit"
      },
      levels: [
        { level: "A1", name: "Débutant", description: "Premiers mots et phrases" },
        { level: "A2", name: "Élémentaire", description: "Conversations simples" },
        { level: "B1", name: "Intermédiaire", description: "Situations courantes" },
        { level: "B2", name: "Avancé", description: "Discussions complexes" },
        { level: "C1", name: "Autonome", description: "Maîtrise approfondie" },
        { level: "C2", name: "Expert", description: "Niveau natif" }
      ]
    },
    en: {
      title: "Learn French and English",
      subtitle: "With native AI assistants that correct you in real-time",
      welcomeMessage: "Hello! I'm James, your English assistant.",
      features: [
        {
          icon: Mic,
          title: "Real-time correction",
          description: "Our native AIs correct your accent and pronunciation instantly"
        },
        {
          icon: Users,
          title: "Two dedicated assistants",
          description: "Sophie for French and James for American English"
        },
        {
          icon: BookOpen,
          title: "Complete CEFR method",
          description: "From absolute beginner (A1) to expert (C2) with adaptive progression"
        },
        {
          icon: Globe,
          title: "100% accessible",
          description: "Usable with keyboard, screen reader and offline"
        }
      ],
      cta: {
        start: "Start Learning",
        test: "Free level test"
      },
      levels: [
        { level: "A1", name: "Beginner", description: "First words and phrases" },
        { level: "A2", name: "Elementary", description: "Simple conversations" },
        { level: "B1", name: "Intermediate", description: "Common situations" },
        { level: "B2", name: "Advanced", description: "Complex discussions" },
        { level: "C1", name: "Proficient", description: "Deep mastery" },
        { level: "C2", name: "Expert", description: "Native level" }
      ]
    }
  };

  const currentContent = content[uiLanguage];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50">
        <a 
          href="#main-content"
          className="block p-4 bg-primary text-primary-foreground font-medium rounded-br-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {uiLanguage === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
        </a>
      </div>

      {/* Header avec navigation */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {uiLanguage === 'fr' ? 'LangueIA' : 'LangAI'}
              </h1>
            </div>
            
            <nav aria-label={uiLanguage === 'fr' ? 'Navigation principale' : 'Main navigation'}>
              <div className="flex items-center gap-6">
                <LanguageToggle 
                  currentLanguage={uiLanguage} 
                  onLanguageChange={setUILanguage}
                />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main id="main-content" className="flex-1">
        {/* Section héro */}
        <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {currentContent.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/level-test"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label={currentContent.cta.start}
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                {currentContent.cta.start}
              </Link>
              <Link
                to="/level-test"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label={currentContent.cta.test}
              >
                <Award className="h-5 w-5" aria-hidden="true" />
                {currentContent.cta.test}
              </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section avatars */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {uiLanguage === 'fr' ? 'Rencontrez vos assistants IA' : 'Meet your AI assistants'}
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {uiLanguage === 'fr' 
                  ? 'Deux assistants natifs pour vous accompagner dans votre apprentissage' 
                  : 'Two native assistants to guide you through your learning journey'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Avatar français - Sophie */}
              <AvatarVoice
                name="Sophie"
                gender="female"
                language="fr"
                phrase={uiLanguage === 'fr' ? currentContent.welcomeMessage : "Bonjour ! Je suis Sophie, votre assistante française."}
                onTranscription={(text, isFinal) => {
                  if (isFinal) {
                    console.log('Transcription française:', text);
                  }
                }}
                onFeedback={(feedback) => {
                  console.log('Feedback français:', feedback);
                }}
                className="w-full"
              />
              
              {/* Avatar anglais - James */}
              <AvatarVoice
                name="James" 
                gender="male"
                language="en"
                phrase={uiLanguage === 'en' ? currentContent.welcomeMessage : "Hello! I'm James, your English assistant."}
                onTranscription={(text, isFinal) => {
                  if (isFinal) {
                    console.log('Transcription anglaise:', text);
                  }
                }}
                onFeedback={(feedback) => {
                  console.log('Feedback anglais:', feedback);
                }}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Section fonctionnalités */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {uiLanguage === 'fr' ? 'Pourquoi choisir LangueIA ?' : 'Why choose LangAI?'}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-all duration-normal"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    {React.createElement(feature.icon, {
                      className: "h-6 w-6 text-primary",
                      'aria-hidden': true
                    })}
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section niveaux CECRL */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {uiLanguage === 'fr' ? 'Progression CECRL adaptée' : 'Adaptive CEFR progression'}
              </h3>
              <p className="text-lg text-muted-foreground">
                {uiLanguage === 'fr' 
                  ? 'Du niveau débutant absolu au niveau expert natif'
                  : 'From absolute beginner to native expert level'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentContent.levels.map((level, index) => (
                <Link
                  key={index}
                  to={`/lessons?level=${level.level}`}
                  className="p-6 bg-card rounded-lg border hover:shadow-md transition-all duration-normal group cursor-pointer block"
                  aria-label={`${uiLanguage === 'fr' ? 'Accéder aux leçons de niveau' : 'Access level'} ${level.level}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">
                          {level.level}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">
                          {level.name}
                        </h4>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    {[...Array(Math.ceil((index + 1) * 5 / 6))].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {[...Array(5 - Math.ceil((index + 1) * 5 / 6))].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground" />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            {uiLanguage === 'fr' 
              ? 'LangueIA - Apprentissage des langues avec IA native © 2024'
              : 'LangAI - Language learning with native AI © 2024'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {uiLanguage === 'fr' 
              ? 'Conforme WCAG 2.2 AA - Accessibilité garantie'
              : 'WCAG 2.2 AA compliant - Accessibility guaranteed'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;