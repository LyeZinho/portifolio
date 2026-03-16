import React, { useState, useEffect, useRef } from 'react';

export const Donut: React.FC = () => {
  const [frame, setFrame] = useState('');
  const A = useRef(0);
  const B = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let b = new Array(1760).fill(' ');
      let z = new Array(1760).fill(0);
      let A_val = A.current;
      let B_val = B.current;

      for (let j = 0; j < 6.28; j += 0.07) {
        for (let i = 0; i < 6.28; i += 0.02) {
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
          let x = Math.floor(40 + 30 * D * (l * h * m - t * n));
          let y = Math.floor(12 + 15 * D * (l * h * n + t * m));
          let o = x + 80 * y;
          let N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
          if (22 > y && y > 0 && x > 0 && 80 > x && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }

      let output = '';
      for (let k = 0; k < 1760; k++) {
        output += (k % 80 === 79) ? '\n' : b[k];
      }
      setFrame(output);
      A.current += 0.04;
      B.current += 0.02;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre className="font-mono text-[8px] leading-[8px] text-brutal-yellow">
      {frame}
    </pre>
  );
};
