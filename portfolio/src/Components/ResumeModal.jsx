import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Divider,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import sounds from '../utils/SoundManager';
import useSiteSettings from '../hooks/useSiteSettings';

const defaultWorkExperience = [
  {
    role: 'Senior Full Stack Developer',
    company: 'Apex Digital Labs',
    location: 'Remote · San Francisco',
    period: '2023 — Present',
    bullets: [
      'Architected and delivered 10+ end-to-end full-stack web applications using React, Next.js, Node.js, and MongoDB.',
      'Decreased initial page load times by 45% through aggressive bundle splitting, image caching, and lazy loading strategies.',
      'Designed resilient RESTful and GraphQL APIs with automated unit and integration test suites.',
    ],
    tags: ['React', 'Node.js', 'Redis', 'Docker', 'AWS ECS', 'TypeScript'],
  },
  {
    role: 'Frontend Software Engineer',
    company: 'TechFlow Agency',
    location: 'Remote',
    period: '2022 — 2023',
    bullets: [
      'Developed responsive, accessibility-compliant (WCAG 2.1 AA) UI components in React and Tailwind CSS.',
      'Implemented real-time WebSocket notifications and live collaborative feeds for 20,000+ monthly active users.',
    ],
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Figma'],
  },
];

const defaultEducation = [
  {
    degree: 'Bachelor of Technology in Computer Science & Engineering',
    institution: 'University Institute of Technology',
    period: '2019 — 2023',
    grade: 'GPA: 8.8 / 10.0 (First Class with Distinction)',
    courses: 'Data Structures & Algorithms, Distributed Systems, Database Management Systems, Computer Networks, Software Engineering.',
  },
];

