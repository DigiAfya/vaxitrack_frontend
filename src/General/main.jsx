import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
});
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NotificationProvider } from '../Notifications/NotificationContext';
import { ToastContainer } from '../Notifications/Toast';
import App from './App';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || 'MISSING_GOOGLE_CLIENT_ID';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <NotificationProvider>
          <App />
          <ToastContainer />
        </NotificationProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);