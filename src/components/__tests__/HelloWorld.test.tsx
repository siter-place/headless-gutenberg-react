import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HelloWorld } from '../HelloWorld';

describe('HelloWorld', () => {
  it('renders the default greeting', () => {
    render(<HelloWorld />);
    expect(screen.getByTestId('hello-world')).toHaveTextContent('Hello World');
  });

  it('renders a custom name', () => {
    render(<HelloWorld name="Gutenberg" />);
    expect(screen.getByTestId('hello-world')).toHaveTextContent('Hello Gutenberg');
  });
});
