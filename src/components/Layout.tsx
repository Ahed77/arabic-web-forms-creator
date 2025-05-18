
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { NotificationCenter } from './ui/notification-center';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50" dir="rtl">
      {/* Mobile menu toggle button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="fixed bottom-24 right-4 z-50 bg-white rounded-full shadow-lg h-12 w-12 flex items-center justify-center border border-gray-200"
        >
          <Menu className="h-6 w-6 text-indigo-600" />
        </Button>
      )}
      
      {/* Notification Center - Always visible */}
      <div className="fixed top-4 left-4 z-50">
        <NotificationCenter />
      </div>
      
      {/* Sidebar with conditional display for mobile */}
      <div className={`${isMobile ? 'fixed inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out' : ''} ${showMobileSidebar || !isMobile ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar onClose={() => setShowMobileSidebar(false)} />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Main content */}
      <main className={`flex-1 overflow-auto p-4 sm:p-6 ${isMobile ? 'pt-16' : ''}`}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
