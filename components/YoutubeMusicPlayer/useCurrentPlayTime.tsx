import { useEffect, useState } from 'react';
import { YouTubePlayer } from 'react-youtube';

const useCurrentPlayTime = (player: YouTubePlayer) => {
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  useEffect(() => {
    // Use a setInterval to periodically update the current play time
    const interval = setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        setCurrentPlayTime(currentTime);
      }
    }, 1000); // Update every 1 second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [player]);

  return {
    currentPlayTime,
  };
};

export default useCurrentPlayTime;
