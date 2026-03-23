import React from "react";
import { motion } from "framer-motion";

interface AnalyzingViewProps {
  analyzedUrl: string | null;
}

const AnalyzingView: React.FC<AnalyzingViewProps> = ({
  analyzedUrl,
}: AnalyzingViewProps) => {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Analyzing Project
            </h2>
            <p
              className="text-sm text-gray-500 truncate max-w-xs"
              title={analyzedUrl || undefined}
            >
              {analyzedUrl || "Unknown URL"}
            </p>
          </div>
        </div>

        {/* Animated orb */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-dashed border-accent/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner pulse */}
            <motion.div
              className="absolute inset-4 rounded-full bg-accent/10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <p className="text-xs text-gray-600 text-center">
            This may take a few minutes for large repositories
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyzingView;
