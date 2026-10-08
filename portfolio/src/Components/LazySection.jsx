import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { CyberLoadingScreen } from './LazyLoader';

/**
 * LazySection Component
 * Uses IntersectionObserver to defer rendering until the user scrolls near the section,
 * reducing memory overhead and improving initial rendering score.
 */
export function LazySection({
  children,
  id,
  className = '',
  rootMargin = '300px',
  fallback,
  minHeight = '360px',
  sx = {},
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Box
      ref={containerRef}
      id={id}
      className={`lazy-section-wrapper ${hasEntered ? 'lazy-section-loaded' : 'lazy-section-pending'} ${className}`}
      sx={{
        minHeight: hasEntered ? 'auto' : minHeight,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        opacity: hasEntered ? 1 : 0.4,
        transform: hasEntered ? 'none' : 'translateY(16px)',
        ...sx,
      }}
    >
      {hasEntered ? children : (fallback || <CyberLoadingScreen compact minHeight={minHeight} />)}
    </Box>
  );
}

export default LazySection;

