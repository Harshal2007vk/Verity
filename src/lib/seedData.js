import { base44 } from "@/api/base44Client";

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
  // ==================== ML CANDIDATES (5) ====================

  // ML-1: IDEAL FIT — Evidence-rich, quantifiable metrics
  bh(
    "Sarah Chen", "Senior ML Engineer", "TechScale AI", 8, "San Francisco, CA",
    ["Python", "PyTorch", "TensorFlow", "MLOps", "LLM", "Kubernetes", "AWS"],
    [
      { type: "github", url: "https://github.com/sarahchen/ml-pipelines", description: "Open source ML pipeline framework — 1.2k stars" },
      { type: "publication", url: "https://arxiv.org/abs/2024.12345", description: "Efficient LLM Fine-tuning at Scale (NeurIPS 2024)" },
    ],
    [
      { company: "TechScale AI", title: "Senior ML Engineer", start_date: "2021", end_date: "present", description: "Led deployment of LLM inference serving 2M users. Reduced inference latency by 45% using TensorRT. Architected RAG pipelines for enterprise search." },
      { company: "DataDrive", title: "ML Engineer", start_date: "2018", end_date: "2021", description: "Built scalable recommendation engines in PyTorch serving 10M+ daily predictions." },
    ],
    [{ degree: "MS Computer Science", institution: "Stanford University", year: "2018" }],
    "SARAH CHEN\nSenior ML Engineer\n\nEXPERIENCE\nTechScale AI - Senior ML Engineer (2021-Present)\n- Led deployment of LLM inference systems serving 2M+ active users.\n- Reduced P99 inference latency by 45% utilizing TensorRT and optimized batching.\n- Designed and deployed end-to-end RAG pipelines for enterprise search.\n\nDataDrive - ML Engineer (2018-2021)\n- Built scalable recommendation models in PyTorch serving 10M+ daily predictions.\n\nEDUCATION\nMS Computer Science, Stanford University (2018)\n\nSKILLS\nPython, PyTorch, TensorFlow, MLOps, LLM Fine-Tuning, Kubernetes, AWS, Distributed Training.",
    null
  ),

  // ML-2: KEYWORD STUFFER — All buzzwords, zero evidence
  bh(
    "John Keyword", "Machine Learning Specialist", "Self-Employed", 5, "Remote",
    ["Machine Learning", "AI", "LLM", "PyTorch", "TensorFlow", "Python", "MLOps", "Neural Networks", "Deep Learning", "Generative AI"],
    [],
    [
      { company: "Self-Employed", title: "Machine Learning Specialist", start_date: "2020", end_date: "present", description: "Worked on Machine Learning, AI, LLMs, PyTorch, TensorFlow, Python, MLOps." },
    ],
    [{ degree: "BS Computer Science", institution: "State University", year: "2019" }],
    "JOHN KEYWORD\nMachine Learning Specialist\n\nEXPERIENCE\nSelf-Employed (2020-Present)\nI am an expert in Machine Learning. I use AI, LLMs, PyTorch, TensorFlow, Python, MLOps, Neural Networks, Deep Learning, Generative AI, RAG, and NLP.\n\nSKILLS\nMachine Learning, AI, LLMs, PyTorch, TensorFlow, Python, MLOps, Neural Networks.",
    null
  ),

  // ML-3: JUNIOR — Promising but lacks depth
  bh(
    "Alex Kim", "ML Engineer", "StartUp Inc", 3, "New York, NY",
    ["Python", "Scikit-Learn", "Pandas", "Basic PyTorch"],
    [],
    [
      { company: "StartUp Inc", title: "ML Engineer", start_date: "2023", end_date: "present", description: "Trained random forest models for customer churn prediction. Exploring deep learning." },
    ],
    [{ degree: "BS Data Science", institution: "NYU", year: "2023" }],
    "ALEX KIM\nML Engineer\n\nEXPERIENCE\nStartUp Inc - ML Engineer (2023-Present)\n- Trained scikit-learn random forest models for customer churn prediction (78% accuracy).\n- Cleaned datasets using Pandas.\n- Currently learning PyTorch for deep learning applications.\n\nEDUCATION\nBS Data Science, NYU (2023)\n\nSKILLS\nPython, Scikit-Learn, Pandas, Basic PyTorch, SQL.",
    null
  ),

  // ML-4: CAREER SWITCHER — Strong SWE, light on ML models
  bh(
    "Rachel Torres", "Senior Software Engineer", "CloudNet", 9, "Austin, TX",
    ["Java", "Spring Boot", "PostgreSQL", "Python", "Machine Learning (Coursework)"],
    [],
    [
      { company: "CloudNet", title: "Senior Software Engineer", start_date: "2017", end_date: "present", description: "Developed core backend microservices in Java serving 5M users. Completed an online ML certificate." },
    ],
    [{ degree: "BS Computer Science", institution: "UT Austin", year: "2017" }],
    "RACHEL TORRES\nSenior Software Engineer\n\nEXPERIENCE\nCloudNet - Senior SWE (2017-Present)\n- Developed robust backend microservices using Java and Spring Boot serving 5M users.\n- Managed PostgreSQL clusters with 99.99% uptime.\n- Completed an online certificate in Machine Learning using Python.\n\nEDUCATION\nBS Computer Science, UT Austin (2017)\n\nSKILLS\nJava, Spring Boot, PostgreSQL, Python (basic ML).",
    null
  ),

  // ML-5: COMPLETE MISMATCH — Frontend dev
  bh(
    "Mike Rivera", "React Developer", "WebStudio", 4, "Seattle, WA",
    ["React", "JavaScript", "CSS", "HTML", "Tailwind"],
    [],
    [
      { company: "WebStudio", title: "Frontend Developer", start_date: "2022", end_date: "present", description: "Built responsive UIs using React and Tailwind CSS. Improved page load speeds by 20%." },
    ],
    [{ degree: "BA Design", institution: "Design School", year: "2021" }],
    "MIKE RIVERA\nReact Developer\n\nEXPERIENCE\nWebStudio - Frontend Developer (2022-Present)\n- Built responsive user interfaces using React and Tailwind CSS.\n- Improved page load speeds by 20%.\n\nEDUCATION\nBA Design, Design School (2021)\n\nSKILLS\nReact, JavaScript, CSS, HTML, Tailwind.",
    null
  ),

  // ==================== BACKEND CANDIDATES (5) ====================

  // BE-1: IDEAL FIT — Evidence-rich, metrics, leadership
  bh(
    "David Rossi", "Backend Services Lead", "FinTech Corp", 8, "Chicago, IL",
    ["Go", "Python", "PostgreSQL", "Kafka", "Kubernetes", "System Design", "Redis"],
    [
      { type: "github", url: "https://github.com/davidrossi/go-toolkit", description: "Open source Go microservice toolkit — 800 stars" },
    ],
    [
      { company: "FinTech Corp", title: "Backend Lead", start_date: "2020", end_date: "present", description: "Architected migration from monolithic Java to Go microservices. Scaled core transaction engine to 50,000 TPS using Apache Kafka. Mentored 4 engineers." },
      { company: "OldBank Systems", title: "Software Engineer", start_date: "2016", end_date: "2020", description: "Maintained legacy Java APIs and Oracle databases. Led database migration to PostgreSQL." },
    ],
    [{ degree: "BS Computer Science", institution: "UIUC", year: "2016" }],
    "DAVID ROSSI\nBackend Services Lead\n\nEXPERIENCE\nFinTech Corp - Backend Lead (2020-Present)\n- Architected migration from monolithic legacy system to Go microservices.\n- Scaled core transaction engine to handle 50,000 TPS using Apache Kafka.\n- Mentored a pod of 4 engineers and established CI/CD best practices.\n- Reduced P99 API latency from 800ms to 120ms through caching and query optimization.\n\nOldBank Systems - SWE (2016-2020)\n- Maintained Java APIs and Oracle databases.\n- Led successful database migration to PostgreSQL.\n\nEDUCATION\nBS Computer Science, UIUC (2016)\n\nSKILLS\nGo, Python, PostgreSQL, Kafka, Kubernetes, Redis, Distributed Systems, System Design.",
    null
  ),

  // BE-2: KEYWORD STUFFER — Lists every tech, no substance
  bh(
    "Emily Blanchard", "Backend Engineer", "Tech Consulting LLC", 6, "Remote",
    ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Microservices", "API", "Kubernetes", "AWS", "GCP"],
    [],
    [
      { company: "Tech Consulting LLC", title: "Backend Engineer", start_date: "2018", end_date: "present", description: "Used Python, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP." },
    ],
    [{ degree: "BS Information Technology", institution: "Online University", year: "2018" }],
    "EMILY BLANCHARD\nBackend Engineer\n\nEXPERIENCE\nTech Consulting LLC (2018-Present)\nBackend developer experienced in all major backend technologies. I work with Python, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP.\n\nEDUCATION\nBS Information Technology, Online University (2018)\n\nSKILLS\nPython, Go, PostgreSQL, Redis, Kafka, Microservices, API, Kubernetes, AWS, GCP.",
    null
  ),

  // BE-3: MID-LEVEL — Good execution, no architecture/leadership
  bh(
    "Sam Patel", "Backend Developer", "Local Dev Agency", 3, "Denver, CO",
    ["Python", "Django", "MySQL", "REST APIs"],
    [],
    [
      { company: "Local Dev Agency", title: "Backend Developer", start_date: "2023", end_date: "present", description: "Built REST APIs for local businesses using Python and Django. Managed MySQL databases." },
    ],
    [{ degree: "BS Computer Science", institution: "Colorado State", year: "2022" }],
    "SAM PATEL\nBackend Developer\n\nEXPERIENCE\nLocal Dev Agency (2023-Present)\n- Built simple REST APIs for client websites using Python and Django.\n- Managed MySQL databases and wrote Django views.\n- Implemented basic authentication and authorization.\n\nEDUCATION\nBS Computer Science, Colorado State (2022)\n\nSKILLS\nPython, Django, MySQL, REST APIs.",
    null
  ),

  // BE-4: OVER-QUALIFIED — Principal architect
  bh(
    "Dr. Alan Briggs", "Principal Architect", "MegaCorp", 20, "London, UK",
    ["C++", "Java", "Go", "Distributed Systems Architecture", "Enterprise Architecture"],
    [],
    [
      { company: "MegaCorp", title: "Principal Architect", start_date: "2010", end_date: "present", description: "Oversee architecture for 500+ engineering org. Board member. Define enterprise-wide distributed systems strategy." },
    ],
    [{ degree: "PhD Mathematics", institution: "Cambridge University", year: "2000" }],
    "DR. ALAN BRIGGS\nPrincipal Architect\n\nEXPERIENCE\nMegaCorp - Principal Architect (2010-Present)\n- Direct global technology strategy across 500+ engineers in 12 countries.\n- Define enterprise-wide architecture for distributed systems.\n- Board advisor on technology acquisition decisions.\n\nEDUCATION\nPhD Mathematics, Cambridge University (2000)\n\nSKILLS\nEnterprise Architecture, C++, Java, Go, Leadership, Strategy.",
    null
  ),

  // BE-5: COMPLETE MISMATCH — QA automation
  bh(
    "Lisa Hartman", "QA Automation Engineer", "TestCorp", 5, "Boston, MA",
    ["Selenium", "Cypress", "Python (Scripting)", "JIRA"],
    [],
    [
      { company: "TestCorp", title: "QA Engineer", start_date: "2021", end_date: "present", description: "Wrote automated UI tests using Cypress and Selenium." },
    ],
    [{ degree: "BS IT", institution: "Boston University", year: "2020" }],
    "LISA HARTMAN\nQA Automation Engineer\n\nEXPERIENCE\nTestCorp (2021-Present)\n- Automated frontend testing using Cypress.\n- Wrote basic Python scripts for test data generation.\n- Managed test plans in JIRA.\n\nEDUCATION\nBS IT, Boston University (2020)\n\nSKILLS\nSelenium, Cypress, QA, Python scripting, JIRA.",
    null
  ),

  // ==================== PRODUCT DESIGN CANDIDATES (5) ====================

  // PD-1: IDEAL FIT — UX research + systems + metrics
  bh(
    "Mia Wong", "Senior Product Designer", "CreativeApp", 6, "Los Angeles, CA",
    ["Figma", "User Research", "Design Systems", "Prototyping", "Wireframing", "Usability Testing"],
    [
      { type: "portfolio", url: "https://miawong.design", description: "Comprehensive case studies with process documentation" },
    ],
    [
      { company: "CreativeApp", title: "Senior Product Designer", start_date: "2020", end_date: "present", description: "Led redesign of core dashboard, increasing user retention by 22%. Established company-wide Figma design system used by 15 designers and 50 engineers. Conducted weekly usability tests with 8-10 participants." },
      { company: "DesignStudio Co", title: "Product Designer", start_date: "2018", end_date: "2020", description: "Designed onboarding flow that improved activation by 35%. Created interactive prototypes for user testing." },
    ],
    [{ degree: "BFA Interaction Design", institution: "ArtCenter College of Design", year: "2018" }],
    "MIA WONG\nSenior Product Designer\n\nEXPERIENCE\nCreativeApp (2020-Present)\n- Led end-to-end redesign of the core analytics dashboard, driving a 22% increase in user retention.\n- Created and maintained the global Figma design system used by 15+ designers and 50+ engineers.\n- Conducted weekly generative user research and evaluative usability testing (8-10 participants per session).\n\nDesignStudio Co (2018-2020)\n- Designed onboarding flow that improved activation by 35%.\n- Created interactive prototypes for user testing.\n\nEDUCATION\nBFA Interaction Design, ArtCenter (2018)\n\nSKILLS\nFigma, User Research, Design Systems, Prototyping, Wireframing, Usability Testing.",
    null
  ),

  // PD-2: KEYWORD STUFFER — All design terms, no outcomes
  bh(
    "Tom Nguyen", "UX/UI Designer", "Freelance", 4, "Remote",
    ["Figma", "UX", "UI", "Design Systems", "Prototyping", "User Research", "Sketch", "InVision"],
    [],
    [
      { company: "Freelance", title: "UX/UI Designer", start_date: "2022", end_date: "present", description: "Design things using Figma, UX, UI, Design Systems, Prototyping, User Research." },
    ],
    [{ degree: "BA Design", institution: "Online Design School", year: "2021" }],
    "TOM NGUYEN\nUX/UI Designer\n\nEXPERIENCE\nFreelance (2022-Present)\nI am a designer. I do Figma, UX, UI, Design Systems, Prototyping, and User Research. I also use Sketch and InVision.\n\nEDUCATION\nBA Design, Online (2021)\n\nSKILLS\nFigma, UX, UI, Design Systems, Prototyping, User Research, Sketch, InVision.",
    null
  ),

  // PD-3: VISUAL DESIGNER — Great visuals, weak UX research
  bh(
    "Chris Mendez", "Visual Designer", "AdAgency Global", 5, "Miami, FL",
    ["Photoshop", "Illustrator", "Figma (Basic)", "Typography", "Brand Design"],
    [
      { type: "portfolio", url: "https://dribbble.com/chrismendez", description: "Stunning visual mockups and brand work" },
    ],
    [
      { company: "AdAgency Global", title: "Visual Designer", start_date: "2021", end_date: "present", description: "Create stunning marketing websites and brand assets. Won 2 design awards for campaign visuals." },
    ],
    [{ degree: "BFA Graphic Design", institution: "Miami School of Art", year: "2020" }],
    "CHRIS MENDEZ\nVisual Designer\n\nEXPERIENCE\nAdAgency Global (2021-Present)\n- Design high-fidelity marketing landing pages.\n- Create beautiful brand assets and typography systems.\n- Won 2 industry design awards for campaign visuals.\n- Transitioning some work to Figma.\n\nEDUCATION\nBFA Graphic Design, Miami School of Art (2020)\n\nSKILLS\nPhotoshop, Illustrator, Typography, Visual Design, Brand Design.",
    null
  ),

  // PD-4: JUNIOR — Bootcamp grad
  bh(
    "Jenny Park", "Junior UX Designer", "UX Academy", 1, "Austin, TX",
    ["Figma", "User Personas", "Wireframes"],
    [],
    [
      { company: "UX Bootcamp", title: "Student", start_date: "2025", end_date: "2026", description: "Completed 3 conceptual case studies for a pet adoption app and a meal planning tool." },
    ],
    [{ degree: "Certificate UX Design", institution: "UX Academy", year: "2026" }],
    "JENNY PARK\nJunior UX Designer\n\nEXPERIENCE\nUX Bootcamp (2025-2026)\n- Created user personas, journey maps, and wireframes for conceptual apps.\n- Learned Figma fundamentals and basic prototyping.\n- Completed 3 design case studies.\n\nEDUCATION\nCertificate UX Design, UX Academy (2026)\n\nSKILLS\nFigma (Basic), User Personas, Wireframes, Journey Maps.",
    null
  ),

  // PD-5: COMPLETE MISMATCH — Marketing manager
  bh(
    "Mark Sullivan", "Marketing Manager", "SellIt Corp", 7, "New York, NY",
    ["SEO", "Content Strategy", "Google Analytics", "Copywriting", "Email Marketing"],
    [],
    [
      { company: "SellIt Corp", title: "Marketing Manager", start_date: "2019", end_date: "present", description: "Lead content strategy and SEO optimization. Grew organic traffic by 150%." },
    ],
    [{ degree: "BA Communications", institution: "NYU", year: "2018" }],
    "MARK SULLIVAN\nMarketing Manager\n\nEXPERIENCE\nSellIt Corp (2019-Present)\n- Grew organic traffic by 150% through SEO content strategy.\n- Managed Google Analytics reporting and email campaigns.\n- Led a team of 3 content writers.\n\nEDUCATION\nBA Communications, NYU (2018)\n\nSKILLS\nSEO, Content Strategy, Google Analytics, Copywriting, Email Marketing.",
    null
  ),

  // ==================== DATA ANALYST CANDIDATES (5) ====================

  // DA-1: IDEAL FIT — Business impact + BI tools + SQL
  bh(
    "Elena Volkov", "Senior Data Analyst", "E-Comm Plus", 5, "Toronto, ON",
    ["SQL", "Tableau", "Looker", "A/B Testing", "Product Analytics", "Snowflake"],
    [],
    [
      { company: "E-Comm Plus", title: "Senior Data Analyst", start_date: "2021", end_date: "present", description: "Partnered with product managers. Analyzed checkout A/B tests leading to $2M ARR lift. Built core executive Tableau dashboards tracking 15 KPIs." },
      { company: "RetailTech", title: "Data Analyst", start_date: "2019", end_date: "2021", description: "Created automated SQL reporting pipeline that replaced 20 hours of manual Excel work per week." },
    ],
    [{ degree: "BS Economics", institution: "University of Toronto", year: "2019" }],
    "ELENA VOLKOV\nSenior Data Analyst\n\nEXPERIENCE\nE-Comm Plus (2021-Present)\n- Analyzed checkout flow A/B tests, identifying a variation that drove a 4% conversion lift ($2M ARR).\n- Built and maintained core executive dashboards in Tableau and Looker tracking 15 KPIs.\n- Wrote complex SQL queries (50+ tables) to clean and aggregate raw Snowflake events.\n\nRetailTech (2019-2021)\n- Created automated SQL reporting pipeline replacing 20 hours of manual Excel work per week.\n\nEDUCATION\nBS Economics, University of Toronto (2019)\n\nSKILLS\nSQL, Tableau, Looker, A/B Testing, Product Analytics, Snowflake, Python (basic).",
    null
  ),

  // DA-2: KEYWORD STUFFER — Lists tools, no business context
  bh(
    "Steve Chambers", "Data Analyst", "Enterprise Inc", 4, "Remote",
    ["SQL", "Tableau", "Looker", "Data Visualization", "A/B Testing", "Python", "Excel"],
    [],
    [
      { company: "Enterprise Inc", title: "Data Analyst", start_date: "2022", end_date: "present", description: "My skills include SQL, Tableau, Looker, Data Visualization, A/B Testing, Python." },
    ],
    [{ degree: "BS Business Administration", institution: "Online University", year: "2021" }],
    "STEVE CHAMBERS\nData Analyst\n\nEXPERIENCE\nEnterprise Inc (2022-Present)\nI do data analysis. I use SQL, Tableau, Looker, Data Visualization, A/B Testing, Python.\n\nEDUCATION\nBS Business, Online (2021)\n\nSKILLS\nSQL, Tableau, Looker, Data Visualization, A/B Testing, Python, Excel.",
    null
  ),

  // DA-3: DATA SCIENTIST — Too technical, wrong focus
  bh(
    "Nina Okafor", "Data Scientist", "Genomics Research Lab", 6, "Boston, MA",
    ["Python", "PyTorch", "R", "Causal Inference", "Deep Learning", "Statistics"],
    [],
    [
      { company: "Genomics Research Lab", title: "Data Scientist", start_date: "2020", end_date: "present", description: "Build deep learning models for genomic sequence analysis using PyTorch. Advanced causal inference research." },
    ],
    [{ degree: "MS Statistics", institution: "MIT", year: "2019" }],
    "NINA OKAFOR\nData Scientist\n\nEXPERIENCE\nGenomics Research Lab (2020-Present)\n- Developed deep learning models for genomic sequence analysis using PyTorch.\n- Advanced causal inference modeling in R.\n- Published 2 research papers on statistical methods.\n\nEDUCATION\nMS Statistics, MIT (2019)\n\nSKILLS\nPython, PyTorch, R, Causal Inference, Deep Learning, Statistics.\n(Note: No BI dashboard or SQL experience listed).",
    null
  ),

  // DA-4: JUNIOR — Recent grad, academic only
  bh(
    "Tim O'Brien", "Junior Analyst", "University Research", 1, "Chicago, IL",
    ["SQL (Academic)", "Excel", "Basic Statistics"],
    [],
    [
      { company: "University of Chicago", title: "Research Assistant", start_date: "2025", end_date: "2026", description: "Cleaned data in Excel for professors. Ran basic statistical tests." },
    ],
    [{ degree: "BS Mathematics", institution: "University of Chicago", year: "2026" }],
    "TIM O'BRIEN\nJunior Analyst\n\nEXPERIENCE\nUniversity of Chicago (2025-2026)\n- Assisted professors by cleaning datasets using Microsoft Excel.\n- Took one course in relational databases (SQL).\n- Ran basic statistical tests for research papers.\n\nEDUCATION\nBS Mathematics, University of Chicago (2026)\n\nSKILLS\nExcel, Basic SQL, Basic Statistics, Math.",
    null
  ),

  // DA-5: COMPLETE MISMATCH — Sales operations
  bh(
    "Laura Fischer", "Sales Operations Manager", "TechSales Pro", 5, "Atlanta, GA",
    ["Salesforce", "HubSpot", "Excel", "CRM Management"],
    [],
    [
      { company: "TechSales Pro", title: "Sales Ops Manager", start_date: "2021", end_date: "present", description: "Manage Salesforce routing rules and CRM hygiene. Export reports to Excel for sales leadership." },
    ],
    [{ degree: "BBA", institution: "Emory University", year: "2020" }],
    "LAURA FISCHER\nSales Operations Manager\n\nEXPERIENCE\nTechSales Pro (2021-Present)\n- Managed Salesforce CRM and territory routing rules.\n- Exported reports to Excel for sales leadership.\n- Maintained HubSpot email sequences.\n\nEDUCATION\nBBA, Emory University (2020)\n\nSKILLS\nSalesforce, HubSpot, Excel, CRM Operations.",
    null
  ),
];

export async function seedDemoData() {
  try {
    const existingJobs = await base44.entities.Job.list();
    if (existingJobs.length > 0) {
      return { skipped: true, message: "Data already exists. Clear jobs to re-seed." };
    }

    const createdJobs = await base44.entities.Job.bulkCreate(JOBS);
    const createdCandidates = await base44.entities.Candidate.bulkCreate(CANDIDATES);

    return { skipped: false, jobs: createdJobs.length, candidates: createdCandidates.length };
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  }
}