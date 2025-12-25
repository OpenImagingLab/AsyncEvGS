import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RESEARCH_DATA } from './constants';
import type { MetricPoint, ComparisonItem, ChatMessage } from './types';

// Icons
const Icons = {
  PDF: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  GitHub: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  YouTube: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>,
  Database: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

// --- Components ---

const ComparisonSlider: React.FC<{ item: ComparisonItem }> = ({ item }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setPosition(percentage);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-center mb-2">{item.label}</h3>
      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-200 shadow-sm"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* Right Image (Background) */}
        <img 
          src={item.imageRight} 
          alt="Right" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Left Image (Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img 
            src={item.imageLeft} 
            alt="Left" 
            className="absolute top-0 left-0 max-w-none h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%' }} 
          />
        </div>

        {/* Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)"/></svg>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Previous Method</div>
        <div className="absolute bottom-4 right-4 bg-primary/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Ours</div>
      </div>
      <p className="text-sm text-slate-500 text-center mt-2 italic">{item.description}</p>
    </div>
  );
};

const MetricsChart: React.FC<{ data: MetricPoint[] }> = ({ data }) => {
  const maxEpoch = Math.max(...data.map(d => d.epoch));
  const maxPSNR = Math.max(...data.map(d => d.psnr)) * 1.1;

  // Simple SVG Line Chart
  const width = 600;
  const height = 300;
  const padding = 40;
  
  const xScale = (val: number) => padding + (val / maxEpoch) * (width - 2 * padding);
  const yScale = (val: number) => height - padding - (val / maxPSNR) * (height - 2 * padding);

  const points = data.map(d => `${xScale(d.epoch)},${yScale(d.psnr)}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto font-sans text-xs">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <line 
              key={t}
              x1={padding} 
              y1={height - padding - t * (height - 2 * padding)} 
              x2={width - padding} 
              y2={height - padding - t * (height - 2 * padding)} 
              stroke="#e2e8f0" 
              strokeDasharray="4 4" 
            />
          ))}

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" />

          {/* Line */}
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3" />
          
          {/* Points */}
          {data.map((d, i) => (
            <circle 
              key={i} 
              cx={xScale(d.epoch)} 
              cy={yScale(d.psnr)} 
              r="4" 
              fill="white" 
              stroke="#2563eb" 
              strokeWidth="2" 
            />
          ))}

          {/* Labels */}
          <text x={width/2} y={height - 5} textAnchor="middle" fill="#64748b">Training Epochs</text>
          <text x={15} y={height/2} textAnchor="middle" transform={`rotate(-90 15 ${height/2})`} fill="#64748b">PSNR (dB)</text>
        </svg>
      </div>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      
      // Contextual prompt using paper data
      const context = `
        You are an AI research assistant for the paper titled "${RESEARCH_DATA.title}".
        Abstract: ${RESEARCH_DATA.abstract}
        Method: ${RESEARCH_DATA.methodDescription}
        Metrics: The model achieves ${RESEARCH_DATA.metrics[RESEARCH_DATA.metrics.length - 1].psnr} PSNR at epoch 50.
        
        Answer questions concisely and academically about this specific paper. 
        If the question is unrelated, politely redirect to the paper's topic.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: context }] }, // System context as first turn or merged
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: input }] }
        ]
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI service. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className={`pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 sm:w-96 mb-4 transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 h-0'}`}>
        {/* Chat Header */}
        <div className="bg-primary px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            Paper Assistant
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-10">
              <p>Ask me about the methodology, results, or datasets used in this research.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"/>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"/>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icons.Send />
          </button>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200 hover:bg-blue-700"
      >
        {isOpen ? <Icons.Close /> : <Icons.Chat />}
      </button>
    </div>
  );
};

// --- Main App ---

function App() {
  const { title, conference, authors, abstract, links, heroVideoUrl, methodDescription, methodImageUrl, comparisons, metrics } = RESEARCH_DATA;

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-serif font-bold text-xl text-slate-800 tracking-tight truncate max-w-md">
            {title}
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#abstract" className="hover:text-primary transition-colors">Abstract</a>
            <a href="#method" className="hover:text-primary transition-colors">Method</a>
            <a href="#results" className="hover:text-primary transition-colors">Results</a>
            <a href="#citation" className="hover:text-primary transition-colors">Citation</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
            {title}
          </h1>
          
          {conference && (
            <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium mb-6">
              {conference}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-lg">
            {authors.map((author, idx) => (
              <div key={idx} className="group relative">
                <a href={author.url} className="text-slate-700 hover:text-primary transition-colors">
                  {author.name}
                  {author.isEqualContribution && <span className="text-slate-400 ml-1">*</span>}
                </a>
                <span className="block text-sm text-slate-500">{author.affiliation}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {link.icon === 'pdf' && <Icons.PDF />}
                {link.icon === 'github' && <Icons.GitHub />}
                {link.icon === 'youtube' && <Icons.YouTube />}
                {link.icon === 'database' && <Icons.Database />}
                {link.label}
              </a>
            ))}
          </div>
        </header>

        {/* Hero Video */}
        <section className="mb-20 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black aspect-video">
           {/* In a real scenario, use <video src={heroVideoUrl} ... /> */}
           {/* Using iframe for demo video compatibility */}
           <video 
             className="w-full h-full object-cover" 
             autoPlay 
             loop 
             muted 
             playsInline
             poster={methodImageUrl}
           >
             <source src={heroVideoUrl} type="video/mp4" />
             Your browser does not support the video tag.
           </video>
        </section>

        {/* Abstract */}
        <section id="abstract" className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-6 text-slate-900">Abstract</h2>
          <p className="text-lg leading-relaxed text-slate-600 text-justify">
            {abstract}
          </p>
        </section>

        <hr className="border-slate-200 mb-20" />

        {/* Method */}
        <section id="method" className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Methodology</h2>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
            <img 
              src={methodImageUrl} 
              alt="Method Diagram" 
              className="w-full h-auto rounded-lg shadow-sm mb-6"
            />
            <p className="text-slate-700 leading-relaxed">
              {methodDescription}
            </p>
          </div>
        </section>

        {/* Comparisons */}
        <section id="results" className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Interactive Results</h2>
          <div className="grid gap-12">
            {comparisons.map(comp => (
              <ComparisonSlider key={comp.id} item={comp} />
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Quantitative Metrics</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-medium mb-4 text-center">PSNR over Training Epochs</h3>
              <MetricsChart data={metrics} />
            </div>
            <div className="flex-1 text-slate-600 space-y-4">
              <p>
                Our model demonstrates rapid convergence, achieving a <strong>PSNR of {metrics[metrics.length-1].psnr}dB</strong> by epoch 50. 
                The combination of our novel loss function and the initialized Gaussian field significantly accelerates the training process compared to baseline NeRF methods.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-primary">
                <li>Higher PSNR indicates better reconstruction quality.</li>
                <li>Lower LPIPS scores (not plotted) confirm perceptual fidelity.</li>
                <li>Consistent performance across diverse datasets.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Citation */}
        <section id="citation" className="mb-24">
          <h2 className="font-serif text-3xl font-semibold mb-6 text-slate-900">Citation</h2>
          <div className="bg-slate-800 text-slate-200 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">
{`@inproceedings{rivera2025chronos,
  title={${title}},
  author={Rivera, Alex and Chen, Sarah and Wei, James and Garcia, Maria},
  booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  year={2025}
}`}
            </pre>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
        <p>© 2025 Research Project Template. Designed for academic clarity.</p>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;