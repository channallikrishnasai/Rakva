"use client";

import React, { createContext, useContext } from 'react';
import { useGeographicContext, type GeographicState } from './useGeographicContext';

const GeographicContextContext = createContext<GeographicState | null>(null);

export function GeographicProvider({ children }: { children: React.ReactNode }) {
  const state = useGeographicContext();
  return (
    <GeographicContextContext.Provider value={state}>
      {children}
    </GeographicContextContext.Provider>
  );
}

export function useGeographic() {
  const context = useContext(GeographicContextContext);
  if (!context) {
    throw new Error('useGeographic must be used within a GeographicProvider');
  }
  return context;
}
