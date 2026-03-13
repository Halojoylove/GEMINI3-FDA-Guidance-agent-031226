import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { callLLM } from '../services/llmService';

export const AgentPipelineTab: React.FC = () => {
  const { state, setState, agents, setMetrics, setExecutionLog } = useAppContext();
  const [globalInput, setGlobalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const handleRunFullPipeline = async () => {
    if (state.mana < 20) {
      alert("Not enough Mana to start the pipeline (need at least 20).");
      return;
    }

    setLoading(true);
    setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'info', msg: 'Full pipeline execution started.' }]);

    let currentInput = globalInput;
    const newResults = { ...results };

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      try {
        const out = await callLLM(agent.provider, agent.model, agent.system_prompt, currentInput, agent.max_tokens, agent.temperature, state.apiKeys);
        newResults[agent.id] = out;
        currentInput = out; // Pass to next
        
        setState((prev) => ({
          ...prev,
          mana: Math.max(0, prev.mana - 20),
          experience: prev.experience + 10,
          level: 1 + Math.floor((prev.experience + 10) / 100)
        }));
        
        setMetrics((prev: any) => ({
          ...prev,
          total_runs: prev.total_runs + 1,
          provider_calls: { ...prev.provider_calls, [agent.provider]: prev.provider_calls[agent.provider] + 1 },
        }));
        
        setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'success', msg: `Agent ${i + 1} (${agent.name}) completed.` }]);
      } catch (e: any) {
        setExecutionLog((prev: any) => [...prev, { time: new Date().toLocaleTimeString(), type: 'error', msg: `Agent ${i + 1} (${agent.name}) failed: ${e.message}` }]);
        break; // Stop pipeline on error
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">🔗 Multi-Agent 510(k) Review Pipeline</h2>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
        <div className="font-semibold">Global Case Input</div>
        <textarea
          value={globalInput}
          onChange={(e) => setGlobalInput(e.target.value)}
          placeholder="Global Case Input (e.g. device description, indications, test summaries)"
          className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">You can run agents one-by-one, or chain them using Run Full Pipeline.</span>
          <button onClick={handleRunFullPipeline} disabled={loading || !globalInput.trim()} className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Running...' : '🚀 Run Full Pipeline'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">📄 Per-Agent Configuration & Editable Chain</h3>
        {agents.map((agent, idx) => (
          <div key={agent.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <h4 className="font-bold text-lg">Step {idx + 1}: {agent.name}</h4>
            <p className="text-sm opacity-80">{agent.description}</p>
            
            {results[agent.id] && (
              <div className="mt-4">
                <div className="font-semibold mb-2">Output of this agent:</div>
                <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto prose prose-invert text-sm" dangerouslySetInnerHTML={{ __html: results[agent.id].replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
