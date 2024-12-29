import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LinkProps {
  Icon: LucideIcon;
  text: string;
  href: string;
}

export function Link({ Icon, text, href }: LinkProps) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
    >
      <Icon size={20} />
      <span>{text}</span>
    </a>
  );
}