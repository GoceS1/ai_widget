import React from 'react'
import ReactDOM from 'react-dom' // Change this import
import AIWidget from './components/AIWidget'
import { setApiKey } from './services/aiService.js'
import './styles/globals.css'

console.log('🎯 AI Widget content script loaded!')

// Function to detect website theme (dark/light)
function detectWebsiteTheme() {
  try {
    // Get computed styles of body and html
    const bodyStyle = window.getComputedStyle(document.body)
    const htmlStyle = window.getComputedStyle(document.documentElement)
    
    // Get background colors
    const bodyBg = bodyStyle.backgroundColor
    const htmlBg = htmlStyle.backgroundColor
    
    // Convert to RGB values
    const getRGBValues = (color) => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
      }
      return null
    }
    
    const bodyRGB = getRGBValues(bodyBg)
    const htmlRGB = getRGBValues(htmlBg)
    
    // Calculate brightness (using luminance formula)
    const calculateBrightness = (rgb) => {
      if (!rgb) return 0
      return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
    }
    
    // Get brightness values
    const bodyBrightness = calculateBrightness(bodyRGB)
    const htmlBrightness = calculateBrightness(htmlRGB)
    
    // Use the brighter of the two as the main background
    const mainBrightness = Math.max(bodyBrightness, htmlBrightness)
    
    // Sample additional elements for better detection
    const sampleElements = [
      document.querySelector('main'),
      document.querySelector('article'),
      document.querySelector('.content'),
      document.querySelector('#content'),
      document.querySelector('.main'),
      document.querySelector('#main')
    ].filter(el => el)
    
    let totalBrightness = mainBrightness
    let sampleCount = 1
    
    sampleElements.forEach(el => {
      const style = window.getComputedStyle(el)
      const bgColor = style.backgroundColor
      const rgb = getRGBValues(bgColor)
      if (rgb) {
        totalBrightness += calculateBrightness(rgb)
        sampleCount++
      }
    })
    
    const averageBrightness = totalBrightness / sampleCount
    
    // Determine theme based on brightness - lower threshold for better light detection
    const isDark = averageBrightness < 0.3
    
    console.log('🎨 Theme detection:', {
      bodyBg: bodyBg,
      htmlBg: htmlBg,
      bodyBrightness: bodyBrightness.toFixed(3),
      htmlBrightness: htmlBrightness.toFixed(3),
      averageBrightness: averageBrightness.toFixed(3),
      detectedTheme: isDark ? 'dark' : 'light'
    })
    
    return isDark ? 'dark' : 'light'
    
  } catch (error) {
    console.log('❌ Theme detection failed, defaulting to dark:', error.message)
    return 'dark' // Default to dark theme
  }
}

// Function to load API key from storage
function loadApiKey() {
  chrome.storage.sync.get(['openai_api_key']).then((result) => {
    if (result.openai_api_key) {
      setApiKey(result.openai_api_key)
      console.log('✅ OpenAI API key loaded from storage')
    } else {
      console.log('⚠️ No OpenAI API key found. Please set it in the extension popup.')
    }
  }).catch((error) => {
    console.error('Error loading API key:', error)
  })
}

// Load API key on startup
loadApiKey()

// Listen for messages from popup to reload API key
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RELOAD_API_KEY') {
    console.log('🔄 Reloading API key from storage...')
    loadApiKey()
  }
})

let widgetContainer = null
let widgetRoot = null
let isShowingWidget = false // Flag to prevent immediate closing
let currentSelection = null // Store the current text selection
let highlightElement = null // Store the highlight element
let currentTheme = 'dark' // Store the current theme (dark/light)

