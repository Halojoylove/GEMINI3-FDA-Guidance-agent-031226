import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { callLLM } from '../services/llmService';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export const WOWVisualizationsTab: React.FC = () => {
  const { state } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Data states
  const [riskData, setRiskData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [entityData, setEntityData] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      // 1. Risk Heatmap Data
      const riskPrompt = `Analyze the text and extract 5 key risks. Return ONLY a JSON array of objects with 'name', 'severity' (1-5), and 'likelihood' (1-5). Example: [{"name": "Software Bug", "severity": 4, "likelihood": 3}]`;
      const riskRes = await callLLM('gemini', 'gemini-2.5-flash', riskPrompt, inputText, 1000, 0.1, state.apiKeys);
      try { setRiskData(JSON.parse(riskRes.replace(/\`\`\`json|\`\`\`/g, '').trim())); } catch(e) {}

      // 2. Timeline Data
      const timelinePrompt = `Analyze the text and extract 5 key milestones or steps. Return ONLY a JSON array of objects with 'step' (string), 'time' (number 1-10 representing relative time), and 'value' (number 10-100 representing completion or importance). Example: [{"step": "Design", "time": 1, "value": 20}]`;
      const timelineRes = await callLLM('gemini', 'gemini-2.5-flash', timelinePrompt, inputText, 1000, 0.1, state.apiKeys);
      try { setTimelineData(JSON.parse(timelineRes.replace(/\`\`\`json|\`\`\`/g, '').trim())); } catch(e) {}

      // 3. Entity Data
      const entityPrompt = `Analyze the text and extract 5 key entities (e.g., components, tests, regulations). Return ONLY a JSON array of objects with 'name', 'x' (1-100), 'y' (1-100), and 'size' (10-50). Example: [{"name": "ISO 13485", "x": 20, "y": 80, "size": 30}]`;
      const entityRes = await callLLM('gemini', 'gemini-2.5-flash', entityPrompt, inputText, 1000, 0.1, state.apiKeys);
      try { setEntityData(JSON.parse(entityRes.replace(/\`\`\`json|\`\`\`/g, '').trim())); } catch(e) {}

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (severity: number, likelihood: number) => {
    const score = severity * likelihood;
    if (score >= 15) return '#ef4444'; // Red
    if (score >= 8) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">✨ WOW Visualizations & Analysis</h2>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
        <div className="font-semibold">Input Text for Analysis</div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste text here to generate WOW visualizations..."
          className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={handleGenerate} disabled={loading || !inputText.trim()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30">
          {loading ? 'Generating WOW Magic...' : '🪄 Generate WOW Visualizations'}
        </button>
      </div>

      {(riskData.length > 0 || timelineData.length > 0 || entityData.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          
          {/* Feature 1: Risk Heatmap */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-lg">🔥 Risk Heatmap</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 6]} stroke="rgba(255,255,255,0.5)" />
                  <YAxis type="number" dataKey="severity" name="Severity" domain={[0, 6]} stroke="rgba(255,255,255,0.5)" />
                  <ZAxis type="number" range={[400, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Scatter name="Risks" data={riskData}>
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskColor(entry.severity, entry.likelihood)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature 2: Milestone Timeline */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-lg">⏱️ Milestone Timeline</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="step" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature 3: Entity Constellation */}
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-lg">🌌 Entity Constellation</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
                  <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
                  <ZAxis type="number" dataKey="size" range={[100, 1000]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Scatter name="Entities" data={entityData} fill="#3b82f6">
                    {entityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${(index * 60) % 360}, 70%, 60%)`} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
