import React from 'react';
import { Process } from '../types';
import { WindowFrame } from './WindowFrame';
import { AnimatePresence } from 'motion/react';

interface CompositorProps {
  processes: Process[];
  activeProcessId: string | null;
  layoutMode: 'TILING' | 'FLOATING';
  onCloseProcess: (id: string) => void;
  onFocusProcess: (id: string) => void;
  onMinimizeProcess: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
}

const TilingNode: React.FC<{
  processes: Process[];
  depth: number;
  activeProcessId: string | null;
  onCloseProcess: (id: string) => void;
  onFocusProcess: (id: string) => void;
  onMinimizeProcess: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
  layoutMode: 'TILING' | 'FLOATING';
}> = ({ processes, depth, activeProcessId, onCloseProcess, onFocusProcess, onMinimizeProcess, onUpdatePosition, onUpdateSize, layoutMode }) => {
  if (processes.length === 0) return null;
  
  if (processes.length === 1) {
    const process = processes[0];
    return (
      <div className="w-full h-full p-1.5">
        <WindowFrame
          title={process.name}
          pid={process.id}
          active={process.id === activeProcessId}
          onClose={() => onCloseProcess(process.id)}
          onFocus={() => onFocusProcess(process.id)}
          onMinimize={() => onMinimizeProcess(process.id)}
          onUpdatePosition={(x, y) => onUpdatePosition(process.id, x, y)}
          onUpdateSize={(w, h) => onUpdateSize(process.id, w, h)}
          zIndex={process.zIndex}
          initialX={process.x}
          initialY={process.y}
          width={process.width}
          height={process.height}
          layoutMode={layoutMode}
        >
          {process.component}
        </WindowFrame>
      </div>
    );
  }

  const mid = Math.ceil(processes.length / 2);
  const leftProcesses = processes.slice(0, mid);
  const rightProcesses = processes.slice(mid);
  
  // Alternate split direction: depth 0 = horizontal (side-by-side), depth 1 = vertical (top-bottom)
  const isVerticalSplit = depth % 2 === 0;

  return (
    <div className={`flex w-full h-full ${isVerticalSplit ? 'flex-row' : 'flex-col'}`}>
      <div className="flex-1 overflow-hidden">
        <TilingNode 
          processes={leftProcesses} 
          depth={depth + 1} 
          activeProcessId={activeProcessId}
          onCloseProcess={onCloseProcess}
          onFocusProcess={onFocusProcess}
          onMinimizeProcess={onMinimizeProcess}
          onUpdatePosition={onUpdatePosition}
          onUpdateSize={onUpdateSize}
          layoutMode={layoutMode}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TilingNode 
          processes={rightProcesses} 
          depth={depth + 1} 
          activeProcessId={activeProcessId}
          onCloseProcess={onCloseProcess}
          onFocusProcess={onFocusProcess}
          onMinimizeProcess={onMinimizeProcess}
          onUpdatePosition={onUpdatePosition}
          onUpdateSize={onUpdateSize}
          layoutMode={layoutMode}
        />
      </div>
    </div>
  );
};

export const Compositor: React.FC<CompositorProps> = ({
  processes,
  activeProcessId,
  layoutMode,
  onCloseProcess,
  onFocusProcess,
  onMinimizeProcess,
  onUpdatePosition,
  onUpdateSize
}) => {
  const visibleProcesses = processes.filter(p => !p.minimized);
  const isFloating = layoutMode === 'FLOATING';

  return (
    <div className="flex-1 relative overflow-hidden p-1.5">
      <AnimatePresence mode="popLayout">
        {isFloating ? (
          visibleProcesses.map((process) => (
            <WindowFrame
              key={process.id}
              title={process.name}
              pid={process.id}
              active={process.id === activeProcessId}
              onClose={() => onCloseProcess(process.id)}
              onFocus={() => onFocusProcess(process.id)}
              onMinimize={() => onMinimizeProcess(process.id)}
              onUpdatePosition={(x, y) => onUpdatePosition(process.id, x, y)}
              onUpdateSize={(w, h) => onUpdateSize(process.id, w, h)}
              zIndex={process.zIndex}
              initialX={process.x}
              initialY={process.y}
              width={process.width}
              height={process.height}
              layoutMode={layoutMode}
            >
              {process.component}
            </WindowFrame>
          ))
        ) : (
          <TilingNode 
            processes={visibleProcesses} 
            depth={0}
            activeProcessId={activeProcessId}
            onCloseProcess={onCloseProcess}
            onFocusProcess={onFocusProcess}
            onMinimizeProcess={onMinimizeProcess}
            onUpdatePosition={onUpdatePosition}
            onUpdateSize={onUpdateSize}
            layoutMode={layoutMode}
          />
        )}
      </AnimatePresence>
      {visibleProcesses.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-white/20 font-mono italic pointer-events-none">
          NENHUM PROCESSO ATIVO NESTE WORKSPACE.
        </div>
      )}
    </div>
  );
};
