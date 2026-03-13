import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PAINTER_THEMES } from '../constants';
import { Heart, Zap, Award, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, metrics } = useAppContext();
  const theme = PAINTER_THEMES.find((t) => t.id === state.currentThemeId) || PAINTER_THEMES[0];
  const themeName = state.language === 'en' ? theme.name_en : theme.name_zh;

  const stress = Math.max(0, 100 - state.health);

  const unlocked = [];
  if (state.experience >= 50) unlocked.push('🌸 First Bloom Reviewer (50+ XP)');
  if (state.experience >= 200) unlocked.push('🌺 Seasoned 510(k) Reviewer (200+ XP)');
  if (metrics.total_runs >= 10) unlocked.push('🌷 Ten Runs of Tranquility (10+ AI calls)');

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">FDA 510(k) Review Studio · Painter Edition</h1>
          <div className="text-sm opacity-85">Agentic Regulatory Workspace · {themeName}</div>
        </div>
        <div className="text-right text-xs opacity-85 flex flex-col gap-1 items-end">
          <span className="px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">510(k) · Agentic AI</span>
          <span className="px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">WOW UI</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Heart className="w-4 h-4 text-red-400" /> Health
          </div>
          <div className="w-full bg-black/20 rounded-full h-2.5">
            <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${state.health}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Zap className="w-4 h-4 text-blue-400" /> Mana
          </div>
          <div className="w-full bg-black/20 rounded-full h-2.5">
            <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${state.mana}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Award className="w-4 h-4 text-yellow-400" /> Level {state.level}
          </div>
          <div className="text-xs opacity-80">XP: {state.experience}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-white to-accent shadow-[0_0_15px_rgba(130,224,170,0.8)] flex items-center justify-center">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/80 to-transparent animate-pulse"></div>
            <Activity className="w-6 h-6 text-black/50 z-10" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-xs opacity-90 font-medium">Regulatory Stress Meter</div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: `${stress}%` }}></div>
            </div>
            <div className="text-[10px] opacity-70 text-right">{stress}%</div>
          </div>
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md text-sm">
          <strong className="block mb-2">Achievement Blossoms</strong>
          <ul className="list-disc list-inside opacity-90 space-y-1">
            {unlocked.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
