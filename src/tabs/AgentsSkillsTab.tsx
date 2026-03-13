import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import yaml from 'js-yaml';

export const AgentsSkillsTab: React.FC = () => {
  const { agents, setAgents, refreshAgents } = useAppContext();
  const [yamlText, setYamlText] = useState('');
  const [skillText, setSkillText] = useState('');

  useEffect(() => {
    setYamlText(yaml.dump({ agents }));
  }, [agents]);

  useEffect(() => {
    // Fetch SKILL.md
    fetch('/SKILL.md')
      .then(res => res.text())
      .then(text => setSkillText(text))
      .catch(e => console.error(e));
  }, []);

  const handleSaveYaml = () => {
    try {
      const data = yaml.load(yamlText) as any;
      if (data && data.agents) {
        setAgents(data.agents);
        alert('Agents updated successfully!');
      }
    } catch (e) {
      alert('Invalid YAML format');
    }
  };

  const handleSaveSkill = () => {
    // In a real app, we would save this to the backend.
    // For this demo, we just update the state.
    alert('SKILL.md updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">🤖 Agents & Skills Configuration</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="font-semibold">agents.yaml</div>
          <textarea
            value={yamlText}
            onChange={(e) => setYamlText(e.target.value)}
            className="w-full h-96 bg-white/5 border border-white/20 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-4">
            <button onClick={handleSaveYaml} className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              💾 Save agents.yaml
            </button>
            <button onClick={refreshAgents} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition-colors border border-white/20">
              🔄 Reload
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="font-semibold">SKILL.md</div>
          <textarea
            value={skillText}
            onChange={(e) => setSkillText(e.target.value)}
            className="w-full h-96 bg-white/5 border border-white/20 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-4">
            <button onClick={handleSaveSkill} className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              💾 Save SKILL.md
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
