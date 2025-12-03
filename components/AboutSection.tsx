
'use client';
import { useEffect, useRef, useState } from 'react';

export default function AboutSection() {
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

  return (
    <section ref={sectionRef} className="py-20 bg-backgroundCream" id="bio">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center space-y-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Bio</h2>
              <p className="text-base leading-relaxed max-w-4xl mx-auto">
                My research vision is to ensure humanity benefits from AI and algorithms that facilitate interactions between people and systems in everyday life. To achieve this goal, I focus on (1) characterizing problems and developing data-driven solutions, and (2) enhancing human decision-making while preventing marginalization through algorithms and design. My research interests are the Human-AI/Vehicle Interaction, Decision-making, and Computational Social Science.
              </p>
              <p className="text-base leading-relaxed max-w-4xl mx-auto">
                Previously, I was a research intern at <a href="https://www.bosch-ai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Bosch Center for Artificial Intelligence (BCAI)</a>. I also worked as a research assistant at the <a href="https://uni-tuebingen.de/fakultaeten/wirtschafts-und-sozialwissenschaftliche-fakultaet/faecher/fachbereich-sozialwissenschaften/methodenzentrum/institut/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Methods Center</a> at the University of Tübingen. I studied Sociology and Computer Science during my bachelor's degree, which laid the foundation for my interdisciplinary research. I worked on exciting projects at{' '}
                <a href="http://hike.cau.ac.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                  HIKE Lab
                </a>,{' '}
                <a href="https://www.damovelab.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                  Da Move Lab
                </a>, and {' '}
                <a href="https://sites.google.com/aicampus.cau.ac.kr/dsl/home?authuser=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                  CAU Data Science Lab
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
