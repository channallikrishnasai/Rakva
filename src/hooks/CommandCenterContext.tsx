"use client";

import React, { createContext, useContext } from 'react';
import { useCommandCenterState, CommandCenterState } from './useCommandCenterState';

const CommandCenterContext = createContext<CommandCenterState | null>(null);

export function CommandCenterProvider({ children }: { children: React.ReactNode }) {
  const state = useCommandCenterState();
  return (
    <CommandCenterContext.Provider value={state}>
      {children}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const context = useContext(CommandCenterContext);
  if (!context) {
    throw new Error('useCommandCenter must be used within a CommandCenterProvider');
  }
  return context;
}
