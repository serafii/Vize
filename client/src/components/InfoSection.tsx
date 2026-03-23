import React from "react";
import { motion } from "framer-motion";
import { ShieldCheckIcon, ZapIcon, FileSearchIcon } from "lucide-react";

const InfoSection: React.FC = () => {
  const hints = [
    {
      icon: <FileSearchIcon className="w-4 h-4" />,
      text: "Architecture analysis",
    },
    {
      icon: <ZapIcon className="w-4 h-4" />,
      text: "Fast data processing",
    },
    {
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      text: "Secure & private",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="mt-12 w-full max-w-xl mx-auto z-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {hints.map((hint, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center space-x-2 text-gray-400"
          >
            <span className="text-accent">{hint.icon}</span>
            <span className="text-sm font-medium">{hint.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InfoSection;
