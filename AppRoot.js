// AppRoot - Error Boundary ve Servis Başlatma Wrapper
// Tüm uygulamayı Error Boundary ile sarar ve servisleri başlatır

import React, { useEffect } from 'react';
import App from './App';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeCrashReporting, logMessage } from './src/services/crashReporting';
import { initializeAnalytics, logAppOpen, updateLastLoginDate } from './src/services/analytics';

export default function AppRoot() {
  useEffect(() => {
    // Uygulama başlatıldığında servisleri başlat
    const initializeServices = async () => {
      try {
        // Crash reporting başlat
        initializeCrashReporting();
        logMessage('App started successfully', 'info');

        // Analytics başlat
        await initializeAnalytics();
        logAppOpen();
        updateLastLoginDate();

        console.log('[AppRoot] All services initialized successfully');
      } catch (error) {
        console.error('[AppRoot] Error initializing services:', error);
      }
    };

    initializeServices();
  }, []);

  const handleErrorBoundaryReset = () => {
    // Error boundary reset edildiğinde yapılacaklar
    console.log('[AppRoot] Error boundary reset');
    logMessage('App restarted after error', 'warning');
  };

  return (
    <ErrorBoundary onReset={handleErrorBoundaryReset}>
      <App />
    </ErrorBoundary>
  );
}
