import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogContent,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { PortfolioNavigation } from "./Home";
import sounds from "../utils/SoundManager";
import { loadProjects as loadCachedProjects, clearPublicDataCache } from "../utils/publicData";

const COLORS = {
  green: "var(--accent-color, #22c55e)",
  greenDark: "var(--accent-dark, #16a34a)",
  greenSoft: "var(--accent-soft, #dcfce7)",
  greenBorder: "#bbf7d0",
  ink: "#0f172a",
  navy: "#0b1220",
  gray: "#64748b",
  grayLight: "#94a3b8",
  bg: "#ffffff",
  cardBg: "#ffffff",
  chipBg: "var(--accent-soft, #eafcf1)",
  chipText: "var(--accent-dark, #15803d)",
};

const PROJECTS = [
  {
    id: "devflow",
    title: "DevFlow",
    subtitle: "Project Management Dashboard",
    tags: ["React", "Node.js", "MongoDB", "WebSockets"],
    type: "dashboard",
    category: "Full Stack",
    impact: "A focused workspace that turns complex team activity into a clear weekly sprint rhythm.",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
    codeSnippet: `// DevFlow Real-time Task Board Hook
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export function useDevFlowBoard(boardId) {
  const [columns, setColumns] = useState({
    todo: [{ id: 1, title: 'Auth API endpoint', tag: 'Backend' }],
    inProgress: [{ id: 2, title: 'Kanban drag motion', tag: 'UI' }],
    done: [{ id: 3, title: 'Database schema migration', tag: 'Database' }]
  });

  const moveTask = (taskId, targetCol) => {
    // Broadcast via WebSockets
    socket.emit('task:move', { taskId, targetCol });
  };

  return { columns, moveTask };
}`,
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    subtitle: "Full Stack Storefront",
    tags: ["React.js", "Next.js", "Stripe", "Tailwind"],
    type: "gallery",
    category: "Frontend",
    impact: "A conversion-focused storefront with sub-second page transitions and instant cart checkout.",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
    codeSnippet: `// Headless Storefront Cart Context
export function useCart() {
  const [items, setItems] = useState([]);
  
  const addItem = (product) => {
    setItems((prev) => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  return { items, addItem, total };
}`,
  },
  {
    id: "chatapp",
    title: "Chat App",
    subtitle: "Real-time Messaging Platform",
    tags: ["Socket.io", "Node.js", "Redis", "React"],
    type: "chat",
    category: "Full Stack",
    impact: "A real-time messaging experience designed around speed, typing presence, and human connection.",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
    codeSnippet: `// WebSocket Chat Client Handler
const socket = io(CHAT_SERVER_URL);

socket.on('message:received', (payload) => {
  appendMessage({
    id: payload.id,
    sender: payload.sender,
    text: payload.text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  playNotificationChime();
});`,
  },
  {
    id: "portfolio",
    title: "Portfolio Site",
    subtitle: "Interactive Brand Experience",
    tags: ["Next.js", "Web Audio", "Material UI"],
    type: "gallery",
    category: "Frontend",
    impact: "A high-signal personal brand system with expressive motion and a sharp editorial hierarchy.",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
    codeSnippet: `// Dynamic Theme & Audio System
const playFeedback = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(type === 'success' ? 880 : 440, ctx.currentTime);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};`,
  },
  {
    id: "weather",
    title: "Weather App",
    subtitle: "Realtime Forecast Widget",
    tags: ["React", "Weather API", "Charts"],
    type: "dashboard",
    category: "Experiments",
    impact: "A glanceable forecast widget that keeps useful weather information calm and accessible.",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
    codeSnippet: `// Realtime Weather Forecaster
export async function getLiveWeather(city) {
  const res = await fetch(\`https://api.weather.com/v1/forecast?q=\${city}\`);
  const data = await res.json();
  return {
    temp: data.main.temp,
    condition: data.weather[0].main,
    forecast: data.daily
  };
}`,
  },
];

/* ----------------------------- Mockup Previews ----------------------------- */

