import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ShortcutButtonProps {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
}

export function ShortcutButton({ icon: Icon, text, onClick }: ShortcutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 group border border-transparent hover:border-white/20"
    >
      <Icon className="w-5 h-5 text-gray-700 group-hover:text-gray-800 transition-colors duration-200" />
      <span className="text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
        {text}
      </span>
    </button>
  );
}