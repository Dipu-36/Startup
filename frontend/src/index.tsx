import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Dynamic viewport height calculation for mobile browsers
function setDynamicVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial value
setDynamicVH();

// Update on resize and orientation change
window.addEventListener('resize', setDynamicVH);
window.addEventListener('orientationchange', () => {
  // Small delay to ensure orientation change is complete
  setTimeout(setDynamicVH, 100);
});

// Update on page load and focus (when mobile browser UI shows/hides)
window.addEventListener('load', setDynamicVH);
window.addEventListener('focus', setDynamicVH);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
