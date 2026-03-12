'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function Projects() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Updated to match your detail page data exactly
  const projects = [
    {
      id: 1,
      title: 'Sim-DSE',
      year: 2025,
      description: 'How do automated vehicles resolve passenger needs and preference? Developed a multi-agent framework where AI agents advocate for individual occupants to negotiate optimal cabin environments, bridging the gap between rigid automation and human fluidity.',
      image: '/images/projects/porsche_logo.svg',
      topics: ['Decision Making', 'AI Agents', 'Social Simulation'],
    },
    {
      id: 2,
      title: 'Preferential Bayesian Optimization (PBO)',
      year: 2024,
      description: 'Can the PBO model human preferences, suggest an optimal setting, and facilitate efficient decision-making for humans? Can biases potentially impede the efficacy of PBO?',
      image: '/images/projects/forrester_loop.png',
      topics: ['Decision Making', 'Machine Learning', 'Data Analysis']
    },
    {
      id: 3,
      title: 'Student Dropout Prediction',
      year: 2023,
      description: 'How can we improve the current dropout situation in STEM classes? Kalman Filter model for early identification of students at risk of dropping out, enabling timely intervention and support strategies.',
      image: '/images/projects/lyra.png',
      topics: ['Machine Learning', 'Data Analysis', 'Social Science']
    },
    {
      id: 4,
      title: 'Automatic Labeling Model',
      year: 2023,
      description: 'How can we streamline the workflow? Designed and implemented an automatic labeling model to streamline the workflow during the internship',
      image: '/images/projects/labeling.png',
      topics: ['Machine Learning', 'NLP']
    },
    {
      id: 5,
      title: 'COVID-19 Data Analysis A to Z',
      year: 2021,
      description: 'What critical factors were constrained by the existing public COVID-19 data, and what strategies can we implement to enhance data accessibility and analysis?',
      image: 'https://img.youtube.com/vi/L3i_Rng3i5s/maxresdefault.jpg',
      topics: ['Data Analysis', 'Public Health', 'Social Science']
    },
    {
      id: 6,
      title: 'COVID-19: Our Memory',
      year: 2020,
      description: 'Does disaster inequality exist? How can we capture peoples mobilizing needs?',
      image: '/images/projects/covid19.png',
      topics: ['Public Health', 'NLP', 'Social Science', 'Data Analysis']
    },
    {
      id: 7,
      title: 'Online Petition Analysis of South Korea',
      year: 2020,
      description: 'Based on the Structuration Theory by Giddens, will the content and subjects of the petition data will contain social multi-perspective factors?',
      image: '/images/projects/petitions.png',
      topics: ['Social Science', 'NLP', 'Data Analysis']
    }
  ];

  const allAreas = Array.from(new Set(projects.flatMap(p => p.topics))).sort();

  const filteredProjects = projects
    .filter(project => selectedAreas.length === 0 || project.topics.some(topic => selectedAreas.includes(topic)))
    .sort((a, b) => sortBy === 'newest' ? b.year - a.year : a.year - b.year);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(t => t !== area)
        : [...prev, area]
    );
  };

  const clearAllAreas = () => {
    setSelectedAreas([]);
  };

  const getButtonText = () => {
    return selectedAreas.length === 0 
      ? 'All Areas' 
      : selectedAreas.length === 1 
        ? selectedAreas[0]
        : `${selectedAreas.length} areas selected`
  };

  const handleAreaFilter = (area: string) => {
    if (area === 'all') {
      setSelectedAreas([]);
    } else {
      setSelectedAreas(prev => 
        prev.includes(area) 
          ? prev.filter(t => t !== area)
          : [...prev, area]
      );
    }
  };

  return (
    <div className="min-h-screen bg-backgroundCream">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Research Projects</h1>
          </div>

          {/* Simple Controls */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-6">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-8"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-500 focus:outline-none focus:border-blue-500 cursor-pointer flex items-center space-x-2"
                >
                  <span>{getButtonText()}</span>
                  <i className={`ri-arrow-down-s-line transition-transform ${showFilters ? 'rotate-180' : ''}`}></i>
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    <button
                      onClick={() => handleAreaFilter('all')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        selectedAreas.length === 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      All Areas
                    </button>
                    {allAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => handleAreaFilter(area)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                          selectedAreas.includes(area) ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <span>{area}</span>
                        {selectedAreas.includes(area) && (
                          <i className="ri-check-line text-blue-600"></i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {filteredProjects.length} projects
            </div>
          </div>

          {/* Selected Areas Tags */}
          {selectedAreas.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600">Selected:</span>
                {selectedAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {area}
                    <button
                      onClick={() => toggleArea(area)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllAreas}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id}
                className="block bg-backgroundCream rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group cursor-pointer"

              >
                <div className="relative">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                    {project.year}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.topics.slice(0, 3).map((topic, index) => (
                      <span 
                        key={index}
                        className="text-sm font-medium text-gray-600"
                      >
                        #{topic.replace(/\s+/g, '')}
                      </span>
                    ))}
                    {project.topics.length > 3 && (
                      <span className="text-sm font-medium text-gray-500">
                        +{project.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
