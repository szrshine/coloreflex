// Performance Monitoring Hook
// Performans ölçümü ve optimizasyon için hook

import { useEffect, useRef, useCallback } from 'react';
import { startTransaction } from '../services/crashReporting';

/**
 * Component render süresini ölçer
 * @param {string} componentName - Component adı
 */
export const useRenderTime = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;

    if (__DEV__) {
      console.log(
        `[Performance] ${componentName} rendered ${renderCount.current} times. Last render: ${renderTime}ms`
      );
    }

    startTime.current = Date.now();
  });
};

/**
 * Function execution süresini ölçer
 * @param {Function} fn - Ölçülecek fonksiyon
 * @param {string} functionName - Fonksiyon adı
 * @returns {Function} Wrapped function
 */
export const useTimedFunction = (fn, functionName) => {
  return useCallback(
    (...args) => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (__DEV__ && duration > 16) {
        // 16ms'den uzun sürenler uyar (60 FPS için threshold)
        console.warn(
          `[Performance] ${functionName} took ${duration.toFixed(2)}ms (>16ms threshold)`
        );
      }

      return result;
    },
    [fn, functionName]
  );
};

/**
 * Component mount/unmount süresini takip eder
 * @param {string} componentName - Component adı
 */
export const useComponentLifecycle = (componentName) => {
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const mounted = Date.now();
    console.log(`[Performance] ${componentName} mounted`);

    return () => {
      const lifetime = Date.now() - mounted;
      console.log(`[Performance] ${componentName} unmounted after ${lifetime}ms`);
    };
  }, [componentName]);
};

/**
 * FPS (Frames Per Second) ölçer
 * @returns {number} Current FPS
 */
export const useFPS = () => {
  const fps = useRef(60);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let rafId;

    const measureFPS = () => {
      frameCount.current += 1;
      const currentTime = Date.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        // Her saniye FPS hesapla
        fps.current = Math.round((frameCount.current * 1000) / elapsed);

        if (__DEV__ && fps.current < 50) {
          console.warn(`[Performance] Low FPS detected: ${fps.current}`);
        }

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return fps.current;
};

/**
 * Memory kullanımını izler (sadece development)
 */
export const useMemoryMonitor = () => {
  useEffect(() => {
    if (!__DEV__ || !performance.memory) {
      return;
    }

    const interval = setInterval(() => {
      const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const limitMB = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
      const percentage = ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1);

      console.log(`[Performance] Memory: ${memoryMB}MB / ${limitMB}MB (${percentage}%)`);

      if (parseFloat(percentage) > 90) {
        console.warn('[Performance] High memory usage detected!');
      }
    }, 5000); // Her 5 saniyede bir

    return () => clearInterval(interval);
  }, []);
};

/**
 * Transaction başlat ve bitir (performance monitoring için)
 * @param {string} transactionName - Transaction adı
 * @returns {object} Transaction control objesi
 */
export const useTransaction = (transactionName) => {
  const transaction = useRef(null);

  const start = useCallback(() => {
    transaction.current = startTransaction(transactionName);
  }, [transactionName]);

  const finish = useCallback(() => {
    if (transaction.current) {
      transaction.current.finish();
      transaction.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      // Component unmount olurken transaction varsa bitir
      if (transaction.current) {
        transaction.current.finish();
      }
    };
  }, []);

  return { start, finish };
};

export default {
  useRenderTime,
  useTimedFunction,
  useComponentLifecycle,
  useFPS,
  useMemoryMonitor,
  useTransaction,
};
