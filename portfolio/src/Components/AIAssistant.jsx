import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Paper,
  Fade,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';

import sounds from '../utils/SoundManager';
import useSiteSettings from '../hooks/useSiteSettings';
import { loadProjects, clearPublicDataCache } from '../utils/publicData';

// Persona Modes definition
const PERSONA_MODES = [
  { id: 'general', label: 'All-Rounder', icon: SmartToyRoundedIcon, desc: 'General portfolio Q&A, navigation & info' },
  { id: 'recruiter', label: 'Recruiter Scout', icon: WorkOutlineRoundedIcon, desc: 'ATS summary, skills radar, notice & hire info' },
  { id: 'client', label: 'Client / Project', icon: CalculateRoundedIcon, desc: 'Estimates, project timelines & consultations' },
  { id: 'tech', label: 'Tech Architect', icon: CodeRoundedIcon, desc: 'System design, stack choices & code geekery' },
];

// Categorized Prompt Suggestions
const PROMPT_CATEGORIES = {
  '🔥 Popular': [
    'What are your top core technical skills?',
    'Tell me about your best projects',
    'Are you available for freelance / hire?',
    'Can you estimate a project for me?',
    'Can I see your ATS resume?',
  ],
  '💼 Recruiter': [
    'Give me an executive ATS hiring summary',
    'What is your notice period and availability?',
    'Show me your backend & system design strengths',
    'What sets you apart from other full-stack devs?',
  ],
  '💡 Client / Biz': [
    'How do you deliver projects from idea to launch?',
    'What is the estimated cost & timeline for an MVP?',
    'Can we sign an NDA and get post-launch support?',
    'How can I book a 15-minute discovery call?',
  ],
  '🛠️ Architecture': [
    'Why React, Node.js and MongoDB for your stack?',
    'How do you optimize web performance and LCP?',
    'What security practices do you implement in APIs?',
    'Show me an example code snippet or architecture design',
  ],
  '🇮🇳 தமிழ் / Tanglish': [
    'Ungala pathi brief ah sollu (Bio & Story)',
    'Enna enna projects panni irukeenga?',
    'Skills and tech stack enna?',
    'Contact panna epdi reach panradhu?',
  ],
};

// Project Data for Rich Cards Widget
const FEATURED_PROJECTS = [
  {
    title: 'DevFlow Dashboard',
    tag: 'Fullstack / SaaS',
    tech: 'React • Node.js • Socket.io',
    description: 'Real-time collaborative task and workflow manager with live socket updates.',
  },
  {
    title: 'Pulse Commerce Store',
    tag: 'E-Commerce / FinTech',
    tech: 'React • Stripe API • MongoDB',
    description: 'High-conversion storefront with dynamic cart, checkout & analytics.',
  },
  {
    title: 'Neural Chat App',
    tag: 'Real-time / AI',
    tech: 'WebSockets • React • Gemini API',
    description: 'Ultra-low latency chat platform with AI-assisted response generation.',
  },
];

