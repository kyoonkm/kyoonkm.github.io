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

'I architected a system where each occupant is represented by an AI agent that advocates for their preferences. Using Large Language Models (LLMs), these agents negotiate optimal cabin configurations through natural language reasoning, for example: "Lower volume to 15% for sleeping Passenger A, maintain ambient lighting for reading Passenger B"\n\n' +

'Three-Axis Design Space:\n' +

'• User Action: Occupant behaviors (sleeping, reading, working)\n' +

'• System Reaction: Vehicle responses (adjust seat, modify climate)\n' +

'• Reasoning: AI-generated contextual justifications\n\n' +

'Validation Strategy\n' +

'I conducted two-step validation: (1) simulation experiments that tested decision-making in realistic scenarios, and (2) human alignment surveys where participants judge whether the agents’ reasoning aligned with human expectations. The results indicated that the agents proposed reasonable solutions through consensus, with 96% of scenarios accepted by the participants.\n\n' +

'Validated Rationale Analysis\n' +

'I developed an NLP pipeline to analyze rationale that users agreed on. I parsed responses into context, setting, and rationale, extracted normalized verb-object phrases from rationales, and clustered them semantically using sentence embeddings and BERTopic. By weighting frequent phrases and filtering generic preference language, I identified the underlying contextual factors (Figure 2).\n\n' +

'Contextual Inquiry (Field Test)\n' +

