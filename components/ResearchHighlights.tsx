'use client';
import { useEffect, useRef, useState } from 'react';

export default function ResearchHighlights() {
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

  const highlights = [
    {
      icon: 'ri-brain-line',
      title: 'Computational Social Science',
      description: 'Analyzing human behavior and social patterns through advanced computational methods and machine learning algorithms.',
      color: 'blue'
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Human-AI Interaction',
      description: 'Designing AI systems that enhance human capabilities while maintaining ethical considerations and user empowerment.',
      color: 'indigo'
    },
    {
      icon: 'ri-database-2-line',
      title: 'Social Understanding',
      description: 'Leveraging AI to decode complex social dynamics and improve cross-cultural communication and understanding.',
      color: 'purple'
    },
    {
      icon: 'ri-rocket-line',
      title: 'Human Empowerment',
      description: 'Creating AI tools that amplify human potential and support decision-making in various social contexts.',
      color: 'blue'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Research Highlights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging the gap between artificial intelligence and human society through innovative research approaches
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className={`p-8 rounded-2xl bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border border-${item.color}-200 transform transition-all duration-700 hover:scale-105 hover:shadow-lg cursor-pointer ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`w-16 h-16 bg-${item.color}-500 rounded-full flex items-center justify-center mb-6`}>
                <i className={`${item.icon} text-white text-2xl`}></i>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium">
            Explore All Projects
          </button>
        </div>
      </div>
    </section>
  );
}