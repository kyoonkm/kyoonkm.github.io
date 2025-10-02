'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Project {
  id: number;
  title: string;
  year: number;
  description: string;
  fullDescription?: string;
  image: string;
  images?: string[];
  topics: string[];
  technologies?: string[];
  outcomes?: string[];
  links?: { label: string; url: string }[];
}

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();

  const getTopicColor = (topic: string) => {
    const colors = {
      'Decision Making': 'bg-blue-100 text-blue-800 border-blue-200',
      'Machine Learning': 'bg-green-100 text-green-800 border-green-200',
      'Public Health': 'bg-red-100 text-red-800 border-red-200',
      'NLP': 'bg-purple-100 text-purple-800 border-purple-200',
      'Data Analysis': 'bg-orange-100 text-orange-800 border-orange-200',
      'AI Agents': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Social Science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-textGrayCustom hover:text-textGrayCustom/75 mb-8 group"
      >
        <i className="ri-arrow-left-line mr-2 group-hover:-translate-x-1 transition-transform"></i>
        Back to Projects
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-textGrayCustom">{project.title}</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {project.year}
          </span>
        </div>
        
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
      
      <div className="mb-8">
        <Zoom>
          <img
            src={project.image} 
            alt={project.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg cursor-zoom-in"
          />
        </Zoom>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-textGrayCustom mb-4">Overview</h2>
          <div className="prose max-w-none">
            <p className="text-textGrayCustom leading-relaxed whitespace-pre-line">
              {project.fullDescription || project.description}
            </p>
          </div>

          {project.images && project.images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-textGrayCustom mb-4">Project Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.filter(img => img !== project.image).map((img, i) => (
                  <div key={i} className="relative">
                    <Zoom>
                      <img 
                        src={img}
                        alt={`${project.title} image ${i + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-zoom-in"
                      />
                    </Zoom>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.technologies && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-textGrayCustom mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-semibold text-textGrayCustom mb-4">Project Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Year</span>
                <p className="font-medium text-textGrayCustom">{project.year}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="font-medium text-textGrayCustom">{project.year >= 2025 ? 'In Progress' : 'Completed'}</p>
              </div>
            </div>
          </div>

          {project.outcomes && (
            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="font-semibold text-textGrayCustom mb-4">Key Outcomes</h3>
              <ul className="space-y-2">
                {project.outcomes.map((outcome, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <i className="ri-check-line text-green-600 mr-2 mt-0.5 flex-shrink-0"></i>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.links && (
            <div>
              <h3 className="font-semibold text-textGrayCustom mb-4">Links</h3>
              <div className="space-y-2">
                {project.links.map((link, i) => (
                  <a 
                    key={i}
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
  );
}


