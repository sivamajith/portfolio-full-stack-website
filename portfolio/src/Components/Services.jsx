import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Code2,
  Smartphone,
  Globe,
  Database,
  Palette,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const defaultServices = [
  {
    id: 'fullstack',
    icon: 'globe',
    title: 'Full Stack Web Applications',
    description:
      'End-to-end production-ready applications with React, Next.js, Node.js, and cloud databases built for high performance and scalability.',
    features: [
      'Custom Responsive UI with React & Tailwind',
      'Scalable REST & GraphQL APIs with Express / Node',
      'Database Architecture (MongoDB, Postgres, Redis)',
      'Authentication, Authorization & Role Management',
      'Production Deployment & CI/CD Pipelines',
    ],
    price: '$800+',
    timeline: '2 - 4 weeks',
    badge: 'Most Popular',
    highlight: true,
  },
  {
    id: 'api',
    icon: 'database',
    title: 'Backend & API Engineering',
    description:
      'Robust microservices, high-throughput REST APIs, WebSockets for real-time collaboration, and bulletproof security systems.',
    features: [
      'Microservices & RESTful API Architecture',
      'Real-time WebSockets & Socket.io integration',
      'JWT, OAuth2 & Session Security',
      'Stripe / PayPal Payment Gateways',
      'Database Optimization & Redis Caching',
    ],
    price: '$500+',
    timeline: '1 - 2 weeks',
    badge: null,
    highlight: false,
  },
  {
    id: 'frontend',
    icon: 'palette',
    title: 'Frontend UI/UX & Design Systems',
    description:
      'Pixel-perfect, accessible, and delightful interactive user interfaces transformed from Figma designs into clean React code.',
    features: [
      'Figma to Production React / Next.js code',
      'Custom Component Libraries & Design Tokens',
      'Fluid Animations & Micro-Interactions',
      '100% Lighthouse Performance & SEO Score',
      'WCAG Accessibility (a11y) Compliance',
    ],
    price: '$400+',
    timeline: '1 - 2 weeks',
    badge: null,
    highlight: false,
  },
  {
    id: 'optimization',
    icon: 'zap',
    title: 'Performance & Architecture Audit',
    description:
      'Diagnose and eliminate bottlenecks in slow React apps, heavy SQL queries, memory leaks, and poor Core Web Vitals.',
    features: [
      'Core Web Vitals & Bundle Size Reduction',
      'React Re-render Profiling & Optimization',
      'Database Indexing & Query Tuning',
      'Security Audit & Vulnerability Patches',
      'Actionable Performance Report with Benchmarks',
    ],
    price: '$350+',
    timeline: '3 - 5 days',
    badge: 'Quick Turnaround',
    highlight: false,
  },
  {
    id: 'mobile',
    icon: 'smartphone',
    title: 'Progressive Web Apps (PWA)',
    description:
      'Installable, offline-capable mobile and desktop web apps that deliver native-like speeds and instant push notifications.',
    features: [
      'Service Workers & Offline Data Sync',
      'Home Screen Installable Web Apps',
      'Mobile-first Touch Interactions',
      'Push Notification Workflows',
      'Cross-Platform iOS & Android support',
    ],
    price: '$600+',
    timeline: '2 - 3 weeks',
    badge: null,
    highlight: false,
  },
  {
    id: 'consulting',
    icon: 'code',
    title: 'Technical Consultation & Mentoring',
    description:
      '1-on-1 architecture advice, tech stack selection, code reviews, and roadmap planning for founders and engineering teams.',
    features: [
      'System Architecture & Stack Selection',
      'Comprehensive Codebase & PR Reviews',
      'MVP Scope & Technical Roadmap Planning',
      'Live Pair Programming & Debugging',
      'Recorded Video Walkthroughs & Notes',
    ],
    price: '$150/hr',
    timeline: 'Hourly / Retainer',
    badge: null,
    highlight: false,
  },
];

