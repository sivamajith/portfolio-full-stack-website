import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Slider,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { firebaseReady, registerDeviceToken, listenForForegroundMessages } from '../firebase';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const defaultTechnologies = {
  frontend: [
    { icon: '⚛️', name: 'React.js', exp: '3+ yrs', desc: 'Hooks, Suspense, Concurrent Mode, Virtual DOM' },
    { icon: '▲', name: 'Next.js', exp: '2+ yrs', desc: 'App Router, SSR, SSG, Server Actions' },
    { icon: '🌊', name: 'Tailwind CSS', exp: '3+ yrs', desc: 'Responsive Design, Custom Themes, Utilities' },
    { icon: '🔷', name: 'TypeScript', exp: '2+ yrs', desc: 'Type Safety, Generics, Interfaces' },
    { icon: '🎨', name: 'Material UI', exp: '3+ yrs', desc: 'Custom Theming, Responsive Layouts, Sx API' },
  ],
  backend: [
    { icon: '🟢', name: 'Node.js', exp: '3+ yrs', desc: 'Event Loop, Streams, Cluster Module, Async I/O' },
    { icon: '⚡', name: 'Express.js', exp: '3+ yrs', desc: 'RESTful APIs, Middlewares, Routing, Auth' },
    { icon: '💬', name: 'Socket.io', exp: '2+ yrs', desc: 'WebSockets, Real-time Rooms, Live Feeds' },
    { icon: '🔒', name: 'JWT & OAuth', exp: '2+ yrs', desc: 'Secure Authentication & Session Management' },
  ],
  database: [
    { icon: '🍃', name: 'MongoDB', exp: '3+ yrs', desc: 'Aggregation Pipelines, Mongoose Schemas, Indexing' },
    { icon: '🐘', name: 'PostgreSQL', exp: '2+ yrs', desc: 'Relational Schemas, Complex Joins, ACID transactions' },
    { icon: '🔥', name: 'Firebase', exp: '2+ yrs', desc: 'Firestore, Realtime DB, Cloud Functions' },
    { icon: '🗄️', name: 'Redis', exp: '1+ yr', desc: 'In-memory Caching, Pub/Sub, Rate Limiting' },
  ],
  cloud: [
    { icon: '☁️', name: 'AWS (S3/EC2)', exp: '2+ yrs', desc: 'Bucket Management, CloudFront CDN, Hosting' },
    { icon: '▲', name: 'Vercel', exp: '3+ yrs', desc: 'Edge Functions, Automated CI/CD Deployments' },
    { icon: '🐳', name: 'Docker', exp: '1+ yr', desc: 'Containerization, Multi-stage Builds, Compose' },
  ],
  tools: [
    { icon: '🔗', name: 'Git & GitHub', exp: '3+ yrs', desc: 'Branching, PR Reviews, Git Flow, Actions' },
    { icon: '💻', name: 'VS Code', exp: '3+ yrs', desc: 'Custom Workspaces, Debugging, Extensions' },
    { icon: '📮', name: 'Postman', exp: '3+ yrs', desc: 'API Testing, Automated Collections, Mocking' },
    { icon: '📐', name: 'Figma', exp: '2+ yrs', desc: 'UI Wireframing, Component Systems, Prototyping' },
  ],
};

const defaultAboutTimeline = [
  { year: '2021', title: 'Started Journey', subtitle: 'Learned HTML, CSS, JavaScript, and Core CS Algorithms' },
  { year: '2022', title: 'Frontend Developer', subtitle: 'Specialized in React, Next.js, and Modern UI design systems' },
  { year: '2023', title: 'Full Stack Developer', subtitle: 'Architected Node.js microservices, MongoDB, and AWS cloud APIs' },
  { year: '2024', title: 'Building Solutions', subtitle: 'Delivering end-to-end scalable products and high-impact software' },
];

const defaultAboutStats = [
  { value: '3', suffix: '+', label: 'Years Experience' },
  { value: '20', suffix: '+', label: 'Projects Shipped' },
  { value: '10', suffix: '+', label: 'Technologies Mastered' },
  { value: '99', suffix: '%', label: 'Client Satisfaction' },
];

const defaultExperienceJourney = [
  { year: '2021', title: 'Started Journey', detail: 'Started learning HTML, CSS & JS', icon: 'code' },
  { year: '2022', title: 'Frontend Developer', detail: 'Built interactive UI with React', icon: 'tree' },
  { year: '2023', title: 'Full Stack Developer', detail: 'Started building full stack apps', icon: 'code' },
  { year: '2024', title: 'Building Solutions', detail: 'Creating scalable solutions', icon: 'rocket' },
];

const defaultHeroStats = [
  { value: '20+', label: 'Projects shipped' },
  { value: '3yr', label: 'Building digitally' },
  { value: '24h', label: 'Typical reply' },
];

const emptyProject = {
  id: '',
  title: '',
  subtitle: '',
  tags: '',
  type: 'gallery',
  category: '',
  impact: '',
  liveUrl: '',
  sourceUrl: '',
  image: '',
  imageAlt: '',
  featured: true,
};

const emptyReview = {
  name: '',
  role: 'Client',
  rating: 5,
  text: '',
  approved: true,
};

