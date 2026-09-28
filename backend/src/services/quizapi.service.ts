import { env } from '../config/env';
import { NormalizedQuizQuestion, QuizAnswerOption, QuizGenerateRequest } from '../types/quiz.types';

export class QuizApiService {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { timestamp: number; data: NormalizedQuizQuestion[] }> = new Map();
  private cacheTTLMs = 5 * 60 * 1000; // 5 minute in-memory cache

  constructor() {
    this.baseUrl = env.QUIZAPI_BASE_URL || 'https://quizapi.io/api/v1';
    this.apiKey = env.QUIZAPI_KEY || 'qa_sk_a712db1bf9fd3bcdf4b58daa1257d11874d6124c';
  }

  /**
   * Fetches questions from QuizAPI endpoint and normalizes them.
   */
  async fetchQuestions(params: QuizGenerateRequest = {}): Promise<NormalizedQuizQuestion[]> {
    const limit = Math.min(20, Math.max(5, params.limit || 10));
    const cacheKey = `${params.category || 'all'}_${params.difficulty || 'all'}_${params.tags?.join(',') || 'none'}_${limit}`;

    // Check in-memory cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTLMs) {
      return cached.data;
    }

    const query = new URLSearchParams({
      limit: limit.toString(),
    });

    if (params.category && params.category !== 'All') {
      query.append('category', params.category);
    }

    if (params.difficulty && params.difficulty !== 'All') {
      query.append('difficulty', params.difficulty.toLowerCase());
    }

    if (params.tags && params.tags.length > 0) {
      query.append('tags', params.tags.join(','));
    }

