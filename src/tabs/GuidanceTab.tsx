import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AI_MODELS } from '../constants';
import { callLLM } from '../services/llmService';

export const GuidanceTab: React.FC = () => {
  const { state, setMetrics, setExecutionLog } = useAppContext();
  const [guidanceText, setGuidanceText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState(AI_MODELS.gemini[0]);
  const [temperature, setTemperature] = useState(0.25);
  const [maxTokens, setMaxTokens] = useState(5000);
  const [prompt, setPrompt] = useState(
    "You are creating an FDA 510(k) review guideline for reviewers.\nBased on the supplied guidance text and optional reviewer instructions, produce:\n1) A concise narrative guideline explaining how to review this type of device, and\n2) A detailed checklist (Markdown) that a reviewer can use during 510(k) review.\nChecklist must include sections such as: Administrative, Indications/IFU, Device Description, Risk Management, Bench Testing, Biocompatibility, Sterilization, EMC/Electrical Safety, Software/Cybersecurity (when applicable), Labeling, and Summary of SE.\nFor each checklist item, include columns: Item, Question, Evidence to Confirm, Pass/Fail/NA.\n"
  );
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!guidanceText.trim()) return;
    setLoading(true);
    try {
      const combined = `=== REVIEW GUIDANCE ===\n${guidanceText}\n\n=== REVIEWER INSTRUCTIONS ===\n${instructions}`;
      const out = await callLLM(provider, model, prompt, combined, maxTokens, temperature, state.apiKeys);
      setResult(out);
      setMetrics((prev: any) => ({
        ...prev,
        total_runs: prev.total_runs + 1,
        provider_calls: { ...prev.provider_calls, [provider]: prev.provider_calls[provider] + 1 },
      }));
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: 'Guideline generation completed.' }]);
    } catch (e: any) {
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `Guideline generation failed: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">📘 Review Guidance Builder</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="font-semibold">1. Input Review Guidance (text / markdown)</div>
          <textarea
            value={guidanceText}
            onChange={(e) => setGuidanceText(e.target.value)}
            placeholder="Paste review guidance text / markdown"
            className="w-full h-64 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="font-semibold mt-4">2. Reviewer Instructions (optional)</div>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Special reviewer instructions (e.g., focus on software validation, cybersecurity, pediatric use)"
            className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
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
            <label className="text-sm">Guideline Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-32 bg-white/10 border border-white/20 rounded-md p-2 text-sm" />
          </div>

          <button onClick={handleGenerate} disabled={loading || !guidanceText.trim()} className="mt-4 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Generating...' : '📋 Generate Review Guideline + Checklist'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📑 Generated Guideline & Checklist</h3>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </div>
  );
};
