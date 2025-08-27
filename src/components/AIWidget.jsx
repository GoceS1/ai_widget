import React, { useState } from 'react'
import { User, ChevronDown, Sparkles, Briefcase, Scissors, CheckCircle, Copy, Check, Loader2 } from 'lucide-react'
import { processTextWithAI } from '../services/aiService.js'

const AIWidget = ({ selectedText, onClose, theme = 'dark' }) => {
  // console.log(' AIWidget component rendering with text:', selectedText)
  const [inputText, setInputText] = useState('')
  const [persona, setPersona] = useState('default')
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false)
  const [copyState, setCopyState] = useState('copy') // 'copy', 'copied', 'loading'
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState(null)

  const personas = [
    { id: 'default', name: 'Default', description: 'General writing assistance' },
    { id: 'b2b-sales', name: 'B2B Sales', description: 'Professional sales communication' },
    { id: 'project-management', name: 'Project Management', description: 'Project planning and coordination' },
    { id: 'my-boss', name: 'My Boss', description: 'Executive-level communication' },
    { id: 'creative', name: 'Creative', description: 'Creative and engaging content' },
  ]

  const actions = [
    { id: 'improve', label: 'Improve', icon: <Sparkles size={20} /> },
    { id: 'professional', label: 'Make Professional', icon: <Briefcase size={20} /> },
    { id: 'shorter', label: 'Make Shorter', icon: <Scissors size={20} /> },
    { id: 'grammar', label: 'Fix Grammar', icon: <CheckCircle size={20} /> },
  ]

  const handleAction = async (actionId, e) => {
    // Prevent event bubbling
    e.stopPropagation()
    
    // Use the SELECTED text from the webpage, not the textarea
    const textToProcess = selectedText || "No text selected"
    
    if (!textToProcess || textToProcess === "No text selected") {
      console.log('No text selected on webpage')
      return
    }
    
    // Set loading state
    setIsProcessing(true)
    setProcessingAction(actionId)
    
    try {
      // Process text with AI
      const result = await processTextWithAI(actionId, textToProcess, null, persona)
      
      if (result.success) {
        // Update textarea with AI response
        setInputText(result.text)
      } else {
        // Handle error
        console.error('AI processing failed:', result.error)
        setInputText(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('AI processing error:', error)
      setInputText(`Error: ${error.message}`)
    } finally {
      // Clear loading state
      setIsProcessing(false)
      setProcessingAction(null)
    }
  }

  const handleCopy = async (e) => {
    // Prevent event bubbling to avoid closing widget
    e.stopPropagation()
    
    // Copy whatever is in the textarea
    const textToCopy = inputText.trim()
    
    if (textToCopy) {
      try {
        setCopyState('loading')
        
        await navigator.clipboard.writeText(textToCopy)
        
        setCopyState('copied')
        // console.log('Copied to clipboard:', textToCopy)
        
        // Reset back to copy icon after 1.5 seconds
        setTimeout(() => {
          setCopyState('copy')
        }, 1500)
        
      } catch (error) {
        console.error('Failed to copy:', error)
        setCopyState('copy')
      }
    } else {
      // console.log('Nothing to copy - no text selected or in textarea')
    }
  }

  const handleClose = (e) => {
    // Prevent event bubbling
    e.stopPropagation()
    // console.log('Closing widget')
    onClose() // This should call hideWidget from content.jsx
  }

  const getCurrentPersona = () => {
    return personas.find(p => p.id === persona) || personas[0]
  }

  const handlePersonaSelect = (personaId, e) => {
    e.stopPropagation() // Prevent event bubbling
    setPersona(personaId)
    setShowPersonaDropdown(false)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPersonaDropdown) {
        setShowPersonaDropdown(false)
      }
    }

    if (showPersonaDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPersonaDropdown])

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      
      // Use the selectedText from props (stored when widget opened)
      const textToProcess = selectedText || "No text selected"
      
      if (!textToProcess || textToProcess === "No text selected") {
        console.log('No text selected on webpage')
        return
      }
      
      // Send custom prompt + selected text to AI
      const customPrompt = inputText.trim()
      
      if (!customPrompt) {
        console.log('No custom prompt entered')
        return
      }
      
      console.log('Processing custom prompt:', customPrompt, 'with text:', textToProcess)
      
      // Set loading state
      setIsProcessing(true)
      setProcessingAction('custom')
      
      try {
        // Process text with AI using custom prompt
        const result = await processTextWithAI('improve', textToProcess, customPrompt, persona)
        
        if (result.success) {
          // Update textarea with AI response
          setInputText(result.text)
        } else {
          // Handle error
          console.error('AI processing failed:', result.error)
          setInputText(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error('AI processing error:', error)
        setInputText(`Error: ${error.message}`)
      } finally {
        // Clear loading state
        setIsProcessing(false)
        setProcessingAction(null)
      }
    }
  }

  // Theme-aware style generator
  const isDark = theme === 'dark'
  const textColor = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 1)'
  const textColorSecondary = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.95)'
  const textColorTertiary = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.7)'
  const bgColor = isDark ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'
  const borderColorHover = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)'
  const bgColorHover = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  }

  const personaSelectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '9999px',
    backgroundColor: bgColor,
    backdropFilter: 'blur(4px)',
    border: `1px solid ${borderColor}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '9999px',
    backgroundColor: bgColor,
    backdropFilter: 'blur(4px)',
    border: `1px solid ${borderColor}`,
    color: textColorSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }

  const inputContainerStyle = {
    marginBottom: '32px',
    position: 'relative'
  }

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    color: textColor, // Theme-aware text color
    fontSize: '18px', // Figma: text-lg
    lineHeight: '1.625', // Figma: leading-relaxed
    fontFamily: 'inherit'
  }

  const shortcutTextStyle = {
    fontSize: '12px',
    color: textColorTertiary, // Theme-aware text color
    marginTop: '8px'
  }

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '0'
  }

  const shortcutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Figma: gap-3
    padding: '12px 16px', // Figma: px-4 py-3
    borderRadius: '8px', // Figma: rounded-lg
    background: 'transparent',
    border: 'none',
    color: textColorSecondary, // Theme-aware text color
    cursor: 'pointer',
    transition: 'all 0.2s ease' // Figma: duration-200
  }

  const closeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '9999px',
    backgroundColor: bgColor,
    backdropFilter: 'blur(4px)',
    border: `1px solid ${borderColor}`,
    color: textColorSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }

  const getCopyButtonIcon = () => {
    switch (copyState) {
      case 'copy':
        return <Copy size={16} />
      case 'copied':
        return <Check size={16} />
      case 'loading':
        return <div style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      default:
        return <Copy size={16} />
    }
  }

  return (
    <>
      {/* Header with persona selector and action buttons */}
      <div style={headerStyle}>
        <div style={{ position: 'relative' }}>
          <div 
            style={personaSelectorStyle}
            onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = bgColorHover
              e.target.style.borderColor = borderColorHover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = bgColor
              e.target.style.borderColor = borderColor
            }}
          >
            <User size={16} style={{ color: textColor }} />
            <span style={{ fontSize: '14px', color: textColor }}>
              {getCurrentPersona().name}
            </span>
            <ChevronDown size={16} style={{ color: textColor }} />
          </div>
          
          {/* Persona Dropdown */}
          {showPersonaDropdown && (
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              marginTop: '4px',
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '8px 0',
              minWidth: '200px',
              zIndex: 1000,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              {personas.map(p => (
                <div
                  key={p.id}
                  onClick={(e) => handlePersonaSelect(p.id, e)}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: textColor,
                    fontSize: '14px',
                    backgroundColor: p.id === persona ? bgColorHover : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (p.id !== persona) {
                      e.target.style.backgroundColor = bgColorHover
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p.id !== persona) {
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <div style={{ fontWeight: p.id === persona ? '600' : '400' }}>
                    {p.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: textColorTertiary,
                    marginTop: '2px'
                  }}>
                    {p.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleCopy}
            style={{
              ...actionButtonStyle,
              color: textColorSecondary // Theme-aware color
            }}
            onMouseEnter={(e) => {
              if (copyState === 'copy') {
                e.target.style.backgroundColor = bgColorHover
                e.target.style.borderColor = borderColorHover
              }
            }}
            onMouseLeave={(e) => {
              if (copyState === 'copy') {
                e.target.style.backgroundColor = bgColor
                e.target.style.borderColor = borderColor
              }
            }}
          >
            {getCopyButtonIcon()}
          </button>
          
          <button 
            onClick={handleClose}
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = bgColorHover
              e.target.style.borderColor = borderColorHover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = bgColor
              e.target.style.borderColor = borderColor
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main input area */}
      <div style={inputContainerStyle}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write, edit, or ask anything..."
          style={{
            ...textareaStyle,
            opacity: isProcessing && processingAction === 'custom' ? 0.6 : 1,
            transition: 'opacity 0.3s ease'
          }}
          disabled={isProcessing && processingAction === 'custom'}
        />
        
        {/* Loading indicator for custom prompts */}
        {isProcessing && processingAction === 'custom' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: textColorSecondary,
            fontSize: '14px',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              gap: '4px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: textColorSecondary,
                animation: 'bounce 1.4s ease-in-out infinite both'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: textColorSecondary,
                animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: textColorSecondary,
                animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
              }} />
            </div>
            <span>Processing...</span>
          </div>
        )}
        
        {/* Keyboard shortcut hint */}
        <div style={{
          ...shortcutTextStyle,
          opacity: isProcessing && processingAction === 'custom' ? 0.4 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          Press ⌘+Enter to execute custom prompts
        </div>
      </div>

      {/* Action buttons */}
      <div style={buttonContainerStyle}>
        {actions.map(action => {
          const isProcessingThisAction = isProcessing && processingAction === action.id
          
          return (
            <button
              key={action.id}
              onClick={(e) => handleAction(action.id, e)}
              disabled={isProcessing}
              style={{
                ...shortcutButtonStyle,
                opacity: isProcessing && !isProcessingThisAction ? 0.5 : 1,
                cursor: isProcessing ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.target.style.backgroundColor = bgColorHover
                  e.target.style.color = textColor
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = textColorSecondary
                }
              }}
            >
              {isProcessingThisAction ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                action.icon
              )}
              <span style={{ fontSize: '14px' }}>
                {isProcessingThisAction ? 'Processing...' : action.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export default AIWidget
