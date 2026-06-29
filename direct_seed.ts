import dotenv from 'dotenv';
dotenv.config();
import { getSupabase, initDb } from './server/database/db';
// I'll just copy the JOBS and CANDIDATES directly here to avoid import issues.
const JOBS = [
  {
    title: "Senior ML Engineer",
    raw_description: "We're looking for a Senior ML Engineer to build and deploy production ML systems at scale. You'll work on model training pipelines, MLOps infrastructure, and real-time inference serving. Must have deep experience with PyTorch/TensorFlow, model optimization, and deploying models to production. Experience with LLMs, fine-tuning, and RAG systems is a big plus.",
    team_context: "ML Platform team — builds the infrastructure that powers all ML products at the company.",
    status: "active",
    job_intelligence: {
      role: "Machine Learning Engineer",
      seniority: "Senior (5+ years)",
      domain: "ML / AI Engineering",
      industry: "Technology",
      must_have_skills: ["Python", "PyTorch", "Machine Learning", "Model Deployment", "MLOps"],
      nice_to_have_skills: ["TensorFlow", "LLM Fine-tuning", "RAG", "Kubernetes", "Distributed Training"],
      hidden_requirements: ["Production systems experience (not just research)", "Ability to optimize models for latency", "Understanding of ML infrastructure tradeoffs"],
      responsibilities: ["Build and maintain ML training pipelines", "Deploy models to production with monitoring", "Optimize model inference for latency and cost", "Collaborate with research teams on model handoff"],
      context_notes: "This role bridges research and production.",
    },
  },
  {
    title: "Backend Services Lead",
    raw_description: "Join our platform team as a Backend Services Lead. You'll design and build distributed systems, APIs, and services that handle millions of requests. Strong experience with Python or Go, distributed systems, databases (PostgreSQL, Redis), and API design required. Experience with microservices, message queues (Kafka), and observability is essential.",
    team_context: "Platform Engineering team — builds the core infrastructure.",
    status: "active",
    job_intelligence: {
      role: "Backend Software Engineer",
      seniority: "Lead/Senior (7+ years)",
      domain: "Backend / Distributed Systems",
      industry: "Technology",
      must_have_skills: ["Python", "Go", "PostgreSQL", "Distributed Systems", "System Design"],
      nice_to_have_skills: ["Kubernetes", "Microservices", "Kafka", "Observability", "Redis"],
      hidden_requirements: ["High-scale production incident experience", "Leadership in system architecture", "Ability to mentor junior engineers"],
      responsibilities: ["Design and build scalable backend services", "Architect database and caching layers", "Lead a pod of 3-4 engineers", "Drive engineering standards"],
      context_notes: "Focus on systems thinking and leadership.",
    },
  },
  {
    title: "Product Designer",
    raw_description: "We're looking for a Product Designer to own end-to-end design for key product areas. You'll conduct user research, create wireframes and prototypes in Figma, and work closely with engineering. Strong portfolio required. Experience with design systems, complex UX workflows, and user testing is essential.",
    team_context: "Core Product team — owns the user experience.",
    status: "active",
    job_intelligence: {
      role: "Product Designer",
      seniority: "Mid-Senior (3-6 years)",
      domain: "Product Design / UX",
      industry: "Technology",
      must_have_skills: ["Figma", "User Research", "Prototyping", "UX Design", "Wireframing"],
      nice_to_have_skills: ["Frontend Development", "Design Systems", "Usability Testing", "Interaction Design"],
      hidden_requirements: ["Portfolio showing process and tradeoffs", "Ability to collaborate closely with engineers", "Systems-level thinking for UI components"],
      responsibilities: ["Own design for assigned product areas", "Conduct user research", "Maintain the design system", "Collaborate with PM and engineering"],
      context_notes: "Must be strong in UX and systems, not just visual design.",
    },
  },
  {
    title: "Data Analyst",
    raw_description: "Seeking a Data Analyst to partner with business teams. You will write complex SQL queries, build dashboards in Tableau/Looker, and analyze A/B tests to drive product decisions. Must have strong business acumen and the ability to communicate data insights to non-technical stakeholders.",
    team_context: "Growth & Analytics team.",
    status: "active",
    job_intelligence: {
      role: "Data Analyst",
      seniority: "Mid (2-5 years)",
      domain: "Data Analytics / BI",
      industry: "Technology",
      must_have_skills: ["SQL", "Tableau", "Looker", "Data Visualization", "A/B Testing"],
      nice_to_have_skills: ["Python", "R", "Statistics", "ETL", "Product Analytics"],
      hidden_requirements: ["Strong communication skills", "Ability to tie metrics to business value", "Proactive insight generation"],
      responsibilities: ["Build and maintain BI dashboards", "Analyze product A/B tests", "Write complex SQL for reporting", "Present findings to leadership"],
      context_notes: "Looking for business-focused analysts, not deep ML scientists.",
    },
  },
];

