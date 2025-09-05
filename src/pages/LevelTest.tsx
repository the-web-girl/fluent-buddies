import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Question {
  id: string;
  question: { fr: string; en: string };
  options: { fr: string[]; en: string[] };
  correct: number;
  level: string;
}

const questions: Question[] = [
  {
    id: '1',
    question: {
      fr: 'Comment dit-on "Bonjour" en anglais ?',
      en: 'How do you say "Hello" in French?'
    },
    options: {
      fr: ['Good morning', 'Hello', 'Good evening', 'Goodbye'],
      en: ['Salut', 'Bonjour', 'Bonsoir', 'Au revoir']
    },
    correct: 1,
    level: 'A1'
  },
  {
    id: '2',
    question: {
      fr: 'Quelle est la forme correcte du verbe "être" à la première personne ?',
      en: 'What is the correct form of "to be" in first person?'
    },
    options: {
      fr: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'],
      en: ['I am', 'You are', 'He is', 'We are']
    },
    correct: 0,
    level: 'A1'
  },
  {
    id: '3',
    question: {
      fr: 'Complétez: "J\'____ une voiture rouge"',
      en: 'Complete: "I ____ a red car"'
    },
    options: {
      fr: ['ai', 'as', 'a', 'avons'],
      en: ['have', 'has', 'am', 'is']
    },
    correct: 0,
    level: 'A2'
  },
  {
    id: '4',
    question: {
      fr: 'Quel temps utilise-t-on pour exprimer une action habituelle ?',
      en: 'Which tense is used to express a habitual action?'
    },
    options: {
      fr: ['Passé composé', 'Présent', 'Futur', 'Imparfait'],
      en: ['Past tense', 'Present simple', 'Future', 'Present perfect']
    },
    correct: 1,
    level: 'B1'
  },
  {
    id: '5',
    question: {
      fr: 'Quelle est la différence entre "depuis" et "pendant" ?',
      en: 'What\'s the difference between "since" and "for"?'
    },
    options: {
      fr: [
        'Aucune différence',
        '"Depuis" indique un point de départ, "pendant" une durée',
        '"Pendant" indique un point de départ, "depuis" une durée',
        'Les deux sont identiques'
      ],
      en: [
        'No difference',
        '"Since" indicates a starting point, "for" indicates duration',
        '"For" indicates a starting point, "since" indicates duration',
        'Both are identical'
      ]
    },
    correct: 1,
    level: 'B2'
  }
];

const LevelTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>('fr');

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateLevel = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / questions.length) * 100;
    
    if (percentage >= 90) return 'C2';
    if (percentage >= 80) return 'C1';
    if (percentage >= 70) return 'B2';
    if (percentage >= 60) return 'B1';
    if (percentage >= 40) return 'A2';
    return 'A1';
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const level = calculateLevel();
    const correctCount = answers.filter((answer, index) => answer === questions[index].correct).length;
    
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 h-16">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                {selectedLanguage === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-full mb-6">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {selectedLanguage === 'fr' ? 'Test terminé !' : 'Test completed!'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {selectedLanguage === 'fr' 
                ? `Vous avez obtenu ${correctCount}/${questions.length} bonnes réponses`
                : `You got ${correctCount}/${questions.length} correct answers`}
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              {selectedLanguage === 'fr' ? 'Votre niveau estimé' : 'Your estimated level'}
            </h2>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold">
              {level}
            </div>
            <p className="mt-4 text-muted-foreground">
              {selectedLanguage === 'fr' 
                ? 'Commencez par les leçons de ce niveau pour optimiser votre apprentissage'
                : 'Start with lessons at this level to optimize your learning'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to={`/lessons?level=${level}`}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-accent transition-colors"
            >
              {selectedLanguage === 'fr' ? 'Commencer les leçons' : 'Start lessons'}
            </Link>
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              {selectedLanguage === 'fr' ? 'Refaire le test' : 'Retake test'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {selectedLanguage === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLanguage('fr')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLanguage === 'fr' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLanguage === 'en' 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {selectedLanguage === 'fr' ? 'Test de niveau gratuit' : 'Free level test'}
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">
            {selectedLanguage === 'fr' 
              ? questions[currentQuestion].question.fr 
              : questions[currentQuestion].question.en}
          </h2>
          
          <div className="space-y-3">
            {(selectedLanguage === 'fr' 
              ? questions[currentQuestion].options.fr 
              : questions[currentQuestion].options.en
            ).map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 text-left border border-border rounded-lg hover:bg-accent hover:border-accent-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {selectedLanguage === 'fr' 
            ? 'Ce test est entièrement gratuit et vous aidera à déterminer votre niveau actuel'
            : 'This test is completely free and will help determine your current level'}
        </div>
      </main>
    </div>
  );
};

export default LevelTest;