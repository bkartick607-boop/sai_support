import React, { ReactNode } from 'react';
import { Header } from '@/components/common/Header';
import '@/styles/AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-center">
          AI-generated content may be incorrect
        </div>

        <div className="footer-right">
          <a
            href="https://www.microsoft.com/en-us/privacy/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Statement
          </a>
        </div>
      </footer>
    </div>
  );
};
