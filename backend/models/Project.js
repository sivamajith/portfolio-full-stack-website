const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    type: { type: String, default: 'gallery' },
    category: { type: String, required: true, trim: true },
    impact: { type: String, default: '', trim: true },
    liveUrl: { type: String, trim: true, default: '' },
    sourceUrl: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    codeSnippet: { type: String, default: '' },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

projectSchema.pre('save', function (next) {
  if (!this.id && this.title) {
    this.id = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
  if (!this.desc && this.impact) {
    this.desc = this.impact;
  }
  next();
});

projectSchema.index({ featured: 1, createdAt: -1 });
projectSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
