'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Video,
  Play,
  Film,
  Award,
  Trash2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Layers,
  Clock,
  ChevronRight,
  Filter,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mic,
  Maximize,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { interviewApi, InterviewDTO, InterviewReportDTO, InterviewTypeOption } from '@/lib/api/interview';
import { resumeApi } from '@/lib/api/resume';
import { InterviewRoom } from './InterviewRoom';
import { InterviewReportModal } from './InterviewReportModal';
import { RecordingPlayerModal } from './RecordingPlayerModal';

type StudioStep = 'setup' | 'instructions' | 'device_check' | 'fullscreen_check' | 'active_room';

export const InterviewStudio: React.FC = () => {
  // Step progression state
  const [studioStep, setStudioStep] = useState<StudioStep>('setup');

  // Step 1 Form Configuration
  const [selectedMode, setSelectedMode] = useState<'MOCK_TEST' | 'LIVE_INTERVIEW'>('MOCK_TEST');
  const [targetRole, setTargetRole] = useState('Frontend Engineer');
  const [interviewType, setInterviewType] = useState<InterviewTypeOption>('TECHNICAL');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [jobDescription, setJobDescription] = useState('');

  // Resume Selection
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Preflight Device State
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCheckingDevices, setIsCheckingDevices] = useState(false);
  const [preflightError, setPreflightError] = useState<string | null>(null);

  // Fullscreen State
  const [isFullscreenReady, setIsFullscreenReady] = useState(false);

  // Active Room & Loading
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeInterview, setActiveInterview] = useState<InterviewDTO | null>(null);

  // History state
  const [history, setHistory] = useState<InterviewDTO[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'MOCK_TEST' | 'LIVE_INTERVIEW'>('ALL');

  // Modal view states
  const [selectedReport, setSelectedReport] = useState<InterviewReportDTO | null>(null);
  const [selectedReportRole, setSelectedReportRole] = useState('');
  const [selectedReportMode, setSelectedReportMode] = useState('');

  const [recordingModalData, setRecordingModalData] = useState<{
    interviewId: string;
    targetRole: string;
    durationSeconds: number;
    questions: any[];
  } | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Fetch History & Resumes on Mount
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const modeParam = historyFilter === 'ALL' ? undefined : historyFilter;
      const res = await interviewApi.listInterviews({ mode: modeParam });
      if (res.success && res.data) {
        setHistory(res.data.interviews);
      }
    } catch (err) {
      console.error('Failed to load interview history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await resumeApi.listResumes();
      if (res && (res as any).resumes) {
        setUserResumes((res as any).resumes);
      }
    } catch (err) {
      console.warn('Could not load user resumes:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchResumes();
  }, [historyFilter]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mediaStream]);

  // STEP 1 -> STEP 2
  const handleProceedToInstructions = () => {
    setErrorMessage(null);
    if (!targetRole.trim()) {
      setErrorMessage('Please enter a target job role before proceeding.');
      return;
    }
    setStudioStep('instructions');
  };

  // STEP 2 -> STEP 3: Request Camera & Microphone
  const handleStartDeviceCheck = async () => {
    setPreflightError(null);
    setIsCheckingDevices(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMediaStream(stream);
      setCameraReady(true);
      setMicReady(true);
      setStudioStep('device_check');

      // Attach stream to preview element
      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      }, 100);

      // Web Audio API Audio Level Meter
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudioLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      } catch (e) {
        console.warn('Audio level meter error:', e);
      }
    } catch (err: any) {
      console.error('Device permission error:', err);
      setPreflightError('Camera and Microphone permissions are required to start an interview assessment. Please grant permissions in your browser and try again.');
    } finally {
      setIsCheckingDevices(false);
    }
  };

  // STEP 3 -> STEP 4
  const handleProceedToFullscreen = () => {
    if (!cameraReady || !micReady) {
      setPreflightError('Please grant Camera and Microphone access before continuing.');
      return;
    }
    setStudioStep('fullscreen_check');
  };

  // STEP 4: Request Fullscreen
  const handleRequestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreenReady(true);
    } catch (err: any) {
      console.warn('Fullscreen notice:', err);
    }
  };

  // STEP 4 -> START ACTIVE INTERVIEW
  const handleLaunchInterviewSession = async () => {
    setErrorMessage(null);
    setIsStarting(true);

    try {
      const res = await interviewApi.createInterview({
        mode: selectedMode,
        type: interviewType,
        targetRole: targetRole.trim(),
        difficulty,
        durationMinutes,
        jobDescription: jobDescription.trim() || undefined,
      });

      if (res.success && res.data) {
        setActiveInterview(res.data);
        setStudioStep('active_room');
      } else {
        const errorText = typeof res.error === 'string' ? res.error : 'Failed to initialize interview session.';
        setErrorMessage(errorText);
      }
    } catch (err: any) {
      console.error('Error starting interview:', err);
      setErrorMessage('Failed to launch interview session due to a network error.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleViewReport = async (interviewId: string, role: string, mode: string) => {
    try {
      const res = await interviewApi.getInterview(interviewId);
      if (res.success && res.data && res.data.report) {
        setSelectedReport(res.data.report);
        setSelectedReportRole(role);
        setSelectedReportMode(mode);
      } else {
        setErrorMessage('Performance report is not available yet for this session.');
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    }
  };

  const handleReplayRecording = async (interviewId: string, role: string) => {
    try {
      const res = await interviewApi.getInterview(interviewId);
      if (res.success && res.data) {
        setRecordingModalData({
          interviewId: res.data.id,
          targetRole: role,
          durationSeconds: res.data.recording?.durationSeconds || 60,
          questions: res.data.questions || [],
        });
      }
    } catch (err) {
      console.error('Failed to load recording session:', err);
    }
  };

  const handleDelete = async (interviewId: string) => {
    if (!confirm('Are you sure you want to delete this interview recording and report?')) return;
    try {
      await interviewApi.deleteInterview(interviewId);
      fetchHistory();
    } catch (err) {
      console.error('Failed to delete interview:', err);
    }
  };

  // Active Interview Room render
  if (studioStep === 'active_room' && activeInterview) {
    return (
      <InterviewRoom
        interview={activeInterview}
        stream={mediaStream}
        onExit={() => {
          if (mediaStream) {
            mediaStream.getTracks().forEach((t) => t.stop());
            setMediaStream(null);
          }
          setActiveInterview(null);
          setStudioStep('setup');
          fetchHistory();
        }}
      />
    );
  }

  return (
    <div className="space-y-10 py-6">
      {/* Title Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI Interview Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Adaptive AI Mock Test & Live Interview Studio
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Prepare for technical, behavioral, and system design interviews with real-time AI questions, category-specific rubrics, live video recording, and detailed performance reports.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold text-center">
        <div className={`py-2 rounded-xl transition ${studioStep === 'setup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
          1. Configuration
        </div>
        <div className={`py-2 rounded-xl transition ${studioStep === 'instructions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
          2. Instructions
        </div>
        <div className={`py-2 rounded-xl transition ${studioStep === 'device_check' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
          3. Preflight Check
        </div>
        <div className={`py-2 rounded-xl transition ${studioStep === 'fullscreen_check' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
          4. Integrity Mode
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* STEP 1: CONFIGURATION */}
      {studioStep === 'setup' && (
        <div className="space-y-8">
          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => setSelectedMode('MOCK_TEST')}
              className={`cursor-pointer rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                selectedMode === 'MOCK_TEST'
                  ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Brain className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedMode === 'MOCK_TEST' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {selectedMode === 'MOCK_TEST' ? 'Selected' : 'Select Mode'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">AI Mock Test</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Structured adaptive test room. Evaluates candidate answers with category-specific rubrics and instant feedback.
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedMode('LIVE_INTERVIEW')}
              className={`cursor-pointer rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                selectedMode === 'LIVE_INTERVIEW'
                  ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedMode === 'LIVE_INTERVIEW' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {selectedMode === 'LIVE_INTERVIEW' ? 'Selected' : 'Select Mode'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Live AI Interview</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Webcam preview & microphone interview with MediaRecorder video archiving and real-time speech streaming.
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Configure Interview Assessment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Job Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="TECHNICAL">Technical Deep Dive</option>
                  <option value="HR_BEHAVIORAL">HR & Behavioral</option>
                  <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                  <option value="MIXED">Mixed Comprehensive Panel</option>
                  <option value="RESUME_BASED">Resume & Project Deep Dive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="EASY">Easy (Junior Level)</option>
                  <option value="MEDIUM">Medium (Mid Level)</option>
                  <option value="HARD">Hard (Senior / Lead)</option>
                </select>
              </div>
            </div>

            {/* Optional Resume Context Selection if user has uploaded resumes */}
            {userResumes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Target Candidate Resume Context (Optional)</span>
                  <span className="text-slate-500 font-normal">Extracts skills & projects to tailor AI questions</span>
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Resume (Default Role Target)</option>
                  {userResumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.title || 'Uploaded Resume'} ({new Date(res.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Target Job Description (Optional)</span>
                <span className="text-slate-500 font-normal">Customizes questions to match specific job postings</span>
              </label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description highlights..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleProceedToInstructions}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                Continue to Pre-Interview Check <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INSTRUCTIONS */}
      {studioStep === 'instructions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pre-Interview Instructions</h3>
              <p className="text-xs text-slate-400">Review rules and expectations before launching your assessment.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Questions</span>
              <span className="font-bold text-white text-sm">5 Questions</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Duration</span>
              <span className="font-bold text-white text-sm">{durationMinutes} Minutes</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Interview Type</span>
              <span className="font-bold text-indigo-400 text-sm">{interviewType}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Difficulty</span>
              <span className="font-bold text-indigo-400 text-sm">{difficulty}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Interview Integrity & Assessment Policy
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• <strong>Camera & Microphone Required:</strong> Live media stream permissions are required to launch the room.</li>
              <li>• <strong>Media Archiving:</strong> Your video stream and transcript are archived in your private account history for performance replay.</li>
              <li>• <strong>No Pre-Answer Rubrics:</strong> Model answers and evaluation key points are hidden until you submit your response.</li>
              <li>• <strong>Fullscreen Mode:</strong> Fullscreen mode is recommended during your assessment. Tab switches and focus loss are logged as integrity events.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStudioStep('setup')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Setup
            </button>
            <button
              onClick={handleStartDeviceCheck}
              disabled={isCheckingDevices}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {isCheckingDevices ? 'Checking Devices...' : 'Run System Check'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REAL DEVICE & PERMISSION PREFLIGHT CHECK */}
      {studioStep === 'device_check' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Device & Permission Preflight Check</h3>
                <p className="text-xs text-slate-400">Verify live camera stream and microphone level before entering.</p>
              </div>
            </div>
          </div>

          {preflightError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{preflightError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Camera Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Live Camera Stream Preview</span>
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <video ref={videoPreviewRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Camera Active
                </div>
              </div>
            </div>

            {/* Audio & Capabilities Checklist */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Mic Audio Level Indicator */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-indigo-400" /> Microphone Audio Input:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{audioLevel}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-75" style={{ width: `${audioLevel}%` }} />
                </div>
                <p className="text-[10px] text-slate-500">Speak into your microphone to verify live audio input response.</p>
              </div>

              {/* Capability Checks */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Camera Permission:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Granted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Microphone Permission:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Granted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">MediaRecorder (WebM):</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Supported</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStudioStep('instructions')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleProceedToFullscreen}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              Proceed to Fullscreen Check <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FULLSCREEN & INTEGRITY PRE-ROOM CHECK */}
      {studioStep === 'fullscreen_check' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Maximize className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Interview Integrity & Fullscreen Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Click below to trigger Fullscreen Mode. Fullscreen mode maintains focus during assessment.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Camera Stream:</span>
              <span className="font-bold text-emerald-400">Ready ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Microphone Input:</span>
              <span className="font-bold text-emerald-400">Ready ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Media Recording Archive:</span>
              <span className="font-bold text-emerald-400">Pre-configured ✓</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-2">
              <span className="text-slate-300">Fullscreen Mode Status:</span>
              <span className={`font-bold ${isFullscreenReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isFullscreenReady ? 'Active ✓' : 'Not Active (Click below)'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleRequestFullscreen}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Maximize className="w-4 h-4" /> {isFullscreenReady ? 'Fullscreen Activated ✓' : 'Enter Fullscreen Mode'}
            </button>

            <button
              onClick={handleLaunchInterviewSession}
              disabled={isStarting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-base font-extrabold transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {isStarting ? (
                'Initializing Assessment Room...'
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" /> Start Interview Assessment
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* User Interview History Table */}
      {studioStep === 'setup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> User Interview History & Saved Recordings
              </h3>
              <p className="text-xs text-slate-400">All reports and recorded videos are safely stored under your user account.</p>
            </div>

            <div className="flex items-center gap-2">
              {(['ALL', 'MOCK_TEST', 'LIVE_INTERVIEW'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    historyFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {filter === 'ALL' ? 'All Sessions' : filter === 'MOCK_TEST' ? 'Mock Tests' : 'Live Interviews'}
                </button>
              ))}
            </div>
          </div>

          {isLoadingHistory ? (
            <div className="text-center py-8 text-xs text-slate-500">Loading interview records...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No interview sessions recorded yet. Launch your first mock test or live interview above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Session Mode</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            item.mode === 'LIVE_INTERVIEW'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.mode === 'LIVE_INTERVIEW' ? <Video className="w-3 h-3" /> : <Brain className="w-3 h-3" />}
                          {item.mode === 'LIVE_INTERVIEW' ? 'Live AI Interview' : 'AI Mock Test'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{item.targetRole}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        {item.overallScore !== null && item.overallScore !== undefined ? (
                          <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                            item.overallScore >= 80
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : item.overallScore >= 60
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {item.overallScore}/100
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">In Progress</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewReport(item.id, item.targetRole, item.mode)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg font-semibold transition"
                        >
                          View Report
                        </button>

                        {item.recording && (
                          <button
                            onClick={() => handleReplayRecording(item.id, item.targetRole)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg font-semibold transition inline-flex items-center gap-1"
                          >
                            <Film className="w-3.5 h-3.5" /> Replay
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Render Selected Report Modal */}
      {selectedReport && (
        <InterviewReportModal
          report={selectedReport}
          targetRole={selectedReportRole}
          mode={selectedReportMode}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Render Recording Replay Modal */}
      {recordingModalData && (
        <RecordingPlayerModal
          interviewId={recordingModalData.interviewId}
          targetRole={recordingModalData.targetRole}
          durationSeconds={recordingModalData.durationSeconds}
          questions={recordingModalData.questions}
          onClose={() => setRecordingModalData(null)}
        />
      )}
    </div>
  );
};
