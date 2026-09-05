import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Typography, Chip } from '@mui/material';
import {
  ArrowForward,
  Close,
  DescriptionRounded,
  GitHub,
  Instagram,
  LinkedIn,
  Menu,
  Send,
  WhatsApp,
  NorthEast,
  StarRounded,
} from '@mui/icons-material';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';
import { loadProjects as loadCachedProjects, loadReviews, clearPublicDataCache } from '../utils/publicData';

const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Services', 'Contact'];

export function PortfolioNavigation({ onNavigate, activePage = 'Home', onOpenResume, onOpenScheduler }) {
  const settings = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleNavigation = (item) => {
    sounds.playClick();
    setMobileOpen(false);
    if (onNavigate) {
      onNavigate(item);
    }
  };
  return (
    <>
      <header className="home-header">
        <button type="button" className="home-logo" onClick={() => handleNavigation('Home')} aria-label="Go home">
          <span className="home-logo-badge">
            {settings?.profileImage ? (
              <img
                src={settings.profileImage}
                alt={`${settings?.name || 'Profile'} brand logo`}
                className="home-logo-image"
              />
            ) : (
              settings?.brandLogo || 'Y'
            )}
          </span>
          <span className="home-logo-pulse" title="Available for work" />
        </button>
        <div className="home-nav-track">
          <nav className="home-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                type="button"
                className={`home-nav-link ${activePage === item ? 'active' : ''}`}
                key={item}
                onClick={() => handleNavigation(item)}
              >
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="home-header-actions">
          <button type="button" className="home-talk-button" onClick={() => handleNavigation('Contact')}>
            <span>Let&apos;s Talk</span>
            <ArrowForward fontSize="inherit" className="home-talk-arrow" />
          </button>
          <IconButton className="home-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu />
          </IconButton>
        </div>
      </header>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '82vw', sm: 320 },
            maxWidth: 340,
            p: 2.5,
            bgcolor: (t) => t.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: 'var(--accent-dark, #16a34a)', letterSpacing: 1 }}>
            PORTFOLIO NAVIGATION
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small" aria-label="Close menu">
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = activePage === item;
            return (
              <ListItem
                button
                key={item}
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isActive ? 'var(--accent-soft, #dcfce7)' : 'transparent',
                  color: isActive ? 'var(--accent-dark, #16a34a)' : 'text.primary',
                  fontWeight: isActive ? 800 : 600,
                  py: 1,
                  px: 1.5,
                  '&:hover': {
                    bgcolor: isActive ? 'var(--accent-soft, #dcfce7)' : 'rgba(148,163,184,0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 800 : 600,
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ pt: 2, borderTop: '1px solid rgba(148,163,184,0.15)', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {onOpenResume && (
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => {
                setMobileOpen(false);
                onOpenResume();
              }}
              startIcon={<DescriptionRounded fontSize="small" />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: 'var(--accent-color, #22c55e)', color: 'var(--accent-dark, #16a34a)' }}
            >
              Interactive Resume
            </Button>
          )}
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => handleNavigation('Contact')}
            startIcon={<Send fontSize="small" />}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: 'var(--accent-color, #22c55e)', color: '#fff' }}
          >
            Get In Touch
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

function buildWhatsAppLink(value) {
  const raw = String(value || '').replace(/\D/g, '');
  if (!raw) return 'https://wa.me/919999999999';
  return `https://wa.me/${raw}`;
}

const fallbackFeaturedProjects = [
  {
    id: 'devflow',
    title: 'DevFlow Suite',
    category: 'Full Stack',
    desc: 'Real-time kanban sprint management with WebSockets & React 19.',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
  },
  {
    id: 'cloudscale',
    title: 'CloudScale APM',
    category: 'Backend / DevOps',
    desc: 'Distributed observability dashboard with live throughput telemetry.',
    tags: ['Next.js', 'TypeScript', 'Docker', 'Redis'],
  },
  {
    id: 'nexusai',
    title: 'Nexus Studio',
    category: 'AI / Frontend',
    desc: 'Multi-modal LLM canvas interface with voice interaction & streaming.',
    tags: ['React', 'Tailwind', 'Python', 'FastAPI'],
  },
];

const fallbackMarqueeReviews = [
  {
    name: 'Ananya R.',
    role: 'CEO @ NextGen Health',
    rating: 5,
    text: 'Transformed our MVP wireframes into a blazing fast, production-grade product in 3 weeks.',
  },
  {
    name: 'Marcus L.',
    role: 'Product Lead @ TechFlow',
    rating: 5,
    text: 'Sharp engineering, meticulous UI attention, and effortless communication throughout.',
  },
  {
    name: 'Priya S.',
    role: 'Creative Director',
    rating: 5,
    text: 'A rare engineer who balances aesthetic pixel-perfection with high-throughput backend code.',
  },
  {
    name: 'David K.',
    role: 'VP Engineering @ Streamline',
    rating: 5,
    text: 'Solved our WebSocket concurrency bottlenecks and delivered rock-solid test coverage.',
  },
];

