import Header from '../../../components/Header';
import ProjectDetailClient from './ProjectDetailClient';

// Projects data
const projects = [
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
  {
    id: 2,
    title: 'Preferential Bayesian Optimization',
    year: 2024,
    description: 'Advanced Bayesian optimization framework that incorporates human preferences and decision-making patterns to improve AI system performance.',
    fullDescription: 'Detailed description of Bayesian optimization research...',
    image: 'https://readdy.ai/api/search-image?query=Bayesian%20optimization%20mathematical%20visualization%20with%20probability%20distributions%2C%20gradient%20flows%2C%20and%20optimization%20landscapes%20in%20elegant%20mathematical%20style%2C%20clean%20white%20background%20with%20blue%20and%20green%20accents&width=600&height=300&seq=bayesian-opt&orientation=landscape',
    topics: ['Decision Making', 'Machine Learning', 'Data Analysis'],
    technologies: ['Python', 'scipy', 'numpy'],
    outcomes: ['Published in NeurIPS 2024'],
    links: [{ label: 'Paper', url: '#' }]
  },
  {
    id: 3,
    title: 'Student Dropout Prediction',
    year: 2023,
    description: 'Machine learning model for early identification of students at risk of dropping out, enabling timely intervention and support strategies.',
    fullDescription: 'Comprehensive machine learning approach to predicting student outcomes...',
    image: 'https://readdy.ai/api/search-image?query=Educational%20analytics%20dashboard%20showing%20student%20progress%20charts%2C%20predictive%20models%2C%20and%20intervention%20strategies%20in%20modern%20educational%20setting%20with%20warm%20colors%20and%20clean%20interface%20design&width=600&height=300&seq=student-prediction&orientation=landscape',
    topics: ['Machine Learning', 'Data Analysis', 'Social Science']
  },
  {
    id: 4,
    title: 'Automatic Labeling Model',
    year: 2023,
    description: 'AI-powered system for automated data labeling and annotation, significantly reducing manual effort in machine learning dataset preparation.',
    fullDescription: 'Advanced AI system for automated data processing...',
    image: 'https://readdy.ai/api/search-image?query=Automated%20data%20labeling%20system%20with%20AI%20processing%20pipelines%2C%20data%20classification%20tags%2C%20and%20machine%20learning%20workflows%20in%20modern%20tech%20environment%20with%20clean%20blue%20and%20white%20design&width=600&height=300&seq=auto-labeling&orientation=landscape',
    topics: ['Machine Learning', 'NLP']
  },
  {
    id: 5,
    title: 'COVID-19 Data Analysis A to Z',
    year: 2021,
    description: 'Comprehensive analysis of pandemic data patterns, transmission dynamics, and public health implications using advanced statistical methods.',
    fullDescription: 'Complete statistical analysis of pandemic data...',
    image: 'https://readdy.ai/api/search-image?query=COVID-19%20data%20visualization%20with%20epidemiological%20charts%2C%20statistical%20analysis%20graphs%2C%20and%20public%20health%20metrics%20in%20professional%20medical%20research%20style%20with%20clean%20scientific%20presentation&width=600&height=300&seq=covid-analysis&orientation=landscape',
    topics: ['Data Analysis', 'Public Health', 'Social Science']
  },
  {
    id: 6,
    title: 'COVID-19: Our Memory',
    year: 2020,
    description: 'Digital archive project documenting personal experiences and collective memories during the COVID-19 pandemic for future research.',
    fullDescription: 'Digital memory preservation project...',
    image: 'https://readdy.ai/api/search-image?query=Digital%20memory%20archive%20interface%20with%20personal%20stories%2C%20timeline%20documentation%2C%20and%20social%20history%20preservation%20in%20warm%20humanistic%20design%20with%20gentle%20colors%20and%20emotional%20storytelling%20elements&width=600&height=300&seq=covid-memory&orientation=landscape',
    topics: ['NLP', 'Social Science', 'Data Analysis']
  },
  {
    id: 7,
    title: 'Online Petition Analysis of South Korea',
    year: 2020,
    description: 'Analysis of digital civic engagement through online petition platforms, examining patterns of political participation and democratic processes.',
    fullDescription: 'Comprehensive analysis of digital democracy...',
    image: 'https://readdy.ai/api/search-image?query=Digital%20democracy%20visualization%20with%20petition%20analysis%2C%20civic%20engagement%20metrics%2C%20and%20political%20participation%20data%20in%20Korean%20government%20style%20with%20professional%20blue%20and%20red%20color%20scheme&width=600&height=300&seq=petition-analysis&orientation=landscape',
    topics: ['Social Science', 'NLP', 'Data Analysis']
  }
];

// This function MUST be exported and runs at build time
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

// Server component - NO 'use client' directive here
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id);
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20">
        <ProjectDetailClient project={project} />
      </section>
    </div>
  );
}
