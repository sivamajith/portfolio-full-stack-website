require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const projects = [
  { id: 'ecommerce', title: 'E-Commerce', subtitle: 'Full Stack Application', tags: ['React_js', 'Shopify'], type: 'gallery', category: 'Frontend', impact: 'A conversion-focused storefront with a smooth shopping flow and flexible product discovery.' },
  { id: 'devflow', title: 'DevFlow', subtitle: 'Project Management Dashboard', tags: ['React', 'Node.js', 'MongoDB'], type: 'dashboard', category: 'Full Stack', impact: 'A focused workspace that turns complex team activity into a clear weekly rhythm.' },
  { id: 'chatapp', title: 'Chat App', subtitle: 'Real-time Messaging', tags: ['Socket.io', 'Node.js'], type: 'chat', category: 'Full Stack', impact: 'A real-time messaging experience designed around speed, presence, and human connection.' },
  { id: 'portfolio', title: 'Portfolio Site', subtitle: 'Personal Landing Page', tags: ['Next.js', 'Framer'], type: 'gallery', category: 'Frontend', impact: 'A high-signal personal brand system with expressive motion and a sharp editorial hierarchy.' },
  { id: 'weather', title: 'Weather App', subtitle: 'Realtime Forecast Widget', tags: ['React', 'API'], type: 'chat', category: 'Experiments', impact: 'A glanceable forecast widget that keeps useful weather information calm and accessible.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Seeded ${projects.length} projects`);
  await mongoose.disconnect();
}

seed().catch((error) => { console.error(error); process.exitCode = 1; });
