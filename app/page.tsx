import Header from '../components/Header';
import ResearchHero from '../components/research-hero/ResearchHero';
import SelectedWork from '../components/research-hero/SelectedWork';
import { ResearchStateProvider } from '../components/research-hero/useResearchState';
import AboutSection from '../components/AboutSection';

/**
 * Order is vision -> evidence: the hero states the thesis, the bio explains
 * it, and the publication list proves it. The provider is lifted to the page
 * so the graph and the list stay hover-synced across the bio between them.
 */
export default function Home() {
  return (
    <ResearchStateProvider>
      <div className="min-h-screen">
        <Header />
        <ResearchHero />
        <AboutSection />
        <div className="max-w-6xl mx-auto px-6">
          <SelectedWork />
        </div>
      </div>
    </ResearchStateProvider>
  );
}
