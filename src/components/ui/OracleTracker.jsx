import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { oracle } from '../../lib/prediction/oracle';

export default function OracleTracker() {
  const location = useLocation();

  useEffect(() => {
    // Tell Oracle where we are
    oracle.trackNavigation(location.pathname);
  }, [location.pathname]);

  return null;
}
