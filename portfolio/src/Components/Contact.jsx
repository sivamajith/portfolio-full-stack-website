import React, { useEffect, useState } from 'react';
import { Box, Button, Rating, TextField, Chip, Stack, Alert, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { PortfolioNavigation } from './Home';
import useSiteSettings from '../hooks/useSiteSettings';
import sounds from '../utils/SoundManager';

const contactDetails = [
  { icon: <MailOutlineRoundedIcon />, label: 'Email', value: 'johndoe@example.com' },
  { icon: <PhoneInTalkOutlinedIcon />, label: 'Phone', value: '+1 (123) 456-7890' },
  { icon: <LocationOnOutlinedIcon />, label: 'Location', value: 'San Francisco, CA' },
];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const fallbackReviews = [
  { name: 'Ananya R.', role: 'Startup Founder & CEO', rating: 5, verified: true, text: 'John transformed our wireframes into a production-grade product that our customers love using. Delivered on time with spotless code.' },
  { name: 'Marcus L.', role: 'Product Lead @ TechFlow', rating: 5, verified: true, text: 'Sharp communication, thoughtful engineering, and a real eye for microscopic UI details. Highly recommended for full-stack builds.' },
  { name: 'Priya S.', role: 'Creative Director', rating: 5, verified: true, text: 'A rare developer who understands both aesthetic product feel and rock-solid backend infrastructure.' },
  { name: 'David K.', role: 'Engineering Manager', rating: 4, verified: false, text: 'Great team player and solid React/Node developer. Solved our real-time synchronization bottlenecks quickly.' },
];

export default function Contact({ onNavigate, prefillSpec, onOpenResume }) {
  const settings = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  // Handle prefill spec from Project Estimator
  useEffect(() => {
    if (prefillSpec) {
      if (prefillSpec.service) {
        const service = prefillSpec.service;
        setSubject(`Service Inquiry: ${service.title}`);
        setMessage(
          `Hi John,\n\nI'm interested in your ${service.title} service.\n\n` +
          `Service description: ${service.description}\n` +
          `Included features:\n${(service.features || []).map((feature) => `• ${feature}`).join('\n')}\n\n` +
          `Estimated timeline: ${service.timeline}\n` +
          `Starting price: ${service.price}\n\n` +
          `Please share the next steps to get started.`
        );
      } else {
        setSubject(`Project Inquiry: ${prefillSpec.projectType} (${prefillSpec.estimatedCost})`);
        setMessage(
          `Hi John,\n\nI'm interested in starting a ${prefillSpec.projectType} project with the following requirements:\n` +
          `• Selected Add-ons: ${prefillSpec.features.join(', ') || 'Standard Core'}\n` +
          `• Pacing: ${prefillSpec.speed}\n` +
          `• Estimated Budget: ${prefillSpec.estimatedCost}\n` +
          `• Estimated Timeline: ${prefillSpec.estimatedTimeline}\n\nLet's discuss how we can kick this off!`
        );
      }
    }
  }, [prefillSpec]);

  // Review states
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchReview, setSearchReview] = useState('');
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('portfolio-reviews')) || fallbackReviews;
    } catch {
      return fallbackReviews;
    }
  });

  useEffect(() => {
    fetch(`${API_BASE}/reviews`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Reviews unavailable')))
      .then((data) => {
        if (data.reviews?.length) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    sounds.playClick();
    setSending(true);
    setSent(false);
    setSendError('');

    const formData = { name, email, phone, subject, message };
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Message sending failed');
      sounds.playSuccess();
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setSendError(error.message || 'Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    sounds.playSuccess();

    const newReview = {
      name: reviewName.trim(),
      role: reviewRole.trim() || 'Verified Client',
      rating: reviewRating,
      verified: true,
      text: reviewText.trim(),
    };

    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);
    window.localStorage.setItem('portfolio-reviews', JSON.stringify(nextReviews));

    try {
      fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      }).catch(() => {});
    } catch {}

    setReviewName('');
    setReviewRole('');
    setReviewText('');
    setReviewRating(5);
  };

  const savedDetails = settings
    ? [
        { icon: <MailOutlineRoundedIcon />, label: 'Email', value: settings.email || contactDetails[0].value },
        { icon: <PhoneInTalkOutlinedIcon />, label: 'Phone', value: settings.phone || contactDetails[1].value },
        { icon: <LocationOnOutlinedIcon />, label: 'Location', value: settings.location || contactDetails[2].value },
      ]
    : contactDetails;

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = ratingFilter === 'all' || (ratingFilter === '5' ? r.rating === 5 : r.rating >= 4);
    const matchesSearch = r.text.toLowerCase().includes(searchReview.toLowerCase()) || r.name.toLowerCase().includes(searchReview.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <Box className="contact-page">
      <PortfolioNavigation onNavigate={onNavigate} activePage="Contact" onOpenResume={onOpenResume} />
      <main className="contact-layout">
        <section className="contact-copy">
          <p className="contact-kicker">{settings?.contactKicker || '// GET IN TOUCH'}</p>
          <h1>{settings?.contactHeading || "Let's Work Together On Something Amazing"}</h1>
          <p className="contact-intro">{settings?.contactIntro || 'Have a project in mind or just want to say hi? I\'d love to hear from you.'}</p>
          
          <a className="leave-review-link" href="#reviews" onClick={() => sounds.playClick()}>
            Read Client Testimonials <span>↓</span>
          </a>

          <div className="contact-details">
            {savedDetails.map((detail) => (
              <div className="contact-detail" key={detail.label}>
                <span className="contact-detail-icon">{detail.icon}</span>
                <span>
                  <strong>{detail.label}</strong>
                  <small>{detail.value}</small>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-form-wrap" aria-label="Contact form">
          {prefillSpec && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: '12px', fontSize: 12 }}>
              {prefillSpec.service ? 'Selected service details auto-loaded below!' : 'Project Estimate specification auto-loaded below!'}
            </Alert>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <TextField
              className="contact-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              variant="outlined"
              fullWidth
              size="small"
              required
            />
            <TextField
              className="contact-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              variant="outlined"
              fullWidth
              size="small"
              required
            />
            <TextField
              className="contact-field"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              variant="outlined"
              fullWidth
              size="small"
              required
            />
            <TextField
              className="contact-field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Project Subject"
              variant="outlined"
              fullWidth
              size="small"
              required
            />
            <TextField
              className="contact-field contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message / Scope Requirements"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
            />
            <button className="contact-submit" type="submit" disabled={sending}>
              <SendRoundedIcon />
              {sending ? 'Sending...' : sent ? 'Message Received! Thank You' : 'Send Message'}
              <SendRoundedIcon />
            </button>
            {sent && (
              <Alert severity="success" sx={{ mt: 1.5, borderRadius: '10px' }}>
                Thank you! Your message was received and I will reply within 24 hours.
              </Alert>
            )}
            {sendError && <p className="contact-send-error" role="alert">{sendError}</p>}
          </form>
        </section>

        <div className="contact-art" aria-hidden="true">
          <div className="contact-plane"><span /></div>
          <div className="contact-dash contact-dash-one" />
          <div className="contact-dash contact-dash-two" />
          <i className="contact-spark spark-one" />
          <i className="contact-spark spark-two" />
          <i className="contact-spark spark-three" />
          <i className="contact-ring" />
        </div>
      </main>

      {/* Feature 10: Enhanced Client Social Proof & Testimonial Hub */}
      <section id="reviews" className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p className="contact-kicker">{"// CLIENT ENDORSEMENTS"}</p>
            <h2 id="reviews-title">Kind words from <span>great partners.</span></h2>
            <p>Verified testimonials from founders, product leads, and clients who shipped projects with me.</p>
          </div>
          
          <div className="reviews-score">
            <strong>{avgRating}</strong>
            <Rating value={5} readOnly size="small" />
            <span>{reviews.length} Verified Reviews</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Stack direction="row" spacing={1}>
            {[
              { id: 'all', label: 'All Reviews' },
              { id: '5', label: '5 Stars Only' },
              { id: '4', label: '4+ Stars' },
            ].map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                onClick={() => {
                  sounds.playClick();
                  setRatingFilter(filter.id);
                }}
                sx={{
                  bgcolor: ratingFilter === filter.id ? 'var(--accent-color, #22c55e)' : 'rgba(148, 163, 184, 0.15)',
                  color: ratingFilter === filter.id ? '#fff' : 'text.primary',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
            ))}
          </Stack>

          <TextField
            size="small"
            placeholder="Search reviews..."
            value={searchReview}
            onChange={(e) => setSearchReview(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchRoundedIcon sx={{ fontSize: 16, mr: 0.5, color: '#64748b' }} />,
              },
            }}
            sx={{ maxWidth: 220, bgcolor: '#fff', borderRadius: '10px' }}
          />
        </Box>

        <div className="review-cards">
          {filteredReviews.map((review, index) => (
            <article className="review-card" key={`${review.name}-${index}`}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                {review.verified && (
                  <Chip
                    icon={<VerifiedRoundedIcon sx={{ fontSize: 13 }} />}
                    label="Verified"
                    size="small"
                    sx={{ height: 20, fontSize: 10, bgcolor: 'var(--accent-soft, #dcfce7)', color: 'var(--accent-dark, #16a34a)', fontWeight: 800 }}
                  />
                )}
              </Box>
              <p>&ldquo;{review.text}&rdquo;</p>
              <div>
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </article>
          ))}
        </div>

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <div className="review-form-copy">
            <span>YOUR EXPERIENCE</span>
            <h3>Leave a review for future clients.</h3>
          </div>
          <Rating
            value={reviewRating}
            onChange={(_, value) => {
              sounds.playClick();
              setReviewRating(value || 5);
            }}
            aria-label="Your rating"
          />
          <TextField
            value={reviewName}
            onChange={(event) => setReviewName(event.target.value)}
            placeholder="Your Name & Company"
            size="small"
            required
          />
          <TextField
            value={reviewRole}
            onChange={(event) => setReviewRole(event.target.value)}
            placeholder="Your Role / Title"
            size="small"
          />
          <TextField
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Share your experience working with me..."
            size="small"
            required
            fullWidth
            multiline
            rows={2}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'var(--accent-color, #22c55e)',
              '&:hover': { bgcolor: 'var(--accent-dark, #16a34a)' },
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: '10px',
            }}
          >
            Publish Verified Review
          </Button>
        </form>
      </section>

      {/* Feature 10: Frequently Asked Questions Accordion */}
      <section className="contact-faq-section">
        <span className="contact-faq-kicker">{"// GOT QUESTIONS?"}</span>
        <Typography component="h2" className="contact-faq-title">Frequently Asked Questions</Typography>
        <div className="faq-list">
          {[
            {
              q: 'What is your typical project turnaround time?',
              a: 'Standard MVP web applications are delivered in 2 to 4 weeks. Smaller frontend tasks, audits, or feature integrations take 3 to 7 business days.',
            },
            {
              q: 'What tech stack do you primarily specialize in?',
              a: 'I specialize in React, Next.js (App Router), TypeScript, Node.js/Express, Tailwind CSS, MongoDB, PostgreSQL, and AWS/Vercel cloud infrastructure.',
            },
            {
              q: 'How are payments and milestones structured?',
              a: 'Projects are structured in clear milestone sprints (e.g. 50% upfront deposit, 50% upon final staging approval before production handover). Hourly rates are invoiced bi-weekly.',
            },
            {
              q: 'Do you offer post-launch support and warranty?',
              a: 'Yes, every project includes 30 days of complimentary bug fix warranty and performance monitoring post-launch. Extended monthly retainer packages are also available.',
            },
            {
              q: 'Can you integrate into an existing codebase or team?',
              a: 'Absolutely. I am comfortable jumping into existing GitHub repositories, following internal coding standards, creating PRs with thorough test coverage, and collaborating on Slack/Discord.',
            },
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => {
                    sounds.playClick();
                    setOpenFaq(isOpen ? null : index);
                  }}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature 11: Social Proof & Reliability Counters */}
      <section className="contact-proof-section">
        <div className="contact-proof-grid">
          <div className="contact-proof-card">
            <Typography className="contact-proof-number">50+</Typography>
            <Typography className="contact-proof-label">Client Inquiries Solved</Typography>
          </div>
          <div className="contact-proof-card">
            <Typography className="contact-proof-number">100%</Typography>
            <Typography className="contact-proof-label">Positive Feedback Score</Typography>
          </div>
          <div className="contact-proof-card">
            <Typography className="contact-proof-number">&lt; 24h</Typography>
            <Typography className="contact-proof-label">Average Response Time</Typography>
          </div>
          <div className="contact-proof-card">
            <Typography className="contact-proof-number">20+</Typography>
            <Typography className="contact-proof-label">Shipped Web Applications</Typography>
          </div>
        </div>
      </section>
    </Box>
  );
}

