'use client';

import { useEffect } from 'react';

export function FarcasterSDK() {
  useEffect(() => {
    // Dynamically import Farcaster SDK only on client side
    const initSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        // Initialize SDK context
        await sdk.context;
        
        // Signal that the app is ready
        sdk.actions.ready();
        
        console.log('✅ Farcaster SDK initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Farcaster SDK:', error);
      }
    };

    initSDK();
  }, []);

  return null; // This component doesn't render anything
}
