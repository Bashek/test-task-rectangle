import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
  render(<App />)
  const descriptionElement = screen.getByText(/Moving rectangle Task/i)
  expect(descriptionElement).toBeInTheDocument();
})
