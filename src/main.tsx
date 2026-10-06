import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PrivateAuthProvider } from './context/PrivateAuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivateAuthProvider>
      <App />
    </PrivateAuthProvider>
  </StrictMode>
);
