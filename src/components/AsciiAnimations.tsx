import React, { useState, useEffect, useRef } from 'react';
import { Bonsai } from './BonsaiGenerator';

export { Bonsai };

export const Donut: React.FC = () => {
  const [frame, setFrame] = useState('');
  const A = useRef(0);
  const B = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let b = new Array(2400).fill(' '); // Increased size
      let z = new Array(2400).fill(0);
      let A_val = A.current;
      let B_val = B.current;

      for (let j = 0; j < 6.28; j += 0.03) {
        for (let i = 0; i < 6.28; i += 0.01) {
          let c = Math.sin(i);
          let d = Math.cos(j);
          let e = Math.sin(A_val);
          let f = Math.sin(j);
          let g = Math.cos(A_val);
          let h = d + 2;
          let D = 1 / (c * h * e + f * g + 5);
          let l = Math.cos(i);
          let m = Math.cos(B_val);
          let n = Math.sin(B_val);
          let t = c * h * g - f * e;
          let x = Math.floor(40 + 50 * D * (l * h * m - t * n));
          let y = Math.floor(12 + 25 * D * (l * h * n + t * m));
          let o = x + 80 * y;
          let N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
          if (30 > y && y > 0 && x > 0 && 80 > x && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }

      let output = '';
      for (let k = 0; k < 2400; k++) {
        output += (k % 80 === 79) ? '\n' : b[k];
      }
      setFrame(output);
      A.current += 0.08;
      B.current += 0.04;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return <pre className="w-full h-full font-mono text-[5px] leading-[5px] text-brutal-yellow flex items-center justify-center whitespace-pre">{frame}</pre>;
};

export const BlackHole: React.FC = () => {
  const [frame, setFrame] = useState('');
  const time = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let output = '';
      const t = time.current;
      const rows = 35;
      const cols = 90;
      for (let y = 0; y < rows; y++) {
        let row = '';
        for (let x = 0; x < cols; x++) {
          const dx = (x - cols / 2) * 1.0;
          const dy = (y - rows / 2) * 2.0;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Event horizon (distinct black center)
          if (dist < 7) {
            row += ' '; 
          } 
          // Accretion disk (swirling and flickering)
          else if (dist < 25) {
            const angle = Math.atan2(dy, dx) + t;
            const radial = Math.sin(dist * 0.4 - t * 3);
            const flicker = Math.random() > 0.85 ? 1.3 : 0.7;
            const val = (Math.sin(angle * 3 + dist * 0.2) * radial) * flicker;
            
            if (val > 0.6) row += '@';
            else if (val > 0.2) row += '#';
            else if (val > -0.2) row += '+';
            else row += '.';
          } 
          else {
            row += ' ';
          }
        }
        output += row + '\n';
      }
      setFrame(output);
      time.current += 0.08;
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return <pre className="w-full h-full font-mono text-[5px] leading-[5px] text-orange-500 flex items-center justify-center whitespace-pre">{frame}</pre>;
};

export const Plasma: React.FC = () => {
  const [frame, setFrame] = useState('');
  const time = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let output = '';
      const t = time.current;
      const rows = 40;
      const cols = 100;
      for (let y = 0; y < rows; y++) {
        let row = '';
        for (let x = 0; x < cols; x++) {
          const v = Math.sin(x / 8 + t) + Math.sin((y + t) / 5) + Math.sin((x + y + t) / 6) + Math.sin(Math.sqrt(x * x + y * y) / 8 + t);
          const chars = ".:-=+*#%@";
          row += chars[Math.floor((v + 4) / 8 * chars.length)];
        }
        output += row + '\n';
      }
      setFrame(output);
      time.current += 0.05;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return <pre className="w-full h-full font-mono text-[4px] leading-[4px] text-purple-500 flex items-center justify-center whitespace-pre">{frame}</pre>;
};
