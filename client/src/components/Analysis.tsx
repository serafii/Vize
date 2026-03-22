import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  FileCode2Icon,
  FolderIcon,
  FileDigitIcon,
} from "lucide-react";
import LANGUAGE_COLORS from "../Utils/languages";

interface ResultsViewProps {
  analyzedUrl: string;
  onBack: () => void;
  analysisResult?: {
    totalFiles: number;
    totalDirs: number;
    totalSize: number;
    languages: Record<string, number>;
  };
}

const ResultsView: React.FC<ResultsViewProps> = ({
  analyzedUrl,
  onBack,
  analysisResult,
}) => {
  const stats = [
    {
      label: "Total Files",
      value: analysisResult?.totalFiles.toString() || "N/A",
      icon: <FileCode2Icon className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Total Directories",
      value: analysisResult?.totalDirs.toString() || "N/A",
      icon: <FolderIcon className="w-5 h-5 text-yellow-400" />,
      alert: true,
    },
    {
      label: "Total Size",
      value: analysisResult?.totalSize.toString() + " MB" || "N/A",
      icon: <FileDigitIcon className="w-5 h-5 text-green-400" />,
    },
  ];
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto z-20"
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Analysis Complete
            </h2>
            <p
              className="text-sm text-gray-400 truncate max-w-md"
              title={analyzedUrl}
            >
              Target: <span className="text-accent">{analyzedUrl}</span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center hover:cursor-pointer justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Analyze New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-4 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-3">
                {stat.icon}
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${stat.alert ? "text-yellow-400" : "text-white"}`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Languages Bar */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>

          {/* Stacked bar */}
          <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5">
            {analysisResult?.languages &&
              Object.entries(analysisResult.languages).map(
                ([lang, pct], index) => (
                  <motion.div
                    key={lang}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{
                      backgroundColor:
                        LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other,
                      width: `${pct}%`,
                    }}
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + index * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ),
              )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            {analysisResult?.languages &&
              Object.entries(analysisResult.languages).map(([lang, pct]) => (
                <div key={lang} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other,
                    }}
                  />
                  <span className="text-sm text-gray-300">{lang}</span>
                  <span className="text-sm text-gray-500">{pct}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Mock Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Key Findings</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
              <AlertTriangleIcon className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-1">
                  Outdated Dependency: React
                </h4>
                <p className="text-sm text-yellow-400/70">
                  Version 17.0.2 is currently installed. Consider upgrading to
                  18.x for performance improvements and concurrent features.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
              <CheckCircle2Icon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-1">
                  Optimal Bundle Size
                </h4>
                <p className="text-sm text-green-400/70">
                  Initial load bundle is under 150kb, which is excellent for
                  performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsView;
