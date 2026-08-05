import React from 'react';
import { Navbar } from '../components/Navbar';
import { BackgroundOverlay } from '../components/BackgroundOverlay';
import { Hero } from '../components/Hero';
import { PhotoGallery } from '../components/PhotoGallery';
import { LoveLetter } from '../components/LoveLetter';
import { ReasonsILoveYou } from '../components/ReasonsILoveYou';
import { Timeline } from '../components/Timeline';
import { BirthdayCake } from '../components/BirthdayCake';
import { GiftBox } from '../components/GiftBox';
import { Ending } from '../components/Ending';
import { CuteCat } from '../components/CuteCat';

interface MainContentProps {
  onReplay: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onReplay }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#FFF8FA] via-[#FDE2E4] via-[#FBC4D4] to-[#F497B6] font-sans antialiased bg-fixed">
      {/* Background Subtle Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-amber-200/25 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed top-1/4 right-5 w-[500px] h-[500px] bg-rose-200/25 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="fixed top-2/4 left-5 w-[550px] h-[550px] bg-amber-100/30 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }} />
      <div className="fixed top-3/4 right-1/4 w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }} />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }} />

      {/* Background Subtle Particle Overlay */}
      <BackgroundOverlay />

      {/* Floating Navigation Bar */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="relative z-10">
        <Hero />
        <PhotoGallery />
        <LoveLetter />
        <ReasonsILoveYou />
        <Timeline />
        <BirthdayCake />
        <GiftBox />
        <Ending onReplay={onReplay} />
      </main>

      {/* Floating Cute Interactive Cat */}
      <CuteCat />
    </div>
  );
};
