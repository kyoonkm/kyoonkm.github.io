'use client';
import { useEffect, useRef, useState } from 'react';

export default function NewsSection() {
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

  const newsItems = [
    {
      date: 'March 15, 2024',
      title: 'Awarded Best Paper at CHI 2024 Conference',
      description: 'Our research on "Human Empowerment through AI" received the Best Paper Award at the ACM CHI Conference on Human Factors in Computing Systems.',
      type: 'Award',
      link: '#'
    },
    {
      date: 'February 28, 2024',
      title: 'Guest Speaker at AI Ethics Summit',
      description: 'Delivered keynote presentation on ethical considerations in AI systems design for social good at the International AI Ethics Summit in San Francisco.',
      type: 'Speaking',
      link: '#'
    },
    {
      date: 'January 20, 2024',
      title: 'New Research Grant from NSF',
      description: 'Received $500K NSF grant to advance research in computational social science and cross-cultural AI communication systems.',
      type: 'Funding',
      link: '#'
    },
    {
      date: 'December 10, 2023',
      title: 'Featured in MIT Technology Review',
      description: 'Interview published discussing the future of AI in social understanding and the importance of human-centered AI design approaches.',
      type: 'Media',
      link: '#'
    },
    {
      date: 'November 5, 2023',
      title: 'Collaboration with Stanford HCI Lab',
      description: 'Announced new research partnership with Stanford Human-Computer Interaction Lab to explore AI-assisted cross-cultural communication tools.',
      type: 'Collaboration',
      link: '#'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Award':
        return 'bg-yellow-100 text-yellow-700';
      case 'Speaking':
        return 'bg-blue-100 text-blue-700';
      case 'Funding':
        return 'bg-green-100 text-green-700';
      case 'Media':
        return 'bg-purple-100 text-purple-700';
      case 'Collaboration':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50" id="news">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Latest News</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recent achievements, collaborations, and research milestones
          </p>
        </div>

        <div className="space-y-6">
          {newsItems.map((item, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-gray-500 text-sm font-medium">{item.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`text-xs font-medium uppercase tracking-wide ${getTypeColor(item.type).replace('bg-', 'text-').replace('-100', '-700')}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                    Read more →
                  </button>
                </div>
                
                <div className="ml-6 flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="ri-newspaper-line text-gray-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
}
