import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PAINTER_THEMES, AI_MODELS } from '../constants';
import { Settings, Palette, Globe, Moon, Sun, Key } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { state, setState } = useAppContext();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, currentThemeId: e.target.value }));
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, themeMode: e.target.value }));
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, language: e.target.value }));
  };

  const handleJackpot = () => {
    const randomTheme = PAINTER_THEMES[Math.floor(Math.random() * PAINTER_THEMES.length)];
    setState((prev) => ({ ...prev, currentThemeId: randomTheme.id }));
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setState((prev) => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [provider]: value },
    }));
  };

  return (
    <div className="w-64 h-full border-r border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center gap-2 text-xl font-bold">
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Globe className="w-4 h-4" /> Language 語言
        </label>
        <select
          value={state.language}
          onChange={handleLangChange}
          className="bg-white/10 border border-white/20 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="en">English</option>
          <option value="zh">繁體中文</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2">
          {state.themeMode === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          Theme Mode
        </label>
        <select
          value={state.themeMode}
          onChange={handleModeChange}
          className="bg-white/10 border border-white/20 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" /> Painter Style
        </label>
        <select
          value={state.currentThemeId}
          onChange={handleThemeChange}
          className="bg-white/10 border border-white/20 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {PAINTER_THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {state.language === 'en' ? theme.name_en : theme.name_zh}
            </option>
          ))}
        </select>
        <button
          onClick={handleJackpot}
          className="mt-2 bg-primary/20 hover:bg-primary/40 border border-primary/50 rounded-md py-2 text-sm transition-colors"
        >
          🎰 Style Jackpot
        </button>
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Key className="w-4 h-4" />
          <span>API Keys</span>
        </div>
        {Object.keys(AI_MODELS).map((provider) => (
          <div key={provider} className="flex flex-col gap-1">
            <label className="text-xs opacity-80 capitalize">{provider}</label>
            <input
              type="password"
              value={state.apiKeys[provider] || ''}
              onChange={(e) => handleApiKeyChange(provider, e.target.value)}
              placeholder={`${provider} API Key`}
              className="bg-white/10 border border-white/20 rounded-md p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
