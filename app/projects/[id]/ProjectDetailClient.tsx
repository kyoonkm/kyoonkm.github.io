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
      
      {/* Main Project Image with Zoom */}
      <div className="mb-8">
        <Zoom>
          <img
            src={project.image} 
            alt={project.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg cursor-zoom-in"
          />
        </Zoom>
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

        {/* Additional Images Section */}
          {project.images && project.images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images
                .filter((imageSrc: string) => imageSrc !== project.image)
                .map((imageSrc: string, index: number) => (
                  <div key={index} className="relative">
                    <Zoom>
                    <img 
                      src={imageSrc}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-zoom-in"
                    />
                    </Zoom>
                  </div>
                ))}
              </div>
            </div>
          )}

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
  );
}
