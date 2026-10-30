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
import { PortfolioNavigation } from './PortfolioNavigation';
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

const defaultJourney = [];

const defaultWorkExperience = [];

const defaultEducation = [];

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
          {settings?.experienceKicker ? <Typography className="experience-kicker">{settings.experienceKicker}</Typography> : null}
          {settings?.experienceTitle ? (
            <Typography component="h1" className="experience-title">{settings.experienceTitle}</Typography>
          ) : null}
          {settings?.experienceDescription ? (
            <Typography className="experience-description">{settings.experienceDescription}</Typography>
          ) : null}
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
