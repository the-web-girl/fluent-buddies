/**
 * Système de synthèse et reconnaissance vocale bilingue FR/EN
 * Compatible accessibilité WCAG 2.2 AA avec fallbacks
 */

// Déclarations TypeScript pour l'API Web Speech
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError {
  error: string;
  message?: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export type Language = 'fr' | 'en';
export type Gender = 'male' | 'female';

interface SpeechConfig {
  language: Language;
  gender: Gender;
  rate: number;
  pitch: number;
  volume: number;
}

interface SpeechFeedback {
  text: string;
  language: Language;
  accuracy?: number;
  corrections?: Array<{
    word: string;
    suggestion: string;
    position: number;
  }>;
}

export class BilingualSpeechManager {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: SpeechRecognition | null = null;
  private config: SpeechConfig;
  private isListening: boolean = false;
  private onTranscriptionCallback?: (result: string, isFinal: boolean) => void;
  private onFeedbackCallback?: (feedback: SpeechFeedback) => void;

  constructor(initialConfig: Partial<SpeechConfig> = {}) {
    this.config = {
      language: 'fr',
      gender: 'female',
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      ...initialConfig
    };

    this.initializeSpeechSynthesis();
    this.initializeSpeechRecognition();
  }

  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && this.onTranscriptionCallback) {
          this.onTranscriptionCallback(finalTranscript.trim(), true);
          this.analyzePronunciation(finalTranscript.trim());
        } else if (interimTranscript && this.onTranscriptionCallback) {
          this.onTranscriptionCallback(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  public updateLanguage(language: Language): void {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    }
  }

  public updateGender(gender: Gender): void {
    this.config.gender = gender;
  }

  public updateRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(2.0, rate));
  }

  public async speak(text: string, language?: Language): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Synthèse vocale non disponible');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = language || this.config.language;
      
      utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;

      // Sélection de la voix selon la langue et le genre
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => {
        const isCorrectLang = voice.lang.startsWith(lang);
        const hasPreferredGender = this.config.gender === 'female' 
          ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
          : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man');
        return isCorrectLang && hasPreferredGender;
      }) || voices.find(voice => voice.lang.startsWith(lang));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  public startListening(): boolean {
    if (!this.recognition || this.isListening) {
      return false;
    }

    this.recognition.lang = this.config.language === 'fr' ? 'fr-FR' : 'en-US';
    this.recognition.start();
    this.isListening = true;
    return true;
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public setTranscriptionCallback(callback: (result: string, isFinal: boolean) => void): void {
    this.onTranscriptionCallback = callback;
  }

  public setFeedbackCallback(callback: (feedback: SpeechFeedback) => void): void {
    this.onFeedbackCallback = callback;
  }

  private analyzePronunciation(transcript: string): void {
    if (!this.onFeedbackCallback) return;

    // Analyse basique de prononciation - peut être améliorée avec des APIs spécialisées
    const feedback: SpeechFeedback = {
      text: transcript,
      language: this.config.language,
      accuracy: this.calculateAccuracy(transcript),
      corrections: this.generateCorrections(transcript)
    };

    this.onFeedbackCallback(feedback);
  }

  private calculateAccuracy(transcript: string): number {
    // Calcul basique - dans une vraie app, on comparerait avec le texte attendu
    const words = transcript.split(' ');
    const recognizedWords = words.filter(word => word.length > 2);
    return Math.min(100, (recognizedWords.length / words.length) * 100);
  }

  private generateCorrections(transcript: string): Array<{word: string, suggestion: string, position: number}> {
    // Corrections basiques - dans une vraie app, on utiliserait un service de correction avancé
    const corrections: Array<{word: string, suggestion: string, position: number}> = [];
    const words = transcript.split(' ');
    
    words.forEach((word, index) => {
      // Exemples de corrections communes pour le français
      if (this.config.language === 'fr') {
        if (word.toLowerCase() === 'bonjour' && word !== 'bonjour') {
          corrections.push({
            word,
            suggestion: 'bonjour',
            position: index
          });
        }
      }
    });

    return corrections;
  }

  public getCapabilities(): {
    synthesis: boolean;
    recognition: boolean;
    languages: Language[];
  } {
    return {
      synthesis: !!this.synthesis,
      recognition: !!this.recognition,
      languages: ['fr', 'en']
    };
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Instance globale pour l'app
export const speechManager = new BilingualSpeechManager();