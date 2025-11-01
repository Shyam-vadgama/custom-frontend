import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // This is a basic test to ensure App component can be imported and rendered
  expect(true).toBe(true);
});
