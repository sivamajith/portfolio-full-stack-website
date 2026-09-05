import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { startTransition, useEffect, useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

import Home from './Components/Home';
import Home, { PortfolioNavigation } from './Components/Home';
import About from './Components/About';
import Skills from './Components/Skill';
import Projects from './Components/Projects';
import Contact from './Components/Contact';
import Experience from './Components/Experience';
import Services from './Components/Services';


import Admin from './Components/Admin';
import AIAssistant from './Components/AIAssistant';
import ResumeModal from './Components/ResumeModal';
import MeetingScheduler from './Components/MeetingScheduler';
import useSiteSettings from './hooks/useSiteSettings';
import sounds from './utils/SoundManager';
import { firebaseReady, listenForForegroundMessages } from './firebase';

const THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    color: '#22c55e',
    dark: '#16a34a',
    soft: '#dcfce7',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    color: '#06b6d4',
    dark: '#0891b2',
    soft: '#cffafe',
  },
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    color: '#8b5cf6',
    dark: '#7c3aed',
    soft: '#ede9fe',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    color: '#f59e0b',
    dark: '#d97706',
    soft: '#fef3c7',
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    color: '#f43f5e',
    dark: '#e11d48',
    soft: '#ffe4e6',
  },
};

const pageRoutes = {
  Home: '/home',
  About: '/about',
  Skills: '/skills',
  Projects: '/projects',
  Experience: '/experience',
  Services: '/services',
  Contact: '/contact',
};

const pageFromPath = (pathname) => {
  if (pathname === '/owner-console-7f3a9c') return 'Admin';
  if (pathname === '/reviews') return 'Contact';
  const route = Object.entries(pageRoutes).find(([, path]) => path === pathname);
  return route ? route[0] : 'Home';
};

