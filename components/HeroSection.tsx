'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen flex items-center justify-center bg-backgroundCream pt-20 relative"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className={`space-y-12 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-textGrayCustom leading-tight">
                Kayoon Kim
              </h1>
              <p className="text-lg text-textGrayCustom leading-relaxed">
                Hi! I'm Kayoon (Ga Yoon). I am a master's student studying Quantitative Data Science at the University of Tübingen. My research focuses on human-agent interaction and responsible & safe AI.
              </p>

            </div>

            {/* Social Links */}
            <div className="flex justify-start items-center space-x-8">
              <a 
                href="https://scholar.google.com/citations?user=ZQQzsosAAAAJ&hl=en&oi=ao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-backgroundCream border-2 border-gray-700 hover:bg-gray-700 rounded-full transition-all duration-300 cursor-pointer group"
              >
                <i className="ri-graduation-cap-line text-gray-700 group-hover:text-white text-xl transition-colors"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/kyoonkm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-backgroundCream border-2 border-gray-700 hover:bg-gray-700 rounded-full transition-all duration-300 cursor-pointer group"
              >
                <i className="ri-linkedin-line text-gray-700 group-hover:text-white text-xl transition-colors"></i>
              </a>
              <a 
                href="https://github.com/kyoonkm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-backgroundCream border-2 border-gray-700 hover:bg-gray-700 rounded-full transition-all duration-300 cursor-pointer group"
              >
                <i className="ri-github-line text-gray-700 group-hover:text-white text-xl transition-colors"></i>
              </a>
              <a 
                href="mailto:kyoonkm@gmail.com" 
                className="w-12 h-12 flex items-center justify-center bg-backgroundCream border-2 border-gray-700 hover:bg-gray-700 rounded-full transition-all duration-300 cursor-pointer group"
              >
                <i className="ri-mail-line text-gray-700 group-hover:text-white text-xl transition-colors"></i>
              </a>
            </div>
          </div>

          {/* Right side - Two intersecting circles with updated colors */}
          <div className={`relative flex items-center justify-start h-96 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {/* First circle */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredCircle('social')}
              onMouseLeave={() => setHoveredCircle(null)}
            >
              <div className={`w-96 h-96 border-2 border-gray-700 rounded-full bg-transparent transition-all duration-300 cursor-pointer ${
                hoveredCircle === 'social' ? 'shadow-lg' : ''
              }`}></div>
              
              <div className={`absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                hoveredCircle === 'social' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="text-textGrayCustom font-medium text-lg text-center">
                  <div>AI for</div>
                  <div>Social Understanding</div>
                </div>
              </div>
            </div>
            
            {/* Second circle */}
            <div 
              className="absolute"
              style={{ left: '200px' }}
              onMouseEnter={() => setHoveredCircle('empowerment')}
              onMouseLeave={() => setHoveredCircle(null)}
            >
              <div className={`w-96 h-96 border-2 border-gray-700 rounded-full bg-transparent transition-all duration-300 cursor-pointer ${
                hoveredCircle === 'empowerment' ? 'shadow-lg' : ''
              }`}></div>
              
              <div className={`absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                hoveredCircle === 'empowerment' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="text-textGrayCustom font-medium text-lg text-center">
                  <div>AI for</div>
                  <div>Human Empowerment</div>
                </div>
              </div>
            </div>

            {/* Center dot */}
            <div 
              className={`absolute top-1/2 w-3 h-3 bg-gray-700 rounded-full transition-all duration-1000 delay-500 ${
                isVisible ? 'animate-blink' : 'opacity-0'
              }`} 
              style={{ 
                left: '288px',
                transform: 'translateY(-50%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        
        .animate-blink {
          animation: blink 0.75s ease-in-out 4;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}


