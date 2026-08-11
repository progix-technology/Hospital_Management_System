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
