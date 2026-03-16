import React from 'react';
import { X, Minus } from 'lucide-react';
import { motion, useDragControls } from 'motion/react';

interface WindowFrameProps {
  title: string;
  active: boolean;
  pid: string;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (width: number, height: number) => void;
  children: React.ReactNode;
  zIndex: number;
  initialX: number;
  initialY: number;
  width: number | string;
  height: number | string;
  layoutMode: 'TILING' | 'FLOATING';
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  active,
  pid,
  onClose,
  onFocus,
  onMinimize,
  onUpdatePosition,
  onUpdateSize,
  children,
  zIndex,
  initialX,
  initialY,
  width,
  height,
  layoutMode
}) => {
  const dragControls = useDragControls();
  const resizeControls = useDragControls();

  const isFloating = layoutMode === 'FLOATING';

  return (
    <motion.section 
      drag={isFloating}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onDragEnd={(_, info) => {
        if (isFloating) {
          onUpdatePosition(initialX + info.offset.x, initialY + info.offset.y);
        }
      }}
      initial={isFloating ? { x: initialX, y: initialY, opacity: 0, scale: 0.95 } : { x: 0, y: 0, opacity: 0, scale: 0.95 }}
      animate={{ 
        x: isFloating ? initialX : 0, 
        y: isFloating ? initialY : 0, 
        opacity: 1, 
        scale: 1 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ 
        zIndex: isFloating ? zIndex : 1, 
        width: isFloating ? width : '100%', 
        height: isFloating ? height : '100%', 
        position: isFloating ? 'absolute' : 'relative' 
      }}
      className={`flex flex-col glass-panel brutal-border transition-shadow duration-150 overflow-hidden ${active ? 'brutal-border-active' : ''}`}
      onPointerDown={onFocus}
    >
      <header 
        onPointerDown={(e) => {
          if (isFloating) {
            dragControls.start(e);
          }
        }}
        style={{ cursor: isFloating ? 'grab' : 'default' }}
        className={`flex justify-between items-center px-3 py-1.5 font-mono select-none ${active ? 'bg-brutal-yellow text-brutal-black' : 'bg-brutal-grey text-white'}`}
      >
        <div className="flex items-center gap-3 pointer-events-none">
          <span className={`w-2 h-2 ${active ? 'bg-brutal-black animate-pulse' : 'bg-white/20'}`}></span>
          <span className="text-[10px] bg-black/20 px-1 py-0.5">PID:{pid}</span>
          <h1 className="text-xs font-bold tracking-wider uppercase">{title}</h1>
        </div>
        
        <nav className="flex gap-1 pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-5 h-5 flex items-center justify-center border border-current hover:bg-white/20 transition-colors"
          >
            <Minus size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-5 h-5 flex items-center justify-center border border-current hover:bg-brutal-red hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-hidden relative bg-black/10">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-5" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        <div className="h-full w-full overflow-auto">
          {children}
        </div>
      </main>
      
      <footer className="h-3 bg-black/10 flex justify-end items-center px-1 border-t border-white/5 relative">
        <motion.div
          drag={isFloating}
          dragControls={resizeControls}
          dragMomentum={false}
          dragListener={false}
          onDrag={(_, info) => {
            if (isFloating) {
              onUpdateSize(
                Math.max(200, (typeof width === 'number' ? width : 600) + info.offset.x),
                Math.max(150, (typeof height === 'number' ? height : 400) + info.offset.y)
              );
            }
          }}
          onPointerDown={(e) => {
            if (isFloating) {
              resizeControls.start(e);
            }
          }}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize bg-brutal-yellow/20 hover:bg-brutal-yellow/50"
        />
        <span className="text-[8px] text-white/20 tracking-tighter">:::</span>
      </footer>
    </motion.section>
  );
};