    const url = `${this.baseUrl}/questions?${query.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`QuizAPI HTTP status error ${res.status}`);
      }

      const json: any = await res.json();
      const rawData = Array.isArray(json) ? json : json.data || json.questions || [];

      if (!Array.isArray(rawData) || rawData.length === 0) {
        // If query returned no specific questions, fallback to fetching general programming questions
        return this.fetchFallbackQuestions(limit);
      }

      const normalized = rawData.map((item: any, index: number) =>
        this.normalizeQuizQuestion(item, index)
      );

      this.cache.set(cacheKey, { timestamp: Date.now(), data: normalized });
      return normalized;
    } catch (err) {
      clearTimeout(timeoutId);
      return this.fetchFallbackQuestions(limit);
    }
  }

  /**
   * Normalizes raw QuizAPI question payload into clean internal structure
   */
  private normalizeQuizQuestion(item: any, index: number): NormalizedQuizQuestion {
    const rawAnswers = item.answers;
    const answerOptions: QuizAnswerOption[] = [];
    let correctAnswerId: string | undefined = undefined;

    if (Array.isArray(rawAnswers)) {
      rawAnswers.forEach((ans: any, idx: number) => {
        const optionId = ans.id || `opt-${idx}`;
        const optionText = typeof ans === 'string' ? ans : ans.text || ans.answer || '';
        if (optionText.trim() !== '') {
          answerOptions.push({ id: optionId, text: optionText });
          if (ans.isCorrect === true || ans.correct === true) {
            correctAnswerId = optionId;
          }
        }
      });
    } else if (rawAnswers && typeof rawAnswers === 'object') {
      // QuizAPI legacy object format { answer_a: "...", answer_b: "..." }
      const correctAnswersMap = item.correct_answers || {};
      Object.entries(rawAnswers).forEach(([key, val]) => {
        if (val && typeof val === 'string' && val.trim() !== '') {
          answerOptions.push({ id: key, text: val.trim() });
          const isCorrect =
            correctAnswersMap[`${key}_correct`] === 'true' ||
            correctAnswersMap[`${key}_correct`] === true ||
            item.correct_answer === key;
          if (isCorrect) {
            correctAnswerId = key;
          }
        }
      });
    }

    // Default correct answer fallback if not explicitly set
    if (!correctAnswerId && answerOptions.length > 0) {
      correctAnswerId = answerOptions[0].id;
    }

    return {
      id: item.id ? String(item.id) : `q-${Date.now()}-${index}`,
      question: item.text || item.question || 'Technical MCQ Question',
      description: item.description || undefined,
      difficulty: item.difficulty || 'Medium',
      category: item.category || 'General CS',
      tags: Array.isArray(item.tags) ? item.tags : [],
      answers: answerOptions,
      correctAnswer: correctAnswerId,
      explanation: item.explanation || undefined,
    };
  }

  /**
   * Fallback generator for offline/rate-limit scenarios with authentic technical MCQs
   */
  private fetchFallbackQuestions(limit: number): NormalizedQuizQuestion[] {
    const SEED_QUESTIONS: NormalizedQuizQuestion[] = [
      {
        id: 'fallback-1',
        question: 'What is the primary function of the Linux kernel?',
        category: 'Linux',
        difficulty: 'Medium',
        answers: [
          { id: 'opt-a', text: 'Manage hardware resources and bridge communication with software' },
          { id: 'opt-b', text: 'Provide a GUI desktop environment' },
          { id: 'opt-c', text: 'Render HTML web pages' },
          { id: 'opt-d', text: 'Compile C programs automatically' },
        ],
        correctAnswer: 'opt-a',
        explanation: 'The Linux kernel manages system memory, CPU execution, processes, device drivers, and system calls.',
      },
      {
        id: 'fallback-2',
        question: 'In Docker, what is the difference between an image and a container?',
        category: 'DevOps',
        difficulty: 'Easy',
        answers: [
          { id: 'opt-a', text: 'An image is a read-only template; a container is a runnable instance of an image' },
          { id: 'opt-b', text: 'A container is compiled C code; an image is JavaScript source code' },
          { id: 'opt-c', text: 'They are completely identical terms' },
          { id: 'opt-d', text: 'An image runs in memory while a container stays on disk' },
        ],
        correctAnswer: 'opt-a',
        explanation: 'Docker images contain application code, dependencies, and configuration. Containers are isolated runtime instances created from images.',
      },
      {
        id: 'fallback-3',
        question: 'Which SQL keyword is used to eliminate duplicate rows from a query result?',
        category: 'SQL',
        difficulty: 'Easy',
        answers: [
          { id: 'opt-a', text: 'DISTINCT' },
          { id: 'opt-b', text: 'UNIQUE' },
          { id: 'opt-c', text: 'GROUP BY' },
          { id: 'opt-d', text: 'FILTER' },
        ],
        correctAnswer: 'opt-a',
        explanation: 'The SELECT DISTINCT statement is used to return only distinct (different) values in SQL queries.',
      },
      {
        id: 'fallback-4',
        question: 'What is the output of `typeof null` in JavaScript?',
        category: 'JavaScript',
        difficulty: 'Medium',
        answers: [
          { id: 'opt-a', text: '"object"' },
          { id: 'opt-b', text: '"null"' },
          { id: 'opt-c', text: '"undefined"' },
          { id: 'opt-d', text: '"number"' },
        ],
        correctAnswer: 'opt-a',
        explanation: 'In JavaScript, typeof null returns "object", which is a historical bug in the language implementation.',
      },
      {
        id: 'fallback-5',
        question: 'What is a Python tuple and how does it differ from a list?',
        category: 'Python',
        difficulty: 'Easy',
        answers: [
          { id: 'opt-a', text: 'Tuples are immutable ordered collections; lists are mutable' },
          { id: 'opt-b', text: 'Tuples can only store integers' },
          { id: 'opt-c', text: 'Lists use () syntax; tuples use [] syntax' },
          { id: 'opt-d', text: 'Tuples cannot be indexed' },
        ],
        correctAnswer: 'opt-a',
        explanation: 'Python tuples are immutable sequences, defined with parentheses (), whereas lists are mutable and defined with square brackets [].',
      },
    ];

    return SEED_QUESTIONS.slice(0, limit);
  }
}

export const quizApiService = new QuizApiService();
