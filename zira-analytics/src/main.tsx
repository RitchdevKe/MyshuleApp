import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { toast } from 'react-hot-toast';
import { CurrencyProvider } from './contexts/CurrencyContext.tsx';

window.alert = (msg) => {
  toast(msg, { 
    duration: 5000, 
    icon: '✨',
    style: {
      borderRadius: '16px',
      background: 'var(--color-header-bg)',
      color: '#fff',
      fontSize: '14px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    }
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </StrictMode>,
);
