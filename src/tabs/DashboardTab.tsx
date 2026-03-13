import React from 'react';
import { useAppContext } from '../context/AppContext';

export const DashboardTab: React.FC = () => {
  const { metrics, executionLog } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">📊 Interactive Analytics Dashboard</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-sm opacity-70">Total AI Calls</div>
          <div className="text-4xl font-bold">{metrics.total_runs}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-sm opacity-70">Gemini Calls</div>
          <div className="text-4xl font-bold">{metrics.provider_calls.gemini}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-sm opacity-70">OpenAI Calls</div>
          <div className="text-4xl font-bold">{metrics.provider_calls.openai}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-sm opacity-70">Last Run Duration (s)</div>
          <div className="text-4xl font-bold">{metrics.last_run_duration.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
        <h3 className="font-bold text-lg">Execution Log Timeline</h3>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {executionLog.slice().reverse().map((log, i) => (
            <div key={i} className={`flex items-center gap-4 text-sm ${
              log.type === 'success' ? 'text-green-400' :
              log.type === 'error' ? 'text-red-400' : 'text-blue-400'
            }`}>
              <span className="opacity-70 text-xs">{log.time}</span>
              <span>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
