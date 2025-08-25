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
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.05] transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors duration-200" />
      <span className="text-white/80 group-hover:text-white/95 transition-colors duration-200">
        {text}
      </span>
    </button>
  );
}