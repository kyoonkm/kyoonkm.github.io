/**
 * Research-network data for the hero graph.
 *
 * Ported from docs/prototypes/research-map.html, with the sample projects
 * replaced by real work from CV_Kayoon_Kim.pdf (last updated 3 Sep 2026).
 *
 * Constraints enforced by lib/research-graph-layout.ts#validateGraphData:
 *   - ids unique; every area/method id referenced must exist
 *   - every method is used by at least one work
 *   - `short` is at most 18 characters
 *   - at most 15 works and at most 10 methods
 */

export type AreaId = "society" | "ai" | "decisions";

export type WorkType =
  | "Journal article"
  | "Manuscript"
  | "Work in progress"
  | "Poster"
  | "Project";

export interface Area {
  id: AreaId;
  label: string;
  blurb: string;
  /** World coordinates inside the viewBox (480..1220 x 10..660). */
  x: number;
  y: number;
  labelSide: "above" | "below";
}

export interface Method {
  id: string;
  /** Lowercase unless a proper noun. */
  label: string;
}

/**
 * One name in a byline. `self` is the reader's fastest scan target on an
 * academic page, so it is marked in the data rather than matched by string
 * comparison at render time.
 */
export interface Author {
  name: string;
  /** Kayoon. Rendered at full ink and 600 weight. */
  self?: boolean;
  /** Shared first authorship. Renders the asterisk and the adjacent note. */
  equal?: boolean;
}

export interface Work {
  id: string;
  title: string;
  /** At most 18 characters: this is the in-graph label. */
  short: string;
  year: number;
  type: WorkType;
  areas: AreaId[];
  methods?: string[];
  /**
   * Where the work appeared. Omit when the work has no venue — `type` already
   * carries "Project" and "Manuscript"; never restate the type here.
   */
  venue?: string;
  /**
   * Review state, when it is not already implied by `type`. Kept separate from
   * `venue` so /publications can render "where" and "how far along" as two
   * different facts; folding a status into `venue` is what made the old page
   * print "Manuscript" directly above "Manuscript in preparation".
   */
  status?: string;
  /**
   * The byline, in order. Optional because the Project entries on /projects
   * are not citations and carry no published authorship.
   */
  authors?: Author[];
  /** Bare DOI, no resolver prefix — the page builds the https://doi.org URL. */
  doi?: string;
  /** ISO date of record publication. Rendered as a human date. */
  published?: string;
  /** Always labelled in the graph. Aim for 3–5. */
  featured?: boolean;
  /** At most 140 characters. */
  summary: string;
  href: string;
  sample?: boolean;
}

export const AREAS: Area[] = [
  {
    id: "society",
    label: "Society",
    x: 665,
    y: 130,
    labelSide: "above",
    blurb:
      "Sociology and computational social science: how people voice grievances, mobilise, and settle on shared norms.",
  },
  {
    id: "ai",
    label: "AI agents & ML",
    x: 1065,
    y: 245,
    labelSide: "above",
    blurb:
      "LLM agents, preference learning, and testing whether AI systems can actually be trusted.",
  },
  {
    id: "decisions",
    label: "Human decisions",
    x: 865,
    y: 540,
    labelSide: "below",
    blurb:
      "HCI and decision support: tools that help people choose well, alone and together.",
  },
];

export const METHODS: Method[] = [
  { id: "llm", label: "LLMs" },
  { id: "sim", label: "multi-agent simulation" },
  { id: "nlp", label: "NLP" },
  { id: "text", label: "text mining" },
  { id: "survey", label: "surveys" },
  { id: "interviews", label: "interviews" },
  { id: "bo", label: "Bayesian opt." },
  { id: "stats", label: "statistical modelling" },
  { id: "eval", label: "benchmarking" },
];

