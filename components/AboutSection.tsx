
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
          <div className={`rn-bio-col rn-bio-row transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <img
              className="rn-portrait"
              src="/images/kayoon-320.webp"
              srcSet="/images/kayoon-320.webp 320w, /images/kayoon-640.webp 640w"
              sizes="(max-width: 860px) 132px, 176px"
              width={320}
              height={320}
              alt="Kayoon Kim"
            />
            <div className="space-y-5">
              <h2>Bio</h2>
              <p>
                Having crossed from sociology into computer science, I aim to build models that understand social relations and signals, train them on data that keeps them, and design evaluations that test whether they do.
              </p>
              <p>
                M.S. in Quantitative Data Science, University of Tübingen (2026). Previously a research assistant in the <a href="https://is.mpg.de/rml" target="_blank" rel="noopener noreferrer" className="rn-link">Robust Machine Learning group</a> at <a href="https://institute-tue.ellis.eu/en" target="_blank" rel="noopener noreferrer" className="rn-link">ELLIS Institute Tübingen</a> and the <a href="https://is.mpg.de/" target="_blank" rel="noopener noreferrer" className="rn-link">Max Planck Institute for Intelligent Systems (MPI-IS)</a>; a research intern at Porsche Human-Centered AI Research and <a href="https://www.bosch-ai.com/" target="_blank" rel="noopener noreferrer" className="rn-link">Bosch Research (BCAI)</a>, and a research assistant at the <a href="https://uni-tuebingen.de/fakultaeten/wirtschafts-und-sozialwissenschaftliche-fakultaet/faecher/fachbereich-sozialwissenschaften/methodenzentrum/institut/" target="_blank" rel="noopener noreferrer" className="rn-link">Methods Center</a>. Earlier projects were at{' '}
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
