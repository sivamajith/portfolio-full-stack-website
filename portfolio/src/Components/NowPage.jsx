import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  MapPin,
  Clock,
  Zap,
  BookOpen,
  Code2,
  Coffee,
  Calendar,
  Sparkles,
  ArrowRight,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const defaultNowProjects = [
  {
    id: '1',
    title: 'Enterprise AI Agent Orchestrator',
    description: 'Building autonomous multi-agent systems with streaming LLM tool calling, session persistence, and vector retrieval.',
    tags: ['React 19', 'Node.js', 'LangChain', 'Postgres Vector'],
    progress: 75,
    status: 'In Active Sprint',
  },
  {
    id: '2',
    title: 'High-Throughput WebSocket Gateway',
    description: 'A distributed pub/sub microservice handling 50k concurrent connection live state sync with Redis clustering.',
    tags: ['Go', 'Docker', 'Redis', 'WebSockets'],
    progress: 90,
    status: 'Beta Testing',
  },
  {
    id: '3',
    title: 'Modern Portfolio CMS & Analytics Engine',
    description: 'Next-gen reactive portfolio ecosystem with real-time settings live dispatch and dynamic theme propagation.',
    tags: ['React', 'MUI v9', 'Tailwind', 'CSS Houdini'],
    progress: 100,
    status: 'Shipped & Live',
  },
];

const defaultLearningSkills = [
  { name: 'Rust & WebAssembly (Wasm)' },
  { name: 'Distributed Consensus (Raft)' },
  { name: 'Kubernetes Operator Design' },
  { name: 'Next.js 15 Server Actions' },
];

const defaultMedia = [
  {
    type: 'book',
    icon: 'book',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    note: 'Deep dive on replication & partitioning tradeoffs',
  },
  {
    type: 'podcast',
    icon: 'audio',
    title: 'Syntax - Tasty Web Development',
    author: 'Wes Bos & Scott Tolinski',
    note: 'Weekly insights on modern frontend patterns',
  },
];

export default function NowPage({ onNavigate, onOpenResume }) {
  const settings = useSiteSettings();

  const nowProjects = Array.isArray(settings?.nowProjects) && settings.nowProjects.length > 0
    ? settings.nowProjects
    : defaultNowProjects;

  const nowLearning = Array.isArray(settings?.nowLearning) && settings.nowLearning.length > 0
    ? settings.nowLearning
    : defaultLearningSkills;

  const nowMedia = Array.isArray(settings?.nowMedia) && settings.nowMedia.length > 0
    ? settings.nowMedia
    : defaultMedia;

  return (
    <Box className="now-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Now" onOpenResume={onOpenResume} />

      {/* Header */}
      <Box sx={{ padding: '48px clamp(20px, 7vw, 100px) 16px', maxWidth: '1240px', margin: '0 auto' }}>
        <span className="services-kicker">// WHAT I'M DOING NOW</span>
        <Typography component="h1" className="services-hero-title">
          Live Snapshot &amp;
          <br />
          <span>Current Focus.</span>
        </Typography>
        <Typography className="services-hero-sub">
          Inspired by Derek Sivers&apos; /now page movement. Here is what I am building, learning, and open to right now.
        </Typography>
      </Box>

      {/* Main Layout */}
      <div className="now-layout">
        {/* Left Column: Status, Availability & Rates */}
        <aside className="now-sidebar">
          {/* Status Card */}
          <div className="now-card now-status-card">
            <span className="now-card-label">CURRENT AVAILABILITY</span>
            <div className="now-status-available">
              <span className="now-status-dot" />
              {settings?.available !== false ? 'Open for Selected Work' : 'Currently Booked'}
            </div>
            <p className="now-status-since">
              {settings?.nowStatusText || 'Available for contract roles, high-impact MVPs, and consulting.'}
            </p>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowRight size={14} />}
              onClick={() => {
                sounds.playClick();
                if (onNavigate) onNavigate('Contact');
              }}
              sx={{
                bgcolor: 'var(--accent-color, #22c55e)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
              }}
            >
              Start a Conversation
            </Button>
          </div>

          {/* Pricing & Rate Card */}
          <div className="now-card">
            <span className="now-card-label">ESTIMATED RATE</span>
            <Typography className="now-rate-value">
              {settings?.nowRate || '$65 - $95'}
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>/ hour</span>
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: 11, mt: 1 }}>
              Fixed project sprints start at <strong>$800</strong> with milestone payments.
            </Typography>
          </div>

          {/* Location & Timezone */}
          <div className="now-card">
            <span className="now-card-label">BASE LOCATION &amp; TIME</span>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#374151', fontSize: 13, mb: 0.8 }}>
              <MapPin size={15} color="var(--accent-color, #22c55e)" />
              <strong>{settings?.location || 'San Francisco, CA / Remote'}</strong>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', fontSize: 12 }}>
              <Clock size={14} />
              <span>Available in UTC-5 to UTC+5:30 overlaps</span>
            </Box>
          </div>
        </aside>

        {/* Right Column: Projects, Learning, Books */}
        <main className="now-main">
          {/* Active Projects */}
          <section>
            <Typography className="now-section-title">
              <Zap size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-color, #22c55e)' }} />
              What I&apos;m Building Right Now
            </Typography>
            {nowProjects.map((p) => (
              <div key={p.id} className="now-project-card">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography className="now-project-title">{p.title}</Typography>
                  <Chip
                    label={p.status}
                    size="small"
                    sx={{
                      bgcolor: 'var(--accent-soft, #dcfce7)',
                      color: 'var(--accent-dark, #16a34a)',
                      fontWeight: 700,
                      fontSize: 10,
                      height: 20,
                    }}
                  />
                </Box>
                <Typography className="now-project-desc">{p.description}</Typography>
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 1.5 }}>
                  {p.tags?.map((tag) => (
                    <span key={tag} className="home-featured-card-chip">{tag}</span>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={p.progress}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': { bgcolor: 'var(--accent-color, #22c55e)', borderRadius: 3 },
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-dark, #16a34a)' }}>
                    {p.progress}%
                  </span>
                </Box>
              </div>
            ))}
          </section>

          {/* Currently Learning */}
          <section>
            <Typography className="now-section-title">
              <Code2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-color, #22c55e)' }} />
              Active Skill Deep Dives
            </Typography>
            <div className="now-card" style={{ padding: '16px 20px' }}>
              {nowLearning.map((item) => (
                <div key={item.name} className="now-learn-item">
                  <span className="now-learn-name">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Media: Reading / Listening */}
          <section>
            <Typography className="now-section-title">
              <BookOpen size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-color, #22c55e)' }} />
              Books &amp; Media on Radar
            </Typography>
            {nowMedia.map((m, idx) => (
              <div key={idx} className="now-read-card">
                <span className="now-read-icon">
                  {m.type === 'podcast' ? '🎧' : '📖'}
                </span>
                <div>
                  <Typography className="now-read-title">{m.title}</Typography>
                  <Typography className="now-read-sub">by {m.author} · <em>{m.note}</em></Typography>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </Box>
  );
}
