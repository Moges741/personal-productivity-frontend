'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function Hydration() {
  const { setAuthReady } = useAuthStore();

  useEffect(() => {
    // Force rehydration of persisted state
    useAuthStore.persist.rehydrate();
    // Mark as ready after rehydration
    setAuthReady(true);
  }, [setAuthReady]);

  return null;
}