export default function ResumeModal({ open, onClose }) {
  const settings = useSiteSettings();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const name = settings?.name || 'John Doe';
  const role = settings?.role || 'Full Stack Developer';
  const email = settings?.email || 'johndoe@example.com';
  const phone = settings?.phone || '+1 (123) 456-7890';
  const location = settings?.location || 'San Francisco, CA';
  const github = settings?.github || 'https://github.com';
  const linkedin = settings?.linkedin || 'https://linkedin.com';
  const summary = settings?.description || 'Passionate Full Stack Developer with 3+ years of experience building modern, high-performance web applications and digital products.';

  const workList = Array.isArray(settings?.workExperience) && settings.workExperience.length > 0
    ? settings.workExperience
    : defaultWorkExperience;

  const educationList = Array.isArray(settings?.education) && settings.education.length > 0
    ? settings.education
    : defaultEducation;

  const techMap = settings?.technologies && Object.keys(settings.technologies).length > 0
    ? settings.technologies
    : null;

  const handlePrint = () => {
    sounds.playSuccess();
    window.print();
  };

  const handleCopyText = () => {
    sounds.playClick();
    const expText = workList.map((w) => `- ${w.role} at ${w.company} (${w.period})\n  ${Array.isArray(w.bullets) ? w.bullets.join('\n  ') : ''}`).join('\n\n');
    const eduText = educationList.map((e) => `- ${e.degree} | ${e.institution} (${e.period})`).join('\n');

    const resumeText = `
${name} - ${role}
Location: ${location} | Email: ${email} | Phone: ${phone}
GitHub: ${github} | LinkedIn: ${linkedin}

SUMMARY:
${summary}

EXPERIENCE:
${expText}

EDUCATION:
${eduText}
    `.trim();

    navigator.clipboard.writeText(resumeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '20px', sm: '24px' },
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.4)',
            m: { xs: 1.5, sm: 3 },
            maxHeight: { xs: '92vh', sm: '90vh' },
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 1.8, sm: 2.5, md: 3.5 }, bgcolor: 'background.paper' }}>
        {/* Modal Top Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              label="ATS Optimized"
              size="small"
              sx={{
                bgcolor: 'var(--accent-soft, #dcfce7)',
                color: 'var(--accent-dark, #16a34a)',
                fontWeight: 800,
                fontSize: 11,
              }}
            />
            <Typography sx={{ fontSize: 13, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Interactive CV Viewer
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {settings?.resumeUrl && (
              <Button
                variant="outlined"
                size="small"
                component="a"
                href={settings.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download="resume.pdf"
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  borderColor: 'var(--accent-color, #22c55e)',
                  color: 'var(--accent-dark, #16a34a)',
                }}
              >
                Download PDF File
              </Button>
            )}

            <Tooltip title="Copy Plain Text Resume">
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopyText}
                startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                }}
              >
                {copied ? 'Copied!' : 'Copy Text'}
              </Button>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              onClick={handlePrint}
              startIcon={<PrintRoundedIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                bgcolor: 'var(--accent-color, #22c55e)',
                '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
              }}
            >
              Print / Save PDF
            </Button>

            <IconButton onClick={onClose} size="small" aria-label="Close resume">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Box>

        {settings?.resumeUrl ? (
          <Box
            component="iframe"
            title="Uploaded resume PDF"
            src={settings.resumeUrl}
            sx={{
              display: 'block',
              width: '100%',
              height: { xs: '68vh', sm: '72vh' },
              minHeight: 480,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              bgcolor: '#fff',
            }}
          />
        ) : (
          /* Printable Resume Container */
          <Box
            className="printable-resume"
            sx={{
              p: { xs: 2, sm: 4 },
              bgcolor: (t) => (t.palette.mode === 'dark' ? '#0f172a' : '#ffffff'),
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
          {/* Header */}
          <Box sx={{ borderBottom: '2px solid var(--accent-color, #22c55e)', pb: 2.5, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
              {name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'var(--accent-dark, #16a34a)', fontWeight: 700, mt: 0.2 }}>
              {role}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 2.5 }, mt: 1.5, fontSize: 12, color: 'text.secondary' }}>
              <span>📍 {location}</span>
              <span>✉️ {email}</span>
              <span>📞 {phone}</span>
              <span>🌐 <a href={github} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>GitHub</a></span>
              <span>💼 <a href={linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a></span>
            </Box>
          </Box>

          {/* Interactive Section Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => {
                sounds.playBlip();
                setActiveTab(val);
              }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: { xs: 11.5, sm: 13 }, minWidth: 'auto', px: { xs: 1.2, sm: 2 } },
                '& .Mui-selected': { color: 'var(--accent-dark, #16a34a) !important' },
                '& .MuiTabs-indicator': { bgcolor: 'var(--accent-color, #22c55e)' },
              }}
            >
              <Tab icon={<CodeRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />} iconPosition="start" label="Overview" />
              <Tab icon={<WorkOutlineRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />} iconPosition="start" label="Experience" />
              <Tab icon={<SchoolRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />} iconPosition="start" label="Education & Skills" />
            </Tabs>
          </Box>

          {/* Tab 0 / 1: Professional Experience */}
          {(activeTab === 0 || activeTab === 1) && (
            <Box sx={{ mb: 3.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-dark, #16a34a)', letterSpacing: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkOutlineRoundedIcon fontSize="small" /> PROFESSIONAL EXPERIENCE
              </Typography>

              <Stack spacing={2.5}>
                {workList.map((job, jIdx) => (
                  <Box key={jIdx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{job.role}</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{job.period}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: 'var(--accent-dark, #16a34a)', fontWeight: 600, mb: 0.8 }}>
                      {job.company} {job.location ? `· ${job.location}` : ''}
                    </Typography>
                    <Typography component="ul" sx={{ pl: 2, m: 0, fontSize: 13, color: 'text.secondary', '& li': { mb: 0.5 } }}>
                      {Array.isArray(job.bullets) ? job.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>) : <li>{job.detail || ''}</li>}
                    </Typography>
                    {Array.isArray(job.tags) && job.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mt: 1 }}>
                        {job.tags.map((t) => (
                          <Chip key={t} label={t} size="small" sx={{ fontSize: 10, height: 20 }} />
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Tab 0 / 2: Education & Skills */}
          {(activeTab === 0 || activeTab === 2) && (
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-dark, #16a34a)', letterSpacing: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolRoundedIcon fontSize="small" /> TECHNICAL EXPERTISE &amp; EDUCATION
              </Typography>

              {techMap && (
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  {Object.entries(techMap).map(([cat, list]) => (
                    <Grid xs={12} sm={6} key={cat}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.8, textTransform: 'capitalize' }}>
                        {cat}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                        {Array.isArray(list) && list.map((tech) => (
                          <Chip key={tech.name || tech} label={tech.name || tech} size="small" sx={{ fontSize: 11 }} />
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {educationList.map((edu, eIdx) => (
                  <Box key={eIdx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>{edu.degree}</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {edu.institution} {edu.grade ? `· ${edu.grade}` : ''}
                      </Typography>
                      {edu.courses && (
                        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.3 }}>
                          <strong>Studies:</strong> {edu.courses}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{edu.period}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

