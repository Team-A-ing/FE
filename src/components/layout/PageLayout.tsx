import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import CreateMeetingModal from '@/components/ui/CreateMeetingModal';
import { useMeetingStore } from '@/stores/meetingStore';

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 220;

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { isCreateModalOpen, setCreateModalOpen } = useMeetingStore();
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true'
  );

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      <main
        style={{ marginLeft: sidebarWidth, transition: 'margin-left 200ms ease' }}
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          setCreateModalOpen(false);
        }}
      />
    </div>
  );
}
