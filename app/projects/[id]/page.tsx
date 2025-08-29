import Header from '../../../components/Header';
import ProjectDetailClient from './ProjectDetailClient';

// Projects data
const projects = [
  {
    id: 1,
    title: 'Carmony (Tentative)',
    year: 2025,
    description: 'Implementing a context-aware system using AI agents for decision-making on optimal vehicle configurations and seamless human-vehicle interaction for all occupants',
    fullDescription: 'TBD',
    image: '/images/projects/porsche_logo.svg',
    topics: ['Decision Making', 'AI Agents'],
    technologies: ['Python', 'Autogen', 'Model Context Protocol'],
    outcomes: ['Paper will be submitted to UIST 2026'],
  },
  {
    id: 2,
    title: 'Preferential Bayesian Optimization (PBO)',
    year: 2024,
    description: 'Can the PBO model human preferences, suggest an optimal setting, and facilitate efficient decision-making for humans?',
    fullDescription: 'Using Bosch real-world data, I developed and tested PBO algorithms to optimize machinery settings for expert operators efficiently. This involved modeling human preferences in decision-making processes and identifying cognitive biases for future human-in-the-loop experiments. For more information and results, please refer to the research project paper!',
    image: '/images/projects/forrester_loop.png',
    topics: ['Decision Making', 'Machine Learning', 'Data Analysis'],
    technologies: ['Python', 'BoTorch'],
    links: [{ label: 'Paper', url: 'pbo.pdf' }]
  },
  {
    id: 3,
    title: 'Student Dropout Prediction',
    year: 2023,
    description: 'How can we improve the current dropout situation in STEM classes? Kalman Filter model for early identification of students at risk of dropping out, enabling timely intervention and support strategies.',
    fullDescription: 'Developed the model to predict student dropouts in STEM classes using multivariate time-series analysis (i.e., Kalman Filter) to strengthen the educational environment. Utilized latent characteristics such as ability, motivation, stress levels from questionnaries for prediction. Supported by the Ministry of Education Baden-Württemberg.',
    image: '/images/projects/lyra.png',
    images: [
        '/images/projects/lyra_analysis.png'
    ],
    topics: ['Machine Learning', 'Data Analysis', 'Social Science']
  },
  {
    id: 4,
    title: 'Automatic Labeling Model',
    year: 2023,
    description: 'How can we streamline the workflow? Designed and implemented an automatic labeling model to streamline the workflow during the internship',
    fullDescription: 'Using the BERT model, I trained internal clothing reviews with supervised learning. When you upload the unlabeled file, it labels the sentiment as Positive, Neutral, or Negative and returns the labeled file.',
    image: 'https://picsum.photos/600/300',
    technologies: ['Python', 'Streamlit'],
    topics: ['Machine Learning', 'NLP']
  },
  {
    id: 5,
    title: 'COVID-19 Data Analysis A to Z',
    year: 2021,
    description: 'What critical factors were constrained by the existing public COVID-19 data, and what strategies can we implement to enhance data accessibility and analysis?',
    fullDescription: 'I assessed the effectiveness of policies, such as pandemic screening facilities and hospital bed capacity. I improved data visualization accessibility for the general public and developed recommendations for enhancing public health data infrastructure. By implementing a new dataset, my analysis revealed regional healthcare inequalities in South Korea’s capital-centric system. Additionally, I created a policy visualization over time and visualized mass infection data for Seoul, linking it to related news articles to combat misinformation. I also suggested detailed state-level policies. I presented this work on International Open Data Day 2021 in Seoul, with support from Open Knowledge International NPO and the Korean Ministry of the Interior and Safety.',
    image: 'https://img.youtube.com/vi/L3i_Rng3i5s/maxresdefault.jpg',
    topics: ['Data Analysis', 'Public Health', 'Social Science'],
    outcomes: ['Donated to the National Public Library of Korea'],
    links: [{ label: 'GitHub', url: 'https://github.com/Open-Knowledge-Korea/covid-19-our-memory/tree/master/covid19-atoz/topic-1'},
        {label: 'Press', url: 'https://www.nl.go.kr/EN/contents/EN10700000000.do?schFld=0&schStr=Chung&schOpt5=NLNE&schM=view&page=1&ordFld=regdt&ordBy=DESC&viewCount=9&id=42008&schBdcode=&schGroupCode='},
        {label: 'YouTube', url: 'https://www.youtube.com/watch?v=L3i_Rng3i5s&ab_channel=NIA%ED%95%9C%EA%B5%AD%EC%A7%80%EB%8A%A5%EC%A0%95%EB%B3%B4%EC%82%AC%ED%9A%8C%EC%A7%84%ED%9D%A5%EC%9B%90'},
    ]
  },
  {
    id: 6,
    title: 'COVID-19: Our Memory',
    year: 2020,
    description: 'Does disaster inequality exist? How can we capture peoples mobilizing needs?',
    fullDescription: 'Investigated pandemic-driven social inequalities through statistical correlation analysis, text mining, and news media archiving',
    image: '/images/projects/covid19.png',
    topics: ['Public Health', 'NLP', 'Social Science', 'Data Analysis'],
    links: [{label: 'Website', url: 'http://hike.cau.ac.kr/covid-19-our-memory/index-en.html'}]
  },
  {
    id: 7,
    title: 'Online Petition Analysis of South Korea',
    year: 2020,
    description: 'Based on the Structuration Theory by Giddens, will the content and subjects of the petition data will contain social multi-perspective factors?',
    fullDescription: 'Conducted an analysis of South Korea’s online petition system, revealing unresolved social issues; presented at the International Postgraduate and Academic Conference 2021',
    image: '/images/projects/petitions.png',
    topics: ['Social Science', 'NLP', 'Data Analysis'],
    links: [{label: 'Slides', url: 'https://docs.google.com/presentation/d/1KmKsndiEqIGVuV73TBdGs2_e9RDkGUIh/edit?usp=sharing&ouid=107424392698532184399&rtpof=true&sd=true'}]
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