export function buildAIReply(query, settingsOverride = {}, activeMode = 'general', liveData = {}) {
  const rawQuery = String(query || '');
  const q = rawQuery.toLowerCase().trim();
  const name = settingsOverride?.name || 'Developer';
  const role = settingsOverride?.role || 'Full Stack Developer';
  const email = settingsOverride?.email || 'contact@example.com';
  const phone = settingsOverride?.phone || '+91 98765 43210';
  const location = settingsOverride?.location || 'Remote / Hybrid';
  const projects = Array.isArray(liveData.projects) ? liveData.projects : [];
  const services = Array.isArray(settingsOverride?.services) ? settingsOverride.services : [];
  const blogPosts = Array.isArray(settingsOverride?.blogPosts) ? settingsOverride.blogPosts : [];
  const technologies = Object.values(settingsOverride?.technologies || {})
    .flatMap((items) => Array.isArray(items) ? items : [])
    .map((item) => item?.name)
    .filter(Boolean);
  const projectSummary = projects.length
    ? projects.map((project, index) => `${index + 1}. **${project.title}** — ${project.subtitle || project.description || project.impact || 'Portfolio project'}${project.tags?.length ? ` (${project.tags.join(', ')})` : ''}`).join('\n')
    : 'Projects are available in the Projects section.';
  const serviceSummary = services.length
    ? services.map((service) => `• **${service.title}** — ${service.description || ''}${service.price ? ` (${service.price}, ${service.timeline || 'custom timeline'})` : ''}`).join('\n')
    : '• **Full Stack Web Applications** — Services are available in the Services section.';
  const featureSummary = [
    'Home, About, Skills, Projects, Experience, Services, Blog, Now, Contact, Resume, GitHub metrics, and Meeting Scheduler sections',
    'Admin CMS for updating portfolio content live',
    'AI assistant with English, Tamil, and Tanglish support',
    technologies.length ? `Current technologies: ${technologies.join(', ')}` : '',
    blogPosts.length ? `${blogPosts.length} published blog post${blogPosts.length === 1 ? '' : 's'}` : '',
  ].filter(Boolean).join('\n• ');

  const hasAny = (...values) => values.some((value) => q.includes(String(value).toLowerCase()));
  const isTamilQuery = /[\u0B80-\u0BFF]/.test(rawQuery) || /(enna|iruku|irukka|iruntha|ellam|venda|evlo|yaar|ungal|neenga|la\b|solu|sollu|pathi|panradhu|epdi)/.test(q);

  // 1. Recruiter Mode Specific Queries
  if (activeMode === 'recruiter' || hasAny('ats', 'hire', 'candidate', 'recruiter', 'notice period', 'years of experience', 'why hire', 'interview', 'salary', 'ctc', 'visa', 'sponsorship')) {
    if (hasAny('notice', 'available', 'join', 'start date')) {
      return {
        text: `**Recruiter Fast-Track Overview:**\n\n• **Availability:** Available for immediate full-time / contract engagement.\n• **Role Fit:** Senior / Mid-Level Full Stack Engineer (${role}).\n• **Location Flexibility:** Remote worldwide or hybrid.\n• **Notice Period:** Immediate to 15 Days.\n\nWould you like to review the official ATS resume or schedule an initial screening call?`,
        actions: [
          { label: '📄 Open ATS Resume', action: 'resume' },
          { label: '📅 Book Screening Call', action: 'schedule' },
          { label: '✉️ Send Direct Email', action: 'email' },
        ],
        cardType: 'recruiter',
        followUps: ['Download ATS Resume', 'What are your core technical skills?', 'Tell me about your top projects'],
      };
    }

    return {
      text: `### 💼 Executive Candidate Summary for **${name}**\n\n**Title:** ${role}\n**Core Strengths:** Full Stack JavaScript/TypeScript Ecosystem, Scalable Microservices, Responsive UI Systems, RESTful APIs, Cloud DevOps.\n\n• **Production Ready:** Built and deployed full-stack web applications with authentication, databases, and CI/CD pipelines.\n• **Code Quality:** Clean architecture, modular components, strict linting, and accessibility best practices.\n• **Collaboration:** Agile/Scrum workflow, clear Git branching, comprehensive documentation.`,
      actions: [
        { label: '📄 View ATS Resume', action: 'resume' },
        { label: '📅 Schedule Discovery Call', action: 'schedule' },
        { label: '💻 Inspect Projects', action: 'projects' },
      ],
      cardType: 'recruiter',
      followUps: ['What is your notice period and availability?', 'Show me your backend & system design strengths', 'Can I see your ATS resume?'],
    };
  }

  // 2. Client / Project Estimation Queries
  if (activeMode === 'client' || hasAny('cost', 'price', 'estimate', 'pricing', 'quote', 'timeline', 'how much', 'budget', 'mvp', 'deliver', 'freelance rate', 'contract', 'nda', 'guarantee', 'how do you deliver')) {
    if (hasAny('timeline', 'how long', 'duration', 'weeks', 'days')) {
      return {
        text: `**Standard Project Delivery Timelines:**\n\n• **MVP / Fast-Launch Web App:** 1 - 2 weeks\n• **Full-Scale SaaS Platform:** 3 - 5 weeks\n• **E-Commerce / Complex Portal:** 2 - 4 weeks\n• **API / Backend Architecture:** 1 - 2 weeks\n\nEvery project includes daily progress check-ins, responsive staging previews, automated testing, and a 30-day post-launch warranty.`,
        actions: [
          { label: '📅 Book 15-Min Call', action: 'schedule' },
        ],
        cardType: 'estimator',
        followUps: ['What is the estimated cost & timeline for an MVP?', 'How can I book a 15-minute discovery call?', 'How do you deliver projects from idea to launch?'],
      };
    }

    return {
      text: `### 🚀 Client Services & Project Delivery\n\n**${name}** partners with startups, agencies, and businesses to build high-performance web products with clean code, modern UX, and robust backends.\n\n• **Turnkey Fullstack Delivery:** From wireframing to database modeling, API development, frontend implementation, and cloud deployment.\n• **Transparent Pricing & Fixed SOW:** Clear milestones, no surprise fees, and NDA-backed confidentiality.\n• **Post-Launch Support:** Free bug fixing period, documentation, and handover training.`,
      actions: [
        { label: '📅 Schedule Discovery Session', action: 'schedule' },
        { label: '🛠️ Explore Services', action: 'services' },
      ],
      cardType: 'estimator',
      followUps: ['How long to build an MVP?', 'Can we sign an NDA?', 'Can you estimate a project for me?'],
    };
  }

  // 3. Tech Architecture & Deep-Dive Queries
  if (activeMode === 'tech' || hasAny('architecture', 'system design', 'mongodb vs', 'react vs', 'performance', 'security', 'caching', 'code snippet', 'backend design', 'optimization', 'lcp', 'websocket', 'socket.io', 'microservice', 'docker')) {
    if (hasAny('performance', 'lcp', 'optimize', 'speed', 'fast')) {
      return {
        text: `### ⚡ Web Performance & Core Web Vitals Strategy\n\nHere is how high performance is guaranteed across every build:\n\n1. **Code Splitting & Dynamic Imports:** Reduces initial bundle size by loading components only when needed.\n2. **Optimized Asset Pipeline:** WebP image formats, lazy loading below-the-fold content, and responsive srcset.\n3. **Efficient State Management:** Avoiding unnecessary re-renders with Memoization (\`useMemo\`, \`useCallback\`) and atomic state.\n4. **Database Query Optimization:** Indexed fields, projection queries, and Redis / in-memory response caching.\n5. **Server Caching & Compression:** Gzip/Brotli compression, HTTP headers caching, and CDN edge distribution.`,
        actions: [
          { label: '🔍 Check Tech Skills', action: 'skills' },
          { label: '💻 Explore Projects', action: 'projects' },
        ],
        cardType: 'code',
        codeSnippet: `// Example: High-Efficiency MongoDB Query with Lean Projections
export async function getProjectMetrics(projectId) {
  return await Project.findById(projectId)
    .select('title status metrics timeline')
    .lean();
}`,
        followUps: ['Why React, Node.js and MongoDB for your stack?', 'What security practices do you implement in APIs?', 'Show me your backend & system design strengths'],
      };
    }

    return {
      text: `### 🧠 System Architecture & Engineering Philosophy\n\n• **Frontend:** Component-driven architecture using **React 19**, custom reusable hooks, strict modular CSS/Tailwind, and Material-UI theming.\n• **Backend & APIs:** RESTful & WebSocket services with **Node.js / Express**, JWT authentication, role-based authorization, rate-limiting, and input sanitization.\n• **Data Layer:** Schema validation via **Mongoose / MongoDB** & SQL relational integrity with structured migrations.\n• **Reliability:** Comprehensive error handling middlewares, structured logging, and automated CI/CD checks.`,
      actions: [
        { label: '🛠️ View Skills Matrix', action: 'skills' },
        { label: '🚀 Inspect Projects', action: 'projects' },
      ],
      cardType: 'code',
      codeSnippet: `// Robust Async Middleware Wrapper with Centralized Error Handling
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};`,
      followUps: ['How do you optimize web performance and LCP?', 'What security practices do you implement in APIs?', 'What are your top core technical skills?'],
    };
  }

  // 4. Tamil & Tanglish Natural Language Queries
  if (isTamilQuery || hasAny('solu', 'sollu', 'pathi', 'panradhu', 'epdi', 'eppadi', 'evalo', 'evlo', 'iruka', 'irukka')) {
    if (hasAny('website', 'site', 'feature', 'features')) {
      return {
        text: `### 🌐 ${name} oda website la ippo irukkuradhu:\n\n• ${featureSummary}\n\n**Live projects:**\n${projectSummary}\n\n**Services:**\n${serviceSummary}`,
        actions: [
          { label: '💻 Projects Paaka', action: 'projects' },
          { label: '🛠️ Services Paaka', action: 'services' },
          { label: '✉️ Contact Panna', action: 'contact' },
        ],
        cardType: 'projects',
        followUps: ['Latest project pathi sollu', 'Services enna?', 'Contact panna epdi?'],
      };
    }

    if (hasAny('project', 'projects', 'work', 'vela')) {
      return {
        text: `### 🌟 Projects Pathi Sollattuma!\n\n**${name}** create panna top fullstack projects inga iruku:\n\n1. 🚀 **DevFlow** — Real-time Kanban Project Management Dashboard with live WebSockets.\n2. 🛒 **Pulse E-Commerce** — High-conversion online storefront with checkout & cart system.\n3. 💬 **Neural Chat** — Instant messaging web app powered by Node.js & AI API.\n\nProjects section la live demos & source code links details ah paarkalam!`,
        actions: [
          { label: '💻 Open Projects', action: 'projects' },
        ],
        cardType: 'projects',
        followUps: ['Skills and tech stack enna?', 'Contact panna epdi reach panradhu?', 'Can I see your ATS resume?'],
      };
    }

    if (hasAny('skill', 'tech', 'stack', 'technology', 'padichu')) {
      return {
        text: `### 🛠️ Core Skills & Tech Stack:\n\n**${name}** modern Full-Stack web technologies la expert:\n\n• **Frontend:** React, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, Material UI\n• **Backend:** Node.js, Express.js, RESTful APIs, WebSockets\n• **Databases:** MongoDB, PostgreSQL, Firebase\n• **Tools & Cloud:** Git, GitHub, Docker, AWS, Postman, Figma\n\nNamma Skills section la visual tech radar paarkalam!`,
        actions: [
          { label: '📊 View Skills', action: 'skills' },
          { label: '📄 Resume Paaka', action: 'resume' },
        ],
        cardType: 'skills',
        followUps: ['Enna enna projects panni irukeenga?', 'Contact panna epdi reach panradhu?', 'Ungala pathi brief ah sollu (Bio & Story)'],
      };
    }

    if (hasAny('contact', 'reach', 'call', 'mail', 'pesanum', 'pesalam', 'message')) {
      return {
        text: `### 📞 Contact Panna Easy Ways:\n\nNeenga direct ah reach panna mudiyum:\n\n• 📧 **Email:** ${email}\n• 📱 **Phone:** ${phone}\n• 📍 **Location:** ${location}\n\nKoodave namma website la **Contact Form** moolama direct message anupalam, illana **15-Minute Discovery Call** schedule pannalam!`,
        actions: [
          { label: '✉️ Go to Contact', action: 'contact' },
          { label: '📅 Book Discovery Call', action: 'schedule' },
        ],
        cardType: 'contact',
        followUps: ['Skills and tech stack enna?', 'Enna enna projects panni irukeenga?', 'Can you estimate a project for me?'],
      };
    }

    return {
      text: `Vanakkam! 🙏 Naan **${name}** oda AI Assistant.\n\nEnkitta **${name}** oda:\n• Skills & Tech Stack 💻\n• Projects & Live Demos 🚀\n• Experience & Background 📈\n• Project Budget / Cost Estimation 💰\n• Resume & Contact Information 📞\n\npathina ella vishayangalume neenga kekkalam! Enna help venum sollunga?`,
      actions: [
        { label: '💻 Projects Paaka', action: 'projects' },
        { label: '📊 Skills Paaka', action: 'skills' },
        { label: '📄 Resume Paaka', action: 'resume' },
        { label: '✉️ Contact Panna', action: 'contact' },
      ],
      followUps: ['Enna enna projects panni irukeenga?', 'Skills and tech stack enna?', 'Contact panna epdi reach panradhu?'],
    };
  }

  // 5. Standard Intent Matches
  if (hasAny('feature', 'features', 'website', 'site', 'what can i do', 'what is on this')) {
    return {
      text: `### 🌐 What is currently available on ${name}'s website?\n\n• ${featureSummary}\n\n**Live projects:**\n${projectSummary}\n\n**Services:**\n${serviceSummary}`,
      actions: [
        { label: '💻 Explore Projects', action: 'projects' },
        { label: '🛠️ View Services', action: 'services' },
        { label: '✉️ Contact', action: 'contact' },
      ],
      cardType: 'projects',
      followUps: ['Tell me about your latest project', 'What services do you offer?', 'How can I contact you?'],
    };
  }

  // A. Skills
  if (hasAny('skill', 'stack', 'technology', 'technologies', 'framework', 'tools', 'languages', 'react', 'node', 'javascript', 'typescript', 'mongo', 'database')) {
    return {
      text: `### 🛠️ Current Engineering Stack & Competencies\n\n**${name}**'s published technology list is:\n\n• ${technologies.length ? technologies.join(', ') : 'Technology details are available in the Skills section.'}`,
      actions: [
        { label: '📊 View Skills Matrix', action: 'skills' },
        { label: '💻 Explore Projects', action: 'projects' },
        { label: '📄 Open Resume', action: 'resume' },
      ],
      cardType: 'skills',
      followUps: ['Tell me about your top projects', 'Show me an example code snippet or architecture design', 'Can you estimate a project for me?'],
    };
  }

  // B. Projects
  if (hasAny('project', 'work', 'portfolio', 'case study', 'apps', 'built', 'showcase', 'examples')) {
    return {
      text: `### 💻 Current Portfolio Projects\n\nHere are the projects currently published on the website:\n\n${projectSummary}\n\nExplore them directly in the Projects section for the latest demos and source links.`,
      actions: [
        { label: '🚀 Open Projects Section', action: 'projects' },
      ],
      cardType: 'projects',
      followUps: ['What are your core technical skills?', 'Can you estimate a project for me?', 'Are you available for freelance / hire?'],
    };
  }

  // C. Experience & Career
  if (hasAny('experience', 'career', 'journey', 'timeline', 'background', 'company', 'history', 'education', 'college', 'degree')) {
    return {
      text: `### 📈 Professional Journey & Milestones\n\n**${name}** has built an impressive track record as a **${role}**, demonstrating continuous growth in designing and shipping scalable digital products.\n\n• **Full Stack Engineer:** Architecting resilient web applications, designing RESTful APIs, and implementing accessible UIs.\n• **Continuous Learning & Certifications:** Deep understanding of modern software engineering paradigms, distributed systems, and performance tuning.\n• **Open Source & Community:** Active contributions, code reviews, and hands-on repository projects.`,
      actions: [
        { label: '📜 View Full Timeline', action: 'experience' },
        { label: '📄 Review Resume', action: 'resume' },
      ],
      cardType: 'recruiter',
      followUps: ['What are your core technical skills?', 'Tell me about your top projects', 'Are you available for freelance / hire?'],
    };
  }

  // D. Resume
  if (hasAny('resume', 'cv', 'pdf', 'download resume', 'ats resume')) {
    return {
      text: `### 📄 ATS-Optimized Professional Resume\n\nYou can view and download **${name}**'s complete interactive ATS-friendly resume directly within the site. It highlights:\n\n• Verified technical competencies & stack proficiency\n• Career history & impact metrics\n• Production project summaries & links\n• Contact details & social links`,
      actions: [
        { label: '📄 Open ATS Resume Modal', action: 'resume' },
        { label: '📅 Book a Discovery Call', action: 'schedule' },
      ],
      cardType: 'recruiter',
      followUps: ['What is your notice period and availability?', 'What are your core technical skills?', 'Can I see your ATS resume?'],
    };
  }

  // E. Services
  if (hasAny('service', 'services', 'offer', 'what do you build', 'what can you build')) {
    return {
      text: `### 🧩 Current Services\n\n${serviceSummary}\n\nFor a project discussion, use the **Contact Form** or the **Meeting Scheduler** to book a 15-minute call.`,
      actions: [
        { label: '🛠️ Explore Services', action: 'services' },
        { label: '📅 Open Meeting Scheduler', action: 'schedule' },
        { label: '✉️ Contact', action: 'contact' },
      ],
      cardType: 'estimator',
      followUps: ['What is the estimated cost and timeline?', 'How can I contact you?', 'Can we book a meeting?'],
    };
  }

  // F. Contact & Booking
  if (hasAny('contact', 'reach', 'email', 'phone', 'call', 'message', 'hire', 'talk', 'chat', 'freelance', 'meet', 'calendar', 'schedule')) {
    return {
      text: `### 📬 Let's Connect & Collaborate!\n\n**${name}** is currently open to new full-time opportunities, high-impact freelance projects, and technical consulting.\n\n• 📧 **Email:** ${email}\n• 📱 **Phone:** ${phone}\n• 📍 **Location:** ${location}\n\nYou can submit a message using the Contact Form or instantly book a 15-minute discovery call on the calendar!`,
      actions: [
        { label: '✉️ Send a Message', action: 'contact' },
        { label: '📅 Book 15-Min Meeting', action: 'schedule' },
      ],
      cardType: 'contact',
      followUps: ['Can you estimate a project for me?', 'What is your notice period and availability?', 'Tell me about your top projects'],
    };
  }

  // F. About & Bio
  if (hasAny('about', 'who are you', 'who is', 'bio', 'story', 'tell me about yourself', 'introduction', 'intro')) {
    return {
      text: `### 👋 Meet **${name}**\n\nI am a **${role}** passionate about creating elegant, accessible, and high-performance digital products.\n\n• **Mission:** Transforming complex requirements into intuitive, blazing-fast web experiences.\n• **Philosophy:** Clean code, user-first design, scalable architecture, and continuous innovation.\n• **Approach:** Fast execution, proactive communication, and engineering excellence.`,
      actions: [
        { label: '🌟 Read Full Story', action: 'about' },
        { label: '🛠️ Explore Skills', action: 'skills' },
        { label: '💻 View Projects', action: 'projects' },
      ],
      followUps: ['What are your core technical skills?', 'Tell me about your top projects', 'Are you available for freelance / hire?'],
    };
  }

  // Fallback / General
  return {
    text: `I'm **${name}'s AI Copilot** 🤖. I have complete knowledge of ${name}'s **skills, projects, career experience, services, pricing estimates, resume, and contact channels**.\n\nTry asking me about:\n• Core skills & technologies 🛠️\n• Production project details 🚀\n• Cost & timeline estimations 💰\n• Scheduling an interview or discovery call 📅\n• Asking in English or தமிழ்! 🇮🇳`,
    actions: [
      { label: '🛠️ View Skills', action: 'skills' },
      { label: '💻 Top Projects', action: 'projects' },
      { label: '📄 ATS Resume', action: 'resume' },
    ],
    followUps: ['What are your core technical skills?', 'Tell me about your top projects', 'Can you estimate a project for me?'],
  };
}

