const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const requestedPage = Number.parseInt(req.query.page, 10);
    const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 50, 1), 100);
    const page = Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1);
    if (req.query.featured === 'true') {
      filter.featured = true;
    } else if (req.query.featured === 'false') {
      filter.featured = false;
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = new RegExp(`^${req.query.category.trim()}$`, 'i');
    }
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json({ success: true, projects, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
