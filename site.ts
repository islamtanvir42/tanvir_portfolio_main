/**
 * Single source of truth for every fact on this site.
 *
 * Three content rules are deliberate, not oversights:
 *
 * 1. No CGPA anywhere. A personal site is not an application form, and an
 *    unprompted metric would be the first number a recruiter reads. Education
 *    carries no grades at all, so the omission is consistent rather than
 *    conspicuous.
 * 2. The UCBL work is described at capability level only. No database versions,
 *    host names, instance counts or vendor topology — that information maps a
 *    regulated bank's estate. Anything added here must clear the same bar.
 * 3. Referees are named nowhere. "Available on request" only.
 *
 * Skills and stacks list what the source documents actually claim. Do not add
 * a library because a project probably used one.
 */

export type ProjectKind = "internship" | "thesis" | "paper" | "academic" | "data";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  year: number;
  period: string;
  /** Short enough to sit in a table cell. */
  stack: string[];
  /** The hook, 6–10 words. Sits above the summary on a card and has to earn
   *  the read — it is not a shorter summary, it is the reason to care. */
  headline: string;
  /** One line, used on cards and in the catalogue. */
  summary: string;
  /** Detail page prose. */
  body: string[];
  contributions?: string[];
  /** What he took away from it. For a fresher this is the line that carries weight. */
  learned: string;
  /** Honest label. Coursework is labelled as coursework. */
  badge: string;
  /** Rendered as a disclosure note on the detail page. */
  restricted?: string;
  status?: string;
};

export const profile = {
  name: "Tanvir Islam",
  shortName: "Tanvir",
  title: "Database systems & applied machine learning",
  // Fresher voice: curious and specific, not a specialist's claim to authority.
  positioning:
    "I build things with databases, then take them apart to find out why they broke.",
  // The hero paragraph. Same rewrite as `about[0]`, minus the "I'm Tanvir —"
  // opener: on the homepage it sits directly under the name set at 6.6rem, so
  // introducing himself again there would read as a stutter.
  intro:
    "A CSE graduate from AIUB, currently doing my internship as a Database Administrator at UCBL. I picked Information Systems as my track because I was always more curious about what's happening underneath an app than the app itself: how the data is structured, and how well a schema holds up once real use starts pulling at it.",
  /**
   * About-page prose, in the client's own words.
   *
   * The previous draft was flagged in review as reading AI-written — not for
   * any single sentence but for the pattern: setup-and-reversal constructions
   * ("The two look unrelated. They are not:"), every paragraph landing on a
   * tidy abstraction, and no first-person slips anywhere. This copy is the
   * client's supplied rewrite. Keep the plainer register and the contractions
   * if you edit it; do not polish the friction back out.
   */
  about: [
    "I'm Tanvir — a CSE graduate from AIUB, currently doing my internship as a Database Administrator at UCBL. I picked Information Systems as my track because I was always more curious about what's happening underneath an app than the app itself: how the data is structured, and how well a schema holds up once real use starts pulling at it.",
    "Interning inside a bank made that concrete fast. In a production, regulated environment, a database nobody documented isn't just messy — you can't patch it, back it up, or plan capacity for it, because as far as anyone can tell, it doesn't exist.",
    "My final-year thesis pulled me somewhere different: using machine learning to pick up early signs of laryngeal disease from voice recordings. It doesn't look related to database work, but it's asking the same underlying question — what does a representation of something actually capture, and what does it leave out?",
    "Right now I'm most interested in where machine learning can genuinely support database work — anomaly detection, capacity forecasting, query behaviour — rather than places it's just fashionable to bolt on.",
  ],
  // Home and About shared one description word for word, so both pages looked
  // identical in search results and link previews. This one is About's alone.
  aboutMeta:
    "CSE graduate from AIUB and database administration intern at UCBL — how I got here, what I studied, and the work I am looking for next.",
  seeking:
    "Looking for my first full-time role in database administration, data, or IT operations.",
  // Short close for pages that should not repeat the full homepage contact
  // block. About ends on this instead of a second copy of the site's ending.
  signoff: "Open to full-time DBA, data and IT operations roles.",
  location: "Dhaka, Bangladesh",
  email: "islamtanvir1811@gmail.com",
  phone: "+88 01740-640605",
  links: {
    linkedin: "https://linkedin.com/in/tanvir-islam-8760a03aa",
    github: "https://github.com/islamtanvir42",
  },
  availability: "Open to roles in database administration, data, and IT operations.",
};