function bh(name, title, company, years, location, skills, evidence, workHistory, education, resumeSnippet, intelligence) {
  const candidate = {
    full_name: name,
    current_title: title,
    current_company: company,
    total_experience_years: years,
    location: location,
    skills_claimed: skills,
    evidence_links: evidence,
    work_history: workHistory,
    education: education,
    resume_text: resumeSnippet,
    behavioral_signals: {
      profile_completeness_score: 60 + Math.floor(Math.random() * 35),
      last_active_date: "2026-06-25",
      response_rate: 0.6 + Math.random() * 0.35,
      application_velocity: 1 + Math.floor(Math.random() * 10),
      endorsement_count: Math.floor(Math.random() * 20),
    },
  };
  if (intelligence) candidate.candidate_intelligence = intelligence;
  return candidate;
}

const CANDIDATES = [
  // ML Candidates (5)
  bh(
    "Sarah Chen", "Senior ML Engineer", "TechScale AI", 8, "San Francisco, CA",
    ["Python", "PyTorch", "TensorFlow", "MLOps", "LLM", "Kubernetes", "AWS"],
    [{ type: "github", url: "https://github.com/sarahchen/ml-pipelines", description: "Open source ML pipeline framework — 1.2k stars" }],
    [
      { company: "TechScale AI", title: "Senior ML Engineer", start_date: "2021", end_date: "present", description: "Led deployment of LLM inference serving 2M users. Reduced inference latency by 45% using TensorRT. Architected RAG pipelines." },
      { company: "DataDrive", title: "ML Engineer", start_date: "2018", end_date: "2021", description: "Built scalable recommendation engines in PyTorch." }
    ],
    [{ degree: "MS Computer Science", institution: "Stanford University", year: "2018" }],
    "SARAH CHEN\nSenior ML Engineer\n\nEXPERIENCE\nTechScale AI - Senior ML Engineer (2021-Present)\n- Led deployment of LLM inference systems serving 2M+ active users.\n- Reduced P99 inference latency by 45% utilizing TensorRT and optimized batching.\n- Designed and deployed end-to-end RAG pipelines for enterprise search.\n\nDataDrive - ML Engineer (2018-2021)\n- Built scalable recommendation models in PyTorch.\n\nSKILLS\nPython, PyTorch, TensorFlow, MLOps, LLM Fine-Tuning, Kubernetes, AWS.",
    null
  ),
  bh(
    "John Keyword", "Machine Learning Specialist", "Self-Employed", 5, "Remote",
    ["Machine Learning", "AI", "LLM", "PyTorch", "TensorFlow", "Python", "MLOps", "Neural Networks"],
    [],
    [
      { company: "Self-Employed", title: "Machine Learning Specialist", start_date: "2020", end_date: "present", description: "Worked on Machine Learning, AI, LLMs, PyTorch, TensorFlow, Python, MLOps." }
    ],
    [{ degree: "BS Computer Science", institution: "State University", year: "2019" }],
    "JOHN KEYWORD\nMachine Learning Specialist\n\nEXPERIENCE\nSelf-Employed (2020-Present)\nI am an expert in Machine Learning. I use AI, LLMs, PyTorch, TensorFlow, Python, MLOps, Neural Networks, Deep Learning, Generative AI, RAG, and NLP.\n\nSKILLS\nMachine Learning, AI, LLMs, PyTorch, TensorFlow, Python, MLOps, Neural Networks.",
    null
  ),
  bh(
    "Alex Kim", "Machine Learning Engineer", "StartUp Inc", 3, "New York, NY",
    ["Python", "Scikit-Learn", "Pandas", "Basic PyTorch"],
    [],
    [
      { company: "StartUp Inc", title: "ML Engineer", start_date: "2023", end_date: "present", description: "Trained random forest models for customer churn. Exploring deep learning." }
    ],
    [{ degree: "BS Data Science", institution: "NYU", year: "2023" }],
    "ALEX KIM\nML Engineer\n\nEXPERIENCE\nStartUp Inc - ML Engineer (2023-Present)\n- Trained scikit-learn random forest models for customer churn prediction.\n- Cleaned datasets using Pandas.\n- Currently learning PyTorch for deep learning applications.\n\nSKILLS\nPython, Scikit-Learn, Pandas, Basic PyTorch, SQL.",
    null
  ),
  bh(
    "Rachel Green", "Senior Software Engineer", "CloudNet", 9, "Austin, TX",
    ["Java", "Spring Boot", "PostgreSQL", "Python", "Machine Learning (Coursework)"],
    [],
    [
      { company: "CloudNet", title: "Senior Software Engineer", start_date: "2017", end_date: "present", description: "Developed core backend microservices in Java. Took an online course in Machine Learning using Python." }
    ],
    [{ degree: "BS Computer Science", institution: "UT Austin", year: "2017" }],
    "RACHEL GREEN\nSenior Software Engineer\n\nEXPERIENCE\nCloudNet - Senior SWE (2017-Present)\n- Developed robust backend microservices using Java and Spring Boot.\n- Managed PostgreSQL clusters.\n- Completed an online certificate in Machine Learning using Python.\n\nSKILLS\nJava, Spring Boot, PostgreSQL, Python.",
    null
  ),
  bh(
    "Mike Frontend", "React Developer", "WebStudio", 4, "Seattle, WA",
    ["React", "JavaScript", "CSS", "HTML"],
    [],
    [
      { company: "WebStudio", title: "Frontend Developer", start_date: "2022", end_date: "present", description: "Built responsive UIs using React and Tailwind CSS." }
    ],
    [{ degree: "BA Design", institution: "Design School", year: "2021" }],
    "MIKE FRONTEND\nReact Developer\n\nEXPERIENCE\nWebStudio - Frontend Developer (2022-Present)\n- Built responsive user interfaces using React and Tailwind CSS.\n- Improved page load speeds by 20%.\n\nSKILLS\nReact, JavaScript, CSS, HTML.",
    null
  ),

  // Backend Candidates (5)
  bh(
    "David Rossi", "Backend Services Lead", "FinTech Corp", 8, "Chicago, IL",
    ["Go", "Python", "PostgreSQL", "Kafka", "Kubernetes", "System Design"],
    [{ type: "github", url: "https://github.com/davidr", description: "Active contributor to Apache Kafka" }],
    [
      { company: "FinTech Corp", title: "Backend Lead", start_date: "2020", end_date: "present", description: "Architected microservices migrating from monolith. Handled 50k TPS using Go and Kafka. Mentored 4 engineers." },
      { company: "OldBank", title: "Software Engineer", start_date: "2016", end_date: "2020", description: "Maintained legacy Java APIs." }
    ],
    [{ degree: "BS Computer Science", institution: "UIUC", year: "2016" }],
    "DAVID ROSSI\nBackend Services Lead\n\nEXPERIENCE\nFinTech Corp - Backend Lead (2020-Present)\n- Architected migration from monolithic legacy system to Go microservices.\n- Scaled core transaction engine to handle 50,000 TPS using Apache Kafka.\n- Mentored a pod of 4 engineers and established CI/CD best practices.\n\nOldBank - SWE (2016-2020)\n- Maintained Java APIs and Oracle databases.\n\nSKILLS\nGo, Python, PostgreSQL, Kafka, Kubernetes, Distributed Systems.",
    null
  ),
  bh(
    "Emily Keyword", "Backend Engineer", "Tech Consulting", 6, "Remote",
    ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Microservices", "API", "Kubernetes", "AWS", "GCP"],
    [],
    [
      { company: "Tech Consulting", title: "Backend Engineer", start_date: "2018", end_date: "present", description: "Used Python, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP." }
    ],
    [{ degree: "BS IT", institution: "Online University", year: "2018" }],
    "EMILY KEYWORD\nBackend Engineer\n\nEXPERIENCE\nTech Consulting (2018-Present)\nBackend developer experienced in all major backend technologies. I work with Python, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP.\n\nSKILLS\nPython, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP.",
    null
  ),
  bh(
    "Sam Junior", "Backend Developer", "Local Agency", 3, "Denver, CO",
    ["Python", "Django", "MySQL"],
    [],
    [
      { company: "Local Agency", title: "Backend Developer", start_date: "2023", end_date: "present", description: "Built REST APIs for local businesses using Python and Django." }
    ],
    [{ degree: "BS Computer Science", institution: "Colorado College", year: "2022" }],
    "SAM JUNIOR\nBackend Developer\n\nEXPERIENCE\nLocal Agency (2023-Present)\n- Built simple REST APIs for client websites.\n- Managed MySQL databases and wrote Django views.\n\nSKILLS\nPython, Django, MySQL, REST APIs.",
    null
  ),
  bh(
    "Dr. Alan Turing", "Principal Architect", "MegaCorp", 20, "London, UK",
    ["C++", "Java", "Go", "Distributed Systems architecture", "Enterprise Architecture"],
    [],
    [
      { company: "MegaCorp", title: "Principal Architect", start_date: "2010", end_date: "present", description: "Oversee architecture for 500+ engineering org. Board member." }
    ],
    [{ degree: "PhD Mathematics", institution: "Cambridge", year: "2000" }],
    "DR. ALAN TURING\nPrincipal Architect\n\nEXPERIENCE\nMegaCorp - Principal Architect (2010-Present)\n- Direct global technology strategy across 500+ engineers.\n- Define enterprise-wide architecture for distributed systems.\n\nSKILLS\nEnterprise Architecture, C++, Java, Go, Leadership.",
    null
  ),
  bh(
    "Lisa QA", "QA Automation Engineer", "TestCorp", 5, "Boston, MA",
    ["Selenium", "Cypress", "Python (Scripting)"],
    [],
    [
      { company: "TestCorp", title: "QA Engineer", start_date: "2021", end_date: "present", description: "Wrote automated UI tests." }
    ],
    [{ degree: "BS IT", institution: "Boston U", year: "2020" }],
    "LISA QA\nQA Automation\n\nEXPERIENCE\nTestCorp (2021-Present)\n- Automated frontend testing using Cypress.\n- Wrote basic Python scripts for test data generation.\n\nSKILLS\nSelenium, Cypress, QA, Python.",
    null
  )
];

async function seed() {
  await initDb();
  const supabase = getSupabase();
  console.log("Deleting old records...");
  await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Inserting jobs...");
  const { data: jobsData, error: jobsErr } = await supabase.from('jobs').insert(JOBS).select();
  if (jobsErr) console.error("Jobs error:", jobsErr);
  else console.log(`Inserted ${jobsData.length} jobs.`);
  
  console.log("Inserting candidates...");
  const { data: candData, error: candErr } = await supabase.from('candidates').insert(CANDIDATES).select();
  if (candErr) console.error("Candidates error:", candErr);
  else console.log(`Inserted ${candData.length} candidates.`);
}

seed();
