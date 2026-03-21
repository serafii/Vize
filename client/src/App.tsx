import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import InputArea from "./components/InputArea";
import InfoSection from "./components/InfoSection";
import Reason from "./components/Reason";
import LightRays from "./Utils/LightRays";
import Features from "./components/Features";
import Analysis from "./components/Analysis";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const handleAnalyze = (url: string) => {
    setAnalyzedUrl(url);
  };
  const handleBack = () => {
    setAnalyzedUrl(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="w-full h-150 absolute top-0 left-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#facc15"
          raysSpeed={0.65}
          lightSpread={0.7}
          rayLength={2.6}
          followMouse={true}
          mouseInfluence={0.07}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      <NavBar />
      <main className="min-h-screen bg-background flex flex-col items-center pt-20 pb-28 md:pt-32 px-4 sm:px-6">
        <div className="w-full mx-auto flex flex-col items-center">
          <Header />
          {analyzedUrl ? (
            <Analysis analyzedUrl={analyzedUrl} onBack={handleBack} />
          ) : (
            <>
              <InputArea onAnalyze={handleAnalyze} />
              <InfoSection />
              <Features />
              <Reason />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
