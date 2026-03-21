import React from "react";
import { motion } from "framer-motion";
import { ShieldCheckIcon, ZapIcon, FileSearchIcon } from "lucide-react";

const InfoSection: React.FC = () => {
  const hints = [
    {
      icon: <FileSearchIcon className="w-4 h-4" />,
      text: "Deep dependency mapping",
    },
    {
      icon: <ZapIcon className="w-4 h-4" />,
      text: "Instant vulnerability scanning",
    },
    {
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      text: "Secure & private analysis",
    },
  ];
  return (
    <motion.div
      className="mt-12 w-full max-w-xl mx-auto"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {hints.map((hint, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-gray-400"
          >
            <span className="text-gray-500">{hint.icon}</span>
            <span className="text-sm font-medium">{hint.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InfoSection;
