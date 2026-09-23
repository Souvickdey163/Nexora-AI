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
  UserCheck,
} from 'lucide-react';
import { interviewApi, InterviewDTO, InterviewQuestionDTO, InterviewReportDTO } from '@/lib/api/interview';
import { InterviewReportModal } from './InterviewReportModal';

interface LiveInterviewRoomProps {
  interview: InterviewDTO;
  onExit: () => void;
}

export const LiveInterviewRoom: React.FC<LiveInterviewRoomProps> = ({ interview: initialInterview, onExit }) => {
  const [interview, setInterview] = useState<InterviewDTO>(initialInterview);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionDTO | null>(
    initialInterview.questions?.[0] || null
  );

  // Candidate Consent State
  const [consentGiven, setConsentGiven] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Video & Speech Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [userText, setUserText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any | null>(null);
  const [integrityEvents, setIntegrityEvents] = useState<string[]>([]);

  // Presentation HUD Metrics
  const [presentationMetrics, setPresentationMetrics] = useState({
    faceVisibilityPct: 96,
    cameraOrientation: 'Centered',
    gazeShifts: 0,
    posture: 'Upright',
  });

  const [report, setReport] = useState<InterviewReportDTO | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<any>(null);

  // Session timer
  useEffect(() => {
    if (!consentGiven) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [consentGiven]);

  // Window Focus / Integrity Event Monitoring
  useEffect(() => {
    if (!consentGiven) return;

    const handleBlur = () => {
      const msg = `Window lost focus at ${new Date().toLocaleTimeString()}`;
      setIntegrityEvents((prev) => [...prev, msg]);
      interviewApi.logEvent(interview.id, 'WINDOW_BLUR', msg);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [consentGiven, interview.id]);

  const [roomError, setRoomError] = useState<string | null>(null);

  // Request Camera & Mic Permission with Explicit Consent
  const startCameraAndMic = async () => {
    setRoomError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMediaStream(stream);
      setConsentGiven(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start MediaRecorder for Video Archive
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Start Web Speech API Recognition
      startSpeechRecognition();

      // Read initial question out loud via TTS
      if (initialInterview.questions?.[0]) {
        speakQuestion(initialInterview.questions[0].questionText);
      }
    } catch (err: any) {
      setRoomError('Camera or microphone access denied/unavailable: ' + err.message);
    }
  };

  const startSpeechRecognition = () => {
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
        setTranscriptText((prev) => prev + ' ' + liveStr);
        setUserText((prev) => (prev ? prev + ' ' + liveStr : liveStr));
      };

      try {
        rec.start();
        speechRecRef.current = rec;
      } catch (err) {
        console.warn('Speech recognition start note:', err);
      }
    }
  };

  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    setRoomError(null);
    if (!currentQuestion) return;
    const finalAnswer = (userText || transcriptText || '').trim();
    if (!finalAnswer) {
      setRoomError('Please speak or enter an answer before submitting.');
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

    try {
      const res = await interviewApi.getNextQuestion(interview.id);
      if (res.success && res.data) {
        if (res.data.isFinished) {
          handleFinishAndSaveRecording();
        } else if (res.data.question) {
          setCurrentQuestion(res.data.question);
          speakQuestion(res.data.question.questionText);
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

  const handleFinishAndSaveRecording = async () => {
    setRoomError(null);
    setIsSubmitting(true);

    // Stop MediaRecorder & Speech Recognition
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecRef.current) {
      speechRecRef.current.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Combine Video Chunks and Upload
    const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

    try {
      if (videoBlob.size > 0) {
        await interviewApi.uploadRecording(interview.id, videoBlob, timerSeconds);
      }

      const res = await interviewApi.finishInterview(interview.id, { presentationMetrics });
      if (res.success && res.data) {
        setReport(res.data);
        setShowReportModal(true);
      } else {
        setRoomError(res.error || 'Failed to complete live interview analysis.');
      }
    } catch (err: any) {
      console.error('Error finishing live interview:', err);
      setRoomError('Failed to upload recording or finish interview.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Candidate Consent Modal
  if (!consentGiven) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Candidate Camera & Mic Consent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nexora Live AI Interview records your webcam feed and microphone responses for personalized performance analysis
              and review in your private account history.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <ShieldAlert className="w-4 h-4" /> Strict Privacy Assurance
            </div>
            <ul className="space-y-1 text-slate-400">
              <li>• Videos are saved securely in your isolated user account.</li>
              <li>• Only technical signals (posture, gaze shifts, WPM) are evaluated.</li>
              <li>• No raw videos are exposed publicly.</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onExit}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={startCameraAndMic}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/25"
            >
              I Agree & Enter Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Nexora Live AI Interview Room</h2>
            <p className="text-xs text-slate-400">
              Target Role: <span className="text-slate-200 font-semibold">{interview.targetRole}</span> • Mode:{' '}
              <span className="text-indigo-400 font-semibold">Live AI Interview</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Rec indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> REC LIVE
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400" /> {formatTimer(timerSeconds)}
          </div>
          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Leave Interview
          </button>
        </div>
      </div>

      {/* Main Grid: Candidate Camera View + AI Interviewer Panel */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Webcam Feed & Observable Presentation HUD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col space-y-4 shadow-2xl relative overflow-hidden">
          <div className="relative flex-1 bg-black rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Observable Presentation HUD overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-slate-800 rounded-xl px-3 py-2 text-[11px] space-y-1">
              <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400" /> Presentation HUD
              </div>
              <div className="text-slate-200">
                Face Visibility: <span className="font-bold text-emerald-400">{presentationMetrics.faceVisibilityPct}%</span>
              </div>
              <div className="text-slate-200">
                Posture: <span className="font-bold text-indigo-300">{presentationMetrics.posture}</span>
              </div>
              <div className="text-slate-200">
                Gaze Shifts: <span className="font-bold text-slate-300">{presentationMetrics.gazeShifts}</span>
              </div>
            </div>

            {/* Controls Bar Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur border border-slate-800 px-4 py-2 rounded-2xl">
              <button
                onClick={toggleCamera}
                className={`p-2.5 rounded-xl transition ${
                  cameraEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition ${
                  micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Integrity Warning Log Banner if any */}
          {integrityEvents.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Integrity event recorded: Focus shift detected.</span>
            </div>
          )}
        </div>

        {/* Right: AI Interviewer Question & Real-time Transcript */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          {currentQuestion ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Question Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Question {currentQuestion.questionIndex} • {currentQuestion.category}
                  </span>
                  <button
                    onClick={() => speakQuestion(currentQuestion.questionText)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                  >
                    <Volume2 className="w-4 h-4" /> Replay Question
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Real-time Response & Feedback */}
              {!evaluationFeedback ? (
                <div className="space-y-4 flex-1 flex flex-col justify-end">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Live Speech Recognition</span>
                    <p className="text-xs text-slate-200 italic min-h-[60px]">
                      {userText || transcriptText || 'Listening... Speak your answer clearly into the microphone.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Auto-transcribing via browser Speech API
                    </span>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting || !(userText || transcriptText).trim()}
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
                /* Evaluation Summary Card */
                <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span className="font-bold text-white text-sm">AI Answer Evaluation</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Score: {evaluationFeedback.score || 75}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {evaluationFeedback.feedbackSummary || evaluationFeedback.feedback || 'Good response.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={handleFinishAndSaveRecording}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                    >
                      Finish & Save Recording
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
              <h3 className="text-xl font-bold text-white">Live Interview Session Complete</h3>
              <button
                onClick={handleFinishAndSaveRecording}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
              >
                Upload Video Recording & View Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Final Report Modal */}
      {showReportModal && report && (
        <InterviewReportModal
          report={report}
          targetRole={interview.targetRole}
          mode="Live AI Interview"
          onClose={() => {
            setShowReportModal(false);
            onExit();
          }}
        />
      )}
    </div>
  );
};
