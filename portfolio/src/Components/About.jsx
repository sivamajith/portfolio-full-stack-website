import React from 'react';
import { Box, Button, Container, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const timelineData = [
  { year: '2021', title: 'Started Journey', subtitle: 'Learned HTML, CSS, JavaScript, and Core CS Algorithms' },
  { year: '2022', title: 'Frontend Developer', subtitle: 'Specialized in React, Next.js, and Modern UI design systems' },
  { year: '2023', title: 'Full Stack Developer', subtitle: 'Architected Node.js microservices, MongoDB, and AWS cloud APIs' },
  { year: '2024', title: 'Building Solutions', subtitle: 'Delivering end-to-end scalable products and high-impact software' },
];

const statsData = [
  { value: '3', suffix: '+', label: 'Years Experience' },
  { value: '20', suffix: '+', label: 'Projects Shipped' },
  { value: '10', suffix: '+', label: 'Technologies Mastered' },
  { value: '99', suffix: '%', label: 'Client Satisfaction' },
];

const defaultValues = [
  {
    icon: '⚡',
    name: 'Performance First',
    desc: 'Every millisecond matters. I engineer zero-lag architectures with lean bundle footprints and optimized database queries.',
  },
  {
    icon: '💎',
    name: 'Craftsmanship & Clean Code',
    desc: 'Self-documenting TypeScript, comprehensive test coverage, and modular design patterns built to scale smoothly.',
  },
  {
    icon: '🎯',
    name: 'Product & User Centric',
    desc: 'Technology is a vehicle for solving human problems. I build intuitive UX flows backed by data-driven design thinking.',
  },
  {
    icon: '🚀',
    name: 'Rapid Execution & Ownership',
    desc: 'From initial prototype to production deployment, I take end-to-end responsibility and ship reliably on tight deadlines.',
  },
];

const defaultAchievements = [
  {
    icon: '🏆',
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    year: '2024',
  },
  {
    icon: '⚛️',
    title: 'Advanced React & Next.js Professional',
    issuer: 'Meta / Coursera',
    year: '2023',
  },
  {
    icon: '🍃',
    title: 'MongoDB Certified DBA & Developer',
    issuer: 'MongoDB University',
    year: '2023',
  },
  {
    icon: '🌟',
    title: 'Open Source Contributor (500+ Stars)',
    issuer: 'GitHub Community',
    year: '2024',
  },
];

const getCertificateThumbnailUrl = (url, type) => {
  if (!url || type?.startsWith('image/')) return url;
  return url.includes('/upload/')
    ? url.replace('/upload/', '/upload/pg_1,w_360,h_220,c_fill,f_jpg/')
    : url;
};

const About = ({ onNavigate, onOpenResume }) => {
  const settings = useSiteSettings();
  const [selectedCertificate, setSelectedCertificate] = React.useState(null);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = React.useState('');
  const [certificatePreviewLoading, setCertificatePreviewLoading] = React.useState(false);
  const [certificatePreviewError, setCertificatePreviewError] = React.useState('');
  const stats = Array.isArray(settings?.aboutStats) && settings.aboutStats.length ? settings.aboutStats : statsData;
  const timeline = Array.isArray(settings?.aboutTimeline) && settings.aboutTimeline.length ? settings.aboutTimeline : timelineData;
  const values = Array.isArray(settings?.values) && settings.values.length ? settings.values : defaultValues;
  const achievements = Array.isArray(settings?.achievements) && settings.achievements.length ? settings.achievements : defaultAchievements;

  React.useEffect(() => {
    if (!selectedCertificate?.certificateUrl) {
      setCertificatePreviewUrl('');
      setCertificatePreviewError('');
      return undefined;
    }

    let objectUrl = '';
    setCertificatePreviewUrl('');
    setCertificatePreviewError('');
    setCertificatePreviewLoading(true);
    fetch(selectedCertificate.certificatePreviewUrl || selectedCertificate.certificateUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Certificate preview unavailable');
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setCertificatePreviewUrl(objectUrl);
      })
      .catch(() => setCertificatePreviewError('This certificate preview could not be loaded.'))
      .finally(() => setCertificatePreviewLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedCertificate]);

  const handleResumeClick = () => {
    sounds.playClick();
    if (onOpenResume) {
      onOpenResume();
    }
  };

  return (
    <Box className="about-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="About" onOpenResume={onOpenResume} />
      <Container className="about-layout" maxWidth={false} sx={{ pb: 8 }}>
        <Box className="about-copy">
          <Typography className="about-kicker">{settings?.aboutKicker || '// ABOUT ME'}</Typography>
          <Typography component="h1" className="about-title">
            {settings?.aboutTitle || 'Building Digital Experiences That Solve Real Problems'}
          </Typography>
          <Typography className="about-description">
            {settings?.aboutDescription || "I'm a passionate Full Stack Developer with 3+ years of experience building modern web applications and digital products."}
          </Typography>
          <Typography className="about-description about-description-last">
            {settings?.aboutSecondDescription || 'I love turning complex requirements into clean code, intuitive user interfaces, and high-throughput backend services.'}
          </Typography>

          <Box className="about-stats">
            {stats.map((stat) => (
              <Box className="about-stat" key={stat.label}>
                <Typography className="about-stat-value">
                  {stat.value}<Box component="span">{stat.suffix}</Box>
                </Typography>
                <Typography className="about-stat-label">{stat.label}</Typography>
              </Box>
            ))}
          </Box>

          <Button
            className="resume-button"
            startIcon={<AutoStoriesRoundedIcon />}
            onClick={handleResumeClick}
            sx={{
              bgcolor: 'var(--accent-color, #22c55e)',
              color: '#fff',
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: '12px',
              py: 1.2,
              px: 3,
              '&:hover': {
                bgcolor: 'var(--accent-dark, #16a34a)',
              },
            }}
          >
            View Interactive ATS Resume
          </Button>
        </Box>

        <Box className="about-portrait-area">
          <Box className="portrait-orbit" />
          <Box className="portrait-glow" />
          <Box
            className="about-portrait"
            role="img"
            aria-label="Profile portrait"
            sx={settings?.profileImage ? { backgroundImage: `url(${settings.profileImage})` } : { backgroundImage: 'none', backgroundColor: '#e7f1ea' }}
          />
          <Box className="portrait-dot portrait-dot-top" />
          <Box className="portrait-dot portrait-dot-bottom" />
        </Box>

        <Box className="about-timeline">
          {timeline.map((item, index) => (
            <Box className="timeline-entry" key={item.year}>
              <Box className="timeline-marker">{item.year}</Box>
              {index < timeline.length - 1 && <Box className="timeline-line" />}
              <Box className="timeline-copy">
                <Typography className="timeline-year">{item.year}</Typography>
                <Typography className="timeline-title">{item.title}</Typography>
                <Typography className="timeline-subtitle">{item.subtitle}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Feature 4: Core Engineering Values & Principles */}
        <Box className="about-values" sx={{ width: '100%', gridColumn: '1 / -1' }}>
          <Typography className="about-kicker">{"// VALUES & PRINCIPLES"}</Typography>
          <Typography component="h2" className="about-values-title">How I Build &amp; Ship Software</Typography>
          <Box className="about-values-grid">
            {values.map((val) => (
              <Box key={val.name} className="about-value-card">
                <div className="about-value-icon">{val.icon}</div>
                <Typography className="about-value-name">{val.name}</Typography>
                <Typography className="about-value-desc">{val.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Feature 5: Achievements & Certifications */}
        <Box className="about-achievements" sx={{ width: '100%', gridColumn: '1 / -1' }}>
          <Typography className="about-kicker">{"// HONORS & CREDENTIALS"}</Typography>
          <Typography component="h2" className="about-achievements-title">Certifications &amp; Milestones</Typography>
          <Box className="about-achievements-grid">
            {achievements.map((ach, index) => (
              <Box key={`${ach.title || 'achievement'}-${ach.year || 'unknown'}-${index}`} className="about-achievement-card">
                <div className="about-achievement-icon">{ach.icon}</div>
                <div>
                  <Typography className="about-achievement-name">{ach.title}</Typography>
                  <Typography className="about-achievement-issuer">{ach.issuer}</Typography>
                  <Typography className="about-achievement-year">Acquired · {ach.year}</Typography>
                            {ach.certificateUrl && (
                        <Box sx={{ mt: 1.5 }}>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => setSelectedCertificate(ach)}
                            sx={{ display: 'inline-block', lineHeight: 0, position: 'relative', border: 0, p: 0, bgcolor: 'transparent', cursor: 'pointer' }}
                          >
                            {ach.certificateType?.startsWith('image/') || ach.certificateThumbnailUrl ? (
                              <Box
                                component="img"
                                src={ach.certificateThumbnailUrl || getCertificateThumbnailUrl(ach.certificateUrl, ach.certificateType)}
                                alt={`${ach.title} certificate`}
                                sx={{ display: 'block', width: 180, height: 110, objectFit: 'cover', borderRadius: 1.5, border: '1px solid rgba(148, 163, 184, 0.25)', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }}
                              />
                            ) : (
                              <Box sx={{ width: 180, height: 110, display: 'grid', placeItems: 'center', borderRadius: 1.5, border: '1px solid rgba(148, 163, 184, 0.25)', bgcolor: '#f8fafc', color: '#475569', fontSize: 22, fontWeight: 800 }}>
                                PDF
                              </Box>
                            )}
                          </Box>
                        </Box>
                            )}
                </div>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Feature 6: GitHub & Open Source Activity Showcase */}
        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>
        </Box>
      </Container>
      <Dialog
        open={Boolean(selectedCertificate)}
        onClose={() => setSelectedCertificate(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: { xs: 1, sm: 2 }, bgcolor: '#111827', position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedCertificate(null)}
            aria-label="Close certificate preview"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#fff', bgcolor: 'rgba(0,0,0,0.55)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {certificatePreviewLoading ? (
            <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>
              Loading preview...
            </Box>
          ) : certificatePreviewError ? (
            <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', color: '#fff', textAlign: 'center', p: 3 }}>
              {certificatePreviewError}
            </Box>
          ) : selectedCertificate?.certificateType?.startsWith('image/') ? (
            <Box
              component="img"
              src={certificatePreviewUrl}
              alt={`${selectedCertificate.title} certificate preview`}
              sx={{ display: 'block', maxWidth: '100%', maxHeight: '82vh', width: 'auto', height: 'auto', mx: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <Box
              component="object"
              data={`${certificatePreviewUrl}#toolbar=1&navpanes=0&view=FitH`}
              type="application/pdf"
              aria-label={`${selectedCertificate?.title || 'Certificate'} PDF preview`}
              sx={{ display: 'block', width: '100%', height: '82vh', border: 0, bgcolor: '#fff' }}
            >
              <Box
                component="iframe"
                title={`${selectedCertificate?.title || 'Certificate'} PDF preview`}
                src={`${certificatePreviewUrl}#toolbar=1&navpanes=0&view=FitH`}
                sx={{ display: 'block', width: '100%', height: '100%', border: 0, bgcolor: '#fff' }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default About;
