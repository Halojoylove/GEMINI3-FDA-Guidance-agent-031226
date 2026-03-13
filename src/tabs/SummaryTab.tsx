import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AI_MODELS, CORAL_COLOR } from '../constants';
import { callLLM } from '../services/llmService';

export const SummaryTab: React.FC = () => {
  const { state, setMetrics, setExecutionLog } = useAppContext();
  const [summaryText, setSummaryText] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState(AI_MODELS.gemini[0]);
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [prompt, setPrompt] = useState(
    `You are an FDA 510(k) reviewer.\nCreate a comprehensive, well-structured Markdown summary of the provided 510(k) summary.\n- Length: approximately 2000–3000 words.\n- Organize into clear sections: Device Overview, Intended Use, Indications for Use, Technological Characteristics, Performance Testing, Biocompatibility, Sterilization, Shelf Life, Substantial Equivalence, and Regulatory Notes.\n- Highlight 20–40 critical keywords by wrapping them in <span style='color:${CORAL_COLOR};font-weight:600;'>keyword</span>.\n- Use tables where helpful. Do not invent data; only reorganize and clarify.\n`
  );
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!summaryText.trim()) return;
    setLoading(true);
    try {
      const out = await callLLM(provider, model, prompt, summaryText, maxTokens, temperature, state.apiKeys);
      setResult(out);
      setMetrics((prev: any) => ({
        ...prev,
        total_runs: prev.total_runs + 1,
        provider_calls: { ...prev.provider_calls, [provider]: prev.provider_calls[provider] + 1 },
      }));
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: 'Summary analysis completed.' }]);
    } catch (e: any) {
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `Summary analysis failed: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">📑 510(k) Summary Analysis</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="font-semibold">1. Input 510(k) Summary (text/markdown)</div>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Paste 510(k) summary (text / markdown)"
            className="w-full h-64 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold">Model & Prompt Settings</div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm">Provider</label>
            <select value={provider} onChange={(e) => { setProvider(e.target.value); setModel(AI_MODELS[e.target.value as keyof typeof AI_MODELS][0]); }} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm">
              {Object.keys(AI_MODELS).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm">
              {AI_MODELS[provider as keyof typeof AI_MODELS].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Temperature: {temperature}</label>
            <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Analysis Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-32 bg-white/10 border border-white/20 rounded-md p-2 text-sm" />
          </div>

          <button onClick={handleAnalyze} disabled={loading || !summaryText.trim()} className="mt-4 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Analyzing...' : '🧠 Analyze 510(k) Summary'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📘 AI-Generated Summary</h3>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </div>
  );
};