export default function Portfolio({ onNavigate, onOpenResume, onOpenScheduler }) {
  const settings = useSiteSettings();
  const [roleIndex, setRoleIndex] = useState(0);
  const [liveProjects, setLiveProjects] = useState([]);
  const [liveReviews, setLiveReviews] = useState([]);

  const heroRoles = Array.isArray(settings?.heroRoles) && settings.heroRoles.length
    ? settings.heroRoles
    : [settings?.role || 'Full Stack Developer', 'Product Engineer', 'Creative Problem Solver'];
  const roles = heroRoles.length ? heroRoles : [settings?.role || 'Full Stack Developer'];
  const displayName = settings?.name || 'John Doe';
  const nameParts = displayName.split(' ');
  const firstName = nameParts.shift();
  const lastName = nameParts.join(' ') || 'Doe';
  const stats = settings?.heroStats?.length
    ? settings.heroStats
    : [
        { value: '20+', label: 'Projects shipped' },
        { value: '3yr', label: 'Building digitally' },
        { value: '24h', label: 'Typical reply' },
      ];
  const techStack = settings?.heroTechStack?.length
    ? settings.heroTechStack
    : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Figma'];

  const fetchLiveProjects = () => {
    loadCachedProjects('?featured=true')
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setLiveProjects(data.projects);
        }
      })
      .catch(() => {});
  };

  const fetchLiveReviews = () => {
    loadReviews()
      .then((data) => {
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setLiveReviews(data.reviews);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLiveProjects();
    fetchLiveReviews();

    const handleProjectsUpdated = () => {
      clearPublicDataCache();
      fetchLiveProjects();
    };
    const handleReviewsUpdated = () => {
      clearPublicDataCache();
      fetchLiveReviews();
    };

    window.addEventListener('portfolio-projects-updated', handleProjectsUpdated);
    window.addEventListener('portfolio-reviews-updated', handleReviewsUpdated);
    window.addEventListener('portfolio-settings-updated', handleProjectsUpdated);

    return () => {
      window.removeEventListener('portfolio-projects-updated', handleProjectsUpdated);
      window.removeEventListener('portfolio-reviews-updated', handleReviewsUpdated);
      window.removeEventListener('portfolio-settings-updated', handleProjectsUpdated);
    };
  }, []);

  const featuredProjects = liveProjects.length > 0
    ? liveProjects
    : (Array.isArray(settings?.featuredProjects) && settings.featuredProjects.length > 0
        ? settings.featuredProjects
        : fallbackFeaturedProjects);

  const marqueeReviews = liveReviews.length > 0
    ? liveReviews
    : (Array.isArray(settings?.reviews) && settings.reviews.length > 0
        ? settings.reviews
        : fallbackMarqueeReviews);

  useEffect(() => {
    const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800);
    return () => window.clearInterval(timer);
  }, [roles.length]);

  const availabilityLabel = settings?.availableText || (settings?.available === false ? 'Currently unavailable' : 'Available for select projects');

  return (
    <Box className="home-page">
      <PortfolioNavigation onNavigate={onNavigate} onOpenResume={onOpenResume} onOpenScheduler={onOpenScheduler} />
      <main className="home-hero">
        <section className="home-intro">
          {/* Interactive Clickable Status Pill */}
          <Box
            className="home-status"
            onClick={() => {
              sounds.playClick();
              if (onOpenScheduler) onOpenScheduler();
            }}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                borderColor: 'var(--accent-color, #22c55e)',
              },
            }}
            title="Click to schedule a 15-min discovery call"
          >
            <span className="status-pulse" style={{ backgroundColor: settings?.available === false ? '#ef4444' : 'var(--accent-color, #22c55e)' }} /> {availabilityLabel} <span className="status-dot">04</span>
          </Box>
          
          <Box className="home-greeting">Hi, I&apos;m</Box>
          <h1>
            {firstName} <span>{lastName}</span>
          </h1>
          <h2 className="home-role" key={roles[roleIndex] || settings?.role || 'Full Stack Developer'}>
            {roles[roleIndex] || settings?.role || 'Full Stack Developer'}
          </h2>
          <p className="home-tagline">{settings?.tagline || 'Problem Solver | Tech Enthusiast'}</p>
          <p className="home-description">
            {settings?.description || 'I build scalable web applications with modern technologies and excellent user experiences.'}
          </p>
          <Box className="home-actions">
            <Button
              className="home-primary-button"
              onClick={() => {
                sounds.playClick();
                if (onOpenResume) onOpenResume();
              }}
              startIcon={<DescriptionRounded />}
              sx={{
                bgcolor: 'var(--accent-color, #22c55e)',
                color: '#fff',
                '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
              }}
            >
              View Resume
            </Button>
            <Button
              className="home-secondary-button"
              endIcon={<ArrowForward />}
              onClick={() => {
                sounds.playClick();
                onNavigate('Contact');
              }}
            >
              Let&apos;s Talk
            </Button>
          </Box>
          <Box className="home-socials">
            <IconButton component="a" href={settings?.github || 'https://github.com'} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHub />
            </IconButton>
            <IconButton component="a" href={settings?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
            <IconButton component="a" href={buildWhatsAppLink(settings?.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <WhatsApp />
            </IconButton>
            <IconButton component="a" href={settings?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram />
            </IconButton>
          </Box>
          <Box className="home-proof-row">
            {stats.map((stat) => (
              <Box key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </Box>
            ))}
          </Box>
        </section>
        
        <section className="home-visual" aria-label="Profile portrait">
          {/* Hanging wires */}
          <div className="hanging-wire wire-left"></div>
          <div className="hanging-wire wire-right"></div>
          {/* Hook circles */}
          <div className="wire-hook hook-left"></div>
          <div className="wire-hook hook-right"></div>
          {/* Background decorative elements */}
          <div className="deco-rect-outlined"></div>
          <div className="deco-rect-green"></div>
          <div className="deco-dot-grid"></div>
          <div className="deco-square deco-sq-1"></div>
          <div className="deco-square deco-sq-2"></div>
          <div className="deco-square deco-sq-3"></div>
          <div className="deco-line deco-line-1"></div>
          <div className="deco-line deco-line-2"></div>
          {/* Main 3D photo frame */}
          <Box className="home-profile-frame">
            <div className="frame-shadow"></div>
            <div className="frame-outer">
              <div className="frame-green-edge"></div>
              <div className="frame-inner">
                {settings?.profileImage ? (
                  <img
                    src={settings.profileImage}
                    alt={`${settings?.name || 'John Doe'} profile`}
                  />
                ) : (
                  <div className="home-profile-fallback" aria-label="Profile placeholder">
                    {(settings?.name || 'JD').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </Box>
        </section>
      </main>

      {/* Tech Strip */}
      <Box className="home-tech-strip" aria-label="Technologies used">
        <span>BUILDING WITH</span>
        {techStack.map((technology) => (
          <b key={technology}>{technology}</b>
        ))}
      </Box>

      {/* Feature 1: Featured Projects Strip */}
      <Box className="home-featured-strip">
        <Typography className="home-featured-label">{'// SELECTED WORKS'}</Typography>
        <Box className="home-featured-cards">
          {featuredProjects.map((item) => (
            <Box
              key={item.id || item.title}
              className="home-featured-card"
              onClick={() => {
                sounds.playClick();
                if (onNavigate) onNavigate('Projects');
              }}
            >
              <span className="home-featured-card-tag">{item.category}</span>
              <Typography className="home-featured-card-title">{item.title}</Typography>
              <Typography className="home-featured-card-desc">{item.desc}</Typography>
              <Box className="home-featured-card-chips">
                {item.tags?.map((t) => (
                  <span key={t} className="home-featured-card-chip">{t}</span>
                ))}
              </Box>
              <IconButton className="home-featured-card-arrow" size="small" aria-label="View project">
                <NorthEast fontSize="inherit" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Feature 2: Testimonials Marquee Strip */}
      <Box className="home-testimonials-marquee" aria-label="Client testimonials">
        <div className="marquee-label">{'// TRUSTED BY STARTUPS & TEAMS'}</div>
        <div className="marquee-track-wrap">
          <div className="marquee-track">
            {[...marqueeReviews, ...marqueeReviews].map((rev, idx) => (
              <div key={idx} className="marquee-item">
                <div className="marquee-item-stars">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <StarRounded key={i} fontSize="inherit" />
                  ))}
                </div>
                <p className="marquee-item-text">&ldquo;{rev.text}&rdquo;</p>
                <div className="marquee-item-author">
                  <strong>{rev.name}</strong>
                  <small>{rev.role}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>

      {/* Feature 3: Availability & Fast Action Bar */}
      <Box className="home-availability-bar">
        <span className="avail-dot" />
        <Typography>
          Currently open to freelance contracts &amp; high-impact product sprints.
        </Typography>
        <Chip
          label="Explore Services"
          size="small"
          onClick={() => {
            sounds.playClick();
            if (onNavigate) onNavigate('Services');
          }}
          sx={{
            bgcolor: 'var(--accent-color, #22c55e)',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
          }}
        />
      </Box>

      <Box className="home-scroll"><span>◉</span> Scroll to explore</Box>
    </Box>
  );
}
