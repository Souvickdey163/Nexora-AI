export interface SpeechAnalysisResult {
  wpm: number;
  fillerWordsCount: number;
  fillerWordsDetail: Record<string, number>;
  speakingDurationSeconds: number;
}

export interface LanguageAnalysisResult {
  englishPct: number;
  hindiPct: number;
  mixedPct: number;
  feedback: string;
}

const FILLER_WORDS = ['um', 'uh', 'like', 'actually', 'basically', 'literally', 'you know', 'kind of', 'sort of', 'i mean'];
const HINDI_COMMON_WORDS = ['haan', 'nahi', 'kya', 'aur', 'phir', 'bhi', 'karna', 'hoga', 'mera', 'apna', 'chahiye', 'lekin', 'kyunki', 'kaam'];

export class AnalysisService {
  /**
   * Analyze speech transcript for WPM and filler words count.
   */
  public analyzeSpeech(transcriptText: string, durationSeconds: number): SpeechAnalysisResult {
    const cleanText = (transcriptText || '').trim().toLowerCase();
    if (!cleanText) {
      return {
        wpm: 0,
        fillerWordsCount: 0,
        fillerWordsDetail: {},
        speakingDurationSeconds: Math.max(1, durationSeconds),
      };
    }

    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const safeDurationMinutes = Math.max(0.1, (durationSeconds || 30) / 60);
    const wpm = Math.round(wordCount / safeDurationMinutes);

    const fillerWordsDetail: Record<string, number> = {};
    let fillerWordsCount = 0;

    FILLER_WORDS.forEach((fw) => {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi');
      const matches = cleanText.match(regex);
      if (matches && matches.length > 0) {
        fillerWordsDetail[fw] = matches.length;
        fillerWordsCount += matches.length;
      }
    });

    return {
      wpm,
      fillerWordsCount,
      fillerWordsDetail,
      speakingDurationSeconds: Math.max(1, durationSeconds),
    };
  }

  /**
   * Analyze language proportions (English vs Hindi/Hinglish).
   */
  public detectLanguage(transcriptText: string): LanguageAnalysisResult {
    const cleanText = (transcriptText || '').trim().toLowerCase();
    if (!cleanText) {
      return {
        englishPct: 100,
        hindiPct: 0,
        mixedPct: 0,
        feedback: 'Primary language: English. Clean delivery.',
      };
    }

    const words = cleanText.split(/\s+/).filter(Boolean);
    let hindiCount = 0;

    words.forEach((w) => {
      const cleanWord = w.replace(/[^a-z]/g, '');
      if (HINDI_COMMON_WORDS.includes(cleanWord)) {
        hindiCount++;
      }
    });

    const totalWords = Math.max(1, words.length);
    const hindiPct = Math.min(100, Math.round((hindiCount / totalWords) * 100));
    const englishPct = 100 - hindiPct;
    const mixedPct = hindiPct > 5 ? Math.round(hindiPct / 2) : 0;

    let feedback = 'Primary language: English. Consistent single-language delivery.';
    if (hindiPct > 10) {
      feedback = 'Language switching detected: You incorporated Hindi/Hinglish terms. For formal English interviews, practice maintaining consistent English phrasing.';
    }

    return {
      englishPct,
      hindiPct,
      mixedPct,
      feedback,
    };
  }

  /**
   * Evaluate answer quality for insufficient response detection before AI scoring.
   */
  public checkAnswerQuality(text: string): { isValid: boolean; reason?: string } {
    const clean = (text || '').trim().toLowerCase();
    if (!clean) {
      return { isValid: false, reason: 'Insufficient Response: Answer cannot be empty.' };
    }

    if (clean.length < 15) {
      return { isValid: false, reason: 'Insufficient Response: Your answer was too short to evaluate the required concepts.' };
    }

    const invalidPhrases = ["don't know", "dont know", "no idea", "idk", "asdf", "qwerty", "pass", "no answer", "dunno", "nothing"];
    const containsInvalid = invalidPhrases.some((phrase) => clean.includes(phrase)) && clean.length < 50;
    if (containsInvalid) {
      return { isValid: false, reason: 'Insufficient Response: Answer indicated uncertainty or lack of attempt.' };
    }

    const words = clean.split(/\s+/).filter(Boolean);
    const uniqueWords = new Set(words);
    if (words.length > 3 && uniqueWords.size <= 2) {
      return { isValid: false, reason: 'Insufficient Response: Repetitive or meaningless word pattern detected.' };
    }

    return { isValid: true };
  }
}

export const analysisService = new AnalysisService();
