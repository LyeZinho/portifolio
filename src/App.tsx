import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell, Taskbar } from './components/Shell';
import { Compositor } from './components/Compositor';
import { About, Projects, Contact, DryadBrowser, DevsCafeBrowser, Settings, DryadPage, Stats } from './components/Apps';
import { Process } from './types';

export default function App() {
  const [layoutMode, setLayoutMode] = useState<'TILING' | 'FLOATING'>('TILING');
  const [theme, setTheme] = useState('dark');
  const [wallpaper, setWallpaper] = useState('concrete');
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: '1024',
      name: 'ABOUT',
      component: <About />,
      focused: true,
      minimized: false,
      workspace: 1,
      zIndex: 10,
      x: 50,
      y: 50,
      width: 600,
      height: 400
    }
  ]);
  const [activeProcessId, setActiveProcessId] = useState<string | null>('1024');
  const [currentWorkspace, setCurrentWorkspace] = useState(1);

  const openApp = useCallback((name: string) => {
    const id = Math.floor(Math.random() * 9000 + 1000).toString();
    let component;

    switch (name) {
      case 'ABOUT': component = <About />; break;
      case 'PROJECTS': component = <Projects />; break;
      case 'CONTACT': component = <Contact />; break;
      case 'DRYAD': component = <DryadPage />; break;
      case 'DEVSCAFE': component = <DevsCafeBrowser />; break;
      case 'STATS': component = <Stats />; break;
      //case 'SETTINGS': component = <Settings theme={theme} setTheme={setTheme} wallpaper={wallpaper} setWallpaper={setWallpaper} layoutMode={layoutMode} setLayoutMode={setLayoutMode} />; break;
      default: component = <div>APP_ERROR</div>;
    }

    const maxZ = processes.length > 0 ? Math.max(...processes.map(p => p.zIndex)) : 0;
    const offset = (processes.length % 10) * 20;

    const newProcess: Process = {
      id,
      name,
      component,
      focused: true,
      minimized: false,
      workspace: currentWorkspace,
      zIndex: maxZ + 1,
      x: 100 + offset,
      y: 100 + offset,
      width: 600,
      height: 400
    };
    setProcesses(prev => prev.map(p => ({ ...p, focused: false })).concat(newProcess));
    setActiveProcessId(id);
  }, [processes, currentWorkspace, theme, wallpaper, layoutMode]);

  const closeProcess = useCallback((id: string) => {
    setProcesses(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (activeProcessId === id && filtered.length > 0) {
        setActiveProcessId(filtered[filtered.length - 1].id);
      } else if (filtered.length === 0) {
        setActiveProcessId(null);
      }
      return filtered;
    });
  }, [activeProcessId]);

  const focusProcess = useCallback((id: string) => {
    setProcesses(prev => {
      const maxZ = Math.max(...prev.map(p => p.zIndex), 0);
      return prev.map(p => ({
        ...p,
        focused: p.id === id,
        minimized: p.id === id ? false : p.minimized,
        zIndex: p.id === id ? maxZ + 1 : p.zIndex
      }));
    });
    setActiveProcessId(id);
  }, []);

  const minimizeProcess = useCallback((id: string) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, minimized: true, focused: false } : p));
    setActiveProcessId(null);
  }, []);

  const restoreProcess = useCallback((id: string) => {
    focusProcess(id);
  }, [focusProcess]);

  const updateProcessPosition = useCallback((id: string, x: number, y: number) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(prev => prev === 'TILING' ? 'FLOATING' : 'TILING');
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden selection:bg-brutal-yellow selection:text-brutal-black">
      {/* Background Overlay for texture */}
      <div className="absolute inset-0 pointer-events-none bg-black/40 mix-blend-multiply"></div>
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20"></div>

      <Shell
        currentWorkspace={currentWorkspace}
        layoutMode={layoutMode}
        onToggleLayout={toggleLayoutMode}
      />

      <main className="flex-1 relative flex overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key="compositor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex"
          >
            <Compositor
              processes={processes.filter(p => p.workspace === currentWorkspace)}
              activeProcessId={activeProcessId}
              layoutMode={layoutMode}
              onCloseProcess={closeProcess}
              onFocusProcess={focusProcess}
              onMinimizeProcess={minimizeProcess}
              onUpdatePosition={updateProcessPosition}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <Taskbar
        onOpenApp={openApp}
        currentWorkspace={currentWorkspace}
        onSwitchWorkspace={setCurrentWorkspace}
        processes={processes}
        onRestoreProcess={restoreProcess}
      />

      {/* CRT Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
