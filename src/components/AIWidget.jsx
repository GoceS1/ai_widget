import React, { useState } from 'react'
import { User, ChevronDown, Sparkles, Briefcase, Scissors, CheckCircle, Copy, Check, Loader2 } from 'lucide-react'
import { processTextWithAI } from '../services/aiService.js'

const AIWidget = ({ selectedText, onClose }) => {
  // console.log(' AIWidget component rendering with text:', selectedText)
  const [inputText, setInputText] = useState('')
  const [persona, setPersona] = useState('default')
  const [copyState, setCopyState] = useState('copy') // 'copy', 'copied', 'loading'
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState(null)

  const personas = [
    { id: 'default', name: 'Default', description: 'General writing assistance' },
    { id: 'b2b-sales', name: 'B2B Sales', description: 'Professional sales communication' },
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
      const result = await processTextWithAI(actionId, textToProcess)
      
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
    
    // Copy the selected text from the webpage, not the textarea
    const textToCopy = selectedText || inputText.trim()
    
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
        const result = await processTextWithAI('improve', textToProcess, customPrompt)
        
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }

  const inputContainerStyle = {
    marginBottom: '32px'
  }

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    color: 'rgba(255, 255, 255, 0.95)', // Figma: text-white/95
    fontSize: '18px', // Figma: text-lg
    lineHeight: '1.625', // Figma: leading-relaxed
    fontFamily: 'inherit'
  }

  const shortcutTextStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)', // Figma: text-white/40
    marginTop: '8px'
  }

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  }

  const shortcutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Figma: gap-3
    padding: '12px 16px', // Figma: px-4 py-3
    borderRadius: '8px', // Figma: rounded-lg
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.8)', // Figma: text-white/80
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    color: 'rgba(255, 255, 255, 0.8)',
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
        <div style={personaSelectorStyle}>
          <User size={16} />
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>
            {personas[0].name}
          </span>
          <ChevronDown size={16} />
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleCopy}
            style={{
              ...actionButtonStyle,
              color: 'rgba(255, 255, 255, 0.8)' // Always white, no green
            }}
            onMouseEnter={(e) => {
              if (copyState === 'copy') {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (copyState === 'copy') {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.01)'
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              }
            }}
          >
            {getCopyButtonIcon()}
          </button>
          
          <button 
            onClick={handleClose}
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.01)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
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
          style={textareaStyle}
        />
        
        {/* Keyboard shortcut hint */}
        <div style={shortcutTextStyle}>
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
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                  e.target.style.color = 'rgba(255, 255, 255, 0.95)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)'
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
