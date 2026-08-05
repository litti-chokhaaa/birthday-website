import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PasscodeScreen } from './components/PasscodeScreen';
import { SunflowerBloom } from './components/SunflowerBloom';
import { LoadingScreen } from './components/LoadingScreen';
import { MainContent } from './pages/MainContent';
import { CursorTrail } from './components/CursorTrail'; // 1. Import CursorTrail here

export type AppStage = 'passcode' | 'bloom' | 'loading' | 'main';

export function App() {
  const [stage, setStage] = useState<AppStage>('passcode');

  const handleUnlockSuccess = () => {
    setStage('bloom');
    setTimeout(() => {
      setStage('loading');
    }, 2800);
  };

  const handleLoadingComplete = () => {
    setStage('main');
  };

  const handleReplay = () => {
    setStage('bloom');
    setTimeout(() => {
      setStage('loading');
    }, 2800);
  };

  return (
    // 2. Add gradient background classes & insert <CursorTrail /> inside top level div
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fefae0] via-[#fdeed9] via-[#fce4ec] to-[#f5ebdc] font-sans antialiased bg-fixed">
      <CursorTrail />
      <AnimatePresence mode="wait">
        {stage === 'passcode' && (
          <PasscodeScreen key="passcode" onUnlockSuccess={handleUnlockSuccess} />
        )}
        {stage === 'bloom' && (
          <SunflowerBloom key="bloom" />
        )}
        {stage === 'loading' && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
        {stage === 'main' && (
          <MainContent key="main" onReplay={handleReplay} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;