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
      context_notes: "This role bridges research and production — needs someone who understands both ML theory and engineering best practices.",
    },
  },
  {
    title: "Backend Engineer",
    raw_description: "Join our platform team as a Backend Engineer. You'll design and build distributed systems, APIs, and services that handle millions of requests. Strong experience with Python or Go, distributed systems, databases (PostgreSQL, Redis), and API design required. Experience with microservices, message queues, and observability is essential.",
    team_context: "Platform Engineering team — builds the core infrastructure and services.",
    status: "active",
    job_intelligence: {
      role: "Backend Software Engineer",
      seniority: "Mid-Senior (3-7 years)",
      domain: "Backend / Distributed Systems",
      industry: "Technology",
      must_have_skills: ["Python", "PostgreSQL", "Distributed Systems", "API Design", "Redis"],
      nice_to_have_skills: ["Go", "Kubernetes", "Microservices", "Kafka", "Observability"],
      hidden_requirements: ["Production incident experience", "Understanding of tradeoffs in distributed systems", "Ability to write maintainable, well-tested code"],
      responsibilities: ["Design and build scalable backend services", "Maintain and optimize database performance", "Implement observability and alerting", "Participate in on-call rotation"],
      context_notes: "Focus on systems thinking and production reliability over raw feature output.",
    },
  },
  {
    title: "Product Designer",
    raw_description: "We're looking for a Product Designer to own end-to-end design for key product areas. You'll conduct user research, create wireframes and prototypes, and work closely with engineering. Strong portfolio required. Experience with design systems, Figma, and user testing is essential.",
    team_context: "Product Design team — owns the user experience across all products.",
    status: "active",
    job_intelligence: {
      role: "Product Designer",
      seniority: "Mid-Senior (3-6 years)",
      domain: "Product Design / UX",
      industry: "Technology",
      must_have_skills: ["Figma", "User Research", "Prototyping", "Design Systems", "UX Design"],
      nice_to_have_skills: ["Frontend Development", "Motion Design", "Design Tokens", "Accessibility"],
      hidden_requirements: ["Portfolio showing process, not just final designs", "Ability to defend design decisions with data", "Experience shipping features end-to-end"],
      responsibilities: ["Own design for assigned product areas", "Conduct user research and usability testing", "Maintain and extend the design system", "Collaborate with PM and engineering"],
      context_notes: "Looking for designers who think in systems and can articulate tradeoffs.",
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
      last_active_date: "2026-06-15",
      response_rate: 0.6 + Math.random() * 0.35,
      application_velocity: 1 + Math.floor(Math.random() * 10),
      endorsement_count: Math.floor(Math.random() * 20),
    },
  };
  if (intelligence) candidate.candidate_intelligence = intelligence;
  return candidate;
}