export default function App() {
  const settings = useSiteSettings();
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('portfolio-dark-mode') === 'true');
  const [activeThemeKey, setActiveThemeKey] = useState('emerald');
  const [isMuted, setIsMuted] = useState(() => sounds.isMuted);
  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobileSinglePage = useMediaQuery('(max-width:899px)');

  // Modal States
  const [resumeOpen, setResumeOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [prefillSpec, setPrefillSpec] = useState(null);

  // Theme Menu Anchor
  const [themeAnchor, setThemeAnchor] = useState(null);

  const currentTheme = THEMES[activeThemeKey] || THEMES.emerald;

  useEffect(() => {
    if (settings?.themeColor && THEMES[settings.themeColor]) {
      setActiveThemeKey(settings.themeColor);
    }
  }, [settings?.themeColor]);

  // Apply CSS variables dynamically to the document root
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', currentTheme.color);
    document.documentElement.style.setProperty('--accent-dark', currentTheme.dark);
    document.documentElement.style.setProperty('--accent-soft', currentTheme.soft);
  }, [currentTheme]);

  useEffect(() => {
    window.localStorage.setItem('portfolio-dark-mode', String(darkMode));
  }, [darkMode]);

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: currentTheme.color },
        secondary: { main: currentTheme.dark },
        background: { default: darkMode ? '#0b1220' : '#FFFFFF', paper: darkMode ? '#1e293b' : '#FFFFFF' },
      },
      typography: {
        fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
        h1: { fontWeight: 800, fontSize: '64px', lineHeight: 1.1 },
      },
    });
  }, [darkMode, currentTheme]);

  useEffect(() => {
    if (window.location.pathname === '/') window.history.replaceState({}, '', pageRoutes.Home);

    const handlePopState = () => setCurrentPage(pageFromPath(window.location.pathname));
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      setShowTop(window.scrollY > 360);
    };
    const handleKeyDown = (event) => {
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (page) => {
    sounds.playClick();
    startTransition(() => setCurrentPage(page));
    const route = pageRoutes[page];
    if (route && window.location.pathname !== route) window.history.pushState({}, '', route);
    if (isMobileSinglePage) {
      const sectionSelectors = {
        Home: '.mobile-all-pages .home-page',
        About: '.mobile-all-pages .about-page',
        Skills: '.mobile-all-pages .skills-page',
        Projects: '.mobile-all-pages .projects-section',
        Experience: '.mobile-all-pages .experience-page',
        Services: '.mobile-all-pages .services-page',
        Contact: '.mobile-all-pages .contact-page',
      };
      window.requestAnimationFrame(() => {
        const targetElement = document.querySelector(sectionSelectors[page]);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = () => {
    const nextMute = sounds.toggleMute();
    setIsMuted(nextMute);
  };

  const handleThemeChange = (key) => {
    sounds.playChime();
    setActiveThemeKey(key);
    setThemeAnchor(null);
  };

  const handleServiceInquiry = (service) => {
    setPrefillSpec({ service });
    navigate('Contact');
  };


  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [localTime, setLocalTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    sounds.playSuccess();
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  useEffect(() => {
    if (!firebaseReady) return undefined;

    const unsubscribe = listenForForegroundMessages((payload) => {
      if (payload?.notification) {
        console.log('Foreground notification received:', payload.notification.title, payload.notification.body);
      }
    });

    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  if (currentPage === 'Admin') {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Admin />
      </ThemeProvider>
    );
  }

  const page =
    currentPage === 'About' ? (
      <About onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
    ) : currentPage === 'Skills' ? (
      <Skills onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
    ) : currentPage === 'Projects' ? (
      <Projects onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} onOpenScheduler={() => setSchedulerOpen(true)} />
    ) : currentPage === 'Experience' ? (
      <Experience onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
    ) : currentPage === 'Services' ? (
      <Services onNavigate={navigate} onInquireService={handleServiceInquiry} onOpenResume={() => setResumeOpen(true)} />
    ) : currentPage === 'Contact' ? (
      <Contact onNavigate={navigate} prefillSpec={prefillSpec} onOpenResume={() => setResumeOpen(true)} />
    ) : (
      <Home
        onNavigate={navigate}
        onOpenResume={() => setResumeOpen(true)}
        onOpenScheduler={() => setSchedulerOpen(true)}
      />
    );

  const mobilePages = (
    <Box className="mobile-all-pages">
      <Home
        onNavigate={navigate}
        onOpenResume={() => setResumeOpen(true)}
        onOpenScheduler={() => setSchedulerOpen(true)}
      />
      <About onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
      <Skills onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
      <Projects onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} onOpenScheduler={() => setSchedulerOpen(true)} />
      <Experience onNavigate={navigate} onOpenResume={() => setResumeOpen(true)} />
      <Services onNavigate={navigate} onInquireService={handleServiceInquiry} onOpenResume={() => setResumeOpen(true)} />
     
     
      <Contact onNavigate={navigate} prefillSpec={prefillSpec} onOpenResume={() => setResumeOpen(true)} />
    </Box>
  );

  const footerLinks = ['About', 'Skills', 'Projects', 'Experience', 'Services', 'Contact'];

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        className={`app-shell ${darkMode ? 'dark-mode' : ''}`}
        sx={{
          '--portfolio-background-image': `url(${process.env.PUBLIC_URL}/portfolio-background.png)`,
        }}
      >
        <Box
          className="scroll-progress"
          sx={{
            width: `${scrollProgress}%`,
            bgcolor: 'var(--accent-color, #22c55e)',
            height: '4px',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        />

        {!isMobileSinglePage && <Box className="desktop-page">{page}</Box>}
        {isMobileSinglePage && mobilePages}
        <PortfolioNavigation
          onNavigate={navigate}
          activePage={currentPage}
          onOpenResume={() => setResumeOpen(true)}
          onOpenScheduler={() => setSchedulerOpen(true)}
        />

        <Box className="desktop-page">{page}</Box>
        {mobilePages}

        {/* Global Footer */}
        <footer className="site-footer">
          <Box className="footer-cta">
            <Box>
              <span className="footer-eyebrow">HAVE A GOOD IDEA?</span>
              <Typography component="h2">
                Let&apos;s make it <em style={{ color: 'var(--accent-color, #22c55e)' }}>remarkable.</em>
              </Typography>
            </Box>
            <button
              type="button"
              className="footer-cta-button"
              onClick={() => navigate('Contact')}
              style={{
                background: 'linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%)',
              }}
            >
              Start a conversation <ArrowForwardRoundedIcon />
            </button>
          </Box>

          <Box className="footer-grid">
            <Box className="footer-brand">
              <button type="button" className="footer-logo" onClick={() => navigate('Home')} aria-label="Go to home">
                {settings?.brandLogo || 'Y'}
              </button>
              <Box>
                <Typography className="footer-name">{settings?.name || 'John Doe'}</Typography>
                <Typography className="footer-caption">{settings?.role || 'Full Stack Developer'}</Typography>
              </Box>
              <p>Digital products with clarity, character, and production-grade engineering.</p>
              <Box className="footer-socials">
                <IconButton component="a" href={settings?.github || 'https://github.com'} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GitHubIcon />
                </IconButton>
                <IconButton component="a" href={settings?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedInIcon />
                </IconButton>
                <IconButton component="a" href={settings?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Box>

            <Box className="footer-column">
              <span>EXPLORE</span>
              <Box className="footer-links" component="nav" aria-label="Footer navigation">
                {footerLinks.map((item) => (
                  <button type="button" key={item} onClick={() => navigate(item)}>
                    {item}
                  </button>
                ))}
                <button type="button" onClick={() => setResumeOpen(true)}>
                  ATS Resume
                </button>
              </Box>
            </Box>

            <Box className="footer-column footer-newsletter">
              <span>STAY IN THE LOOP</span>
              <Typography>Occasional notes on architecture, fullstack code, and shipping better products.</Typography>
              <form onSubmit={handleNewsletter}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder={newsletterSent ? 'You are on the list.' : 'Your email address'}
                  required
                  disabled={newsletterSent}
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <ArrowForwardRoundedIcon />
                </button>
              </form>
            </Box>
          </Box>

          <Box className="footer-bottom">
            <span>
              <i style={{ background: 'var(--accent-color, #22c55e)' }} /> Available for select projects <b>·</b> Local time {localTime}
            </span>
            <small>© {new Date().getFullYear()} {settings?.name || 'John Doe'}. Built with care & React.</small>
          </Box>
        </footer>

        {/* Floating Quick Action Tools */}
        <Box className="floating-tools">
          <Tooltip title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}>
            <IconButton onClick={handleToggleMute} aria-label="Toggle sound FX">
              {isMuted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon sx={{ color: 'var(--accent-color, #22c55e)' }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Choose Color Accent Theme">
            <IconButton onClick={(e) => setThemeAnchor(e.currentTarget)} aria-label="Choose Accent Theme">
              <PaletteRoundedIcon sx={{ color: currentTheme.color }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              onClick={() => {
                sounds.playClick();
                setDarkMode((value) => !value);
              }}
              aria-label="Toggle color mode"
            >
              {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Email me directly">
            <IconButton component="a" href={`mailto:${settings?.email || 'johndoe@example.com'}`} aria-label="Email me">
              <MailOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Palette Selector Dropdown Menu */}
        <Menu
          anchorEl={themeAnchor}
          open={Boolean(themeAnchor)}
          onClose={() => setThemeAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '16px',
                mt: -1,
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary', letterSpacing: 1 }}>
              SELECT ACCENT THEME
            </Typography>
          </Box>
          {Object.values(THEMES).map((t) => (
            <MenuItem
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              selected={activeThemeKey === t.id}
              sx={{ gap: 1.5, fontSize: 13, fontWeight: 600 }}
            >
              <ListItemIcon sx={{ minWidth: 20 }}>
                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: t.color }} />
              </ListItemIcon>
              {t.name}
            </MenuItem>
          ))}
        </Menu>

        {showTop && (
          <Tooltip title="Back to top">
            <IconButton
              className="back-to-top"
              onClick={() => {
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Back to top"
            >
              <KeyboardArrowUpRoundedIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Interactive Feature 1: AI Assistant Widget */}
        <AIAssistant
          onNavigate={navigate}
          onOpenResume={() => setResumeOpen(true)}
          onOpenScheduler={() => setSchedulerOpen(true)}
        />


        {/* Interactive Feature 6: ATS Resume Modal */}
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

        {/* Interactive Feature 9: Meeting Scheduler */}
        <MeetingScheduler open={schedulerOpen} onClose={() => setSchedulerOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}