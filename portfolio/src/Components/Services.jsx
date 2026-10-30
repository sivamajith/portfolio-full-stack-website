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
import { PortfolioNavigation } from './PortfolioNavigation';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const defaultServices = [];

const defaultProcessSteps = [];

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
        {settings?.servicesKicker ? (
          <Typography className="services-kicker">{settings.servicesKicker}</Typography>
        ) : null}
        {settings?.servicesTitle ? (
          <Typography component="h1" className="services-hero-title">{settings.servicesTitle}</Typography>
        ) : null}
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
