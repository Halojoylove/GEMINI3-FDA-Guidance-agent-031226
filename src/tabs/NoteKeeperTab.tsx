import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AI_MODELS, CORAL_COLOR } from '../constants';
import { callLLM } from '../services/llmService';

export const NoteKeeperTab: React.FC = () => {
  const { state, setMetrics, setExecutionLog } = useAppContext();
  const [noteContent, setNoteContent] = useState('');
  const [magic, setMagic] = useState('Structured Markdown (510(k)-aware)');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState(AI_MODELS.gemini[0]);
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [keywordSpec, setKeywordSpec] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);

  const buildMagicPrompt = (m: string) => {
    if (m === 'Structured Markdown (510(k)-aware)') {
      return `You are an expert regulatory scribe.\nConvert the user's raw note into clean, well-structured Markdown suitable for a 510(k) file.\nUse clear headings, bullets, and tables. Do not invent new information.\nHighlight 10–30 important keywords by wrapping them in <span style='color:${CORAL_COLOR};font-weight:600;'>keyword</span>.\n`;
    }
    if (m === 'Regulatory Entity Table (20 entities)') {
      return `Extract exactly 20 key regulatory entities from the note, focusing on:\n- Device identity, indications, patient population\n- Predicate devices\n- Risk controls / mitigations\n- Types of testing and main outcomes\n- Key standards/guidances cited\nReturn a Markdown table:\n| # | Entity | Category | Value | Notes |\nwith 20 rows.`;
    }
    if (m === 'Risk & Mitigation Matrix') {
      return `From the note, extract risks and mitigations and build a Markdown table:\n| Hazard | Failure Mode / Scenario | Harm | Mitigation / Control | Residual Risk |\nAdd brief text before and after the table summarizing the overall risk picture.`;
    }
    if (m === 'Testing Coverage Map') {
      return `From the note, infer what testing has been done (bench, biocomp, EMC/electrical, software, shelf life, packaging, clinical, etc.) and build:\n1) A summary narrative, and\n2) A Markdown table:\n| Test Category | Standard / Method | Status | Key Results | Gaps / Comments |`;
    }
    if (m === 'Action Items / Deficiency List') {
      return `Extract all action items, open questions, and potential deficiencies from the note.\nReturn:\n- A bullet list of issues, and\n- A Markdown table:\n| ID | Issue / Deficiency | Impact | Suggested Action | Owner | Due Date |`;
    }
    if (m === 'AI Keywords (color-customizable)') {
      return `You will receive user-specified keywords and colors separately. Do NOT add color markup yourself. Just leave the text as-is; color will be applied by the client.`;
    }
    return 'You are a helpful AI Note Keeper for 510(k) reviewers.';
  };

  const highlightKeywordsColored = (text: string, spec: string) => {
    if (!spec.trim()) return text;
    const pairs = spec.split(',').map(p => {
      const parts = p.split('#');
      return { kw: parts[0].trim(), color: parts.length > 1 ? `#${parts[1].trim()}` : CORAL_COLOR };
    }).filter(p => p.kw);

    let highlighted = text;
    pairs.forEach(({ kw, color }) => {
      const regex = new RegExp(`(${kw})`, 'gi');
      highlighted = highlighted.replace(regex, `<span style='color:${color};font-weight:600;'>$1</span>`);
    });
    return highlighted;
  };

  const handleRunMagic = async () => {
    if (magic === 'AI Keywords (color-customizable)') {
      setNoteContent(highlightKeywordsColored(noteContent, keywordSpec));
      return;
    }

    if (!noteContent.trim()) return;
    setLoading(true);
    try {
      const sysPrompt = buildMagicPrompt(magic);
      const out = await callLLM(provider, model, sysPrompt, noteContent, maxTokens, temperature, state.apiKeys);
      setNoteContent(out);
      setMetrics((prev: any) => ({
        ...prev,
        total_runs: prev.total_runs + 1,
        provider_calls: { ...prev.provider_calls, [provider]: prev.provider_calls[provider] + 1 },
      }));
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: `Magic applied: ${magic}` }]);
    } catch (e: any) {
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `Magic failed: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">🧾 AI Note Keeper · With AI Magics</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="font-semibold">1. Input Note (text / markdown)</div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Paste note here"
            className="w-full h-64 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="font-semibold mt-4">2. AI Magics</div>
          <select value={magic} onChange={(e) => setMagic(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm">
            <option value="Structured Markdown (510(k)-aware)">Structured Markdown (510(k)-aware)</option>
            <option value="Regulatory Entity Table (20 entities)">Regulatory Entity Table (20 entities)</option>
            <option value="Risk & Mitigation Matrix">Risk & Mitigation Matrix</option>
            <option value="Testing Coverage Map">Testing Coverage Map</option>
            <option value="Action Items / Deficiency List">Action Items / Deficiency List</option>
            <option value="AI Keywords (color-customizable)">AI Keywords (color-customizable)</option>
          </select>

          {magic === 'AI Keywords (color-customizable)' && (
            <input
              type="text"
              value={keywordSpec}
              onChange={(e) => setKeywordSpec(e.target.value)}
              placeholder="keyword#FF0000, another keyword#00FF00"
              className="bg-white/10 border border-white/20 rounded-md p-2 text-sm"
            />
          )}

          <div className="flex gap-4">
            <select value={provider} onChange={(e) => { setProvider(e.target.value); setModel(AI_MODELS[e.target.value as keyof typeof AI_MODELS][0]); }} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm flex-1">
              {Object.keys(AI_MODELS).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm flex-1">
              {AI_MODELS[provider as keyof typeof AI_MODELS].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <button onClick={handleRunMagic} disabled={loading || !noteContent.trim()} className="mt-2 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Running...' : magic === 'AI Keywords (color-customizable)' ? '🎨 Apply AI Keywords' : '✨ Run Selected AI Magic'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="font-semibold">3. Note Editor & Preview</div>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={viewMode === 'edit'} onChange={() => setViewMode('edit')} /> Edit (Markdown/Text)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={viewMode === 'preview'} onChange={() => setViewMode('preview')} /> Preview
            </label>
          </div>
          
          {viewMode === 'edit' ? (
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-96 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="w-full h-96 bg-white/5 border border-white/20 rounded-lg p-4 overflow-y-auto prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: noteContent.replace(/\n/g, '<br/>') }} />
          )}
        </div>
      </div>
    </div>
  );
};
