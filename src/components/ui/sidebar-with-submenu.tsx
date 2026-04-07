'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import {
  Scale,
  LayoutDashboard,
  BrainCircuit,
  Milestone,
  History,
  FileBox,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  User,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuItem = { name: string; href: string; icon?: React.ReactNode | string };

const Menu = ({ children, items }: { children: React.ReactNode; items: MenuItem[] }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div>
      <button
        className="w-full flex items-center justify-between text-text-secondary p-2 rounded-lg hover:bg-void/5 active:bg-void/10 transition-colors duration-200"
        onClick={() => setIsOpened((v) => !v)}
        {...({ 'aria-expanded': isOpened ? 'true' : 'false' } as const)}
        aria-controls="submenu"
      >
        <div className="flex items-center gap-x-3">{children}</div>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', isOpened ? 'rotate-180' : '')}
          aria-hidden="true"
        />
      </button>

      <ul
        id="submenu"
        className={cn(
          'mx-4 mt-1 px-2 border-l border-white/10 space-y-1 text-sm font-medium',
          !isOpened && 'hidden',
        )}
      >
        {items.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.href}
              className="flex items-center gap-x-3 text-text-tertiary p-2 rounded-lg hover:bg-void/5 hover:text-text-primary active:bg-void/10 transition-colors duration-200"
            >
              {item.icon ? <div className="text-purple/70">{item.icon}</div> : null}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Sidebar = () => {
  const navigation: MenuItem[] = [
    {
      href: '/chat',
      name: 'Chambers',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '#',
      name: 'Analysis Matrix',
      icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
      href: '#',
      name: 'Courtroom Prep',
      icon: <Milestone className="w-5 h-5" />,
    },
    {
      href: '#',
      name: 'Case History',
      icon: <History className="w-5 h-5" />,
    },
  ];

  const nestedNav: MenuItem[] = [
    { name: 'Active Dockets', href: '#' },
    { name: 'Archived Briefs', href: '#' },
    { name: 'Legal Templates', href: '#' },
  ];

  const navsFooter: MenuItem[] = [
    {
      href: '/faq',
      name: 'Help & Intel',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      href: '#',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-80 h-full border-r border-white/5 bg-void premium-blur space-y-8 flex flex-col z-40">
      <div className="flex flex-col h-full">
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group w-full">
            <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center border border-purple/20 group-hover:border-purple/40 transition-colors">
              <Scale className="w-5 h-5 text-purple" />
            </div>
            <span className="font-display text-2xl text-purple font-semibold tracking-tight">
              JusticeAI
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-6">
          {/* Main Group */}
          <div>
            <p className="px-2 mb-2 text-xs font-semibold tracking-widest text-text-tertiary uppercase">
              Workspace
            </p>
            <ul className="text-sm font-medium space-y-1">
              {navigation.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-x-3 text-text-secondary p-2 rounded-lg hover:bg-void/5 hover:text-text-primary active:bg-void/10 transition-colors duration-200"
                  >
                    <div className="text-purple/70">{item.icon}</div>
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <div className="mt-1">
                  <Menu items={nestedNav}>
                    <FileBox className="w-5 h-5 text-purple/70" />
                    Documents
                  </Menu>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <ul className="text-sm font-medium space-y-1">
            {navsFooter.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.href}
                  className="flex items-center gap-x-3 text-text-secondary p-2 rounded-lg hover:bg-void/5 hover:text-text-primary active:bg-void/10 transition-colors duration-200"
                >
                  <div className="text-purple/70">{item.icon}</div>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Profile Dropdown */}
          <div className="relative border-t border-white/5 pt-4 mt-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-void/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple group">
                <div className="flex items-center gap-x-3">
                  <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-10 h-10 rounded-full border border-purple/20 bg-void">
                    <Avatar.Image
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop"
                      alt="Advocate Profile"
                    />
                    <Avatar.Fallback
                      className="w-full h-full flex items-center justify-center text-sm font-medium text-purple bg-purple/10"
                      delayMs={600}
                    >
                      AD
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="text-left flex flex-col justify-center">
                    <span className="block text-text-primary text-sm font-semibold leading-none">
                      A. Davies, Esq.
                    </span>
                    <span className="block mt-1 text-purple-light text-xs font-medium leading-none">
                      Senior Partner
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-text-tertiary group-hover:text-purple transition-colors" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[240px] rounded-xl premium-blur border border-white/10 shadow-2xl p-2 ml-4 mb-2 animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-2 py-2 mb-2 border-b border-white/5">
                    <span className="block text-text-primary text-sm font-medium">
                      a.davies@justiceai.app
                    </span>
                    <span className="block text-text-tertiary text-xs mt-0.5">
                      JusticeAI Enterprise
                    </span>
                  </div>

                  <DropdownMenu.Item className="flex items-center gap-2 p-2 px-3 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-void/10 hover:text-text-primary focus:bg-void/10 focus:outline-none transition-colors">
                    <User className="w-4 h-4" />
                    Profile & Billing
                  </DropdownMenu.Item>

                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger className="flex items-center justify-between p-2 px-3 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-void/10 hover:text-text-primary focus:bg-void/10 focus:outline-none transition-colors">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Theme
                      </div>
                      <ChevronDown className="w-3 h-3 -rotate-90" />
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent
                        className="z-50 min-w-[140px] rounded-xl premium-blur border border-white/10 shadow-2xl p-1 animate-in fade-in-80 zoom-in-95"
                        sideOffset={8}
                      >
                        <DropdownMenu.Item className="flex items-center gap-2 p-2 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-void/10 hover:text-text-primary focus:bg-void/10 focus:outline-none">
                          <Moon className="w-4 h-4" /> Dark
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="flex items-center gap-2 p-2 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-void/10 hover:text-text-primary focus:bg-void/10 focus:outline-none">
                          <Sun className="w-4 h-4" /> Light
                        </DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>

                  <div className="my-1 border-t border-white/5" />

                  <DropdownMenu.Item className="flex items-center gap-2 p-2 px-3 text-sm text-accent-error rounded-md cursor-pointer hover:bg-accent-error/10 focus:bg-accent-error/10 focus:outline-none transition-colors">
                    <LogOut className="w-4 h-4" />
                    Secure Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </nav>
  );
};
