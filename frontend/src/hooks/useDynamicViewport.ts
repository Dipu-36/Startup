import { useEffect } from 'react';

// Updates the CSS custom property --vh to represent 1% of the viewport height
// This helps on mobile browsers where 100vh can be inaccurate due to UI chrome
export default function useDynamicViewport(): void {
	useEffect(() => {
		const setVh = () => {
			try {
				const vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			} catch (e) {
				// ignore in non-browser environments
			}
		};

		setVh();

		window.addEventListener('resize', setVh, { passive: true });
		window.addEventListener('orientationchange', setVh);

		return () => {
			window.removeEventListener('resize', setVh);
			window.removeEventListener('orientationchange', setVh);
		};
	}, []);
}

