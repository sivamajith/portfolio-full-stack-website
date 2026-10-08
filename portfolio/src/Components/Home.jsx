import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import {
  ArrowForward,
  StarRounded,
  DescriptionRounded,
  GitHub,
  LinkedIn,
  WhatsApp,
  Instagram,
} from '@mui/icons-material';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';
import { loadReviews, clearPublicDataCache } from '../utils/publicData';
import { normalizeExternalUrl } from '../utils/externalUrl';
import { LazyImage } from './LazyImage';
import { PortfolioNavigation } from './PortfolioNavigation';

export { PortfolioNavigation };

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
            <IconButton component="a" href={normalizeExternalUrl(settings?.linkedin, 'https://www.linkedin.com/')} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
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
                  <LazyImage
                    src={settings.profileImage}
                    alt={`${settings?.name || 'John Doe'} profile`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
