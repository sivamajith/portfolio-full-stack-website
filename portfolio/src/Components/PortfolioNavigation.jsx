import React, { useState } from 'react';
import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import {
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
import { normalizeExternalUrl } from '../utils/externalUrl';
import { LazyImage } from './LazyImage';

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

function buildWhatsAppLink(value) {
  const raw = String(value || '').replace(/\D/g, '');
  if (!raw) return 'https://wa.me/919999999999';
  return `https://wa.me/${raw}`;
}

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
              <LazyImage
                src={settings.profileImage}
                alt={`${settings?.name || 'Profile'} brand logo`}
                className="home-logo-image"
                style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
              />
            ) : (
              settings?.brandLogo === 'Y' ? '' : settings?.brandLogo || ''
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
        sx={{ zIndex: 12000 }}
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
              justifyContent: 'center',
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
            {normalizeExternalUrl(settings?.linkedin) && (
              <IconButton
                component="a"
                href={normalizeExternalUrl(settings.linkedin)}
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

export default PortfolioNavigation;