export const projects: Project[] = [
  {
    slug: "database-inventory-service",
    badge: "Internship",
    learned:
      "That the hard part was never the CRUD. It was deciding what counts as the authoritative record, and who is allowed to change it.",
    title: "Database Inventory Service",
    kind: "internship",
    year: 2026,
    period: "2026 — in progress",
    stack: ["FastAPI", "PostgreSQL", "React"],
    headline: "Turning a spreadsheet nobody fully trusted into a system of record.",
    summary:
      "An internal service that catalogues a bank's database estate, replacing a manual tracking process.",
    body: [
      "Large organisations tend to lose track of their own databases. Instances get provisioned for a project, ownership moves, and the authoritative record quietly becomes a spreadsheet that only one person maintains. That is a reliability problem before it is anything else: you cannot patch, back up, or plan capacity for something you do not know exists.",
      "This is an internal tool built during my internship to make that estate legible — a catalogue of database instances with their owners and operational metadata, maintained as a service rather than as a document. A FastAPI backend over PostgreSQL, with a React front end for the people who need to read and correct the record.",
      "The interesting part is not the CRUD. It is deciding what the authoritative record should be, who is allowed to change it, and how the catalogue stays true as the estate moves underneath it.",
    ],
    contributions: [
      "Designed the catalogue schema and the API over it",
      "Built the FastAPI service and its PostgreSQL persistence layer",
      "Built the React interface used to review and correct records",
    ],
    restricted:
      "This work sits inside a regulated bank. The description here is deliberately limited to capability and stack — no database versions, host names, instance counts, or topology. Screenshots and figures are omitted for the same reason.",
    status: "In progress",
  },
  {
    slug: "voice-signal-throat-cancer",
    badge: "Final-year thesis",
    learned:
      "Hand-engineered acoustic features carry meaning a clinician can actually read. A learned representation might score better and explain nothing — and that trade is a real decision, not a detail.",
    title: "Voice Signal Analysis for Throat Cancer Detection",
    kind: "thesis",
    year: 2026,
    period: "2025–2026",
    stack: ["Python", "MFCC · Jitter · Shimmer · HNR", "CNN-LSTM"],
    headline: "Teaching a model to listen for what a clinician listens for.",
    summary:
      "Undergraduate thesis: acoustic features of the voice as an early signal for laryngeal pathology.",
    body: [
      "Disease in the larynx changes the voice before it changes much else, and it changes it in ways that are measurable rather than merely audible. The thesis asks how far that signal can be pushed with machine learning.",
      "The work extracts a set of acoustic features — MFCCs, Jitter, Shimmer, Harmonics-to-Noise Ratio, and the Mel spectrogram — from recordings in the Saarbrücken Voice Database, and feeds them to two families of model: classical classifiers over the engineered features, and a CNN-LSTM hybrid that reads the spectrogram directly. The comparison is the point. Hand-engineered acoustic measures carry real clinical meaning; a learned representation may carry more, but it carries it opaquely.",
      "Supervised at AIUB as the final-year thesis for the BSc in Computer Science & Engineering.",
    ],
    contributions: [
      "Feature extraction pipeline over the Saarbrücken Voice Database",
      "Classical baselines over engineered acoustic features",
      "CNN-LSTM hybrid reading Mel spectrograms directly",
      "Comparative evaluation across both model families",
    ],
    status: "Thesis, 2026",
  },
  {
    slug: "agile-implementation-bangladesh",
    badge: "Co-authored paper",
    learned:
      "Writing to a strict format forces you to defend every claim you make. That turned out to be much harder than having the idea.",
    title: "Beyond Methodology Selection",
    kind: "paper",
    year: 2025,
    period: "2025",
    stack: ["IEEE format", "Qualitative analysis"],
    headline: "Adopting Agile is easy. Staying Agile six months later is the actual problem.",
    summary:
      "Co-authored paper on why Agile adoption in the Bangladeshi software industry stalls after the methodology is chosen.",
    body: [
      "Teams adopt Agile and then find that adopting it was the easy part. The paper argues that the interesting failures are not in methodology selection but in everything downstream of it — the organisational and contextual conditions that decide whether the chosen process survives contact with the work.",
      "A systematic gap analysis of Agile implementation in the Bangladeshi software industry, followed by a contextual framework for reasoning about those gaps. Written and formatted to IEEE conference standards.",
      "Co-authored.",
    ],
    status: "Co-authored, IEEE format",
  },
  {
    slug: "ans-hospital-management",
    badge: "University project",
    learned:
      "Normalising the schema before writing any PHP made every query afterwards simpler. I learned this by doing it in the wrong order first and rewriting.",
    title: "ANS Hospital Management System",
    kind: "academic",
    year: 2025,
    period: "2025",
    stack: ["PHP", "MySQL", "HTML", "CSS"],
    headline: "One schema behind registration, scheduling and billing — built in that order for a reason.",
    summary:
      "Full-stack hospital system: registration, scheduling and billing over a normalised relational schema.",
    body: [
      "A web-based system automating the operational core of a hospital — patient registration, appointment scheduling, and billing — built as a full-stack academic project.",
      "The database design carried most of the weight. A normalised relational schema removed the duplication that a flat design invites, which both reduced redundancy and made queries measurably cheaper. On top of that sits role-based access separating Admin, Doctor and Staff, so that the workflow and the security model are the same model rather than two that have to be kept in agreement.",
    ],
    contributions: [
      "Normalised relational schema design",
      "Role-based access control across Admin, Doctor and Staff",
      "Registration, scheduling and billing modules",
      "Test planning and test case documentation across group projects, including MediTrackBD and a sign language translation project",
    ],
    status: "Academic project",
  },
  {
    slug: "anime-ratings-analysis",
    badge: "University project",
    learned:
      "Most of the work is deciding what a row means before any model sees it. The regression itself took an afternoon; the cleaning took a week.",
    title: "Anime Ratings Predictive Analysis",
    kind: "data",
    year: 2025,
    period: "2025",
    stack: ["Python", "Web scraping", "Linear regression"],
    headline: "The model believed the ratings more than they deserved — until the cleanup said otherwise.",
    summary:
      "A small end-to-end data project: scrape, clean, model, and find out the obvious answer is wrong.",
    body: [
      "A deliberately small project run end to end: scrape the top titles from MyAnimeList, clean what comes back, and model the relationship between popularity, release year and user rating with linear regression.",
      "The value was in the pipeline rather than the finding. Scraped data arrives inconsistent, and most of the work is deciding what a row means before any model sees it — which is the same problem, at a smaller scale, as deciding what a catalogue record means.",
    ],
    status: "Independent project",
  },
];