function api(path, options = {}, token) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Request failed');
    return resData;
  });
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || 'Authentication failed');
      onLogin(resJson.token);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="admin-login">
      <Box className="admin-login-card">
        <Box className="admin-login-icon">
          <LockOutlinedIcon />
        </Box>
        <Typography variant="h4">Owner Console</Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Sign in to manage and edit all front UI features
        </Typography>
        <form onSubmit={submit}>
          <TextField
            label="Username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 2, py: 1.2, bgcolor: 'var(--accent-color, #22c55e)', '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' } }}
          >
            {loading ? 'Entering console...' : 'Enter Dashboard'}
          </Button>
          {error && <p className="admin-error">{error}</p>}
        </form>
        <span className="admin-login-caption">Protected Portfolio Workspace</span>
      </Box>
    </Box>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => window.sessionStorage.getItem('portfolio-admin-token'));
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);
  const [notice, setNotice] = useState({ text: '', type: 'success' });
  const [notificationPermission, setNotificationPermission] = useState(() => (
    'Notification' in window ? Notification.permission : 'unsupported'
  ));
  const [settings, setSettingsState] = useState({});
  const settingsDirtyRef = useRef(false);
  const knownMessageIdsRef = useRef(null);
  const setSettings = (nextSettings) => {
    settingsDirtyRef.current = true;
    setSettingsState(nextSettings);
  };
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingCertificateIndex, setUploadingCertificateIndex] = useState(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  // Project state
  const [project, setProject] = useState(emptyProject);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectSearch, setProjectSearch] = useState('');

  // Review state
  const [newReview, setNewReview] = useState(emptyReview);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Skills state
  const [activeSkillCategory, setActiveSkillCategory] = useState('frontend');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkill, setNewSkill] = useState({ icon: '⚡', name: '', exp: '2+ yrs', desc: '' });

  // Hero Roles & Tech tags temp states
  const [newHeroRole, setNewHeroRole] = useState('');
  const [newTechTag, setNewTechTag] = useState('');

  // Experience journey icon options
  const journeyIcons = [
    { label: 'Code', value: 'code', icon: <CodeRoundedIcon fontSize="small" /> },
    { label: 'Tree', value: 'tree', icon: <AccountTreeRoundedIcon fontSize="small" /> },
    { label: 'Rocket', value: 'rocket', icon: <RocketLaunchRoundedIcon fontSize="small" /> },
    { label: 'School', value: 'school', icon: <SchoolRoundedIcon fontSize="small" /> },
    { label: 'Work', value: 'work', icon: <WorkRoundedIcon fontSize="small" /> },
    { label: 'Terminal', value: 'terminal', icon: <TerminalRoundedIcon fontSize="small" /> },
    { label: 'Star', value: 'star', icon: <StarRoundedIcon fontSize="small" /> },
  ];

  const showNotice = (text, type = 'success') => {
    setNotice({ text, type });
    window.setTimeout(() => setNotice({ text: '', type: 'success' }), 5000);
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      showNotice('This browser does not support notifications.', 'warning');
      return;
    }

    if (Notification.permission === 'denied') {
      showNotice('Notifications are blocked in your browser settings. Please click the 🔒 lock / tune icon in the browser address bar -> Site Settings -> set Notifications to "Allow" or "Reset", and reload.', 'warning');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        const synced = await registerAndSyncToken();
        if (synced) {
          showNotice('✅ Notifications enabled successfully! You will receive push alerts for new contact messages and bookings.', 'success');
        } else {
          showNotice('Notification permission granted in browser.', 'success');
        }
      } else {
        showNotice('Notification permission was not granted.', 'warning');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      showNotice('Failed to enable notifications: ' + (err?.message || 'Unknown error'), 'error');
    }
  };

  const sendTestNotification = async () => {
    try {
      showNotice('Sending test push notification to your registered device...', 'info');
      const res = await api('/admin/test-notification', { method: 'POST' }, token);
      if (res?.success) {
        showNotice(res.message || '✅ Test push notification dispatched to your device!', 'success');
      } else {
        showNotice(res?.message || 'Could not send test notification.', 'warning');
      }
    } catch (err) {
      showNotice('Test notification failed: ' + (err?.message || 'Error'), 'error');
    }
  };

  const load = () => {
    if (!token) return;
    api('/admin/overview', {}, token)
      .then((result) => {
        const loadedSettings = {
          name: 'John Doe',
          role: 'Full Stack Developer',
          tagline: 'Problem Solver | Tech Enthusiast',
          description: 'I build scalable web applications with modern technologies and excellent user experiences.',
          available: true,
          availableText: 'Available for select projects',
          profileImage: '',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
          whatsapp: 'https://wa.me/919999999999',
          email: 'johndoe@example.com',
          phone: '+1 (123) 456-7890',
          location: 'San Francisco, CA',
          resumeUrl: '',
          heroRoles: ['Full Stack Developer', 'Product Engineer', 'Creative Problem Solver'],
          heroStats: defaultHeroStats,
          heroTechStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Figma'],
          aboutKicker: '// ABOUT ME',
          aboutTitle: 'Building Digital Experiences That Solve Real Problems',
          aboutDescription: "I'm a passionate Full Stack Developer with 3+ years of experience building modern web applications and digital products.",
          aboutSecondDescription: 'I love turning ideas into reality using clean code, beautiful design and the latest technologies.',
          aboutStats: defaultAboutStats,
          aboutTimeline: defaultAboutTimeline,
          skillsKicker: '// TECHNICAL EXPERTISE',
          skillsTitle: 'Technologies I Work With',
          skillsDescription: 'I work with a wide range of technologies to build scalable and efficient solutions.',
          technologies: defaultTechnologies,
          experienceKicker: '// MY JOURNEY',
          experienceTitle: 'Learning. Building. Growing.',
          experienceDescription: 'My journey as a developer has been about constant learning, building amazing things and solving real world problems.',
          experienceJourney: defaultExperienceJourney,
          contactKicker: '// GET IN TOUCH',
          contactHeading: "Let's Work Together On Something Amazing",
          contactIntro: 'Have a project in mind or just want to say hi? I would love to hear from you.',
          brandLogo: 'Y',
          themeColor: 'emerald',
          ...result.settings,
        };

        if (!loadedSettings.technologies || typeof loadedSettings.technologies !== 'object' || !Object.keys(loadedSettings.technologies).length) {
          loadedSettings.technologies = defaultTechnologies;
        }
        if (!Array.isArray(loadedSettings.aboutStats) || !loadedSettings.aboutStats.length) {
          loadedSettings.aboutStats = defaultAboutStats;
        }
        if (!Array.isArray(loadedSettings.aboutTimeline) || !loadedSettings.aboutTimeline.length) {
          loadedSettings.aboutTimeline = defaultAboutTimeline;
        }
        if (!Array.isArray(loadedSettings.experienceJourney) || !loadedSettings.experienceJourney.length) {
          loadedSettings.experienceJourney = defaultExperienceJourney;
        }
        if (!Array.isArray(loadedSettings.heroStats) || !loadedSettings.heroStats.length) {
          loadedSettings.heroStats = defaultHeroStats;
        }

        const incomingMessages = Array.isArray(result.messages) ? result.messages : [];
        const incomingMessageIds = new Set(incomingMessages.map((message) => String(message._id)));
        if (knownMessageIdsRef.current) {
          const newMessage = incomingMessages.find((message) => !knownMessageIdsRef.current.has(String(message._id)));
          if (newMessage) {
            showNotice(`New contact message from ${newMessage.name}: ${newMessage.subject}`, 'info');
          }
        }
        knownMessageIdsRef.current = incomingMessageIds;
        setData({ ...result, settings: loadedSettings });
        if (!settingsDirtyRef.current) setSettingsState(loadedSettings);
      })
      .catch(() => {
        sessionStorage.removeItem('portfolio-admin-token');
        setToken(null);
      });
  };

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!token) return undefined;
    sessionStorage.setItem('portfolio-admin-token', token);
    loadRef.current();
    const interval = window.setInterval(() => loadRef.current(), 30000);
    return () => window.clearInterval(interval);
  }, [token, notificationPermission]);

  const registerAndSyncToken = async () => {
    if (!token || !firebaseReady) return false;
    try {
      let serviceWorkerRegistration;
      if ('serviceWorker' in navigator) {
        const config = new URLSearchParams({
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
          storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
        });
        const workerUrl = `/firebase-messaging-sw.js?${config.toString()}`;
        serviceWorkerRegistration = await navigator.serviceWorker.getRegistration('/');
        if (!serviceWorkerRegistration?.active?.scriptURL.includes('/firebase-messaging-sw.js')) {
          serviceWorkerRegistration = await navigator.serviceWorker.register(workerUrl, { scope: '/' });
        }
        await navigator.serviceWorker.ready;
        await serviceWorkerRegistration.update();
      }

      const deviceToken = await registerDeviceToken(serviceWorkerRegistration);
      if (!deviceToken) {
        return false;
      }

      const response = await fetch(`${API_BASE}/admin/device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: deviceToken,
          platform: 'web',
          userAgent: navigator.userAgent,
        }),
      });
      if (response.ok) {
        console.log('Admin device registered for push notifications successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Owner device token registration failed:', error);
      return false;
    }
  };

  const registerAndSyncTokenRef = useRef(registerAndSyncToken);
  registerAndSyncTokenRef.current = registerAndSyncToken;

  useEffect(() => {
    if (!token || !firebaseReady) return undefined;

    if ('Notification' in window && Notification.permission === 'granted') {
      registerAndSyncTokenRef.current();
    }
    const tokenRefreshInterval = window.setInterval(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        registerAndSyncTokenRef.current();
      }
    }, 15 * 60 * 1000);
    const unsubscribe = listenForForegroundMessages((payload) => {
      const title = payload?.notification?.title || (payload?.data?.type === 'contact_message' ? 'New portfolio contact message' : 'Portfolio update');
      const body = payload?.notification?.body || payload?.data?.subject || 'New portfolio update';
      if (title) {
        showNotice(`${title}: ${body}`, 'info');
        if ('Notification' in window && Notification.permission === 'granted') {
          console.log('Admin foreground notification received:', title, body);
          new Notification(title, {
            body,
            icon: '/logo.png',
          });
        }
      }
    });

    return () => {
      window.clearInterval(tokenRefreshInterval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [token]);

  if (!token) return <Login onLogin={setToken} />;
  if (!data) return <Box className="admin-loading">Loading owner console...</Box>;

  // Save Settings Handlers
  const saveAllSettings = async (customSettings = null) => {
    setSavingSettings(true);
    const sourceSettings = customSettings || settings;
    const payload = {
      ...sourceSettings,
      technologies: Object.fromEntries(
        Object.entries(sourceSettings.technologies || {}).map(([category, items]) => [
          category,
          Array.isArray(items)
            ? items.map(({ level, ...skill }) => skill)
            : items,
        ])
      ),
    };
    try {
      const res = await api('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) }, token);
      settingsDirtyRef.current = false;
      setSettingsState(res.settings);
      window.dispatchEvent(new CustomEvent('portfolio-settings-updated', { detail: res.settings }));
      showNotice('Settings saved successfully and updated live on the site!');
      load();
      return true;
    } catch (err) {
      showNotice(err.message || 'Error saving settings', 'error');
      return false;
    } finally {
      setSavingSettings(false);
    }
  };

  const addSkillCategory = async () => {
    const categoryName = newCategoryName.trim().replace(/\s+/g, ' ').toLowerCase();
    if (!categoryName) {
      showNotice('Category name is required', 'error');
      return;
    }

    const technologies = settings.technologies || {};
    const duplicateCategory = Object.keys(technologies).some(
      (category) => category.toLowerCase() === categoryName
    );
    if (duplicateCategory) {
      showNotice(`Category "${categoryName}" already exists`, 'error');
      return;
    }

    const updated = {
      ...settings,
      technologies: { ...technologies, [categoryName]: [] },
    };
    setSettings(updated);
    setActiveSkillCategory(categoryName);
    setNewCategoryName('');

    const saved = await saveAllSettings(updated);
    if (saved) showNotice(`Category "${categoryName}" created and saved!`);
  };

  const uploadImageToCloudinary = async (file, fieldName = 'image') => {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${API_BASE.replace('/api', '')}/api/uploads/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Image upload failed');
    }

    return result.url;
  };

  const uploadCertificateToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE.replace('/api', '')}/api/uploads/file`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Certificate upload failed');
    return result;
  };

  const handleCertificateUpload = async (event, achievementIndex, achievement) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      showNotice('Please select a certificate PDF or image file.', 'error');
      event.target.value = '';
      return;
    }

    setUploadingCertificateIndex(achievementIndex);
    showNotice('Uploading certificate to Cloudinary...', 'info');
    try {
      const result = await uploadCertificateToCloudinary(file);
      const current = [...(settings.achievements || [])];
      current[achievementIndex] = {
        ...(current[achievementIndex] || achievement),
        certificateUrl: result.url,
        certificatePreviewUrl: result.previewUrl || result.url,
        certificateThumbnailUrl: result.thumbnailUrl || (result.fileType?.startsWith('image/') ? result.url : ''),
        certificateType: result.fileType,
      };
      setSettings({ ...settings, achievements: current });
      showNotice('Certificate uploaded successfully. Save changes to publish it.', 'success');
    } catch (error) {
      showNotice(error.message || 'Failed to upload certificate.', 'error');
    } finally {
      event.target.value = '';
      setUploadingCertificateIndex(null);
    }
  };

  // Image upload handler (uploads to Cloudinary and stores remote URL)
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotice('Please select a valid image file (PNG, JPG, WebP, etc.).', 'error');
      event.target.value = '';
      return;
    }

    setUploadingProfileImage(true);

    try {
      const url = await uploadImageToCloudinary(file, 'image');
      const updated = { ...settings, profileImage: url };
      setSettings(updated);
      await saveAllSettings(updated);
      showNotice('Profile image uploaded and updated live on the site.', 'success');
    } catch (error) {
      showNotice(error.message || 'Failed to upload image file', 'error');
    } finally {
      event.target.value = '';
      setUploadingProfileImage(false);
    }
  };

  // Resume PDF upload handler
  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showNotice('Please select a PDF document for resume.', 'error');
      event.target.value = '';
      return;
    }
    setUploadingResume(true);
    showNotice('Reading resume PDF...', 'info');
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const updated = { ...settings, resumeUrl: base64 };
      setSettings(updated);
      setUploadingResume(false);
      showNotice('Resume PDF uploaded successfully. Click "Save Changes" to apply.', 'success');
    };
    reader.onerror = () => {
      setUploadingResume(false);
      showNotice('Failed to read PDF file', 'error');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleProjectImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotice('Please select a valid image file for the project preview.', 'error');
      event.target.value = '';
      return;
    }

    setUploadingProjectImage(true);

    try {
      const url = await uploadImageToCloudinary(file, 'image');
      setProject((current) => ({
        ...current,
        image: url,
        imageAlt: current.imageAlt || current.title || 'Project preview image',
      }));
      showNotice('Project image uploaded to Cloudinary and ready to save.', 'success');
    } catch (error) {
      showNotice(error.message || 'Failed to upload project image.', 'error');
    } finally {
      event.target.value = '';
      setUploadingProjectImage(false);
    }
  };

  // Project CRUD
  const saveProject = async (event) => {
    event.preventDefault();
    const tagsArray = typeof project.tags === 'string'
      ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : Array.isArray(project.tags) ? project.tags : [];
    const generatedId = project.id && project.id.trim()
      ? project.id.trim()
      : (project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36) : 'project-' + Date.now().toString(36));
    const body = {
      ...project,
      id: generatedId,
      desc: project.desc || project.impact || '',
      impact: project.impact || project.desc || '',
      tags: tagsArray,
      liveUrl: String(project.liveUrl || '').trim(),
      sourceUrl: String(project.sourceUrl || '').trim(),
    };
    try {
      await api(editingProjectId ? `/admin/projects/${editingProjectId}` : '/admin/projects', {
        method: editingProjectId ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      }, token);
      setProject(emptyProject);
      setEditingProjectId(null);
      window.dispatchEvent(new CustomEvent('portfolio-projects-updated'));
      showNotice(editingProjectId ? 'Project updated successfully' : 'Project created successfully');
      load();
    } catch (err) {
      showNotice(err.message || 'Error saving project', 'error');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await api(`/admin/projects/${id}`, { method: 'DELETE' }, token);
      window.dispatchEvent(new CustomEvent('portfolio-projects-updated'));
      showNotice('Project deleted');
      load();
    } catch (err) {
      showNotice(err.message || 'Error deleting project', 'error');
    }
  };

  // Reviews CRUD
  const saveReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        await api(`/admin/reviews/${editingReviewId}`, { method: 'PUT', body: JSON.stringify(newReview) }, token);
        showNotice('Review updated successfully');
      } else {
        await api('/admin/reviews', { method: 'POST', body: JSON.stringify(newReview) }, token);
        showNotice('Review added successfully');
      }
      setReviewModalOpen(false);
      setEditingReviewId(null);
      setNewReview(emptyReview);
      window.dispatchEvent(new CustomEvent('portfolio-reviews-updated'));
      load();
    } catch (err) {
      showNotice(err.message || 'Error saving review', 'error');
    }
  };

  const toggleReviewApproval = async (review) => {
    try {
      await api(`/admin/reviews/${review._id}`, { method: 'PUT', body: JSON.stringify({ approved: !review.approved }) }, token);
      window.dispatchEvent(new CustomEvent('portfolio-reviews-updated'));
      showNotice(`Review ${review.approved ? 'hidden' : 'published'}`);
      load();
    } catch (err) {
      showNotice(err.message || 'Error updating review', 'error');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api(`/admin/reviews/${id}`, { method: 'DELETE' }, token);
      window.dispatchEvent(new CustomEvent('portfolio-reviews-updated'));
      showNotice('Review deleted');
      load();
    } catch (err) {
      showNotice(err.message || 'Error deleting review', 'error');
    }
  };

  // Messages CRUD
  const updateMessageStatus = async (message, status) => {
    try {
      await api(`/admin/messages/${message._id}`, { method: 'PUT', body: JSON.stringify({ status }) }, token);
      showNotice(`Message marked as ${status}`);
      load();
    } catch (err) {
      showNotice(err.message || 'Error updating message status', 'error');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api(`/admin/messages/${id}`, { method: 'DELETE' }, token);
      showNotice('Message deleted');
      load();
    } catch (err) {
      showNotice(err.message || 'Error deleting message', 'error');
    }
  };

  // Nav Items
  const navTabs = [
    { label: 'Overview', icon: <DashboardRoundedIcon /> },
    { label: 'Home Page', icon: <HomeRoundedIcon /> },
    { label: 'About & Certs', icon: <PersonRoundedIcon /> },
    { label: 'Skills Matrix', icon: <BoltRoundedIcon /> },
    { label: 'Projects', icon: <WorkOutlineRoundedIcon /> },
    { label: 'Experience & Edu', icon: <TimelineRoundedIcon /> },
    { label: 'Services', icon: <DesignServicesRoundedIcon /> },
    { label: 'Contact, FAQ & Inbox', icon: <MailRoundedIcon /> },
    { label: 'Reviews', icon: <RateReviewRoundedIcon /> },
    { label: 'Appearance', icon: <PaletteRoundedIcon /> },
  ];

  const filteredProjects = (data.projects || []).filter((p) => {
    if (!projectSearch) return true;
    const query = projectSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(query))
    );
  });

  return (
    <Box className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Box className="admin-brand">
          <span className="admin-brand-mark">{settings?.brandLogo || 'Y'}</span>
          <Box>
            <strong>{settings?.name || 'Owner Portfolio'}</strong>
            <span>Admin Control Center</span>
          </Box>
        </Box>

        <Box className="admin-sidebar-label">Front UI Sections</Box>
        <nav className="admin-side-nav">
          {navTabs.map((item, index) => (
            <button
              type="button"
              className={tab === index ? 'active' : ''}
              onClick={() => setTab(index)}
              key={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
              {index === 9 && data.messages.filter((m) => m.status === 'new').length > 0 && (
                <span className="admin-badge-count">{data.messages.filter((m) => m.status === 'new').length}</span>
              )}
            </button>
          ))}
        </nav>

        <Box className="admin-sidebar-footer">
          <span className="admin-status-dot" style={{ backgroundColor: settings.available ? '#22c55e' : '#ef4444' }} />
          <span>{settings.available ? 'Status: Available' : 'Status: Busy / Offline'}</span>
        </Box>
      </aside>

      {/* Main Content Area */}
      <Box className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <Box>
            <span className="admin-eyebrow">PORTFOLIO CMS · FULL CONTROL</span>
            <Typography variant="h3">
              {tab === 0 && 'Workspace Overview'}
              {tab === 1 && 'Home & Profile Settings'}
              {tab === 2 && 'About Page, Values & Certifications'}
              {tab === 3 && 'Skills & Matrix Editor'}
              {tab === 4 && 'Projects Management'}
              {tab === 5 && 'Experience, Work History & Education'}
              {tab === 6 && 'Services, Offerings & Process'}
              {tab === 7 && 'Contact Details, FAQ & Inbox'}
              {tab === 8 && 'Client Testimonials'}
              {tab === 9 && 'Site Theme & Appearance'}
            </Typography>
            <Typography>
              Update, delete, or change all front UI sections in real-time.
            </Typography>
          </Box>

          <Box className="admin-header-actions">
            <Button
              startIcon={<LaunchRoundedIcon />}
              onClick={() => window.open(`${window.location.origin}/home`, '_blank', 'noopener,noreferrer')}
              variant="outlined"
              color="success"
            >
              Live Website
            </Button>
            {notificationPermission !== 'granted' && (
              <Button
                startIcon={<NotificationsActiveRoundedIcon />}
                onClick={enableNotifications}
                variant="outlined"
                color="warning"
              >
                Enable Notifications
              </Button>
            )}
            {notificationPermission === 'granted' && (
              <Button
                startIcon={<NotificationsActiveRoundedIcon />}
                onClick={sendTestNotification}
                variant="outlined"
                color="success"
              >
                Test Device Alert
              </Button>
            )}
            <Button startIcon={<RefreshRoundedIcon />} onClick={load} variant="outlined">
              Refresh Data
            </Button>
            <Button
              startIcon={<LogoutRoundedIcon />}
              onClick={() => {
                sessionStorage.removeItem('portfolio-admin-token');
                setToken(null);
              }}
              variant="contained"
              color="error"
            >
              Sign Out
            </Button>
          </Box>
        </header>

        <Snackbar
          open={Boolean(notice.text)}
          autoHideDuration={5000}
          onClose={() => setNotice({ text: '', type: 'success' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={notice.type} variant="filled" sx={{ borderRadius: 2 }}>
            {notice.text}
          </Alert>
        </Snackbar>

        {/* TAB 0: OVERVIEW / DASHBOARD */}
        {tab === 0 && (
          <Box className="admin-wide">
            {/* Stats Cards */}
            <Box className="admin-stats">
              <Box className="admin-stat-card stat-0">
                <Box className="admin-stat-icon"><WorkOutlineRoundedIcon /></Box>
                <Box>
                  <strong>{data.projects.length}</strong>
                  <span>Total Projects</span>
                </Box>
                <small>{data.projects.filter((p) => p.featured).length} Published Live</small>
              </Box>

              <Box className="admin-stat-card stat-1">
                <Box className="admin-stat-icon"><RateReviewRoundedIcon /></Box>
                <Box>
                  <strong>{data.reviews.length}</strong>
                  <span>Client Reviews</span>
                </Box>
                <small>{data.reviews.filter((r) => r.approved).length} Approved</small>
              </Box>

              <Box className="admin-stat-card stat-2">
                <Box className="admin-stat-icon"><MailRoundedIcon /></Box>
                <Box>
                  <strong>{data.messages.filter((m) => m.status === 'new').length}</strong>
                  <span>New Inquiries</span>
                </Box>
                <small>{data.messages.length} Total Messages</small>
              </Box>

              <Box className="admin-stat-card stat-3">
                <Box className="admin-stat-icon"><BoltRoundedIcon /></Box>
                <Box>
                  <strong>
                    {Object.values(settings.technologies || {}).reduce((acc, cat) => acc + (Array.isArray(cat) ? cat.length : 0), 0)}
                  </strong>
                  <span>Active Skills</span>
                </Box>
                <small>Across {Object.keys(settings.technologies || {}).length} Categories</small>
              </Box>
            </Box>

            {/* Quick Profile Summary Card & Fast Jump */}
            <Box className="admin-overview-grid">
              <Box className="admin-card">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  👤 Live Profile Snapshot
                </Typography>
                <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 84,
                      height: 84,
                      borderRadius: '50%',
                      border: '3px solid var(--accent-color, #22c55e)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#e2e8f0',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {settings.profileImage ? (
                      <img src={settings.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography variant="h4" color="text.secondary">{settings.name?.[0] || 'Y'}</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{settings.name || 'John Doe'}</Typography>
                    <Typography color="primary" sx={{ fontWeight: 600 }}>{settings.role || 'Full Stack Developer'}</Typography>
                    <Typography variant="body2" color="text.secondary">{settings.email} · {settings.location}</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.available !== false}
                        onChange={(e) => {
                          const updated = { ...settings, available: e.target.checked };
                          setSettings(updated);
                          saveAllSettings(updated);
                        }}
                      />
                    }
                    label={<strong>Show "Available for select projects" badge on Home page</strong>}
                  />
                  <TextField
                    label="Availability Pill Text"
                    value={settings.availableText || ''}
                    onChange={(e) => setSettings({ ...settings, availableText: e.target.value })}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  onClick={() => saveAllSettings()}
                  disabled={savingSettings}
                  sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                >
                  {savingSettings ? 'Saving...' : 'Save Quick Changes'}
                </Button>
              </Box>

              {/* Quick Jump Buttons */}
              <Box className="admin-card">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  ⚡ Quick Navigation
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1.5 }}>
                  <Button variant="outlined" startIcon={<HomeRoundedIcon />} onClick={() => setTab(1)}>Edit Home & Image</Button>
                  <Button variant="outlined" startIcon={<PersonRoundedIcon />} onClick={() => setTab(2)}>Edit About & Timeline</Button>
                  <Button variant="outlined" startIcon={<BoltRoundedIcon />} onClick={() => setTab(3)}>Manage Skills Matrix</Button>
                  <Button variant="outlined" startIcon={<WorkOutlineRoundedIcon />} onClick={() => setTab(4)}>Add / Edit Projects</Button>
                  <Button variant="outlined" startIcon={<TimelineRoundedIcon />} onClick={() => setTab(5)}>Edit Experience</Button>
                  <Button variant="outlined" startIcon={<MailRoundedIcon />} onClick={() => setTab(7)}>Check Contact Inbox</Button>
                  <Button variant="outlined" startIcon={<RateReviewRoundedIcon />} onClick={() => setTab(8)}>Moderate Reviews</Button>
                  <Button variant="outlined" startIcon={<PaletteRoundedIcon />} onClick={() => setTab(9)}>Theme & Appearance</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* TAB 1: HOME PAGE & PROFILE IMAGE */}
        {tab === 1 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Home Page & Hero Section Customizer</Typography>
              <Typography color="text.secondary">
                Configure your identity, bio, rotating roles, proof stats, tech strip, social links, and profile image.
              </Typography>
            </Box>

            {/* Profile Photo Manager */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🖼️ Profile Image Manager (Home & About)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload an image from your computer or paste an image URL. This image will appear inside the 3D framed hero section on Home and About page.
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    borderRadius: '16px',
                    border: '3px dashed rgba(34, 197, 94, 0.6)',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  {settings.profileImage ? (
                    <img src={settings.profileImage} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ px: 1 }}>
                      No image selected (Default avatar used)
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, minWidth: 'min(100%, 260px)' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadRoundedIcon />}
                      disabled={uploadingProfileImage}
                      sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                    >
                      {uploadingProfileImage ? 'Uploading...' : 'Upload Photo from Device'}
                      <input type="file" accept="image/*" hidden onChange={handleProfileImageUpload} disabled={uploadingProfileImage} />
                    </Button>
                    {settings.profileImage && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteForeverRoundedIcon />}
                        onClick={() => {
                          setSettings({ ...settings, profileImage: '' });
                          showNotice('Profile image cleared. Click "Save Home Changes" to apply.', 'info');
                        }}
                      >
                        Delete Photo
                      </Button>
                    )}
                  </Box>
                  <TextField
                    label="Or paste Image URL directly"
                    value={settings.profileImage || ''}
                    onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="https://example.com/my-photo.jpg"
                  />
                </Box>
              </Box>
            </Box>

            {/* Basic Identity Details */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                👤 Personal Identity & Taglines
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={settings.name || ''}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  required
                />
                <TextField
                  label="Primary Role"
                  value={settings.role || ''}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  required
                />
                <TextField
                  label="Tagline"
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  sx={{ gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Hero Bio Description"
                  value={settings.description || ''}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  multiline
                  rows={3}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* Rotating Hero Animated Roles */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🔄 Animated Rotating Roles (Home Page Hero)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These roles rotate dynamically every few seconds under your name.
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {(settings.heroRoles || []).map((role, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      label={`Role #${idx + 1}`}
                      value={role}
                      fullWidth
                      onChange={(e) => {
                        const updated = [...(settings.heroRoles || [])];
                        updated[idx] = e.target.value;
                        setSettings({ ...settings, heroRoles: updated });
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        const updated = settings.heroRoles.filter((_, i) => i !== idx);
                        setSettings({ ...settings, heroRoles: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="e.g. AI Engineer, Next.js Architect"
                  value={newHeroRole}
                  onChange={(e) => setNewHeroRole(e.target.value)}
                  sx={{ maxWidth: 350 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    if (!newHeroRole.trim()) return;
                    setSettings({ ...settings, heroRoles: [...(settings.heroRoles || []), newHeroRole.trim()] });
                    setNewHeroRole('');
                  }}
                >
                  Add Role
                </Button>
              </Box>
            </Box>

            {/* Proof Stats */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                📈 Hero Proof Statistics Row
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Cards displayed at the bottom of the home hero section (e.g. 20+ Projects shipped, 3yr Building digitally).
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, mb: 2 }}>
                {(settings.heroStats || []).map((stat, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, position: 'relative' }}>
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 6, right: 6 }}
                      onClick={() => {
                        const updated = settings.heroStats.filter((_, i) => i !== idx);
                        setSettings({ ...settings, heroStats: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      label="Stat Value"
                      size="small"
                      value={stat.value}
                      fullWidth
                      sx={{ mb: 1, mt: 1 }}
                      onChange={(e) => {
                        const updated = [...settings.heroStats];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setSettings({ ...settings, heroStats: updated });
                      }}
                    />
                    <TextField
                      label="Stat Label"
                      size="small"
                      value={stat.label}
                      fullWidth
                      onChange={(e) => {
                        const updated = [...settings.heroStats];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setSettings({ ...settings, heroStats: updated });
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSettings({
                    ...settings,
                    heroStats: [...(settings.heroStats || []), { value: '10+', label: 'New Metric' }],
                  });
                }}
              >
                Add Proof Stat
              </Button>
            </Box>

            {/* Building With Tech Stack */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🚀 "Building With" Tech Stack Strip
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The marquee strip shown at the bottom of the home screen.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {(settings.heroTechStack || []).map((tech, idx) => (
                  <Chip
                    key={idx}
                    label={tech}
                    onDelete={() => {
                      const updated = settings.heroTechStack.filter((_, i) => i !== idx);
                      setSettings({ ...settings, heroTechStack: updated });
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="e.g. GraphQL, Tailwind, Docker"
                  value={newTechTag}
                  onChange={(e) => setNewTechTag(e.target.value)}
                  sx={{ maxWidth: 300 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    if (!newTechTag.trim()) return;
                    setSettings({ ...settings, heroTechStack: [...(settings.heroTechStack || []), newTechTag.trim()] });
                    setNewTechTag('');
                  }}
                >
                  Add Tech Tag
                </Button>
              </Box>
            </Box>

            {/* Social & Contact Links & Resume */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🌐 Social Links & Resume
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, mb: 3 }}>
                <TextField
                  label="GitHub Profile URL"
                  value={settings.github || ''}
                  onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                />
                <TextField
                  label="LinkedIn Profile URL"
                  value={settings.linkedin || ''}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                />
                <TextField
                  label="WhatsApp Number (or Link)"
                  value={settings.whatsapp || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                />
                <TextField
                  label="Instagram URL"
                  value={settings.instagram || ''}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                />
              </Box>

              {/* Resume File Manager */}
              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  📄 ATS Resume PDF File
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component="label"
                    variant="outlined"
                    disabled={uploadingResume}
                    startIcon={uploadingResume ? <CircularProgress size={18} /> : <CloudUploadRoundedIcon />}
                  >
                    {uploadingResume ? 'Loading PDF...' : 'Upload Resume PDF'}
                    <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} />
                  </Button>
                  {settings.resumeUrl && (
                    <>
                      <Button
                        variant="text"
                        component="a"
                        href={settings.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        startIcon={<LaunchRoundedIcon />}
                      >
                        Preview Current PDF
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => {
                          setSettings({ ...settings, resumeUrl: '' });
                          showNotice('Resume cleared. Save changes to apply.', 'info');
                        }}
                      >
                        Remove PDF
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Save Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save All Home Page Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 2: ABOUT PAGE EDITOR */}
        {tab === 2 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">About Me Page Editor</Typography>
              <Typography color="text.secondary">
                Edit about headings, narrative paragraphs, achievement stats, and interactive timeline milestones.
              </Typography>
            </Box>

            {/* About Narrative Text */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📝 About Headings & Narrative
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.aboutKicker || ''}
                  onChange={(e) => setSettings({ ...settings, aboutKicker: e.target.value })}
                  placeholder="// ABOUT ME"
                />
                <TextField
                  label="Main Title"
                  value={settings.aboutTitle || ''}
                  onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                  sx={{ gridColumn: '1 / -1' }}
                />
                <TextField
                  label="First Bio Paragraph"
                  value={settings.aboutDescription || ''}
                  onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                  multiline
                  rows={3}
                  sx={{ gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Second Bio Paragraph"
                  value={settings.aboutSecondDescription || ''}
                  onChange={(e) => setSettings({ ...settings, aboutSecondDescription: e.target.value })}
                  multiline
                  rows={3}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* About Key Achievement Stats */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🏆 About Key Stats Badges
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Highlighted metric blocks (e.g. 3+ Years Experience, 20+ Projects Completed, 99% Satisfaction).
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, mb: 2 }}>
                {(settings.aboutStats || []).map((stat, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, position: 'relative' }}>
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 6, right: 6 }}
                      onClick={() => {
                        const updated = settings.aboutStats.filter((_, i) => i !== idx);
                        setSettings({ ...settings, aboutStats: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                      <TextField
                        label="Value"
                        size="small"
                        value={stat.value}
                        sx={{ flex: 1 }}
                        onChange={(e) => {
                          const updated = [...settings.aboutStats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setSettings({ ...settings, aboutStats: updated });
                        }}
                      />
                      <TextField
                        label="Suffix"
                        size="small"
                        value={stat.suffix || '+'}
                        sx={{ width: 80 }}
                        onChange={(e) => {
                          const updated = [...settings.aboutStats];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setSettings({ ...settings, aboutStats: updated });
                        }}
                      />
                    </Box>
                    <TextField
                      label="Label"
                      size="small"
                      value={stat.label}
                      fullWidth
                      onChange={(e) => {
                        const updated = [...settings.aboutStats];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setSettings({ ...settings, aboutStats: updated });
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSettings({
                    ...settings,
                    aboutStats: [...(settings.aboutStats || []), { value: '10', suffix: '+', label: 'New Metric' }],
                  });
                }}
              >
                Add Achievement Stat
              </Button>
            </Box>

            {/* Career Timeline Milestones */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                📅 About Career Timeline Milestones
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Vertical timeline entries shown on the about page.
              </Typography>

              <Stack spacing={2} sx={{ mb: 2 }}>
                {(settings.aboutTimeline || []).map((milestone, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                      label="Year"
                      size="small"
                      value={milestone.year}
                      sx={{ width: 110 }}
                      onChange={(e) => {
                        const updated = [...settings.aboutTimeline];
                        updated[idx] = { ...updated[idx], year: e.target.value };
                        setSettings({ ...settings, aboutTimeline: updated });
                      }}
                    />
                    <TextField
                      label="Milestone Title"
                      size="small"
                      value={milestone.title}
                      sx={{ width: 220 }}
                      onChange={(e) => {
                        const updated = [...settings.aboutTimeline];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setSettings({ ...settings, aboutTimeline: updated });
                      }}
                    />
                    <TextField
                      label="Milestone Subtitle / Description"
                      size="small"
                      value={milestone.subtitle}
                      fullWidth
                      onChange={(e) => {
                        const updated = [...settings.aboutTimeline];
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        setSettings({ ...settings, aboutTimeline: updated });
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        const updated = settings.aboutTimeline.filter((_, i) => i !== idx);
                        setSettings({ ...settings, aboutTimeline: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSettings({
                    ...settings,
                    aboutTimeline: [
                      ...(settings.aboutTimeline || []),
                      { year: '2025', title: 'Next Milestone', subtitle: 'Leading innovative architecture and high impact tech' },
                    ],
                  });
                }}
              >
                Add Timeline Milestone
              </Button>
            </Box>

            {/* Core Values & Principles Editor */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🎯 Core Engineering Values &amp; Principles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Cards displayed on the About page highlighting your engineering philosophy.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.values || [
                  { icon: '⚡', name: 'Performance First', desc: 'Every millisecond matters. Zero-lag architectures and lean bundles.' },
                  { icon: '💎', name: 'Craftsmanship & Clean Code', desc: 'Self-documenting TypeScript and comprehensive test coverage.' },
                ]).map((val, vIdx) => (
                  <Box key={vIdx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <TextField
                      label="Icon Emoji"
                      size="small"
                      value={val.icon || '⚡'}
                      sx={{ width: 80 }}
                      onChange={(e) => {
                        const current = [...(settings.values || [])];
                        current[vIdx] = { ...current[vIdx], icon: e.target.value };
                        setSettings({ ...settings, values: current });
                      }}
                    />
                    <TextField
                      label="Principle Name"
                      size="small"
                      value={val.name || ''}
                      sx={{ width: 220 }}
                      onChange={(e) => {
                        const current = [...(settings.values || [])];
                        current[vIdx] = { ...current[vIdx], name: e.target.value };
                        setSettings({ ...settings, values: current });
                      }}
                    />
                    <TextField
                      label="Description"
                      size="small"
                      value={val.desc || ''}
                      fullWidth
                      onChange={(e) => {
                        const current = [...(settings.values || [])];
                        current[vIdx] = { ...current[vIdx], desc: e.target.value };
                        setSettings({ ...settings, values: current });
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        const current = settings.values || [];
                        setSettings({ ...settings, values: current.filter((_, i) => i !== vIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.values || [];
                  setSettings({
                    ...settings,
                    values: [
                      ...current,
                      { icon: '🚀', name: 'Continuous Growth', desc: 'Staying curious, exploring emerging tech, and shipping daily.' },
                    ],
                  });
                }}
              >
                Add Value Principle
              </Button>
            </Box>

            {/* Certifications & Achievements Editor */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🏆 Certifications &amp; Milestone Honors
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Badges displayed on the About page (e.g. AWS Certified Developer, Meta React Pro).
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.achievements || [
                  { icon: '🏆', title: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2024' },
                  { icon: '⚛️', title: 'Advanced React Professional', issuer: 'Meta / Coursera', year: '2023' },
                ]).map((ach, aIdx) => (
                  <Box key={aIdx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <TextField
                      label="Emoji"
                      size="small"
                      value={ach.icon || '🏆'}
                      sx={{ width: 80 }}
                      onChange={(e) => {
                        const current = [...(settings.achievements || [])];
                        current[aIdx] = { ...current[aIdx], icon: e.target.value };
                        setSettings({ ...settings, achievements: current });
                      }}
                    />
                    <TextField
                      label="Certificate / Award Title"
                      size="small"
                      value={ach.title || ''}
                      sx={{ flex: 1 }}
                      onChange={(e) => {
                        const current = [...(settings.achievements || [])];
                        current[aIdx] = { ...current[aIdx], title: e.target.value };
                        setSettings({ ...settings, achievements: current });
                      }}
                    />
                    <TextField
                      label="Issuer Organization"
                      size="small"
                      value={ach.issuer || ''}
                      sx={{ width: 200 }}
                      onChange={(e) => {
                        const current = [...(settings.achievements || [])];
                        current[aIdx] = { ...current[aIdx], issuer: e.target.value };
                        setSettings({ ...settings, achievements: current });
                      }}
                    />
                    <TextField
                      label="Year"
                      size="small"
                      value={ach.year || ''}
                      sx={{ width: 90 }}
                      onChange={(e) => {
                        const current = [...(settings.achievements || [])];
                        current[aIdx] = { ...current[aIdx], year: e.target.value };
                        setSettings({ ...settings, achievements: current });
                      }}
                    />
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        component="label"
                        size="small"
                        variant="outlined"
                        disabled={uploadingCertificateIndex === aIdx}
                        startIcon={uploadingCertificateIndex === aIdx ? <CircularProgress size={16} /> : <CloudUploadRoundedIcon />}
                      >
                        {uploadingCertificateIndex === aIdx ? 'Uploading...' : 'Upload Certificate'}
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          hidden
                          onChange={(event) => handleCertificateUpload(event, aIdx, ach)}
                        />
                      </Button>
                      {ach.certificateUrl && (
                        <Button component="a" href={ach.certificateUrl} target="_blank" rel="noreferrer" size="small" startIcon={<LaunchRoundedIcon />}>
                          View Certificate
                        </Button>
                      )}
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const current = settings.achievements || [];
                        setSettings({ ...settings, achievements: current.filter((_, i) => i !== aIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.achievements || [];
                  setSettings({
                    ...settings,
                    achievements: [
                      ...current,
                      { icon: '🌟', title: 'Open Source Contributor', issuer: 'GitHub', year: '2024' },
                    ],
                  });
                }}
              >
                Add Certification Badge
              </Button>
            </Box>

            {/* Save Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save All About Page Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 3: SKILLS MATRIX & TECH CATEGORIES */}
        {tab === 3 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Skills & Technology Matrix Editor</Typography>
              <Typography color="text.secondary">
                Manage tech categories (Frontend, Backend, Database, Cloud, Tools) and edit every individual skill's name, emoji, experience, and topics.
              </Typography>
            </Box>

            {/* Header copy */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🏷️ Skills Page Headings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.skillsKicker || ''}
                  onChange={(e) => setSettings({ ...settings, skillsKicker: e.target.value })}
                  placeholder="// TECHNICAL EXPERTISE"
                />
                <TextField
                  label="Main Title"
                  value={settings.skillsTitle || ''}
                  onChange={(e) => setSettings({ ...settings, skillsTitle: e.target.value })}
                />
                <TextField
                  label="Description"
                  value={settings.skillsDescription || ''}
                  onChange={(e) => setSettings({ ...settings, skillsDescription: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* Category Selector Tabs */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  🗂️ Categories & Skill Items
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="New Category Name (e.g. AI / ML)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    sx={{ width: 220 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={addSkillCategory}
                    disabled={savingSettings}
                  >
                    {savingSettings ? 'Saving...' : 'Add Category'}
                  </Button>
                </Box>
              </Box>

              {/* Category Pills */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {Object.keys(settings.technologies || {}).map((cat) => (
                  <Chip
                    key={cat}
                    label={`${cat.toUpperCase()} (${(settings.technologies[cat] || []).length})`}
                    onClick={() => setActiveSkillCategory(cat)}
                    color={activeSkillCategory === cat ? 'primary' : 'default'}
                    variant={activeSkillCategory === cat ? 'filled' : 'outlined'}
                    onDelete={
                      Object.keys(settings.technologies || {}).length > 1
                        ? () => {
                            if (!window.confirm(`Delete entire "${cat}" category and its skills?`)) return;
                            const updated = { ...settings.technologies };
                            delete updated[cat];
                            setSettings({ ...settings, technologies: updated });
                            setActiveSkillCategory(Object.keys(updated)[0] || 'frontend');
                          }
                        : undefined
                    }
                    sx={{ fontWeight: 700 }}
                  />
                ))}
              </Box>

              {/* Skill Items in Active Category */}
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'var(--accent-dark, #16a34a)' }}>
                Skills in "{activeSkillCategory.toUpperCase()}" Category
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 2, mb: 3 }}>
                {((settings.technologies || {})[activeSkillCategory] || []).map((skill, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const updatedCat = settings.technologies[activeSkillCategory].filter((_, i) => i !== idx);
                        const updated = { ...settings, technologies: { ...settings.technologies, [activeSkillCategory]: updatedCat } };
                        setSettings(updated);
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="Icon/Emoji"
                        value={skill.icon}
                        sx={{ width: 90 }}
                        onChange={(e) => {
                          const updatedCat = [...settings.technologies[activeSkillCategory]];
                          updatedCat[idx] = { ...updatedCat[idx], icon: e.target.value };
                          setSettings({ ...settings, technologies: { ...settings.technologies, [activeSkillCategory]: updatedCat } });
                        }}
                      />
                      <TextField
                        size="small"
                        label="Skill Name"
                        value={skill.name}
                        fullWidth
                        onChange={(e) => {
                          const updatedCat = [...settings.technologies[activeSkillCategory]];
                          updatedCat[idx] = { ...updatedCat[idx], name: e.target.value };
                          setSettings({ ...settings, technologies: { ...settings.technologies, [activeSkillCategory]: updatedCat } });
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <TextField
                        size="small"
                        label="Exp"
                        value={skill.exp || '2+ yrs'}
                        sx={{ width: 90 }}
                        onChange={(e) => {
                          const updatedCat = [...settings.technologies[activeSkillCategory]];
                          updatedCat[idx] = { ...updatedCat[idx], exp: e.target.value };
                          setSettings({ ...settings, technologies: { ...settings.technologies, [activeSkillCategory]: updatedCat } });
                        }}
                      />
                    </Box>

                    <TextField
                      size="small"
                      label="Topics / Description"
                      value={skill.desc || ''}
                      fullWidth
                      placeholder="e.g. Hooks, Context, Virtual DOM"
                      onChange={(e) => {
                        const updatedCat = [...settings.technologies[activeSkillCategory]];
                        updatedCat[idx] = { ...updatedCat[idx], desc: e.target.value };
                        setSettings({ ...settings, technologies: { ...settings.technologies, [activeSkillCategory]: updatedCat } });
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Add New Skill to this category */}
              <Box sx={{ p: 2, bgcolor: 'rgba(34, 197, 94, 0.05)', borderRadius: 2, border: '1px dashed var(--accent-color, #22c55e)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  ➕ Add New Skill to "{activeSkillCategory.toUpperCase()}"
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1.5, mb: 2 }}>
                  <TextField
                    size="small"
                    label="Emoji/Icon"
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  />
                  <TextField
                    size="small"
                    label="Skill Name"
                    placeholder="e.g. GraphQL"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    required
                  />
                  <TextField
                    size="small"
                    label="Experience"
                    value={newSkill.exp}
                    onChange={(e) => setNewSkill({ ...newSkill, exp: e.target.value })}
                  />
                  <TextField
                    size="small"
                    label="Topics / Detail"
                    placeholder="e.g. Queries, Mutations, Apollo"
                    value={newSkill.desc}
                    onChange={(e) => setNewSkill({ ...newSkill, desc: e.target.value })}
                    sx={{ gridColumn: { sm: '1 / -1', md: 'auto' } }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                  onClick={() => {
                    if (!newSkill.name.trim()) {
                      showNotice('Skill name is required', 'error');
                      return;
                    }
                    const currentList = settings.technologies[activeSkillCategory] || [];
                    const updated = {
                      ...settings.technologies,
                      [activeSkillCategory]: [...currentList, newSkill],
                    };
                    setSettings({ ...settings, technologies: updated });
                    setNewSkill({ icon: '⚡', name: '', exp: '2+ yrs', desc: '' });
                    showNotice(`Added ${newSkill.name} to ${activeSkillCategory}!`);
                  }}
                >
                  Add Skill
                </Button>
              </Box>
            </Box>

            {/* Save Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save All Skills Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 4: PROJECTS MANAGEMENT */}
        {tab === 4 && (
          <Box className="admin-content">
            {/* Project Create / Edit Form */}
            <form className="admin-form" onSubmit={saveProject}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {editingProjectId ? '✏️ Edit Project' : '➕ Add New Project'}
              </Typography>
              <TextField
                label="Project ID (unique, e.g. devflow)"
                value={project.id || ''}
                onChange={(e) => setProject({ ...project, id: e.target.value })}
                required
                fullWidth
              />

              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <TextField
                  label="Project Title"
                  value={project.title || ''}
                  onChange={(e) => setProject({ ...project, title: e.target.value, imageAlt: e.target.value || project.imageAlt })}
                  required
                  fullWidth
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5, border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', background: 'rgba(248,250,252,0.7)' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary' }}>
                    Project Preview Image
                  </Typography>

                  {project.image ? (
                    <Box sx={{ width: '100%', maxWidth: 280, height: 150, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc' }}>
                      <img src={project.image} alt={project.imageAlt || project.title || 'Project preview'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', maxWidth: 280, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px dashed rgba(148,163,184,0.5)', color: 'text.secondary', background: '#fff', fontSize: 12 }}>
                      No image selected yet
                    </Box>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                    disabled={uploadingProjectImage}
                    style={{ fontSize: 12 }}
                  />

                  {uploadingProjectImage && (
                    <Typography variant="caption" color="text.secondary">
                      Uploading project image...
                    </Typography>
                  )}

                  <TextField
                    label="Or paste image URL"
                    value={project.image || ''}
                    onChange={(e) => setProject({ ...project, image: e.target.value, imageAlt: project.imageAlt || project.title || 'Project preview' })}
                    fullWidth
                    placeholder="https://example.com/project-cover.jpg"
                  />
                </Box>
              </Box>
              <TextField
                label="Subtitle / Short Pitch"
                value={project.subtitle || ''}
                onChange={(e) => setProject({ ...project, subtitle: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Category (e.g. Full Stack / Frontend / AI / Mobile)"
                value={project.category || ''}
                onChange={(e) => setProject({ ...project, category: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Tags (comma-separated, e.g. React, Node.js, Socket.io)"
                value={project.tags || ''}
                onChange={(e) => setProject({ ...project, tags: e.target.value })}
                fullWidth
              />
              <TextField
                label="Impact / Full Description"
                value={project.impact || ''}
                onChange={(e) => setProject({ ...project, impact: e.target.value })}
                multiline
                rows={3}
                required
                fullWidth
              />
              <TextField
                label="Live Website URL (e.g. https://myproject.com)"
                value={project.liveUrl || ''}
                onChange={(e) => setProject({ ...project, liveUrl: e.target.value })}
                fullWidth
              />
              <TextField
                label="Source Code GitHub URL (e.g. https://github.com/org/repo)"
                value={project.sourceUrl || ''}
                onChange={(e) => setProject({ ...project, sourceUrl: e.target.value })}
                fullWidth
              />
              <TextField
                select
                slotProps={{ select: { native: true } }}
                label="Interactive Preview Mode"
                value={project.type || 'gallery'}
                onChange={(e) => setProject({ ...project, type: e.target.value })}
                fullWidth
              >
                <option value="gallery">Gallery & Screenshots</option>
                <option value="dashboard">Dashboard Widget View</option>
                <option value="chat">Realtime Chat / AI View</option>
              </TextField>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={project.featured !== false}
                    onChange={(e) => setProject({ ...project, featured: e.target.checked })}
                  />
                }
                label="Publish on public projects page (Featured)"
              />

              <Stack direction="row" spacing={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={editingProjectId ? <SaveRoundedIcon /> : <AddRoundedIcon />}
                  sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                >
                  {editingProjectId ? 'Update Project' : 'Create Project'}
                </Button>
                {editingProjectId && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProject(emptyProject);
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Stack>
            </form>

            {/* Projects List */}
            <Box className="admin-list">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  All Projects ({data.projects.length})
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ width: 200 }}
                />
              </Box>

              {filteredProjects.map((item) => (
                <Box className="admin-row" key={item._id}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <strong>{item.title}</strong>
                      <Chip
                        size="small"
                        label={item.featured ? 'Featured' : 'Hidden'}
                        color={item.featured ? 'success' : 'default'}
                      />
                      <Chip size="small" label={item.category} variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {item.subtitle}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Tags: {(Array.isArray(item.tags) ? item.tags : []).join(', ') || 'None'}
                    </Typography>
                    {item.liveUrl && (
                      <Typography variant="caption" sx={{ color: 'var(--accent-dark, #16a34a)', display: 'block', wordBreak: 'break-all' }}>
                        🌐 {item.liveUrl}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditingProjectId(item._id);
                        setProject({
                          ...emptyProject,
                          ...item,
                          tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      title="Edit project"
                    >
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteProject(item._id)}
                      title="Delete project"
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* TAB 5: EXPERIENCE & CAREER JOURNEY */}
        {tab === 5 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Experience & Career Journey Editor</Typography>
              <Typography color="text.secondary">
                Customize journey milestones, years, titles, details, and milestone node icons on the Experience page.
              </Typography>
            </Box>

            {/* Experience Headings */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🏷️ Experience Section Headings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.experienceKicker || ''}
                  onChange={(e) => setSettings({ ...settings, experienceKicker: e.target.value })}
                  placeholder="// MY JOURNEY"
                />
                <TextField
                  label="Main Title"
                  value={settings.experienceTitle || ''}
                  onChange={(e) => setSettings({ ...settings, experienceTitle: e.target.value })}
                />
                <TextField
                  label="Experience Description"
                  value={settings.experienceDescription || ''}
                  onChange={(e) => setSettings({ ...settings, experienceDescription: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* Journey Milestone Items */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🚀 Career Journey Steps
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Milestones rendered along the dynamic timeline.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.experienceJourney || []).map((step, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const updated = settings.experienceJourney.filter((_, i) => i !== idx);
                        setSettings({ ...settings, experienceJourney: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <TextField
                      label="Year"
                      size="small"
                      value={step.year}
                      sx={{ width: 110 }}
                      onChange={(e) => {
                        const updated = [...settings.experienceJourney];
                        updated[idx] = { ...updated[idx], year: e.target.value };
                        setSettings({ ...settings, experienceJourney: updated });
                      }}
                    />

                    <TextField
                      label="Role / Title"
                      size="small"
                      value={step.title}
                      sx={{ width: 220 }}
                      onChange={(e) => {
                        const updated = [...settings.experienceJourney];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setSettings({ ...settings, experienceJourney: updated });
                      }}
                    />

                    <TextField
                      select
                      slotProps={{ select: { native: true } }}
                      label="Milestone Icon"
                      size="small"
                      value={step.icon || 'code'}
                      sx={{ width: 140 }}
                      onChange={(e) => {
                        const updated = [...settings.experienceJourney];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setSettings({ ...settings, experienceJourney: updated });
                      }}
                    >
                      {journeyIcons.map((ico) => (
                        <option key={ico.value} value={ico.value}>
                          {ico.label}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      label="Milestone Detail Description"
                      size="small"
                      value={step.detail}
                      fullWidth
                      multiline
                      rows={2}
                      onChange={(e) => {
                        const updated = [...settings.experienceJourney];
                        updated[idx] = { ...updated[idx], detail: e.target.value };
                        setSettings({ ...settings, experienceJourney: updated });
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSettings({
                    ...settings,
                    experienceJourney: [
                      ...(settings.experienceJourney || []),
                      { year: '2025', title: 'Next Chapter', detail: 'Architecting scalable distributed web apps', icon: 'rocket' },
                    ],
                  });
                }}
              >
                Add Journey Milestone
              </Button>
            </Box>

            {/* Professional Work Experience History */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                💼 Professional Work Experience Entries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Full job positions with role, company, location, date range, bullet points, and tech tags.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.workExperience || [
                  {
                    role: 'Senior Full Stack Engineer (Contract)',
                    company: 'Apex Digital Labs',
                    location: 'Remote · San Francisco',
                    period: '2023 - Present',
                    bullets: [
                      'Architected and delivered high-throughput real-time collaboration dashboards using React 19, Socket.io, and Redis pub/sub.',
                      'Reduced average API response latencies by 42% through query index restructuring and Redis caching layers.',
                    ],
                    tags: ['React', 'Node.js', 'Redis', 'Docker', 'AWS ECS', 'TypeScript'],
                  },
                ]).map((job, jIdx) => (
                  <Box
                    key={jIdx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const current = settings.workExperience || [];
                        const updated = current.filter((_, i) => i !== jIdx);
                        setSettings({ ...settings, workExperience: updated });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        label="Role / Position"
                        size="small"
                        value={job.role || ''}
                        onChange={(e) => {
                          const current = [...(settings.workExperience || [])];
                          current[jIdx] = { ...current[jIdx], role: e.target.value };
                          setSettings({ ...settings, workExperience: current });
                        }}
                      />
                      <TextField
                        label="Company Name"
                        size="small"
                        value={job.company || ''}
                        onChange={(e) => {
                          const current = [...(settings.workExperience || [])];
                          current[jIdx] = { ...current[jIdx], company: e.target.value };
                          setSettings({ ...settings, workExperience: current });
                        }}
                      />
                      <TextField
                        label="Location"
                        size="small"
                        value={job.location || ''}
                        onChange={(e) => {
                          const current = [...(settings.workExperience || [])];
                          current[jIdx] = { ...current[jIdx], location: e.target.value };
                          setSettings({ ...settings, workExperience: current });
                        }}
                      />
                      <TextField
                        label="Period / Dates"
                        size="small"
                        value={job.period || ''}
                        onChange={(e) => {
                          const current = [...(settings.workExperience || [])];
                          current[jIdx] = { ...current[jIdx], period: e.target.value };
                          setSettings({ ...settings, workExperience: current });
                        }}
                      />
                    </Box>

                    <TextField
                      label="Bullet Points (One bullet per line)"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={Array.isArray(job.bullets) ? job.bullets.join('\n') : (job.bullets || '')}
                      onChange={(e) => {
                        const current = [...(settings.workExperience || [])];
                        current[jIdx] = {
                          ...current[jIdx],
                          bullets: e.target.value.split('\n').filter(Boolean),
                        };
                        setSettings({ ...settings, workExperience: current });
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <TextField
                      label="Tech Stack Tags (Comma-separated)"
                      size="small"
                      fullWidth
                      value={Array.isArray(job.tags) ? job.tags.join(', ') : (job.tags || '')}
                      onChange={(e) => {
                        const current = [...(settings.workExperience || [])];
                        current[jIdx] = {
                          ...current[jIdx],
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        };
                        setSettings({ ...settings, workExperience: current });
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.workExperience || [];
                  setSettings({
                    ...settings,
                    workExperience: [
                      ...current,
                      {
                        role: 'Software Engineer',
                        company: 'Innovate Tech',
                        location: 'Remote',
                        period: '2024 - Present',
                        bullets: ['Engineered scalable microservices and user interfaces.'],
                        tags: ['React', 'Node.js', 'TypeScript'],
                      },
                    ],
                  });
                }}
              >
                Add Work Experience Entry
              </Button>
            </Box>

            {/* Academic Education Entries */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                🎓 Academic Education Entries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Degrees, universities, dates, GPAs, and core coursework.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.education || [
                  {
                    degree: 'Bachelor of Technology in Computer Science & Engineering',
                    institution: 'University Institute of Technology',
                    period: '2019 - 2023',
                    grade: 'GPA: 8.8 / 10.0',
                    courses: 'Data Structures, Distributed Systems, Database Systems, Computer Networks.',
                  },
                ]).map((edu, eIdx) => (
                  <Box
                    key={eIdx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const current = settings.education || [];
                        setSettings({ ...settings, education: current.filter((_, i) => i !== eIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        label="Degree / Certificate"
                        size="small"
                        value={edu.degree || ''}
                        onChange={(e) => {
                          const current = [...(settings.education || [])];
                          current[eIdx] = { ...current[eIdx], degree: e.target.value };
                          setSettings({ ...settings, education: current });
                        }}
                      />
                      <TextField
                        label="Institution / University"
                        size="small"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const current = [...(settings.education || [])];
                          current[eIdx] = { ...current[eIdx], institution: e.target.value };
                          setSettings({ ...settings, education: current });
                        }}
                      />
                      <TextField
                        label="Years Period"
                        size="small"
                        value={edu.period || ''}
                        onChange={(e) => {
                          const current = [...(settings.education || [])];
                          current[eIdx] = { ...current[eIdx], period: e.target.value };
                          setSettings({ ...settings, education: current });
                        }}
                      />
                      <TextField
                        label="Grade / Score"
                        size="small"
                        value={edu.grade || ''}
                        onChange={(e) => {
                          const current = [...(settings.education || [])];
                          current[eIdx] = { ...current[eIdx], grade: e.target.value };
                          setSettings({ ...settings, education: current });
                        }}
                      />
                    </Box>

                    <TextField
                      label="Key Coursework & Focus"
                      size="small"
                      fullWidth
                      value={edu.courses || ''}
                      onChange={(e) => {
                        const current = [...(settings.education || [])];
                        current[eIdx] = { ...current[eIdx], courses: e.target.value };
                        setSettings({ ...settings, education: current });
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.education || [];
                  setSettings({
                    ...settings,
                    education: [
                      ...current,
                      {
                        degree: 'Master of Science / Specialized Course',
                        institution: 'Tech Academy',
                        period: '2023 - 2024',
                        grade: 'Distinction',
                        courses: 'Advanced Cloud Architecture, System Design',
                      },
                    ],
                  });
                }}
              >
                Add Education Entry
              </Button>
            </Box>

            {/* Save Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save All Experience & Education Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 6: SERVICES & PRICING MANAGER */}
        {tab === 6 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Services &amp; Offerings Manager</Typography>
              <Typography color="text.secondary">
                Configure your service offerings, feature checklists, pricing tiers, and delivery turnaround times.
              </Typography>
            </Box>

            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🛠️ Services Page Headings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.servicesKicker || '// WHAT I OFFER'}
                  onChange={(e) => setSettings({ ...settings, servicesKicker: e.target.value })}
                />
                <TextField
                  label="Main Title"
                  value={settings.servicesTitle || 'Services Built for Real Results.'}
                  onChange={(e) => setSettings({ ...settings, servicesTitle: e.target.value })}
                />
                <TextField
                  label="Subtitle Description"
                  value={settings.servicesSub || ''}
                  onChange={(e) => setSettings({ ...settings, servicesSub: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* Service Cards List */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                💼 Service Offerings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Each service is rendered with pricing, feature checklist, and CTA.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.services || [
                  {
                    id: 'fullstack',
                    icon: 'globe',
                    title: 'Full Stack Web Applications',
                    description: 'End-to-end production-ready applications with React, Node.js, and cloud databases.',
                    features: ['Custom Responsive UI with React', 'Scalable REST & GraphQL APIs', 'Database Architecture'],
                    price: '$800+',
                    timeline: '2 - 4 weeks',
                    badge: 'Most Popular',
                    highlight: true,
                  },
                ]).map((srv, sIdx) => (
                  <Box
                    key={sIdx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const current = settings.services || [];
                        setSettings({ ...settings, services: current.filter((_, i) => i !== sIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        label="Service Title"
                        size="small"
                        value={srv.title || ''}
                        onChange={(e) => {
                          const current = [...(settings.services || [])];
                          current[sIdx] = { ...current[sIdx], title: e.target.value };
                          setSettings({ ...settings, services: current });
                        }}
                      />
                      <TextField
                        select
                        slotProps={{ select: { native: true } }}
                        label="Icon"
                        size="small"
                        value={srv.icon || 'globe'}
                        onChange={(e) => {
                          const current = [...(settings.services || [])];
                          current[sIdx] = { ...current[sIdx], icon: e.target.value };
                          setSettings({ ...settings, services: current });
                        }}
                      >
                        <option value="globe">🌐 Globe (Web)</option>
                        <option value="database">🗄️ Database (Backend)</option>
                        <option value="palette">🎨 Palette (UI/UX)</option>
                        <option value="zap">⚡ Zap (Performance)</option>
                        <option value="smartphone">📱 Smartphone (Mobile)</option>
                        <option value="code">💻 Code (Consulting)</option>
                      </TextField>
                      <TextField
                        label="Price Estimate"
                        size="small"
                        value={srv.price || ''}
                        onChange={(e) => {
                          const current = [...(settings.services || [])];
                          current[sIdx] = { ...current[sIdx], price: e.target.value };
                          setSettings({ ...settings, services: current });
                        }}
                      />
                      <TextField
                        label="Turnaround Timeline"
                        size="small"
                        value={srv.timeline || ''}
                        onChange={(e) => {
                          const current = [...(settings.services || [])];
                          current[sIdx] = { ...current[sIdx], timeline: e.target.value };
                          setSettings({ ...settings, services: current });
                        }}
                      />
                    </Box>

                    <TextField
                      label="Service Description"
                      size="small"
                      fullWidth
                      value={srv.description || ''}
                      onChange={(e) => {
                        const current = [...(settings.services || [])];
                        current[sIdx] = { ...current[sIdx], description: e.target.value };
                        setSettings({ ...settings, services: current });
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <TextField
                      label="Features List (One feature per line)"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={Array.isArray(srv.features) ? srv.features.join('\n') : (srv.features || '')}
                      onChange={(e) => {
                        const current = [...(settings.services || [])];
                        current[sIdx] = {
                          ...current[sIdx],
                          features: e.target.value.split('\n').filter(Boolean),
                        };
                        setSettings({ ...settings, services: current });
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Badge Tag (Optional, e.g. Most Popular)"
                        size="small"
                        value={srv.badge || ''}
                        onChange={(e) => {
                          const current = [...(settings.services || [])];
                          current[sIdx] = { ...current[sIdx], badge: e.target.value };
                          setSettings({ ...settings, services: current });
                        }}
                        sx={{ width: 220 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(srv.highlight)}
                            onChange={(e) => {
                              const current = [...(settings.services || [])];
                              current[sIdx] = { ...current[sIdx], highlight: e.target.checked };
                              setSettings({ ...settings, services: current });
                            }}
                          />
                        }
                        label="Highlight card with accent background"
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.services || [];
                  setSettings({
                    ...settings,
                    services: [
                      ...current,
                      {
                        id: `srv-${Date.now()}`,
                        icon: 'code',
                        title: 'New Service Offering',
                        description: 'High-impact technical solution tailored to your product needs.',
                        features: ['Custom Architecture', 'Production Code', 'Automated Testing'],
                        price: '$500+',
                        timeline: '1 - 2 weeks',
                        badge: null,
                        highlight: false,
                      },
                    ],
                  });
                }}
              >
                Add Service Offering
              </Button>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save Services Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 7: BLOG & ARTICLES MANAGER */}
        {false && tab === 7 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Blog &amp; Articles Management</Typography>
              <Typography color="text.secondary">
                Publish technical writeups, architecture notes, and software engineering deep-dives.
              </Typography>
            </Box>

            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📝 Blog Page Headings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.blogKicker || '// ARTICLES & INSIGHTS'}
                  onChange={(e) => setSettings({ ...settings, blogKicker: e.target.value })}
                />
                <TextField
                  label="Main Title"
                  value={settings.blogTitle || 'Thoughts on Code, Design & Craft.'}
                  onChange={(e) => setSettings({ ...settings, blogTitle: e.target.value })}
                />
                <TextField
                  label="Subtitle Description"
                  value={settings.blogSub || ''}
                  onChange={(e) => setSettings({ ...settings, blogSub: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            </Box>

            {/* Articles List */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                📚 Published Articles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add and manage article titles, excerpts, tags, read times, and featured cards.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.blogPosts || [
                  {
                    id: '1',
                    title: 'Architecting Scalable Microservices with Node.js & Docker',
                    excerpt: 'A deep dive into decoupled systems, message queues, and high-throughput containerization.',
                    date: 'Aug 24, 2026',
                    readTime: '6 min read',
                    tag: 'Architecture',
                    category: 'Architecture',
                    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
                    featured: true,
                  },
                ]).map((post, pIdx) => (
                  <Box
                    key={pIdx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const current = settings.blogPosts || [];
                        setSettings({ ...settings, blogPosts: current.filter((_, i) => i !== pIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        label="Article Title"
                        size="small"
                        value={post.title || ''}
                        onChange={(e) => {
                          const current = [...(settings.blogPosts || [])];
                          current[pIdx] = { ...current[pIdx], title: e.target.value };
                          setSettings({ ...settings, blogPosts: current });
                        }}
                      />
                      <TextField
                        label="Category / Tag"
                        size="small"
                        value={post.tag || ''}
                        onChange={(e) => {
                          const current = [...(settings.blogPosts || [])];
                          current[pIdx] = { ...current[pIdx], tag: e.target.value, category: e.target.value };
                          setSettings({ ...settings, blogPosts: current });
                        }}
                      />
                      <TextField
                        label="Publish Date"
                        size="small"
                        value={post.date || ''}
                        onChange={(e) => {
                          const current = [...(settings.blogPosts || [])];
                          current[pIdx] = { ...current[pIdx], date: e.target.value };
                          setSettings({ ...settings, blogPosts: current });
                        }}
                      />
                      <TextField
                        label="Read Time"
                        size="small"
                        value={post.readTime || ''}
                        onChange={(e) => {
                          const current = [...(settings.blogPosts || [])];
                          current[pIdx] = { ...current[pIdx], readTime: e.target.value };
                          setSettings({ ...settings, blogPosts: current });
                        }}
                      />
                    </Box>

                    <TextField
                      label="Article Summary Excerpt"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={post.excerpt || ''}
                      onChange={(e) => {
                        const current = [...(settings.blogPosts || [])];
                        current[pIdx] = { ...current[pIdx], excerpt: e.target.value };
                        setSettings({ ...settings, blogPosts: current });
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        label="Cover Image URL"
                        size="small"
                        value={post.image || ''}
                        onChange={(e) => {
                          const current = [...(settings.blogPosts || [])];
                          current[pIdx] = { ...current[pIdx], image: e.target.value };
                          setSettings({ ...settings, blogPosts: current });
                        }}
                        sx={{ flex: 1, minWidth: 'min(100%, 260px)' }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(post.featured)}
                            onChange={(e) => {
                              const current = [...(settings.blogPosts || [])];
                              current[pIdx] = { ...current[pIdx], featured: e.target.checked };
                              setSettings({ ...settings, blogPosts: current });
                            }}
                          />
                        }
                        label="Pin as Featured Hero Post"
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.blogPosts || [];
                  setSettings({
                    ...settings,
                    blogPosts: [
                      ...current,
                      {
                        id: `post-${Date.now()}`,
                        title: 'New Technical Insight Article',
                        excerpt: 'Exploring patterns and performance in modern fullstack web systems.',
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        readTime: '5 min read',
                        tag: 'React',
                        category: 'React',
                        image: 'https://images.unsplash.com/photo-1516116211227-bbc13c733383?w=800&auto=format&fit=crop&q=80',
                        featured: false,
                      },
                    ],
                  });
                }}
              >
                Add Article Entry
              </Button>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save Blog Changes'}
            </Button>
          </Box>
        )}

        {/* Removed: Now Page & Current Focus */}
        {false && tab === 8 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Now Page &amp; Current Focus Manager</Typography>
              <Typography color="text.secondary">
                Keep the public informed on what you are currently building, active skill deep dives, and media radar.
              </Typography>
            </Box>

            {/* Rates & Status */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ⏱️ Current Status &amp; Pricing
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                <TextField
                  label="Hourly Rate Display (e.g. $65 - $95)"
                  value={settings.nowRate || '$65 - $95'}
                  onChange={(e) => setSettings({ ...settings, nowRate: e.target.value })}
                />
                <TextField
                  label="Now Availability Subtitle"
                  value={settings.nowStatusText || 'Available for contract roles, high-impact MVPs, and consulting.'}
                  onChange={(e) => setSettings({ ...settings, nowStatusText: e.target.value })}
                />
              </Box>
            </Box>

            {/* Currently Building Projects */}
            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                ⚡ Projects Under Active Development
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Rendered with progress percentages and status chips on the /now page.
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(settings.nowProjects || [
                  {
                    id: '1',
                    title: 'Enterprise AI Agent Orchestrator',
                    description: 'Building autonomous multi-agent systems with streaming LLM tool calling.',
                    tags: ['React 19', 'Node.js', 'LangChain'],
                    progress: 75,
                    status: 'In Active Sprint',
                  },
                ]).map((proj, pIdx) => (
                  <Box
                    key={pIdx}
                    sx={{
                      p: 2.5,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        const current = settings.nowProjects || [];
                        setSettings({ ...settings, nowProjects: current.filter((_, i) => i !== pIdx) });
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        label="Project Title"
                        size="small"
                        value={proj.title || ''}
                        onChange={(e) => {
                          const current = [...(settings.nowProjects || [])];
                          current[pIdx] = { ...current[pIdx], title: e.target.value };
                          setSettings({ ...settings, nowProjects: current });
                        }}
                      />
                      <TextField
                        label="Sprint Status Label"
                        size="small"
                        value={proj.status || ''}
                        onChange={(e) => {
                          const current = [...(settings.nowProjects || [])];
                          current[pIdx] = { ...current[pIdx], status: e.target.value };
                          setSettings({ ...settings, nowProjects: current });
                        }}
                      />
                      <TextField
                        label="Progress (%)"
                        type="number"
                        size="small"
                        value={proj.progress || 0}
                        onChange={(e) => {
                          const current = [...(settings.nowProjects || [])];
                          current[pIdx] = { ...current[pIdx], progress: parseInt(e.target.value, 10) || 0 };
                          setSettings({ ...settings, nowProjects: current });
                        }}
                      />
                    </Box>

                    <TextField
                      label="Description"
                      size="small"
                      fullWidth
                      value={proj.description || ''}
                      onChange={(e) => {
                        const current = [...(settings.nowProjects || [])];
                        current[pIdx] = { ...current[pIdx], description: e.target.value };
                        setSettings({ ...settings, nowProjects: current });
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <TextField
                      label="Tags (Comma-separated)"
                      size="small"
                      fullWidth
                      value={Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || '')}
                      onChange={(e) => {
                        const current = [...(settings.nowProjects || [])];
                        current[pIdx] = {
                          ...current[pIdx],
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        };
                        setSettings({ ...settings, nowProjects: current });
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  const current = settings.nowProjects || [];
                  setSettings({
                    ...settings,
                    nowProjects: [
                      ...current,
                      {
                        id: `now-${Date.now()}`,
                        title: 'New Active Project',
                        description: 'Building modern scalable web feature architecture.',
                        tags: ['React', 'Next.js', 'Node.js'],
                        progress: 50,
                        status: 'In Progress',
                      },
                    ],
                  });
                }}
              >
                Add Active Project
              </Button>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              onClick={() => saveAllSettings()}
              disabled={savingSettings}
              sx={{ bgcolor: 'var(--accent-color, #22c55e)', py: 1.5, px: 4, fontWeight: 700 }}
            >
              {savingSettings ? 'Saving...' : 'Save Now Page Changes'}
            </Button>
          </Box>
        )}

        {/* TAB 7: CONTACT DETAILS, FAQ & MESSAGES INBOX */}
        {tab === 7 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Contact Settings, FAQ &amp; Messages Inbox</Typography>
              <Typography color="text.secondary">
                Configure your public email, phone, location, FAQ accordion questions, and manage client inquiries.
              </Typography>
            </Box>

            {/* Contact Page Copy & Info */}
            <Box className="admin-card" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📫 Public Contact Details &amp; Headings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, mb: 3 }}>
                <TextField
                  label="Eyebrow Kicker"
                  value={settings.contactKicker || ''}
                  onChange={(e) => setSettings({ ...settings, contactKicker: e.target.value })}
                  placeholder="// GET IN TOUCH"
                />
                <TextField
                  label="Main Heading"
                  value={settings.contactHeading || ''}
                  onChange={(e) => setSettings({ ...settings, contactHeading: e.target.value })}
                />
                <TextField
                  label="Public Email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
                <TextField
                  label="Public Phone"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
                <TextField
                  label="Office Location"
                  value={settings.location || ''}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  sx={{ gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Contact Intro Subtitle"
                  value={settings.contactIntro || ''}
                  onChange={(e) => setSettings({ ...settings, contactIntro: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                onClick={() => saveAllSettings()}
                disabled={savingSettings}
                sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
              >
                {savingSettings ? 'Saving...' : 'Save Contact Details'}
              </Button>
            </Box>

            {/* Push Notifications Live Status Banner */}
            <Box className="admin-card" sx={{ mb: 4, bgcolor: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <NotificationsActiveRoundedIcon sx={{ color: 'var(--accent-color, #22c55e)' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      Device Push Notifications: {notificationPermission === 'granted' ? '🟢 Active & Connected' : notificationPermission === 'denied' ? '🔴 Blocked in Browser' : '🟡 Action Required'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Real-time alerts will pop up in your device’s notification bar (Mobile / Desktop) whenever someone sends a contact message or schedules an instant meeting call.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {notificationPermission !== 'granted' && (
                    <Button
                      variant="contained"
                      startIcon={<NotificationsActiveRoundedIcon />}
                      onClick={enableNotifications}
                      sx={{ bgcolor: 'var(--accent-color, #22c55e)', fontWeight: 700 }}
                    >
                      Enable Device Notifications
                    </Button>
                  )}
                  {notificationPermission === 'granted' && (
                    <Button
                      variant="outlined"
                      startIcon={<NotificationsActiveRoundedIcon />}
                      onClick={sendTestNotification}
                      sx={{ borderColor: 'var(--accent-color, #22c55e)', color: 'var(--accent-dark, #16a34a)', fontWeight: 700 }}
                    >
                      Test Device Push Alert
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Inbox Messages */}
            <Box className="admin-card" sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  💬 Client Messages &amp; Scheduled Meetings ({data.messages.length})
                </Typography>
                <Chip
                  label={`${data.messages.filter((m) => m.status === 'new').length} New Unread`}
                  color={data.messages.filter((m) => m.status === 'new').length > 0 ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              {data.messages.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No messages or scheduled meetings in your inbox yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data.messages.map((msg) => {
                    const isMeeting = Boolean(msg.subject && (msg.subject.includes('📅') || /meeting|scheduled call/i.test(msg.subject)));
                    return (
                      <Box
                        key={msg._id}
                        sx={{
                          p: 2.5,
                          border: '1.5px solid',
                          borderColor: isMeeting
                            ? 'var(--accent-color, #22c55e)'
                            : msg.status === 'new'
                            ? 'rgba(59, 130, 246, 0.4)'
                            : 'rgba(148, 163, 184, 0.2)',
                          borderRadius: 2,
                          bgcolor: isMeeting
                            ? 'rgba(34, 197, 94, 0.04)'
                            : msg.status === 'new'
                            ? 'rgba(59, 130, 246, 0.02)'
                            : '#fff',
                          boxShadow: isMeeting ? '0 4px 14px rgba(34, 197, 94, 0.1)' : 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {msg.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ({msg.email})
                              </Typography>
                              {isMeeting && (
                                <Chip
                                  size="small"
                                  label="📅 Scheduled Call"
                                  sx={{
                                    bgcolor: 'var(--accent-soft, #dcfce7)',
                                    color: 'var(--accent-dark, #16a34a)',
                                    fontWeight: 800,
                                    fontSize: 11,
                                  }}
                                />
                              )}
                            </Box>
                            {msg.phone && (
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3, fontWeight: 600 }}>
                                📞 Phone / WhatsApp: {msg.phone}
                              </Typography>
                            )}
                            {msg.subject && (
                              <Typography variant="body2" sx={{ color: isMeeting ? 'var(--accent-dark, #16a34a)' : 'primary.main', fontWeight: 700, mt: 0.5 }}>
                                Subject: {msg.subject}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              size="small"
                              label={msg.status}
                              color={msg.status === 'new' ? 'primary' : 'default'}
                            />
                            <IconButton size="small" color="error" onClick={() => deleteMessage(msg._id)} title="Delete message">
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{ my: 1.5, whiteSpace: 'pre-wrap', bgcolor: 'rgba(241, 245, 249, 0.5)', p: 1.5, borderRadius: 1.5, border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                          {msg.message}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Received: {new Date(msg.createdAt).toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {msg.status === 'new' && (
                              <Button size="small" variant="outlined" onClick={() => updateMessageStatus(msg, 'read')}>
                                Mark Read
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="contained"
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                              sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                            >
                              Reply via Email
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        )}

        {/* TAB 8: CLIENT REVIEWS & TESTIMONIALS */}
        {tab === 8 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Client Testimonials &amp; Reviews Moderation</Typography>
              <Typography color="text.secondary">
                Approve, reject, edit, or add verified reviews displayed on the website.
              </Typography>
            </Box>

            <Box className="admin-card" sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ⭐ All Testimonials ({data.reviews.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    setEditingReviewId(null);
                    setNewReview(emptyReview);
                    setReviewModalOpen(true);
                  }}
                  sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
                >
                  Add Testimonial
                </Button>
              </Box>

              {data.reviews.map((review) => (
                <Box className="admin-row" key={review._id}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <strong>{review.name}</strong>
                      <span style={{ color: '#64748b', fontSize: 13 }}>· {review.role}</span>
                      <Chip
                        size="small"
                        label={review.approved ? 'Published' : 'Hidden'}
                        color={review.approved ? 'success' : 'default'}
                      />
                      <Box sx={{ display: 'flex', color: '#f59e0b', alignItems: 'center' }}>
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <StarRoundedIcon key={i} sx={{ fontSize: 16 }} />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                      &ldquo;{review.text}&rdquo;
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Date: {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color={review.approved ? 'inherit' : 'success'}
                      onClick={() => toggleReviewApproval(review)}
                    >
                      {review.approved ? 'Hide' : 'Publish'}
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditingReviewId(review._id);
                        setNewReview(review);
                        setReviewModalOpen(true);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteReview(review._id)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Review Dialog */}
            <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} maxWidth="sm" fullWidth>
              <form onSubmit={saveReview}>
                <DialogTitle>{editingReviewId ? 'Edit Review' : 'Add Testimonial'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    label="Client Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Client Role / Company"
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    placeholder="e.g. CTO @ TechCorp"
                    fullWidth
                  />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Star Rating (1 - 5)</Typography>
                    <Slider
                      value={newReview.rating || 5}
                      min={1}
                      max={5}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      onChange={(_, val) => setNewReview({ ...newReview, rating: val })}
                      sx={{ color: '#f59e0b' }}
                    />
                  </Box>
                  <TextField
                    label="Testimonial Feedback"
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    required
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newReview.approved !== false}
                        onChange={(e) => setNewReview({ ...newReview, approved: e.target.checked })}
                      />
                    }
                    label="Publish on website immediately"
                  />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setReviewModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}>
                    {editingReviewId ? 'Update Review' : 'Save Testimonial'}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )}

        {/* TAB 9: THEME, APPEARANCE & BACKUP */}
        {tab === 9 && (
          <Box className="admin-wide">
            <Box className="admin-section-header">
              <Typography variant="h5">Site Theme, Brand &amp; Backup</Typography>
              <Typography color="text.secondary">
                Configure brand mark initial, default theme palette, and export your portfolio configuration JSON.
              </Typography>
            </Box>

            <Box className="admin-card" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🎨 Brand Mark &amp; Accent Theme
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, mb: 2 }}>
                <TextField
                  label="Brand Mark Initial (e.g. Y, S, A)"
                  value={settings.brandLogo || 'Y'}
                  onChange={(e) => setSettings({ ...settings, brandLogo: e.target.value })}
                  inputProps={{ maxLength: 3 }}
                />
                <TextField
                  select
                  slotProps={{ select: { native: true } }}
                  label="Default Accent Theme"
                  value={settings.themeColor || 'emerald'}
                  onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                >
                  <option value="emerald">🟢 Emerald Green</option>
                  <option value="cyan">🔵 Cyber Cyan</option>
                  <option value="violet">🟣 Electric Violet</option>
                  <option value="amber">🟠 Sunset Amber</option>
                  <option value="rose">🔴 Crimson Rose</option>
                </TextField>
              </Box>

              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                onClick={() => saveAllSettings()}
                disabled={savingSettings}
                sx={{ bgcolor: 'var(--accent-color, #22c55e)' }}
              >
                {savingSettings ? 'Saving...' : 'Save Appearance Settings'}
              </Button>
            </Box>

            {/* Export / Backup Settings JSON */}
            <Box className="admin-card">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                💾 Configuration Backup &amp; JSON Export
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can copy or inspect your entire site settings configuration below.
              </Typography>
              <TextField
                label="Site Settings JSON (Read-Only Preview)"
                value={JSON.stringify(settings, null, 2)}
                multiline
                rows={10}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
                sx={{ fontFamily: 'monospace' }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
