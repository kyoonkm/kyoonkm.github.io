'use client';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';

interface Project {
  id: number;
  title: string;
  year: number;
  description: string;
  fullDescription: string;
  image: string;
  topics: string[];
  technologies?: string[];
  outcomes?: string[];
  links?: { label: string; url: string }[];
}

// Move your projects data to a shared file or expand it here
const projects: Project[] = [
  {
    id: 1,
    title: 'Carmony (Tentative)',
    year: 2025,
    description: 'Developing advanced computational modeling techniques for understanding complex social dynamics and human behavior patterns in digital environments.',
    fullDescription: `This research project focuses on developing cutting-edge computational models that can accurately simulate and predict complex social dynamics in digital environments. 

    The project combines machine learning algorithms with behavioral psychology principles to create more nuanced understanding of human interactions online. Key objectives include:
    
    • Understanding group decision-making processes in digital spaces
    • Modeling influence propagation in social networks  
    • Predicting behavioral changes based on environmental factors
    • Developing intervention strategies for positive social outcomes`,
    image: 'https://readdy.ai/api/search-image?query=Advanced%20computational%20modeling%20visualization%20with%20flowing%20data%20networks%2C%20neural%20pathways%2C%20and%20algorithmic%20patterns%20in%20modern%20blue%20and%20purple%20gradients%2C%20clean%20scientific%20aesthetic%2C%20high-tech%20research%20environment&width=600&height=300&seq=carmony-modeling&orientation=landscape',
    topics: ['Decision Making', 'AI Agents'],
    technologies: ['Python', 'TensorFlow', 'NetworkX', 'PyTorch'],
    outcomes: ['Paper submitted to ICML 2025', 'Patent application filed'],
    links: [
      { label: 'GitHub Repository', url: '#' },
      { label: 'Research Paper', url: '#' }
    ]
  },
  // Add other projects with expanded data...
];

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <button 
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <i className="ri-arrow-left-line mr-2 group-hover:-translate-x-1 transition-transform"></i>
            Back to Projects
          </button>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {project.year}
              </span>
            </div>
            
            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.topics.map((topic, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getTopicColor(topic)}`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Project Image */}
          <div className="mb-8">
            <img 
              src={project.image}
              alt={project.title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Project Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.fullDescription || project.description}
                </p>
              </div>

              {/* Technologies */}
              {project.technologies && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Year</span>
                    <p className="font-medium text-gray-900">{project.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <p className="font-medium text-gray-900">
                      {project.year >= 2025 ? 'In Progress' : 'Completed'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outcomes */}
              {project.outcomes && (
                <div className="bg-green-50 p-6 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Key Outcomes</h3>
                  <ul className="space-y-2">
                    {project.outcomes.map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <i className="ri-check-line text-green-600 mr-2 mt-0.5 flex-shrink-0"></i>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {project.links && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
