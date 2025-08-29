
'use client';
import { useState } from 'react';
import Header from '../../components/Header';

export default function Projects() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const projects = [
    {
      id: 1,
      title: 'Carmony (Tentative)',
      year: 2025,
      description: 'Developing advanced computational modeling techniques for understanding complex social dynamics and human behavior patterns in digital environments.',
      image: 'https://readdy.ai/api/search-image?query=Advanced%20computational%20modeling%20visualization%20with%20flowing%20data%20networks%2C%20neural%20pathways%2C%20and%20algorithmic%20patterns%20in%20modern%20blue%20and%20purple%20gradients%2C%20clean%20scientific%20aesthetic%2C%20high-tech%20research%20environment&width=600&height=300&seq=carmony-modeling&orientation=landscape',
      topics: ['Decision Making', 'AI Agents']
    },
    {
      id: 2,
      title: 'Preferential Bayesian Optimization',
      year: 2024,
      description: 'Advanced Bayesian optimization framework that incorporates human preferences and decision-making patterns to improve AI system performance.',
      image: 'https://readdy.ai/api/search-image?query=Bayesian%20optimization%20mathematical%20visualization%20with%20probability%20distributions%2C%20gradient%20flows%2C%20and%20optimization%20landscapes%20in%20elegant%20mathematical%20style%2C%20clean%20white%20background%20with%20blue%20and%20green%20accents&width=600&height=300&seq=bayesian-opt&orientation=landscape',
      topics: ['Decision Making', 'Machine Learning', 'Data Analysis']
    },
    {
      id: 3,
      title: 'Student Dropout Prediction',
      year: 2023,
      description: 'Machine learning model for early identification of students at risk of dropping out, enabling timely intervention and support strategies.',
      image: 'https://readdy.ai/api/search-image?query=Educational%20analytics%20dashboard%20showing%20student%20progress%20charts%2C%20predictive%20models%2C%20and%20intervention%20strategies%20in%20modern%20educational%20setting%20with%20warm%20colors%20and%20clean%20interface%20design&width=600&height=300&seq=student-prediction&orientation=landscape',
      topics: ['Machine Learning', 'Data Analysis', 'Social Science']
    },
    {
      id: 4,
      title: 'Automatic Labeling Model',
      year: 2023,
      description: 'AI-powered system for automated data labeling and annotation, significantly reducing manual effort in machine learning dataset preparation.',
      image: 'https://readdy.ai/api/search-image?query=Automated%20data%20labeling%20system%20with%20AI%20processing%20pipelines%2C%20data%20classification%20tags%2C%20and%20machine%20learning%20workflows%20in%20modern%20tech%20environment%20with%20clean%20blue%20and%20white%20design&width=600&height=300&seq=auto-labeling&orientation=landscape',
      topics: ['Machine Learning', 'NLP', 'AI Agents']
    },
    {
      id: 5,
      title: 'COVID-19 Data Analysis A to Z',
      year: 2021,
      description: 'Comprehensive analysis of pandemic data patterns, transmission dynamics, and public health implications using advanced statistical methods.',
      image: 'https://readdy.ai/api/search-image?query=COVID-19%20data%20visualization%20with%20epidemiological%20charts%2C%20statistical%20analysis%20graphs%2C%20and%20public%20health%20metrics%20in%20professional%20medical%20research%20style%20with%20clean%20scientific%20presentation&width=600&height=300&seq=covid-analysis&orientation=landscape',
      topics: ['Data Analysis', 'Public Health', 'Social Science']
    },
    {
      id: 6,
      title: 'COVID-19: Our Memory',
      year: 2020,
      description: 'Digital archive project documenting personal experiences and collective memories during the COVID-19 pandemic for future research.',
      image: 'https://readdy.ai/api/search-image?query=Digital%20memory%20archive%20interface%20with%20personal%20stories%2C%20timeline%20documentation%2C%20and%20social%20history%20preservation%20in%20warm%20humanistic%20design%20with%20gentle%20colors%20and%20emotional%20storytelling%20elements&width=600&height=300&seq=covid-memory&orientation=landscape',
      topics: ['NLP', 'Social Science', 'Data Analysis']
    },
    {
      id: 7,
      title: 'Online Petition Analysis of South Korea',
      year: 2020,
      description: 'Analysis of digital civic engagement through online petition platforms, examining patterns of political participation and democratic processes.',
      image: 'https://readdy.ai/api/search-image?query=Digital%20democracy%20visualization%20with%20petition%20analysis%2C%20civic%20engagement%20metrics%2C%20and%20political%20participation%20data%20in%20Korean%20government%20style%20with%20professional%20blue%20and%20red%20color%20scheme&width=600&height=300&seq=petition-analysis&orientation=landscape',
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

  const getTopicColor = (topic: string) => {
    const colors = {
      'Decision Making': 'bg-blue-50 text-blue-600 border-blue-100',
      'Machine Learning': 'bg-green-50 text-green-600 border-green-100',
      'Public Health': 'bg-red-50 text-red-600 border-red-100',
      'NLP': 'bg-purple-50 text-purple-600 border-purple-100',
      'Data Analysis': 'bg-orange-50 text-orange-600 border-orange-100',
      'AI Agents': 'bg-cyan-50 text-cyan-600 border-cyan-100',
      'Social Science': 'bg-indigo-50 text-indigo-600 border-indigo-100'
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-50 text-gray-600 border-gray-100';
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
    <div className="min-h-screen bg-white">
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
                onChange={(e) => setSortBy(e.target.value)}
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
              <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                    {project.year}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
