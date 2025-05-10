
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Folder, ArchiveX, File, FileArchive } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active, onClick }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const sidebarWidth = isMobile ? 'w-64' : collapsed ? 'w-16' : 'w-64';
  
  return (
    <aside className={`h-full bg-white border-l transition-all duration-300 ${sidebarWidth}`}>
      <div className="p-4">
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="mb-6 p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? "→" : "←"}
          </button>
        )}
        
        <div className="space-y-1">
          <SidebarItem 
            icon={<Folder size={20} />} 
            label="الرئيسية" 
            to="/"
            active={location.pathname === '/'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<ArchiveX size={20} />} 
            label="المخزون" 
            to="/inventory"
            active={location.pathname === '/inventory'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<File size={20} />} 
            label="المبيعات" 
            to="/sales"
            active={location.pathname === '/sales'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<FileArchive size={20} />} 
            label="الديون" 
            to="/debts"
            active={location.pathname === '/debts'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<FileArchive size={20} />} 
            label="التقارير" 
            to="/reports"
            active={location.pathname === '/reports'}
            onClick={onClose}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
