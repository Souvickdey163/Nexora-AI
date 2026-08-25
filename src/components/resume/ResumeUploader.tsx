"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Loader2,
  FileCode,
} from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface ResumeUploaderProps {
  onAnalyze: (file: UploadedFile, targetRole: string) => void;
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  onLoadSample: () => void;
}

const TARGET_ROLES = [
  "Full-Stack Engineer",
  "Frontend Software Engineer",
  "Backend & Distributed Systems",
  "AI / Machine Learning Engineer",
  "DevOps & Cloud Architect",
];

export function ResumeUploader({
  onAnalyze,
  isAnalyzing,
  progress,
  currentStep,
  onLoadSample,
}: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      setErrorMsg("Unsupported file format. Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    setSelectedFile({
      name: file.name,
      size: file.size,
      type: file.name.endsWith(".pdf") ? "PDF Document" : "DOCX Document",
      file,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      setErrorMsg("Please select or drop a resume file first.");
      return;
    }
    onAnalyze(selectedFile, targetRole);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div id="upload-section" className="w-full max-w-4xl mx-auto py-6">
      <div className="relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-500" />
              <span>Upload Resume for Analysis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Supported formats: PDF, DOCX (Max 10MB)
            </p>
          </div>

          {/* Preset Sample Trigger */}
          <button
            onClick={onLoadSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Sample Resume</span>
          </button>
        </div>

        {/* Target Role Selector */}
        <div className="pt-6 pb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-sky-500" />
            <span>Target Role Benchmark</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left truncate ${
                  targetRole === role
                    ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm font-semibold"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 scale-[1.01]"
              : selectedFile
              ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10"
              : "border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-950/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 mx-auto flex items-center justify-center shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Drag and drop your resume here
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  or <span className="text-sky-500 font-semibold underline">browse files</span> from your computer
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </span>
                <span className="flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5" /> DOCX
                </span>
                <span>Max 10 MB</span>
              </div>
            </div>
          ) : (
            /* Selected File Preview Box */
            <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-md">
              <div className="flex items-center gap-3 text-left overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFile.type} • {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Analyzing Progress Bar State */}
        {isAnalyzing && (
          <div className="mt-6 space-y-3 p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20">
            <div className="flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>{currentStep}</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Privacy Disclaimer */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Your resume is processed confidentially to generate analysis.</span>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={!selectedFile || isAnalyzing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              !selectedFile || isAnalyzing
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/20 active:scale-95"
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start AI Analysis</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
