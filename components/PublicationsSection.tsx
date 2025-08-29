
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
      id: 'mobilizing-grievances-korea',
      title: 'Mobilizing grievances in the internet age: The case of national online petitioning in South Korea, 2017–2022',
      authors: 'Kayoon Kim, Chan S. Suh',
      venue: 'PLOS ONE, 2024',
      type: 'Journal Article',
      link: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0302373'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white" id="publications">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Publications</h2>
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
              <div className="border-l-2 border-black pl-8">
                <div className="mb-4">
                  <span className="text-gray-600 text-sm font-medium uppercase tracking-wide hover:text-black transition-colors cursor-pointer">
                    {pub.type}
                  </span>
                </div>
                
                <Link href={`/publications#${pub.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight hover:text-black transition-colors cursor-pointer">
                    {pub.title}
                  </h3>
                </Link>
                
                <p className="text-base font-medium mb-2">{pub.authors}</p>
                <p className="text-sm text-gray-600 mb-4">{pub.venue}</p>
                
                <div className="flex items-center space-x-6">
                  <a href={pub.link} target="_blank" rel="noopener noreferrer">
                    <span className="text-base hover:text-gray-600 transition-colors cursor-pointer font-medium">
                      Read Paper
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/publications">
            <span className="inline-flex items-center text-black hover:text-gray-600 transition-colors cursor-pointer text-base font-medium relative group">
              View All Publications
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}