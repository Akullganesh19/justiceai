import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function useOraclePrediction() {
  const [predictedPath, setPredictedPath] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Reset prediction on navigation
    setTimeout(() => setPredictedPath(null), 0);

    const handlePrediction = (e) => {
      setPredictedPath(e.detail.path);
    };

    window.addEventListener('oracle-prediction', handlePrediction);
    return () => window.removeEventListener('oracle-prediction', handlePrediction);
  }, [location.pathname]);

  return predictedPath;
}
