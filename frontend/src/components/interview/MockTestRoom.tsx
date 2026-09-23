'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Send,
  Sparkles,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Brain,
  AlertCircle,
  Award,
} from 'lucide-react';
import { interviewApi, InterviewDTO, InterviewQuestionDTO, InterviewReportDTO } from '@/lib/api/interview';
import { InterviewReportModal } from './InterviewReportModal';

interface MockTestRoomProps {
  interview: InterviewDTO;
  onExit: () => void;
}

export const MockTestRoom: React.FC<MockTestRoomProps> = ({ interview: initialInterview, onExit }) => {
  const [interview, setInterview] = useState<InterviewDTO>(initialInterview);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionDTO | null>(
    initialInterview.questions?.[0] || null
  );
  const [userText, setUserText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [evaluationFeedback, setEvaluationFeedback] = useState<any | null>(null);
  const [report, setReport] = useState<InterviewReportDTO | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const recognitionRef = useRef<any>(null);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscriptText(currentTranscript);
        setUserText((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const [roomError, setRoomError] = useState<string | null>(null);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setRoomError('Browser speech recognition is not available in this browser. Please use text input below.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscriptText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async () => {
    setRoomError(null);
    if (!currentQuestion) return;
    const finalAnswerText = (userText || transcriptText || '').trim();
    if (!finalAnswerText) {
      setRoomError('Please enter or dictate an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await interviewApi.submitAnswer(interview.id, {
        questionId: currentQuestion.id,
        userText: finalAnswerText,
        transcriptText: transcriptText || finalAnswerText,
        durationSeconds: 45,
      });

      if (res.success && res.data) {
        setEvaluationFeedback(res.data.evaluationFeedback || res.data);
      } else {
        setRoomError(res.error || 'Failed to submit answer.');
      }
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      setRoomError('Failed to submit answer due to a network connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setRoomError(null);
    setIsSubmitting(true);
    setEvaluationFeedback(null);
    setUserText('');
    setTranscriptText('');
    setShowHint(false);

    try {
      const res = await interviewApi.getNextQuestion(interview.id);
      if (res.success && res.data) {
        if (res.data.isFinished) {
          handleFinishInterview();
        } else if (res.data.question) {
          setCurrentQuestion(res.data.question);
        }
      } else {
        setRoomError(res.error || 'Failed to fetch next question.');
      }
    } catch (err: any) {
      console.error('Error fetching next question:', err);
      setRoomError('Failed to load next question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    setRoomError(null);
    setIsSubmitting(true);
    try {
      const res = await interviewApi.finishInterview(interview.id);
      if (res.success && res.data) {
        setReport(res.data);
        setShowReportModal(true);
      } else {
        setRoomError(res.error || 'Failed to complete interview synthesis.');
      }
    } catch (err: any) {
      console.error('Error finishing interview:', err);
      setRoomError('Failed to synthesize final interview performance report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Session Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Nexora AI Mock Test Room</h2>
            <p className="text-xs text-slate-400">
              Target Role: <span className="text-slate-200 font-semibold">{interview.targetRole}</span> • Difficulty:{' '}
              <span className="text-indigo-400 font-semibold">{interview.difficulty}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400" /> {formatTimer(timerSeconds)}
          </div>
          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Exit Room
          </button>
        </div>
      </div>

      {/* Main Room Body */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6 flex flex-col justify-center">
        {currentQuestion ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {roomError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{roomError}</span>
                </div>
                <button onClick={() => setRoomError(null)} className="text-rose-400 text-xs font-semibold">
                  Dismiss
                </button>
              </div>
            )}

            {/* Question Header Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Question {currentQuestion.questionIndex} • {currentQuestion.category}
              </span>
              {currentQuestion.hints && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition"
                >
                  <HelpCircle className="w-4 h-4" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              )}
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentQuestion.questionText}
              </h3>
              {showHint && currentQuestion.hints && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  💡 <strong>Hint:</strong> {currentQuestion.hints}
                </div>
              )}
            </div>

            {/* Expected Key Points */}
            {currentQuestion.expectedKeyPoints && currentQuestion.expectedKeyPoints.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Key Points to Cover</span>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.expectedKeyPoints.map((pt, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      • {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Input Area (Text + Mic) */}
            {!evaluationFeedback ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={6}
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder="Type or dictate your answer here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                        isRecording
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-4 h-4 text-rose-400" /> Dictating...
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 text-indigo-400" /> Voice Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    {userText.length} characters typed
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userText.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    {isSubmitting ? (
                      'Evaluating Answer...'
                    ) : (
                      <>
                        Submit Answer <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Evaluation Feedback Card */
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-white text-sm">AI Answer Evaluation</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Score: {evaluationFeedback.score || evaluationFeedback.evaluationScore || 75}/100
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluationFeedback.feedbackSummary || evaluationFeedback.feedback || 'Good response.'}
                </p>

                {/* STAR Analysis if present */}
                {evaluationFeedback.starAnalysis && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-indigo-400 font-bold block">Situation</span>
                      <span className="text-slate-400">{evaluationFeedback.starAnalysis.situation}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-indigo-400 font-bold block">Task</span>
                      <span className="text-slate-400">{evaluationFeedback.starAnalysis.task}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-indigo-400 font-bold block">Action</span>
                      <span className="text-slate-400">{evaluationFeedback.starAnalysis.action}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-indigo-400 font-bold block">Result</span>
                      <span className="text-slate-400">{evaluationFeedback.starAnalysis.result}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={handleFinishInterview}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                  >
                    Finish Session & View Report
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Interview Complete</h3>
            <button
              onClick={handleFinishInterview}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
            >
              Generate Final Performance Report
            </button>
          </div>
        )}
      </div>

      {/* Render Final Report Modal */}
      {showReportModal && report && (
        <InterviewReportModal
          report={report}
          targetRole={interview.targetRole}
          mode="AI Mock Test"
          onClose={() => {
            setShowReportModal(false);
            onExit();
          }}
        />
      )}
    </div>
  );
};
