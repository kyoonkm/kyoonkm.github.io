/**
 * Single source of truth for projects.
 *
 * The index (app/projects) and the detail route (app/projects/[id]) both read
 * this array. They used to keep separate copies, which drifted: a card read
 * "Sim-DSE" and opened a page titled "Multi-Agent Negotiation for
 * Human-Centric Vehicle Configuration", and the same work was dated 2025 here
 * and 2026 in data/research-graph.ts.
 *
 * `areas` matches the three areas of the hero graph, so the index filter and
 * the graph speak one taxonomy instead of two.
 */

import type { AreaId } from "@/data/research-graph";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  /** Full title. Must match the graph node and the detail page heading. */
  title: string;
  year: number;
  /** One reader-facing question, ~12 words. This is the index line. */
  question: string;
  /** Where the work was done. The index shows this when there is no outcome. */
  context?: string;
  /** The credential an academic reader ranks by. Index shows the first. */
  outcomes?: string[];
  status: "In progress" | "Completed";
  areas: AreaId[];
  /** Longer lede, used at the top of the detail page. */
  summary: string;
  fullDescription?: string;
  /** Detail-page hero. */
  image?: string;
  /** 480px-wide index thumbnail. Omit when no honest figure exists. */
  thumb?: string;
  images?: string[];
  technologies?: string[];
  links?: ProjectLink[];
}

