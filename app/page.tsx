
'use client';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PublicationsSection from '../components/PublicationsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <PublicationsSection />
      
      <style jsx global>{`
        .animate-fade-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
