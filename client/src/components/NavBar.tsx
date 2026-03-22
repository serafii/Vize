import React from "react";
import { motion } from "framer-motion";
import { HexagonIcon, BookOpenIcon } from "lucide-react";
import { GithubIcon } from "../Utils/Icons";

const NavBar: React.FC = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5"
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <HexagonIcon className="w-4.5 h-4.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            Vize
          </span>
        </a>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
            v0.1.0
          </span>

          <a
            href="#"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Documentation"
          >
            <BookOpenIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Docs</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-black bg-accent hover:brightness-110 transition-all active:scale-[0.97]"
            aria-label="View on GitHub"
          >
            {GithubIcon}
            <span className="hidden sm:inline">GitHub Repo</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
