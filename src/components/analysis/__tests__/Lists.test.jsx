import React from 'react';
import { render, screen } from '@testing-library/react';
import { StrategyList } from '../Lists';

describe('StrategyList Component', () => {
  describe('Edge Cases & Invalid Props', () => {
    it('should return null and render nothing when strategy prop is undefined', () => {
      const { container } = render(<StrategyList strategy={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null and render nothing when strategy prop is null', () => {
      const { container } = render(<StrategyList strategy={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null and render nothing when strategy prop is an empty array', () => {
      const { container } = render(<StrategyList strategy={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null and render nothing when strategy prop is not an array', () => {
      const { container: containerStr } = render(<StrategyList strategy="invalid-string-prop" />);
      expect(containerStr.firstChild).toBeNull();

      const { container: containerObj } = render(<StrategyList strategy={{ step1: 'step' }} />);
      expect(containerObj.firstChild).toBeNull();
    });
  });

  describe('Happy Path', () => {
    it('should render the list of strategies correctly when provided a valid array', () => {
      const strategies = ['First recommendation', 'Second recommendation'];
      render(<StrategyList strategy={strategies} />);

      // Should render the protocol header
      expect(screen.getByText('LEGAL_STRATEGY_PROTOCOL')).toBeInTheDocument();

      // Should render the recommendations
      expect(screen.getByText('RECOMMENDATION_1')).toBeInTheDocument();
      expect(screen.getByText('First recommendation')).toBeInTheDocument();

      expect(screen.getByText('RECOMMENDATION_2')).toBeInTheDocument();
      expect(screen.getByText('Second recommendation')).toBeInTheDocument();
    });
  });
});
