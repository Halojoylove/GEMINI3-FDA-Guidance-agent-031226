import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AI_MODELS, CORAL_COLOR } from '../constants';
import { callLLM } from '../services/llmService';

export const ReviewReportTab: React.FC = () => {
  const { state, setMetrics, setExecutionLog } = useAppContext();
  const [reportInstr, setReportInstr] = useState('');
  const [rawText, setRawText] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState(AI_MODELS.gemini[0]);
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(8000);
  const [prompt, setPrompt] = useState(
    `You are writing a formal FDA 510(k) review report based on:\n1) Reviewer instructions, and\n2) Raw review materials.\nProduce a comprehensive Markdown report of about 2000–3000 words with:\n- Executive Summary\n- Device Description & Indications for Use\n- Regulatory Background (predicate, product code, classification)\n- Summary of Submitted Testing (bench, biocompatibility, software, EMC/electrical, etc.)\n- Risk/Benefit and SE Discussion\n- Issues/Deficiencies (tables) and recommendations\n- Conclusion and Suggested Decision.\nUse tables for: testing overview, comparison to predicate, and deficiency tracking.\nHighlight key regulatory keywords in <span style='color:${CORAL_COLOR};font-weight:600;'>coral</span>.\n`
  );
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const combined = `=== REVIEW REPORT INSTRUCTIONS ===\n${reportInstr}\n\n=== RAW REVIEW MATERIALS ===\n${rawText}`;
      const out = await callLLM(provider, model, prompt, combined, maxTokens, temperature, state.apiKeys);
      setResult(out);
      setMetrics((prev: any) => ({
        ...prev,
        total_runs: prev.total_runs + 1,
        provider_calls: { ...prev.provider_calls, [provider]: prev.provider_calls[provider] + 1 },
      }));
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: 'Review report generation completed.' }]);
    } catch (e: any) {
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `Review report generation failed: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">📝 510(k) Review Report Composer</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="font-semibold">1. Review Report Instructions</div>
          <textarea
            value={reportInstr}
            onChange={(e) => setReportInstr(e.target.value)}
            placeholder="Describe how you want the review report structured (e.g., include benefit-risk, gap analysis vs guidance, decision rationale, etc.)"
            className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="font-semibold mt-4">2. Raw Review Materials</div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw review materials (e.g. review notes, AI outputs, test summaries)"
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
            <label className="text-sm">Report Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-32 bg-white/10 border border-white/20 rounded-md p-2 text-sm" />
          </div>

          <button onClick={handleGenerate} disabled={loading || !rawText.trim()} className="mt-4 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Generating...' : '📄 Generate 510(k) Review Report'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📜 Generated Review Report</h3>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </div>
  );
};
