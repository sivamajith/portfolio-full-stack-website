import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const defaultArticles = [
  {
    id: '1',
    title: 'Architecting Scalable Microservices with Node.js & Docker',
    excerpt:
      'A deep dive into decoupled systems, event-driven message queues, Redis caching layers, and high-throughput Docker containerization in production.',
    date: 'Aug 24, 2026',
    readTime: '6 min read',
    tag: 'Architecture',
    category: 'Architecture',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    featured: true,
    url: '#',
  },
  {
    id: '2',
    title: 'Mastering React 19: Server Actions, Suspense & Compiler',
    excerpt:
      'Exploring how the React compiler eliminates manual memoization and how Server Actions streamline mutation workflows.',
    date: 'Aug 10, 2026',
    readTime: '5 min read',
    tag: 'React',
    category: 'React',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    featured: false,
    url: '#',
  },
  {
    id: '3',
    title: 'Zero-Downtime Database Migrations with MongoDB & Postgres',
    excerpt:
      'Strategies for schema versioning, expand-and-contract deployment patterns, and transactional data integrity at scale.',
    date: 'Jul 28, 2026',
    readTime: '8 min read',
    tag: 'Database',
    category: 'Database',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    featured: false,
    url: '#',
  },
  {
    id: '4',
    title: 'Fullstack Type Safety: End-to-End TypeScript & tRPC',
    excerpt:
      'Eliminate API schema mismatches forever by sharing types seamlessly across client interfaces and server models.',
    date: 'Jul 15, 2026',
    readTime: '4 min read',
    tag: 'TypeScript',
    category: 'TypeScript',
    image: 'https://images.unsplash.com/photo-1516116211227-bbc13c733383?w=800&auto=format&fit=crop&q=80',
    featured: false,
    url: '#',
  },
  {
    id: '5',
    title: 'Crafting 60fps Micro-Interactions in Web UIs',
    excerpt:
      'Harnessing CSS hardware acceleration, will-change, and Web Animations API for delightful and accessible user experiences.',
    date: 'Jun 30, 2026',
    readTime: '5 min read',
    tag: 'UI/UX',
    category: 'UI/UX',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    featured: false,
    url: '#',
  },
  {
    id: '6',
    title: 'Automated CI/CD Pipelines with GitHub Actions & AWS ECS',
    excerpt:
      'Setting up automated testing, linting, Docker build caches, and rolling blue-green deployments to AWS ECS.',
    date: 'Jun 12, 2026',
    readTime: '7 min read',
    tag: 'DevOps',
    category: 'DevOps',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    featured: false,
    url: '#',
  },
];

export default function Blog({ onNavigate, onOpenResume }) {
  const settings = useSiteSettings();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const articles = Array.isArray(settings?.blogPosts) && settings.blogPosts.length > 0
    ? settings.blogPosts
    : defaultArticles;

  const availableCategories = ['All', ...Array.from(new Set(articles.map((a) => a.category || a.tag).filter(Boolean)))];

  const filteredArticles = articles.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tag.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      post.tag?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredArticles.find((p) => p.featured) || filteredArticles[0];
  const regularPosts = filteredArticles.filter((p) => p.id !== featuredPost?.id);

  return (
    <Box className="blog-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Blog" onOpenResume={onOpenResume} />

      {/* Hero Header */}
      <section className="blog-hero">
        <Typography className="blog-kicker">
          {settings?.blogKicker || '// ARTICLES & INSIGHTS'}
        </Typography>
        <Typography component="h1" className="blog-hero-title">
          {settings?.blogTitle ? (
            settings.blogTitle
          ) : (
            <>
              Thoughts on Code,
              <br />
              <span>Design & Craft.</span>
            </>
          )}
        </Typography>
        <Typography className="blog-hero-sub">
          {settings?.blogSub ||
            'Deep dives into modern web engineering, distributed systems architecture, clean code practices, and building performant products.'}
        </Typography>
      </section>

      {/* Search & Filter Controls */}
      <Box className="blog-controls">
        <TextField
          className="blog-search"
          placeholder="Search articles..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="var(--accent-color, #22c55e)" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.7)',
            },
          }}
        />

        <Box className="blog-filter-chips">
          {availableCategories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat);
              }}
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer',
                bgcolor:
                  selectedCategory === cat
                    ? 'var(--accent-color, #22c55e)'
                    : 'rgba(0,0,0,0.04)',
                color: selectedCategory === cat ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor:
                    selectedCategory === cat
                      ? 'var(--accent-dark, #16a34a)'
                      : 'var(--accent-soft, #dcfce7)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Featured Article Card */}
      {featuredPost && (
        <Box className="blog-featured">
          <Box className="blog-featured-card">
            <Box className="blog-featured-img">
              <img src={featuredPost.image} alt={featuredPost.title} />
            </Box>
            <Box className="blog-featured-content">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <span className="blog-featured-tag">{featuredPost.tag}</span>
                <Chip
                  icon={<Sparkles size={12} color="#f59e0b" />}
                  label="Featured Read"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    color: '#d97706',
                    fontWeight: 700,
                    fontSize: '10px',
                    height: '22px',
                  }}
                />
              </Box>
              <Typography className="blog-featured-title">
                {featuredPost.title}
              </Typography>
              <Typography className="blog-featured-excerpt">
                {featuredPost.excerpt}
              </Typography>
              <Box className="blog-featured-meta">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8', fontSize: '11px' }}>
                  <Calendar size={13} /> {featuredPost.date}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8', fontSize: '11px' }}>
                  <Clock size={13} /> {featuredPost.readTime}
                </Box>
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={14} />}
                onClick={() => sounds.playClick()}
                sx={{
                  bgcolor: 'var(--accent-color, #22c55e)',
                  color: '#fff',
                  width: 'fit-content',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '12px',
                  px: 2.5,
                  py: 0.8,
                  '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
                }}
              >
                Read Full Article
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Regular Articles Grid */}
      <Box className="blog-grid">
        {regularPosts.map((post) => (
          <Box key={post.id} className="blog-card">
            <span className="blog-card-tag">{post.tag}</span>
            <Typography className="blog-card-title">{post.title}</Typography>
            <Typography className="blog-card-excerpt">{post.excerpt}</Typography>
            <Box className="blog-card-footer">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span className="blog-card-date">
                  <Calendar size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {post.date}
                </span>
                <span className="blog-card-date">
                  <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {post.readTime}
                </span>
              </Box>
              <IconButton
                className="blog-card-read-btn"
                onClick={() => sounds.playClick()}
                aria-label="Read article"
              >
                <ArrowRight size={14} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {filteredArticles.length === 0 && (
        <Box className="blog-empty">
          <BookOpen size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No articles found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search keyword or selected category.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
