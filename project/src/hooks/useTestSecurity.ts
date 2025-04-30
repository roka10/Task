import { useState, useEffect, useCallback } from 'react';
import { useFullScreen } from './useFullScreen';

interface SecurityConfig {
  maxTabSwitches: number;
  onMaxViolations: () => void;
  onViolation: (count: number) => void;
}

export const useTestSecurity = ({
  maxTabSwitches,
  onMaxViolations,
  onViolation,
}: SecurityConfig) => {
  const [tabSwitches, setTabSwitches] = useState(0);
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  
  // Handle tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          onViolation(newCount);
          
          if (newCount >= maxTabSwitches) {
            onMaxViolations();
          }
          
          return newCount;
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [maxTabSwitches, onMaxViolations, onViolation]);
  
  // Prevent copy/paste
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    
    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, []);
  
  // Prevent right click
  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', preventRightClick);
    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        // Prevent Alt+Tab
        (e.altKey && e.key === 'Tab') ||
        // Prevent Ctrl+C, Ctrl+V
        (e.ctrlKey && ['c', 'v'].includes(e.key.toLowerCase())) ||
        // Prevent F11
        e.key === 'F11' ||
        // Prevent Alt+F4
        (e.altKey && e.key === 'F4')
      ) {
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('keydown', preventShortcuts);
    return () => {
      document.removeEventListener('keydown', preventShortcuts);
    };
  }, []);
  
  return {
    tabSwitches,
    isFullScreen,
    toggleFullScreen,
  };
};