const CANDIDATES = [
  // === Strong ML candidates ===
  bh(
    "Sarah Chen", "Senior ML Engineer", "Google DeepMind", 8, "San Francisco, CA",
    ["Python", "PyTorch", "TensorFlow", "Machine Learning", "LLM Fine-tuning", "MLOps", "Kubernetes", "Distributed Training"],
    [
      { type: "github", url: "https://github.com/sarahchen/ml-pipelines", description: "Production ML pipeline framework — 2.1k stars" },
      { type: "publication", url: "https://arxiv.org/abs/2024.12345", description: "Efficient LLM Fine-tuning at Scale (NeurIPS 2024)" },
      { type: "certificate", url: "https://credly.com/sarahchen", description: "Google Cloud ML Engineer Certified" },
    ],
    [
      { company: "Google DeepMind", title: "Senior ML Engineer", start_date: "2022", end_date: "present", description: "Led LLM fine-tuning infrastructure serving 50M+ queries daily. Reduced inference latency by 40%." },
      { company: "Meta", title: "ML Engineer", start_date: "2019", end_date: "2022", description: "Built recommendation models for Instagram feed. Deployed to production with full MLOps pipeline." },
      { company: "Stripe", title: "ML Engineer", start_date: "2016", end_date: "2019", description: "Fraud detection models processing $100M+ in transactions." },
    ],
    [{ degree: "PhD Computer Science", institution: "Stanford University", year: "2016" }],
    "Sarah Chen — PhD CS Stanford. Senior ML Engineer at Google DeepMind. 8 years experience building production ML systems. Led LLM fine-tuning infrastructure. Published at NeurIPS. Expert in PyTorch, distributed training, MLOps.",
    {
      skill_graph: [
        { skill: "Python", confidence: 95, source: "evidenced" },
        { skill: "PyTorch", confidence: 92, source: "evidenced" },
        { skill: "LLM Fine-tuning", confidence: 88, source: "evidenced" },
        { skill: "MLOps", confidence: 85, source: "evidenced" },
        { skill: "Distributed Training", confidence: 82, source: "evidenced" },
        { skill: "Kubernetes", confidence: 75, source: "evidenced" },
      ],
      career_trajectory_summary: "Consistent upward trajectory from fintech ML to social media at Meta, to cutting-edge LLM work at DeepMind. PhD-level research foundation with strong production engineering track record.",
      transferable_skills: ["Distributed Systems Engineering", "Research-to-Production Pipeline Design"],
      growth_signal: "Strong upward trajectory — moving from applied ML at Stripe to frontier research at DeepMind.",
    }
  ),
  bh(
    "Marcus Rodriguez", "ML Engineer", "Meta", 6, "Seattle, WA",
    ["Python", "PyTorch", "Machine Learning", "Model Deployment", "TensorFlow", "MLOps", "Kafka"],
    [
      { type: "github", url: "https://github.com/mrodriguez/model-server", description: "High-throughput ML model serving framework — 800 stars" },
      { type: "certificate", url: "https://aws.amazon.com/verification/mrodriguez", description: "AWS ML Specialty Certified" },
    ],
    [
      { company: "Meta", title: "ML Engineer", start_date: "2021", end_date: "present", description: "Built real-time ranking models for Facebook Ads. Handled 2B+ predictions daily with sub-100ms latency." },
      { company: "Datadog", title: "ML Engineer", start_date: "2018", end_date: "2021", description: "Anomaly detection systems monitoring millions of metrics." },
    ],
    [{ degree: "MS Computer Science", institution: "UC Berkeley", year: "2018" }],
    "Marcus Rodriguez — MS CS UC Berkeley. ML Engineer at Meta. 6 years experience. Built real-time ranking models. Expert in PyTorch and model deployment.",
    {
      skill_graph: [
        { skill: "Python", confidence: 90, source: "evidenced" },
        { skill: "PyTorch", confidence: 88, source: "evidenced" },
        { skill: "Model Deployment", confidence: 85, source: "evidenced" },
        { skill: "MLOps", confidence: 80, source: "evidenced" },
        { skill: "TensorFlow", confidence: 72, source: "claimed" },
        { skill: "Kafka", confidence: 70, source: "evidenced" },
      ],
      career_trajectory_summary: "Solid progression from monitoring/ML at Datadog to large-scale production ML at Meta. Strong engineering foundation.",
      transferable_skills: ["Distributed Systems", "Real-time Data Processing"],
      growth_signal: "Steady growth from mid-level to senior ML engineering at top-tier companies.",
    }
  ),
  bh(
    "Aisha Patel", "Data Scientist", "Spotify", 5, "New York, NY",
    ["Python", "Machine Learning", "Data Pipelines", "PyTorch", "SQL", "Airflow", "Statistics"],
    [
      { type: "github", url: "https://github.com/aishapatel/recsys", description: "Recommendation system toolkit — 1.2k stars" },
      { type: "publication", url: "https://dl.acm.org/doi/aishapatel", description: "Scalable Music Recommendation (RecSys 2023)" },
    ],
    [
      { company: "Spotify", title: "Data Scientist", start_date: "2020", end_date: "present", description: "Built recommendation models for Discover Weekly. Pipeline processes 400M+ user interactions." },
      { company: "Airbnb", title: "Data Analyst", start_date: "2017", end_date: "2020", description: "Pricing models and demand forecasting." },
    ],
    [{ degree: "MS Statistics", institution: "Columbia University", year: "2017" }],
    "Aisha Patel — MS Statistics Columbia. Data Scientist at Spotify. 5 years. Built recommendation systems. Strong in Python, ML, data pipelines.",
    {
      skill_graph: [
        { skill: "Python", confidence: 88, source: "evidenced" },
        { skill: "Machine Learning", confidence: 85, source: "evidenced" },
        { skill: "Data Pipelines", confidence: 90, source: "evidenced" },
        { skill: "PyTorch", confidence: 72, source: "claimed" },
        { skill: "Statistics", confidence: 88, source: "evidenced" },
        { skill: "SQL", confidence: 85, source: "evidenced" },
      ],
      career_trajectory_summary: "Data science background with strong statistical foundation. Transitioning toward ML engineering with growing PyTorch skills.",
      transferable_skills: ["Data Pipeline Engineering", "Statistical Modeling"],
      growth_signal: "Growing from analytics toward ML engineering — strong foundation expanding into new areas.",
    }
  ),
  bh(
    "David Kim", "ML Engineer", "Tesla", 7, "Palo Alto, CA",
    ["Python", "PyTorch", "Computer Vision", "Machine Learning", "Model Deployment", "CUDA", "C++"],
    [
      { type: "github", url: "https://github.com/davidkim/cv-inference", description: "Optimized CV inference library — 1.5k stars" },
      { type: "certificate", url: "https://nvidia.com/cert/dkim", description: "NVIDIA Deep Learning Certified" },
    ],
    [
      { company: "Tesla", title: "ML Engineer", start_date: "2020", end_date: "present", description: "Autonomous driving vision models. Deployed real-time inference on edge devices." },
      { company: "NVIDIA", title: "ML Engineer", start_date: "2016", end_date: "2020", description: "CUDA optimization for deep learning frameworks." },
    ],
    [{ degree: "MS Computer Science", institution: "CMU", year: "2016" }],
    "David Kim — MS CS CMU. ML Engineer at Tesla. 7 years. Computer vision and model deployment. CUDA optimization. Expert in PyTorch and C++.",
    {
      skill_graph: [
        { skill: "Python", confidence: 92, source: "evidenced" },
        { skill: "PyTorch", confidence: 90, source: "evidenced" },
        { skill: "Computer Vision", confidence: 88, source: "evidenced" },
        { skill: "Model Deployment", confidence: 85, source: "evidenced" },
        { skill: "CUDA", confidence: 82, source: "evidenced" },
        { skill: "C++", confidence: 80, source: "evidenced" },
      ],
      career_trajectory_summary: "Strong CV and systems background. Moved from GPU optimization at NVIDIA to applied ML at Tesla.",
      transferable_skills: ["Edge Computing", "GPU Optimization"],
      growth_signal: "Consistent growth from infrastructure to applied ML at frontier companies.",
    }
  ),
  // === Inflated resume candidates ===
  bh(
    "Kevin O'Brien", "AI Expert", "Self-employed", 4, "Remote",
    ["Python", "Machine Learning", "Deep Learning", "AI", "LLM", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "Reinforcement Learning", "MLOps", "Kubernetes"],
    [],
    [
      { company: "Various startups", title: "AI Consultant", start_date: "2022", end_date: "present", description: "Provided AI consulting services to multiple companies. Implemented cutting-edge solutions." },
      { company: "Freelance", title: "ML Developer", start_date: "2020", end_date: "2022", description: "Worked on various ML projects for clients." },
    ],
    [{ degree: "BS Computer Science", institution: "Online University", year: "2020" }],
    "Kevin O'Brien — AI Expert. 4 years experience. Expert in Machine Learning, Deep Learning, AI, LLM, NLP, Computer Vision, Reinforcement Learning. Self-employed consultant. No specific projects or publications listed.",
    null
  ),
  bh(
    "Rachel Green", "AI Innovator", "Stealth Startup", 3, "Austin, TX",
    ["Python", "Machine Learning", "AI", "Deep Learning", "LLM", "PyTorch", "TensorFlow", "NLP", "GPT", "Transformers", "MLOps", "Kubernetes", "Docker", "AWS"],
    [],
    [
      { company: "Stealth Startup", title: "AI Innovator", start_date: "2023", end_date: "present", description: "Leading AI innovation initiatives. Building next-generation AI products." },
      { company: "TechCorp", title: "Junior Developer", start_date: "2021", end_date: "2023", description: "Worked on various technology projects." },
    ],
    [{ degree: "Bootcamp Certificate", institution: "Coding Bootcamp", year: "2021" }],
    "Rachel Green — AI Innovator. 3 years experience. Expert in Machine Learning, AI, Deep Learning, LLM, GPT, Transformers. Currently at stealth startup. No GitHub, publications, or certifications.",
    null
  ),
  bh(
    "James Wilson", "Senior Developer", "Tech Solutions Inc", 5, "Miami, FL",
    ["Python", "Machine Learning", "AI", "Deep Learning", "Backend", "DevOps", "Cloud", "Microservices", "Kubernetes", "Docker", "AWS", "GCP", "Azure"],
    [],
    [
      { company: "Tech Solutions Inc", title: "Senior Developer", start_date: "2021", end_date: "present", description: "Responsible for development and operations. Led multiple initiatives." },
      { company: "Digital Co", title: "Developer", start_date: "2019", end_date: "2021", description: "Worked on various development tasks." },
    ],
    [{ degree: "Associate Degree", institution: "Community College", year: "2019" }],
    "James Wilson — Senior Developer. 5 years experience. Claims expertise in ML, AI, Deep Learning, Backend, DevOps, Cloud, Microservices. No evidence links, GitHub, or publications. Vague job descriptions.",
    null
  ),
  // === More ML candidates ===
  bh(
    "Lisa Wang", "Senior Data Analyst", "McKinsey & Company", 6, "Chicago, IL",
    ["Python", "SQL", "Statistics", "Machine Learning", "Tableau", "R", "Data Analysis"],
    [
      { type: "certificate", url: "https://coursera.org/verify/lisawang", description: "Google Data Analytics Professional" },
    ],
    [
      { company: "McKinsey & Company", title: "Senior Data Analyst", start_date: "2020", end_date: "present", description: "Built analytics pipelines for Fortune 500 clients. Statistical models for market analysis." },
      { company: "Deloitte", title: "Data Analyst", start_date: "2017", end_date: "2020", description: "Data-driven consulting for financial services clients." },
    ],
    [{ degree: "MS Statistics", institution: "University of Chicago", year: "2017" }],
    "Lisa Wang — MS Statistics UChicago. Senior Data Analyst at McKinsey. 6 years. Strong statistical background with growing ML skills.",
    {
      skill_graph: [
        { skill: "Python", confidence: 80, source: "evidenced" },
        { skill: "Statistics", confidence: 90, source: "evidenced" },
        { skill: "SQL", confidence: 88, source: "evidenced" },
        { skill: "Machine Learning", confidence: 65, source: "claimed" },
        { skill: "R", confidence: 82, source: "evidenced" },
        { skill: "Tableau", confidence: 75, source: "claimed" },
      ],
      career_trajectory_summary: "Strong consulting analytics background. Statistical expertise is transferable to ML but lacks direct ML engineering experience.",
      transferable_skills: ["Statistical Analysis", "Business Intelligence"],
      growth_signal: "Solid analytics career but plateaued — would benefit from ML engineering pivot.",
    }
  ),
  bh(
    "James Liu", "ML Researcher", "DeepMind", 9, "London, UK",
    ["Python", "PyTorch", "NLP", "LLM", "Deep Learning", "Research", "Transformers"],
    [
      { type: "publication", url: "https://arxiv.org/abs/2023.67890", description: "Attention Mechanisms for Long-Context LLMs (ICML 2023)" },
      { type: "publication", url: "https://arxiv.org/abs/2022.11111", description: "Efficient Transformer Training (ACL 2022)" },
      { type: "github", url: "https://github.com/jamesliu/long-attention", description: "Long-context attention implementation — 3.5k stars" },
    ],
    [
      { company: "DeepMind", title: "ML Researcher", start_date: "2019", end_date: "present", description: "Research on efficient LLM architectures. Published at top-tier venues." },
      { company: "OpenAI", title: "Research Engineer", start_date: "2015", end_date: "2019", description: "Early work on transformer architectures and language models." },
    ],
    [{ degree: "PhD Computer Science", institution: "MIT", year: "2015" }],
    "James Liu — PhD CS MIT. ML Researcher at DeepMind. 9 years. NLP and LLM specialist. Multiple publications at ICML, ACL. Expert in transformers and attention mechanisms.",
    {
      skill_graph: [
        { skill: "Python", confidence: 95, source: "evidenced" },
        { skill: "NLP", confidence: 92, source: "evidenced" },
        { skill: "PyTorch", confidence: 90, source: "evidenced" },
        { skill: "LLM", confidence: 95, source: "evidenced" },
        { skill: "Deep Learning", confidence: 93, source: "evidenced" },
        { skill: "Transformers", confidence: 92, source: "evidenced" },
      ],
      career_trajectory_summary: "Elite research career from OpenAI to DeepMind. Pioneer in transformer architectures. Strong publication record.",
      transferable_skills: ["Research-to-Production Translation", "Novel Architecture Design"],
      growth_signal: "Exceptional trajectory — at the frontier of LLM research.",
    }
  ),
  bh(
    "Emily Zhang", "ML Engineer", "NVIDIA", 5, "Santa Clara, CA",
    ["Python", "PyTorch", "TensorFlow", "Machine Learning", "CUDA", "Model Optimization", "TensorRT"],
    [
      { type: "github", url: "https://github.com/emilyzhang/opt-ml", description: "ML optimization toolkit — 900 stars" },
      { type: "certificate", url: "https://nvidia.com/cert/ezhang", description: "NVIDIA TensorRT Certified" },
    ],
    [
      { company: "NVIDIA", title: "ML Engineer", start_date: "2021", end_date: "present", description: "Model optimization for TensorRT. Improved inference speed by 3x for common architectures." },
      { company: "Adobe", title: "ML Engineer", start_date: "2018", end_date: "2021", description: "Image processing ML models for Photoshop." },
    ],
    [{ degree: "MS Electrical Engineering", institution: "Stanford", year: "2018" }],
    "Emily Zhang — MS EE Stanford. ML Engineer at NVIDIA. 5 years. Model optimization specialist. CUDA and TensorRT expert.",
    {
      skill_graph: [
        { skill: "Python", confidence: 90, source: "evidenced" },
        { skill: "PyTorch", confidence: 88, source: "evidenced" },
        { skill: "CUDA", confidence: 85, source: "evidenced" },
        { skill: "Model Optimization", confidence: 88, source: "evidenced" },
        { skill: "TensorFlow", confidence: 75, source: "claimed" },
        { skill: "Machine Learning", confidence: 82, source: "evidenced" },
      ],
      career_trajectory_summary: "Strong optimization-focused career. Moving from applied ML at Adobe to infrastructure at NVIDIA.",
      transferable_skills: ["GPU Computing", "Performance Engineering"],
      growth_signal: "Growing specialization in ML infrastructure and optimization.",
    }
  ),
  bh(
    "Tom Anderson", "Backend Engineer", "Stripe", 8, "San Francisco, CA",
    ["Python", "Go", "PostgreSQL", "Distributed Systems", "Data Infrastructure", "Kafka", "Redis", "Microservices"],
    [
      { type: "github", url: "https://github.com/tomanderson/data-infra", description: "Data infrastructure toolkit — 1.8k stars" },
    ],
    [
      { company: "Stripe", title: "Senior Backend Engineer", start_date: "2020", end_date: "present", description: "Built payment processing infrastructure handling $200B+ annually. Led migration to event-driven architecture." },
      { company: "Uber", title: "Backend Engineer", start_date: "2016", end_date: "2020", description: "Trip routing and pricing services at scale." },
    ],
    [{ degree: "BS Computer Science", institution: "MIT", year: "2016" }],
    "Tom Anderson — BS CS MIT. Senior Backend Engineer at Stripe. 8 years. Payment infrastructure. Data infrastructure specialist. Could pivot to ML infrastructure.",
    {
      skill_graph: [
        { skill: "Python", confidence: 92, source: "evidenced" },
        { skill: "Go", confidence: 88, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 90, source: "evidenced" },
        { skill: "Distributed Systems", confidence: 92, source: "evidenced" },
        { skill: "Data Infrastructure", confidence: 88, source: "evidenced" },
        { skill: "Kafka", confidence: 85, source: "evidenced" },
      ],
      career_trajectory_summary: "Strong backend infrastructure career at top fintech and ride-sharing companies. Deep distributed systems expertise.",
      transferable_skills: ["ML Infrastructure Engineering", "Data Pipeline Architecture"],
      growth_signal: "Excellent trajectory — increasingly senior roles at increasingly prestigious companies.",
    }
  ),
  // === Backend candidates ===
  bh(
    "Michael Torres", "Senior Backend Engineer", "Stripe", 7, "San Francisco, CA",
    ["Python", "Go", "PostgreSQL", "Redis", "Distributed Systems", "Microservices", "Kubernetes", "API Design"],
    [
      { type: "github", url: "https://github.com/mtorres/api-gateway", description: "API gateway framework — 2.2k stars" },
      { type: "publication", url: "https://iee.org/mtorres", description: "Scalable API Design Patterns (IEEE Software 2023)" },
    ],
    [
      { company: "Stripe", title: "Senior Backend Engineer", start_date: "2020", end_date: "present", description: "Designed payment API handling 10K+ req/s. Led microservices migration." },
      { company: "Square", title: "Backend Engineer", start_date: "2016", end_date: "2020", description: "Payment processing and ledger systems." },
    ],
    [{ degree: "MS Computer Science", institution: "UIUC", year: "2016" }],
    "Michael Torres — MS CS UIUC. Senior Backend Engineer at Stripe. 7 years. Payment systems. Distributed systems expert.",
    {
      skill_graph: [
        { skill: "Python", confidence: 90, source: "evidenced" },
        { skill: "Go", confidence: 88, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 92, source: "evidenced" },
        { skill: "Distributed Systems", confidence: 90, source: "evidenced" },
        { skill: "API Design", confidence: 88, source: "evidenced" },
        { skill: "Redis", confidence: 85, source: "evidenced" },
      ],
      career_trajectory_summary: "Strong fintech backend career with consistent growth. API and distributed systems expertise.",
      transferable_skills: ["Financial Systems Design", "High-Availability Architecture"],
      growth_signal: "Steady upward trajectory in seniority and scope.",
    }
  ),
  bh(
    "Jennifer Park", "Backend Engineer", "Datadog", 5, "New York, NY",
    ["Python", "Go", "PostgreSQL", "Redis", "Microservices", "Observability", "Kafka", "Kubernetes"],
    [
      { type: "github", url: "https://github.com/jenpark/metrics-pipeline", description: "High-throughput metrics pipeline — 1.1k stars" },
    ],
    [
      { company: "Datadog", title: "Backend Engineer", start_date: "2021", end_date: "present", description: "Built metrics ingestion pipeline handling 10M+ data points/sec." },
      { company: "Twilio", title: "Backend Engineer", start_date: "2018", end_date: "2021", description: "SMS delivery infrastructure at scale." },
    ],
    [{ degree: "BS Computer Science", institution: "Cornell University", year: "2018" }],
    "Jennifer Park — BS CS Cornell. Backend Engineer at Datadog. 5 years. High-throughput systems. Observability expert.",
    {
      skill_graph: [
        { skill: "Python", confidence: 88, source: "evidenced" },
        { skill: "Go", confidence: 85, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 85, source: "evidenced" },
        { skill: "Microservices", confidence: 82, source: "evidenced" },
        { skill: "Observability", confidence: 88, source: "evidenced" },
        { skill: "Kafka", confidence: 80, source: "evidenced" },
      ],
      career_trajectory_summary: "Solid backend career with focus on observability and high-throughput systems.",
      transferable_skills: ["Real-time Data Processing", "System Monitoring"],
      growth_signal: "Steady growth through increasingly challenging systems.",
    }
  ),
  bh(
    "Alex Thompson", "Backend Engineer", "Cloudflare", 6, "Austin, TX",
    ["Go", "Rust", "Distributed Systems", "Kubernetes", "Microservices", "PostgreSQL", "Redis"],
    [
      { type: "github", url: "https://github.com/athompson/edge-router", description: "Edge routing proxy in Rust — 1.6k stars" },
    ],
    [
      { company: "Cloudflare", title: "Backend Engineer", start_date: "2020", end_date: "present", description: "Built edge routing infrastructure serving 20M+ req/s globally." },
      { company: "DigitalOcean", title: "Backend Engineer", start_date: "2017", end_date: "2020", description: "Cloud orchestration and API services." },
    ],
    [{ degree: "BS Computer Science", institution: "Georgia Tech", year: "2017" }],
    "Alex Thompson — BS CS Georgia Tech. Backend Engineer at Cloudflare. 6 years. Edge computing and distributed systems. Go and Rust specialist.",
    {
      skill_graph: [
        { skill: "Go", confidence: 92, source: "evidenced" },
        { skill: "Rust", confidence: 85, source: "evidenced" },
        { skill: "Distributed Systems", confidence: 90, source: "evidenced" },
        { skill: "Kubernetes", confidence: 82, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 78, source: "claimed" },
        { skill: "Microservices", confidence: 85, source: "evidenced" },
      ],
      career_trajectory_summary: "Infrastructure-focused backend career with edge computing specialization. Systems-level expertise.",
      transferable_skills: ["ML Infrastructure", "Systems Programming"],
      growth_signal: "Strong trajectory from cloud provider to CDN leader.",
    }
  ),
  bh(
    "Priya Sharma", "Backend Engineer", "Uber", 6, "Seattle, WA",
    ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Microservices", "Distributed Systems", "Kubernetes"],
    [
      { type: "publication", url: "https://dl.acm.org/doi/psharma", description: "Geospatial Query Optimization (SIGMOD 2023)" },
      { type: "github", url: "https://github.com/priyasharma/geo-index", description: "Geospatial indexing library — 700 stars" },
    ],
    [
      { company: "Uber", title: "Backend Engineer", start_date: "2020", end_date: "present", description: "Trip routing and geospatial services. Handled 15M+ trips daily." },
      { company: "Lyft", title: "Backend Engineer", start_date: "2017", end_date: "2020", description: "Driver matching and pricing algorithms." },
    ],
    [{ degree: "MS Computer Science", institution: "University of Washington", year: "2017" }],
    "Priya Sharma — MS CS UW. Backend Engineer at Uber. 6 years. Geospatial systems. Distributed systems expert.",
    {
      skill_graph: [
        { skill: "Python", confidence: 88, source: "evidenced" },
        { skill: "Go", confidence: 85, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 90, source: "evidenced" },
        { skill: "Kafka", confidence: 82, source: "evidenced" },
        { skill: "Distributed Systems", confidence: 85, source: "evidenced" },
        { skill: "Redis", confidence: 80, source: "claimed" },
      ],
      career_trajectory_summary: "Strong ride-sharing backend career with geospatial and distributed systems expertise.",
      transferable_skills: ["Geospatial Systems", "Real-time Processing"],
      growth_signal: "Consistent growth at top mobility companies.",
    }
  ),
  bh(
    "Chris Williams", "Full Stack Expert", "Startup Hub", 4, "Remote",
    ["Python", "Go", "JavaScript", "React", "PostgreSQL", "Redis", "Kubernetes", "Docker", "AWS", "Microservices", "DevOps", "Machine Learning", "AI"],
    [],
    [
      { company: "Startup Hub", title: "Full Stack Expert", start_date: "2022", end_date: "present", description: "Built and maintained all systems for startup clients. Handled everything from frontend to DevOps." },
      { company: "Agency", title: "Developer", start_date: "2020", end_date: "2022", description: "Worked on various web projects." },
    ],
    [{ degree: "Online Certificate", institution: "Udemy", year: "2020" }],
    "Chris Williams — Full Stack Expert. 4 years. Claims expertise in everything from frontend to DevOps to ML. No evidence links, GitHub, or publications. Vague descriptions.",
    null
  ),
  bh(
    "Maria Garcia", "DevOps Engineer", "AWS", 7, "Seattle, WA",
    ["Python", "Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Microservices", "Go"],
    [
      { type: "github", url: "https://github.com/mariagarcia/k8s-tools", description: "Kubernetes deployment toolkit — 1.3k stars" },
      { type: "certificate", url: "https://aws.amazon.com/cert/mgarcia", description: "AWS Solutions Architect Professional" },
    ],
    [
      { company: "AWS", title: "DevOps Engineer", start_date: "2020", end_date: "present", description: "Built internal Kubernetes platform serving 200+ teams. Automated deployment pipelines." },
      { company: "HashiCorp", title: "Infrastructure Engineer", start_date: "2017", end_date: "2020", description: "Terraform core development and cloud integrations." },
    ],
    [{ degree: "BS Computer Science", institution: "University of Texas", year: "2017" }],
    "Maria Garcia — BS CS UT Austin. DevOps Engineer at AWS. 7 years. Kubernetes and infrastructure automation specialist.",
    {
      skill_graph: [
        { skill: "Python", confidence: 85, source: "evidenced" },
        { skill: "Kubernetes", confidence: 92, source: "evidenced" },
        { skill: "Docker", confidence: 90, source: "evidenced" },
        { skill: "AWS", confidence: 92, source: "evidenced" },
        { skill: "Terraform", confidence: 88, source: "evidenced" },
        { skill: "Go", confidence: 75, source: "claimed" },
      ],
      career_trajectory_summary: "Strong infrastructure engineering career. Deep Kubernetes and cloud expertise from HashiCorp to AWS.",
      transferable_skills: ["Platform Engineering", "Infrastructure as Code"],
      growth_signal: "Steady growth in infrastructure specialization.",
    }
  ),
  bh(
    "Ryan Chen", "Backend Engineer", "Shopify", 5, "Toronto, Canada",
    ["Python", "Go", "PostgreSQL", "Redis", "Microservices", "Kubernetes", "API Design"],
    [
      { type: "github", url: "https://github.com/ryanchen/shop-api", description: "E-commerce API framework — 800 stars" },
    ],
    [
      { company: "Shopify", title: "Backend Engineer", start_date: "2021", end_date: "present", description: "Built checkout API handling $50B+ in GMV. Microservices architecture." },
      { company: "Etsy", title: "Backend Engineer", start_date: "2018", end_date: "2021", description: "Search and recommendation services." },
    ],
    [{ degree: "BS Computer Science", institution: "University of Toronto", year: "2018" }],
    "Ryan Chen — BS CS UofT. Backend Engineer at Shopify. 5 years. E-commerce APIs. Microservices.",
    {
      skill_graph: [
        { skill: "Python", confidence: 85, source: "evidenced" },
        { skill: "Go", confidence: 82, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 88, source: "evidenced" },
        { skill: "Microservices", confidence: 80, source: "evidenced" },
        { skill: "Redis", confidence: 78, source: "claimed" },
        { skill: "API Design", confidence: 82, source: "evidenced" },
      ],
      career_trajectory_summary: "Solid e-commerce backend career. Growing from mid to senior level.",
      transferable_skills: ["Payment Systems", "High-Scale APIs"],
      growth_signal: "Steady progression through e-commerce leaders.",
    }
  ),
  bh(
    "Nina Patel", "Backend Engineer", "Twilio", 6, "Denver, CO",
    ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Microservices", "API Design"],
    [
      { type: "certificate", url: "https://credly.com/ninapatel", description: "Google Cloud Professional Architect" },
    ],
    [
      { company: "Twilio", title: "Backend Engineer", start_date: "2020", end_date: "present", description: "SMS/messaging infrastructure. 5B+ messages processed monthly." },
      { company: "SendGrid", title: "Backend Engineer", start_date: "2017", end_date: "2020", description: "Email delivery pipeline and analytics." },
    ],
    [{ degree: "MS Computer Science", institution: "CU Boulder", year: "2017" }],
    "Nina Patel — MS CS CU Boulder. Backend Engineer at Twilio. 6 years. Messaging infrastructure. Kafka specialist.",
    {
      skill_graph: [
        { skill: "Python", confidence: 85, source: "evidenced" },
        { skill: "Go", confidence: 80, source: "claimed" },
        { skill: "PostgreSQL", confidence: 85, source: "evidenced" },
        { skill: "Kafka", confidence: 88, source: "evidenced" },
        { skill: "Redis", confidence: 82, source: "evidenced" },
        { skill: "Microservices", confidence: 80, source: "evidenced" },
      ],
      career_trajectory_summary: "Communication infrastructure focus. Solid progression through messaging platforms.",
      transferable_skills: ["Message Queue Systems", "Real-time Processing"],
      growth_signal: "Consistent growth in communications infrastructure.",
    }
  ),
  bh(
    "Sophie Martin", "Backend Engineer", "Atlassian", 5, "Sydney, Australia",
    ["Python", "Java", "PostgreSQL", "Redis", "Microservices", "API Design", "Kubernetes"],
    [
      { type: "github", url: "https://github.com/sophiemartin/collab-api", description: "Collaboration API toolkit — 600 stars" },
    ],
    [
      { company: "Atlassian", title: "Backend Engineer", start_date: "2021", end_date: "present", description: "Built Jira API services. Led migration to microservices architecture." },
      { company: "Canva", title: "Backend Engineer", start_date: "2018", end_date: "2021", description: "Design rendering pipeline and asset management." },
    ],
    [{ degree: "BS Software Engineering", institution: "UNSW", year: "2018" }],
    "Sophie Martin — BS SE UNSW. Backend Engineer at Atlassian. 5 years. Collaboration tools. API specialist.",
    {
      skill_graph: [
        { skill: "Python", confidence: 82, source: "evidenced" },
        { skill: "Java", confidence: 85, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 85, source: "evidenced" },
        { skill: "Microservices", confidence: 80, source: "evidenced" },
        { skill: "API Design", confidence: 82, source: "evidenced" },
        { skill: "Redis", confidence: 75, source: "claimed" },
      ],
      career_trajectory_summary: "Product-focused backend career in collaboration tools. Growing through Australian tech leaders.",
      transferable_skills: ["Product Engineering", "Collaboration Systems"],
      growth_signal: "Steady progression through product-focused companies.",
    }
  ),
  // === Product Designer candidates ===
  bh(
    "Olivia Brown", "Senior Product Designer", "Figma", 7, "San Francisco, CA",
    ["Figma", "User Research", "Prototyping", "Design Systems", "UX Design", "Accessibility", "Design Tokens"],
    [
      { type: "portfolio", url: "https://oliviabrown.design", description: "Portfolio — 15+ shipped products with case studies" },
      { type: "publication", url: "https://medium.com/@oliviabrown", description: "Design Systems at Scale — 50K+ reads" },
    ],
    [
      { company: "Figma", title: "Senior Product Designer", start_date: "2021", end_date: "present", description: "Led design for Figma's developer mode. Built and maintained the component design system." },
      { company: "Airbnb", title: "Product Designer", start_date: "2017", end_date: "2021", description: "Booking flow redesign. Conducted 40+ user research sessions." },
    ],
    [{ degree: "BFA Interaction Design", institution: "Parsons", year: "2017" }],
    "Olivia Brown — BFA Parsons. Senior Product Designer at Figma. 7 years. Design systems expert. Published writer.",
    {
      skill_graph: [
        { skill: "Figma", confidence: 95, source: "evidenced" },
        { skill: "User Research", confidence: 88, source: "evidenced" },
        { skill: "Design Systems", confidence: 92, source: "evidenced" },
        { skill: "Prototyping", confidence: 90, source: "evidenced" },
        { skill: "UX Design", confidence: 88, source: "evidenced" },
        { skill: "Accessibility", confidence: 80, source: "claimed" },
      ],
      career_trajectory_summary: "Top-tier product design career from Airbnb to Figma. Design systems leadership with strong research foundation.",
      transferable_skills: ["Design Engineering", "Component Architecture"],
      growth_signal: "Excellent trajectory — leading design at the industry's design tool.",
    }
  ),
  bh(
    "Henry Davis", "UX Designer", "Airbnb", 5, "Portland, OR",
    ["Figma", "User Research", "Prototyping", "Accessibility", "UX Design", "Usability Testing"],
    [
      { type: "portfolio", url: "https://henrydavisux.com", description: "Portfolio with 8 detailed case studies" },
      { type: "publication", url: "https://uxmatters.com/henrydavis", description: "Inclusive Design Patterns (UX Matters)" },
    ],
    [
      { company: "Airbnb", title: "UX Designer", start_date: "2021", end_date: "present", description: "Accessibility lead for booking flows. Conducted 60+ usability tests." },
      { company: "Mailchimp", title: "UX Designer", start_date: "2018", end_date: "2021", description: "Email campaign builder redesign." },
    ],
    [{ degree: "MS Human-Computer Interaction", institution: "University of Washington", year: "2018" }],
    "Henry Davis — MS HCI UW. UX Designer at Airbnb. 5 years. Accessibility specialist. Published researcher.",
    {
      skill_graph: [
        { skill: "Figma", confidence: 90, source: "evidenced" },
        { skill: "User Research", confidence: 92, source: "evidenced" },
        { skill: "Accessibility", confidence: 88, source: "evidenced" },
        { skill: "Prototyping", confidence: 85, source: "evidenced" },
        { skill: "UX Design", confidence: 88, source: "evidenced" },
        { skill: "Usability Testing", confidence: 90, source: "evidenced" },
      ],
      career_trajectory_summary: "Research-heavy UX career with accessibility specialization. Strong academic foundation.",
      transferable_skills: ["Inclusive Design", "Research Methodology"],
      growth_signal: "Growing from general UX to accessibility specialization.",
    }
  ),
  bh(
    "Emma Wilson", "Product Designer", "Notion", 4, "Remote",
    ["Figma", "Prototyping", "Design Systems", "UX Design", "HTML/CSS", "JavaScript", "Frontend"],
    [
      { type: "portfolio", url: "https://emmawilson.design", description: "Portfolio with 6 case studies showing end-to-end process" },
    ],
    [
      { company: "Notion", title: "Product Designer", start_date: "2022", end_date: "present", description: "Designed database views feature. Maintained design token system." },
      { company: "Linear", title: "Junior Product Designer", start_date: "2020", end_date: "2022", description: "Issue tracking UI. Contributed to design system." },
    ],
    [{ degree: "BA Design", institution: "RISD", year: "2020" }],
    "Emma Wilson — BA Design RISD. Product Designer at Notion. 4 years. Design systems with frontend skills.",
    {
      skill_graph: [
        { skill: "Figma", confidence: 88, source: "evidenced" },
        { skill: "Design Systems", confidence: 85, source: "evidenced" },
        { skill: "Prototyping", confidence: 82, source: "evidenced" },
        { skill: "UX Design", confidence: 80, source: "evidenced" },
        { skill: "HTML/CSS", confidence: 75, source: "claimed" },
        { skill: "JavaScript", confidence: 65, source: "claimed" },
      ],
      career_trajectory_summary: "Rising product designer with design engineering leanings. Frontend skills make her cross-functional.",
      transferable_skills: ["Design Engineering", "Design Tokens"],
      growth_signal: "Strong early-career trajectory at top product companies.",
    }
  ),
  bh(
    "Lucas Miller", "Design Expert", "Creative Agency", 3, "Los Angeles, CA",
    ["Figma", "User Research", "Prototyping", "Design Systems", "UX Design", "UI Design", "Branding", "Motion Design", "3D Design", "Frontend"],
    [],
    [
      { company: "Creative Agency", title: "Design Expert", start_date: "2022", end_date: "present", description: "Designed various products for agency clients. Handled all aspects of design." },
      { company: "Freelance", title: "Designer", start_date: "2021", end_date: "2022", description: "Worked on design projects for various clients." },
    ],
    [{ degree: "Certificate", institution: "Design Bootcamp", year: "2021" }],
    "Lucas Miller — Design Expert. 3 years. Claims expertise in everything from UX to 3D design to frontend. No portfolio link, no publications. Vague descriptions.",
    null
  ),
  bh(
    "Ava Martinez", "Product Designer", "Linear", 5, "Remote",
    ["Figma", "User Research", "Prototyping", "Design Systems", "UX Design", "Motion Design"],
    [
      { type: "portfolio", url: "https://avamartinez.design", description: "Portfolio — 10 case studies with process documentation" },
    ],
    [
      { company: "Linear", title: "Product Designer", start_date: "2021", end_date: "present", description: "Designed keyboard-driven navigation system. Led the motion design language." },
      { company: "Vercel", title: "Product Designer", start_date: "2018", end_date: "2021", description: "Dashboard and deployment flow design." },
    ],
    [{ degree: "BS Cognitive Science", institution: "UC San Diego", year: "2018" }],
    "Ava Martinez — BS CogSci UCSD. Product Designer at Linear. 5 years. Motion design specialist. Keyboard UX pioneer.",
    {
      skill_graph: [
        { skill: "Figma", confidence: 90, source: "evidenced" },
        { skill: "Prototyping", confidence: 92, source: "evidenced" },
        { skill: "Design Systems", confidence: 85, source: "evidenced" },
        { skill: "Motion Design", confidence: 88, source: "evidenced" },
        { skill: "UX Design", confidence: 85, source: "evidenced" },
        { skill: "User Research", confidence: 78, source: "claimed" },
      ],
      career_trajectory_summary: "Strong product design career with motion design specialization. CogSci background adds depth to interaction work.",
      transferable_skills: ["Interaction Design", "Motion Systems"],
      growth_signal: "Excellent trajectory through developer-focused tools.",
    }
  ),
  // === Transferable candidates ===
  bh(
    "Zoe Taylor", "Data Engineer", "Snowflake", 6, "San Jose, CA",
    ["Python", "SQL", "Airflow", "Spark", "Data Pipelines", "PostgreSQL", "Kafka", "dbt"],
    [
      { type: "github", url: "https://github.com/zoetaylor/data-pipeline", description: "ETL framework — 1.4k stars" },
    ],
    [
      { company: "Snowflake", title: "Data Engineer", start_date: "2021", end_date: "present", description: "Built data pipeline infrastructure processing petabytes. Spark and Airflow orchestration." },
      { company: "Databricks", title: "Data Engineer", start_date: "2017", end_date: "2021", description: "Lakehouse architecture and ETL pipelines." },
    ],
    [{ degree: "MS Data Science", institution: "NYU", year: "2017" }],
    "Zoe Taylor — MS Data Science NYU. Data Engineer at Snowflake. 6 years. Data pipeline infrastructure. Could pivot to ML infrastructure.",
    {
      skill_graph: [
        { skill: "Python", confidence: 90, source: "evidenced" },
        { skill: "SQL", confidence: 95, source: "evidenced" },
        { skill: "Data Pipelines", confidence: 92, source: "evidenced" },
        { skill: "Spark", confidence: 85, source: "evidenced" },
        { skill: "Airflow", confidence: 88, source: "evidenced" },
        { skill: "Kafka", confidence: 80, source: "claimed" },
      ],
      career_trajectory_summary: "Strong data engineering career at top data infrastructure companies. Pipeline expertise is directly transferable to ML infrastructure.",
      transferable_skills: ["ML Pipeline Engineering", "Data Infrastructure"],
      growth_signal: "Excellent trajectory — increasingly senior roles at data infrastructure leaders.",
    }
  ),
  bh(
    "Ben Carter", "Full Stack Developer", "Vercel", 5, "Remote",
    ["Python", "JavaScript", "React", "Next.js", "PostgreSQL", "Node.js", "TypeScript", "GraphQL"],
    [
      { type: "github", url: "https://github.com/bencarter/fullstack-kit", description: "Full-stack starter kit — 2.5k stars" },
    ],
    [
      { company: "Vercel", title: "Full Stack Developer", start_date: "2021", end_date: "present", description: "Built developer dashboard and API. Next.js and edge functions." },
      { company: "Supabase", title: "Full Stack Developer", start_date: "2018", end_date: "2021", description: "Real-time API and authentication systems." },
    ],
    [{ degree: "BS Computer Science", institution: "Waterloo", year: "2018" }],
    "Ben Carter — BS CS Waterloo. Full Stack Developer at Vercel. 5 years. Can pivot to backend or frontend roles.",
    {
      skill_graph: [
        { skill: "JavaScript", confidence: 90, source: "evidenced" },
        { skill: "React", confidence: 88, source: "evidenced" },
        { skill: "Python", confidence: 82, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 80, source: "evidenced" },
        { skill: "Node.js", confidence: 85, source: "evidenced" },
        { skill: "TypeScript", confidence: 82, source: "claimed" },
      ],
      career_trajectory_summary: "Versatile full-stack developer. Can pivot to either backend engineering or product design-adjacent roles.",
      transferable_skills: ["Backend Engineering", "Frontend Architecture"],
      growth_signal: "Strong trajectory through developer-focused companies.",
    }
  ),
  bh(
    "Max Fischer", "Frontend Engineer", "Vercel", 4, "Berlin, Germany",
    ["JavaScript", "React", "TypeScript", "Figma", "CSS", "Next.js", "Design Systems"],
    [
      { type: "github", url: "https://github.com/maxfischer/ui-kit", description: "React UI component library — 1.1k stars" },
      { type: "portfolio", url: "https://maxfischer.dev", description: "Design engineering portfolio" },
    ],
    [
      { company: "Vercel", title: "Frontend Engineer", start_date: "2022", end_date: "present", description: "Built Vercel dashboard UI components. Maintained design system." },
      { company: "Stripe", title: "Frontend Engineer", start_date: "2020", end_date: "2022", description: "Payment form components and checkout UI." },
    ],
    [{ degree: "BS Interaction Design", institution: "FH Potsdam", year: "2020" }],
    "Max Fischer — BS Interaction Design. Frontend Engineer at Vercel. 4 years. Design-engineering hybrid. Could pivot to product design.",
    {
      skill_graph: [
        { skill: "JavaScript", confidence: 88, source: "evidenced" },
        { skill: "React", confidence: 90, source: "evidenced" },
        { skill: "TypeScript", confidence: 85, source: "evidenced" },
        { skill: "Figma", confidence: 75, source: "claimed" },
        { skill: "CSS", confidence: 88, source: "evidenced" },
        { skill: "Design Systems", confidence: 82, source: "evidenced" },
      ],
      career_trajectory_summary: "Design-engineering hybrid career. Strong frontend with growing design sensibility. Natural pivot to product design.",
      transferable_skills: ["Product Design", "Design Engineering"],
      growth_signal: "Growing from pure frontend toward design-engineering hybrid.",
    }
  ),
  bh(
    "Diana Foster", "ML Research Intern", "Stanford NLP Group", 1, "Stanford, CA",
    ["Python", "PyTorch", "NLP", "Transformers", "Research"],
    [
      { type: "publication", url: "https://arxiv.org/abs/2025.99999", description: "Efficient Tokenization for Low-Resource Languages (EMNLP 2025 workshop)" },
    ],
    [
      { company: "Stanford NLP Group", title: "ML Research Intern", start_date: "2025", end_date: "present", description: "Research on multilingual LLMs. Published at EMNLP workshop." },
    ],
    [{ degree: "BS Computer Science (in progress)", institution: "Stanford University", year: "2026" }],
    "Diana Foster — BS CS Stanford (in progress). ML Research Intern at Stanford NLP Group. 1 year. Published at EMNLP. Early career with strong research potential.",
    {
      skill_graph: [
        { skill: "Python", confidence: 80, source: "evidenced" },
        { skill: "PyTorch", confidence: 75, source: "evidenced" },
        { skill: "NLP", confidence: 78, source: "evidenced" },
        { skill: "Transformers", confidence: 72, source: "claimed" },
        { skill: "Research", confidence: 70, source: "evidenced" },
      ],
      career_trajectory_summary: "Promising early-career researcher. Already published at a top venue. Strong academic foundation.",
      transferable_skills: ["Research Methodology", "Academic Writing"],
      growth_signal: "Early career with exceptional trajectory — published research as an undergrad.",
    }
  ),
  bh(
    "Robert Hayes", "Software Engineer", "Oracle", 10, "Austin, TX",
    ["Java", "Python", "Oracle DB", "PostgreSQL", "Microservices", "Cloud", "Leadership"],
    [
      { type: "certificate", url: "https://oracle.com/cert/rhayes", description: "Oracle Cloud Architect Certified" },
    ],
    [
      { company: "Oracle", title: "Senior Software Engineer", start_date: "2018", end_date: "present", description: "Led database cloud services team. Managed migration of legacy systems to microservices." },
      { company: "IBM", title: "Software Engineer", start_date: "2014", end_date: "2018", description: "Enterprise application development." },
    ],
    [{ degree: "BS Computer Science", institution: "UT Austin", year: "2014" }],
    "Robert Hayes — BS CS UT Austin. Senior Software Engineer at Oracle. 10 years. Enterprise background. Java and database specialist.",
    {
      skill_graph: [
        { skill: "Java", confidence: 90, source: "evidenced" },
        { skill: "Python", confidence: 70, source: "claimed" },
        { skill: "Oracle DB", confidence: 92, source: "evidenced" },
        { skill: "PostgreSQL", confidence: 75, source: "claimed" },
        { skill: "Microservices", confidence: 80, source: "evidenced" },
        { skill: "Leadership", confidence: 82, source: "evidenced" },
      ],
      career_trajectory_summary: "Long enterprise career with leadership experience. Solid but traditional trajectory — may need to modernize skills for startup environments.",
      transferable_skills: ["Enterprise Architecture", "Team Leadership"],
      growth_signal: "Plateaued in enterprise — strong experience but may lack startup agility.",
    }
  ),
];

export async function seedDemoData() {
  const existingJobs = await base44.entities.Job.list();
  if (existingJobs.length > 0) {
    return { skipped: true, message: "Data already exists. Clear jobs to re-seed." };
  }

  const createdJobs = await base44.entities.Job.bulkCreate(JOBS);
  const createdCandidates = await base44.entities.Candidate.bulkCreate(CANDIDATES);

  return {
    skipped: false,
    jobs: createdJobs.length,
    candidates: createdCandidates.length,
  };
}