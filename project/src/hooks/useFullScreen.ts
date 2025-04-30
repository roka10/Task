import { useState, useEffect } from 'react';
import screenfull from 'screenfull';

export const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on('change', handleChange);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleChange);
      }
    };
  }, []);

  const toggleFullScreen = async () => {
    if (screenfull.isEnabled) {
      if (isFullScreen) {
        await screenfull.exit();
      } else {
        await screenfull.request();
      }
    }
  };

  return { isFullScreen, toggleFullScreen };
};