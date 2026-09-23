'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Film, X, Clock, Video, AlertCircle } from 'lucide-react';
import { getStoredAccessToken } from '@/lib/api/auth';

interface QuestionTimelineItem {
  id: string;
  questionIndex: number;
  questionText: string;
  timestampStartSeconds?: number;
}

interface RecordingPlayerModalProps {
  interviewId: string;
  targetRole: string;
  durationSeconds: number;
  questions: QuestionTimelineItem[];
  onClose: () => void;
}

export const RecordingPlayerModal: React.FC<RecordingPlayerModalProps> = ({
  interviewId,
  targetRole,
  durationSeconds,
  questions,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  const token = getStoredAccessToken();
  const videoUrl = `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api')
    .replace(/\/auth\/?$/, '')
    .replace(/\/+$/, '')}/interviews/${interviewId}/recording`;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interview Recording Replay</h3>
              <p className="text-xs text-slate-400">Role: {targetRole} • Total Duration: {formatTime(durationSeconds)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Video + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden bg-slate-950">
          {/* Main Video View */}
          <div className="lg:col-span-2 flex flex-col justify-center items-center bg-black p-4 relative min-h-[320px]">
            {hasError ? (
              <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-3">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <p className="font-semibold text-white">Video recording file not available or missing.</p>
                <p className="text-xs text-slate-500">The video stream buffer could not be loaded from secure storage.</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onError={() => setHasError(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
                className="w-full max-h-[60vh] rounded-lg shadow-lg object-contain bg-black"
                src={videoUrl}
              />
            )}
          </div>

          {/* Question Seek Timeline Sidebar */}
          <div className="border-t lg:border-t-0 lg:border-l border-slate-800 p-4 bg-slate-900 overflow-y-auto flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Question Timeline
            </h4>

            <div className="space-y-2 flex-1">
              {questions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No timestamped questions recorded.</p>
              ) : (
                questions.map((q, idx) => {
                  const startSec = q.timestampStartSeconds || idx * 120;
                  const isActive = currentTime >= startSec && (idx === questions.length - 1 || currentTime < (questions[idx + 1].timestampStartSeconds || (idx + 1) * 120));

                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => seekTo(startSec)}
                      className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 ${
                        isActive
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Question {q.questionIndex || idx + 1}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {formatTime(startSec)}
                        </span>
                      </div>
                      <p className="text-xs line-clamp-2 text-slate-300">{q.questionText}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
