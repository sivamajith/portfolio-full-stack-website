import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Typography } from '@mui/material';
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
  StarRounded,
  HomeRounded,
  PersonRounded,
  CodeRounded,
  FolderSpecialRounded,
  WorkRounded,
  LayersRounded,
  MailRounded,
  ArticleRounded,
  CalendarMonthRounded,
} from '@mui/icons-material';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';
import { loadReviews, clearPublicDataCache } from '../utils/publicData';

const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Services', 'Contact'];

const getNavIcon = (item) => {
  switch (item) {
    case 'Home':
      return <HomeRounded fontSize="small" />;
    case 'About':
      return <PersonRounded fontSize="small" />;
    case 'Skills':
      return <CodeRounded fontSize="small" />;
    case 'Projects':
      return <FolderSpecialRounded fontSize="small" />;
    case 'Experience':
      return <WorkRounded fontSize="small" />;
    case 'Services':
      return <LayersRounded fontSize="small" />;
    case 'Contact':
      return <MailRounded fontSize="small" />;
    case 'Blog':
      return <ArticleRounded fontSize="small" />;
    case 'Now':
      return <CalendarMonthRounded fontSize="small" />;
    default:
      return <StarRounded fontSize="small" />;
  }
};

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
          <IconButton className="home-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu />
          </IconButton>
        </div>
      </header>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 'min(270px, 84vw)', sm: '300px' },
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              p: { xs: 1.5, sm: 2 },
              bgcolor: (t) => (t.palette.mode === 'dark' ? '#0f172a' : '#ffffff'),
              color: (t) => (t.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
              backgroundImage: 'none',
              boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 1, sm: 1.5 },
            pb: { xs: 1, sm: 1.25 },
            flexShrink: 0,
            borderBottom: (t) =>
              t.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                bgcolor: 'var(--accent-color, #22c55e)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 3px 10px rgba(34, 197, 94, 0.3)',
                flexShrink: 0,
              }}
            >
              {settings?.brandLogo || 'P'}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '12px', sm: '13px' },
                  lineHeight: 1.15,
                  letterSpacing: '0.4px',
                  color: (t) => (t.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                NAVIGATION
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '10px',
                  color: 'var(--accent-dark, #16a34a)',
                  letterSpacing: '0.2px',
                }}
              >
                Portfolio Menu
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setMobileOpen(false)}
            size="small"
            aria-label="Close menu"
            sx={{
              p: 0.5,
              borderRadius: '50%',
              color: 'text.secondary',
              bgcolor: (t) =>
                t.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)',
              '&:hover': {
                bgcolor: (t) =>
                  t.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(0,0,0,0.08)',
                color: 'text.primary',
              },
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Scrollable Navigation List */}
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            minHeight: 0,
            flex: 1,
            overflowY: 'auto',
            px: 0.25,
            py: 0.25,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {navItems.map((item) => {
            const isActive = activePage === item;
            return (
              <ListItemButton
                key={item}
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: '10px',
                  bgcolor: isActive
                    ? 'var(--accent-soft, rgba(34, 197, 94, 0.12))'
                    : 'transparent',
                  color: isActive
                    ? 'var(--accent-dark, #16a34a)'
                    : 'text.primary',
                  fontWeight: isActive ? 700 : 550,
                  py: 0.8,
                  px: 1.25,
                  transition: 'all 0.2s ease-in-out',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  minHeight: 38,
                  '&:hover': {
                    bgcolor: isActive
                      ? 'var(--accent-soft, rgba(34, 197, 94, 0.16))'
                      : (t) =>
                          t.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.04)',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive
                      ? 'var(--accent-dark, #16a34a)'
                      : 'text.secondary',
                    fontSize: '18px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {getNavIcon(item)}
                </Box>
                <ListItemText
                  primary={item}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '13px', sm: '13.5px' },
                      fontWeight: isActive ? 700 : 550,
                      letterSpacing: '0.2px',
                    },
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      bgcolor: 'var(--accent-color, #22c55e)',
                      boxShadow: '0 0 6px var(--accent-color, #22c55e)',
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Footer Action Buttons */}
        <Box
          sx={{
            pt: { xs: 1.25, sm: 1.5 },
            mt: 0.5,
            flexShrink: 0,
            borderTop: (t) =>
              t.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {onOpenResume && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setMobileOpen(false);
                onOpenResume();
              }}
              startIcon={<DescriptionRounded sx={{ fontSize: 16 }} />}
              sx={{
                minHeight: 38,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '12px', sm: '13px' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                borderColor: 'var(--accent-color, #22c55e)',
                color: 'var(--accent-dark, #16a34a)',
                boxSizing: 'border-box',
                px: 1.25,
                '&:hover': {
                  borderColor: 'var(--accent-dark, #16a34a)',
                  bgcolor: 'var(--accent-soft, rgba(34, 197, 94, 0.08))',
                },
                '& .MuiButton-startIcon': { mr: 0.75 },
              }}
            >
              Interactive Resume
            </Button>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavigation('Contact')}
            startIcon={<Send sx={{ fontSize: 16 }} />}
            sx={{
              minHeight: 38,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '12px', sm: '13px' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              bgcolor: 'var(--accent-color, #22c55e)',
              color: '#ffffff',
              boxSizing: 'border-box',
              px: 1.25,
              boxShadow: '0 3px 10px rgba(34, 197, 94, 0.3)',
              '&:hover': {
                bgcolor: 'var(--accent-dark, #16a34a)',
                boxShadow: '0 5px 15px rgba(34, 197, 94, 0.4)',
              },
              '& .MuiButton-startIcon': { mr: 0.75 },
            }}
          >
            Get In Touch
          </Button>

          {/* Social Links Footer */}
          <Box
            sx={{
              display: 'flex',
              justify: 'center',
              alignItems: 'center',
              gap: 1.25,
              pt: 0.25,
            }}
          >
            {settings?.github && (
              <IconButton
                component="a"
                href={settings.github}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="GitHub profile"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'var(--accent-color, #22c55e)' },
                }}
              >
                <GitHub sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            {settings?.linkedin && (
              <IconButton
                component="a"
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="LinkedIn profile"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'var(--accent-color, #22c55e)' },
                }}
              >
                <LinkedIn sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            {settings?.instagram && (
              <IconButton
                component="a"
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="Instagram profile"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'var(--accent-color, #22c55e)' },
                }}
              >
                <Instagram sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            {settings?.whatsapp && (
              <IconButton
                component="a"
                href={buildWhatsAppLink(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="WhatsApp"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'var(--accent-color, #22c55e)' },
                }}
              >
                <WhatsApp sx={{ fontSize: 17 }} />
              </IconButton>
            )}
          </Box>
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
    fetchLiveReviews();

    const handleReviewsUpdated = () => {
      clearPublicDataCache();
      fetchLiveReviews();
    };

    window.addEventListener('portfolio-reviews-updated', handleReviewsUpdated);

    return () => {
      window.removeEventListener('portfolio-reviews-updated', handleReviewsUpdated);
    };
  }, []);

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
        <Button
          type="button"
          className="home-services-cta"
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
        >
          Explore Services
        </Button>
      </Box>

      <Box className="home-scroll"><span>◉</span> Scroll to explore</Box>
    </Box>
  );
}
