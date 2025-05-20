import { render, screen } from '@testing-library/react';
import UserAvatar from '../UserAvatar';
import { generateAvatar } from '@/utils/avatar';

// Mock de la función generateAvatar
jest.mock('@/utils/avatar', () => ({
  generateAvatar: jest.fn(() => 'mocked-avatar-url'),
}));

describe('UserAvatar component', () => {
  it('renders default avatar when user is null', () => {
    render(<UserAvatar user={null} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'mocked-avatar-url');
  });

  it('renders avatar with user avatarUrl', () => {
  const user = { name: 'Alice', avatarUrl: 'https://example.com/avatar.png' };
  render(<UserAvatar user={user} />);
  const img = screen.getByAltText('avatar');
  expect(img).toHaveAttribute('src', user.avatarUrl);
    });

  it('renders avatar with fallback when no avatarUrl provided', () => {
  const user = { name: 'Bob' };
  render(<UserAvatar user={user} />);
  const img = screen.getByAltText('avatar');
  expect(img).toHaveAttribute('src', 'mocked-avatar-url');
    });

  it('renders initial fallback character when user name is available', () => {
    const user = { name: 'Charlie' };
    render(<UserAvatar user={user} />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renders "U" as fallback when user has no name', () => {
    const user = {};
    render(<UserAvatar user={user} />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });
});
