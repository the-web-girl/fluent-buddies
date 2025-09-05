import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, Clock, Target } from 'lucide-react';
import { AvatarVoice } from '../components/AvatarVoice';
import lessons from '../data/lessons.json';

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'A1';
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>('fr');

  const levelLessons = lessons.lessons.filter(lesson => lesson.level === level);

  const levelInfo = {
    A1: { name: 'Débutant', nameEn: 'Beginner', color: 'bg-primary' },
    A2: { name: 'Élémentaire', nameEn: 'Elementary', color: 'bg-secondary' },
    B1: { name: 'Intermédiaire', nameEn: 'Intermediate', color: 'bg-success' },
    B2: { name: 'Avancé', nameEn: 'Advanced', color: 'bg-warning' },
    C1: { name: 'Autonome', nameEn: 'Proficient', color: 'bg-destructive' },
    C2: { name: 'Expert', nameEn: 'Expert', color: 'bg-accent' }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour à l'accueil
            </Link>
            <div className="flex items-center gap-3 ml-auto">
              <div className="h-8 w-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">LangueIA</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du niveau */}
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 ${levelInfo[level as keyof typeof levelInfo].color} text-white rounded-full mb-4`}>
            <Target className="h-6 w-6" />
            <span className="font-bold text-lg">
              Niveau {level} - {levelInfo[level as keyof typeof levelInfo].name}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {selectedLanguage === 'fr' ? 'Vos leçons' : 'Your lessons'}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            {selectedLanguage === 'fr' 
              ? `${levelLessons.length} leçons disponibles pour ce niveau`
              : `${levelLessons.length} lessons available for this level`}
          </p>

          {/* Sélecteur de langue d'apprentissage */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedLanguage('fr')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedLanguage === 'fr'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              🇫🇷 Apprendre le français
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              🇺🇸 Learn English
            </button>
          </div>
        </div>

        {/* Assistant IA sélectionné */}
        <div className="mb-8 flex justify-center">
          <AvatarVoice
            name={selectedLanguage === 'fr' ? 'Sophie' : 'James'}
            gender={selectedLanguage === 'fr' ? 'female' : 'male'}
            language={selectedLanguage}
            phrase={selectedLanguage === 'fr' 
              ? "Salut ! Prêt(e) pour une nouvelle leçon ?" 
              : "Hi! Ready for a new lesson?"
            }
            onTranscription={(text, isFinal) => {
              if (isFinal) {
                console.log(`Transcription ${selectedLanguage}:`, text);
              }
            }}
            onFeedback={(feedback) => {
              console.log(`Feedback ${selectedLanguage}:`, feedback);
            }}
            className="max-w-md"
          />
        </div>

        {/* Liste des leçons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levelLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {selectedLanguage === 'fr' ? lesson.title.fr : lesson.title.en}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Leçon {index + 1} • {lesson.metadata?.estimatedMinutes || 15} min
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Play className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </div>
              </div>

              {/* Objectifs de la leçon */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-card-foreground mb-2">
                  {selectedLanguage === 'fr' ? 'Objectifs :' : 'Objectives:'}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {lesson.objectives.slice(0, 2).map((objective, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {selectedLanguage === 'fr' ? objective.fr : objective.en}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informations supplémentaires */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.metadata?.estimatedMinutes || 15} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {lesson.exercises?.length || 0} exercices
                </span>
              </div>

              {/* Bouton de démarrage */}
              <button
                className="w-full mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => {
                  // Ici on pourrait naviguer vers une page de leçon détaillée
                  console.log('Démarrage de la leçon:', lesson.id);
                }}
              >
                {selectedLanguage === 'fr' ? 'Commencer' : 'Start lesson'}
              </button>
            </div>
          ))}
        </div>

        {/* Message si pas de leçons */}
        {levelLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {selectedLanguage === 'fr' ? 'Aucune leçon disponible' : 'No lessons available'}
            </h3>
            <p className="text-muted-foreground">
              {selectedLanguage === 'fr' 
                ? 'Les leçons pour ce niveau sont en cours de préparation.'
                : 'Lessons for this level are being prepared.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lessons;