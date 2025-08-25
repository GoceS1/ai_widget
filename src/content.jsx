import React from 'react'
import ReactDOM from 'react-dom' // Change this import
import AIWidget from './components/AIWidget'
import { setApiKey } from './services/aiService.js'
import './styles/globals.css'

console.log('🎯 AI Widget content script loaded!')

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

// Create widget container
function createWidgetContainer() {
  // Remove any existing widget
  hideWidget()
  
  // Create new container
  const container = document.createElement('div')
  container.id = 'ai-widget-container'
  container.className = 'ai-widget-container'
  
  // Style the container with EXACT Figma styling
  container.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 999999 !important;
    width: 672px !important;
    max-width: 672px !important;
    padding: 32px !important;
    background-color: rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    font-family: ui-sans-serif, system-ui, sans-serif !important;
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
  // console.log('🎨 showWidget called with text:', selectedText.substring(0, 50) + '...')
  
  // Set flag to prevent immediate closing
  isShowingWidget = true
  
  try {
    // Check if widget already exists
    let container = document.getElementById('ai-widget-container')
    
    if (container) {
      // If widget exists, just update the React component with new text
      // console.log('🔄 Updating existing widget with new text')
      ReactDOM.render(
        <AIWidget 
          selectedText={selectedText}
          onClose={hideWidget} // Pass the actual hideWidget function
        />,
        container
      )
    } else {
      // Create new container only if it doesn't exist
      container = createWidgetContainer()
      // console.log('️ Container created:', container)
      
      // console.log('⚛️ Attempting to render React component with ReactDOM.render...')
      
      ReactDOM.render(
        <AIWidget 
          selectedText={selectedText}
          onClose={hideWidget} // Pass the actual hideWidget function
        />,
        container
      )
      
      // console.log('✅ React component rendered successfully with ReactDOM.render!')
    }
    
    // Debug info (commented out for cleaner console)
// console.log('🔍 Widget container position:', container.getBoundingClientRect())
// console.log('🔍 Widget container styles:', window.getComputedStyle(container))
// console.log('🔍 Widget container HTML:', container.innerHTML)
    
    // Reset flag after a short delay
    setTimeout(() => {
      isShowingWidget = false
    }, 100)
    
  } catch (error) {
    console.error('❌ Error in showWidget:', error)
    isShowingWidget = false
  }
}

// Make sure hideWidget function is properly defined
function hideWidget() {
  console.log('🎯 hideWidget function called')
  
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
    // console.log('🚫 Widget is being shown, ignoring click')
    return
  }
  
  const container = document.getElementById('ai-widget-container')
  if (container && !container.contains(e.target)) {
    // console.log('🖱️ Click outside widget, closing...')
    hideWidget()
  } else if (container) {
    // console.log('🖱️ Click inside widget, keeping open')
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