export const education = [
  {
    qualification: "BSc in Computer Science & Engineering",
    detail: "Information Systems concentration",
    institution: "American International University-Bangladesh (AIUB)",
    // "(expected)" dropped at the client's request — the coursework is done.
    // The reviewed alternative was "2022 – 2026 · Coursework complete", but the
    // Journey rail on the homepage is a fixed 150px column and that string
    // wraps to two lines in it. The plain range needs no layout concession.
    period: "2022 – 2026",
  },
  {
    qualification: "Higher Secondary Certificate",
    detail: "Science",
    institution: "Shaheed Police Smrity College, Mirpur, Dhaka",
    period: "2020",
  },
  {
    qualification: "Secondary School Certificate",
    detail: "Science",
    institution: "Model Academy, Mirpur, Dhaka",
    period: "2018",
  },
];

export const skills = [
  { group: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "SQL"] },
  { group: "Programming", items: ["Python", "Java", "C++", "PHP", "R"] },
  { group: "Web & API", items: ["FastAPI", "React", "HTML", "CSS"] },
  {
    group: "Practice",
    items: [
      "Normalised schema design",
      "Role-based access control",
      "Test planning & documentation",
    ],
  },
  { group: "Tools", items: ["VS Code", "Framer", "MS Excel", "MS PowerPoint"] },
];

export const interests = [
  "Database administration and systems reliability",
  "Applied machine learning",
  "Data science and analysis",
];

export const languages = [
  { name: "Bangla", level: "Native" },
  { name: "English", level: "Proficient — reading, writing and speaking" },
];

export const experience = [
  {
    role: "Database Administration Intern",
    org: "UCBL",
    period: "2026 — present",
    note: "Hands-on work with production database environments in a regulated banking context. Currently building an internal database inventory service.",
  },
];
