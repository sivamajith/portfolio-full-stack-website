import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Search,
  Grid,
  Compass,
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  Sparkles,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  SlidersHorizontal,
  Flame,
  Filter,
  Check,
} from 'lucide-react';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const defaultTechnologies = {
  frontend: [
    { icon: '⚛️', name: 'React.js', exp: '3+ yrs', desc: 'Hooks, Suspense, Concurrent Mode, Virtual DOM & State Management', tags: ['React 19', 'Zustand', 'Context API', 'Redux Toolkit'] },
    { icon: '▲', name: 'Next.js', exp: '2+ yrs', desc: 'App Router, Server-Side Rendering (SSR), Static Generation & Server Actions', tags: ['App Router', 'SSR/SSG', 'Edge Runtime'] },
    { icon: '🌊', name: 'Tailwind CSS', exp: '3+ yrs', desc: 'Responsive Fluid Design, Custom Design Systems, JIT Engine & Animations', tags: ['Flexbox/Grid', 'Dark Mode', 'Design Tokens'] },
    { icon: '🔷', name: 'TypeScript', exp: '2+ yrs', desc: 'Strict Typing, Generics, Complex Interfaces & Utility Types for robust apps', tags: ['Static Typing', 'Generics', 'Type Inference'] },
    { icon: '🎨', name: 'Material UI', exp: '3+ yrs', desc: 'Custom Theming, Component Overrides, Responsive Layouts & Sx API', tags: ['Theming', 'Emotion', 'Accessible UI'] },
  ],
  backend: [
    { icon: '🟢', name: 'Node.js', exp: '3+ yrs', desc: 'Event Loop architecture, Async I/O, Streams, Microservices & Cluster Engine', tags: ['Event-Driven', 'RESTful', 'Microservices'] },
    { icon: '⚡', name: 'Express.js', exp: '3+ yrs', desc: 'High-throughput REST APIs, Custom Middleware, Request Validation & Security', tags: ['Middlewares', 'Rate Limiting', 'Routing'] },
    { icon: '💬', name: 'Socket.io', exp: '2+ yrs', desc: 'Bi-directional Real-time WebSockets, Room Clustering & Live Broadcasting', tags: ['WebSockets', 'Pub/Sub', 'Live Streams'] },
    { icon: '🔒', name: 'JWT & OAuth', exp: '2+ yrs', desc: 'Stateless Token Auth, RBAC Authorization, Refresh Tokens & OAuth 2.0 Providers', tags: ['RBAC', 'Session Security', 'Bcrypt'] },
  ],
  database: [
    { icon: '🍃', name: 'MongoDB', exp: '3+ yrs', desc: 'Document Modeling, Aggregation Pipelines, Mongoose ODM & Index Tuning', tags: ['Aggregation', 'NoSQL', 'Mongoose ODM'] },
    { icon: '🐘', name: 'PostgreSQL', exp: '2+ yrs', desc: 'Relational Schemas, Complex Multi-joins, Index Optimization & ACID Transactions', tags: ['SQL', 'ACID', 'Indexing'] },
    { icon: '🔥', name: 'Firebase', exp: '2+ yrs', desc: 'Firestore Realtime Database, Cloud Functions, Rules & Serverless Storage', tags: ['Firestore', 'Cloud Functions', 'Auth'] },
    { icon: '🗄️', name: 'Redis', exp: '1+ yr', desc: 'In-memory Cache Invalidation, Distributed Locking, Key Expiry & Rate Limiting', tags: ['Caching', 'Key-Value', 'Memory Store'] },
  ],
  cloud: [
    { icon: '☁️', name: 'AWS (S3/EC2)', exp: '2+ yrs', desc: 'S3 Asset Buckets, CloudFront CDN Distribution, IAM & EC2 Cloud Deployments', tags: ['CloudFront', 'S3 Storage', 'IAM'] },
    { icon: '▲', name: 'Vercel', exp: '3+ yrs', desc: 'Zero-config Edge Deployments, Serverless Lambdas & Automated CI/CD Pipelines', tags: ['CI/CD', 'Edge Functions', 'Preview Deployms'] },
    { icon: '🐳', name: 'Docker', exp: '1+ yr', desc: 'Containerization, Multi-stage Dockerfiles, Docker Compose & Microservices', tags: ['Containers', 'Compose', 'Virtualization'] },
  ],
  tools: [
    { icon: '🔗', name: 'Git & GitHub', exp: '3+ yrs', desc: 'Git Flow, Rebase, Merge Conflicts Resolution, GitHub Actions & Code Reviews', tags: ['Actions CI', 'Branching', 'Version Control'] },
    { icon: '💻', name: 'VS Code', exp: '3+ yrs', desc: 'Advanced Debugging, Custom Workspace Configs, Snippets & Productivity Extensions', tags: ['Debugger', 'Linter', 'IntelliSense'] },
    { icon: '📮', name: 'Postman', exp: '3+ yrs', desc: 'Automated API Collections, Environment Mocking, Pre-request Scripts & Testing', tags: ['API Tests', 'Environments', 'Mocking'] },
    { icon: '📐', name: 'Figma', exp: '2+ yrs', desc: 'UI/UX Wireframing, Responsive Auto-Layouts, Design Systems & Developer Handoff', tags: ['Auto-Layout', 'Design Systems', 'Prototypes'] },
  ],
};

