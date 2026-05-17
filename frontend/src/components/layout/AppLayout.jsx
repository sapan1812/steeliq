import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import { useAuthStore } from '../../store/authStore.js';
import AIAssistant from '../ai/AIAssistant.jsx';

export default function AppLayout() {
  const { theme } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Sync theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Track mobile viewport
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  const sidebarW = sidebarCollapsed
    ? 'var(--sidebar-w-closed)'
    : 'var(--sidebar-w)';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header onMenuClick={handleMenuClick} sidebarOpen={!sidebarCollapsed} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <main
        style={{
          position: 'fixed',
          top: 'var(--header-h)',
          left: isMobile ? 0 : sidebarW,
          right: 0,
          bottom: 0,
          background: 'var(--bg)',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'left var(--transition-md)',
        }}
      >
        <Outlet />
      </main>

      <AIAssistant />
    </div>
  );
}
