import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import sounds from '../utils/SoundManager';
import useSiteSettings from '../hooks/useSiteSettings';

const REPOSITORIES = [
  {
    name: 'devflow-saas-platform',
    desc: 'Full-stack agile kanban workspace with real-time websocket updates and sprint analytics.',
    stars: 128,
    forks: 34,
    language: 'TypeScript',
    langColor: '#3178c6',
    url: 'https://github.com',
  },
  {
    name: 'headless-ecommerce-store',
    desc: 'Next.js 14, Tailwind CSS, Stripe webhook integration, and automated product catalog management.',
    stars: 94,
    forks: 22,
    language: 'JavaScript',
    langColor: '#f7df1e',
    url: 'https://github.com',
  },
  {
    name: 'realtime-chat-websocket',
    desc: 'High-concurrency chat server built on Node.js, Express, Socket.io, and Redis message broker.',
    stars: 76,
    forks: 19,
    language: 'Node.js',
    langColor: '#539e43',
    url: 'https://github.com',
  },
  {
    name: 'modern-react-portfolio-system',
    desc: 'Interactive developer portfolio with 3D orbits, sound effects, AI assistant, and admin CMS.',
    stars: 215,
    forks: 68,
    language: 'React',
    langColor: '#61dafb',
    url: 'https://github.com',
  },
];

export default function GitHubStats() {
  const settings = useSiteSettings();
  const [filterLang, setFilterLang] = useState('All');

  const githubUrl = settings?.github || 'https://github.com';
  const filteredRepos =
    filterLang === 'All'
      ? REPOSITORIES
      : REPOSITORIES.filter((r) => r.language.toLowerCase().includes(filterLang.toLowerCase()));

  return (
    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <GitHubIcon sx={{ color: 'var(--accent-color, #22c55e)' }} />
            <Typography sx={{ color: 'var(--accent-dark, #16a34a)', fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>
              OPEN SOURCE & GITHUB METRICS
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Recent Coding Activity
          </Typography>
        </Box>

        <Button
          variant="outlined"
          component="a"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          startIcon={<GitHubIcon />}
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: '999px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13,
            borderColor: 'rgba(148, 163, 184, 0.3)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'var(--accent-color, #22c55e)',
              bgcolor: 'var(--accent-soft, #dcfce7)',
            },
          }}
        >
          View Profile on GitHub
        </Button>
      </Box>

      {/* GitHub Quick Stat Numbers */}
      <Grid container spacing={{ xs: 1.2, sm: 2 }} sx={{ mb: 3 }}>
        <Grid xs={6} sm={3}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', bgcolor: (t) => t.palette.mode === 'dark' ? '#1e293b' : '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>
            <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, color: 'text.secondary', fontWeight: 700 }}>YEARLY COMMITS</Typography>
            <Typography sx={{ fontWeight: 900, color: 'var(--accent-dark, #16a34a)', mt: 0.5, fontSize: { xs: 18, sm: 24 } }}>
              1,420+
            </Typography>
          </Box>
        </Grid>
        <Grid xs={6} sm={3}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', bgcolor: (t) => t.palette.mode === 'dark' ? '#1e293b' : '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>
            <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, color: 'text.secondary', fontWeight: 700 }}>STARS EARNED</Typography>
            <Typography sx={{ fontWeight: 900, color: '#eab308', mt: 0.5, fontSize: { xs: 18, sm: 24 } }}>
              513 ★
            </Typography>
          </Box>
        </Grid>
        <Grid xs={6} sm={3}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', bgcolor: (t) => t.palette.mode === 'dark' ? '#1e293b' : '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>
            <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, color: 'text.secondary', fontWeight: 700 }}>PUBLIC REPOSITORIES</Typography>
            <Typography sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5, fontSize: { xs: 18, sm: 24 } }}>
              32
            </Typography>
          </Box>
        </Grid>
        <Grid xs={6} sm={3}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', bgcolor: (t) => t.palette.mode === 'dark' ? '#1e293b' : '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>
            <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, color: 'text.secondary', fontWeight: 700 }}>CURRENT STREAK</Typography>
            <Typography sx={{ fontWeight: 900, color: '#f97316', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: { xs: 18, sm: 24 } }}>
              <LocalFireDepartmentRoundedIcon fontSize="inherit" /> 42 Days
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Top Repositories Grid */}
      <Grid container spacing={2}>
        {filteredRepos.map((repo) => (
          <Grid xs={12} sm={6} key={repo.name}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: '16px',
                height: '100%',
                bgcolor: 'background.paper',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'var(--accent-color, #22c55e)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                },
              }}
            >
              <CardContent sx={{ p: 2.2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-dark, #16a34a)' }}>
                    {repo.name}
                  </Typography>
                  <IconButton
                    size="small"
                    component="a"
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'var(--accent-color, #22c55e)' } }}
                  >
                    <OpenInNewRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography sx={{ fontSize: 12, color: 'text.secondary', my: 1.2, lineHeight: 1.5 }}>
                  {repo.desc}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto', pt: 1, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, fontSize: 11.5, fontWeight: 600 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: repo.langColor }} />
                    {repo.language}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 11.5, color: 'text.secondary' }}>
                    <StarRoundedIcon sx={{ fontSize: 15, color: '#eab308' }} />
                    {repo.stars}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 11.5, color: 'text.secondary' }}>
                    <CallSplitRoundedIcon sx={{ fontSize: 14 }} />
                    {repo.forks}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

