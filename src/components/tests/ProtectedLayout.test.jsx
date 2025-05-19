// src/components/tests/ProtectedLayout.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock del hook useAuthRedirect
jest.mock('@/core/hooks/useAuthRedirect', () => ({
  useAuthRedirect: jest.fn(),
}))

import { useAuthRedirect } from '@/core/hooks/useAuthRedirect'
import ProtectedLayout from '../ProtectedLayout'

describe('ProtectedLayout', () => {
  it('muestra el spinner mientras loading es true', () => {
    useAuthRedirect.mockReturnValue({ loading: true })

    render(
      <ProtectedLayout>
        <div>Contenido protegido</div>
      </ProtectedLayout>
    )

    // Verificamos que el spinner está en el documento (puede ser por clase o rol)
    const spinner = screen.getByRole('status') || screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('renderiza los children cuando loading es false', () => {
    useAuthRedirect.mockReturnValue({ loading: false })

    render(
      <ProtectedLayout>
        <div>Contenido protegido</div>
      </ProtectedLayout>
    )

    // Verificamos que el contenido hijo se renderiza
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })
})
