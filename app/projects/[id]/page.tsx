import Header from '../../../components/Header';
import ProjectDetailClient from './ProjectDetailClient';

// Projects data
const projects = [
  {
    id: 1,
    title: 'Sim-DSE',
    year: 2025,
    description: 'Collaborated with Porsche, implementing a context-aware system using AI agents for decision-making on optimal vehicle configurations and seamless human-vehicle interaction for all occupants',
    fullDescription: 'TBD',
    image: '/images/projects/porsche_logo.svg',
    topics: ['Decision Making', 'AI Agents'],
    technologies: ['Python', 'Autogen', 'Model Context Protocol'],
    outcomes: ['Paper will be submitted to IMWUT 2026'],
  },
  {
    id: 2,
    title: 'Preferential Bayesian Optimization (PBO)',
    year: 2024,
    description: 'Can the PBO model human preferences, suggest an optimal setting, and facilitate efficient decision-making for humans? Can biases potentially impede the efficacy of PBO?',
    fullDescription: 'Using Bosch real-world data, I developed and tested PBO algorithms to efficiently optimize machinery settings for expert operators. This process involved modeling human preferences in decision-making and identifying cognitive biases for future human-in-the-loop experiments. I also conducted an experiment using simulated biased data, which demonstrated how bias can hinder the performance of the algorithms. For more information and results, please refer to the research project paper!',
    image: '/images/projects/forrester_loop.png',
    images: [
        '/images/projects/3_2_bosch_use_case_best.png',
        '/images/projects/3_6d_ackley_regret_bias.png',
        '/images/projects/3_ackley_bias.png',
    ],
    topics: ['Decision Making', 'Machine Learning', 'Data Analysis'],
    technologies: ['Python', 'BoTorch'],
    links: [{ label: 'Paper', url: '/pbo.pdf' }]
  },
  {
    id: 3,
    title: 'Student Dropout Prediction',
    year: 2023,
    description: 'How can we improve the current dropout situation in STEM classes? Kalman Filter model for early identification of students at risk of dropping out, enabling timely intervention and support strategies',
    fullDescription: 'In the first year of my master`s degree, I worked as a research assistant at the Methods Center at the University of Tübingen. There, I developed a model to predict student dropouts in STEM classes using multivariate time-series analysis, specifically the Kalman Filter, to enhance the educational environment. We combined a psychometric approach, utilizing latent characteristics such as ability, motivation, and stress levels from questionnaires for prediction. The project received support from the Ministry of Education of Baden-Württemberg.',
    image: '/images/projects/lyra.png',
    images: [
        '/images/projects/lyra_analysis.png',
    ],
    topics: ['Machine Learning', 'Data Analysis', 'Social Science']
  },
  {
    id: 4,
    title: 'Automatic Labeling Model',
    year: 2023,
    description: 'How can we streamline the workflow? Designed and implemented an automatic labeling model to streamline the workflow during the internship at KakaoStyle',
    fullDescription: 'Kakaostyle is a mid-sized e-commerce company within the Kakao Group in South Korea. As a data quality manager on the Data Science team, I analyzed model prediction data and developed dashboards to ensure the training data was well-distributed for the model. This included verifying that all items, particularly popular ones, were included in the training data and assessing how it related to page views.\n The team launched a new function in the app that allows users to check reviews based on clothing characteristics, such as fit and length, which they might consider during online shopping. To train the language model for this function, I sometimes had to label the review data, which was a time-consuming and inefficient process. One day, I proposed an automatic labeling model to my manager, giving me the opportunity to design and implement it.\n Using the BERT model, I trained the internal clothing review data with supervised learning. When you upload an unlabeled file, the model labels the sentiment as Positive, Neutral, or Negative and returns the labeled file. I also implemented a simple user interface using Streamlit. This approach proved to be very efficient, as we only needed to proofread the labeled files.',
    image: '/images/projects/labeling.png',
    technologies: ['Python', 'Streamlit'],
    topics: ['Machine Learning', 'NLP']
  },
  {
    id: 5,
    title: 'COVID-19 Data Analysis A to Z',
    year: 2021,
    description: 'What critical factors were constrained by the existing public COVID-19 data, and what strategies can we implement to enhance data accessibility and analysis?',
    fullDescription: 'After a year since the hackathon, I discovered that limited public APIs prevented thorough analysis of critical factors such as healthcare capacity and resource distribution. This realization prompted me to develop a new research project. Implementing a new dataset, the analysis proved regional healthcare inequality in South Korea’s capital-centric system. My colleagues and I assessed the effectiveness of policies, such as pandemic screening facilities and hospital bed capacity.\n Additionally, I created a policy visualization across over time and visualized mass infection data for Seoul, linking with related news articles to combat misinformation. I also suggested detailed state-level policies. Our efforts improved data visualization accessibility for the general public and developed recommendations for enhancing public health data infrastructure.\n I presented the work on International Open Data Day 2021 in Seoul, supported by Open Knowledge Foundation (International Non-Profit Organization) and the Korean Ministry of the Interior and Safety. It was meaningful to directly provide suggestions and contribute to public health data for the government. The projects were donated to the National Public Library of Korea as the first non-governmental archive.',
    image: 'https://img.youtube.com/vi/L3i_Rng3i5s/maxresdefault.jpg',
    topics: ['Data Analysis', 'Public Health', 'Social Science'],
    outcomes: ['Donated to the National Public Library of Korea'],
    links: [{ label: 'GitHub', url: 'https://github.com/Open-Knowledge-Korea/covid-19-our-memory/tree/master/covid19-atoz/topic-1'},
        {label: 'Press', url: 'https://www.nl.go.kr/EN/contents/EN10700000000.do?schFld=0&schStr=Chung&schOpt5=NLNE&schM=view&page=1&ordFld=regdt&ordBy=DESC&viewCount=9&id=42008&schBdcode=&schGroupCode='},
        {label: 'YouTube', url: 'https://www.youtube.com/watch?v=L3i_Rng3i5s&ab_channel=NIA%ED%95%9C%EA%B5%AD%EC%A7%80%EB%8A%A5%EC%A0%95%EB%B3%B4%EC%82%AC%ED%9A%8C%EC%A7%84%ED%9D%A5%EC%9B%90'},
        {label: 'Slides', url: '/slides/team135/'}
    ]
  },
  {
    id: 6,
    title: 'COVID-19: Our Memory',
    year: 2020,
    description: 'Does disaster inequality exist? How can we capture peoples mobilizing needs?',
    fullDescription: 'In the book "The Disaster Profiteers," John C. Mutter states, "While the wealthy can avoid disasters by staying away from them, the poor become trapped in poverty traps or slip even deeper into these traps." COVID-19 highlighted the issue of disaster inequality. To explore the societal impact of COVID-19, my colleagues and I participated in a hackathon that utilized public COVID-19 data. We demonstrated disaster inequality and captured the dynamic needs of individuals through COVID-19-related petition data. By employing statistical correlation analysis, text mining, and news media archiving, our data collection and analysis earned an award.',
    image: '/images/projects/covid19.png',
    images: [
        '/images/projects/covid_all_online_petitions.gif',
    ],
    topics: ['Public Health', 'NLP', 'Social Science', 'Data Analysis'],
    outcomes: ['Donated to the National Public Library of Korea'],
    links: [{label: 'Website', url: 'http://hike.cau.ac.kr/covid-19-our-memory/index-en.html'}]
  },
  {
    id: 7,
    title: 'Online Petition Analysis of South Korea',
    year: 2020,
    description: 'Based on the Structuration Theory by Giddens, will the content and subjects of the petition data will contain social multi-perspective factors?',
    fullDescription: 'It was my initial research, which involoved 3 years of online petition analysis of South Korea. Based on Giddens structuration theory, the research hypothesis states that the content and subjects of the petition data will contain social multi-perspective factors. The results revealed unresolved social issues such as cultural lags, patriarchy, and political polarization. It was meaningful since it was the first sociological approach to petition analysis and was presented at the International Postgraduate Academic Conference 2021 among Taiwanese and Japanese students.',
    image: '/images/projects/petitions.png',
    topics: ['Social Science', 'NLP', 'Data Analysis'],
    outcomes: ['Evolved into a publication accepted in PLOS ONE 2024'],
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
      <div className="min-h-screen bg-backgroundCream">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-textGrayCustom mb-4">Project Not Found</h1>
            <p className="text-textGrayCustom">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundCream">
      <Header />
      <section className="pt-32 pb-20">
        <ProjectDetailClient project={project} />
      </section>
    </div>
  );
}
