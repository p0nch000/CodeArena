import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuth } from '@/core/context/AuthContext';
import { usePathname } from 'next/navigation';

// Mock del contexto de autenticación
jest.mock('@/core/context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock del hook de navegación
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// Mock de UserAvatar para no testear ese componente
jest.mock('../UserAvatar', () => ({ user }) => (
  <div data-testid="user-avatar">Avatar: {user.name}</div>
));

describe('Navbar', () => {
  beforeEach(() => {
    // Simula estar en la ruta /home
    usePathname.mockReturnValue('/home');

    // Simula un usuario autenticado
    useAuth.mockReturnValue({
      user: {
        id: '123',
        username: 'TestUser',
        avatar_url: '/test-avatar.png',
        role: 'user',
      },
      logout: jest.fn()
    });
  });

  it('muestra los enlaces del menú de navegación', () => {
    render(<Navbar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Code Challenges')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('muestra el nombre del usuario en el avatar mockeado', () => {
    render(<Navbar />);
    expect(screen.getByTestId('user-avatar')).toHaveTextContent('TestUser');
  });

  it('muestra las opciones del menú de usuario al hacer clic', async () => {
    render(<Navbar />);
    const avatarButton = screen.getByRole('button', { name: /open user menu/i });
    fireEvent.click(avatarButton);

    // Espera a que aparezcan los elementos del menú
    const profileOption = await screen.findByText((content, element) =>
    element?.textContent === 'Profile'
    );
    const signOutOption = await screen.findByText((content, element) =>
    element?.textContent === 'Sign out'
    );

    expect(profileOption).toBeInTheDocument();
    expect(signOutOption).toBeInTheDocument();
    });
});
