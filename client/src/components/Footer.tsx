import React from "react";
import { HexagonIcon } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-surface/50 mt-auto z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <HexagonIcon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-base font-semibold text-white tracking-tight">
                Vize
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Open-source project analysis tool. Understand any codebase, map
              dependencies, and visualize architecture in seconds.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/5 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Vize Analyzer &middot; All rights
            reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
