import React from "react";
import { motion } from "framer-motion";
import { GitBranchIcon, ShieldCheckIcon, BarChart3Icon } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <GitBranchIcon className="w-6 h-6 text-accent" />,
      title: "Feature 1",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-accent" />,
      title: "Feature 2",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      icon: <BarChart3Icon className="w-6 h-6 text-accent" />,
      title: "Feature 3",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto mt-20 mb-8 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="text-center mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Our Features
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;
