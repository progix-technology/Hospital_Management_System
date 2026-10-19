import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// Configure dynamic API base URL for Vercel/Render deployments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('http://localhost:5000')) {
      config.url = config.url.replace('http://localhost:5000', API_URL);
    }
    // Attach JWT Authorization Bearer token if user is logged in
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (e) {
      // Ignore JSON parse errors on invalid storage
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function ErrorFallback({error}) {
  return (
    <div role="alert" style={{padding: '20px', color: 'red'}}>
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
      <pre style={{color: 'red', marginTop: '10px'}}>{error.stack}</pre>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Prefetch important hero and department images during idle time to warm cache
const PREFETCH_IMAGES = [
  'https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925408/medisphere/about/about-hero-bg.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785927339/departments_k7dwgb.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925415/medisphere/about/doctors/doctors1.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925417/medisphere/about/emergency.jpg'
];

function prefetchImages(urls) {
  try {
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  } catch (e) {
    // no-op
  }
}

if ('requestIdleCallback' in window) {
  // @ts-ignore
  requestIdleCallback(() => prefetchImages(PREFETCH_IMAGES), { timeout: 2000 });
} else {
  setTimeout(() => prefetchImages(PREFETCH_IMAGES), 2000);
}

// Register service worker to cache hero images for faster repeat loads
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // registration successful
      console.debug('Service worker registered:', reg.scope);
    }).catch((err) => {
      console.debug('Service worker registration failed:', err);
    });
  });
}
