import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

/**
 * TopProgressBar Component
 * Renders a glowing progress bar at the top of the viewport during page/route transitions.
 */
export function TopProgressBar({ isNavigating = false }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer1;
    let timer2;
    let timer3;

    if (isNavigating) {
      setVisible(true);
      setProgress(25);
      timer1 = setTimeout(() => setProgress(65), 150);
      timer2 = setTimeout(() => setProgress(85), 350);
    } else if (visible) {
      setProgress(100);
      timer3 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isNavigating, visible]);

  if (!visible && progress === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
        bgcolor: 'rgba(34, 197, 94, 0.15)',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          bgcolor: 'var(--accent-color, #22c55e)',
          boxShadow: '0 0 10px var(--accent-color, #22c55e), 0 0 5px var(--accent-color, #22c55e)',
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s ease-out 0.1s' : 'width 0.35s ease-in-out',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </Box>
  );
}

export default TopProgressBar;