'For real-world, field-test oriented application, I trained a compact in-car decision model in three stages. First, I performed supervised fine-tuning on scenarios that participants accepted (“Yes”) to teach the model to generate structured cabin settings with clear rationales. Next, I applied a Chain-of-Hindsight–style revision step using disagreed (“No”) feedback to learn targeted corrections, and finally used KTO preference alignment on balanced Yes/No labels to shift the model toward outputs that match human acceptability. To evaluate performance, I conducted a field test with interaction design experts at Porsche.\n\n',

    image: '/images/projects/porsche_logo.svg',
    images: [
        '/images/projects/porsche_consensus.png',
        '/images/projects/reasoning_cluster.pdf',
    ],
    topics: ['Decision Making', 'AI Agents', 'Social Simulation', 'NLP'],
    technologies: ['Python', 'Autogen', 'Model Context Protocol'],
    outcomes: ['Paper will be submitted to UIST 2026'],
  },
  {
    id: 2,
    title: 'Preferential Bayesian Optimization (PBO)',
    year: 2024,
    description: 'Can the PBO model human preferences, suggest an optimal setting, and facilitate efficient decision-making for humans? Can biases potentially impede the efficacy of PBO? Investigated the Human factor in optimization',
    fullDescription: 'Optimizing with Subjective Preference\n\n' + 'Industrial machinery often requires tuning lots of parameters. Expert operators rely on intuition and "feel," which are difficult to quantify and require time and resources. Standard optimization algorithms fail here because there is no clear mathematical objective function to maximize.\n\n' + 'The Approach: Preferential Bayesian Optimization (PBO)\n\n' + 
    'At the Bosch Center for Artificial Intelligence (BCAI), I utilized PBO to bridge this gap. The algorithm aims to present two machine settings and simply asks: Which feels better? This pairwise feedback loop allows the AI to construct a latent utility function of the human\'s preferences, iteratively converging on the optimal setting.\n\n' + 'The Human Bias\n\n' + 'Most PBO research assumes the human is rational. I challenged this assumption. I designed experiments to test algorithmic robustness against cognitive biases.\n\n' + '• Simulating Biases: I introduced simulated experiment representing human biases into the feedback loop.\n' 
    + '• Finding: My results demonstrated that PBO algorithms degrade significantly when the human feedback is inconsistent. This highlights a critical need for "bias-aware" acquisition functions in Human-AI collaboration.',
    image: '/images/projects/forrester_loop.png',
    images: [
        '/images/projects/3_2_bosch_use_case_best.png',
        '/images/projects/3_6d_ackley_regret_bias.png',
        '/images/projects/3_ackley_bias.png',
    ],
    topics: ['Decision Making', 'Machine Learning', 'Data Analysis'],
    technologies: ['Python', 'BoTorch'],
    links: [{ label: 'Paper', url: '/pbo.pdf' },
      {label: 'Slides', url: 'https://docs.google.com/presentation/d/11JYZppfOevN_nZ8ZwXHcLriLgCKFmFgtKankOOoUSXw/edit?usp=sharing'}
    ]
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
    links: [{ label: 'Related Paper', url: '/forecasting_intraindividual_changes_of_affective_states_taking_into_account_interindividual_differences_using_intensive_longitudinal_data_from_a_university_student_dropout_study_in_math.pdf'}]
  },
  {
    id: 4,
    title: 'Automatic Labeling Model',
    year: 2023,
    description: 'How can we streamline the workflow? Designed and implemented an automatic labeling model to streamline the workflow during the internship at KakaoStyle',
    fullDescription: 'The Operational Bottleneck\n\n' +
'KakaoStyle, a leading South Korean e-commerce platform, launched a new feature allowing users to filter reviews by specific clothing attributes like "Fit" and "Length." However, training the underlying model required thousands of labeled reviews. The Data Science team was bogged down by manual data labeling, creating an inefficiency in the product development lifecycle.\n\n' +
'The Automated Solution\n\n' +
'I identified this workflow gap and engineered an automated labeling pipeline to replace the manual process. I fine-tuned a BERT model on internal review datasets, training it to classify both general sentiment (Positive/Neutral/Negative) and domain-specific attributes (e.g., "True to size").\n\n' +
'Deployment & Tooling\n\n' +
'To make this accessible, I wrapped the model in a web interface using Streamlit. This allowed stakeholders to simply upload a raw CSV and receive a fully labeled dataset. The tool transformed the workflow from manual tagging to rapid verification.',
    image: '/images/projects/labeling.png',
    technologies: ['Python', 'Streamlit'],
    topics: ['Machine Learning', 'NLP']
  },
  {
    id: 5,
    title: 'COVID-19 Data Analysis A to Z',
    year: 2021,
    description: 'What critical factors were constrained by the existing public COVID-19 data, and what strategies can we implement to enhance data accessibility and analysis?',
    fullDescription: 'The "Data Gap" in Public Health\n\n' + 'During the height of the pandemic, public attention was focused on infection rates, but the underlying infrastructure remained opaque. My team discovered that limited public APIs prevented critical analysis of healthcare capacity. We initiated a project to scrape and analyze alternative datasets to audit the government\'s response.\n\n' + 'Revealing Regional Inequality\n\n' + 'Our analysis exposed a severe capital-centric bias in South Korea\'s healthcare system. By mapping the ratio of screening facilities and hospital beds to local populations, we demonstrated that resources were disproportionately concentrated in Seoul. We visualized these findings using interactive maps, proving that the lack of distribution guidelines was reinforcing existing inequalities.\n\n' + 'Combatting Misinformation\n\n' + 'Beyond infrastructure, we addressed the "infodemic." I developed a visualization of policy changes and an interactive map tracing mass infection clusters to their media coverage. These tools provided the public with a clear, fact-based timeline of the crisis.\n\n' + 'Policy Impact\n\n' + 'This work went beyond academic analysis. I presented our policy recommendations at International Open Data Day 2021, supported by the Open Knowledge Foundation and the Ministry of the Interior and Safety. Recognizing its value as a digital record of the crisis, the project was officially donated to the National Public Library of Korea, becoming its first non-governmental digital archive entry.',
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
    fullDescription: 'The Sociology of Disaster\n\n' + 'Disasters are not great levelers; they often exacerbate existing divides. Motivated by the sociological concept of "disaster inequality," my team sought to capture the real-time mobilizing needs of the South Korean public during the early onset of COVID-19.\n\n' 
    + 'Methodology: Statistical correlation analysis, Text mining (Image 1), and News media archiving\n\n' + 'We participated in a national hackathon, building a pipeline to analyze public discourse. By collecting petition data, using text mining analysis (e.g., word cloud - Image 1), conducting statistical correlation analysis, and archiving news media, we identified which demographics expressed their distress and how.\n\n' 
    + 'Outcome\n\n' + 'The analysis provided quantitative evidence of the "poverty trap" John C. Mutter describes, showing how certain demographics expressed distinct, urgent survival needs. Our data collection methodology was recognized with an award for its ability to capture the dynamic.',
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
    description: 'A three-year analysis of national petitions mapping the "unresolved" social conflicts of South Korea. This study applied Giddens\' Structuration Theory to NLP analysis, evolving into a published paper',
    fullDescription: 'Research Question\n\n' + 'Do online petitions merely serve as a vent for temporary frustration, or do they reflect deep-seated structural societal fractures? This project initiated my transition from sociology to computational social science, driven by the desire to quantify public grievance.\n\n' 
    + 'Theoretical Framework & Methodology\n\n' + 'I curated a dataset of online petitions from the South Korean presidential website spanning three years (2017–2020). Grounded in Anthony Giddens\' Structuration Theory, I hypothesized that the semantic content of these petitions would mirror social structures and issues such as cultural lags: areas where social reality moves faster than institutional law.\n\n' + 'Key Insights\n\n' + 'Using Natural Language Processing (NLP), I mapped the landscape of Korean social conflict. The results revealed that digital petitions were not random noise but structured responses to specific systemic failures: predominantly digital sex crimes, patriarchy, and political polarization. Comparing the petition contents with those of the White House E-petition, We the People, revealed cultural differences.\n\n' 
    + 'Academic Evolution\n\n' + 'What began as a student research project involving messy, unstructured data scraping evolved into an academic contribution. I refined the methodology over several years, leading to a presentation at the International Postgraduate Academic Conference 2021 and eventual publication in the journal PLOS ONE in 2024.',
    image: '/images/projects/petitions.png',
    topics: ['Social Science', 'NLP', 'Data Analysis'],
    outcomes: ['Evolved into a publication accepted in PLOS ONE 2024'],
    links: [{label: 'Slides (English)', url: 'https://docs.google.com/presentation/d/1KmKsndiEqIGVuV73TBdGs2_e9RDkGUIh/edit?usp=sharing&ouid=107424392698532184399&rtpof=true&sd=true'}]
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
