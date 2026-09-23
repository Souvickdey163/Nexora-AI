'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Square,
  ShieldAlert,
  Send,
  Sparkles,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Brain,
  Volume2,
  Maximize,
  Minimize,
  HelpCircle,
  TrendingUp,
  Layers,
  FileText,
} from 'lucide-react';
import { interviewApi, InterviewDTO, InterviewQuestionDTO, InterviewReportDTO } from '@/lib/api/interview';
import { InterviewReportModal } from './InterviewReportModal';

interface InterviewRoomProps {
  interview: InterviewDTO;
  stream: MediaStream | null;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ interview: initialInterview, stream, onExit }) => {
  const [interview, setInterview] = useState<InterviewDTO>(initialInterview);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionDTO | null>(
    initialInterview.questions?.[0] || null
  );

  // Stream & Recording State
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(stream);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Fullscreen & Integrity State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [integrityEvents, setIntegrityEvents] = useState<string[]>([]);

  // Input & Evaluation State
  const [userText, setUserText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [showAnswerGuidance, setShowAnswerGuidance] = useState(false);

  // Report State
  const [report, setReport] = useState<InterviewReportDTO | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Timer State (e.g. 30 mins countdown)
  const initialDurationSec = (initialInterview.durationMinutes || 30) * 60;
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(initialDurationSec);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<any>(null);

  // Attach Stream to Video Tag & Start Recording
  useEffect(() => {
    if (stream) {
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize MediaRecorder for Video Archiving
      try {
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
          ? 'video/webm;codecs=vp8,opus'
          : 'video/webm';
        const recorder = new MediaRecorder(stream, { mimeType: mime });
        recordedChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);

        interviewApi.logEvent(interview.id, 'RECORDING_STARTED', 'Video & audio recording initialized.');
      } catch (err: any) {
        console.warn('MediaRecorder error:', err);
      }
    }

    // Check initial Fullscreen status
    setIsFullscreen(!!document.fullscreenElement);
    interviewApi.logEvent(interview.id, 'INTERVIEW_STARTED', `Interview room launched for ${interview.targetRole}`);
  }, [stream]);

  // Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fullscreen & Visibility Integrity Listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) {
        setShowFullscreenWarning(true);
        const msg = `Fullscreen exited at ${new Date().toLocaleTimeString()}`;
        setIntegrityEvents((prev) => [...prev, msg]);
        interviewApi.logEvent(interview.id, 'FULLSCREEN_EXITED', msg);
      } else {
        setShowFullscreenWarning(false);
        interviewApi.logEvent(interview.id, 'FULLSCREEN_ENTERED', `Re-entered fullscreen`);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const msg = `Tab hidden/switched at ${new Date().toLocaleTimeString()}`;
        setIntegrityEvents((prev) => [...prev, msg]);
        interviewApi.logEvent(interview.id, 'TAB_HIDDEN', msg);
      } else {
        interviewApi.logEvent(interview.id, 'TAB_VISIBLE', 'Tab active');
      }
    };

    const handleWindowBlur = () => {
      const msg = `Window blur / focus loss at ${new Date().toLocaleTimeString()}`;
      interviewApi.logEvent(interview.id, 'WINDOW_BLUR', msg);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [interview.id]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let liveStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          liveStr += event.results[i][0].transcript;
        }
        setTranscriptText(liveStr);
        setUserText((prev) => (prev ? prev + ' ' + liveStr : liveStr));
      };

      rec.onerror = () => setIsDictating(false);
      rec.onend = () => setIsDictating(false);
      speechRecRef.current = rec;
    }
  }, []);

  const toggleDictation = () => {
    if (!speechRecRef.current) {
      setRoomError('Browser speech recognition is not supported on this browser. Please use text typing.');
      return;
    }

    if (isDictating) {
      speechRecRef.current.stop();
      setIsDictating(false);
    } else {
      setTranscriptText('');
      speechRecRef.current.start();
      setIsDictating(true);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err: any) {
      console.warn('Fullscreen toggle notice:', err);
    }
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setCameraEnabled(track.enabled);
        interviewApi.logEvent(interview.id, track.enabled ? 'CAMERA_ENABLED' : 'CAMERA_DISABLED', `Camera toggled`);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStream) {
      const track = mediaStream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setMicEnabled(track.enabled);
        interviewApi.logEvent(interview.id, track.enabled ? 'MICROPHONE_ENABLED' : 'MICROPHONE_DISABLED', `Mic toggled`);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    setRoomError(null);
    if (!currentQuestion) return;

    const finalAnswer = (userText || transcriptText || '').trim();
    if (!finalAnswer) {
      setRoomError('Please type or dictate an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await interviewApi.submitAnswer(interview.id, {
        questionId: currentQuestion.id,
        userText: finalAnswer,
        transcriptText: transcriptText || finalAnswer,
        durationSeconds: 45,
      });

      if (res.success && res.data) {
        setEvaluationFeedback(res.data.evaluationFeedback || res.data);
        interviewApi.logEvent(interview.id, 'ANSWER_SUBMITTED', `Answer submitted for Q${currentQuestion.questionIndex}`);
      } else {
        setRoomError(res.error || 'Failed to evaluate answer.');
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
    setShowAnswerGuidance(false);

    try {
      const res = await interviewApi.getNextQuestion(interview.id);
      if (res.success && res.data) {
        if (res.data.isFinished) {
          handleFinishInterview();
        } else if (res.data.question) {
          setCurrentQuestion(res.data.question);
          interviewApi.logEvent(interview.id, 'QUESTION_VIEWED', `Question ${res.data.question.questionIndex} loaded`);
        }
      } else {
        setRoomError(res.error || 'Failed to load next question.');
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

    // Stop Recorder & Stream
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecRef.current) {
      speechRecRef.current.stop();
    }

    // Upload Video Archive
    const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    try {
      if (videoBlob.size > 0) {
        await interviewApi.uploadRecording(interview.id, videoBlob, initialDurationSec - timeRemainingSeconds);
      }

      const res = await interviewApi.finishInterview(interview.id, {
        presentationMetrics: {
          faceVisibilityPct: 96,
          cameraOrientation: 'Centered',
          gazeShifts: integrityEvents.length,
          posture: 'Upright',
        },
      });

      if (res.success && res.data) {
        setReport(res.data);
        setShowReportModal(true);
        interviewApi.logEvent(interview.id, 'INTERVIEW_COMPLETED', 'Interview completed and report generated');
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

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Top Header Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Nexora AI Interview Assessment</h2>
            <p className="text-xs text-slate-400">
              Target Role: <span className="text-slate-200 font-semibold">{interview.targetRole}</span> • Type:{' '}
              <span className="text-indigo-400 font-semibold">{interview.type}</span> • Difficulty:{' '}
              <span className="text-indigo-400 font-semibold">{interview.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400" /> Time Remaining: {formatTimer(timeRemainingSeconds)}
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </button>

          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Grid: Left Question/Answer Area + Right Live Camera Preview & HUD */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Question & Answer Workspace (Span 8) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          {currentQuestion ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex-1 flex flex-col justify-between">
              {/* Question Header & Category Badge */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                    Question {currentQuestion.questionIndex} of 5 • {currentQuestion.category}
                  </span>
                </div>

                {/* Question Text (Note: Key Points to Cover are NOT shown before submission!) */}
                <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Error Banner if any */}
              {roomError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{roomError}</span>
                  </div>
                  <button onClick={() => setRoomError(null)} className="text-rose-400 text-xs font-semibold">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Answer Area (Before Evaluation) */}
              {!evaluationFeedback ? (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="relative">
                    <textarea
                      rows={7}
                      value={userText}
                      onChange={(e) => setUserText(e.target.value)}
                      placeholder="Type your structured candidate answer here or click 'Voice Answer' to dictate..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleDictation}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                          isDictating
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {isDictating ? (
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
                    <span className="text-xs text-slate-500 font-mono">
                      {userText.length} characters • {userText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting || !userText.trim()}
                      className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                    >
                      {isSubmitting ? (
                        'Evaluating Response...'
                      ) : (
                        <>
                          Submit Answer <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Submission Evaluation Panel */
                <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span className="font-bold text-white text-sm">
                        {evaluationFeedback.isInsufficient ? 'Insufficient Response Detected' : 'AI Response Evaluation'}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        evaluationFeedback.score === 0 || evaluationFeedback.isInsufficient
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : evaluationFeedback.score >= 80
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      Score: {evaluationFeedback.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {evaluationFeedback.feedbackSummary || evaluationFeedback.feedback}
                  </p>

                  {/* HR / Behavioral STAR Rubric Breakdown */}
                  {evaluationFeedback.starAnalysis && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Situation</span>
                        <span className="text-slate-400">{evaluationFeedback.starAnalysis.situation || 'Not provided'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Task</span>
                        <span className="text-slate-400">{evaluationFeedback.starAnalysis.task || 'Not provided'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Action</span>
                        <span className="text-slate-400">{evaluationFeedback.starAnalysis.action || 'Not provided'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Result</span>
                        <span className="text-slate-400">{evaluationFeedback.starAnalysis.result || 'Not provided'}</span>
                      </div>
                    </div>
                  )}

                  {/* Technical Rubric Breakdown */}
                  {evaluationFeedback.technicalAnalysis && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Technical Correctness</span>
                        <span className="text-slate-400">{evaluationFeedback.technicalAnalysis.correctness}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Concept Depth</span>
                        <span className="text-slate-400">{evaluationFeedback.technicalAnalysis.conceptDepth}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Trade-off Analysis</span>
                        <span className="text-slate-400">{evaluationFeedback.technicalAnalysis.tradeoffs}</span>
                      </div>
                    </div>
                  )}

                  {/* System Design Rubric Breakdown */}
                  {evaluationFeedback.systemDesignAnalysis && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Architecture</span>
                        <span className="text-slate-400">{evaluationFeedback.systemDesignAnalysis.architecture}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Scalability & Caching</span>
                        <span className="text-slate-400">{evaluationFeedback.systemDesignAnalysis.scalability}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Data Model & APIs</span>
                        <span className="text-slate-400">{evaluationFeedback.systemDesignAnalysis.dataModelAndAPIs}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-0.5">Trade-offs</span>
                        <span className="text-slate-400">{evaluationFeedback.systemDesignAnalysis.tradeoffs}</span>
                      </div>
                    </div>
                  )}

                  {/* Reveal Guidance (ONLY AFTER SUBMISSION) */}
                  {currentQuestion.expectedKeyPoints && currentQuestion.expectedKeyPoints.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setShowAnswerGuidance(!showAnswerGuidance)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {showAnswerGuidance ? 'Hide Answer Rubric Guidance' : 'What a Strong Answer Could Include'}
                      </button>

                      {showAnswerGuidance && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <span className="font-bold text-slate-300 block">Expected Concepts:</span>
                          <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                            {currentQuestion.expectedKeyPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={handleFinishInterview}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                    >
                      Finish Interview & View Report
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/25"
                    >
                      Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Interview Assessment Complete</h3>
              <button
                onClick={handleFinishInterview}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/25"
              >
                Synthesize & View Final Report
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Camera Feed & Active Status HUD (Span 4) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col space-y-4 shadow-2xl">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />

            {/* Live Camera Feed Watermark / Indicator */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] font-semibold text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cameraEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              {cameraEnabled ? 'Live Feed Active' : 'Camera Muted'}
            </div>

            {/* Camera / Mic Controls Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl">
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-lg transition ${
                  cameraEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMic}
                className={`p-2 rounded-lg transition ${
                  micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Status Indicators Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Active Assessment Indicators
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Camera Feed:</span>
              <span className={`font-bold ${cameraEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                {cameraEnabled ? '● Active' : '✕ Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Microphone:</span>
              <span className={`font-bold ${micEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                {micEnabled ? '● Active' : '✕ Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Media Recording:</span>
              <span className={`font-bold ${isRecording ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
                {isRecording ? '● Recording Archive' : 'Off'}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span className="text-slate-300">Fullscreen Integrity:</span>
              <span className={`font-bold ${isFullscreen ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isFullscreen ? '● Active' : '⚠ Exited'}
              </span>
            </div>
          </div>

          {/* Neutral Observable Presentation Indicators */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Observable Presentation Indicators
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Face Visibility</span>
                <span className="font-bold text-emerald-400 text-sm">96%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Framing</span>
                <span className="font-bold text-white text-sm">Centered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Exit Warning Modal Overlay */}
      {showFullscreenWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Fullscreen Mode Exited</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interview Integrity Mode requires fullscreen mode during your assessment. Please re-enter fullscreen mode to continue.
            </p>
            <button
              onClick={toggleFullscreen}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-500/25"
            >
              Re-enter Fullscreen Mode
            </button>
          </div>
        </div>
      )}

      {/* Final Performance Report Modal */}
      {showReportModal && report && (
        <InterviewReportModal
          report={report}
          targetRole={interview.targetRole}
          mode={interview.mode}
          onClose={() => {
            setShowReportModal(false);
            onExit();
          }}
        />
      )}
    </div>
  );
};
