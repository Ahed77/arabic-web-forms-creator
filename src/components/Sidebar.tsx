
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ArchiveX, File, FileArchive } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
      <div className="text-xl">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <aside className={`h-full bg-white border-l transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="mb-6 p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? "→" : "←"}
        </button>
        
        <div className="space-y-1">
          <SidebarItem 
            icon={<Folder size={20} />} 
            label="الرئيسية" 
            to="/"
            active={true}
          />
          <SidebarItem 
            icon={<ArchiveX size={20} />} 
            label="المخزون" 
            to="/inventory"
          />
          <SidebarItem 
            icon={<File size={20} />} 
            label="المبيعات" 
            to="/sales"
          />
          <SidebarItem 
            icon={<FileArchive size={20} />} 
            label="الديون" 
            to="/debts"
          />
          <SidebarItem 
            icon={<FileArchive size={20} />} 
            label="التقارير" 
            to="/reports"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
