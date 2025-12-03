'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

  const publications = [
    {
      id: 'carmony-device-orchestration',
      title: 'Sim-DSE: Mediating Multi-User Orchestration in Confined Shared Spaces through Simulation-Augmented Design Space Exploration',
      authors: 'Jan Henry Belz*, Kayoon Kim*',
      venue: 'In progress, IMWUT 2026',
      type: 'In progress',
      link: null,
      note: '*Equal Contribution'
    },
    {
      id: 'mobilizing-grievances-korea',
      title: 'Mobilizing grievances in the internet age: The case of national online petitioning in South Korea, 2017–2022',
      authors: 'Kayoon Kim, Chan S. Suh',
      venue: 'PLOS ONE, 2024',
      type: 'Journal Article',
      link: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0302373'
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
              className={`transform transition-all duration-500 hover:scale-105 cursor-pointer ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="border-l-2 border-gray-700 pl-8">
                <div className="mb-4">
                  <span className="text-gray-600 text-sm font-medium uppercase tracking-wide hover:text-gray-800 transition-colors cursor-pointer">
                    {pub.type}
                  </span>
                </div>
                
                {pub.link ? (
                  <Link href={pub.link}>
                    <a target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-textGrayCustom mb-3 leading-tight hover:text-gray-800 transition-colors cursor-pointer block">
                      {pub.title}
                    </a>
                  </Link>
                ) : (
                  <h3 className="text-xl font-semibold text-textGrayCustom mb-3 leading-tight">
                    {pub.title}
                  </h3>
                )}

                <p className="text-base font-medium mb-1">{pub.authors}</p>
                <p className="text-sm text-gray-600 mb-1">{pub.venue}</p>
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
          <Link href="/publications">
            <a className="inline-flex items-center text-textGrayCustom hover:text-gray-600 transition-colors cursor-pointer text-base font-medium relative group">
              View All Publications
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-textGrayCustom transition-all duration-300 group-hover:w-full"></span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
