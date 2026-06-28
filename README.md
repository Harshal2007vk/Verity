# AI Recruiter App

## Project Overview
The AI Recruiter App is a modern, intelligent recruitment platform designed to streamline the hiring process. It leverages advanced AI models to parse resumes, match candidates to job descriptions, and rank them based on their suitability, saving recruiters hours of manual screening.

## System Architecture
The system consists of a Vite-powered React frontend and a Node.js/Express backend, integrated with a PostgreSQL database (via Supabase). The AI processing pipeline uses Google's Gemini and Groq APIs for natural language understanding and data extraction.

## Features
- **Smart Resume Parsing**: Automatically extracts skills, experience, and contact details from PDF resumes.
- **AI-Powered Candidate Ranking**: Matches extracted candidate profiles against specific job descriptions and assigns a compatibility score.
- **Interactive Dashboard**: Modern UI for recruiters to view applicants, job postings, and AI ranking results.
- **Secure Storage**: Robust handling of applicant data and resume files using Supabase storage and PostgreSQL.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database & Storage**: PostgreSQL, Supabase
- **AI & NLP**: Gemini API, Groq API
- **Others**: PDF-Parse for resume extraction, React Query for data fetching

## Environment Variables Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in the required API keys and connection strings:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `GROQ_API_KEY`: Your Groq API key.
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string.
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Supabase project credentials.
   - `PORT`: Backend server port (default 5000).

*Note: Never commit your `.env` file to version control.*

## Local Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Harshal2007vk/Verity.git
   cd AI-Recruiter-App
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up the Database**: Ensure your Supabase instance is running and the necessary tables are created.

## How to Run Frontend & Backend
You can run both the frontend and backend concurrently using the provided npm script:

```bash
npm start
```
*This will start the Vite frontend dev server and the backend Express server simultaneously.*

Alternatively, you can run them separately:
- **Backend only**: `npm run server:dev`
- **Frontend only**: `npm run dev`

## How the AI Ranking Pipeline Works
1. **Upload & Parse**: The recruiter uploads a batch of PDF resumes. The backend extracts text using `pdf-parse`.
2. **Extraction**: The Gemini/Groq API processes the raw text to extract structured data (skills, experience, education).
3. **Matching**: The extracted profile is compared against the specific requirements of the selected Job Description.
4. **Scoring**: The AI model evaluates the match and returns a score out of 100, along with a brief justification.
5. **Display**: The results are stored in the database and presented in the frontend dashboard, sorted by highest match score.
