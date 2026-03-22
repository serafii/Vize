import React from "react";
import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";

const Reason: React.FC = () => {
  return (
    <motion.section
      className="w-full max-w-3xl mx-auto mt-20 mb-8 px-4 sm:px-6 z-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="relative bg-surface rounded-2xl p-8 md:p-10 border border-white/5 overflow-hidden hover:border-accent/25 transition-colors group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <HeartIcon className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">Why We Built Nexus</h2>
          </div>

          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              aspernatur cumque alias. Omnis, ipsa delectus quo ea repellendus
              provident voluptatibus suscipit, autem fugiat repellat ipsum
              laudantium qui iure accusamus pariatur!
            </p>
            <p>
              lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              aspernatur cumque alias. Omnis, ipsa delectus quo ea repellendus
              provident voluptatibus suscipit, autem fugiat repellat ipsum
              laudantium qui iure accusamus pariatur!
            </p>
            <p>
              lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              aspernatur cumque alias. Omnis, ipsa delectus quo ea{" "}
              <span className="text-white font-medium">
                repellendus provident voluptatibus
              </span>{" "}
              suscipit, autem fugiat repellat ipsum laudantium qui iure
              accusamus pariatur!
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Reason;
