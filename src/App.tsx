import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TabsContainer } from './components/TabsContainer';
import { PAINTER_THEMES, CORAL_COLOR } from './constants';
import { motion } from 'motion/react';

const AppContent = () => {
  const { state } = useAppContext();
  const theme = PAINTER_THEMES.find((t) => t.id === state.currentThemeId) || PAINTER_THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    const isLight = state.themeMode === 'light';
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--bg-color', isLight ? theme.bg : '#05080F');
    root.style.setProperty('--text-color', isLight ? '#0B1725' : '#ECF0F1');
    root.style.setProperty('--coral', CORAL_COLOR);
  }, [state.themeMode, state.currentThemeId, theme]);

  return (
    <div 
      className="flex h-screen w-full overflow-hidden font-sans transition-colors duration-500"
      style={{
        background: 'radial-gradient(circle at top, var(--bg-color) 0%, #02040f 100%)',
        color: 'var(--text-color)',
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <Header />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden"
        >
          <TabsContainer />
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
