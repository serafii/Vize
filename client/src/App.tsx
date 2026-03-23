import React, { useState, Fragment } from "react";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import InputArea from "./components/InputArea";
import InfoSection from "./components/InfoSection";
import Reason from "./components/Reason";
import LightRays from "./Utils/LightRays";
import Features from "./components/Features";
import Analysis from "./components/Analysis";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import LoadingView from "./components/LoadingView";

interface Component {
  name: string;
  description: string;
}

type AppView = "input" | "analyzing" | "results";

interface Analysis {
  purpose: string;
  technologies: string[];
  architecture: string;
  system_flow: string;
  components: Component[];
}

interface AnalysisResult {
  totalFiles: number;
  totalDirs: number;
  totalSize: number;
  languages: Record<string, number>;
  analysis: Analysis;
}

const App: React.FC = () => {
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [view, setView] = useState<AppView>("input");
  const handleAnalyze = (url: string) => {
    setAnalyzedUrl(url);
    setView("analyzing");
  };
  const handleAnalysisComplete = () => {
    setView("results");
  };
  const handleAnalysisError = () => {
    setView("input");
    setAnalyzedUrl(null);
  };
  const handleBack = () => {
    setView("input");
    setAnalyzedUrl(null);
  };

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    totalFiles: 0,
    totalDirs: 0,
    totalSize: 0,
    languages: {},
    analysis: {
      purpose: "",
      technologies: [],
      architecture: "",
      system_flow: "",
      components: [],
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="w-full h-[120vh] fixed top-0 left-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="right"
          raysColor="#facc15"
          raysSpeed={0.9}
          lightSpread={0.8}
          rayLength={2.6}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      <div className="w-full h-[120vh] fixed top-0 left-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="left"
          raysColor="#facc15"
          raysSpeed={0.9}
          lightSpread={0.8}
          rayLength={2.6}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-5 bg-linear-to-b from-transparent to-background" />
      <NavBar />
      <main className="min-h-screen bg-background flex flex-col items-center pt-20 pb-28 md:pt-32 px-4 sm:px-6">
        <div className="w-full mx-auto flex flex-col items-center">
          <Header />
          <AnimatePresence mode="wait">
            {view === "input" && (
              <Fragment key="input">
                <InputArea
                  onAnalyze={handleAnalyze}
                  setAnalysisResult={setAnalysisResult}
                  setAnalysisComplete={handleAnalysisComplete}
                  setAnalysisError={handleAnalysisError}
                />
                <Features />
                <Reason />
                <InfoSection />
              </Fragment>
            )}

            {view === "analyzing" && (
              <LoadingView key="analyzing" analyzedUrl={analyzedUrl} />
            )}

            {view === "results" && (
              <Analysis
                key="results"
                analyzedUrl={analyzedUrl}
                onBack={handleBack}
                analysisResult={analysisResult}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
