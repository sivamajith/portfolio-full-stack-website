const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const requestedPage = Number.parseInt(req.query.page, 10);
    const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 50, 1), 100);
    const page = Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1);
    const filter = { approved: true };
    const [reviews, summary] = await Promise.all([
      Review.find(filter)
        .select('name role rating text approved createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.aggregate([
        { $match: filter },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);
    const total = summary[0]?.count || 0;
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json({
      success: true,
      reviews,
      average: Number((summary[0]?.average || 0).toFixed(1)),
      count: total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, role, rating, text } = req.body;
    if (!name || !text || !rating) return res.status(400).json({ success: false, message: 'Name, rating and review are required' });
    const review = await Review.create({ name, role, rating: Number(rating), text });
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
