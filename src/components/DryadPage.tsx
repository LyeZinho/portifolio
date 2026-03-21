import React from 'react';
import { Bonsai } from './BonsaiGenerator';

export const DryadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <nav className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold tracking-tighter">Dryad</h1>
      </nav>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-6xl font-bold tracking-tighter mb-4">Naturally.</h2>
          <p className="text-xl text-zinc-400 mb-8">
            A multi-paradigm, dynamically typed language with optional static typing. Built for humans, inspired by nature.
          </p>
          <div className="space-x-4">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-500"
              onClick={() => window.open('https://dryadlang.org/download', '_blank')}
            >Get Dryad</button>
            <button className="border border-zinc-700 px-6 py-2 rounded-lg font-medium hover:bg-zinc-800"
              onClick={() => window.open('https://dryadlang.org/docs', '_blank')}
            >Read Docs</button>
          </div>
        </div>
        <div className="flex justify-center">
          <Bonsai />
        </div>
      </main>

      <section className="mt-24 bg-zinc-900 p-8 rounded-2xl">
        <h3 className="text-sm font-mono text-emerald-400 mb-2">tree.dryad</h3>
        <pre className="font-mono text-sm bg-black p-6 rounded-lg text-zinc-300">
          {`#<console_io>

class Tree {
  name = "Oak";

  grow() {
    println(this.name + " is growing!");
  }
}

let myTree = new Tree();
myTree.grow();

// Async & Threads built-in
thread function photosynthesize() {
  println("Absorbing light...");
}`}
        </pre>
      </section>

      <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Familiar Syntax", desc: "JS/TS-inspired syntax means you already know how to write Dryad." },
          { title: "Optional Typing", desc: "Start dynamic, add types later. Perfect for rapid prototyping." },
          { title: "Native Concurrency", desc: "Built-in OS threads, async/await, and mutexes." }
        ].map(feat => (
          <div key={feat.title} className="p-6 border border-zinc-800 rounded-xl">
            <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
            <p className="text-zinc-400">{feat.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-24 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        <p>© 2026 Dryad Language Contributors. Released under the MIT License.</p>
      </footer>
    </div>
  );
};