// Create widget container
function createWidgetContainer() {
  // Detect website theme
  currentTheme = detectWebsiteTheme()
  console.log('🎨 Using theme:', currentTheme)
  
  // Create new container
  const container = document.createElement('div')
  container.id = 'ai-widget-container'
  container.className = 'ai-widget-container'
  container.setAttribute('data-theme', currentTheme)
  
  // Style the container with adaptive theme
  const isDark = currentTheme === 'dark'
  
  container.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 999999 !important;
    width: 672px !important;
    max-width: 672px !important;
    padding: 32px !important;
    background-color: ${isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.02)'} !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'} !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 50px -12px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.3)'} !important;
    font-family: ui-sans-serif, system-ui, sans-serif !important;
    transition: all 0.3s ease !important;
  `
  
  // Add CSS animation for the loading spinner
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
  
  // Add the container to the page
  document.body.appendChild(container)
  
  return container
}

// Show widget
function showWidget(selectedText, rect) {
  console.log('🎨 showWidget called with text:', selectedText.substring(0, 50) + '...')
  
  // Set flag to prevent immediate closing
  isShowingWidget = true
  
  try {
    // Check if widget already exists first
    let container = document.getElementById('ai-widget-container')
    
    if (container) {
      // If widget exists, don't recreate it - just update the text if needed
      console.log('🔄 Widget already exists, not recreating')
      
      // Only store selection and create highlight if we don't have one
      if (!currentSelection) {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          currentSelection = selection.getRangeAt(0).cloneRange()
          console.log('📌 Stored selection range')
          createHighlight()
        }
      }
      
      return // Exit early, don't recreate the widget
    }
    
    // Only create new widget if one doesn't exist
    console.log('🆕 Creating new widget')
    
    // Store the current selection BEFORE creating the widget
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      currentSelection = selection.getRangeAt(0).cloneRange()
      console.log('📌 Stored selection range')
      
      // Create highlight element immediately
      createHighlight()
    }
    
    // Create new container
    container = createWidgetContainer()
    console.log('️ Container created:', container)
    
    console.log('⚛️ Attempting to render React component with ReactDOM.render...')
    
    ReactDOM.render(
      <AIWidget 
        selectedText={selectedText}
        onClose={hideWidget} // Pass the actual hideWidget function
        theme={currentTheme} // Pass the detected theme
      />,
      container
    )
    
    console.log('✅ React component rendered successfully with ReactDOM.render!')
    
    // Reset flag after a short delay
    setTimeout(() => {
      isShowingWidget = false
    }, 100)
    
  } catch (error) {
    console.error('❌ Error in showWidget:', error)
    isShowingWidget = false
  }
}

// Create highlight element
function createHighlight() {
  if (!currentSelection) {
    console.log('❌ No current selection to highlight')
    return
  }
  
  // Remove existing highlight
  removeHighlight()
  
  try {
    // Create highlight element
    highlightElement = document.createElement('span')
    highlightElement.style.cssText = `
      background-color: rgba(0, 122, 255, 0.3) !important;
      border-radius: 2px !important;
      padding: 1px 2px !important;
      position: relative !important;
      z-index: 999998 !important;
    `
    highlightElement.className = 'ai-widget-highlight'
    highlightElement.setAttribute('data-ai-widget-highlight', 'true')
    
    // Clone the range and surround it with the highlight element
    const range = currentSelection.cloneRange()
    
    // Check if the range can be surrounded
    if (range.collapsed) {
      console.log('❌ Range is collapsed, cannot highlight')
      return
    }
    
    // Try to surround the contents
    range.surroundContents(highlightElement)
    console.log('✅ Highlight created successfully')
    
  } catch (error) {
    console.log('❌ Could not create highlight:', error.message)
    console.log('This might happen if text is split across multiple elements')
    
    // Fallback: try to highlight each text node separately
    try {
      const range = currentSelection.cloneRange()
      const contents = range.extractContents()
      const fragment = document.createDocumentFragment()
      
             // Create highlight wrapper
       const highlightWrapper = document.createElement('span')
       highlightWrapper.style.cssText = `
         background-color: rgba(0, 122, 255, 0.3) !important;
         border-radius: 2px !important;
         padding: 1px 2px !important;
         position: relative !important;
         z-index: 999998 !important;
       `
      highlightWrapper.className = 'ai-widget-highlight'
      highlightWrapper.setAttribute('data-ai-widget-highlight', 'true')
      
      // Move contents into highlight wrapper
      while (contents.firstChild) {
        highlightWrapper.appendChild(contents.firstChild)
      }
      
      fragment.appendChild(highlightWrapper)
      range.insertNode(fragment)
      highlightElement = highlightWrapper
      console.log('✅ Fallback highlight created successfully')
      
    } catch (fallbackError) {
      console.log('❌ Fallback highlight also failed:', fallbackError.message)
    }
  }
}

// Remove highlight element
function removeHighlight() {
  if (highlightElement) {
    try {
      console.log('🗑️ Removing highlight element')
      
      // Move the text back out of the highlight element
      const parent = highlightElement.parentNode
      if (parent) {
        while (highlightElement.firstChild) {
          parent.insertBefore(highlightElement.firstChild, highlightElement)
        }
        parent.removeChild(highlightElement)
        console.log('✅ Highlight removed successfully')
      }
    } catch (error) {
      console.log('❌ Error removing highlight:', error.message)
      
      // Fallback: just remove the element
      try {
        highlightElement.remove()
        console.log('✅ Highlight removed with fallback method')
      } catch (fallbackError) {
        console.log('❌ Fallback removal also failed:', fallbackError.message)
      }
    }
    highlightElement = null
  } else {
    // Also remove any orphaned highlights by class name
    const existingHighlights = document.querySelectorAll('.ai-widget-highlight')
    existingHighlights.forEach(highlight => {
      try {
        const parent = highlight.parentNode
        if (parent) {
          while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight)
          }
          parent.removeChild(highlight)
        }
      } catch (error) {
        console.log('❌ Error removing orphaned highlight:', error.message)
      }
    })
  }
}

// Make sure hideWidget function is properly defined
function hideWidget() {
  console.log('🎯 hideWidget function called')
  
  // Remove highlight
  removeHighlight()
  
  // Clear selection
  currentSelection = null
  
  const container = document.getElementById('ai-widget-container')
  if (container) {
    console.log('🗑️ Removing widget container')
    
    // Unmount React component
    ReactDOM.unmountComponentAtNode(container)
    
    // Remove the container from DOM
    container.remove()
    
    console.log('✅ Widget removed successfully')
  } else {
    console.log('❌ No widget container found to remove')
  }
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
  // console.log('🖱️ Mouse up event detected')
  
  // Don't trigger if clicking inside the widget
  const container = document.getElementById('ai-widget-container')
  if (container && container.contains(e.target)) {
    console.log('🚫 Click inside widget, ignoring')
    return
  }
  
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  
  // console.log('📝 Selected text:', selectedText)
// console.log('📏 Selected text length:', selectedText.length)
  
  if (selectedText.length > 0) {
    // console.log('✅ Text selected, attempting to show widget...')
    
    // Get selection coordinates
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    // Show widget immediately (no delay needed)
    showWidget(selectedText, rect)
  } else {
    // console.log('❌ No text selected or selection is empty')
  }
})

// Handle escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideWidget()
  }
})

// Handle clicks outside widget
document.addEventListener('click', (e) => {
  // Don't close if we're in the middle of showing a widget
  if (isShowingWidget) {
    console.log('🚫 Widget is being shown, ignoring click')
    return
  }
  
  const container = document.getElementById('ai-widget-container')
  if (container && !container.contains(e.target)) {
    console.log('🖱️ Click outside widget, closing...')
    hideWidget()
  } else if (container) {
    console.log('🖱️ Click inside widget, keeping open')
  }
})

// Prevent selection loss when clicking inside widget
document.addEventListener('mousedown', (e) => {
  const container = document.getElementById('ai-widget-container')
  if (container && container.contains(e.target)) {
    // Prevent the default behavior that would clear the selection
    e.stopPropagation()
    console.log('🛡️ Preventing selection loss on widget click')
  }
})

// Also prevent selection loss on focus events
document.addEventListener('focusin', (e) => {
  const container = document.getElementById('ai-widget-container')
  if (container && container.contains(e.target)) {
    console.log('🛡️ Preventing selection loss on widget focus')
  }
})

// Add this at the end to test if the script is running
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM loaded, content script is active!')
  
  // Test if we can create elements
  const testDiv = document.createElement('div')
  testDiv.textContent = 'AI Widget Test'
  testDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 9999;'
  document.body.appendChild(testDiv)
  
  // Remove after 3 seconds
  setTimeout(() => testDiv.remove(), 3000)
})
