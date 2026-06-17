import React from 'react';
import { render, screen } from '@testing-library/react';
import { StrategyList, LawsList } from './Lists';

describe('StrategyList', () => {
  it('renders nothing when strategy is null', () => {
    const { container } = render(<StrategyList strategy={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is undefined', () => {
    const { container } = render(<StrategyList strategy={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is an empty array', () => {
    const { container } = render(<StrategyList strategy={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when strategy is not an array', () => {
    const { container } = render(<StrategyList strategy="invalid" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders strategy steps correctly', () => {
    const mockStrategy = ['First legal step', 'Second legal step'];
    render(<StrategyList strategy={mockStrategy} />);

    expect(screen.getByText('LEGAL_STRATEGY_PROTOCOL')).toBeInTheDocument();

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('RECOMMENDATION_1')).toBeInTheDocument();
    expect(screen.getByText('First legal step')).toBeInTheDocument();

    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('RECOMMENDATION_2')).toBeInTheDocument();
    expect(screen.getByText('Second legal step')).toBeInTheDocument();
  });
});

describe('LawsList', () => {
  it('renders nothing when laws is null', () => {
    const { container } = render(<LawsList laws={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when laws is undefined', () => {
    const { container } = render(<LawsList laws={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when laws is an empty array', () => {
    const { container } = render(<LawsList laws={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when laws is not an array', () => {
    const { container } = render(<LawsList laws="invalid" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders laws correctly', () => {
    const mockLaws = [
      { act: 'Test Act 2024', description: 'Description for Test Act' },
      { act: 'Another Act 1999', description: 'Description for Another Act' }
    ];
    render(<LawsList laws={mockLaws} />);

    expect(screen.getByText('STATUTORY_CITATIONS_INDEX')).toBeInTheDocument();

    expect(screen.getByText('Test Act 2024')).toBeInTheDocument();
    expect(screen.getByText('Description for Test Act')).toBeInTheDocument();

    expect(screen.getByText('Another Act 1999')).toBeInTheDocument();
    expect(screen.getByText('Description for Another Act')).toBeInTheDocument();

    const links = screen.getAllByText('View Citation');
    expect(links).toHaveLength(2);

    // Check closest anchor to ensure href is correct
    expect(links[0].closest('a')).toHaveAttribute('href', 'https://indiankanoon.org/search/?formInput=Test%20Act%202024');
    expect(links[1].closest('a')).toHaveAttribute('href', 'https://indiankanoon.org/search/?formInput=Another%20Act%201999');
  });
});
