import Header from '../../../components/Header';
import ProjectDetailClient from './ProjectDetailClient';

// Projects data
const projects = [
  {
    id: 1,
    title: 'Multi-Agent Negotiation for Human-Centric Vehicle Configuration (Sim-DSE)',
    year: 2025,
    description: 'How do automated vehicles resolve passenger needs and preference? I developed a multi-agent framework where AI agents advocate for individual occupants to negotiate optimal cabin environments, bridging the gap between rigid automation and human fluidity.',
    fullDescription: 
'Autonomous vehicles handle the road, but not the room. When one passenger wants to sleep (dim lights, silence) while another works (bright lights, conference call), how should systems resolve passenger needs and preference?\n\n' +

'Multi-Agent Negotiation Framework\n\n' +

'I architected a system where each occupant is represented by an AI agent that advocates for their preferences. Using Large Language Models (LLMs), these agents negotiate optimal cabin configurations through natural language reasoning, for example: "Lower volume to 15% for sleeping Passenger A, maintain 40% for Passenger B\'s call"\n\n' +

'Three-Axis Design Space:\n' +
'• User Action: Occupant behaviors (sleeping, reading, working)\n' +
'• System Reaction: Vehicle responses (adjust seat, modify climate)\n' +
'• Reasoning: AI-generated contextual justifications\n\n' +

'Validation Strategy\n' +

'I\'m conducting dual validation: (1) Simulation experiments testing decision-making across realistic scenarios, and (2) Human alignment surveys where participants judge whether agent reasoning matches human expectations. Preliminary results show agents propose solutions via consensus.\n\n' +

'Implementation\n' +

'I am building a physical prototype integrating the Model Context Protocol (MCP) and Home Assistant to control real hardware (e.g.,lighting). This hardware-software integration validates the framework beyond simulation. Currently brainstorming and exploring Reinforcement Learning techniques such as Reinforcement Learning from Human Feedback (RLHF) to fine-tune agent behavior based on online survey data.\n\n',

    image: '/images/projects/porsche_logo.svg',
    images: [
        '/images/projects/porsche_consensus.png',
    ],
    topics: ['Decision Making', 'AI Agents'],
    technologies: ['Python', 'Autogen', 'Model Context Protocol'],
    outcomes: ['Paper will be submitted to IMWUT 2026'],
  },
  {
    id: 2,
    title: 'Preferential Bayesian Optimization (PBO)',
    year: 2024,
    description: 'Can the PBO model human preferences, suggest an optimal setting, and facilitate efficient decision-making for humans? Can biases potentially impede the efficacy of PBO? Investigated the Human factor in optimization',
    fullDescription: 'Optimizing with Subjective Preference\n\n' + 'Industrial machinery often requires tuning lots of parameters. Expert operators rely on intuition and "feel," which are difficult to quantify and require time and resources. Standard optimization algorithms fail here because there is no clear mathematical objective function to maximize.\n\n' + 'The Approach: Preferential Bayesian Optimization (PBO)\n\n' + 
    'At the Bosch Center for Artificial Intelligence (BCAI), I utilized PBO to bridge this gap. The algorithm aims to present two machine settings and simply asks: Which feels better? This pairwise feedback loop allows the AI to construct a latent utility function of the human\'s preferences, iteratively converging on the optimal setting.\n\n' + 'The Human Bias\n\n' + 'Most PBO research assumes the human is rational. I challenged this assumption. I designed experiments to test algorithmic robustness against cognitive biases.\n\n' + '• Simulating Biases: I introduced simulated experiment representing human biases into the feedback loop.\n' + '• Finding: My results demonstrated that PBO algorithms degrade significantly when the human feedback is inconsistent. This highlights a critical need for "bias-aware" acquisition functions in Human-AI collaboration.',
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
    title: 'Student Dropout Prediction (Kalman Filter)',
    year: 2023,
    description: 'How can we improve the current dropout situation in STEM classes? Kalman Filter model for early identification of students at risk of dropping out, enabling timely intervention and support strategies',
    fullDescription: 'The Problem: STEM Retention\n\n' + 
    'High dropout rates in STEM fields are a persistent issue. \n\n' + 
    'Methodology: Psychometrics + State Estimation\n\n' + 
    'As a Research Assistant at the University of Tübingen Methods Center, I developed a prediction model supported by the Ministry of Education of Baden-Württemberg.\n\n' + 
    '• Kalman Filter: I applied multivariate time-series analysis (specifically Kalman Filters) to model student engagement as an evolving trajectory rather than a fixed point.\n' + 
    '• Latent Variable Integration: The model incorporated psychometric data, latent characteristics such as ability, motivation, and stress levels derived from longitudinal questionnaires.\n\n' + 
    'Impact\n\n' + 'The system functions as an early warning, identifying at-risk students weeks before they drop out. This enables educators to deploy timely, personalized interventions.',
    image: '/images/projects/lyra.png',
    images: [
        '/images/projects/lyra_analysis.png',
    ],
    topics: ['Machine Learning', 'Data Analysis', 'Social Science'],
    links: [{ label: 'Related Paper', url: '/forecasting_intraindividual_changes_of_affective_states_taking_into_account_interindividual_differences_using_intensive_longitudinal_data_from_a_university_student_dropout_study_in_math.pdf' }]
  },
  {
    id: 4,
    title: 'Automatic Labeling Model',
    year: 2023,
    description: 'How can we streamline the workflow? Designed and implemented an automatic labeling model to streamline the workflow during the internship at KakaoStyle',
    fullDescription: 'Kakaostyle is a mid-sized e-commerce company within the Kakao Group in South Korea. As a data quality manager on the Data Science team, I analyzed model prediction data and developed dashboards to ensure the training data was well-distributed for the model. This included verifying that all items, particularly popular ones, were included in the training data and assessing how it related to page views.\n The team launched a new function in the app that allows users to check reviews based on clothing characteristics, such as fit and length, which they might consider during online shopping. To train the language model for this function, I sometimes had to label the review data, which was a time-consuming and inefficient process.\n' + '\n' + 
    'One day, I proposed an automatic labeling model to my manager, giving me the opportunity to design and implement it.\n Using the BERT model, I trained the internal clothing review data with supervised learning. When you upload an unlabeled file, the model labels the sentiment as Positive, Neutral, or Negative and returns the labeled file. I also implemented a user interface using Streamlit. This approach proved to be very efficient, as we only needed to proofread the labeled files.',
    image: '/images/projects/labeling.png',
    technologies: ['Python', 'Streamlit'],
    topics: ['Machine Learning', 'NLP']
  },
  {
    id: 5,
    title: 'COVID-19 Data Analysis A to Z',
    year: 2021,
    description: 'What critical factors were constrained by the existing public COVID-19 data, and what strategies can we implement to enhance data accessibility and analysis?',
    fullDescription: 'After a year since the hackathon, my colleagues from the information science lab and I discovered that limited public APIs prevented thorough analysis of critical factors such as healthcare capacity and resource distribution. This realization prompted me to develop a new research project.\n' + '\n' +
    'Implementing a new dataset, the analysis proved regional healthcare inequality in South Korea’s capital-centric system. We assessed the effectiveness of policies, such as pandemic screening facilities and hospital bed capacity. During COVID-19, the absence of distribution guidelines caused new screening facilities to concentrate in the capital, Seoul, reinforcing existing informational access inequalities rather than addressing regional disparities. (Image 1: The ratio of screening facilities to the population by city - Seoul and Jinju). The same result was revealed when comparing the number of hospital beds. (Image 2: The difference between the required number of hospital beds and the number available)\n' + '\n' +
    'Additionally, mass fear and misinformation were critical factors to address during the pandemic. To increase accessibility to information, I created a policy visualization across over time (Image 3) and created an interactive visualization of mass infection in Seoul, linking with related news articles (Image 4). I also suggested detailed state-level policies based on the analysis.\n' + '\n' +
    'Our efforts improved data accessibility for the general public and developed recommendations for enhancing public health data infrastructure.\n I presented the work on International Open Data Day 2021 in Seoul, supported by Open Knowledge Foundation (International Non-Profit Organization) and the Korean Ministry of the Interior and Safety. It was meaningful to directly provide suggestions and contribute to public health data for the government. The projects were donated to the National Public Library of Korea as the first non-governmental archive.',
    image: 'https://img.youtube.com/vi/L3i_Rng3i5s/maxresdefault.jpg',
    images: [
        '/images/projects/covid_screening.png',
        '/images/projects/covid_hospital.png',
        '/images/projects/covid_regulation.png',
        '/images/projects/covid_newslink.png'
    ],
    topics: ['Data Analysis', 'Public Health', 'Social Science'],
    outcomes: ['Donated to the National Public Library of Korea'],
    links: [{ label: 'GitHub', url: 'https://github.com/Open-Knowledge-Korea/covid-19-our-memory/tree/master/covid19-atoz/topic-1'},
        {label: 'Press', url: 'https://www.nl.go.kr/EN/contents/EN10700000000.do?schFld=0&schStr=Chung&schOpt5=NLNE&schM=view&page=1&ordFld=regdt&ordBy=DESC&viewCount=9&id=42008&schBdcode=&schGroupCode='},
        {label: 'YouTube Presentation (Korean)', url: 'https://www.youtube.com/watch?v=L3i_Rng3i5s&ab_channel=NIA%ED%95%9C%EA%B5%AD%EC%A7%80%EB%8A%A5%EC%A0%95%EB%B3%B4%EC%82%AC%ED%9A%8C%EC%A7%84%ED%9D%A5%EC%9B%90'},
        {label: 'Slides (Korean)', url: '/slides/team135/'}
    ]
  },
  {
    id: 6,
    title: 'COVID-19: Our Memory',
    year: 2020,
    description: 'Does disaster inequality exist? How can we capture peoples mobilizing needs?',
    fullDescription: 'In the book "The Disaster Profiteers," John C. Mutter states, "While the wealthy can avoid disasters by staying away from them, the poor become trapped in poverty traps or slip even deeper into these traps." COVID-19 highlighted the issue of disaster inequality. To explore the societal impact of COVID-19, my colleagues from the information science lab and I participated in a hackathon that utilized public COVID-19 data. We demonstrated disaster inequality and captured the dynamic needs of individuals through COVID-19-related petition data, by employing statistical correlation analysis, text mining (Image 1), and news media archiving. Our data collection and analysis earned an award.',
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
    description: 'Will the content and subjects of the petition data will contain social multi-perspective factors? If so, what are they?',
    fullDescription: 'It was my initial research, which involoved 3 years of online petition analysis of South Korea including ongoing petitions from the past 3 years. Based on Giddens structuration theory, the research hypothesis states that the content and subjects of the petition data will contain social multi-perspective factors. The results revealed unresolved social issues such as cultural lags, patriarchy, and political polarization in South Korea. It was meaningful since it was the first sociological approach to petition analysis and was presented at the International Postgraduate Academic Conference 2021 among Taiwanese and Japanese students.\n' + '\n' +
    'Furthermore, it was my first experience working with large-scale data, scraping the data, creating the database and conducting NLP techniques. The real-world data was messy and unstructured, which was challenging yet rewarding to work with. I learned how to design the database, preprocess the data, and extract meaningful insights from it. This experience sparked my interest in data science and motivated me to pursue further studies in this field.',
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
