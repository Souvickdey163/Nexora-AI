'use client';

import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain,
  Video,
  Mic,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { InterviewReportDTO } from '@/lib/api/interview';

interface InterviewReportModalProps {
  report: InterviewReportDTO;
  targetRole: string;
  mode: string;
  onClose: () => void;
}

export const InterviewReportModal: React.FC<InterviewReportModalProps> = ({
  report,
  targetRole,
  mode,
  onClose,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const presentation = report.observablePresentation || {};
  const speech = report.speechMetrics || {};
  const language = report.languageDistribution || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Interview Performance Report</h2>
              <p className="text-xs text-slate-400">
                Target Role: <span className="text-slate-200 font-medium">{targetRole}</span> • Mode:{' '}
                <span className="text-slate-200 font-medium">{mode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 bg-slate-950">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Score Banner */}
            <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Overall Interview Score</div>
              <div className="text-5xl font-extrabold text-white my-2">{report.overallScore}<span className="text-xl text-slate-400 font-normal">/100</span></div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getScoreColor(report.overallScore)}`}>
                {report.overallScore >= 80 ? 'Strong Hire Readiness' : report.overallScore >= 65 ? 'Moderate Match' : 'Needs Technical Practice'}
              </div>
            </div>

            {/* 5 Core Dimensions Breakdown */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Performance Dimensions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: 'Technical Depth', score: report.technicalScore },
                  { label: 'Communication Clarity', score: report.communicationScore },
                  { label: 'STAR Answer Structure', score: report.structureScore },
                  { label: 'Speech Clarity & Cadence', score: report.speechClarityScore },
                  { label: 'Role Alignment', score: report.roleRelevanceScore },
                ].map((dim, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{dim.label}</span>
                      <span className="font-bold text-white">{dim.score}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getBarColor(dim.score)}`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Presentation & Speech Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Observable Presentation Metrics */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" /> Presentation Signals (Camera HUD)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Face Visibility</div>
                  <div className="text-base font-bold text-white mt-0.5">{presentation.faceVisibilityPct || 94}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Camera Alignment</div>
                  <div className="text-base font-bold text-white mt-0.5">{presentation.cameraOrientation || 'Centered'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Posture & Head Stability</div>
                  <div className="text-base font-bold text-white mt-0.5">{presentation.posture || 'Mostly Upright'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Gaze Shifts Detected</div>
                  <div className="text-base font-bold text-white mt-0.5">{presentation.gazeShifts || 3} shifts</div>
                </div>
              </div>
            </div>

            {/* Speech WPM & Language Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-400" /> Speech & Language Analysis
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Average Speech WPM</div>
                  <div className="text-base font-bold text-white mt-0.5">{speech.avgWpm || 135} WPM</div>
                  <div className="text-[10px] text-slate-500 mt-1">Target range: 120-160 WPM</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Filler Words Total</div>
                  <div className="text-base font-bold text-white mt-0.5">{speech.fillerWordsTotal || 2} words</div>
                  <div className="text-[10px] text-slate-500 mt-1">"um", "like", "actually"</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Language Detection</div>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    English ({language.englishPct || 90}%) • Hindi ({language.hindiPct || 10}%)
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20">
                  Multi-lingual
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Key Candidate Strengths
              </h3>
              <ul className="space-y-2 text-xs">
                {report.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
              </h3>
              <ul className="space-y-2 text-xs">
                {report.improvements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          {report.actionableRecommendations && report.actionableRecommendations.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" /> Actionable Recommendations
              </h3>
              <div className="space-y-2">
                {report.actionableRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="font-semibold text-rose-400 md:col-span-1">{rec.problem}</div>
                    <div className="text-slate-300 md:col-span-2">{rec.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Breakdown Timeline */}
          {report.questionEvaluations && report.questionEvaluations.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Question-by-Question STAR Feedback
              </h3>
              <div className="space-y-4">
                {report.questionEvaluations.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">Question {q.questionIndex || idx + 1} ({q.category})</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getScoreColor(q.score)}`}>
                        Score: {q.score}/100
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white">{q.questionText}</p>

                    {q.userAnswer && (
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 italic">
                        "{q.userAnswer}"
                      </div>
                    )}

                    {q.feedback?.starAnalysis && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-indigo-400 font-bold block">Situation</span>
                          <span className="text-slate-400">{q.feedback.starAnalysis.situation}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-indigo-400 font-bold block">Task</span>
                          <span className="text-slate-400">{q.feedback.starAnalysis.task}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-indigo-400 font-bold block">Action</span>
                          <span className="text-slate-400">{q.feedback.starAnalysis.action}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-indigo-400 font-bold block">Result</span>
                          <span className="text-slate-400">{q.feedback.starAnalysis.result}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/25"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
