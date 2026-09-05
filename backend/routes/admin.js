const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const SiteSettings = require('../models/SiteSettings');
const DeviceToken = require('../models/DeviceToken');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const validPassword = process.env.ADMIN_PASSWORD_HASH && password
    ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    : false;
  if (!process.env.ADMIN_USERNAME || username !== process.env.ADMIN_USERNAME || !validPassword) {
    return res.status(401).json({ success: false, message: 'Invalid owner credentials' });
  }
  const token = jwt.sign({ username, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token, admin: { username, role: 'owner' } });
});

router.use(requireAdmin);

router.get('/overview', async (req, res, next) => {
  try {
    const [projects, reviews, messages, settings] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).lean(),
      Review.find().sort({ createdAt: -1 }).lean(),
      ContactMessage.find().sort({ createdAt: -1 }).lean(),
      SiteSettings.findOne({ key: 'main' }).lean(),
    ]);
    res.json({ success: true, projects, reviews, messages, settings: settings || await SiteSettings.create({ key: 'main' }) });
  } catch (error) { next(error); }
});

router.post('/projects', async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    if (!projectData.id && projectData.title) {
      projectData.id = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    }
    if (!projectData.desc && projectData.impact) {
      projectData.desc = projectData.impact;
    }
    res.status(201).json({ success: true, project: await Project.create(projectData) });
  } catch (error) { next(error); }
});
router.put('/projects/:id', async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.desc && updateData.impact) updateData.desc = updateData.impact;
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) { next(error); }
});
router.delete('/projects/:id', async (req, res, next) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (error) { next(error); }
});
router.post('/reviews', async (req, res, next) => {
  try { res.status(201).json({ success: true, review: await Review.create(req.body) }); } catch (error) { next(error); }
});
router.put('/reviews/:id', async (req, res, next) => {
  try { res.json({ success: true, review: await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) }); } catch (error) { next(error); }
});
router.delete('/reviews/:id', async (req, res, next) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (error) { next(error); }
});
router.post('/device-token', async (req, res, next) => {
  try {
    const { token, platform, userAgent } = req.body || {};
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'Device token is required' });
    }

    const savedToken = await DeviceToken.findOneAndUpdate(
      { token },
      { token, platform: platform || 'web', userAgent: userAgent || '', active: true },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, deviceToken: savedToken });
  } catch (error) { next(error); }
});

router.delete('/device-token', async (req, res, next) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ success: false, message: 'Device token is required' });

    const result = await DeviceToken.findOneAndUpdate({ token }, { active: false }, { new: true });
    res.json({ success: true, removed: Boolean(result) });
  } catch (error) { next(error); }
});

router.post('/test-notification', async (req, res, next) => {
  try {
    const { sendContactNotifications } = require('./contact');
    const dummyMessage = {
      _id: 'test-' + Date.now(),
      name: 'System Test',
      email: 'test@portfolio.local',
      subject: '🔔 Test Device Push Notification Alert!',
      message: 'This is a test notification confirming your device notification bar is connected and receiving real-time portfolio alerts.',
    };

    const activeTokens = await DeviceToken.find({ active: true }).countDocuments();
    if (sendContactNotifications) {
      await sendContactNotifications(dummyMessage);
    }
    res.json({ success: true, message: `Test push notification sent to ${activeTokens} registered device(s).`, activeTokens });
  } catch (error) { next(error); }
});

router.put('/messages/:id', async (req, res, next) => {
  try { res.json({ success: true, message: await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }) }); } catch (error) { next(error); }
});
router.delete('/messages/:id', async (req, res, next) => {
  try { await ContactMessage.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (error) { next(error); }
});
router.put('/settings', async (req, res, next) => {
  try {
    const { _id, key, createdAt, updatedAt, __v, ...settings } = req.body;
    ['heroRoles', 'heroTechStack'].forEach((field) => {
      if (field in settings) settings[field] = Array.isArray(settings[field])
        ? settings[field].filter((item) => typeof item === 'string')
        : [];
    });
    if ('whatsapp' in settings) settings.whatsapp = String(settings.whatsapp || '').trim();
    if ('resumeUrl' in settings) settings.resumeUrl = String(settings.resumeUrl || '').trim();
    res.json({
      success: true,
      settings: await SiteSettings.findOneAndUpdate(
        { key: 'main' },
        { ...settings, key: 'main' },
        { new: true, upsert: true, runValidators: true }
      ),
    });
  } catch (error) { next(error); }
});

module.exports = router;