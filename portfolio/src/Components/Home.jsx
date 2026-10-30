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


const fallbackMarqueeReviews = [];

export default function Portfolio({ onNavigate, onOpenResume, onOpenScheduler }) {
  const settings = useSiteSettings();
  const [roleIndex, setRoleIndex] = useState(0);
  const [liveReviews, setLiveReviews] = useState([]);

  const safeSettings = settings || {};
  const heroRoles = Array.isArray(safeSettings.heroRoles) && safeSettings.heroRoles.length
    ? safeSettings.heroRoles
    : (safeSettings.role ? [safeSettings.role] : []);
  const roles = heroRoles.length ? heroRoles : [];
  const displayName = safeSettings.name ? String(safeSettings.name).trim() : '';
  const nameParts = displayName ? displayName.split(/\s+/) : [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');
  const stats = safeSettings.heroStats?.length ? safeSettings.heroStats : [];
  const techStack = safeSettings.heroTechStack?.length ? safeSettings.heroTechStack : [];
  const hasPortfolioContent = Boolean(
    safeSettings.name ||
    safeSettings.role ||
    safeSettings.description ||
    safeSettings.tagline ||
    safeSettings.profileImage ||
    safeSettings.heroRoles?.length ||
    safeSettings.heroStats?.length ||
    safeSettings.heroTechStack?.length
  );

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
    if (!roles.length) return undefined;
    const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800);
    return () => window.clearInterval(timer);
  }, [roles.length]);

  const availabilityLabel = safeSettings.availableText || (safeSettings.available === false ? 'Currently unavailable' : 'Available for select projects');

  if (!hasPortfolioContent) return null;

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
          
          {displayName ? <Box className="home-greeting">Hi, I&apos;m</Box> : null}
          {displayName ? (
            <h1>
              {firstName} {lastName ? <span>{lastName}</span> : null}
            </h1>
          ) : null}
          {roles[roleIndex] ? (
            <h2 className="home-role" key={roles[roleIndex]}>
              {roles[roleIndex]}
            </h2>
          ) : null}
          {settings?.tagline ? <p className="home-tagline">{settings.tagline}</p> : null}
          {settings?.description ? (
            <p className="home-description">{settings.description}</p>
          ) : null}
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
          {stats.length > 0 ? (
            <Box className="home-proof-row">
              {stats.map((stat) => (
                <Box key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </Box>
              ))}
            </Box>
          ) : null}
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
                    alt={displayName ? `${displayName} profile` : 'Profile portrait'}
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
