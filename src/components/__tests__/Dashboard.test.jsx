import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Mock QuickTips to avoid testing its internals here
vi.mock('../QuickTips', () => ({
  default: () => <div data-testid="quick-tips-mock">QuickTips</div>
}));

describe('Dashboard Component', () => {
  const renderDashboard = () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </LanguageProvider>
    );
  };

  it('renders the hello message', () => {
    renderDashboard();
    expect(screen.getByText(/Hello 👋/i)).toBeInTheDocument();
  });

  it('renders the progress section', () => {
    renderDashboard();
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders explore cards with correct links', () => {
    renderDashboard();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    
    // Check for specific cards
    expect(screen.getByText('Voting Journey')).toBeInTheDocument();
    expect(screen.getByText('Myth vs Reality')).toBeInTheDocument();
    expect(screen.getByText('Check Voter Status')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('renders the QuickTips mock', () => {
    renderDashboard();
    expect(screen.getByTestId('quick-tips-mock')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    renderDashboard();
    const nav = screen.getByRole('navigation', { name: /Main navigation/i });
    expect(nav).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getAllByRole('link', { name: /Home/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Journey/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Verify/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Learn/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /AI Chat/i })[0]).toBeInTheDocument();
  });
});
