
'use client';
import Header from '../../components/Header';
import { useEffect, useRef, useState } from 'react';

export default function Publications() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const publication = publications.find(pub => pub.id === hash);
      if (publication) {
        setSelectedPub(publication);
      }
    }
  }, []);

  const publications = [
    {
      id: 'mobilizing-grievances-korea',
      title: 'Mobilizing grievances in the internet age: The case of national online petitioning in South Korea, 2017–2022',
      authors: 'Kayoon Kim, Chan S. Suh',
      venue: 'PLOS ONE, 2024',
      type: 'Journal Article',
      abstract: 'This study examines how digital platforms have transformed civic engagement and political participation in South Korea through the analysis of national online petitioning systems from 2017 to 2022. We investigate the mechanisms through which citizens mobilize grievances and seek policy changes in the digital age.',
      fullContent: 'The advent of digital technologies has fundamentally altered how citizens engage with government and express political grievances. This comprehensive study analyzes the South Korean national online petitioning system, examining patterns of citizen participation, issue mobilization, and government responsiveness over a five-year period from 2017 to 2022. Through quantitative analysis of petition data and qualitative examination of successful mobilization cases, we reveal how digital platforms enable new forms of collective action while also presenting unique challenges for democratic participation. Our findings contribute to understanding the evolving relationship between technology, civic engagement, and democratic governance in the digital age.',
      year: 2024,
      doi: 'https://doi.org/10.1371/journal.pone.0302373',
      publishedDate: 'May 16, 2024'
    }
  ];

  if (selectedPub) {
    return (
      <div className="min-h-screen">
        <Header />

        <section className="pt-28 pb-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <button 
              onClick={() => setSelectedPub(null)}
              className="mb-8 text-black hover:text-gray-600 transition-colors cursor-pointer font-medium"
            >
              ← Back to Publications
            </button>

            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-black leading-tight">{selectedPub.title}</h1>

              <p className="text-lg text-black font-medium">{selectedPub.authors}</p>
              <p className="text-gray-600 font-medium">{selectedPub.venue}</p>

              <div className="mt-8">
                <a 
                  href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0302373" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer font-medium"
                >
                  Read Paper
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-28 pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">Publications</h1>
          </div>

          <div ref={sectionRef} className="space-y-12">
            {publications.map((pub, index) => (
              <div 
                key={index}
                id={pub.id}
                onClick={() => setSelectedPub(pub)}
                className={`transform transition-all duration-500 hover:scale-105 cursor-pointer ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="border-l-2 border-black pl-8 py-4">
                  <div className="mb-4 flex items-center space-x-4">
                    <span className="text-gray-600 text-xs font-medium uppercase tracking-wide hover:text-black transition-colors cursor-pointer">
                      {pub.type}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-xs font-medium">{pub.year}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 leading-tight hover:text-gray-700 transition-colors">
                    {pub.title}
                  </h3>

                  <p className="text-sm text-black font-medium mb-2">{pub.authors}</p>
                  <p className="text-sm text-gray-600 mb-6 font-medium">{pub.venue}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black hover:text-gray-600 transition-colors cursor-pointer font-medium">
                      Read Paper
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
