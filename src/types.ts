import React from 'react';

export interface Process {
  id: string;
  name: string;
  component: React.ReactNode;
  focused: boolean;
  minimized: boolean;
  workspace: number;
  zIndex: number;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
}

export interface OSState {
  processes: Process[];
  activeProcessId: string | null;
}
