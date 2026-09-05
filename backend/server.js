require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/db');
const reviewsRouter = require('./routes/reviews');
const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');
const adminRouter = require('./routes/admin');
const settingsRouter = require('./routes/settings');
const uploadsRouter = require('./routes/uploads');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '256kb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '256kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false, skip: (req) => req.path === '/settings' || req.path === '/admin/settings' }));
app.get('/api/health', (req, res) => res.json({ success: true, service: 'portfolio-api', database: 'connected' }));
app.use('/api/reviews', reviewsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/admin', adminRouter);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDatabase();
  app.listen(port, () => console.log(`Portfolio API running on http://localhost:${port}`));
}

if (require.main === module) start().catch((error) => { console.error(`Server startup failed: ${error.message}`); process.exit(1); });

module.exports = app;
