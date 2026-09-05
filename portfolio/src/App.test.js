import { render, screen } from '@testing-library/react';
import App from './App';
import { buildAIReply } from './Components/AIAssistant';

test('renders the portfolio home page', () => {
  render(<App />);
  expect(screen.getByText(/John/i)).toBeInTheDocument();
  expect(screen.getByText(/Full Stack Developer|Product Engineer|Creative Problem Solver/i)).toBeInTheDocument();
});

test('ask ai answers using actual portfolio content and features', () => {
  const reply = buildAIReply('What features are on this website?', {
    name: 'John Doe',
    role: 'Full Stack Developer',
  });

  expect(reply.text.toLowerCase()).toContain('about');
  expect(reply.text.toLowerCase()).toContain('skills');
  expect(reply.text.toLowerCase()).toContain('resume');
});

test('ask ai explains the real portfolio services and contact flow', () => {
  const reply = buildAIReply('What services do you offer and how can I contact you?', {
    name: 'John Doe',
    role: 'Full Stack Developer',
  });

  expect(reply.text.toLowerCase()).toContain('full stack web applications');
  expect(reply.text.toLowerCase()).toContain('contact');
  expect(reply.text.toLowerCase()).toContain('meeting scheduler');
});

test('ask ai understands natural Tamil and conversational website questions', () => {
  const reply = buildAIReply('website la enna iruku? skills ellam enna?', {
    name: 'John Doe',
    role: 'Full Stack Developer',
  });

  expect(reply.text.toLowerCase()).toContain('portfolio');
  expect(reply.text.toLowerCase()).toContain('skills');
  expect(reply.text.toLowerCase()).toContain('projects');
});
