import { useEffect, useState } from 'react';

interface ViewportDimensions {
  width: number;
  height: number;
  dynamicHeight: number;
}

/**
 * Hook that provides dynamic viewport dimensions that account for mobile browser UI
 * @returns {ViewportDimensions} Current viewport dimensions
 */
export function useDynamicViewport(): ViewportDimensions {
  const [dimensions, setDimensions] = useState<ViewportDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    dynamicHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dynamicHeight = height;

      setDimensions({
        width,
        height,
        dynamicHeight,
      });

      // Update CSS custom property for dynamic viewport height
      const vh = height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Initial update
    updateDimensions();

    // Event listeners
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure orientation change is complete
      setTimeout(updateDimensions, 100);
    });
    window.addEventListener('focus', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      window.removeEventListener('focus', updateDimensions);
    };
  }, []);

  return dimensions;
}

/**
 * Hook that returns whether the viewport is mobile-sized
 * @param breakpoint - The width breakpoint to consider mobile (default: 768px)
 * @returns {boolean} Whether the viewport is mobile-sized
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const { width } = useDynamicViewport();
  return width < breakpoint;
}

/**
 * Hook that detects if the mobile browser UI is visible (address bar, etc.)
 * @returns {boolean} Whether mobile browser UI is likely visible
 */
export function useMobileBrowserUI(): boolean {
  const [hasBrowserUI, setHasBrowserUI] = useState(false);
  
  useEffect(() => {
    function checkBrowserUI() {
      // On mobile, when browser UI is visible, window.innerHeight is smaller
      // than the actual screen height. We can detect this by comparing
      // window.innerHeight with screen.height
      if (typeof window !== 'undefined' && window.screen) {
        const heightDifference = window.screen.height - window.innerHeight;
        // If there's a significant height difference, browser UI is likely visible
        setHasBrowserUI(heightDifference > 100);
      }
    }

    checkBrowserUI();
    
    window.addEventListener('resize', checkBrowserUI);
    window.addEventListener('scroll', checkBrowserUI);
    
    return () => {
      window.removeEventListener('resize', checkBrowserUI);
      window.removeEventListener('scroll', checkBrowserUI);
    };
  }, []);
  
  return hasBrowserUI;
}
