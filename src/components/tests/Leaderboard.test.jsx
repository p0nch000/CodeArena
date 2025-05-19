import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Leaderboard from '../Leaderboard';

// Mock para generateAvatar porque es función util externa
jest.mock('@/utils/avatar', () => ({
  generateAvatar: jest.fn((user) => `mocked-avatar-${user.id}`),
}));

describe('Leaderboard component', () => {
  const mockedGenerateAvatar = require('@/utils/avatar').generateAvatar;

  const usersMock = [
    {
      id: '1',
      name: 'Alice',
      avatarUrl: '',
      challenges: 5,
      points: 1500,
      rank: 'Gold Engineer',
    },
    {
      id: '2',
      name: 'Bob',
      avatarUrl: 'https://bob-avatar.png',
      challenges: 3,
      points: 1200,
      rank: 'Silver Developer',
    },
  ];

  it('muestra el spinner cuando isLoading es true', () => {
    render(<Leaderboard isLoading={true} users={[]} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay usuarios', () => {
    render(<Leaderboard isLoading={false} users={[]} />);
    expect(screen.getByText(/No users found matching your criteria/i)).toBeInTheDocument();
  });

  it('renderiza usuarios con datos correctos', () => {
    render(<Leaderboard isLoading={false} users={usersMock} />);
    // Verificar nombres
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Verificar que se llama generateAvatar para usuario sin avatarUrl
    expect(mockedGenerateAvatar).toHaveBeenCalledWith(usersMock[0]);

    // Verificar puntos formateados con coma
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();

    // Verificar ranks
    expect(screen.getByText('Gold Engineer')).toBeInTheDocument();
    expect(screen.getByText('Silver Developer')).toBeInTheDocument();
  });

 it('muestra los botones de paginación según totalPages y permite cambiar página', () => {
  const onPageChange = jest.fn();
  const totalPages = 5;
  const currentPage = 1;

  render(
    <Leaderboard
      isLoading={false}
      users={usersMock}
      showPagination={true}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
  screen.debug();
    // Buscar todos los botones (filtrando los que son números)
    const pageButtons = screen.getAllByRole('button').filter(button => {
        return /^[0-9]+$/.test(button.textContent);
    });

    // Verificar que haya la cantidad correcta de botones de página
    expect(pageButtons.length).toBe(totalPages);

    // Verificar que los botones tengan los números del 1 al totalPages
    for (let i = 1; i <= totalPages; i++) {
        expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
    }

    // NUEVO: Verificar que el botón de la página actual esté deshabilitado o tenga clase activa
    const currentPageButton = screen.getByRole('button', { name: currentPage.toString() });
    // Si usas disabled para el botón activo:
    expect(currentPageButton).toBeDisabled();
    // O si usas clase activa, por ejemplo 'active-page':
    // expect(currentPageButton).toHaveClass('active-page');

    // Simular click en botón página 3 y verificar que onPageChange se llame con 3
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    });



  it('no muestra paginación si showPagination es false', () => {
    render(
      <Leaderboard
        isLoading={false}
        users={usersMock}
        showPagination={false}
        totalPages={3}
        currentPage={1}
      />
    );
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });
});
