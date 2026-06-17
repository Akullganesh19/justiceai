import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';

describe('Timeline Component', () => {
  it('renders nothing when timeline prop is empty or undefined', () => {
    const { container: containerEmpty } = render(<Timeline timeline={[]} />);
    expect(containerEmpty.firstChild).toBeNull();

    const { container: containerUndefined } = render(<Timeline />);
    expect(containerUndefined.firstChild).toBeNull();
  });

  it('renders correctly with timeline data', () => {
    const mockTimeline = [
      { stage: 'Stage 1', detail: 'Detail 1', status: 'completed' },
      { stage: 'Stage 2', detail: 'Detail 2', status: 'active' },
      { stage: 'Stage 3', detail: 'Detail 3', status: 'pending' },
    ];

    render(<Timeline timeline={mockTimeline} />);

    // Check header
    expect(screen.getByText('CASE_PROGRESSION_TIMELINE')).toBeInTheDocument();

    // Check all phases are rendered
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByText('Phase 3')).toBeInTheDocument();

    // Check stage and detail text
    expect(screen.getByText('Stage 1')).toBeInTheDocument();
    expect(screen.getByText('Detail 1')).toBeInTheDocument();
    expect(screen.getByText('Stage 2')).toBeInTheDocument();
    expect(screen.getByText('Detail 2')).toBeInTheDocument();
    expect(screen.getByText('Stage 3')).toBeInTheDocument();
    expect(screen.getByText('Detail 3')).toBeInTheDocument();

    // Check active status indicator
    expect(screen.getByText('CURRENT_STATUS_ACTIVE')).toBeInTheDocument();
  });

  it('only shows active text for active items', () => {
    const mockTimeline = [
      { stage: 'Stage 1', detail: 'Detail 1', status: 'completed' },
      { stage: 'Stage 2', detail: 'Detail 2', status: 'pending' },
    ];

    render(<Timeline timeline={mockTimeline} />);

    expect(screen.queryByText('CURRENT_STATUS_ACTIVE')).not.toBeInTheDocument();
  });
});
