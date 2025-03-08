import { useState, useEffect } from 'react';

const CountdownTimer = ({ totalSeconds }: { totalSeconds: number | string }) => {
  const initialSeconds = typeof totalSeconds === 'string' 
    ? parseInt(totalSeconds, 10) 
    : totalSeconds;
  
  const validInitialSeconds = isNaN(initialSeconds) ? 0 : initialSeconds;
  
  const [remainingSeconds, setRemainingSeconds] = useState(validInitialSeconds);

  useEffect(() => {
    
    if (remainingSeconds <= 0) return;
    
    const interval = setInterval(() => {    
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <span>
      {formatTime(remainingSeconds)}
    </span>
  );
};

export default CountdownTimer;