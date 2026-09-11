import Header from '../components/Header';
import ResearchHero from '../components/research-hero/ResearchHero';
import AboutSection from '../components/AboutSection';
import PublicationsSection from '../components/PublicationsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <ResearchHero />
      <AboutSection />
      <PublicationsSection />
    </div>
  );
}
