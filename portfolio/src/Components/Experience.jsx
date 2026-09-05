import React from 'react';
import { Box, Typography } from '@mui/material';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';

const renderJourneyIcon = (icon) => {
  if (React.isValidElement(icon)) return icon;
  const iconStr = String(icon || '').toLowerCase();
  if (iconStr === 'tree' || iconStr.includes('branch')) return <AccountTreeRoundedIcon />;
  if (iconStr === 'rocket' || iconStr.includes('launch')) return <RocketLaunchRoundedIcon />;
  if (iconStr === 'school' || iconStr.includes('learn') || iconStr.includes('grad')) return <SchoolRoundedIcon />;
  if (iconStr === 'work' || iconStr.includes('job') || iconStr.includes('briefcase')) return <WorkRoundedIcon />;
  if (iconStr === 'terminal') return <TerminalRoundedIcon />;
  if (iconStr === 'star') return <StarsRoundedIcon />;
  if (iconStr.length <= 4 && !iconStr.includes('icon')) {
    return <span style={{ fontSize: 16 }}>{icon}</span>;
  }
  return <CodeRoundedIcon />;
};

const defaultJourney = [
  { year: '2021', title: 'Started Journey', detail: 'Started learning\nHTML, CSS & JS', icon: 'code' },
  { year: '2022', title: 'Frontend Developer', detail: 'Built interactive\nUI with React', icon: 'tree' },
  { year: '2023', title: 'Full Stack Developer', detail: 'Started building\nfull stack apps', icon: 'code' },
  { year: '2024', title: 'Building Solutions', detail: 'Creating scalable\nsolutions', icon: 'rocket' },
];

const defaultWorkExperience = [
  {
    role: 'Senior Full Stack Engineer (Contract)',
    company: 'Apex Digital Labs',
    location: 'Remote · San Francisco',
    period: '2023 - Present',
    bullets: [
      'Architected and delivered high-throughput real-time collaboration dashboards using React 19, Socket.io, and Redis pub/sub.',
      'Reduced average API response latencies by 42% through query index restructuring and Redis caching layers.',
      'Mentored a team of 4 junior developers on TypeScript best practices, CI/CD workflows, and code review rigor.',
    ],
    tags: ['React', 'Node.js', 'Redis', 'Docker', 'AWS ECS', 'TypeScript'],
  },
  {
    role: 'Frontend Software Engineer',
    company: 'TechFlow Solutions',
    location: 'Hybrid · New York, NY',
    period: '2022 - 2023',
    bullets: [
      'Engineered an enterprise design system in Material-UI and Tailwind CSS adopted by 5 product squads.',
      'Spearheaded the migration of legacy Single Page Apps to Next.js App Router, boosting Lighthouse SEO scores to 98+.',
      'Implemented automated Cypress and React Testing Library suites, lowering regression escape rate by 60%.',
    ],
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Figma'],
  },
  {
    role: 'Full Stack Web Developer Intern',
    company: 'Innovate Byte',
    location: 'Remote',
    period: '2021 - 2022',
    bullets: [
      'Developed and maintained REST API endpoints for user onboarding, profile authentication, and role authorization.',
      'Integrated Stripe Checkout and webhooks for seamless subscription billing cycles.',
      'Collaborated with UX designers to build responsive mobile-first landing pages and interactive client portals.',
    ],
    tags: ['JavaScript', 'Express.js', 'MongoDB', 'HTML5/CSS3', 'Git'],
  },
];

const defaultEducation = [
  {
    degree: 'Bachelor of Technology in Computer Science & Engineering',
    institution: 'University Institute of Technology',
    period: '2019 - 2023',
    grade: 'GPA: 8.8 / 10.0 (First Class with Distinction)',
    courses: 'Data Structures & Algorithms, Distributed Systems, Database Management Systems, Computer Networks, Software Engineering.',
  },
  {
    degree: 'Higher Secondary Education (Physics, Chemistry, Math & CS)',
    institution: 'St. Xavier Senior Secondary School',
    period: '2017 - 2019',
    grade: 'Score: 94.6%',
    courses: 'Computer Science (C++ & Python), Advanced Mathematics, Physics, Logic Design.',
  },
];