export default function AIAssistant({
  onNavigate,
  onOpenResume,
  onOpenScheduler,
}) {
  const settings = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePersona, setActivePersona] = useState('general');
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('🔥 Popular');
  const [copiedId, setCopiedId] = useState(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [showWelcomeNudge, setShowWelcomeNudge] = useState(false);
  const [liveProjects, setLiveProjects] = useState([]);
  const handleSendMessageRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! 👋 I'm **${settings?.name || 'Developer'}**'s AI Assistant Copilot. I can answer questions about projects, technical skills, pricing, availability, or help you book a meeting.\n\nHow can I help you today?`,
      actions: [
        { label: '🛠️ Core Skills', action: 'skills' },
        { label: '💻 Top Projects', action: 'projects' },
        { label: '📄 ATS Resume', action: 'resume' },
      ],
      time: 'Just now',
      cardType: 'welcome',
      followUps: [
        'What are your core technical skills?',
        'Tell me about your top projects',
        'Are you available for freelance / hire?',
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadLiveProjects = () => {
      loadProjects()
        .then((data) => setLiveProjects(Array.isArray(data.projects) ? data.projects : []))
        .catch(() => setLiveProjects([]));
    };

    loadLiveProjects();
    const handleProjectsUpdated = () => {
      clearPublicDataCache();
      loadLiveProjects();
    };
    window.addEventListener('portfolio-projects-updated', handleProjectsUpdated);
    return () => window.removeEventListener('portfolio-projects-updated', handleProjectsUpdated);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowWelcomeNudge(false);
    }
  }, [messages, isOpen, isTyping]);

  // Show a polite floating nudge tooltip after 4 seconds on page
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowWelcomeNudge(true);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue(transcript);
            handleSendMessageRef.current?.(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleToggle = () => {
    sounds.playClick();
    setIsOpen((prev) => {
      const next = !prev;
      if (!next && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setSpeechActive(false);
      }
      return next;
    });
  };

  const handleToggleExpand = () => {
    sounds.playClick();
    setIsExpanded((prev) => !prev);
  };

  const handleToggleVoiceInput = () => {
    sounds.playClick();
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please try Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (text, msgId) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speechActive === msgId) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for clean reading
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/[•\-\d+.]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);

    setSpeechActive(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text, id) => {
    sounds.playClick();
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleFeedback = (id, type) => {
    sounds.playBlip();
    setFeedbackGiven((prev) => ({ ...prev, [id]: type }));
  };

  const handleExportChat = () => {
    sounds.playClick();
    const transcript = messages
      .map((m) => `[${m.sender.toUpperCase()} - ${m.time}]\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `portfolio-ai-chat-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateBotReply = (query) => buildAIReply(query, settings, activePersona, { projects: liveProjects });

  const handleActionClick = (action) => {
    sounds.playClick();
    if (action === 'skills') onNavigate('Skills');
    else if (action === 'projects') onNavigate('Projects');
    else if (action === 'about') onNavigate('About');
    else if (action === 'experience') onNavigate('Experience');
    else if (action === 'services') onNavigate('Services');
    else if (action === 'contact') onNavigate('Contact');
    else if (action === 'resume' && onOpenResume) onOpenResume();
    else if (action === 'schedule' && onOpenScheduler) onOpenScheduler();
    else if (action === 'email') {
      window.location.href = `mailto:${settings?.email || 'contact@example.com'}`;
    }
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    sounds.playClick();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(text);
      sounds.playBlip();
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply.text,
          actions: reply.actions || [],
          cardType: reply.cardType,
          codeSnippet: reply.codeSnippet,
          followUps: reply.followUps || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  handleSendMessageRef.current = handleSendMessage;

  const clearChat = () => {
    sounds.playClick();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeechActive(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `Conversation cleared! 🚀 How else can I help you explore **${settings?.name || 'Developer'}**'s portfolio?`,
        actions: [
          { label: '🛠️ Core Skills', action: 'skills' },
          { label: '💻 Top Projects', action: 'projects' },
          { label: '📄 ATS Resume', action: 'resume' },
        ],
        time: 'Just now',
        followUps: [
          'What are your core technical skills?',
          'Tell me about your top projects',
          'Are you available for freelance / hire?',
        ],
      },
    ]);
  };

  return (
    <>
      {/* Proactive Floating Attention Nudge Tooltip */}
      {showWelcomeNudge && !isOpen && (
        <Fade in={showWelcomeNudge}>
          <Box
            sx={{
              position: 'fixed',
              bottom: { xs: 70, sm: 80, md: 86 },
              left: { xs: 16, sm: 24, md: 32 },
              zIndex: 1300,
              maxWidth: 280,
              p: 1.5,
              borderRadius: '16px',
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.2,
              animation: 'bounceIn 0.5s ease',
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'var(--accent-color, #22c55e)',
                color: '#fff',
                fontSize: 14,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
                Have a question?
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.3, lineHeight: 1.3 }}>
                Ask me about skills, projects, budget estimation, or ATS resume!
              </Typography>
              <Button
                size="small"
                onClick={handleToggle}
                sx={{
                  mt: 0.8,
                  fontSize: 11,
                  fontWeight: 700,
                  p: 0,
                  textTransform: 'none',
                  color: 'var(--accent-color, #22c55e)',
                }}
              >
                Chat with Copilot →
              </Button>
            </Box>
            <IconButton
              size="small"
              onClick={() => setShowWelcomeNudge(false)}
              sx={{ p: 0.2, color: 'text.secondary' }}
            >
              <CloseRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Fade>
      )}

      {/* Floating Main AI Trigger Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 10, sm: 18, md: 24 },
          left: { xs: 10, sm: 18, md: 28 },
          zIndex: 1300,
        }}
      >
        {!isOpen && (
          <Fade in={!isOpen}>
            <Button
              variant="contained"
              onClick={handleToggle}
              className="ai-floating-trigger"
              startIcon={
                <Badge
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 2px var(--accent-color, #22c55e)',
                      animation: 'statusPulse 2s infinite',
                    },
                  }}
                >
                    <SmartToyRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                </Badge>
              }
              sx={{
                borderRadius: '999px',
                background: 'linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%)',
                color: '#ffffff',
                px: { xs: 1.5, sm: 2.6 },
                py: { xs: 0.75, sm: 1.2 },
                fontWeight: 800,
                fontSize: { xs: 11, sm: 13.5 },
                textTransform: 'none',
                letterSpacing: '0.02em',
                boxShadow: '0 16px 36px rgba(34, 197, 94, 0.35)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                minHeight: 0,
                lineHeight: 1,
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-2px) scale(1.02)',
                  boxShadow: '0 20px 42px rgba(34, 197, 94, 0.45)',
                },
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              Ask AI Copilot
            </Button>
          </Fade>
        )}
      </Box>

      {/* AI Assistant Chat Panel / Modal */}
      {isOpen && (
        <Fade in={isOpen}>
          <Paper
            elevation={24}
            sx={{
              position: 'fixed',
              bottom: { xs: 10, sm: 20, md: 24 },
              left: { xs: 10, sm: 20, md: 24 },
              right: { xs: 10, sm: 'auto', md: 'auto' },
              width: {
                xs: 'calc(100vw - 20px)',
                sm: isExpanded ? 520 : 410,
                md: isExpanded ? 600 : 430,
              },
              height: {
                xs: '84vh',
                sm: isExpanded ? 650 : 560,
              },
              maxHeight: '88vh',
              borderRadius: { xs: '20px', sm: '24px' },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1400,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 32px 70px -15px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255,255,255,0.1)',
              bgcolor: (t) => (t.palette.mode === 'dark' ? '#090e17' : '#ffffff'),
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Ultra-Premium Cyber Header */}
            <Box
              sx={{
                p: { xs: 1.6, sm: 2 },
                background: 'linear-gradient(135deg, var(--accent-color, #22c55e) 0%, var(--accent-dark, #16a34a) 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#22c55e',
                      boxShadow: '0 0 0 2px #fff',
                      animation: 'statusPulse 2s infinite',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.22)',
                      color: '#fff',
                      width: 38,
                      height: 38,
                      border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    <SmartToyRoundedIcon fontSize="small" />
                  </Avatar>
                </Badge>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: 14, sm: 15 }, lineHeight: 1.2 }}>
                      Portfolio AI Copilot
                    </Typography>
                    <Chip
                      label="v2.5 Pro"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 9.5,
                        fontWeight: 800,
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                        px: 0.5,
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ade80' }} />
                    Active & Ready • Neural Q&A
                  </Typography>
                </Box>
              </Box>

              {/* Header Action Tools */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Tooltip title="Export conversation as Markdown">
                  <IconButton
                    size="small"
                    onClick={handleExportChat}
                    sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
                  >
                    <DownloadRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Clear chat history">
                  <IconButton
                    size="small"
                    onClick={clearChat}
                    sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
                  >
                    <DeleteSweepRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={isExpanded ? 'Collapse width' : 'Expand width'}>
                  <IconButton
                    size="small"
                    onClick={handleToggleExpand}
                    sx={{
                      display: { xs: 'none', sm: 'inline-flex' },
                      color: 'rgba(255,255,255,0.9)',
                      '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
                    }}
                  >
                    {isExpanded ? <CloseFullscreenRoundedIcon fontSize="small" /> : <OpenInFullRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>

                <IconButton
                  size="small"
                  onClick={handleToggle}
                  sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Persona Switcher Toolbar */}
            <Box
              sx={{
                px: 1.5,
                py: 1,
                bgcolor: (t) => (t.palette.mode === 'dark' ? '#0d1524' : '#f1f5f9'),
                borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                display: 'flex',
                gap: 0.8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {PERSONA_MODES.map((mode) => {
                const IconComponent = mode.icon;
                const isSelected = activePersona === mode.id;
                return (
                  <Chip
                    key={mode.id}
                    icon={<IconComponent sx={{ fontSize: '14px !important', color: isSelected ? '#ffffff !important' : 'inherit' }} />}
                    label={mode.label}
                    size="small"
                    onClick={() => {
                      sounds.playClick();
                      setActivePersona(mode.id);
                    }}
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '8px',
                      px: 0.5,
                      bgcolor: isSelected
                        ? 'var(--accent-color, #22c55e)'
                        : (t) => (t.palette.mode === 'dark' ? '#1a2333' : '#ffffff'),
                      color: isSelected ? '#ffffff' : 'text.primary',
                      border: isSelected
                        ? '1px solid transparent'
                        : '1px solid rgba(148, 163, 184, 0.2)',
                      boxShadow: isSelected ? '0 4px 12px rgba(34, 197, 94, 0.28)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Main Chat Feed */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1.5, sm: 2 },
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.8,
                bgcolor: (t) => (t.palette.mode === 'dark' ? '#080d17' : '#f8fafc'),
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: msg.sender === 'user' ? '86%' : '92%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={msg.sender === 'user' ? 2 : 1}
                    sx={{
                      p: { xs: 1.5, sm: 1.8 },
                      borderRadius:
                        msg.sender === 'user'
                          ? '20px 20px 4px 20px'
                          : '20px 20px 20px 4px',
                      bgcolor:
                        msg.sender === 'user'
                          ? 'var(--accent-color, #22c55e)'
                          : (t) => (t.palette.mode === 'dark' ? '#131d2e' : '#ffffff'),
                      color:
                        msg.sender === 'user'
                          ? '#ffffff'
                          : (t) => (t.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a'),
                      border:
                        msg.sender === 'user'
                          ? 'none'
                          : (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(148, 163, 184, 0.2)'),
                      boxShadow:
                        msg.sender === 'user'
                          ? '0 8px 20px rgba(34, 197, 94, 0.28)'
                          : '0 4px 16px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    {/* Message Header for Bot */}
                    {msg.sender === 'bot' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, pb: 0.6, borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                          <AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: 'var(--accent-color, #22c55e)' }} />
                          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-dark, #16a34a)', letterSpacing: 0.5 }}>
                            AI COPILOT
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <Tooltip title={speechActive === msg.id ? 'Stop reading' : 'Read aloud'}>
                            <IconButton
                              size="small"
                              onClick={() => handleSpeakText(msg.text, msg.id)}
                              sx={{ p: 0.3, color: speechActive === msg.id ? 'var(--accent-color, #22c55e)' : 'text.secondary' }}
                            >
                              {speechActive === msg.id ? <VolumeUpRoundedIcon sx={{ fontSize: 14 }} /> : <VolumeOffRoundedIcon sx={{ fontSize: 14 }} />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={copiedId === msg.id ? 'Copied!' : 'Copy markdown'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              sx={{ p: 0.3, color: 'text.secondary' }}
                            >
                              {copiedId === msg.id ? <CheckRoundedIcon sx={{ fontSize: 14, color: '#22c55e' }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    )}

                    {/* Formatted Content */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        color: msg.sender === 'user' ? '#ffffff' : 'inherit',
                        '& h3': {
                          fontSize: 14,
                          fontWeight: 800,
                          margin: '0 0 6px',
                          color: msg.sender === 'user' ? '#ffffff' : 'var(--accent-dark, #16a34a)',
                        },
                        '& strong': {
                          color:
                            msg.sender === 'user'
                              ? '#ffffff'
                              : 'var(--accent-dark, #16a34a)',
                          fontWeight: 700,
                        },
                      }}
                    >
                      {msg.text}
                    </Typography>

                    {/* Rich Embedded Project Showcase Widget */}
                    {msg.cardType === 'projects' && (
                      <Box sx={{ mt: 1.8, display: 'grid', gap: 1 }}>
                        {FEATURED_PROJECTS.map((proj) => (
                          <Paper
                            key={proj.title}
                            elevation={0}
                            sx={{
                              p: 1.2,
                              borderRadius: '10px',
                              bgcolor: (t) => (t.palette.mode === 'dark' ? '#0b1322' : '#f8fafc'),
                              border: '1px solid rgba(148, 163, 184, 0.18)',
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>{proj.title}</Typography>
                              <Chip label={proj.tag} size="small" sx={{ height: 18, fontSize: 9.5, fontWeight: 700 }} />
                            </Box>
                            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.3 }}>
                              {proj.description}
                            </Typography>
                            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-dark, #16a34a)', mt: 0.5 }}>
                              {proj.tech}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    )}

                    {/* Rich Code Snippet Widget */}
                    {msg.codeSnippet && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.2,
                          borderRadius: '10px',
                          bgcolor: '#0a0f1d',
                          color: '#38bdf8',
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: 11,
                          overflowX: 'auto',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          position: 'relative',
                        }}
                      >
                        <Typography sx={{ fontSize: 9, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                          TypeScript / Node.js
                        </Typography>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.codeSnippet}</pre>
                      </Box>
                    )}

                    {/* Quick Action Navigation Buttons */}
                    {Array.isArray(msg.actions) && msg.actions.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1.6 }}>
                        {msg.actions.map((act) => (
                          <Button
                            key={act.label}
                            size="small"
                            variant="outlined"
                            onClick={() => handleActionClick(act.action)}
                            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '13px !important' }} />}
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: '8px',
                              py: 0.4,
                              px: 1.2,
                              color: 'var(--accent-dark, #16a34a)',
                              borderColor: 'rgba(34, 197, 94, 0.4)',
                              bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.04)'),
                              '&:hover': {
                                bgcolor: 'var(--accent-color, #22c55e)',
                                color: '#ffffff',
                                borderColor: 'var(--accent-color, #22c55e)',
                              },
                            }}
                          >
                            {act.label}
                          </Button>
                        ))}
                      </Box>
                    )}
                  </Paper>

                  {/* Message Meta & Feedback Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4, px: 0.8 }}>
                    <Typography sx={{ fontSize: 9.5, color: '#64748b' }}>
                      {msg.time}
                    </Typography>

                    {msg.sender === 'bot' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <Tooltip title="Helpful answer">
                          <IconButton
                            size="small"
                            onClick={() => handleFeedback(msg.id, 'up')}
                            sx={{
                              p: 0.2,
                              color: feedbackGiven[msg.id] === 'up' ? 'var(--accent-color, #22c55e)' : '#64748b',
                            }}
                          >
                            <ThumbUpAltRoundedIcon sx={{ fontSize: 11 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Not helpful">
                          <IconButton
                            size="small"
                            onClick={() => handleFeedback(msg.id, 'down')}
                            sx={{
                              p: 0.2,
                              color: feedbackGiven[msg.id] === 'down' ? '#ef4444' : '#64748b',
                            }}
                          >
                            <ThumbDownAltRoundedIcon sx={{ fontSize: 11 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Contextual Follow-Up Suggestions for Bot Messages */}
                  {msg.sender === 'bot' && Array.isArray(msg.followUps) && msg.followUps.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 0.8, maxWidth: '100%' }}>
                      {msg.followUps.map((prompt) => (
                        <Chip
                          key={prompt}
                          label={prompt}
                          size="small"
                          onClick={() => handleSendMessage(prompt)}
                          sx={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            bgcolor: (t) => (t.palette.mode === 'dark' ? '#172233' : '#eef2f6'),
                            color: 'text.secondary',
                            border: '1px solid rgba(148, 163, 184, 0.15)',
                            '&:hover': {
                              bgcolor: 'var(--accent-color, #22c55e)',
                              color: '#ffffff',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}

              {/* Typing Dot Animation Indicator */}
              {isTyping && (
                <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.8, my: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'var(--accent-color, #22c55e)' }}>
                    <SmartToyRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                  </Avatar>
                  <Paper
                    sx={{
                      py: 1,
                      px: 1.8,
                      borderRadius: '16px',
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                      bgcolor: (t) => (t.palette.mode === 'dark' ? '#131d2e' : '#ffffff'),
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--accent-color, #22c55e)', animation: 'typingDot 1.4s infinite ease-in-out' }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--accent-color, #22c55e)', animation: 'typingDot 1.4s infinite ease-in-out 0.2s' }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--accent-color, #22c55e)', animation: 'typingDot 1.4s infinite ease-in-out 0.4s' }} />
                  </Paper>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Prompt Category Filter Accordion / Tabs */}
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                bgcolor: (t) => (t.palette.mode === 'dark' ? '#090f1a' : '#f8fafc'),
                borderTop: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.6, overflowX: 'auto', scrollbarWidth: 'none', mb: 0.8, '&::-webkit-scrollbar': { display: 'none' } }}>
                {Object.keys(PROMPT_CATEGORIES).map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPromptCategory(cat);
                    }}
                    sx={{
                      fontSize: 10.5,
                      fontWeight: selectedPromptCategory === cat ? 800 : 600,
                      height: 22,
                      cursor: 'pointer',
                      bgcolor: selectedPromptCategory === cat ? 'var(--accent-color, #22c55e)' : 'transparent',
                      color: selectedPromptCategory === cat ? '#ffffff' : 'text.secondary',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                    }}
                  />
                ))}
              </Box>

              {/* Category Prompt Pills */}
              <Box sx={{ display: 'flex', gap: 0.6, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                {PROMPT_CATEGORIES[selectedPromptCategory]?.map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    size="small"
                    onClick={() => handleSendMessage(prompt)}
                    sx={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      height: 24,
                      cursor: 'pointer',
                      bgcolor: (t) => (t.palette.mode === 'dark' ? '#131d2e' : '#ffffff'),
                      color: 'text.primary',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      '&:hover': {
                        bgcolor: 'var(--accent-color, #22c55e)',
                        color: '#ffffff',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Input Bar with Voice & Send */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              sx={{
                p: { xs: 1.2, sm: 1.5 },
                bgcolor: (t) => (t.palette.mode === 'dark' ? '#0d1524' : '#ffffff'),
                borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
              }}
            >
              {/* Voice Speech-to-Text Input Button */}
              <Tooltip title={isListening ? 'Listening... Speak now' : 'Voice Input (Speak question)'}>
                <IconButton
                  onClick={handleToggleVoiceInput}
                  sx={{
                    bgcolor: isListening ? '#ef4444' : (t) => (t.palette.mode === 'dark' ? '#1a2333' : '#f1f5f9'),
                    color: isListening ? '#ffffff' : 'text.primary',
                    borderRadius: '12px',
                    p: 1,
                    animation: isListening ? 'statusPulse 1s infinite' : 'none',
                    '&:hover': {
                      bgcolor: isListening ? '#dc2626' : 'var(--accent-color, #22c55e)',
                      color: '#ffffff',
                    },
                  }}
                >
                  {isListening ? <MicOffRoundedIcon fontSize="small" /> : <MicRoundedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <TextField
                fullWidth
                size="small"
                placeholder={isListening ? 'Listening to your voice...' : 'Ask in English or தமிழ் (e.g., skills, projects, estimate)...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: 13,
                    bgcolor: (t) => (t.palette.mode === 'dark' ? '#131d2e' : '#f1f5f9'),
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--accent-color, #22c55e)',
                    },
                  },
                }}
              />

              <IconButton
                type="submit"
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: 'var(--accent-color, #22c55e)',
                  color: '#fff',
                  borderRadius: '12px',
                  p: 1,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                  '&:hover': {
                    bgcolor: 'var(--accent-dark, #16a34a)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(148, 163, 184, 0.25)',
                    color: '#94a3b8',
                  },
                }}
              >
                <SendRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Fade>
      )}
    </>
  );
}
