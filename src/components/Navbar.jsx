"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/core/context/AuthContext';
import UserAvatar from './UserAvatar';

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Code Challenges', href: '/challenge' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname(); 
  const { user, logout } = useAuth();
  const formattedUser = user ? {
    id: user.id || user.id_user,
    name: user.username || user.name,
    avatarUrl: user.avatar_url || user.avatarUrl
  } : null;

  const navItems = user?.role === 'admin' 
    ? [...navigation, { name: 'Dashboard', href: '/admin/dashboard' }]
    : navigation;

  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          {/* Botón menú móvil */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Contenedor principal */}
          <div className="flex flex-1 items-center justify-center relative">
            {/* Logo */}
            <div className="absolute left-0 flex items-center">
            <Link href="/home" className="flex items-center">
              <img
                src="/CodeArenaLogoNoText.png"
              alt="Company Logo"
              className="h-6 w-7"
              />
              <span className="text-white font-mono text-xl tracking-tight hidden sm:block ml-2">
                  CodeArena
                </span>
            </Link>
            </div>

            {/* Menú navegación */}
            <div className="hidden sm:block font-mono">
              <div className="flex space-x-16">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined} // Verifica la ruta actual
                    className={classNames(
                      pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white', // Aplica la clase activa
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="absolute right-0 flex items-center pr-2 sm:pr-0">
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-transparent text-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <UserAvatar 
                      user={formattedUser} 
                      size="sm" 
                      className="transition-transform hover:scale-110"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={classNames(active ? 'bg-gray-800' : '', 'block px-4 py-2 text-sm text-white font-mono')}
                      >
                        Profile
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        type="button"
                        className={classNames(active ? 'bg-gray-800' : '', 'block w-full text-left px-4 py-2 text-sm text-white font-mono')}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navItems.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={classNames(
                pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium font-robotoMono'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}