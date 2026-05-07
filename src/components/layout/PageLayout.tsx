import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import CreateMeetingModal from '@/components/ui/CreateMeetingModal';
import { useMeetingStore } from '@/stores/meetingStore';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { isCreateModalOpen, setCreateModalOpen } = useMeetingStore();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main
        style={{ marginLeft: 'var(--sidebar-width)' }}
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
