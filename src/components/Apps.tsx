import React from 'react';
import { Donut } from './Donut';
import { BlackHole, Plasma, Bonsai } from './AsciiAnimations';
import { DryadPage } from './DryadPage';

export { DryadPage };

export const About: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-black text-brutal-yellow p-8 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-r border-brutal-yellow pr-8">
          <h1 className="text-4xl font-black tracking-tighter mb-4 text-white">PEDRO KALEB</h1>
          <p className="text-xl font-bold uppercase tracking-widest mb-8 text-brutal-yellow">Full Stack Developer | Founder of Dryad</p>
          <p className="text-sm uppercase leading-relaxed mb-4">
            I am a developer passionate about building systems from scratch and solving complex problems.
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <Donut />
          <h2 className="text-lg font-bold text-white">What drives me:</h2>
          <p>As the founder of <strong>Dryad</strong>, a linear and modular programming language, I explored the foundations of systems engineering. In parallel, I developed <strong>FortiVault</strong>, a decentralized password manager.</p>
          <h2 className="text-lg font-bold text-white">Achievements:</h2>
          <ul className="list-disc list-inside">
            <li>SHU 2023 (Italy): Winner "Best Digital Innovation"</li>
            <li>IoT Finalist "Isto é uma ideia"</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-brutal-yellow pt-8">
        <h2 className="text-lg font-bold text-white mb-2">Technical Toolkit:</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <p><strong>Languages:</strong> C#, JS/TS, Python, C, PHP</p>
          <p><strong>Frontend:</strong> React.js, Next.js</p>
          <p><strong>Backend:</strong> Node.js, SQL, MongoDB, Redis</p>
          <p><strong>DevOps:</strong> Docker, Linux, Cryptography</p>
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const projects = [
    { 
      name: 'Dryad Language', 
      desc: 'Rust-based language (Async/Await, OOP)', 
      tech: 'Rust, LLVM',
      features: ['Async/Await', 'OOP', 'Custom GUI (IPE)'],
      link: 'https://github.com/Dryad-lang/Dryad',
      animation: <Bonsai />
    },
    { 
      name: 'FortiVault', 
      desc: 'Decentralized password manager', 
      tech: 'Rust, Web3',
      features: ['High-security', 'Decentralized'],
      link: 'https://github.com/LyeZinho/FortiVault',
      animation: <BlackHole />
    },
    { 
      name: 'GitScore', 
      desc: 'Developer Leaderboard via GitHub', 
      tech: 'Next.js, TailwindCSS, Chart.js',
      features: ['GitScore', 'Badges', 'Radar Charts', 'Real-time'],
      link: 'https://gitscore.devscafe.org',
      animation: <Plasma />
    },
  ];

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((p, i) => (
          <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="block p-4 border border-white/10 hover:bg-white/5 transition-colors">
            <div className="w-full h-32 mb-4 border border-white/10 flex items-center justify-center bg-black overflow-hidden">
              {p.animation}
            </div>
            <h3 className="text-brutal-yellow font-bold">{p.name}</h3>
            <p className="text-sm">{p.desc}</p>
            <p className="text-xs text-white/50 mt-1">Tech: {p.tech}</p>
            <p className="text-xs text-white/50">Features: {p.features.join(', ')}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export const Settings: React.FC<{
  theme: string;
  setTheme: (t: string) => void;
  wallpaper: string;
  setWallpaper: (w: string) => void;
  layoutMode: 'TILING' | 'FLOATING';
  setLayoutMode: (l: 'TILING' | 'FLOATING') => void;
}> = ({ theme, setTheme, wallpaper, setWallpaper, layoutMode, setLayoutMode }) => {
  return (
    <div className="p-6 font-mono space-y-6 h-full overflow-y-auto">
      <h2 className="text-brutal-yellow text-lg">SETTINGS</h2>
      
      <div className="space-y-2">
        <label className="block text-xs uppercase opacity-70">Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-brutal-black border border-white/20 p-2 w-full">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase opacity-70">Wallpaper</label>
        <input type="text" value={wallpaper} onChange={(e) => setWallpaper(e.target.value)} className="bg-brutal-black border border-white/20 p-2 w-full" />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase opacity-70">Layout Mode</label>
        <button onClick={() => setLayoutMode(layoutMode === 'TILING' ? 'FLOATING' : 'TILING')} className="bg-brutal-yellow text-brutal-black p-2 w-full font-bold">
          {layoutMode}
        </button>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  return (
    <div className="p-6 font-mono space-y-4 h-full">
      <h2 className="text-brutal-yellow text-lg">CONTACT</h2>
      <p>Email: <a href="mailto:pedrokalebdej1@gmail.com" className="underline">pedrokalebdej1@gmail.com</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/pedrokalebdej1/" className="underline">linkedin.com/in/pedrokalebdej1</a></p>
      <p>GitHub: <a href="https://github.com/LyeZinho" className="underline">github.com/LyeZinho</a></p>
    </div>
  );
};

export const DryadBrowser: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-brutal-yellow p-6 font-mono flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">DRYAD_LANG</h2>
      <p className="mb-4">This site cannot be embedded due to security restrictions.</p>
      <a href="https://dryadlang.org/" target="_blank" rel="noopener noreferrer" className="border border-brutal-yellow px-4 py-2 hover:bg-brutal-yellow hover:text-black transition-colors">
        VISIT_SITE_EXTERNALLY
      </a>
    </div>
  );
};

export const DevsCafeBrowser: React.FC = () => {
  return (
    <div className="w-full h-full bg-white">
      <iframe 
        src="https://devscafe.org/" 
        className="w-full h-full"
        title="Dev's Café Website"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
