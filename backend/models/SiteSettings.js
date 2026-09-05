const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    name: { type: String, default: 'John Doe', trim: true },
    role: { type: String, default: 'Full Stack Developer', trim: true },
    email: { type: String, default: 'johndoe@example.com', trim: true },
    phone: { type: String, default: '+1 (123) 456-7890', trim: true },
    location: { type: String, default: 'San Francisco, CA', trim: true },
    tagline: { type: String, default: 'Problem Solver | Tech Enthusiast', trim: true },
    description: { type: String, default: 'I build scalable web applications with modern technologies and excellent user experiences.', trim: true },
    github: { type: String, default: 'https://github.com', trim: true },
    linkedin: { type: String, default: 'https://linkedin.com', trim: true },
    instagram: { type: String, default: 'https://instagram.com', trim: true },
    whatsapp: { type: String, default: 'https://wa.me/919999999999', trim: true },
    resumeUrl: { type: String, default: '', trim: true },
    available: { type: Boolean, default: true },
    availableText: { type: String, default: 'Available for select projects', trim: true },
    profileImage: { type: String, default: '' },
    brandLogo: { type: String, default: 'Y', trim: true },
    themeColor: { type: String, default: 'emerald', trim: true },

    // Home Section
    heroRoles: { type: [String], default: ['Full Stack Developer', 'Product Engineer', 'Creative Problem Solver'] },
    heroStats: { type: mongoose.Schema.Types.Mixed, default: [{ value: '20+', label: 'Projects shipped' }, { value: '3yr', label: 'Building digitally' }, { value: '24h', label: 'Typical reply' }] },
    heroTechStack: { type: [String], default: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Figma'] },

    // About Section
    aboutKicker: { type: String, default: '// ABOUT ME' },
    aboutTitle: { type: String, default: 'Building Digital Experiences That Solve Real Problems' },
    aboutDescription: { type: String, default: "I'm a passionate Full Stack Developer with 3+ years of experience building modern web applications and digital products." },
    aboutSecondDescription: { type: String, default: 'I love turning ideas into reality using clean code, beautiful design and the latest technologies.' },
    aboutStats: { type: mongoose.Schema.Types.Mixed, default: [{ value: '3', suffix: '+', label: 'Years Experience' }, { value: '20', suffix: '+', label: 'Projects Completed' }, { value: '10', suffix: '+', label: 'Technologies' }, { value: '5', suffix: '+', label: 'Happy Clients' }] },
    aboutTimeline: { type: mongoose.Schema.Types.Mixed, default: [] },
    values: { type: mongoose.Schema.Types.Mixed, default: [] },
    achievements: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Skills Section
    skillsKicker: { type: String, default: '// TECHNICAL EXPERTISE' },
    skillsTitle: { type: String, default: 'Technologies I Work With' },
    skillsDescription: { type: String, default: 'I work with a wide range of technologies to build scalable and efficient solutions.' },
    technologies: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Experience Section
    experienceKicker: { type: String, default: '// MY JOURNEY' },
    experienceTitle: { type: String, default: 'Learning. Building. Growing.' },
    experienceDescription: { type: String, default: 'My journey as a developer has been about constant learning, building amazing things and solving real world problems.' },
    experienceJourney: { type: mongoose.Schema.Types.Mixed, default: [] },
    workExperience: { type: mongoose.Schema.Types.Mixed, default: [] },
    education: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Services Section
    servicesKicker: { type: String, default: '// WHAT I OFFER' },
    servicesTitle: { type: String, default: 'Services & Technical Solutions' },
    servicesSub: { type: String, default: 'End-to-end development services tailored to product vision, scale, and deadlines.' },
    services: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Blog Section
    blogKicker: { type: String, default: '// WRITINGS & INSIGHTS' },
    blogTitle: { type: String, default: 'Articles, Architecture & Notes' },
    blogSub: { type: String, default: 'Deep dives on fullstack development, software design patterns, and engineering at scale.' },
    blogPosts: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Now Page Section
    nowStatusText: { type: String, default: 'Open for freelance contracts & full-time roles' },
    nowRate: { type: String, default: 'Available for immediate hire' },
    nowProjects: { type: mongoose.Schema.Types.Mixed, default: [] },
    nowLearning: { type: mongoose.Schema.Types.Mixed, default: [] },
    nowMedia: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Contact Section
    contactKicker: { type: String, default: '// GET IN TOUCH' },
    contactHeading: { type: String, default: "Let's Work Together On Something Amazing" },
    contactIntro: { type: String, default: 'Have a project in mind or just want to say hi? I would love to hear from you.' },
    contactDetails: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);