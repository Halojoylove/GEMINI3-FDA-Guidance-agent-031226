import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { AI_MODELS, CORAL_COLOR } from '../constants';
import { callLLM } from '../services/llmService';

export const OCRAgentsTab: React.FC = () => {
  const { state, agents, setMetrics, setExecutionLog } = useAppContext();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<string>('1-5');
  const [ocrModel, setOcrModel] = useState(AI_MODELS.gemini[0]);
  const [ocrText, setOcrText] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);

  // Summary state
  const [summaryProvider, setSummaryProvider] = useState('gemini');
  const [summaryModel, setSummaryModel] = useState(AI_MODELS.gemini[0]);
  const [summaryResult, setSummaryResult] = useState('');

  // Agent state
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [agentResult, setAgentResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      if (file.type === 'application/pdf') {
        setPdfUrl(URL.createObjectURL(file));
      } else {
        setPdfUrl(null);
        const reader = new FileReader();
        reader.onload = (e) => setOcrText(e.target?.result as string);
        reader.readAsText(file);
      }
    }
  };

  const handleExtractText = async () => {
    if (!pdfFile || pdfFile.type !== 'application/pdf') return;
    setLoading(true);
    try {
      // In a real app, we would use pdfjs-dist to extract text or send the PDF to Gemini.
      // Since we can't easily send files to Gemini via the simple text API without File API setup,
      // we'll simulate OCR extraction or use a prompt with Gemini if we had the base64.
      // For this demo, we'll just mock the extraction or use a simple prompt if it was text.
      // To actually do it with Gemini, we'd need to convert the PDF to base64 and use inlineData.
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        
        // We will use Gemini to extract text
        const prompt = `Extract the text from pages ${selectedPages} of this document. Return only the extracted text.`;
        
        // Note: The simple callLLM we wrote only takes text. We need to modify it or do a direct call here.
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: state.apiKeys.gemini });
        
        const response = await ai.models.generateContent({
          model: ocrModel,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64data,
                  mimeType: 'application/pdf'
                }
              },
              { text: prompt }
            ]
          }
        });
        
        setOcrText(response.text || 'No text extracted.');
        setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: 'OCR extraction completed.' }]);
      };
      reader.readAsDataURL(pdfFile);
      
    } catch (e: any) {
      setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `OCR extraction failed: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!ocrText.trim()) return;
    setLoading(true);
    try {
      const prompt = `You are an FDA 510(k) reviewer.\nCreate a comprehensive Markdown summary of the provided OCR/extracted submission content.\nLength: 2000–3000 words. Use headings, bullet points, and tables.\nHighlight important regulatory keywords by wrapping them in <span style='color:${CORAL_COLOR};font-weight:600;'>keyword</span>.\nFocus on: device description, intended use, indications, technological characteristics, bench/animal/clinical testing, risk management, comparison to predicate, labeling, and any gaps.\n`;
      const out = await callLLM(summaryProvider, summaryModel, prompt, ocrText, 6000, 0.3, state.apiKeys);
      setSummaryResult(out);
      setMetrics((prev: any) => ({ ...prev, total_runs: prev.total_runs + 1 }));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    if (!ocrText.trim() || !selectedAgentId) return;
    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;
    
    setLoading(true);
    try {
      const out = await callLLM(agent.provider, agent.model, agent.system_prompt, ocrText, agent.max_tokens, agent.temperature, state.apiKeys);
      setAgentResult(out);
      setMetrics((prev: any) => ({ ...prev, total_runs: prev.total_runs + 1 }));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">📂 Submission Material · PDF Viewer, OCR/Text & Agents</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="font-semibold">1. Upload Guidance (PDF, TXT, MD) & Select Pages</div>
          <input type="file" accept=".pdf,.txt,.md" onChange={handleFileChange} className="bg-white/5 border border-white/20 rounded-lg p-2" />
          
          {pdfUrl && (
            <div className="h-64 border border-white/20 rounded-lg overflow-hidden">
              <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
            </div>
          )}

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <label className="text-sm">Pages to extract (e.g., 1-5, 10):</label>
            <input type="text" value={selectedPages} onChange={(e) => setSelectedPages(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-1.5 text-sm w-32" />
            <select value={ocrModel} onChange={(e) => setOcrModel(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-1.5 text-sm">
              {AI_MODELS.gemini.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={handleExtractText} disabled={loading || !pdfFile} className="bg-primary hover:bg-primary/80 text-white font-bold py-1.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm">
              🔍 Extract Text
            </button>
          </div>

          <div className="font-semibold mt-4">2. OCR/Text Document Editor</div>
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
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              className="w-full h-64 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="w-full h-64 bg-white/5 border border-white/20 rounded-lg p-4 overflow-y-auto prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: ocrText.replace(/\n/g, '<br/>') }} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
            <div className="font-semibold">3. Auto Summary of OCR Document</div>
            <div className="flex gap-4">
              <select value={summaryProvider} onChange={(e) => setSummaryProvider(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm flex-1">
                {Object.keys(AI_MODELS).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={summaryModel} onChange={(e) => setSummaryModel(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm flex-1">
                {AI_MODELS[summaryProvider as keyof typeof AI_MODELS].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button onClick={handleSummary} disabled={loading || !ocrText.trim()} className="bg-secondary text-black hover:bg-secondary/80 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
              🧾 Generate Summary
            </button>
            {summaryResult && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg max-h-64 overflow-y-auto prose prose-invert text-sm" dangerouslySetInnerHTML={{ __html: summaryResult.replace(/\n/g, '<br/>') }} />
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
            <div className="font-semibold">4. Run Agent on OCR Document</div>
            <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className="bg-white/10 border border-white/20 rounded-md p-2 text-sm">
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <button onClick={handleRunAgent} disabled={loading || !ocrText.trim() || !selectedAgentId} className="bg-accent text-white hover:bg-accent/80 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
              🤖 Run Selected Agent
            </button>
            {agentResult && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg max-h-64 overflow-y-auto prose prose-invert text-sm" dangerouslySetInnerHTML={{ __html: agentResult.replace(/\n/g, '<br/>') }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
