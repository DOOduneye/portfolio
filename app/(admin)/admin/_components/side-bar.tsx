'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {
  Newspaper,
  Building,
  Library,
  UploadCloud,
  LayoutList,
} from 'lucide-react';

import {cn} from '@/lib/utils';

export const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    {
      href: '/admin/posts',
      icon: <Newspaper className="w-5 h-5" />,
      text: 'Posts',
    },
    {
      href: '/admin/description',
      icon: <LayoutList className="w-5 h-5" />,
      text: 'Description',
    },
    {
      href: '/admin/projects',
      icon: <Building className="w-5 h-5" />,
      text: 'Projects',
    },
    {
      href: '/admin/experiences',
      icon: <Library className="w-5 h-5" />,
      text: 'Experiences',
    },
    {
      href: '/admin/upload',
      icon: <UploadCloud className="w-5 h-5" />,
      text: 'Update Resume',
    },
  ];

  return (
    <div className="hidden sm:flex sm:flex-col sm:px-8 sm:pt-10 sm:h-screen">
      <div className="flex flex-col gap-y-2 pr-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              'w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground',
              pathname === link.href && 'bg-accent text-accent-foreground'
            )}
          >
            <div className="flex flex-row gap-2">
              {link.icon}
              <span>{link.text}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
