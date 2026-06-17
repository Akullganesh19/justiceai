import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StrategyList } from '../Lists';

describe('StrategyList', () => {
  it('renders nothing when strategy is null', () => {
    const { container } = render(<StrategyList strategy={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is undefined', () => {
    const { container } = render(<StrategyList />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is an empty array', () => {
    const { container } = render(<StrategyList strategy={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is not an array', () => {
    const { container } = render(<StrategyList strategy={"not an array"} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with a valid strategy array', () => {
    const mockStrategy = [
      'File an injunction',
      'Gather more evidence',
    ];

    render(<StrategyList strategy={mockStrategy} />);

    // Check heading
    expect(screen.getByText('LEGAL_STRATEGY_PROTOCOL')).toBeInTheDocument();

    // Check steps
    expect(screen.getByText('File an injunction')).toBeInTheDocument();
    expect(screen.getByText('Gather more evidence')).toBeInTheDocument();

    // Check recommendation text format
    expect(screen.getByText('RECOMMENDATION_1')).toBeInTheDocument();
    expect(screen.getByText('RECOMMENDATION_2')).toBeInTheDocument();

    // Check numbers padding
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
  });
});
