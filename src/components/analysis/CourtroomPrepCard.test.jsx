import React from "react";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CourtroomPrepCard } from './CourtroomPrepCard';

describe('CourtroomPrepCard', () => {
  const mockPrep = {
    openingStatement: 'This is the opening statement.',
    whatNotToSay: ['Do not say this.', 'Avoid saying that.'],
    judgeQuestions: [
      { question: 'What is your case about?', answer: 'It is about justice.' },
      { question: 'Why should you win?', answer: 'Because we are right.' },
    ],
  };

  const mockGrounds = ['Ground 1', 'Ground 2'];

  it('renders null when prep is not provided', () => {
    const { container } = render(<CourtroomPrepCard />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with full prep and grounds data', () => {
    render(<CourtroomPrepCard prep={mockPrep} grounds={mockGrounds} />);

    // Check header
    expect(screen.getByText('COURTROOM_PREPARATION_PROTOCOLS')).toBeInTheDocument();

    // Check grounds
    expect(screen.getByText('STATUTORY_FOUNDATION_UNITS')).toBeInTheDocument();
    expect(screen.getByText('Ground 1')).toBeInTheDocument();
    expect(screen.getByText('Ground 2')).toBeInTheDocument();

    // Check opening statement
    expect(screen.getByText('OPENING_STATEMENT_STRATEGY_BUFFER')).toBeInTheDocument();
    expect(screen.getByText(`"${mockPrep.openingStatement}"`)).toBeInTheDocument();

    // Check what not to say
    expect(screen.getByText('ADVISORY_COMMUNICATION_RISKS')).toBeInTheDocument();
    expect(screen.getByText('Do not say this.')).toBeInTheDocument();
    expect(screen.getByText('Avoid saying that.')).toBeInTheDocument();

    // Check judge questions
    expect(screen.getByText('ANTICIPATED_BENCH_INQUIRIES')).toBeInTheDocument();
    expect(screen.getByText('What is your case about?')).toBeInTheDocument();
    expect(screen.getByText('It is about justice.')).toBeInTheDocument();
    expect(screen.getByText('Why should you win?')).toBeInTheDocument();
    expect(screen.getByText('Because we are right.')).toBeInTheDocument();
  });

  it('renders correctly without grounds', () => {
    render(<CourtroomPrepCard prep={mockPrep} />);

    expect(screen.getByText('COURTROOM_PREPARATION_PROTOCOLS')).toBeInTheDocument();
    expect(screen.queryByText('STATUTORY_FOUNDATION_UNITS')).not.toBeInTheDocument();
    expect(screen.getByText(`"${mockPrep.openingStatement}"`)).toBeInTheDocument();
  });

  it('renders gracefully with partial prep data', () => {
    const partialPrep = {
      openingStatement: 'Partial opening statement.',
    };
    render(<CourtroomPrepCard prep={partialPrep} />);

    expect(screen.getByText('COURTROOM_PREPARATION_PROTOCOLS')).toBeInTheDocument();
    expect(screen.getByText(`"${partialPrep.openingStatement}"`)).toBeInTheDocument();
    expect(screen.getByText('ADVISORY_COMMUNICATION_RISKS')).toBeInTheDocument();
    expect(screen.getByText('ANTICIPATED_BENCH_INQUIRIES')).toBeInTheDocument();
  });
});
