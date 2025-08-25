/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        card-foreground: "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        popover-foreground: "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        primary-foreground: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondary-foreground: "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        muted-foreground: "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        accent-foreground: "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        destructive-foreground: "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

Now let's create the core React components! First, the main AI Widget that appears on text selection:

```jsx:src/components/AIWidget.jsx
import React, { useState } from 'react'
import { Send, Copy, Sparkles, Briefcase, Scissors, CheckCircle } from 'lucide-react'

const AIWidget = ({ selectedText, onClose }) => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState('default')

  const personas = [
    { id: 'default', name: 'Default', icon: Sparkles },
    { id: 'professional', name: 'Professional', icon: Briefcase },
    { id: 'casual', name: 'Casual', icon: Sparkles },
  ]

  const quickActions = [
    { id: 'improve', name: 'Improve', icon: Sparkles },
    { id: 'professional', name: 'Make Professional', icon: Briefcase },
    { id: 'shorter', name: 'Make Shorter', icon: Scissors },
    { id: 'grammar', name: 'Fix Grammar', icon: CheckCircle },
  ]

  const handleQuickAction = (action) => {
    const actionPrompts = {
      improve: `Improve this text: "${selectedText}"`,
      professional: `Make this text more professional: "${selectedText}"`,
      shorter: `Make this text shorter: "${selectedText}"`,
      grammar: `Fix grammar in this text: "${selectedText}"`,
    }
    setPrompt(actionPrompts[action])
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    setIsLoading(true)
    setResponse('')
    
    // TODO: Replace with actual OpenAI API call
    // For now, simulate a response
    setTimeout(() => {
      setResponse('This is a simulated AI response. Replace with actual OpenAI API integration.')
      setIsLoading(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/20">
      <div className="glass w-full max-w-2xl mx-4 p-6 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPersona} 
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm border border-border"
            >
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Selected Text Preview */}
        <div className="mb-4 p-3 bg-secondary/50 rounded-md">
          <p className="text-sm text-muted-foreground mb-1">Selected Text:</p>
          <p className="text-sm text-foreground">{selectedText}</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-
