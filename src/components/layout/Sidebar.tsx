import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMeetingStore } from '@/stores/meetingStore'; // 스토어 임포트
import { ROUTES } from '@/constants/routes';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const navItems: NavItem[] = [
  { label: '1on1 미팅', path: '/leader/meetings', icon: <CalendarIcon /> },
  { label: '멤버 리포트', path: '/leader/reports', icon: <UsersIcon /> },
  { label: '9Box', path: '/leader/9box', icon: <GridIcon /> },
  { label: '대시보드', path: '/leader/overview', icon: <BarChartIcon /> },
  { label: '팀 인사이트 대시보드', path: '/leader/dashboard', icon: <BarChartIcon /> },];

const bottomItems = [
  { label: '설정', path: '/settings', icon: <SettingsIcon /> },
  { label: '멤버 초대하기', path: '/invite', icon: <UserPlusIcon /> },
];

export default function Sidebar() {
  const setCreateModalOpen = useMeetingStore((s) => s.setCreateModalOpen);
  const location = useLocation();

  // "1on1 미팅" 네비게이션이 활성화되어야 하는 경로들
  const isMeetingActive = location.pathname === '/leader/meetings' || location.pathname.startsWith('/leader/meeting/');

  return (
    <aside
      style={{ width: 'var(--sidebar-width)', background: '#F8F9FA', borderRight: '1px solid #E9ECEF' }}
      className="fixed left-0 top-0 h-full flex flex-col bg-white border-r border-gray-100 z-20"
    >
      {/* Workspace */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-100">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-sm font-semibold text-gray-800 flex-1 text-left">Test</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* New 1on1 Button */}
      <div className="px-4 pt-3 pb-2">
        <button 
          onClick={() => setCreateModalOpen(true)} // 클릭 시 전역 상태 변경
          className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          새 1on1 만들기
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 overflow-y-auto">
        {navItems.map((item) => {
          // 1on1 미팅 아이템의 경우 특별한 활성화 로직 적용
          const isActive = item.path === '/leader/meetings' ? isMeetingActive : location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm mb-0.5 transition-colors ${
                isActive
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-gray-500">{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-2 border-t border-gray-100 pt-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span className="text-gray-500">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Footer links */}
      <div className="px-3 pb-2">
        <button className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <BellIcon />
            <span>업데이트 노트</span>
          </div>
          <ChevronRightIcon />
        </button>
        <button className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <BookIcon />
            <span>서비스 가이드</span>
          </div>
          <ChevronRightIcon />
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">G</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Guest</p>
            <p className="text-xs text-gray-400 truncate">guest@readb.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
