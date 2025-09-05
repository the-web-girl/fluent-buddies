import React, { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, User, UserCheck } from 'lucide-react';
import { speechManager, type Language, type Gender } from '../utils/speech';

interface AvatarVoiceProps {
  name: string;
  gender: Gender;
  language: Language;
  phrase?: string;
  onTranscription?: (text: string, isFinal: boolean) => void;
  onFeedback?: (feedback: any) => void;
  className?: string;
}

/**
 * Avatar interactif avec TTS/STT natifs et accessibilité complète
 */
export function AvatarVoice({ 
  name, 
  gender, 
  language, 
  phrase = '',
  onTranscription,
  onFeedback,
  className = ''
}: AvatarVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isFinalTranscript, setIsFinalTranscript] = useState(false);
  const [speechCapabilities, setSpeechCapabilities] = useState(speechManager.getCapabilities());

  // Configuration de l'avatar selon les props
  useEffect(() => {
    speechManager.updateLanguage(language);
    speechManager.updateGender(gender);
  }, [language, gender]);

  // Configuration des callbacks
  useEffect(() => {
    speechManager.setTranscriptionCallback((text: string, isFinal: boolean) => {
      setCurrentTranscript(text);
      setIsFinalTranscript(isFinal);
      onTranscription?.(text, isFinal);
    });

    speechManager.setFeedbackCallback((feedback) => {
      onFeedback?.(feedback);
    });
  }, [onTranscription, onFeedback]);

  const handleSpeak = useCallback(async () => {
    if (!phrase || !speechCapabilities.synthesis) return;
    
    try {
      setIsSpeaking(true);
      await speechManager.speak(phrase, language);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [phrase, language, speechCapabilities.synthesis]);

  const handleListen = useCallback(() => {
    if (!speechCapabilities.recognition) return;

    if (isListening) {
      speechManager.stopListening();
      setIsListening(false);
    } else {
      const started = speechManager.startListening();
      setIsListening(started);
    }
  }, [isListening, speechCapabilities.recognition]);

  const avatarIcon = gender === 'female' ? UserCheck : User;

  return (
    <div className={`
      flex flex-col items-center p-6 bg-card rounded-lg border shadow-md 
      transition-all duration-normal hover:shadow-lg focus-within:ring-2 
      focus-within:ring-primary focus-within:ring-offset-2
      ${className}
    `}>
      {/* Avatar visuel */}
      <div className={`
        relative mb-4 p-6 rounded-full transition-all duration-normal
        ${language === 'fr' 
          ? 'bg-gradient-primary shadow-glow' 
          : 'bg-gradient-secondary shadow-glow'
        }
        ${isListening ? 'animate-pulse' : ''}
        ${isSpeaking ? 'scale-110' : 'scale-100'}
      `}>
        {React.createElement(avatarIcon, {
          className: "h-12 w-12 text-white",
          'aria-hidden': true
        })}
        
        {/* Indicateur d'état */}
        <div className={`
          absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card
          flex items-center justify-center transition-colors duration-normal
          ${isListening ? 'bg-destructive' : isSpeaking ? 'bg-success' : 'bg-muted'}
        `}>
          {isListening ? (
            <Mic className="h-3 w-3 text-white" aria-hidden="true" />
          ) : isSpeaking ? (
            <Volume2 className="h-3 w-3 text-white" aria-hidden="true" />
          ) : (
            <div className="w-2 h-2 bg-muted-foreground rounded-full" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Nom de l'avatar */}
      <h3 className="text-lg font-semibold mb-2 text-card-foreground">
        {name}
      </h3>

      {/* Langue et rôle */}
      <p className="text-sm text-muted-foreground mb-4 text-center">
        {language === 'fr' ? 'Assistant français' : 'English assistant'}
        <span className="block text-xs mt-1">
          {gender === 'female' ? '👩‍🏫 Voix féminine' : '👨‍🏫 Voix masculine'}
        </span>
      </p>

      {/* Phrase courante */}
      {phrase && (
        <div className="mb-4 p-3 bg-accent rounded-md text-center">
          <p className="text-sm text-accent-foreground font-medium">
            {phrase}
          </p>
        </div>
      )}

      {/* Transcription en cours */}
      {currentTranscript && (
        <div 
          className="mb-4 p-3 bg-primary-soft rounded-md text-center min-h-[2.5rem] flex items-center justify-center"
          aria-live="polite"
          aria-label="Transcription en cours"
        >
          <p className={`text-sm ${isFinalTranscript ? 'text-primary font-medium' : 'text-muted-foreground italic'}`}>
            {currentTranscript}
          </p>
        </div>
      )}

      {/* Contrôles */}
      <div className="flex gap-3">
        {/* Bouton parler */}
        <button
          type="button"
          onClick={handleSpeak}
          disabled={!phrase || !speechCapabilities.synthesis || isSpeaking}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
            transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-offset-2
            ${language === 'fr' 
              ? 'bg-primary text-primary-foreground hover:bg-primary-accent focus:ring-primary disabled:bg-primary-soft' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary-accent focus:ring-secondary disabled:bg-secondary-soft'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={`${isSpeaking ? 'En cours de lecture' : 'Écouter la phrase'}`}
        >
          {isSpeaking ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" />
              <span>Parle...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Écouter</span>
            </>
          )}
        </button>

        {/* Bouton microphone */}
        <button
          type="button"
          onClick={handleListen}
          disabled={!speechCapabilities.recognition}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
            transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isListening 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive' 
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={`${isListening ? 'Arrêter l\'écoute' : 'Commencer à parler'}`}
          aria-pressed={isListening}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" aria-hidden="true" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" aria-hidden="true" />
              <span>Parler</span>
            </>
          )}
        </button>
      </div>

      {/* Messages d'erreur accessibles */}
      {!speechCapabilities.synthesis && (
        <div className="mt-3 p-2 bg-warning-soft rounded text-center" role="alert">
          <p className="text-xs text-warning-foreground">
            Synthèse vocale non disponible
          </p>
        </div>
      )}

      {!speechCapabilities.recognition && (
        <div className="mt-3 p-2 bg-warning-soft rounded text-center" role="alert">
          <p className="text-xs text-warning-foreground">
            Reconnaissance vocale non disponible
          </p>
        </div>
      )}
    </div>
  );
}