const defaultProcessSteps = [
  {
    step: '01',
    title: 'Discovery & Scope',
    description: 'We analyze your requirements, goals, technical constraints, and define a clear milestone roadmap.',
  },
  {
    step: '02',
    title: 'Architecture & UX',
    description: 'Wireframes, database schemas, component trees, and API contracts are planned for clarity.',
  },
  {
    step: '03',
    title: 'Agile Development',
    description: 'Clean, tested code built in rapid iterative sprints with weekly demo checkpoints.',
  },
  {
    step: '04',
    title: 'Testing & Polish',
    description: 'Rigorous automated unit testing, responsive verification across all devices, and performance tuning.',
  },
  {
    step: '05',
    title: 'Launch & Handover',
    description: 'Seamless cloud deployment, documentation, and 30-day post-launch warranty support.',
  },
];

const renderServiceIcon = (iconName) => {
  switch (iconName) {
    case 'globe':
      return <Globe size={24} />;
    case 'database':
      return <Database size={24} />;
    case 'palette':
      return <Palette size={24} />;
    case 'zap':
      return <Zap size={24} />;
    case 'smartphone':
      return <Smartphone size={24} />;
    case 'code':
    default:
      return <Code2 size={24} />;
  }
};

export default function Services({ onNavigate, onOpenResume, onInquireService }) {
  const settings = useSiteSettings();

  const services = Array.isArray(settings?.services) && settings.services.length > 0
    ? settings.services
    : defaultServices;

  const processSteps = Array.isArray(settings?.processSteps) && settings.processSteps.length > 0
    ? settings.processSteps
    : defaultProcessSteps;

  const handleSelectService = (service) => {
    sounds.playClick();
    if (onInquireService) {
      onInquireService(service);
      return;
    }
    if (onNavigate) {
      onNavigate('Contact');
    }
  };

  return (
    <Box className="services-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Services" onOpenResume={onOpenResume} />

      {/* Hero Section */}
      <section className="services-hero">
        <Typography className="services-kicker">
          {settings?.servicesKicker || '// WHAT I OFFER'}
        </Typography>
        <Typography component="h1" className="services-hero-title">
          {settings?.servicesTitle ? (
            settings.servicesTitle
          ) : (
            <>
              Services Built for
              <br />
              <span>Real Results.</span>
            </>
          )}
        </Typography>
        <Typography className="services-hero-sub">
          {settings?.servicesSub ||
            'From MVP conception to enterprise scaling, I provide full-cycle engineering services with uncompromised quality and transparent communication.'}
        </Typography>
      </section>

      {/* Services Grid */}
      <Box className="services-grid">
        {services.map((service) => (
          <Box
            key={service.id}
            className={`service-card ${service.highlight ? 'highlighted' : ''}`}
          >
            {service.badge && (
              <span className="service-badge">
                <Sparkles size={11} style={{ display: 'inline', marginRight: 4 }} />
                {service.badge}
              </span>
            )}
            <div className="service-icon">{renderServiceIcon(service.icon)}</div>
            <Typography className="service-title">{service.title}</Typography>
            <Typography className="service-desc">{service.description}</Typography>

            <ul className="service-features">
              {service.features?.map((feat, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={15} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="service-footer">
              <div>
                <span className="service-timeline">{service.timeline}</span>
                <Typography className="service-price">{service.price}</Typography>
              </div>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={14} />}
                onClick={() => handleSelectService(service)}
                className="service-cta-btn"
              >
                Inquire Now
              </Button>
            </div>
          </Box>
        ))}
      </Box>

      {/* Process Section */}
      <section className="services-process">
        <Typography className="services-process-title">How We Work Together</Typography>
        <div className="services-process-steps">
          {processSteps.map((step) => (
            <div key={step.step} className="services-step">
              <div className="services-step-num">{step.step}</div>
              <Typography className="services-step-title">{step.title}</Typography>
              <Typography className="services-step-desc">{step.description}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="services-cta-section">
        <Typography component="h2" className="services-cta-title">
          Ready to turn your vision into code?
        </Typography>
        <Typography className="services-cta-sub">
          Book a 15-minute intro call or drop me an inquiry. Let&apos;s build something remarkable.
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={16} />}
          onClick={() => {
            sounds.playClick();
            if (onNavigate) onNavigate('Contact');
          }}
          sx={{
            bgcolor: 'var(--accent-color, #22c55e)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '13px',
            textTransform: 'none',
            borderRadius: '12px',
            px: 4,
            py: 1.2,
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
            '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
          }}
        >
          Start a Project Discussion
        </Button>
      </section>
    </Box>
  );
}
