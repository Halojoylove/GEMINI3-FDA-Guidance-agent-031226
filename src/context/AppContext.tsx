import React, { createContext, useContext, useState, useEffect } from 'react';
import yaml from 'js-yaml';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  max_tokens: number;
  temperature: number;
  system_prompt: string;
  provider: string;
}

export interface AppState {
  language: string;
  themeMode: string;
  currentThemeId: string;
  health: number;
  mana: number;
  experience: number;
  level: number;
  apiKeys: Record<string, string>;
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  agents: AgentConfig[];
  setAgents: React.Dispatch<React.SetStateAction<AgentConfig[]>>;
  metrics: any;
  setMetrics: React.Dispatch<React.SetStateAction<any>>;
  executionLog: any[];
  setExecutionLog: React.Dispatch<React.SetStateAction<any[]>>;
  refreshAgents: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    language: 'en',
    themeMode: 'light',
    currentThemeId: 'vangogh_starry',
    health: 100,
    mana: 100,
    experience: 0,
    level: 1,
    apiKeys: {
      gemini: (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
      openai: '',
      anthropic: '',
      xai: '',
    },
  });

  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [metrics, setMetrics] = useState({
    total_runs: 0,
    provider_calls: { gemini: 0, openai: 0, anthropic: 0, xai: 0 },
    tokens_used: 0,
    last_run_duration: 0.0,
  });
  const [executionLog, setExecutionLog] = useState<any[]>([]);

  const refreshAgents = async () => {
    try {
      // In a real app, we'd fetch from a backend API.
      // For this demo, we'll try to fetch the static file if served,
      // or just use a default list if it fails.
      const res = await fetch('/agents.yaml');
      if (res.ok) {
        const text = await res.text();
        const data = yaml.load(text) as any;
        if (data && data.agents) {
          setAgents(data.agents);
        }
      } else {
        // Fallback default agents
        setAgents([
          {
            id: 'agent_1',
            name: 'Regulatory Analyst',
            description: 'Analyzes regulatory documents for compliance.',
            model: 'gemini-2.5-flash',
            max_tokens: 8000,
            temperature: 0.2,
            system_prompt: 'You are a regulatory analyst. Analyze the provided document for compliance with FDA guidelines.',
            provider: 'gemini',
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load agents.yaml', e);
    }
  };

  useEffect(() => {
    refreshAgents();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        agents,
        setAgents,
        metrics,
        setMetrics,
        executionLog,
        setExecutionLog,
        refreshAgents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
