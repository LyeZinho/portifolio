import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Clock, Monitor } from 'lucide-react';
import { Process } from '../types';

export const Shell: React.FC<{ 
  currentWorkspace: number; 
  layoutMode: 'TILING' | 'FLOATING';
  onToggleLayout: () => void;
}> = ({ currentWorkspace, layoutMode, onToggleLayout }) => {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setCpu(Math.floor(Math.random() * 15) + 5);
      setRam(prev => Math.min(100, Math.max(20, prev + (Math.random() - 0.5))));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-brutal-black border-b-2 border-brutal-grey flex justify-between items-center px-4 text-[11px] font-mono tracking-widest uppercase">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleLayout}
          className="flex items-center gap-2 text-brutal-yellow hover:bg-brutal-yellow hover:text-brutal-black px-2 py-0.5 transition-colors border border-brutal-yellow"
        >
          <span className="w-2 h-2 bg-current"></span>
          <span>MODE: {layoutMode}</span>
        </button>
        <div className="flex items-center gap-4 opacity-70">
          <div className="flex items-center gap-1">
            <Cpu size={12} />
            <span>CPU: {cpu}%</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={12} />
            <span>RAM: {ram.toFixed(0)}MB</span>
          </div>
          <div className="flex items-center gap-1 text-brutal-yellow">
            <Monitor size={12} />
            <span>WS: {currentWorkspace}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 opacity-70">
          <Clock size={12} />
          <span>{time.toLocaleTimeString()}</span>
        </div>
        <div className="bg-brutal-grey px-2 py-0.5 text-white">
          USR: ROOT
        </div>
      </div>
    </div>
  );
};

interface TaskbarProps {
  onOpenApp: (name: string) => void;
  currentWorkspace: number;
  onSwitchWorkspace: (n: number) => void;
  processes: Process[];
  onRestoreProcess: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  onOpenApp, 
  currentWorkspace, 
  onSwitchWorkspace,
  processes,
  onRestoreProcess
}) => {
  const [search, setSearch] = useState('');

  return (
    <div className="h-10 bg-black/80 backdrop-blur-md border-t-2 border-brutal-grey flex items-center px-4 gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(n => (
          <button 
            key={n} 
            onClick={() => onSwitchWorkspace(n)}
            className={`w-6 h-6 flex items-center justify-center border border-white/20 text-[10px] transition-colors ${n === currentWorkspace ? 'bg-brutal-yellow text-brutal-black border-brutal-yellow' : 'hover:bg-white/10'}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
      <div className="flex gap-3">
        <button onClick={() => onOpenApp('ABOUT')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">About</button>
        <button onClick={() => onOpenApp('PROJECTS')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">Projects</button>
        <button onClick={() => onOpenApp('CONTACT')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">Contact</button>
        <button onClick={() => onOpenApp('DRYAD')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">Dryad</button>
        <button onClick={() => onOpenApp('DEVSCAFE')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">Dev's Café</button>
        <button onClick={() => onOpenApp('SETTINGS')} className="text-[10px] hover:text-brutal-yellow transition-colors uppercase tracking-tighter">Settings</button>
      </div>
      
      <div className="flex-1"></div>
      <input 
        type="text" 
        placeholder="Search..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="bg-black/50 border border-white/20 text-[10px] px-2 py-1 text-white placeholder:text-white/30 outline-none"
      />
      
      <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
      
      <div className="flex gap-2 overflow-x-auto max-w-[20%]">
        {processes.map(p => (
          <button
            key={p.id}
            onClick={() => onRestoreProcess(p.id)}
            className={`px-2 py-1 border text-[9px] uppercase tracking-tighter transition-all ${p.minimized ? 'border-white/20 opacity-50' : 'border-brutal-yellow bg-brutal-yellow/10'}`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};
