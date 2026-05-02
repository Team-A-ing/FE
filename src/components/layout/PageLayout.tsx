import { type ReactNode } from 'react';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main
        style={{ marginLeft: 'var(--sidebar-width)' }}
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
