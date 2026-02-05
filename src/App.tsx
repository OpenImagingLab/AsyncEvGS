import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { RESEARCH_DATA } from './constants';
import type { ComparisonItem, ChatMessage, DatasetMetrics } from './types';

// Import comparison images
import realWorldPatio from './assets/real-world-patio.png';
import syntheticTrollet from './assets/synthetic-trollet.png';

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

const VideoComparisonSlider: React.FC<{ item: ComparisonItem }> = ({ item }) => {
  const [position, setPosition] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoLeftRef = useRef<HTMLVideoElement>(null);
  const videoRightRef = useRef<HTMLVideoElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setPosition(percentage);
  };

  // Reset loading state when item changes
  useEffect(() => {
    setIsLoading(true);
  }, [item.id]);

  // Sync video playback - ensure both videos play together
  useEffect(() => {
    const leftVideo = videoLeftRef.current;
    const rightVideo = videoRightRef.current;
    
    if (leftVideo && rightVideo) {
      // Reset videos when item changes
      leftVideo.load();
      rightVideo.load();
      
      // Start playing both videos
      const playBoth = async () => {
        try {
          await Promise.all([
            leftVideo.play(),
            rightVideo.play()
          ]);
          setIsLoading(false);
        } catch (error) {
          console.log('Autoplay prevented, user interaction needed');
          setIsLoading(false);
        }
      };
      
      // Wait for both videos to be ready
      const handleCanPlay = () => {
        if (leftVideo.readyState >= 3 && rightVideo.readyState >= 3) {
          playBoth();
        }
      };
      
      leftVideo.addEventListener('canplay', handleCanPlay);
      rightVideo.addEventListener('canplay', handleCanPlay);
      
      // Try to play immediately if already loaded
      if (leftVideo.readyState >= 3 && rightVideo.readyState >= 3) {
        playBoth();
      }
      
      const syncVideos = () => {
        if (Math.abs(leftVideo.currentTime - rightVideo.currentTime) > 0.1) {
          rightVideo.currentTime = leftVideo.currentTime;
        }
      };
      
      const handlePlay = () => rightVideo.play();
      const handlePause = () => rightVideo.pause();
      
      leftVideo.addEventListener('play', handlePlay);
      leftVideo.addEventListener('pause', handlePause);
      leftVideo.addEventListener('timeupdate', syncVideos);
      
      return () => {
        leftVideo.removeEventListener('canplay', handleCanPlay);
        rightVideo.removeEventListener('canplay', handleCanPlay);
        leftVideo.removeEventListener('play', handlePlay);
        leftVideo.removeEventListener('pause', handlePause);
        leftVideo.removeEventListener('timeupdate', syncVideos);
      };
    }
  }, [item.id]);

  return (
    <div className="mb-4">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-200 shadow-lg bg-black"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Right Video (Ours - Background) */}
        <video 
          key={`ours-${item.id}`}
          ref={videoRightRef}
          src={item.videoOurs}
          className="absolute inset-0 w-full h-full object-cover" 
          loop
          muted
          playsInline
          preload="auto"
        />
        
        {/* Left Video (Baseline - Clipped overlay) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <video 
            key={`baseline-${item.id}`}
            ref={videoLeftRef}
            src={item.videoBaseline}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)"/></svg>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded backdrop-blur-sm font-medium z-20">
          LSE-NeRF (Baseline)
        </div>
        <div className="absolute bottom-4 right-4 bg-primary/90 text-white text-xs px-3 py-1.5 rounded backdrop-blur-sm font-medium z-20">
          Ours
        </div>
      </div>
    </div>
  );
};

const InteractiveResults: React.FC<{ comparisons: ComparisonItem[] }> = ({ comparisons }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = comparisons[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + comparisons.length) % comparisons.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % comparisons.length);
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {comparisons.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              idx === currentIndex
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label}
            <span className="ml-2 text-xs opacity-75">({item.category})</span>
          </button>
        ))}
      </div>

      {/* Scene Info */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">
          {currentItem.label}
        </h3>
        <p className="text-sm text-slate-500 mb-1">{currentItem.scene}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          currentItem.category === 'Real-World' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {currentItem.category}
        </span>
      </div>

      {/* Video Comparison */}
      <div className="relative px-12">
        <VideoComparisonSlider item={currentItem} />
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-110 border border-slate-200"
          aria-label="Previous scene"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-110 border border-slate-200"
          aria-label="Next scene"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 text-center mt-4 italic">
        {currentItem.description}
      </p>

      {/* Scene Counter */}
      <div className="flex justify-center gap-2 mt-6">
        {comparisons.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-primary w-8' : 'bg-slate-300 w-2'
            }`}
            aria-label={`Go to scene ${idx + 1}`}
          />
        ))}
      </div>

      {/* Usage Hint */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 text-center">
          💡 <strong>Tip:</strong> Drag the slider or click anywhere on the video to compare LSE-NeRF (baseline) with our method. 
          Videos are synchronized for direct comparison.
        </p>
      </div>
    </div>
  );
};

const PerformanceChart: React.FC<{ datasets: DatasetMetrics[] }> = ({ datasets }) => {
  const methods = ["3DGS", "BAGS", "DeblurGS", "LSENeRF", "Ours"];
  const methodColors: { [key: string]: string } = {
    "3DGS": "#94a3b8",
    "BAGS": "#fb923c",
    "DeblurGS": "#a78bfa",
    "LSENeRF": "#4ade80",
    "Ours": "#2563eb"
  };

  // Get average metrics for each dataset
  const getAverageMetrics = (dataset: DatasetMetrics) => {
    const avgScene = dataset.scenes.find(s => s.scene === 'Average');
    return avgScene?.methods || {};
  };

  const realWorldAvg = getAverageMetrics(datasets[0]);
  const syntheticAvg = getAverageMetrics(datasets[1]);

  // Fixed chart dimensions - same for all charts
  const width = 700;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 45, left: 55 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = 42;
  const barGap = 10;
  const groupGap = 60;

  // Chart configurations for each metric
  const metrics = [
    { key: 'psnr' as const, label: 'PSNR (dB)', max: 30, gridLines: [0, 10, 20, 30], higherBetter: true, decimals: 1 },
    { key: 'ssim' as const, label: 'SSIM', max: 1, gridLines: [0, 0.25, 0.5, 0.75, 1.0], higherBetter: true, decimals: 3 },
    { key: 'lpips' as const, label: 'LPIPS', max: 0.6, gridLines: [0, 0.2, 0.4, 0.6], higherBetter: false, decimals: 3 }
  ];

  const renderChart = (metric: typeof metrics[0]) => {
    const groupWidth = methods.length * (barWidth + barGap);
    const totalWidth = groupWidth * 2 + groupGap;
    const startX = padding.left + (chartWidth - totalWidth) / 2;

    return (
      <div key={metric.key} className="w-full">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h4 className="text-base font-semibold text-slate-800">{metric.label}</h4>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {metric.higherBetter ? '↑ Higher is better' : '↓ Lower is better'}
          </span>
        </div>
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-3xl mx-auto">
          {/* Y-axis grid lines */}
          {metric.gridLines.map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={padding.top + chartHeight - (val / metric.max) * chartHeight}
                x2={width - padding.right}
                y2={padding.top + chartHeight - (val / metric.max) * chartHeight}
                stroke="#e2e8f0"
                strokeDasharray={val === 0 ? "0" : "4 4"}
              />
              <text
                x={padding.left - 10}
                y={padding.top + chartHeight - (val / metric.max) * chartHeight + 4}
                textAnchor="end"
                className="fill-slate-500"
                style={{ fontSize: '11px' }}
              >
                {metric.decimals === 1 ? val : val.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Real-World Dataset Bars */}
          {methods.map((method, idx) => {
            const value = realWorldAvg[method]?.[metric.key] || 0;
            const barHeight = (value / metric.max) * chartHeight;
            const x = startX + idx * (barWidth + barGap);
            const y = padding.top + chartHeight - barHeight;
            
            return (
              <g key={`rw-${method}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={methodColors[method]}
                  rx={4}
                  className="transition-all hover:opacity-80"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-slate-700 font-medium"
                  style={{ fontSize: '10px' }}
                >
                  {value.toFixed(metric.decimals)}
                </text>
              </g>
            );
          })}

          {/* Synthetic Dataset Bars */}
          {methods.map((method, idx) => {
            const value = syntheticAvg[method]?.[metric.key] || 0;
            const barHeight = (value / metric.max) * chartHeight;
            const x = startX + groupWidth + groupGap + idx * (barWidth + barGap);
            const y = padding.top + chartHeight - barHeight;
            
            return (
              <g key={`syn-${method}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={methodColors[method]}
                  rx={4}
                  opacity={0.75}
                  className="transition-all hover:opacity-100"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-slate-700 font-medium"
                  style={{ fontSize: '10px' }}
                >
                  {value.toFixed(metric.decimals)}
                </text>
              </g>
            );
          })}

          {/* Dataset Labels */}
          <text
            x={startX + groupWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="fill-slate-700 font-medium"
            style={{ fontSize: '12px' }}
          >
            Real-World
          </text>
          <text
            x={startX + groupWidth + groupGap + groupWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="fill-slate-700 font-medium"
            style={{ fontSize: '12px' }}
          >
            Synthetic
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="mb-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Average Performance Comparison</h3>
      
      {/* Legend at top */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {methods.map(method => (
          <div key={method} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: methodColors[method] }}
            />
            <span className={`text-sm ${method === 'Ours' ? 'font-semibold text-primary' : 'text-slate-600'}`}>
              {method}
            </span>
          </div>
        ))}
      </div>

      {/* Three charts stacked vertically with same size */}
      <div className="space-y-8">
        {metrics.map(renderChart)}
      </div>
    </div>
  );
};

const QuantitativeTable: React.FC<{ dataset: DatasetMetrics }> = ({ dataset }) => {
  const methods = ["3DGS", "BAGS", "DeblurGS", "LSENeRF", "Ours"];
  
  const getCellClass = (scene: typeof dataset.scenes[0], method: string, metric: 'psnr' | 'ssim' | 'lpips') => {
    const isBest = scene.best[metric] === method;
    if (!isBest) return "";
    
    switch (metric) {
      case 'psnr': return 'bg-blue-100 text-blue-800 font-bold';
      case 'ssim': return 'bg-yellow-100 text-yellow-800 font-bold';
      case 'lpips': return 'bg-green-100 text-green-800 font-bold';
    }
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{dataset.name}</h3>
      <p className="text-sm text-slate-600 mb-4">{dataset.caption}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300">
              <th className="text-left py-3 px-2 font-semibold text-slate-700">Scene</th>
              {methods.map(method => (
                <th key={method} colSpan={3} className="text-center py-3 px-1 font-semibold text-slate-700 border-l border-slate-200">
                  {method === "Ours" ? <span className="text-primary">{method}</span> : method}
                </th>
              ))}
            </tr>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th></th>
              {methods.map(method => (
                <React.Fragment key={method}>
                  <th className="py-2 px-1 font-medium border-l border-slate-200">PSNR↑</th>
                  <th className="py-2 px-1 font-medium">SSIM↑</th>
                  <th className="py-2 px-1 font-medium">LPIPS↓</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.scenes.map((scene, idx) => (
              <tr 
                key={scene.scene} 
                className={`border-b border-slate-100 ${scene.scene === 'Average' ? 'bg-slate-50 font-medium' : ''} ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}
              >
                <td className="py-2 px-2 text-slate-700">{scene.scene}</td>
                {methods.map(method => (
                  <React.Fragment key={method}>
                    <td className={`py-2 px-1 text-center border-l border-slate-200 ${getCellClass(scene, method, 'psnr')}`}>
                      {scene.methods[method].psnr.toFixed(2)}
                    </td>
                    <td className={`py-2 px-1 text-center ${getCellClass(scene, method, 'ssim')}`}>
                      {scene.methods[method].ssim.toFixed(3)}
                    </td>
                    <td className={`py-2 px-1 text-center ${getCellClass(scene, method, 'lpips')}`}>
                      {scene.methods[method].lpips.toFixed(3)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-100 rounded"></span> Best PSNR
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-100 rounded"></span> Best SSIM
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 rounded"></span> Best LPIPS
        </span>
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
        model: 'gemini-1.5-flash',
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
  const { title, conference, authors, abstract, links, heroVideoUrl, methodDescription, methodImageUrl, comparisons, quantitativeResults } = RESEARCH_DATA;

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
           <video 
             className="w-full h-full object-cover" 
             autoPlay 
             loop 
             muted 
             playsInline
             controls
             poster={methodImageUrl}
           >
             <source src={heroVideoUrl} type="video/mp4" />
             Your browser does not support the video tag.
           </video>
        </section>

        {/* Abstract */}
        <section id="abstract" className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-6 text-slate-900">Abstract</h2>
          <div className="text-lg leading-relaxed text-slate-600 text-justify markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {abstract}
            </ReactMarkdown>
          </div>
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
            <div className="text-slate-700 leading-relaxed markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
              >
                {methodDescription}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Interactive Results */}
        <section id="results" className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Interactive Results</h2>
          <InteractiveResults comparisons={comparisons} />
        </section>

        {/* Qualitative Comparisons */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Qualitative Comparisons</h2>
          <div className="space-y-10">
            {/* Real-world comparison */}
            <div>
              <img 
                src={realWorldPatio} 
                alt="Comparison on real-world data" 
                className="w-full h-auto rounded-lg shadow-md"
              />
              <p className="text-sm font-medium text-slate-700 text-center mt-3">Comparison on real-world data</p>
            </div>

            {/* Synthetic comparison */}
            <div>
              <img 
                src={syntheticTrollet} 
                alt="Comparison on synthetic data" 
                className="w-full h-auto rounded-lg shadow-md"
              />
              <p className="text-sm font-medium text-slate-700 text-center mt-3">Comparison on synthetic data</p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-slate-900">Quantitative Metrics</h2>
          <p className="text-slate-600 mb-6">
            We compare our method against state-of-the-art approaches including Original 3D Gaussian Splatting, BAGS, DeblurringGS, and LSE-NeRF across two datasets. 
            Our method achieves the best performance on most scenes, with significant improvements in PSNR, SSIM, and LPIPS metrics.
          </p>
          <PerformanceChart datasets={quantitativeResults} />
          {quantitativeResults.map((dataset, idx) => (
            <QuantitativeTable key={idx} dataset={dataset} />
          ))}
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