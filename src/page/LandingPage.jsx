import { useState, useEffect } from 'react';
import {
  Gamepad2,
  ArrowRight,
  ChevronRight,
  Layers,
  Zap,
  ShieldCheck,
  Trophy,
  MousePointer2,
  MoveUpRight,
  Move
} from 'lucide-react';
import { Link } from 'react-router';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Nav = () => (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            DinoSaur
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
          {/* <a href="#how-to-play" className="hover:text-indigo-400 transition-colors">How to Play</a> */}
          <a href="#rules" className="hover:text-indigo-400 transition-colors">Rules</a>
          <Link to="/ruzzle">
            <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-all active:scale-95">
              Play Now
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">
            Live Multiplayer • Play Online
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Connect Letters.<br />
          <span className="text-yellow-500">Defeat Real Players.</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          A real-time online multiplayer word puzzle game. Challenge friends or random opponents, form words strategically, and climb the live leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/ruzzle">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Play Online Now <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <a href="#rules">
            <button className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-700 hover:bg-slate-700 transition-all active:scale-95">
              How to Play
            </button>
          </a>
        </div>
      </div>
    </section>
  );


  const RulesSection = () => (
    <section id="rules" className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Mechanics</h2>
          <p className="text-slate-400">Master the movement system to dominate the game.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Move className="text-indigo-500" /> Movement Logic
              </h3>
              <p className="text-slate-400 mb-6">
                Once the first cell is selected, precision is key. Your path must follow strictly defined adjacency rules.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <span className="text-indigo-400 font-bold block mb-1">Standard</span>
                  <div className="text-2xl flex gap-2">⬆️ ⬇️ ⬅️ ➡️</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <span className="text-indigo-400 font-bold block mb-1">Diagonal</span>
                  <div className="text-2xl flex gap-2">↖️ ↗️ ↘️ ↙️</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
              <ShieldCheck className="text-indigo-500 shrink-0" />
              <p className="text-sm text-indigo-300">
                <strong>Anti-Cheat:</strong> Our engine validates pathing in real-time. Only continuous, adjacent chains are accepted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-6 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl">
            {/* Mock Grid to visualize rules */}
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-all
                  ${i === 4 ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse' :
                    i === 0 || i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7 || i === 8
                      ? 'bg-slate-700 border-slate-600 text-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-700'}`}
              >
                {i === 4 ? 'W' : String.fromCharCode(65 + i)}
                {i !== 4 && <div className="absolute opacity-20"><MoveUpRight className="w-6 h-6 rotate-45" /></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Zap className="w-8 h-8 text-amber-400" />,
            title: "Natural Flow",
            desc: "The 8-way movement system feels fluid and matches classic board game logic like Boggle."
          },
          {
            icon: <Layers className="w-8 h-8 text-indigo-500" />,
            title: "Strategic Depth",
            desc: "Diagonal moves open up 2x more word possibilities than standard grid games."
          },
          {
            icon: <Trophy className="w-8 h-8 text-emerald-400" />,
            title: "Fair Play",
            desc: "Hardcoded adjacency rules prevent 'jumping' across the board, ensuring a skill-based experience."
          }
        ].map((feat, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-slate-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-indigo-500" />
          <span className="font-bold text-white">WordRush Gaming</span>
        </div>
        <p className="text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} WordRush. All rights reserved. Built for word lovers.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#4817dc] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      <Nav />
      <main>
        <Hero />

        <RulesSection />
        <Features />

        {/* Call to Action */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-linear-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
            <h2 className="text-4xl font-bold text-white mb-6">Ready to test your vocabulary?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of players connecting letters diagonally, vertically, and horizontally.
            </p>
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-black text-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
              PLAY FOR FREE
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;