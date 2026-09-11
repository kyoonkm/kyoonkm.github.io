
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
    <section ref={sectionRef} className="rn-bio" id="bio">
      <div className="max-w-6xl mx-auto px-6">
        <div>
          <div className={`rn-bio-col transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="space-y-5">
              <h2>Bio</h2>
              <p>
                My research vision is to ensure humanity benefits from AI and algorithms that facilitate interactions between people and systems in everyday life. I characterize problems and develop data-driven solutions, and work on enhancing human decision-making while preventing marginalization through algorithms and design.
              </p>
              <p>
                Currently a student researcher in the <a href="https://is.mpg.de/rml" target="_blank" rel="noopener noreferrer" className="rn-link">Robust Machine Learning group</a> at <a href="https://institute-tue.ellis.eu/en" target="_blank" rel="noopener noreferrer" className="rn-link">ELLIS Institute Tübingen</a>, and an M.S. student in Quantitative Data Science at the University of Tübingen. Previously a research intern at Porsche Human-Centered AI Research and <a href="https://www.bosch-ai.com/" target="_blank" rel="noopener noreferrer" className="rn-link">Bosch Research (BCAI)</a>, and a research assistant at the <a href="https://uni-tuebingen.de/fakultaeten/wirtschafts-und-sozialwissenschaftliche-fakultaet/faecher/fachbereich-sozialwissenschaften/methodenzentrum/institut/" target="_blank" rel="noopener noreferrer" className="rn-link">Methods Center</a>. My bachelor's in Sociology and Computer Science is where the interdisciplinary thread starts; earlier projects were at{' '}
                <a href="http://hike.cau.ac.kr/" target="_blank" rel="noopener noreferrer" className="rn-link">
                  HIKE Lab
                </a>,{' '}
                <a href="https://www.damovelab.com/" target="_blank" rel="noopener noreferrer" className="rn-link">
                  Da Move Lab
                </a>, and {' '}
                <a href="https://sites.google.com/aicampus.cau.ac.kr/dsl/home?authuser=0" target="_blank" rel="noopener noreferrer" className="rn-link">
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
