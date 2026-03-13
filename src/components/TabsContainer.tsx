import React, { useState } from 'react';
import { SummaryTab } from '../tabs/SummaryTab';
import { GuidanceTab } from '../tabs/GuidanceTab';
import { OCRAgentsTab } from '../tabs/OCRAgentsTab';
import { ReviewReportTab } from '../tabs/ReviewReportTab';
import { AgentPipelineTab } from '../tabs/AgentPipelineTab';
import { NoteKeeperTab } from '../tabs/NoteKeeperTab';
import { AgentsSkillsTab } from '../tabs/AgentsSkillsTab';
import { DashboardTab } from '../tabs/DashboardTab';
import { WOWVisualizationsTab } from '../tabs/WOWVisualizationsTab';
import { FileText, BookOpen, ScanText, FileCheck, GitMerge, PenTool, Settings, BarChart2, Sparkles } from 'lucide-react';

export const TabsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: '510(k) Summary', icon: <FileText className="w-4 h-4" />, component: <SummaryTab /> },
    { name: 'Review Guidance', icon: <BookOpen className="w-4 h-4" />, component: <GuidanceTab /> },
    { name: 'Submission OCR & Agents', icon: <ScanText className="w-4 h-4" />, component: <OCRAgentsTab /> },
    { name: 'Review Report', icon: <FileCheck className="w-4 h-4" />, component: <ReviewReportTab /> },
    { name: 'Agent Pipeline', icon: <GitMerge className="w-4 h-4" />, component: <AgentPipelineTab /> },
    { name: 'AI Note Keeper', icon: <PenTool className="w-4 h-4" />, component: <NoteKeeperTab /> },
    { name: 'Agents & Skills', icon: <Settings className="w-4 h-4" />, component: <AgentsSkillsTab /> },
    { name: 'Dashboard', icon: <BarChart2 className="w-4 h-4" />, component: <DashboardTab /> },
    { name: 'WOW Visualizations', icon: <Sparkles className="w-4 h-4 text-yellow-400" />, component: <WOWVisualizationsTab /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-x-auto border-b border-white/10 mb-6 pb-2 gap-2 scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
              activeTab === index
                ? 'bg-primary/20 border-b-2 border-primary text-primary font-bold'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};