const categoryMeta = {
  frontend: {
    title: 'Frontend Engine',
    short: 'Frontend',
    icon: <Code2 size={16} />,
    color: '#3b82f6',
    accentClass: 'theme-blue',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    badge: 'UI & State',
  },
  backend: {
    title: 'Backend & APIs',
    short: 'Backend',
    icon: <Server size={16} />,
    color: '#10b981',
    accentClass: 'theme-green',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    badge: 'Services & REST',
  },
  database: {
    title: 'Database & Cache',
    short: 'Database',
    icon: <Database size={16} />,
    color: '#a855f7',
    accentClass: 'theme-purple',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    badge: 'Data Layer',
  },
  cloud: {
    title: 'Cloud & Infra',
    short: 'Cloud',
    icon: <Cloud size={16} />,
    color: '#06b6d4',
    accentClass: 'theme-cyan',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    badge: 'DevOps & Edge',
  },
  tools: {
    title: 'Tools & Workflow',
    short: 'Tools',
    icon: <Wrench size={16} />,
    color: '#f59e0b',
    accentClass: 'theme-amber',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    badge: 'Dev Workflow',
  },
};

export default function SkillsSection({ onNavigate, onOpenResume }) {
  const settings = useSiteSettings();
  const [viewMode, setViewMode] = useState('orbit'); // 'orbit' | 'matrix'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState(null);
  const [spotlightTech, setSpotlightTech] = useState(null);
  const [radarScanning, setRadarScanning] = useState(true);

  const skillGroups = useMemo(() => {
    return settings?.technologies && Object.keys(settings.technologies).length
      ? settings.technologies
      : defaultTechnologies;
  }, [settings?.technologies]);

  const allSkillsList = useMemo(() => {
    return Object.entries(skillGroups).flatMap(([category, items]) =>
      Array.isArray(items)
        ? items.map((item) => ({
            ...item,
            category,
            meta: categoryMeta[category.toLowerCase()] || {
              title: category,
              short: category,
              icon: <Layers size={14} />,
              color: '#16a34a',
              accentClass: 'theme-green',
            },
          }))
        : []
    );
  }, [skillGroups]);

  // Set default spotlight item
  useEffect(() => {
    if (!spotlightTech && allSkillsList.length > 0) {
      setSpotlightTech(allSkillsList[0]);
    }
  }, [allSkillsList, spotlightTech]);

  const filteredSkills = useMemo(() => {
    return allSkillsList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
        item.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [allSkillsList, searchQuery, activeCategory]);

  const categories = useMemo(() => {
    return Object.keys(skillGroups);
  }, [skillGroups]);

  const handleToggleView = (mode) => {
    sounds.playBlip();
    setViewMode(mode);
  };

  const handleCategorySelect = (catKey) => {
    sounds.playClick();
    setActiveCategory((prev) => (prev === catKey ? 'all' : catKey));
  };

  const handleTechClick = (tech) => {
    sounds.playClick();
    setSelectedTech(tech);
    setSpotlightTech(tech);
  };

  const handleTechHover = (tech) => {
    setSpotlightTech(tech);
  };

  return (
    <div className="skills-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Skills" onOpenResume={onOpenResume} />

      <main className="skills-hero-container">
        {/* Top Header & View Switcher */}
        <div className="skills-top-bar">
          <div className="skills-heading-meta">
            <div className="skills-kicker-badge">
              <Cpu size={14} className="kicker-icon" />
              <span>{settings?.skillsKicker || 'FULL STACK ARCHITECTURE'}</span>
            </div>
            <div className="skills-total-badge">
              <Sparkles size={13} className="sparkle-icon" />
              <span>{allSkillsList.length} Technologies & Tools</span>
            </div>
          </div>

          <div className="skills-view-toggle-bar">
            <div className="skills-view-toggle">
              <button
                type="button"
                className={viewMode === 'orbit' ? 'toggle-active' : ''}
                onClick={() => handleToggleView('orbit')}
                aria-label="Orbit Radar View"
              >
                <Compass size={15} />
                <span>Interactive Radar</span>
              </button>
              <button
                type="button"
                className={viewMode === 'matrix' ? 'toggle-active' : ''}
                onClick={() => handleToggleView('matrix')}
                aria-label="Technology Matrix View"
              >
                <Grid size={15} />
                <span>Technology Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'orbit' ? (
          <div className="skills-radar-workspace">
            {/* Left/Top Meta Hero Details */}
            <div className="skills-intro-banner">
              <div className="skills-intro-left">
                <h1 className="skills-main-title">
                  {settings?.skillsTitle ? (
                    settings.skillsTitle
                  ) : (
                    <>
                      Interactive <span className="gradient-text">Skills Constellation</span>
                    </>
                  )}
                </h1>
                <p className="skills-lead">
                  {settings?.skillsDescription ||
                    'Explore my production-ready engineering stack. Hover or click any technology node to inspect architectures, frameworks, and proficiencies.'}
                </p>
              </div>

            </div>

            {/* Interactive Domain Filter Pills */}
            <div className="radar-filter-toolbar">
              <div className="radar-category-chips">
                <button
                  type="button"
                  className={`radar-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('all')}
                >
                  <Layers size={13} />
                  <span>All Clusters ({allSkillsList.length})</span>
                </button>
                {categories.map((catKey) => {
                  const meta = categoryMeta[catKey.toLowerCase()] || {
                    title: catKey,
                    icon: <Layers size={13} />,
                  };
                  const count = (skillGroups[catKey] || []).length;
                  const isActive = activeCategory === catKey.toLowerCase();
                  return (
                    <button
                      key={catKey}
                      type="button"
                      className={`radar-cat-btn ${isActive ? 'active ' + meta.accentClass : ''}`}
                      onClick={() => handleCategorySelect(catKey.toLowerCase())}
                    >
                      {meta.icon}
                      <span>{meta.short || catKey}</span>
                      <span className="chip-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="radar-toggles-row">
                <button
                  type="button"
                  className={`radar-action-pill ${radarScanning ? 'active-pill' : ''}`}
                  onClick={() => setRadarScanning(!radarScanning)}
                  title="Toggle Radar Sweep Effect"
                >
                  <Flame size={13} />
                  <span>{radarScanning ? 'Scanner Active' : 'Scanner Paused'}</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Radar & Constellation Deck */}
            <div className="radar-stage-wrapper">
              <div className="radar-grid-canvas">
                {/* Background Ambient FX */}
                <div className="radar-ambient-glow" />
                <div className={`radar-scanner-sweep ${radarScanning ? 'is-sweeping' : ''}`} />

                {/* Concentric Radar Guides */}
                <div className="radar-ring radar-ring-inner" />
                <div className="radar-ring radar-ring-mid" />
                <div className="radar-ring radar-ring-outer" />
                <div className="radar-axis-line radar-axis-h" />
                <div className="radar-axis-line radar-axis-v" />

                {/* Constellation Category Clusters Grid (Responsive & Anti-Overlap Architecture) */}
                <div className="constellation-clusters-deck">
                  {categories.map((catKey) => {
                    const meta = categoryMeta[catKey.toLowerCase()] || {
                      title: catKey,
                      short: catKey,
                      icon: <Layers size={15} />,
                      color: '#16a34a',
                      accentClass: 'theme-green',
                      badge: 'Engine',
                    };
                    const items = skillGroups[catKey] || [];
                    const isDimmed = activeCategory !== 'all' && activeCategory !== catKey.toLowerCase();
                    const isFocused = activeCategory === catKey.toLowerCase();

                    return (
                      <div
                        key={catKey}
                        className={`cluster-card ${meta.accentClass} ${
                          isDimmed ? 'is-dimmed' : ''
                        } ${isFocused ? 'is-focused' : ''}`}
                      >
                        {/* Cluster Header */}
                        <div
                          className="cluster-header"
                          onClick={() => handleCategorySelect(catKey.toLowerCase())}
                        >
                          <div className="cluster-title-wrap">
                            <span className="cluster-icon-box">{meta.icon}</span>
                            <div>
                              <h3 className="cluster-name">{meta.title}</h3>
                              <span className="cluster-badge-tag">{meta.badge}</span>
                            </div>
                          </div>
                          <span className="cluster-count-indicator">{items.length} Techs</span>
                        </div>

                        {/* Cluster Badges / Nodes */}
                        <div className="cluster-nodes-grid">
                          {items.map((tech) => {
                            const isSpotlight = spotlightTech?.name === tech.name;
                            return (
                              <button
                                key={tech.name}
                                type="button"
                                className={`tech-node-chip ${isSpotlight ? 'is-spotlight' : ''}`}
                                onClick={() => handleTechClick({ ...tech, category: catKey, meta })}
                                onMouseEnter={() => handleTechHover({ ...tech, category: catKey, meta })}
                              >
                                <span className="tech-node-emoji">{tech.icon}</span>
                                <span className="tech-node-name">{tech.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right/Bottom Interactive Live Spotlight HUD Panel */}
              <div className="radar-spotlight-hud">
                <div className="spotlight-hud-header">
                  <div className="spotlight-hud-tag">
                    <Sparkles size={13} className="sparkle-icon" />
                    <span>TECH INSPECTOR HUD</span>
                  </div>
                  {spotlightTech && (
                    <span className="spotlight-cat-pill">
                      {spotlightTech.category?.toUpperCase() || 'CORE'}
                    </span>
                  )}
                </div>

                {spotlightTech ? (
                  <div className="spotlight-hud-body">
                    <div className="spotlight-hero-row">
                      <div className="spotlight-icon-gem">
                        {spotlightTech.icon || '⚡'}
                      </div>
                      <div className="spotlight-hero-titles">
                        <h3>{spotlightTech.name}</h3>
                        <div className="spotlight-exp-pill">
                          <span>Experience:</span>
                          <strong>{spotlightTech.exp || '2+ Years'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Scope & Description */}
                    <div className="spotlight-desc-block">
                      <p>
                        {spotlightTech.desc ||
                          'Architected for high-performance scale, reliability, and modular integration.'}
                      </p>
                    </div>

                    {/* Key Capabilities */}
                    {spotlightTech.tags && spotlightTech.tags.length > 0 && (
                      <div className="spotlight-tags-block">
                        <span className="spotlight-subhead">Key Competencies</span>
                        <div className="spotlight-tags-flow">
                          {spotlightTech.tags.map((tag) => (
                            <span key={tag} className="spotlight-tag-item">
                              <Check size={11} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Action Button */}
                    <div className="spotlight-action-wrap">
                      <button
                        type="button"
                        className="spotlight-deep-dive-btn"
                        onClick={() => handleTechClick(spotlightTech)}
                      >
                        <span>Deep Dive Inspection</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="spotlight-empty-prompt">
                    <Compass size={32} className="empty-compass" />
                    <p>Hover or click any technology node in the radar above to inspect architecture metrics.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Technology Matrix View */
          <div className="skills-matrix-wrap">
            {/* Search & Filter Command Header */}
            <div className="matrix-control-panel">
              <div className="matrix-search-input-wrap">
                <Search size={17} className="search-icon-svg" />
                <input
                  type="text"
                  placeholder="Search frameworks, databases, tools (e.g. React, Next.js, Docker, SQL)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="matrix-category-tabs">
                <button
                  type="button"
                  className={`matrix-tab-btn ${activeCategory === 'all' ? 'tab-active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setActiveCategory('all');
                  }}
                >
                  <span>ALL</span>
                  <span className="tab-badge">{allSkillsList.length}</span>
                </button>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.toLowerCase();
                  const count = (skillGroups[cat] || []).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`matrix-tab-btn ${isActive ? 'tab-active' : ''}`}
                      onClick={() => {
                        sounds.playClick();
                        setActiveCategory(cat.toLowerCase());
                      }}
                    >
                      <span>{cat.toUpperCase()}</span>
                      <span className="tab-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Status */}
            <div className="matrix-results-status">
              <span>
                Showing <strong>{filteredSkills.length}</strong> of {allSkillsList.length} technologies
              </span>
              {searchQuery && (
                <span className="filter-badge">
                  Filtered by &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {/* Skills Grid */}
            {filteredSkills.length > 0 ? (
              <div className="matrix-grid">
                {filteredSkills.map((tech) => (
                  <div
                    className="matrix-card"
                    key={`${tech.category}-${tech.name}`}
                    onClick={() => handleTechClick(tech)}
                  >
                    <div className="matrix-card-header">
                      <div className="matrix-card-icon-box">{tech.icon}</div>
                      <div className="matrix-card-info">
                        <div className="matrix-title-row">
                          <strong>{tech.name}</strong>
                        </div>
                        <span className="matrix-cat-tag">
                          {tech.category.toUpperCase()} · {tech.exp || '2+ yrs'}
                        </span>
                      </div>
                    </div>

                    {tech.desc && <p className="matrix-card-desc">{tech.desc}</p>}

                    {tech.tags && tech.tags.length > 0 && (
                      <div className="matrix-micro-tags">
                        {tech.tags.map((tag) => (
                          <span key={tag} className="micro-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="matrix-empty-state">
                <Search size={42} className="empty-icon" />
                <h3>No matching technologies found</h3>
                <p>Try searching for a different keyword or reset the category filter.</p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Selected Skill Deep Dive Modal */}
        {selectedTech && (
          <div className="skill-modal-backdrop" onClick={() => setSelectedTech(null)}>
            <div className="skill-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedTech(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="modal-header">
                <div className="modal-icon-big">{selectedTech.icon}</div>
                <div>
                  <div className="modal-category-label">
                    {selectedTech.category?.toUpperCase()}
                  </div>
                  <h2>{selectedTech.name}</h2>
                  <span className="modal-exp-badge">Experience: {selectedTech.exp || '2+ Years'}</span>
                </div>
              </div>

              <div className="modal-body">
                <div className="modal-desc-box">
                  <h4>Technical Scope & Production Applications</h4>
                  <p>
                    {selectedTech.desc ||
                      'Used across modern production systems for optimal performance and scale.'}
                  </p>
                </div>

                {selectedTech.tags && (
                  <div className="modal-tags-box">
                    <h4>Core Competencies & Keywords</h4>
                    <div className="modal-tags-list">
                      {selectedTech.tags.map((t) => (
                        <span key={t} className="modal-tag-chip">
                          <Zap size={11} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-action-btn"
                  onClick={() => {
                    setSelectedTech(null);
                    onNavigate('Projects');
                  }}
                >
                  View Related Projects <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .skills-page {
          min-height: 100vh;
          color: #0f172a;
          background: transparent;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          padding-bottom: 70px;
        }
        .skills-hero-container {
          max-width: 1380px;
          margin: 0 auto;
          padding: 24px clamp(16px, 4vw, 48px);
        }

        /* Top Bar */
        .skills-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .skills-heading-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .skills-kicker-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: var(--accent-dark, #16a34a);
          background: var(--accent-soft, #dcfce7);
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.25);
          text-transform: uppercase;
        }
        .kicker-icon {
          color: var(--accent-color, #22c55e);
        }
        .skills-total-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: rgba(148, 163, 184, 0.14);
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
        }
        .sparkle-icon {
          color: var(--accent-color, #22c55e);
        }

        .skills-view-toggle {
          display: flex;
          gap: 6px;
          background: rgba(148, 163, 184, 0.12);
          padding: 4px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          backdrop-filter: blur(10px);
        }
        .skills-view-toggle button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: none;
          background: transparent;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skills-view-toggle button:hover {
          color: #0f172a;
        }
        .skills-view-toggle button.toggle-active {
          background: #ffffff;
          color: var(--accent-dark, #16a34a);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        /* Intro Banner & HUD */
        .skills-intro-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 28px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .skills-intro-left {
          flex: 1;
          min-width: 280px;
        }
        .skills-main-title {
          margin: 0 0 8px;
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -1.2px;
          color: #0f172a;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .skills-lead {
          color: #64748b;
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0;
          max-width: 620px;
        }

        .skills-hud-stats {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hud-stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          padding: 10px 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          transition: transform 0.2s ease;
        }
        .hud-stat-card:hover {
          transform: translateY(-2px);
        }
        .hud-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
        }
        .icon-green { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
        .icon-blue { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
        .icon-purple { background: rgba(168, 85, 247, 0.12); color: #9333ea; }
        
        .hud-stat-data {
          display: flex;
          flex-direction: column;
        }
        .hud-stat-val {
          font-size: 16px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }
        .hud-stat-lbl {
          font-size: 10.5px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* Filter Toolbar */
        .radar-filter-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .radar-category-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .radar-cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.22);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .radar-cat-btn:hover {
          color: #0f172a;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .radar-cat-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }
        .radar-cat-btn.active.theme-blue { background: #2563eb; border-color: #2563eb; color: #fff; }
        .radar-cat-btn.active.theme-green { background: #16a34a; border-color: #16a34a; color: #fff; }
        .radar-cat-btn.active.theme-purple { background: #9333ea; border-color: #9333ea; color: #fff; }
        .radar-cat-btn.active.theme-cyan { background: #0891b2; border-color: #0891b2; color: #fff; }
        .radar-cat-btn.active.theme-amber { background: #d97706; border-color: #d97706; color: #fff; }

        .chip-count {
          font-size: 10px;
          background: rgba(148, 163, 184, 0.18);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .radar-cat-btn.active .chip-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .radar-toggles-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .radar-action-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(241, 245, 249, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.2);
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .radar-action-pill:hover {
          color: #0f172a;
          background: #ffffff;
        }
        .radar-action-pill.active-pill {
          color: var(--accent-dark, #16a34a);
          background: var(--accent-soft, #dcfce7);
          border-color: rgba(34, 197, 94, 0.3);
        }

        /* Radar Stage & HUD Wrapper */
        .radar-stage-wrapper {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 22px;
          align-items: stretch;
        }

        /* Radar Stage Canvas */
        .radar-grid-canvas {
          position: relative;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 65%, rgba(241, 245, 249, 0.95) 100%);
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 28px;
          padding: 36px 28px;
          min-height: 560px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.05);
        }

        /* Ambient Glow & Scanner */
        .radar-ambient-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0) 65%);
          pointer-events: none;
        }
        .radar-scanner-sweep {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 540px;
          height: 540px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
          background: conic-gradient(from 0deg at 50% 50%, rgba(34, 197, 94, 0.15) 0deg, rgba(34, 197, 94, 0) 60deg, transparent 360deg);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .radar-scanner-sweep.is-sweeping {
          opacity: 1;
          animation: radarSweepAnim 9s linear infinite;
        }
        @keyframes radarSweepAnim {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Radar Rings & Axis */
        .radar-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
        }
        .radar-ring-inner {
          width: 220px;
          height: 220px;
          border: 1px dashed rgba(34, 197, 94, 0.22);
        }
        .radar-ring-mid {
          width: 440px;
          height: 440px;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .radar-ring-outer {
          width: 660px;
          height: 660px;
          border: 1px dashed rgba(148, 163, 184, 0.14);
        }
        .radar-axis-line {
          position: absolute;
          pointer-events: none;
          background: rgba(148, 163, 184, 0.12);
        }
        .radar-axis-h {
          top: 50%;
          left: 5%;
          right: 5%;
          height: 1px;
        }
        .radar-axis-v {
          left: 50%;
          top: 5%;
          bottom: 5%;
          width: 1px;
        }

        /* Central Core Reactor */
        .radar-center-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          height: 90px;
          display: grid;
          place-items: center;
          cursor: pointer;
          z-index: 10;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .radar-center-core:hover {
          transform: translate(-50%, -50%) scale(1.08);
        }
        .core-glow-aura {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.28) 0%, rgba(34, 197, 94, 0) 70%);
          animation: statusPulse 2.6s infinite;
        }
        .core-orbit-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color, #22c55e);
          box-shadow: 0 0 8px var(--accent-color, #22c55e);
        }
        .dot-1 {
          top: 0;
          left: 50%;
          animation: orbitDot 6s linear infinite;
        }
        .dot-2 {
          bottom: 0;
          left: 50%;
          animation: orbitDot 6s linear infinite reverse;
        }
        @keyframes orbitDot {
          0% { transform: rotate(0deg) translateX(44px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
        }
        .core-inner-disc {
          position: relative;
          width: 72px;
          height: 72px;
          background: #ffffff;
          border: 2px solid rgba(34, 197, 94, 0.3);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 28px rgba(34, 197, 94, 0.22);
          z-index: 2;
        }
        .core-brand-logo {
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--accent-dark, #16a34a);
          line-height: 1;
        }
        .core-sub-title {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #64748b;
          margin-top: 2px;
        }

        /* Constellation Clusters Grid (Flexible, non-overlapping) */
        .constellation-clusters-deck {
          position: relative;
          z-index: 6;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .cluster-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .cluster-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
        }
        .cluster-card.is-dimmed {
          opacity: 0.45;
          filter: grayscale(40%);
          transform: scale(0.98);
        }
        .cluster-card.is-focused {
          opacity: 1;
          filter: none;
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 42px rgba(15, 23, 42, 0.12);
        }

        /* Color accents per theme */
        .cluster-card.theme-blue { border-top: 3px solid #3b82f6; }
        .cluster-card.theme-blue:hover, .cluster-card.theme-blue.is-focused { border-color: #3b82f6; }
        .cluster-card.theme-green { border-top: 3px solid #10b981; }
        .cluster-card.theme-green:hover, .cluster-card.theme-green.is-focused { border-color: #10b981; }
        .cluster-card.theme-purple { border-top: 3px solid #a855f7; }
        .cluster-card.theme-purple:hover, .cluster-card.theme-purple.is-focused { border-color: #a855f7; }
        .cluster-card.theme-cyan { border-top: 3px solid #06b6d4; }
        .cluster-card.theme-cyan:hover, .cluster-card.theme-cyan.is-focused { border-color: #06b6d4; }
        .cluster-card.theme-amber { border-top: 3px solid #f59e0b; }
        .cluster-card.theme-amber:hover, .cluster-card.theme-amber.is-focused { border-color: #f59e0b; }

        .cluster-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        }
        .cluster-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cluster-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: rgba(148, 163, 184, 0.12);
        }
        .theme-blue .cluster-icon-box { color: #2563eb; background: rgba(59, 130, 246, 0.12); }
        .theme-green .cluster-icon-box { color: #059669; background: rgba(16, 185, 129, 0.12); }
        .theme-purple .cluster-icon-box { color: #9333ea; background: rgba(168, 85, 247, 0.12); }
        .theme-cyan .cluster-icon-box { color: #0891b2; background: rgba(6, 182, 212, 0.12); }
        .theme-amber .cluster-icon-box { color: #d97706; background: rgba(245, 158, 11, 0.12); }

        .cluster-name {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .cluster-badge-tag {
          display: inline-block;
          font-size: 9.5px;
          color: #64748b;
          font-weight: 700;
        }
        .cluster-count-indicator {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          background: rgba(148, 163, 184, 0.14);
          padding: 2px 7px;
          border-radius: 999px;
        }

        .cluster-nodes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tech-node-chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(241, 245, 249, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 10px;
          padding: 5px 9px;
          font-size: 11.5px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tech-node-chip:hover {
          background: #ffffff;
          color: #0f172a;
          transform: translateY(-2px) scale(1.02);
          border-color: var(--accent-color, #22c55e);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }
        .tech-node-chip.is-spotlight {
          background: #ffffff;
          color: var(--accent-dark, #16a34a);
          border-color: var(--accent-color, #22c55e);
          box-shadow: 0 6px 18px rgba(34, 197, 94, 0.22);
          transform: translateY(-2px) scale(1.03);
        }
        .tech-node-emoji {
          font-size: 13px;
          line-height: 1;
        }
        .tech-node-name {
          white-space: nowrap;
        }
        .tech-node-glow-pip {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color, #22c55e);
          box-shadow: 0 0 6px var(--accent-color, #22c55e);
        }

        /* Right/Bottom Spotlight HUD Panel */
        .radar-spotlight-hud {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
          position: relative;
        }

        .spotlight-hud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }
        .spotlight-hud-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--accent-dark, #16a34a);
          text-transform: uppercase;
        }
        .spotlight-cat-pill {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          background: rgba(148, 163, 184, 0.14);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .spotlight-hud-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }
        .spotlight-hero-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .spotlight-icon-gem {
          font-size: 28px;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--accent-soft, #dcfce7);
          border: 1px solid rgba(34, 197, 94, 0.25);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.15);
          flex-shrink: 0;
        }
        .spotlight-hero-titles h3 {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }
        .spotlight-exp-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #64748b;
        }
        .spotlight-exp-pill strong {
          color: #0f172a;
        }


        .spotlight-desc-block p {
          margin: 0;
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.55;
        }

        .spotlight-subhead {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }
        .spotlight-tags-flow {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .spotlight-tag-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--accent-dark, #16a34a);
          background: var(--accent-soft, #dcfce7);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .spotlight-action-wrap {
          margin-top: auto;
          padding-top: 10px;
        }
        .spotlight-deep-dive-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 12.5px;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .spotlight-deep-dive-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(34, 197, 94, 0.35);
        }

        .spotlight-empty-prompt {
          text-align: center;
          padding: 40px 16px;
          color: #94a3b8;
        }
        .empty-compass {
          margin-bottom: 10px;
          color: var(--accent-color, #22c55e);
          animation: statusPulse 2s infinite;
        }
        .spotlight-empty-prompt p {
          font-size: 12px;
          line-height: 1.5;
        }

        /* Matrix Section */
        .skills-matrix-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .matrix-control-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          padding: 16px 20px;
          border-radius: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
        }
        .matrix-search-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 260px;
          background: rgba(241, 245, 249, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          padding: 8px 14px;
          transition: border-color 0.2s ease;
        }
        .matrix-search-input-wrap:focus-within {
          border-color: var(--accent-color, #22c55e);
          background: #ffffff;
        }
        .search-icon-svg {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .matrix-search-input-wrap input {
          border: none;
          outline: none;
          font-size: 13.5px;
          font-family: inherit;
          width: 100%;
          color: #0f172a;
          background: transparent;
        }
        .clear-search-btn {
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
        }

        .matrix-category-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .matrix-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: transparent;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .matrix-tab-btn:hover {
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .matrix-tab-btn.tab-active {
          background: var(--accent-color, #22c55e);
          color: #ffffff;
          border-color: var(--accent-color, #22c55e);
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25);
        }
        .tab-badge {
          font-size: 9.5px;
          background: rgba(0, 0, 0, 0.08);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .tab-active .tab-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .matrix-results-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          color: #64748b;
          padding: 0 6px;
        }
        .filter-badge {
          background: var(--accent-soft, #dcfce7);
          color: var(--accent-dark, #16a34a);
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 11px;
        }

        .matrix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 18px;
        }
        .matrix-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 20px;
          padding: 20px;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .matrix-card:hover {
          border-color: var(--accent-color, #22c55e);
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
        }
        .matrix-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .matrix-card-icon-box {
          font-size: 26px;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          background: rgba(241, 245, 249, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          flex-shrink: 0;
        }
        .matrix-card-info {
          flex: 1;
          min-width: 0;
        }
        .matrix-title-row strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .matrix-cat-tag {
          display: inline-block;
          font-size: 10.5px;
          color: #64748b;
          font-weight: 700;
          margin-top: 3px;
        }
        .matrix-score-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 800;
          color: var(--accent-dark, #16a34a);
          background: var(--accent-soft, #dcfce7);
          padding: 4px 9px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .check-icon {
          color: var(--accent-color, #22c55e);
        }

        .matrix-card-desc {
          font-size: 12.5px;
          color: #64748b;
          margin: 12px 0 14px;
          line-height: 1.5;
          flex-grow: 1;
        }

        .matrix-micro-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
        }
        .micro-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
          background: rgba(148, 163, 184, 0.12);
          padding: 2px 7px;
          border-radius: 6px;
        }


        .matrix-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          border: 1px dashed rgba(148, 163, 184, 0.3);
        }
        .empty-icon {
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .matrix-empty-state h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .matrix-empty-state p {
          color: #64748b;
          font-size: 13px;
          margin: 0 0 18px;
        }
        .reset-filter-btn {
          border: none;
          background: var(--accent-color, #22c55e);
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
        }

        /* Modal Styles */
        .skill-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          z-index: 9999;
          padding: 20px;
        }
        .skill-modal-content {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          width: min(520px, 94vw);
          padding: 32px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(148, 163, 184, 0.2);
          animation: modalPop 0.24s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes modalPop {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-close-btn {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(241, 245, 249, 0.8);
          color: #64748b;
          display: grid;
          place-items: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
        }
        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }
        .modal-icon-big {
          font-size: 40px;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          background: var(--accent-soft, #dcfce7);
          border-radius: 18px;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .modal-category-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--accent-dark, #16a34a);
        }
        .modal-header h2 {
          margin: 2px 0 6px;
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }
        .modal-exp-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          background: rgba(148, 163, 184, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
        }
        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .modal-desc-box h4, .modal-tags-box h4 {
          margin: 0 0 6px;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }
        .modal-desc-box p {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
        }
        .modal-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .modal-tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--accent-dark, #16a34a);
          background: var(--accent-soft, #dcfce7);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .modal-footer {
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;
        }
        .modal-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .radar-stage-wrapper {
            grid-template-columns: 1fr;
          }
          .radar-spotlight-hud {
            min-height: auto;
          }
        }

        @media (max-width: 768px) {
          .skills-top-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .skills-view-toggle {
            width: 100%;
          }
          .skills-view-toggle button {
            flex: 1;
            justify-content: center;
          }
          .radar-grid-canvas {
            padding: 24px 16px;
            min-height: auto;
          }
          .radar-center-core {
            display: none;
          }
          .radar-ring {
            display: none;
          }
          .constellation-clusters-deck {
            grid-template-columns: 1fr;
          }
          .matrix-search-input-wrap {
            min-width: 100%;
          }
          .matrix-category-tabs {
            width: 100%;
          }
          .matrix-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Dark Mode */
        .dark-mode .skills-page {
          color: #f1f5f9;
        }
        .dark-mode .skills-main-title,
        .dark-mode .cluster-name,
        .dark-mode .hud-stat-val,
        .dark-mode .spotlight-hero-titles h3,
        .dark-mode .spotlight-subhead,
        .dark-mode .spotlight-exp-pill strong,
        .dark-mode .matrix-title-row strong,
        .dark-mode .modal-desc-box h4,
        .dark-mode .modal-tags-box h4 {
          color: #ffffff;
        }
        .dark-mode .skills-lead,
        .dark-mode .spotlight-desc-block p,
        .dark-mode .matrix-card-desc,
        .dark-mode .modal-desc-box p {
          color: #94a3b8;
        }
        .dark-mode .hud-stat-card,
        .dark-mode .cluster-card,
        .dark-mode .radar-spotlight-hud,
        .dark-mode .matrix-control-panel,
        .dark-mode .matrix-card,
        .dark-mode .skill-modal-content {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        }
        .dark-mode .radar-grid-canvas {
          background: radial-gradient(circle at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 70%);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .dark-mode .tech-node-chip {
          background: rgba(30, 41, 59, 0.85);
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }
        .dark-mode .tech-node-chip:hover,
        .dark-mode .tech-node-chip.is-spotlight {
          background: #1e293b;
          color: #34d399;
          border-color: #10b981;
        }
        .dark-mode .radar-cat-btn {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }
        .dark-mode .radar-cat-btn:hover {
          background: #1e293b;
          color: #ffffff;
        }
        .dark-mode .radar-cat-btn.active {
          background: #34d399;
          color: #0f172a;
          border-color: #34d399;
        }
        .dark-mode .radar-action-pill {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }
        .dark-mode .core-inner-disc {
          background: #0f172a;
          border-color: rgba(34, 197, 94, 0.4);
        }
        .dark-mode .core-brand-logo {
          color: #34d399;
        }
        .dark-mode .skills-view-toggle {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .dark-mode .skills-view-toggle button.toggle-active {
          background: #1e293b;
          color: #34d399;
        }
        .dark-mode .matrix-search-input-wrap {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .dark-mode .matrix-search-input-wrap input {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
