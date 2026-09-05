const express = require('express');
const SiteSettings = require('../models/SiteSettings');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne({ key: 'main' }).lean();
    res.json({ success: true, settings: settings || await SiteSettings.create({ key: 'main' }) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
