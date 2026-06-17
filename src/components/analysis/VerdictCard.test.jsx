import React from 'react';
import { render, screen } from '@testing-library/react';
import { VerdictCard } from './VerdictCard';

describe('VerdictCard Component', () => {
  it('renders a "win" state with correct label and color', () => {
    const { container } = render(<VerdictCard verdict="win" confidence={85} />);

    expect(screen.getByText('favorable')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('The facts of your case align strongly with established Indian legal precedents and current BNS statutes.')).toBeInTheDocument();

    const labelElement = screen.getByText('favorable');
    expect(labelElement).toHaveClass('text-emerald-400');
  });

  it('renders a "loss" state with correct label and color', () => {
    const { container } = render(<VerdictCard verdict="loss" confidence={30} />);

    expect(screen.getByText('unfavorable')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('Based on current parameters, there are significant procedural hurdles to overcome. Strategic adjustments are recommended.')).toBeInTheDocument();

    const labelElement = screen.getByText('unfavorable');
    expect(labelElement).toHaveClass('text-gold');
  });

  it('renders a "partial" state with correct label and color', () => {
    const { container } = render(<VerdictCard verdict="partial" confidence={55} />);

    expect(screen.getByText('partial')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('The case has merit, but successful execution depends heavily on specific evidentiary support and jurisdictional factors.')).toBeInTheDocument();

    const labelElement = screen.getByText('partial');
    expect(labelElement).toHaveClass('text-blue-400');
  });

  it('falls back to "partial" state for unknown verdicts', () => {
    const { container } = render(<VerdictCard verdict="unknown_verdict" confidence={50} />);

    expect(screen.getByText('partial')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('The case has merit, but successful execution depends heavily on specific evidentiary support and jurisdictional factors.')).toBeInTheDocument();

    const labelElement = screen.getByText('partial');
    expect(labelElement).toHaveClass('text-blue-400');
  });
});
