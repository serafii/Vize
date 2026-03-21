import React from "react";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  return (
    <motion.div
      className="text-center mb-12 z-10 mt-4"
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-accent tracking-tight mb-5">
        Codebase Analyzer
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Paste a repository link or upload a project folder to instantly analyze
        your project structure, dependencies, and architecture
      </p>
    </motion.div>
  );
};

export default Header;
