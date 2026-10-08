import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import BrokenImageRoundedIcon from '@mui/icons-material/BrokenImageRounded';

/**
 * Premium Progressive Lazy Image Component
 * - Defers loading until image is scrolled near viewport
 * - Shimmers smoothly while loading
 * - Ultra-smooth fade & micro-zoom transition upon load
 * - Graceful fallback badge on network error
 */
export function LazyImage({
  src,
  alt = 'Image preview',
  className = '',
  style = {},
  sx = {},
  aspectRatio,
  objectFit = 'cover',
  fallbackIcon,
  placeholderColor,
  threshold = 0.05,
  rootMargin = '250px',
  onClick,
  ...rest
}) {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Reset loaded/error state when src changes
    setLoaded(false);
    setError(false);
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <Box
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio || 'auto',
        bgcolor: placeholderColor || 'rgba(148, 163, 184, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...rest}
    >
      {/* Shimmer Placeholder while loading */}
      {!loaded && !error && (
        <Box
          className="lazy-image-shimmer"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
            '.dark-mode &': {
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)',
            },
            backgroundSize: '200% 100%',
            animation: 'cyberShimmer 1.6s infinite ease-in-out',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Actual Lazy Loaded Image */}
      {inView && src && !error && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit,
            display: 'block',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: loaded ? 'none' : 'blur(4px)',
            ...style,
          }}
        />
      )}

      {/* Fallback state when failed or missing */}
      {error && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 2,
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(241, 245, 249, 0.6)',
            '.dark-mode &': {
              bgcolor: 'rgba(15, 23, 42, 0.6)',
            },
          }}
        >
          {fallbackIcon || <BrokenImageRoundedIcon sx={{ fontSize: 28, opacity: 0.6 }} />}
          <Typography sx={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
            {alt || 'Preview unavailable'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default LazyImage;