export const PROJECTS: Project[] = [
  {
    id: 9,
    title: "HALLMARK: Diagnosing Three Failure Modes in LLM Citation Verifiers",
    year: 2026,
    question:
      "When a verifier misses a fabricated citation, which kind of fabrication does it miss?",
    context: "ELLIS Institute Tübingen",
    outcomes: ["Manuscript in preparation for ICLR 2027"],
    status: "In progress",
    areas: ["ai"],
    summary:
      "A benchmark for citation-hallucination detection: 2,526 annotated references across 14 hallucination types and three difficulty tiers, scored against 19 baseline variants. My part was the model sweep and the diagnosis of where it breaks.",
    fullDescription:
      'Why a benchmark\n\n' +
      'The NeurIPS 2025 incident — 53 papers found to contain fabricated citations that had passed peer review — exposed a gap: there was no standard way to measure how well a tool detects a hallucinated reference. HALLMARK is that measurement. 2,526 annotated entries, 14 hallucination types across three difficulty tiers, six sub-tests per entry (DOI resolution, title matching, author consistency, venue verification, field completeness, cross-database agreement), and 19 baseline variants from a DOI-only check to agentic LLMs with tool use.\n\n' +
      'Cascade runs beyond the default model\n\n' +
      'The headline result is a two-stage cascade: a database lookup first, then an LLM that diagnoses whatever the database could not resolve. Run on one model family that result is an anecdote, so I ran the cascade on GPT-5.1 and GPT-5.4 alongside the Claude Sonnet configuration, across the dev, test and stress splits. Per-type detection rates (Figure 1) are what the comparison is for: the aggregate numbers sit close together while the failures do not, and the types where a model collapses differ by model.\n\n' +
      'Where the task stops working\n\n' +
      'I ran the verification task down the Qwen3 parameter range — 4B, 8B, 14B, 32B — to find where citation verification stops being viable rather than assuming a frontier model is required. The question is a deployment one: a screening tool that has to run over every reference in every submission cannot afford the top of the cost curve.\n\n' +
      'GEPA prompt optimization\n\n' +
      'Rather than hand-tuning the zero-shot verification prompt, I optimised it with GEPA, using a small model as the task LM and a larger one for reflection, scored on a stratified 50-entry training sample with a disjoint 200-entry validation set. The metric is deliberately blunt — the label is right or it is not, and an UNCERTAIN verdict scores zero — because a verifier that hedges is a verifier a human still has to check.\n\n' +
      'Multi-defect analysis\n\n' +
      'Real fabricated references usually have several things wrong at once: a real DOI, a wrong title, invented authors. The scorer only compares labels, so a tool gets full credit for catching any one defect. I measured how much of the benchmark is multi-defect and what the metrics actually reward there, because that gap between "flagged it" and "understood it" is the difference between a screening tool and a diagnosis.',
    image: "/images/projects/hallmark_per_type.webp",
    thumb: "/images/projects/thumbs/hallmark_per_type.webp",
    technologies: ["Python", "GEPA", "OpenRouter"],
    links: [
      { label: "GitHub", url: "https://github.com/rpatrik96/hallmark" },
      {
        label: "Interactive companion",
        url: "https://rpatrik96.github.io/hallmark/",
      },
    ],
  },
  {
    id: 1,
    title:
      "Multi-Agent Negotiation for Human-Centric Vehicle Configuration (Sim-DSE)",
    year: 2026,
    question: "How do automated vehicles resolve conflicting passenger needs?",
    context: "Porsche Human-Centered AI Research",
    outcomes: ["Submitted to AutoUI 2026"],
    status: "In progress",
    areas: ["ai", "decisions"],
    summary:
      "A multi-agent framework where an AI agent advocates for each occupant and negotiates the cabin environment, bridging the gap between rigid automation and human fluidity.",
    fullDescription:
      'Autonomous vehicles handle the road, but not the room. When one passenger wants to sleep (dim lights, silence) while another works (bright lights, conference call), how should systems resolve passenger needs and preference?\n\n' +
      '- Multi-Agent Negotiation Framework\n' +
      'I architected a system where each occupant is represented by an AI agent that advocates for their preferences. Using Large Language Models (LLMs), these agents negotiate optimal cabin configurations through natural language reasoning, for example: "Lower volume to 15% for sleeping Passenger A, maintain ambient lighting for reading Passenger B"\n\n' +
      '- Three-Axis Design Space:\n' +
      '• User Action: Occupant behaviors (sleeping, reading, working)\n' +
      '• System Reaction: Vehicle responses (adjust seat, modify climate)\n' +
      '• Reasoning: AI-generated contextual justifications\n\n' +
      '- Validation Strategy\n' +
      'I conducted two-step validation: (1) simulation experiments that tested decision-making in realistic scenarios, and (2) human alignment surveys where participants judge whether the agents’ reasoning aligned with human expectations. The results indicated that the agents proposed reasonable solutions through consensus, with 96% of scenarios accepted by the participants.\n\n' +
      '- Validated Rationale Analysis\n' +
      'I developed an NLP pipeline to analyze rationale that users agreed on. I parsed responses into context, setting, and rationale, extracted normalized verb-object phrases from rationales, and clustered them semantically using sentence embeddings and BERTopic. By weighting frequent phrases and filtering generic preference language, I identified the underlying contextual factors (Figure 2).\n\n' +
      '- Contextual Inquiry (Field Test)\n' +
      'For real-world, field-test oriented application, I trained a compact in-car decision model in three stages. First, I performed supervised fine-tuning on scenarios that participants accepted (“Yes”) to teach the model to generate structured cabin settings with clear rationales. Next, I applied a Chain-of-Hindsight–style revision step using disagreed (“No”) feedback to learn targeted corrections, and finally used KTO preference alignment on balanced Yes/No labels to shift the model toward outputs that match human acceptability. To evaluate performance, I conducted a field test with interaction design experts at Porsche.',
    image: "/images/projects/reasoning_cluster.webp",
    thumb: "/images/projects/thumbs/reasoning_cluster.webp",
    images: [
      "/images/projects/porsche_question.webp",
      "/images/projects/porsche_consensus.webp",
    ],
    technologies: ["Python", "Autogen", "Model Context Protocol"],
    links: [
      {
        label: "Slides",
        url: "https://docs.google.com/presentation/d/11icBSOa2cB54j50gHfyy2_zW2EXgIT9zrvkm9vqrVJM/edit?usp=sharing",
      },
    ],
  },
  {
    id: 2,
    title: "Preferential Bayesian Optimization (PBO)",
    year: 2024,
    question:
      "Can preference learning model an expert's intuition, and does bias break it?",
    context: "Bosch Center for Artificial Intelligence",
    status: "Completed",
    areas: ["ai", "decisions"],
    summary:
      "Preferential Bayesian Optimization learns a latent utility function from pairwise human judgements. I tested what happens to it when the human is not rational.",
    fullDescription:
      'Optimizing with Subjective Preference\n\n' +
      'Industrial machinery often requires tuning lots of parameters. Expert operators rely on intuition and "feel," which are difficult to quantify and require time and resources. Standard optimization algorithms fail here because there is no clear mathematical objective function to maximize.\n\n' +
      'The Approach: Preferential Bayesian Optimization (PBO)\n\n' +
      'At the Bosch Center for Artificial Intelligence (BCAI), I utilized PBO to bridge this gap. The algorithm aims to present two machine settings and simply asks: Which feels better? This pairwise feedback loop allows the AI to construct a latent utility function of the human\'s preferences, iteratively converging on the optimal setting.\n\n' +
      'The Human Bias\n\n' +
      'Most PBO research assumes the human is rational. I challenged this assumption. I designed experiments to test algorithmic robustness against cognitive biases.\n\n' +
      '• Simulating Biases: I introduced simulated experiment representing human biases into the feedback loop.\n' +
      '• Finding: My results demonstrated that PBO algorithms degrade significantly when the human feedback is inconsistent. This highlights a critical need for "bias-aware" acquisition functions in Human-AI collaboration.',
    image: "/images/projects/forrester_loop.webp",
    thumb: "/images/projects/thumbs/forrester_loop.webp",
    images: [
      "/images/projects/3_2_bosch_use_case_best.webp",
      "/images/projects/3_6d_ackley_regret_bias.webp",
      "/images/projects/3_ackley_bias.webp",
    ],
    technologies: ["Python", "BoTorch"],
    links: [
      { label: "Paper", url: "/pbo.pdf" },
      {
        label: "Slides",
        url: "https://docs.google.com/presentation/d/11JYZppfOevN_nZ8ZwXHcLriLgCKFmFgtKankOOoUSXw/edit?usp=sharing",
      },
    ],
  },
  {
    id: 3,
    title: "Student Dropout Prediction (Kalman Filter)",
    year: 2023,
    question:
      "Can we flag STEM students at risk of dropping out early enough to act?",
    context: "University of Tübingen Methods Center",
    status: "Completed",
    areas: ["society", "ai"],
    summary:
      "A Kalman filter models student engagement as an evolving trajectory rather than a fixed point, identifying at-risk students weeks before they drop out.",
    fullDescription:
      'The Problem: STEM Retention\n\n' +
      'High dropout rates in STEM fields are a persistent issue.\n\n' +
      'Methodology: Psychometrics + State Estimation\n\n' +
      'As a Research Assistant at the University of Tübingen Methods Center, I developed a prediction model supported by the Ministry of Education of Baden-Württemberg.\n\n' +
      '• Kalman Filter: I applied multivariate time-series analysis (specifically Kalman Filters) to model student engagement as an evolving trajectory rather than a fixed point.\n' +
      '• Latent Variable Integration: The model incorporated psychometric data, latent characteristics such as ability, motivation, and stress levels derived from longitudinal questionnaires.\n\n' +
      'Impact\n\n' +
      'The system functions as an early warning, identifying at-risk students weeks before they drop out. This enables educators to deploy timely, personalized interventions.',
    image: "/images/projects/lyra_analysis.webp",
    thumb: "/images/projects/thumbs/lyra_analysis.webp",
    links: [
      {
        label: "Related Paper",
        url: "/forecasting_intraindividual_changes_of_affective_states_taking_into_account_interindividual_differences_using_intensive_longitudinal_data_from_a_university_student_dropout_study_in_math.pdf",
      },
    ],
  },
  {
    id: 4,
    title: "Automatic Labeling Model",
    year: 2023,
    question:
      "Can a fine-tuned classifier replace manual annotation in a review pipeline?",
    context: "KakaoStyle internship",
    status: "Completed",
    areas: ["ai"],
    summary:
      "An automated labeling pipeline that replaced the Data Science team's manual review tagging, wrapped in a tool stakeholders could run themselves.",
    fullDescription:
      'The Operational Bottleneck\n\n' +
      'KakaoStyle, a leading South Korean e-commerce platform, launched a new feature allowing users to filter reviews by specific clothing attributes like "Fit" and "Length." However, training the underlying model required thousands of labeled reviews. The Data Science team was bogged down by manual data labeling, creating an inefficiency in the product development lifecycle.\n\n' +
      'The Automated Solution\n\n' +
      'I identified this workflow gap and engineered an automated labeling pipeline to replace the manual process. I fine-tuned a BERT model on internal review datasets, training it to classify both general sentiment (Positive/Neutral/Negative) and domain-specific attributes (e.g., "True to size").\n\n' +
      'Deployment & Tooling\n\n' +
      'To make this accessible, I wrapped the model in a web interface using Streamlit. This allowed stakeholders to simply upload a raw CSV and receive a fully labeled dataset. The tool transformed the workflow from manual tagging to rapid verification.',
    image: "/images/projects/labeling.webp",
    thumb: "/images/projects/thumbs/labeling.webp",
    technologies: ["Python", "Streamlit"],
  },
  {
    id: 5,
    title: "COVID-19 Data Analysis A to Z",
    year: 2021,
    question:
      "What does public COVID-19 data leave out, and what does that omission cost?",
    outcomes: ["Donated to the National Public Library of Korea"],
    context: "International Open Data Day 2021",
    status: "Completed",
    areas: ["society", "decisions"],
    summary:
      "Scraping and mapping alternative datasets exposed a capital-centric bias in South Korea's healthcare capacity, and traced infection clusters to their media coverage.",
    fullDescription:
      'The "Data Gap" in Public Health\n\n' +
      'During the height of the pandemic, public attention was focused on infection rates, but the underlying infrastructure remained opaque. My team discovered that limited public APIs prevented critical analysis of healthcare capacity. We initiated a project to scrape and analyze alternative datasets to audit the government\'s response.\n\n' +
      'Revealing Regional Inequality\n\n' +
      'Our analysis exposed a severe capital-centric bias in South Korea\'s healthcare system. By mapping the ratio of screening facilities and hospital beds to local populations, we demonstrated that resources were disproportionately concentrated in Seoul. We visualized these findings using interactive maps, proving that the lack of distribution guidelines was reinforcing existing inequalities.\n\n' +
      'Combatting Misinformation\n\n' +
      'Beyond infrastructure, we addressed the "infodemic." I developed a visualization of policy changes and an interactive map tracing mass infection clusters to their media coverage. These tools provided the public with a clear, fact-based timeline of the crisis.\n\n' +
      'Policy Impact\n\n' +
      'This work went beyond academic analysis. I presented our policy recommendations at International Open Data Day 2021, supported by the Open Knowledge Foundation and the Ministry of the Interior and Safety. Recognizing its value as a digital record of the crisis, the project was officially donated to the National Public Library of Korea, becoming its first non-governmental digital archive entry.',
    image: "/images/projects/covid_screening.webp",
    thumb: "/images/projects/thumbs/covid_screening.webp",
    images: [
      "/images/projects/covid_hospital.webp",
      "/images/projects/covid_regulation.webp",
      "/images/projects/covid_newslink.webp",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Open-Knowledge-Korea/covid-19-our-memory/tree/master/covid19-atoz/topic-1",
      },
      {
        label: "Press",
        url: "https://www.nl.go.kr/EN/contents/EN10700000000.do?schFld=0&schStr=Chung&schOpt5=NLNE&schM=view&page=1&ordFld=regdt&ordBy=DESC&viewCount=9&id=42008&schBdcode=&schGroupCode=",
      },
      {
        label: "YouTube presentation (Korean)",
        url: "https://www.youtube.com/watch?v=L3i_Rng3i5s&ab_channel=NIA%ED%95%9C%EA%B5%AD%EC%A7%80%EB%8A%A5%EC%A0%95%EB%B3%B4%EC%82%AC%ED%9A%8C%EC%A7%84%ED%9D%A5%EC%9B%90",
      },
      { label: "Slides (Korean)", url: "/slides/team135/" },
    ],
  },
  {
    id: 6,
    title: "COVID-19: Our Memory",
    year: 2020,
    question:
      "Does disaster inequality exist, and can we capture what people mobilise for?",
    outcomes: ["Donated to the National Public Library of Korea"],
    status: "Completed",
    areas: ["society"],
    summary:
      "Text mining, correlation analysis and news archiving on early-pandemic public discourse, to find which demographics expressed distress and how.",
    fullDescription:
      'The Sociology of Disaster\n\n' +
      'Disasters are not great levelers; they often exacerbate existing divides. Motivated by the sociological concept of "disaster inequality," my team sought to capture the real-time mobilizing needs of the South Korean public during the early onset of COVID-19.\n\n' +
      'Methodology: Statistical correlation analysis, Text mining (Image 1), and News media archiving\n\n' +
      'We participated in a national hackathon, building a pipeline to analyze public discourse. By collecting petition data, using text mining analysis (e.g., word cloud - Image 1), conducting statistical correlation analysis, and archiving news media, we identified which demographics expressed their distress and how.\n\n' +
      'Outcome\n\n' +
      'The analysis provided quantitative evidence of the "poverty trap" John C. Mutter describes, showing how certain demographics expressed distinct, urgent survival needs. Our data collection methodology was recognized with an award for its ability to capture the dynamic.',
    image: "/images/projects/covid19.webp",
    thumb: "/images/projects/thumbs/covid19.webp",
    images: ["/images/projects/covid_all_online_petitions.gif"],
    links: [
      {
        label: "Website",
        url: "http://hike.cau.ac.kr/covid-19-our-memory/index-en.html",
      },
    ],
  },
  {
    id: 7,
    title: "Online Petition Analysis of South Korea",
    year: 2020,
    question:
      "Do national petitions vent frustration, or map structural social conflict?",
    outcomes: ["Published in PLOS ONE, 2024"],
    status: "Completed",
    areas: ["society"],
    summary:
      "Three years of national petitions read through Giddens' structuration theory, using NLP to map where social reality moves faster than institutional law.",
    fullDescription:
      'Research Question\n\n' +
      'Do online petitions merely serve as a vent for temporary frustration, or do they reflect deep-seated structural societal fractures? This project initiated my transition from sociology to computational social science, driven by the desire to quantify public grievance.\n\n' +
      'Theoretical Framework & Methodology\n\n' +
      'I curated a dataset of online petitions from the South Korean presidential website spanning three years (2017–2020). Grounded in Anthony Giddens\' Structuration Theory, I hypothesized that the semantic content of these petitions would mirror social structures and issues such as cultural lags: areas where social reality moves faster than institutional law.\n\n' +
      'Key Insights\n\n' +
      'Using Natural Language Processing (NLP), I mapped the landscape of Korean social conflict. The results revealed that digital petitions were not random noise but structured responses to specific systemic failures: predominantly digital sex crimes, patriarchy, and political polarization. Comparing the petition contents with those of the White House E-petition, We the People, revealed cultural differences.\n\n' +
      'Academic Evolution\n\n' +
      'What began as a student research project involving messy, unstructured data scraping evolved into an academic contribution. I refined the methodology over several years, leading to a presentation at the International Postgraduate Academic Conference 2021 and eventual publication in the journal PLOS ONE in 2024.',
    image: "/images/projects/petitions.webp",
    thumb: "/images/projects/thumbs/petitions.webp",
    links: [
      {
        label: "Slides (English)",
        url: "https://docs.google.com/presentation/d/1KmKsndiEqIGVuV73TBdGs2_e9RDkGUIh/edit?usp=sharing&ouid=107424392698532184399&rtpof=true&sd=true",
      },
    ],
  },
  {
    id: 8,
    title: "Recommender Systems for Human Decision-Making",
    year: 2021,
    question:
      "Working through the standard recommender algorithms, one implementation at a time.",
    context: "Internship study project",
    status: "Completed",
    areas: ["decisions"],
    /* A small study project. It used to claim it evaluated whether recommenders
       "improve the choice rather than the click", which is a research finding
       this work does not have; the repository is the honest artefact. */
    summary:
      "Implementations of the standard recommendation algorithms, each paired with a review of the paper it comes from. Written up during an internship.",
    links: [
      { label: "GitHub", url: "https://github.com/kyoonkm/2021-RecSys" },
    ],
  },
];

export const PROJECTS_BY_YEAR = [...PROJECTS].sort((a, b) => b.year - a.year);

export function projectById(id: number): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
