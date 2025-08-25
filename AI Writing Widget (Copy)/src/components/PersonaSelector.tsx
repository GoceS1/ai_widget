import React, { useState } from "react";
import { ChevronDown, User } from "lucide-react";

interface PersonaOption {
  id: string;
  name: string;
  description: string;
}

const defaultPersonas: PersonaOption[] = [
  {
    id: "default",
    name: "Default",
    description: "General writing assistance",
  },
  {
    id: "b2b-sales",
    name: "B2B Sales",
    description: "Professional sales communication",
  },
  {
    id: "my-boss",
    name: "My Boss",
    description: "Executive-level communication",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Creative and engaging content",
  },
];

export function PersonaSelector() {
  const [selectedPersona, setSelectedPersona] = useState(
    defaultPersonas[0],
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.01] backdrop-blur-sm border border-white/40 hover:bg-white/[0.05] hover:border-white/60 transition-all duration-200 shadow-lg"
      >
        <User className="w-4 h-4 text-white/80" />
        <span className="text-sm text-white/95">
          {selectedPersona.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/[0.03] backdrop-blur-lg border border-white/40 rounded-xl shadow-2xl z-10">
          {defaultPersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/[0.08] first:rounded-t-xl last:rounded-b-xl transition-colors duration-150"
            >
              <div className="text-sm text-white/95">
                {persona.name}
              </div>
              <div className="text-xs text-white/70 mt-1">
                {persona.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}