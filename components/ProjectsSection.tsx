'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ProjectsSection() {
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

  const projects = [
    {
      title: 'Social Behavior Analytics Platform',
      description: 'An AI-powered platform that analyzes social media interactions to understand community dynamics and predict social trends.',
      category: 'Social Understanding',
      id: 'social-behavior-analytics'
    },
    {
      title: 'Cross-Cultural Communication Assistant',
      description: 'A machine learning system that helps bridge cultural communication gaps by providing context-aware translation and cultural insights.',
      category: 'Human Empowerment',
      id: 'cross-cultural-communication'
    },
    {
      title: 'Ethical AI Decision Framework',
      description: 'A comprehensive framework for evaluating the ethical implications of AI decisions in social contexts, with real-time bias detection.',
      category: 'Ethics & Society',
      id: 'ethical-ai-framework'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white" id="projects">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Current and completed research projects advancing AI for social good
          </p>
        </div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <div className="space-y-6">
                <div>
                  <span className="text-gray-600 text-sm font-medium uppercase tracking-wide hover:text-black transition-colors cursor-pointer">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-900">{project.title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>

                <div className="flex space-x-4 pt-4">
                  <Link href={`/projects#${project.id}`}>
                    <span className="text-black hover:text-gray-600 transition-colors cursor-pointer font-medium">
                      Learn More
                    </span>
                  </Link>
                  <span className="text-gray-700 hover:text-black transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-github-line mr-2"></i>
                    View Code
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/projects">
            <span className="inline-flex items-center text-black hover:text-gray-600 transition-colors cursor-pointer text-lg font-medium relative group">
              View All Projects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}