import React, { useState, useEffect } from 'react';
import { Box, Typography, keyframes } from '@mui/material';

// --- Cyber Keyframe Animations ---
const cyberShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spinRing = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinRingReverse = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.35;
    transform: scale(0.92);
    filter: blur(24px);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.08);
    filter: blur(34px);
  }
`;

const floatParticle = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
  50% { transform: translateY(-12px) scale(1.2); opacity: 0.9; }
`;

const loadingMessages = [
  'INITIALIZING QUANTUM MATRIX',
  'COMPILING CLIENT ASSETS',
  'DECRYPTING PORTFOLIO DATA',
  'SYNCHRONIZING INTERFACE',
  'CALIBRATING 60FPS ENGINE',
  'PREPARING SHOWCASE',
];

/**
 * Ultra-Premium Cyber / Glassmorphic Loading Screen
 * Features:
 * - Glowing multi-layered concentric orbital rings
 * - Smooth simulated percentage progress (0% -> 99% -> 100%)
 * - Matrix particle field & scanline glow
 */
export function CyberLoadingScreen({
  message,
  minHeight = '70vh',
  compact = false,
  showProgress = true,
}) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  // Rotating messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  // Smooth percentage simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.max(1, Math.floor((95 - prev) * 0.12));
        return Math.min(95, prev + increment);
      });
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const displayMsg = message || loadingMessages[msgIndex];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? '260px' : minHeight,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        py: compact ? 3 : 8,
        px: 2,
        userSelect: 'none',
      }}
    >
      {/* Background Ambient Glow */}
      <Box
        sx={{
          position: 'absolute',
          width: compact ? 200 : 380,
          height: compact ? 200 : 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-color, #22c55e) 0%, rgba(6, 182, 212, 0.15) 45%, rgba(34, 197, 94, 0) 75%)',
          animation: `${pulseGlow} 3.2s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Cyber Particle Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '22%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'var(--accent-color, #22c55e)',
          boxShadow: '0 0 14px var(--accent-color, #22c55e)',
          animation: `${floatParticle} 2.6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '22%',
          right: '24%',
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: 'var(--accent-dark, #16a34a)',
          boxShadow: '0 0 12px var(--accent-dark, #16a34a)',
          animation: `${floatParticle} 3.4s ease-in-out infinite 0.8s`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '18%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          bgcolor: '#06b6d4',
          boxShadow: '0 0 10px #06b6d4',
          animation: `${floatParticle} 2.2s ease-in-out infinite 0.4s`,
        }}
      />

      {/* Cyber Spinner Core */}
      <Box
        sx={{
          position: 'relative',
          width: compact ? 70 : 104,
          height: compact ? 70 : 104,
          display: 'grid',
          placeItems: 'center',
          zIndex: 1,
          mb: compact ? 2 : 3,
        }}
      >
        {/* Outer Orbiting Ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2.5px solid transparent',
            borderTopColor: 'var(--accent-color, #22c55e)',
            borderRightColor: '#06b6d4',
            animation: `${spinRing} 1.3s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
          }}
        />

        {/* Inner Counter-Orbiting Ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: compact ? 7 : 11,
            borderRadius: '50%',
            border: '2px dashed transparent',
            borderBottomColor: 'var(--accent-dark, #16a34a)',
            borderLeftColor: '#3b82f6',
            animation: `${spinRingReverse} 1.9s linear infinite`,
          }}
        />

      </Box>

      {/* Futuristic Status Badge & Progress */}
      <Box
        sx={{
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.2,
          maxWidth: '90%',
        }}
      >
        {/* Main Status Pill */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            px: 2,
            py: 0.75,
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            '.dark-mode &': {
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            },
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'var(--accent-color, #22c55e)',
              boxShadow: '0 0 10px var(--accent-color, #22c55e)',
              animation: `${pulseGlow} 1.4s infinite`,
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Roboto Mono', 'Courier New', monospace",
              fontSize: compact ? 11 : 12.5,
              fontWeight: 700,
              letterSpacing: 1.4,
              color: 'var(--accent-dark, #16a34a)',
              '.dark-mode &': {
                color: 'var(--accent-soft, #dcfce7)',
              },
            }}
          >
            {displayMsg}
          </Typography>

          {showProgress && (
            <Typography
              sx={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: compact ? 10.5 : 11.5,
                fontWeight: 800,
                color: 'var(--accent-color, #22c55e)',
                ml: 0.5,
                opacity: 0.9,
              }}
            >
              {progress}%
            </Typography>
          )}
        </Box>

        {/* Shimmering Progress Track */}
        <Box
          sx={{
            width: compact ? 130 : 210,
            height: 4,
            borderRadius: 999,
            background: 'rgba(148, 163, 184, 0.2)',
            overflow: 'hidden',
            position: 'relative',
            mt: 0.5,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent-dark, #16a34a) 0%, var(--accent-color, #22c55e) 50%, #06b6d4 100%)',
              transition: 'width 0.2s ease-out',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: `${cyberShimmer} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>

      </Box>
    </Box>
  );
}

/**
 * Reusable Cyber Skeleton Block with smooth ambient light shimmer
 */
export function SkeletonBlock({
  width = '100%',
  height = 20,
  borderRadius = '10px',
  sx = {},
}) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'rgba(148, 163, 184, 0.14)',
        '.dark-mode &': {
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)',
          '.dark-mode &': {
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.12), rgba(255, 255, 255, 0.08), transparent)',
          },
          backgroundSize: '200% 100%',
          animation: `${cyberShimmer} 1.6s infinite`,
        },
        ...sx,
      }}
    />
  );
}

/**
 * Project Card Skeleton
 */
export function ProjectCardSkeleton() {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '20px',
        bgcolor: '#ffffff',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        '.dark-mode &': {
          bgcolor: '#1e293b',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <SkeletonBlock width="100%" height={170} borderRadius="14px" />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <SkeletonBlock width="60px" height={22} borderRadius="999px" />
        <SkeletonBlock width="80px" height={22} borderRadius="999px" />
      </Box>
      <SkeletonBlock width="70%" height={26} borderRadius="8px" />
      <SkeletonBlock width="100%" height={40} borderRadius="8px" />
      <SkeletonBlock width="100%" height={38} borderRadius="10px" sx={{ mt: 'auto' }} />
    </Box>
  );
}

/**
 * Skill Card Skeleton
 */
export function SkillCardSkeleton() {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '18px',
        bgcolor: '#ffffff',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        '.dark-mode &': {
          bgcolor: '#1e293b',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <SkeletonBlock width={48} height={48} borderRadius="12px" />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <SkeletonBlock width="60%" height={18} borderRadius="6px" />
        <SkeletonBlock width="40%" height={14} borderRadius="6px" />
      </Box>
    </Box>
  );
}

/**
 * Dynamic Skeleton Page tailored for smooth UX during lazy transitions
 */
export function SkeletonPage({ type = 'general' }) {
  if (type === 'projects') {
    return (
      <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 3, md: 6 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '380px 1fr' }, gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SkeletonBlock width="130px" height={24} borderRadius="999px" />
          <SkeletonBlock width="85%" height={48} borderRadius="12px" />
          <SkeletonBlock width="100%" height={80} borderRadius="12px" />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <SkeletonBlock width="75px" height={32} borderRadius="999px" />
            <SkeletonBlock width="85px" height={32} borderRadius="999px" />
            <SkeletonBlock width="80px" height={32} borderRadius="999px" />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </Box>
      </Box>
    );
  }

  if (type === 'skills') {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <SkeletonBlock width="150px" height={26} borderRadius="999px" />
          <SkeletonBlock width="340px" height={44} borderRadius="12px" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2.5 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  return <CyberLoadingScreen />;
}

export default CyberLoadingScreen;
