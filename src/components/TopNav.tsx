import React from 'react';

export type ActiveTab = 'navigator' | 'directory' | 'brief' | 'walkthrough';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCounselorSupport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCounselorSupport,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'navigator', label: 'Care Navigator' },
    { id: 'directory', label: 'Services Directory' },
    { id: 'brief', label: 'Product Brief' },
    { id: 'walkthrough', label: 'Walkthrough' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E4DF] bg-[#F8F7F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        <button
          type="button"
          onClick={() => onSelectTab('navigator')}
          className="font-display text-lg font-bold tracking-tight text-[#1C2421] whitespace-nowrap shrink-0 cursor-pointer"
        >
          YourDOST
        </button>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#575A56]"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#1C2421] font-semibold'
                    : 'text-[#575A56] hover:text-[#1C2421]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#1F6E5D]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCounselorSupport}
            className="rounded-lg bg-[#1F6E5D] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#18584A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Talk to a Counselor
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="Mobile sections"
        className="flex md:hidden items-center gap-4 overflow-x-auto border-t border-[#E5E4DF] px-6 py-2.5 text-xs font-medium"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                isActive ? 'text-[#1F6E5D] font-semibold' : 'text-[#575A56]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
