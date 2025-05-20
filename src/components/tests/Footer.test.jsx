import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer component', () => {
  it('renders the company logo', () => {
    render(<Footer />);
    const logo = screen.getByAltText('Company Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logoMTH.png');
  });

  it('renders GitHub link', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
  });

  it('renders LinkedIn link', () => {
    render(<Footer />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
  });

  it('renders Twitter link', () => {
    render(<Footer />);
    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
  });
});
