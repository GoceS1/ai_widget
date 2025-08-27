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
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-sm ring-1 ring-black/5"
      >
        <User className="w-4 h-4 text-gray-700" />
        <span className="text-sm text-gray-800">
          {selectedPersona.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-10 ring-1 ring-black/5">
          {defaultPersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150"
            >
              <div className="text-sm text-gray-800">
                {persona.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {persona.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}