function DashboardMockup() {
  const bars = [40, 65, 35, 80, 55, 95, 60];
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ bgcolor: COLORS.navy, px: 1.75, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: COLORS.green }} />
          <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>DevFlow Kanban</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <CloudQueueRoundedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
          <MoreHorizRoundedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
        </Stack>
      </Box>
      <Box sx={{ flex: 1, display: "flex", bgcolor: COLORS.navy }}>
        <Stack spacing={1.1} sx={{ width: 30, py: 1.4, alignItems: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          {[COLORS.green, "#334155", "#334155", "#334155"].map((c, i) => (
            <Box key={i} sx={{ width: 12, height: 12, borderRadius: "4px", bgcolor: c }} />
          ))}
        </Stack>
        <Box sx={{ flex: 1, bgcolor: "#f6f8fa", m: 1, borderRadius: "10px", p: 1.1 }}>
          <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 1.3, bgcolor: "#fff", borderRadius: "8px", p: 0.9, display: "flex", alignItems: "flex-end", gap: "3px", height: 62 }}>
              {bars.map((h, i) => (
                <Box key={i} sx={{ flex: 1, height: `${h}%`, borderRadius: "3px", bgcolor: i === 5 ? COLORS.green : "#c9f2d8" }} />
              ))}
            </Box>
            <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "8px", p: 0.7, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <LockRoundedIcon sx={{ fontSize: 12, color: COLORS.green }} />
                <Typography sx={{ fontSize: 8, color: COLORS.gray }}>Secure</Typography>
              </Stack>
              <Box sx={{ alignSelf: "center", width: 28, height: 28, borderRadius: "50%", border: `3px solid ${COLORS.greenSoft}`, borderTopColor: COLORS.green }} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function GalleryMockup() {
  const blocks = [
    "linear-gradient(135deg,#cbd5c0,#9fae95)",
    "linear-gradient(135deg,#d8cfc2,#b8a998)",
    "linear-gradient(135deg,#c2ccd8,#9aabbf)",
    "linear-gradient(135deg,#d9d2c7,#b3a48f)",
  ];
  return (
    <Box sx={{ height: "100%", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", p: "6px", bgcolor: "#eef1ec" }}>
      {blocks.map((g, i) => (
        <Box key={i} sx={{ borderRadius: "8px", background: g }} />
      ))}
    </Box>
  );
}

function ChatMockup() {
  const rows = [
    { name: "Amara K.", msg: "Sounds good, see you then!", unread: true },
    { name: "Dev Team", msg: "Pushed the new build 🚀", unread: false },
    { name: "Liam O.", msg: "Typing…", unread: true },
  ];
  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "#fff", p: 1.2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, bgcolor: "#f1f5f9", borderRadius: "999px", px: 1, py: 0.5, mb: 1 }}>
        <SearchRoundedIcon sx={{ fontSize: 14, color: COLORS.grayLight }} />
        <Typography sx={{ fontSize: 10, color: COLORS.grayLight }}>Search chats</Typography>
      </Box>
      <Stack spacing={1}>
        {rows.map((r, i) => (
          <Stack key={i} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: i % 2 ? "#93c5fd" : "#a7f3d0" }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700 }}>{r.name}</Typography>
              <Typography noWrap sx={{ fontSize: 9, color: COLORS.gray }}>{r.msg}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function Mockup({ type, project }) {
  if (project?.image) {
    return (
      <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
        <img
          src={project.image}
          alt={project.imageAlt || project.title || 'Project preview'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
    );
  }
  if (type === "dashboard") return <DashboardMockup />;
  if (type === "chat") return <ChatMockup />;
  return <GalleryMockup />;
}

/* --------------------------------- Card ---------------------------------- */

function ProjectCard({ project, isActive, onOpen }) {
  const handleViewWebsite = (e) => {
    e.stopPropagation();
    sounds.playClick();
    if (project.liveUrl && project.liveUrl.trim()) {
      const targetUrl = project.liveUrl.startsWith('http://') || project.liveUrl.startsWith('https://')
        ? project.liveUrl.trim()
        : `https://${project.liveUrl.trim()}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpen(project);
    }
  };

  const tags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === 'string'
    ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "22px",
        overflow: "hidden",
        bgcolor: COLORS.cardBg,
        boxShadow: isActive ? "0 30px 60px -20px rgba(15,23,42,0.35)" : "0 12px 30px -18px rgba(15,23,42,0.18)",
        display: "flex",
        flexDirection: "column",
        border: isActive ? "1px solid var(--accent-color, #22c55e)" : "1px solid #f1f5f9",
      }}
    >
      <Box sx={{ height: { xs: 140, sm: 160 } }}>
        <Mockup type={project.type} project={project} />
      </Box>

      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: COLORS.ink, lineHeight: 1.2 }}>
            {project.title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              sounds.playClick();
              onOpen(project);
            }}
            aria-label={`Open ${project.title} details`}
            sx={{
              bgcolor: "var(--accent-soft, #dcfce7)",
              width: 28,
              height: 28,
              flexShrink: 0,
              "&:hover": { bgcolor: "var(--accent-color, #22c55e)", color: "#fff" },
            }}
          >
            <NorthEastRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Stack>

        <Typography sx={{ fontSize: 13, color: COLORS.gray, mt: 0.4, mb: 1, lineHeight: 1.3 }}>
          {project.subtitle}
        </Typography>

        {tags.length > 0 && (
          <Stack direction="row" spacing={0.6} sx={{ mb: 1.5, flexWrap: "wrap", rowGap: 0.6 }}>
            {tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: "var(--accent-soft, #eafcf1)",
                  color: "var(--accent-dark, #15803d)",
                  fontWeight: 600,
                  fontSize: 11,
                  height: 22,
                }}
              />
            ))}
            {tags.length > 3 && (
              <Chip
                label={`+${tags.length - 3}`}
                size="small"
                sx={{
                  bgcolor: "rgba(148, 163, 184, 0.15)",
                  color: COLORS.gray,
                  fontWeight: 600,
                  fontSize: 10.5,
                  height: 22,
                }}
              />
            )}
          </Stack>
        )}

        <Box sx={{ mt: "auto", pt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleViewWebsite}
            endIcon={<LaunchRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              borderRadius: "10px",
              py: 0.75,
              bgcolor: "var(--accent-color, #22c55e)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 12.5,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "var(--accent-dark, #16a34a)",
                boxShadow: "0 6px 16px rgba(34, 197, 94, 0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            View Website
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------- Carousel --------------------------------- */

function Carousel({ projects, onOpen, onActiveProject }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const safeIndex = Math.min(index, Math.max(0, projects.length - 1));

  useEffect(() => {
    onActiveProject?.(projects[safeIndex] || null);
  }, [onActiveProject, projects, safeIndex]);

  const goPrev = () => {
    sounds.playBlip();
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  };
  const goNext = () => {
    sounds.playBlip();
    setIndex((i) => (i + 1) % projects.length);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  const CARD_W = 270;
  const CARD_GAP = 20;
  const STEP = CARD_W + CARD_GAP;

  return (
    <Box
      sx={{ position: "relative", width: "100%", touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Box sx={{ position: "relative", height: { xs: 410, sm: 440 }, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: `${CARD_GAP}px`,
            transition: "transform 0.45s cubic-bezier(.22,.9,.32,1)",
            transform: `translateX(calc(-${CARD_W / 2}px - ${safeIndex * STEP}px))`,
          }}
        >
          {projects.map((project, i) => {
            const offset = i - safeIndex;
            const active = offset === 0;
            const visible = Math.abs(offset) <= 1;
            return (
              <Box
                key={project._id || project.id || `project-${i}`}
                sx={{
                  width: CARD_W,
                  height: active ? { xs: 395, sm: 400 } : { xs: 350, sm: 355 },
                  flexShrink: 0,
                  transition: "all 0.45s cubic-bezier(.22,.9,.32,1)",
                  transform: `scale(${active ? 1 : 0.92}) translateY(${active ? 0 : 15}px)`,
                  opacity: visible ? (active ? 1 : 0.45) : 0,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <ProjectCard project={project} isActive={active} onOpen={onOpen} />
              </Box>
            );
          })}
        </Box>
      </Box>

      <IconButton
        onClick={goPrev}
        aria-label="Previous project"
        sx={{
          position: "absolute",
          left: { xs: 4, sm: 10, md: -56 },
          top: "42%",
          transform: "translateY(-50%)",
          width: { xs: 38, sm: 46 },
          height: { xs: 38, sm: 46 },
          zIndex: 10,
          bgcolor: "#fff",
          border: `1px solid var(--accent-color, #22c55e)`,
          boxShadow: "0 8px 20px -8px rgba(34,197,94,0.35)",
          "&:hover": { bgcolor: "var(--accent-soft, #dcfce7)" },
        }}
      >
        <ArrowBackIosNewRoundedIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
      </IconButton>

      <IconButton
        onClick={goNext}
        aria-label="Next project"
        sx={{
          position: "absolute",
          right: { xs: 4, sm: 10, md: -56 },
          top: "42%",
          transform: "translateY(-50%)",
          width: { xs: 38, sm: 46 },
          height: { xs: 38, sm: 46 },
          zIndex: 10,
          bgcolor: "#fff",
          border: `1px solid var(--accent-color, #22c55e)`,
          boxShadow: "0 8px 20px -8px rgba(34,197,94,0.35)",
          "&:hover": { bgcolor: "var(--accent-soft, #dcfce7)" },
        }}
      >
        <ArrowForwardIosRoundedIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
      </IconButton>

      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "center" }}>
        {projects.map((p, i) => (
          <Box
            key={p.id ?? p._id ?? `project-dot-${i}`}
            onClick={() => {
              sounds.playClick();
              setIndex(i);
            }}
            sx={{
              cursor: "pointer",
              width: i === safeIndex ? 22 : 8,
              height: 8,
              borderRadius: "999px",
              bgcolor: i === safeIndex ? "var(--accent-color, #22c55e)" : "#d9e2dc",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

/* --------------------------------- Section --------------------------------- */

export default function FeaturedWork({ onNavigate, onOpenResume, onOpenScheduler }) {
  const [projects, setProjects] = useState(PROJECTS);
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  

  const availableCategories = Array.from(
    new Set(projects.map((p) => p.category?.trim()).filter(Boolean))
  );
  const filters = ["All", ...(availableCategories.length ? availableCategories : ["Frontend", "Full Stack", "Experiments"])];

  const visibleProjects = filter === "All"
    ? projects
    : projects.filter((project) => project.category?.toLowerCase() === filter.toLowerCase());

  const loadProjects = () => {
    loadCachedProjects()
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProjects();

    const handleUpdate = () => {
      clearPublicDataCache();
      loadCachedProjects();
    };
    window.addEventListener('portfolio-projects-updated', handleUpdate);
    window.addEventListener('portfolio-settings-updated', handleUpdate);

    return () => {
      window.removeEventListener('portfolio-projects-updated', handleUpdate);
      window.removeEventListener('portfolio-settings-updated', handleUpdate);
    };
  }, []);

  return (
    <Box className="projects-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Projects" onOpenResume={onOpenResume} />
      
      <Box
        component="section"
        className="projects-section"
        sx={{
          bgcolor: COLORS.bg,
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 4, md: 8 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 5, md: 4 },
          maxWidth: 1280,
          width: "100%",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        {/* Left Copy */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 38%" }, maxWidth: { xs: "100%", md: 460 }, width: "100%", textAlign: { xs: "center", md: "left" } }}>
          <Typography
            sx={{
              color: "var(--accent-color, #22c55e)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              fontFamily: "'Roboto Mono', 'Courier New', monospace",
              mb: 1.5,
            }}
          >
            {"// FEATURED WORK"}
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 30, sm: 36, md: 42 },
              lineHeight: 1.1,
              color: COLORS.ink,
              mb: 2,
            }}
          >
            Some Things
            <br />
            <Box component="span" sx={{ color: "var(--accent-color, #22c55e)" }}>
              I&apos;ve Built
            </Box>
          </Typography>

          <Typography sx={{ color: COLORS.gray, fontSize: { xs: 13.5, sm: 15 }, lineHeight: 1.7, mb: 3, whiteSpace: "pre-line" }}>
            {activeProject?.desc || activeProject?.impact || activeProject?.subtitle || "Production-grade systems, interactive applications, and real-time experiences built with modern architecture."}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", rowGap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            {filters.map((item) => (
              <Button
                key={item}
                onClick={() => {
                  sounds.playClick();
                  setFilter(item);
                }}
                className={filter === item ? "project-filter-active" : ""}
                sx={{
                  borderRadius: "999px",
                  px: 1.75,
                  py: 0.65,
                  minWidth: 0,
                  border: `1px solid ${filter === item ? "var(--accent-color, #22c55e)" : "rgba(148, 163, 184, 0.3)"}`,
                  color: filter === item ? "#fff" : "text.primary",
                  bgcolor: filter === item ? "var(--accent-color, #22c55e)" : "transparent",
                  fontSize: 12,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {item}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap", rowGap: 1 }}>
            <Button
              variant="contained"
              onClick={() => onNavigate("Contact")}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                borderRadius: "12px",
                bgcolor: "var(--accent-color, #22c55e)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 12.5,
                py: 0.8,
                px: 2,
                boxShadow: "0 6px 18px rgba(34, 197, 94, 0.25)",
                "&:hover": { bgcolor: "var(--accent-dark, #16a34a)" },
              }}
            >
              Get In Touch
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                sounds.playClick();
                onOpenScheduler();
              }}
              startIcon={<CalendarMonthRoundedIcon />}
              sx={{
                borderRadius: "12px",
                borderColor: "var(--accent-color, #22c55e)",
                color: "var(--accent-dark, #16a34a)",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 12.5,
                py: 0.8,
                px: 2,
                "&:hover": {
                  borderColor: "var(--accent-dark, #16a34a)",
                  bgcolor: "var(--accent-soft, #dcfce7)",
                },
              }}
            >
              Book a Call
            </Button>
          </Stack>
        </Box>

        {/* Right Carousel */}
        <Box sx={{ flex: 1, width: "100%", minWidth: 0, pl: { md: 4 } }}>
          <Carousel projects={visibleProjects} onOpen={setSelectedProject} onActiveProject={setActiveProject} />
        </Box>
      </Box>

      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { m: { xs: 1, sm: 2 }, borderRadius: { xs: "18px", sm: "24px" }, overflow: "hidden", maxHeight: "94vh" } } }}
      >
        <DialogContent className="project-dialog" sx={{ p: { xs: 2, sm: 3 } }}>
          <IconButton
            onClick={() => setSelectedProject(null)}
            aria-label="Close project details"
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {selectedProject && (
            <Box>
              <Box sx={{ height: 220, borderRadius: "16px", overflow: "hidden", mb: 2 }}>
                <Mockup type={selectedProject.type} project={selectedProject} />
              </Box>
              <Typography sx={{ color: "var(--accent-dark, #16a34a)", fontWeight: 800, fontSize: 11 }}>
                {selectedProject.category} / ARCHITECTURE
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.ink, my: 0.5 }}>
                {selectedProject.title}
              </Typography>
              <Typography sx={{ color: COLORS.gray, lineHeight: 1.7, fontSize: 14 }}>
                {selectedProject.impact}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}>
                {(Array.isArray(selectedProject.tags) ? selectedProject.tags : typeof selectedProject.tags === "string" ? selectedProject.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []).map((tag) => (
                  <Chip key={tag} label={tag} sx={{ bgcolor: "var(--accent-soft, #dcfce7)", color: "var(--accent-dark, #16a34a)", fontWeight: 700 }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: "wrap", rowGap: 1 }}>
                {selectedProject.liveUrl && (
                  <Button variant="contained" onClick={() => window.open(selectedProject.liveUrl, "_blank", "noopener,noreferrer")} endIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />} sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, bgcolor: "var(--accent-color, #22c55e)" }}>
                    Visit Live Website
                  </Button>
                )}
                {selectedProject.sourceUrl && (
                  <Button variant="outlined" onClick={() => window.open(selectedProject.sourceUrl, "_blank", "noopener,noreferrer")} startIcon={<CodeRoundedIcon sx={{ fontSize: 16 }} />} sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}>
                    Source Code
                  </Button>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}