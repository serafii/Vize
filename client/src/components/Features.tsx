import React from "react";
import { motion } from "framer-motion";
import { GitBranchIcon, ShieldCheckIcon, BarChart3Icon } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <GitBranchIcon className="w-6 h-6 text-accent" />,
      title: "Flexible Input",
      description:
        "Upload your project folder or simply provide a public repository URL to get started. No setup required.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-accent" />,
      title: "Deep Code Analysis",
      description:
        "Automatically detects the tech stack, maps out architecture, and identifies key components for a clear overview of your codebase.",
    },
    {
      icon: <BarChart3Icon className="w-6 h-6 text-accent" />,
      title: "Structured Output",
      description:
        "Get a clean, readable breakdown of your codebase so you can understand it quickly without having to read through all the code.",
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
      className="w-full max-w-5xl mx-auto mt-20 mb-8 px-4 sm:px-6 z-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2
          className="text-sm font-semibold text-gray-500 uppercase tracking-widest"
          id="features"
        >
          Our Features
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-accent/25 transition-colors group"
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
