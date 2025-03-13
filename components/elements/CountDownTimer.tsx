import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CountdownTimer = ({
  totalSeconds,
}: {
  totalSeconds: number | string;
}) => {
  const initialSeconds =
    typeof totalSeconds === "string"
      ? parseInt(totalSeconds, 10)
      : totalSeconds;

  const validInitialSeconds = isNaN(initialSeconds) ? 0 : initialSeconds;

  const [remainingSeconds, setRemainingSeconds] = useState(validInitialSeconds);
  const [progressPercent, setProgressPercent] = useState(100);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  useEffect(() => {
    // Calculate progress percentage
    const progress = (remainingSeconds / validInitialSeconds) * 100;
    setProgressPercent(isNaN(progress) ? 0 : progress);
  }, [remainingSeconds, validInitialSeconds]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) {
      return { hours: "00", minutes: "00", secs: "00" };
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, secs } = formatTime(remainingSeconds);

  // Determine color based on remaining time
  const getColor = () => {
    if (progressPercent > 60) return "#52c41a"; // Green
    if (progressPercent > 30) return "#faad14"; // Yellow
    return "#f5222d"; // Red
  };

  // Create pulsing animation when time is low
  const isPulsing = progressPercent < 20;

  return (
    <motion.div
      animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <div
        className="flex items-center justify-center gap-1 text-lg font-bold font-mono"
        style={{ color: getColor() }}
      >
        <motion.span
          key={hours}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {hours}
        </motion.span>
        <span>:</span>
        <motion.span
          key={minutes}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {minutes}
        </motion.span>
        <span>:</span>
        <motion.span
          key={secs}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {secs}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
