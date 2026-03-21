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
          <p className="text-lg font-bold uppercase tracking-widest mb-6 text-brutal-yellow">
            Full-Stack Developer · Systems Architect · Language Designer
          </p>
          <p className="text-sm leading-relaxed mb-6 text-white/80">
            Prolific generalist who ships across the entire stack — from programming language compilers
            (Dryad, Rust/LLVM) to real-time web apps, CLI tools, and IoT prototypes.
            202 public repositories, 3,646 commits, 225 stars.
          </p>
          <div className="flex gap-4 text-center">
            <div className="border border-brutal-yellow px-4 py-2 flex-1">
              <div className="text-2xl font-black text-white">202</div>
              <div className="text-[10px] uppercase tracking-widest">Repos</div>
            </div>
            <div className="border border-brutal-yellow px-4 py-2 flex-1">
              <div className="text-2xl font-black text-white">3,646</div>
              <div className="text-[10px] uppercase tracking-widest">Commits</div>
            </div>
            <div className="border border-brutal-yellow px-4 py-2 flex-1">
              <div className="text-2xl font-black text-white">225</div>
              <div className="text-[10px] uppercase tracking-widest">Stars</div>
            </div>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <Donut />
          <h2 className="text-lg font-bold text-white">Education:</h2>
          <p className="text-white/80">
            <strong className="text-brutal-yellow">TGPSI</strong> — IT Systems Management &amp; Programming
          </p>
          <p className="text-white/50 text-xs uppercase tracking-widest">Escola Profissional da Batalha</p>
          <p className="text-white/80">
            <strong className="text-brutal-yellow">PSI</strong> — Programming and Information Systems
          </p>
          <p className="text-white/50 text-xs uppercase tracking-widest">Polytechnic Institute of Leiria</p>
          <h2 className="text-lg font-bold text-white mt-4">Awards:</h2>
          <ul className="space-y-1 text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-brutal-yellow mt-0.5">▸</span>
              <span>SHU 2023 (Italy) — Best Digital Innovation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brutal-yellow mt-0.5">▸</span>
              <span>Apps for Good — Social Jury Prize</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brutal-yellow mt-0.5">▸</span>
              <span>IoT Finalist — &quot;Isto é uma Ideia&quot;</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-brutal-yellow pt-8">
        <h2 className="text-lg font-bold text-white mb-4">Technical DNA:</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-brutal-yellow mb-2">Active</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { lang: 'TypeScript', repos: 19 },
                { lang: 'Go', repos: 34 },
                { lang: 'JavaScript', repos: 40 },

                { lang: 'C#', repos: 17 },
                { lang: 'Python', repos: 7 },
                { lang: 'Rust', repos: 6 },
                { lang: 'PHP', repos: 8 },

              ].map((t) => (
                <span key={t.lang} className="border border-brutal-yellow px-2 py-1 text-xs text-brutal-yellow">
                  {t.lang} <span className="text-white/50">({t.repos})</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-2">Legacy</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { lang: 'C++', repos: 2 },
                { lang: 'Ruby', repos: 3 },
                { lang: 'Java', repos: 4 },
              ].map((t) => (
                <span key={t.lang} className="border border-white/20 px-2 py-1 text-xs text-white/50">
                  {t.lang} <span className="text-white/30">({t.repos})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CursorPlaceholder: React.FC = () => (
  <div className="w-full h-32 mb-4 border border-white/10 flex items-center justify-center bg-black font-mono text-brutal-yellow text-lg">
    <span className="animate-pulse">▌</span>
  </div>
);

export const Projects: React.FC = () => {
  const featured = [
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
      name: 'CleanServe',
      desc: 'Minimalist HTTP server framework',
      tech: 'TypeScript, Node.js',
      features: ['Lightweight', 'Middleware', '24 commits'],
      link: 'https://github.com/LyeZinho/CleanServe',
      animation: <Plasma />
    },
  ];

  const more = [
    {
      name: 'VOX Chat',
      desc: 'Real-time encrypted chat with E2E encryption',
      tech: 'TypeScript, WebSockets, Crypto',
      features: ['E2E Encryption', 'Real-time', '21 commits'],
      link: 'https://github.com/LyeZinho/vox',
    },
    {
      name: 'ScrapEngine',
      desc: 'High-performance web scraping framework',
      tech: 'TypeScript, Puppeteer',
      features: ['Parallel Scraping', '44 commits', '1 star'],
      link: 'https://github.com/LyeZinho/ScrapEngine',
    },
    {
      name: 'GitScore',
      desc: 'Developer Leaderboard via GitHub',
      tech: 'Next.js, TailwindCSS, Chart.js',
      features: ['GitScore', 'Badges', 'Radar Charts', 'Real-time'],
      link: 'https://gitscore.devscafe.org',
    },
    {
      name: 'danbooru-sdk',
      desc: 'Type-safe API client for Danbooru',
      tech: 'TypeScript',
      features: ['Type-safe', 'Full API Coverage', '14 commits', '1 star'],
      link: 'https://github.com/LyeZinho/danbooru-sdk',
    },
  ];

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="grid grid-cols-1 gap-4">
        {featured.map((p, i) => (
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
      <div className="border-t border-white/10 pt-4">
        <h2 className="text-xs uppercase tracking-widest text-brutal-yellow mb-4">More Projects</h2>
        <div className="grid grid-cols-1 gap-4">
          {more.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="block p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <CursorPlaceholder />
              <h3 className="text-brutal-yellow font-bold">{p.name}</h3>
              <p className="text-sm">{p.desc}</p>
              <p className="text-xs text-white/50 mt-1">Tech: {p.tech}</p>
              <p className="text-xs text-white/50">Features: {p.features.join(', ')}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Stats: React.FC = () => {
  const languages = [
    { name: 'JavaScript', pct: 38, color: 'bg-brutal-yellow' },
    { name: 'TypeScript', pct: 17, color: 'bg-white' },
    { name: 'C#', pct: 17, color: 'bg-brutal-red' },
    { name: 'HTML', pct: 10, color: 'bg-green-500' },
    { name: 'C', pct: 8, color: 'bg-blue-500' },
    { name: 'PHP', pct: 6, color: 'bg-purple-500' },
    { name: 'Python', pct: 5, color: 'bg-cyan-500' },
  ];

  const techDna = [
    { name: 'TypeScript', repos: 19, status: 'ACTIVE' as const },
    { name: 'Go', repos: 34, status: 'STABLE' as const },
    { name: 'Python', repos: 7, status: 'ACTIVE' as const },
    { name: 'Rust', repos: 6, status: 'ACTIVE' as const },
    { name: 'PHP', repos: 8, status: 'ACTIVE' as const },
    { name: 'JavaScript', repos: 40, status: 'LEGACY' as const },
    { name: 'C#', repos: 17, status: 'LEGACY' as const },
    { name: 'C++', repos: 2, status: 'LEGACY' as const },
    { name: 'Ruby', repos: 3, status: 'LEGACY' as const },
    { name: 'Java', repos: 4, status: 'LEGACY' as const },
  ];

  const statusColor = (s: 'ACTIVE' | 'STABLE' | 'LEGACY') => {
    switch (s) {
      case 'ACTIVE': return 'border-green-500 text-green-500';
      case 'STABLE': return 'border-brutal-yellow text-brutal-yellow';
      case 'LEGACY': return 'border-brutal-red text-brutal-red';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-black text-white p-8 font-mono space-y-10">
      {/* Section 1: GitHub Overview */}
      <div>
        <h2 className="text-lg font-bold text-brutal-yellow uppercase tracking-widest mb-4">GitHub Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '202', label: 'Repos' },
            { value: '3,646', label: 'Commits' },
            { value: '225', label: 'Stars' },
          ].map((s) => (
            <div key={s.label} className="border border-brutal-yellow p-4 text-center">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-brutal-yellow mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Language Distribution */}
      <div>
        <h2 className="text-lg font-bold text-brutal-yellow uppercase tracking-widest mb-4">Language Distribution</h2>
        <div className="space-y-2">
          {languages.map((l) => (
            <div key={l.name} className="flex items-center gap-3 text-xs">
              <span className="w-20 text-right text-white/70 uppercase tracking-tight shrink-0">{l.name}</span>
              <div className="flex-1 h-4 bg-white/5 border border-white/10 relative">
                <div className={`h-full ${l.color}`} style={{ width: `${l.pct}%` }} />
              </div>
              <span className="w-8 text-white/50 text-right">{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Tech DNA */}
      <div>
        <h2 className="text-lg font-bold text-brutal-yellow uppercase tracking-widest mb-4">Tech DNA</h2>
        <div className="grid grid-cols-2 gap-2">
          {techDna.map((t) => (
            <div key={t.name} className="flex items-center justify-between border border-white/10 px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{t.name}</span>
                <span className="text-white/40">{t.repos} repos</span>
              </div>
              <span className={`border px-1.5 py-0.5 text-[9px] uppercase tracking-widest ${statusColor(t.status)}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Classification */}
      <div className="border-t border-brutal-yellow pt-6">
        <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Classification</div>
        <div className="text-2xl font-black text-brutal-yellow">PROLIFIC GENERALIST</div>
        <p className="text-sm text-white/60 mt-1">Ships across the entire stack — compilers to web apps</p>
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