export const WORKS: Work[] = [
  {
    id: "agent-norms",
    title:
      "Four Passengers, One Decision: How LLM Agents Negotiate and Form Norms in a Shared Car",
    short: "Agent norms",
    year: 2026,
    type: "Poster",
    areas: ["society", "ai", "decisions"],
    methods: ["llm", "sim", "survey"],
    venue: "NeurIPS 2026 Social Agents Workshop",
    status: "Under review",
    authors: [{ name: "Kayoon Kim", self: true }],
    featured: true,
    summary:
      "LLM agents advocating for four passengers negotiate cabin settings, and settle on norms none of them held alone.",
    href: "/publications#agent-norms",
  },
  {
    id: "design-ai",
    title:
      "Between Plausible and Viable: How Designers and Their Managers Rework Around AI That Performs It",
    short: "AI in organization",
    year: 2026,
    type: "Work in progress",
    areas: ["society", "decisions"],
    methods: ["interviews"],
    authors: [
      { name: "Kayoon Kim", self: true },
      { name: "Jan Henry Belz" },
      { name: "Hirokazu Shirado" },
    ],
    featured: true,
    summary:
      "Interviews with designers and their managers on how design work is redistributed once AI can do part of it.",
    href: "/publications#design-ai",
  },
  {
    id: "hallmark",
    title:
      "HALLMARK: Diagnosing Three Failure Modes in LLM Citation Verifiers",
    short: "HALLMARK",
    year: 2026,
    type: "Manuscript",
    areas: ["ai"],
    methods: ["llm", "eval"],
    venue: "ICLR 2027",
    status: "Under review",
    authors: [
      { name: "Kayoon Kim", self: true },
      { name: "Wieland Brendel" },
      { name: "Patrik Reizinger" },
    ],
    featured: true,
    summary:
      "Separates three distinct ways automated citation verifiers fail, and benchmarks models against each of them.",
    href: "/publications#hallmark",
  },
  {
    id: "sim-dse",
    title:
      "Sim-DSE: Mediating Multi-User Automations in Cars through Simulation-Augmented Decision Space Exploration",
    short: "Sim-DSE",
    year: 2026,
    type: "Poster",
    areas: ["ai", "decisions"],
    methods: ["sim", "survey"],
    venue: "AutomotiveUI 2026 Adjunct (Works in Progress), 94–99",
    authors: [
      { name: "Jan Henry Belz", equal: true },
      { name: "Kayoon Kim", self: true, equal: true },
      { name: "Enrico Rukzio" },
      { name: "Tobias Grosse-Puppendahl" },
    ],
    doi: "10.1145/3828158.3838235",
    published: "2026-09-19",
    featured: true,
    summary:
      "Simulation plus an online survey map the decision space for multi-occupant autonomous vehicles into design guidelines.",
    href: "/publications#sim-dse",
  },
  {
    id: "petitions",
    title:
      "Mobilizing Grievances in the Internet Age: The Case of National Online Petitioning in South Korea, 2017–2022",
    short: "Online petitions",
    year: 2024,
    type: "Journal article",
    areas: ["society"],
    methods: ["nlp", "text", "stats"],
    venue: "PLOS ONE, 19(5): e0302373",
    authors: [{ name: "Kayoon Kim", self: true }, { name: "Chan S. Suh" }],
    doi: "10.1371/journal.pone.0302373",
    published: "2024-05-16",
    featured: true,
    summary:
      "Six years of national online petitions, traced for which grievances mobilise and which stay unheard.",
    href: "/publications#petitions",
  },
  {
    id: "pbo",
    title: "Preferential Bayesian Optimization under Human Bias",
    short: "Preferential BO",
    year: 2024,
    type: "Project",
    areas: ["ai", "decisions"],
    methods: ["bo", "sim"],
    summary:
      "Models expert preferences to tune machinery settings, then stress-tests the loop against simulated cognitive bias.",
    href: "/projects/2",
  },
  {
    id: "llm-feedback",
    title: "LLM Fine-Tuning from Human Feedback",
    short: "LLM finetuning",
    year: 2025,
    type: "Project",
    areas: ["ai"],
    methods: ["llm"],
    summary:
      "Fine-tuning on human feedback data to improve reasoning in a real-world in-vehicle application.",
    href: "/projects/1",
  },
  {
    id: "dropout",
    title: "Early-Warning Dropout Model for STEM Students",
    short: "Dropout model",
    year: 2023,
    type: "Project",
    areas: ["society", "ai"],
    methods: ["stats"],
    summary:
      "A Kalman-filter state-space model over intensive longitudinal data, flagging STEM dropout risk early enough to act.",
    href: "/projects/3",
  },
  {
    id: "labeling",
    title: "Automatic Labeling Model for Review Text",
    short: "Auto-labeling",
    year: 2023,
    type: "Project",
    areas: ["ai"],
    methods: ["nlp"],
    summary:
      "An automatic labeling model for review text that cut manual annotation effort by half.",
    href: "/projects/4",
  },
  {
    id: "covid-data",
    title: "COVID-19 Data Analysis A to Z",
    short: "COVID data",
    year: 2021,
    type: "Project",
    areas: ["society", "decisions"],
    methods: ["stats", "text"],
    summary:
      "Audits what public pandemic data leaves out, and what that omission costs the policy decisions built on it.",
    href: "/projects/5",
  },
  {
    id: "recsys",
    title: "Recommender Systems for Human Decision-Making",
    short: "Recommenders",
    year: 2021,
    type: "Project",
    areas: ["decisions"],
    methods: ["stats"],
    summary:
      "Implementations of the standard recommendation algorithms, each paired with a review of the paper it comes from.",
    href: "/projects/8",
  },
  {
    id: "petition-claims",
    title:
      "Claiming for Rights: The Changing Landscape of Issues and Claims in the National Petition of South Korea, 2017–2020",
    short: "Petition claims",
    year: 2021,
    type: "Poster",
    areas: ["society"],
    methods: ["text"],
    venue:
      "International Postgraduate and Academic Conference, Chung-Ang University",
    published: "2021-02-19",
    authors: [{ name: "Kayoon Kim", self: true }],
    summary:
      "Which claims South Koreans brought to the national petition platform, and how that repertoire shifted over four years.",
    href: "/publications#petition-claims",
  },
  {
    id: "covid-memory",
    title: "COVID-19: Our Memory",
    short: "COVID memory",
    year: 2020,
    type: "Project",
    areas: ["society"],
    methods: ["text", "nlp"],
    summary:
      "Text mining pandemic-driven social inequality into a public archive, donated to the National Library of Korea.",
    href: "/projects/6",
  },
];
