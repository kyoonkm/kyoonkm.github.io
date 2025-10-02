'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  type: string;
  abstract?: string;
  fullContent?: string;
  year?: number;
  doi?: string;
  publishedDate?: string;
  link?: string | null;
  note?: string;
}

export default function PublicationsSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  const publications: Publication[] = [
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
      publishedDate: 'May 16, 2024',
      link: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0302373',
    },
    {
      id: 'carmony-device-orchestration',
      title: 'Carmony: Multimodal Context-Aware Device Orchestration in Multi-User Automotive Environments (Tentative)',
      authors: 'Jan Henry Belz*, Kayoon Kim*',
      venue: 'In progress, UIST 2026',
      type: 'In progress',
      link: null,
      note: '*Equal Contribution',
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-backgroundCream" id="publications">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-3xl font-bold text-textGrayCustom mb-4">Publications</h2>
        </div>

        <div className="space-y-12">
          {publications.map((pub, index) => (
            <div 
              key={index}
              id={pub.id}
              className={`transform transition-all duration-500 hover:scale-105 cursor-pointer ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="border-l-2 border-gray-700 pl-8 py-4">
                <div className="mb-4 flex items-center space-x-4">
                  <span className="text-gray-600 text-xs font-medium uppercase tracking-wide hover:text-gray-800 transition-colors cursor-pointer">
                    {pub.type}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 text-xs font-medium">{pub.year}</span>
                </div>
                
                {pub.link ? (
                  <a 
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-textGrayCustom mb-3 leading-tight hover:text-gray-800 transition-colors cursor-pointer block"
                  >
                    {pub.title}
                  </a>
                ) : (
                  <h3 className="text-xl font-semibold text-textGrayCustom mb-3 leading-tight">{pub.title}</h3>
                )}
                
                <p className="text-sm text-textGrayCustom mb-2">{pub.authors}</p>
                <p className="text-sm text-gray-600 mb-4 font-medium">{pub.venue}</p>
                {pub.note && <p className="italic text-sm text-gray-600 mb-4">{pub.note}</p>}

                {pub.link && (
                  <div className="flex items-center space-x-6">
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      <span className="text-base hover:text-gray-600 transition-colors cursor-pointer font-medium">
                        Read Paper
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="/publications"
            className="inline-flex items-center text-textGrayCustom hover:text-gray-600 transition-colors cursor-pointer text-base font-medium relative group"
          >
            View All Publications
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-textGrayCustom transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </section>
  );
}