export default function Experience({ onNavigate, onOpenResume }) {
  const settings = useSiteSettings();
  const entries = Array.isArray(settings?.experienceJourney) && settings.experienceJourney.length ? settings.experienceJourney : defaultJourney;
  const workList = Array.isArray(settings?.workExperience) && settings.workExperience.length ? settings.workExperience : defaultWorkExperience;
  const educationList = Array.isArray(settings?.education) && settings.education.length ? settings.education : defaultEducation;

  return (
    <Box className="experience-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Experience" onOpenResume={onOpenResume} />
      
      {/* Visual Journey Hero */}
      <main className="experience-hero">
        <section className="experience-copy">
          <Typography className="experience-kicker">{settings?.experienceKicker || '// MY JOURNEY'}</Typography>
          <Typography component="h1" className="experience-title">
            {settings?.experienceTitle ? settings.experienceTitle : <>Learning. Building.<br /><Box component="span">Growing.</Box></>}
          </Typography>
          <Typography className="experience-description">
            {settings?.experienceDescription || 'My journey as a developer has been about constant learning, building amazing things and solving real world problems.'}
          </Typography>
        </section>

        <section className="experience-timeline" aria-label="Career journey">
          <Box className="experience-track" />
          {entries.map((item) => (
            <Box className="experience-entry" key={item.year}>
              <Box className="experience-card">
                <Typography className="experience-year">{item.year}</Typography>
                <Typography className="experience-role">{item.title}</Typography>
                <Typography className="experience-detail">{item.detail}</Typography>
              </Box>
              <Box className="experience-node">{renderJourneyIcon(item.icon)}</Box>
            </Box>
          ))}
        </section>
      </main>

      {/* Feature 7: Work Experience History Cards */}
      <section className="work-experience-section">
        <Typography className="work-exp-kicker">{"// PROFESSIONAL WORK HISTORY"}</Typography>
        <Typography component="h2" className="work-exp-title">Where I&apos;ve Made an Impact</Typography>
        <Box className="work-exp-cards">
          {workList.map((job, index) => (
            <Box key={index} className="work-exp-card">
              <div className="work-exp-card-header">
                <div>
                  <Typography className="work-exp-role">{job.role}</Typography>
                  <Typography className="work-exp-company">
                    <BusinessRoundedIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {job.company}
                    <span style={{ margin: '0 8px', opacity: 0.4 }}>•</span>
                    <LocationOnOutlinedIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.3 }} />
                    {job.location}
                  </Typography>
                </div>
                <span className="work-exp-date">{job.period}</span>
              </div>

              <ul className="work-exp-bullets">
                {job.bullets?.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>

              <div className="work-exp-tags">
                {job.tags?.map((tag) => (
                  <span key={tag} className="work-exp-tag">{tag}</span>
                ))}
              </div>
            </Box>
          ))}
        </Box>
      </section>

      {/* Feature 8: Education & Academic Credentials */}
      <section className="education-section">
        <Typography className="edu-kicker">{"// ACADEMIC FOUNDATION"}</Typography>
        <Typography component="h2" className="edu-title">Education &amp; Qualifications</Typography>
        <Box className="edu-cards">
          {educationList.map((edu, idx) => (
            <Box key={idx} className="edu-card">
              <Typography className="edu-degree">{edu.degree}</Typography>
              <Typography className="edu-institution">{edu.institution}</Typography>
              <div className="edu-meta">
                <span className="edu-badge">{edu.period}</span>
                <span className="edu-badge" style={{ background: '#fef3c7', color: '#b45309' }}>{edu.grade}</span>
              </div>
              <p className="edu-courses">
                <strong>Core Studies:</strong> {edu.courses}
              </p>
            </Box>
          ))}
        </Box>
      </section>
    </Box>
  );
}
