import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  FileText, 
  History, 
  Mail, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'employees' | 'generator' | 'history' | 'email' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewLetterClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewLetterClick,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'generator', label: 'Generate Letter', icon: FileText },
    { id: 'history', label: 'Letter History', icon: History },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Bar with Brand & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
              <img
                src="https://0e8dtpaport9ku82.public.blob.vercel-storage.com/emsurg_logo_cropped.png"
                alt="Emsurg Healthcare Logo"
                className="max-h-full max-w-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  Emsurg Healthcare India Pvt. Ltd.
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-teal-50 text-teal-700 rounded border border-teal-200">
                  Admin &amp; HR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                HR Management &amp; Document Center
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewLetterClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Generate Letter</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border-b-2 border-teal-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
