import React from 'react'
import ReactDOM from 'react-dom' // Change this import
import AIWidget from './components/AIWidget'
import { GlassWidget } from './components/GlassWidget'
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
    
    /* console.log('🎨 Theme detection:', {
      bodyBg: bodyBg,
      htmlBg: htmlBg,
      bodyBrightness: bodyBrightness.toFixed(3),
      htmlBrightness: htmlBrightness.toFixed(3),
      averageBrightness: averageBrightness.toFixed(3),
      detectedTheme: isDark ? 'dark' : 'light'
    }) */
    
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
      // console.log('✅ OpenAI API key loaded from storage')
    } else {
      console.log('⚠️ No OpenAI API key found. Please set it in the extension popup.')
    }
  }).catch((error) => {
    console.error('Error loading API key:', error)
  })
}

// Load API key on startup
loadApiKey()

// Position detection and movement logic
function getCurrentPosition() {
  const container = document.getElementById('ai-widget-container')
  if (!container) return null
  
  const rect = container.getBoundingClientRect()
  const padding = 20
  const widgetWidth = 672
  const widgetHeight = currentWidgetHeight || 280
  
  // Check if widget is in each corner
  if (Math.abs(rect.top - padding) < 10 && Math.abs(rect.left - padding) < 10) {
    return 'TOP_LEFT'
  } else if (Math.abs(rect.top - padding) < 10 && Math.abs(rect.left - (window.innerWidth - widgetWidth - padding)) < 10) {
    return 'TOP_RIGHT'
  } else if (Math.abs(rect.top - (window.innerHeight - widgetHeight - padding)) < 10 && Math.abs(rect.left - padding) < 10) {
    return 'BOTTOM_LEFT'
  } else if (Math.abs(rect.top - (window.innerHeight - widgetHeight - padding)) < 10 && Math.abs(rect.left - (window.innerWidth - widgetWidth - padding)) < 10) {
    return 'BOTTOM_RIGHT'
  }
  
  return 'CENTER' // Default to center if not in a corner
}

function moveWidgetToPosition(position) {
  const container = document.getElementById('ai-widget-container')
  if (!container) return

  const padding = 20
  const widgetWidth = 672
  const widgetHeight = currentWidgetHeight || 280
  
  let top, left
  
  switch (position) {
    case 'TOP_LEFT':
      top = padding
      left = padding
      break
    case 'TOP_RIGHT':
      top = padding
      left = window.innerWidth - widgetWidth - padding
      break
    case 'BOTTOM_LEFT':
      top = window.innerHeight - widgetHeight - padding
      left = padding
      break
    case 'BOTTOM_RIGHT':
      top = window.innerHeight - widgetHeight - padding
      left = window.innerWidth - widgetWidth - padding
      break
    default:
      return
  }
  
  // Update the widget position
  container.style.setProperty('top', `${top}px`, 'important')
  container.style.setProperty('left', `${left}px`, 'important')
  container.style.setProperty('transform', 'none', 'important')
  
  currentPosition = position
}

// Listen for messages from popup to reload API key
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RELOAD_API_KEY') {
    // console.log('🔄 Reloading API key from storage...')
    loadApiKey()
  }
})

let widgetContainer = null
let widgetRoot = null
let isShowingWidget = false // Flag to prevent immediate closing
let currentSelection = null // Store the current text selection
let currentTheme = 'dark' // Store the current theme (dark/light)
let currentPosition = null // Store the current widget position state
let currentWidgetHeight = 280 // Store the current widget height

// Glass trigger widget state
let glassContainer = null
let glassRoot = null
let isShowingGlass = false
let glassPosition = { x: 0, y: 0 }
let selectedTextForGlass = '' // Store selected text for when glass is clicked

// Create widget container
function createWidgetContainer() {
  // Detect website theme
  currentTheme = detectWebsiteTheme()
  // console.log('🎨 Using theme:', currentTheme)
  
  // Create new container
  const container = document.createElement('div')
  container.id = 'ai-widget-container'
  container.className = 'ai-widget-container'
  container.setAttribute('data-theme', currentTheme)
  
  // Style the container with adaptive theme
  const isDark = currentTheme === 'dark'
  
  const initialTop = (window.innerHeight - currentWidgetHeight) / 2;
  const initialLeft = (window.innerWidth - 672) / 2;

  container.style.cssText = `
    position: fixed !important;
    top: ${initialTop}px !important;
    left: ${initialLeft}px !important;
    transform: none !important;
    z-index: 999999 !important;
    width: 672px !important;
    max-width: 672px !important;
    height: ${currentWidgetHeight}px !important;
    max-height: 600px !important;
    padding: 24px !important;
    background-color: ${isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.02)'} !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'} !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 50px -12px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.3)'} !important;
    font-family: ui-sans-serif, system-ui, sans-serif !important;
    transition: height 0.3s ease, top 0.3s ease, left 0.3s ease !important;
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

// Show glass trigger widget
function showGlassWidget(selectedText, rect) {
  // console.log('✨ showGlassWidget called with text:', selectedText.substring(0, 50) + '...')
  
  // Store the selected text for later use
  selectedTextForGlass = selectedText
  
  /* console.log('📐 Received rect in showGlassWidget:', {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  }) */
  
  // Calculate position at bottom-right of selection
  // getBoundingClientRect() gives viewport-relative coordinates, so we need to add scroll offset
  // for absolute positioning, but the rect.bottom already includes the current viewport position
  let x = rect.right + 8 // 8px offset to the right
  let y = rect.bottom + 8 // 8px offset below
  
  /* console.log('🧮 Positioning calculation:', {
    'rect.right': rect.right,
    'rect.bottom': rect.bottom,
    'window.scrollX': window.scrollX,
    'window.scrollY': window.scrollY,
    'final x': x,
    'final y': y
  }) */
  
  // Only use fallback if rect is completely invalid
  if (rect.width === 0 && rect.height === 0) {
    // console.log('⚠️ Using fallback positioning - rect is completely invalid')
    x = window.innerWidth / 2
    y = window.innerHeight / 2
  }
  
  // Store position
  glassPosition = { x, y }
  
  // If glass widget already exists, just update position
  if (glassContainer) {
    glassContainer.style.position = 'fixed'
    glassContainer.style.left = `${x}px`
    glassContainer.style.top = `${y}px`
    glassContainer.classList.add('visible')
    isShowingGlass = true
    return
  }
  
  // Create glass container
  glassContainer = document.createElement('div')
  glassContainer.id = 'glass-trigger-container'
  glassContainer.className = 'glass-trigger visible'
  glassContainer.style.cssText = `
    position: fixed !important;
    left: ${x}px !important;
    top: ${y}px !important;
    z-index: 10000 !important;
    pointer-events: auto !important;
  `
  
  document.body.appendChild(glassContainer)
  
  // Create React root and render glass widget
  if (typeof ReactDOM.createRoot !== 'undefined') {
    glassRoot = ReactDOM.createRoot(glassContainer)
    glassRoot.render(
      <GlassWidget onClick={handleGlassClick} />
    )
  } else {
    ReactDOM.render(
      <GlassWidget onClick={handleGlassClick} />,
      glassContainer
    )
  }
  
  // Debug: Log the actual rendered size
  /* setTimeout(() => {
    if (glassContainer) {
      const computedStyle = window.getComputedStyle(glassContainer)
      const rect = glassContainer.getBoundingClientRect()
      console.log('🔍 Glass container debug info:', {
        'container width': computedStyle.width,
        'container height': computedStyle.height,
        'container display': computedStyle.display,
        'container visibility': computedStyle.visibility,
        'container opacity': computedStyle.opacity,
        'container position': computedStyle.position,
        'container z-index': computedStyle.zIndex,
        'actual rendered rect': rect,
        'is visible?': rect.width > 0 && rect.height > 0
      })
      
      // Check the inner glass widget too
      const glassWidget = glassContainer.querySelector('div')
      if (glassWidget) {
        const glassStyle = window.getComputedStyle(glassWidget)
        const glassRect = glassWidget.getBoundingClientRect()
        console.log('🔍 Inner glass widget debug:', {
          'widget width': glassStyle.width,
          'widget height': glassStyle.height,
          'widget background': glassStyle.background,
          'widget border': glassStyle.border,
          'widget rect': glassRect
        })
      }
    }
  }, 100) */
  
  isShowingGlass = true
  // console.log('✨ Glass widget shown at position:', { x, y })
  
  // Add a small delay before allowing click outside to close
  setTimeout(() => {
    if (glassContainer) {
      glassContainer.dataset.allowClickOutside = 'true'
    }
  }, 300)
}

// Handle glass widget click
function handleGlassClick() {
  // console.log('🔮 Glass widget clicked, showing main AI widget')
  
  // Hide glass widget
  hideGlassWidget()
  
  // Show main AI widget with stored text and position
  if (selectedTextForGlass && currentSelection) {
    const rect = currentSelection.getBoundingClientRect()
    showWidget(selectedTextForGlass, rect)
  }
}

// Hide glass widget
function hideGlassWidget() {
  // console.log('🔮 Hiding glass widget')
  
  if (glassContainer) {
    glassContainer.classList.remove('visible')
    glassContainer.dataset.allowClickOutside = 'false'
    
    // Remove after animation
    setTimeout(() => {
      if (glassContainer) {
        if (glassRoot && typeof glassRoot.unmount === 'function') {
          glassRoot.unmount()
        }
        glassContainer.remove()
        glassContainer = null
        glassRoot = null
      }
    }, 300)
  }
  
  isShowingGlass = false
}

// Show widget
function showWidget(selectedText, rect) {
  // console.log('🎨 showWidget called with text:', selectedText.substring(0, 50) + '...')
  
  // Set flag to prevent immediate closing
  isShowingWidget = true
  
  try {
    // Check if widget already exists first
    let container = document.getElementById('ai-widget-container')
    
    if (container) {
      // If widget exists, don't recreate it - just update the text if needed
      // console.log('🔄 Widget already exists, not recreating')
      
      // Only store selection and create highlight if we don't have one
      if (!currentSelection) {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          currentSelection = selection.getRangeAt(0).cloneRange()
          // console.log('📌 Stored selection range')
          createHighlight()
        }
      }
      
      return // Exit early, don't recreate the widget
    }
    
    // Only create new widget if one doesn't exist
    // console.log('🆕 Creating new widget')
    
    // Store the current selection BEFORE creating the widget
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      currentSelection = selection.getRangeAt(0).cloneRange()
      // console.log('📌 Stored selection range')
      
      // Create highlight element immediately
      createHighlight()
    }
    
    // Create new container
    container = createWidgetContainer()
    // console.log('️ Container created:', container)
    
    // console.log('⚛️ Attempting to render React component with ReactDOM.render...')
    
    ReactDOM.render(
      <AIWidget 
        selectedText={selectedText}
        onClose={hideWidget} // Pass the actual hideWidget function
        theme={currentTheme} // Pass the detected theme
        onHeightChange={handleWidgetHeightChange} // Pass height change handler
      />,
      container
    )
    
    // console.log('✅ React component rendered successfully with ReactDOM.render!')
    
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
    // console.log('❌ No current selection to highlight')
    return
  }
  
  // Remove existing highlight
  removeHighlight()
  
  try {
    const range = currentSelection.cloneRange()
    
    // Check if the range can be surrounded
    if (range.collapsed) {
      // console.log('❌ Range is collapsed, cannot highlight')
      return
    }

    const rects = range.getClientRects()
    const fragment = document.createDocumentFragment()

    for (const rect of rects) {
      const highlightBox = document.createElement('div')
      highlightBox.className = 'ai-widget-highlight'
      highlightBox.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        background-color: rgba(0, 122, 255, 0.3) !important;
        border-radius: 2px !important;
        z-index: 999998 !important;
        pointer-events: none !important;
      `
      fragment.appendChild(highlightBox)
    }

    document.body.appendChild(fragment)
    
  } catch (error) {
    // console.log('❌ Could not create highlight:', error.message)
  }
}

// Remove highlight element
function removeHighlight() {
  const existingHighlights = document.querySelectorAll('.ai-widget-highlight')
  existingHighlights.forEach(highlight => {
    try {
      highlight.remove()
    } catch (error) {
      // console.log('❌ Error removing highlight:', error.message)
    }
  })
}

// Handle widget height changes with position-aware expansion
function handleWidgetHeightChange(newHeight) {
  const container = document.getElementById('ai-widget-container')
  if (!container) return

  const oldHeight = currentWidgetHeight
  if (newHeight === oldHeight) return

  // Determine expansion direction based on the CURRENT position
  const currentPos = currentPosition || getCurrentPosition()
  let expansionDirection
  switch (currentPos) {
    case 'TOP_LEFT':
    case 'TOP_RIGHT':
      expansionDirection = 'DOWNWARD'
      break
    case 'BOTTOM_LEFT':
    case 'BOTTOM_RIGHT':
      expansionDirection = 'UPWARD'
      break
    case 'CENTER':
    default:
      expansionDirection = 'BOTH'
  }

  const heightDifference = newHeight - oldHeight
  currentWidgetHeight = newHeight
  
  // Update container height - use setProperty to ensure it overrides inline styles
  container.style.setProperty('height', `${newHeight}px`, 'important')
  
  // Adjust position based on expansion direction and current position
  if (currentPos && heightDifference !== 0) {
    const currentTop = parseInt(container.style.top, 10) || 0
    let newTop = currentTop
    const padding = 20 // Ensure we use the same padding value as moveWidgetToPosition

    switch (expansionDirection) {
      case 'UPWARD':
        // For bottom corners, recalculate top position to be anchored to the bottom of the screen
        newTop = window.innerHeight - newHeight - padding
        break
        
      case 'DOWNWARD':
      case 'BOTH':
        // For top corners or center, keep top position the same (expand downward)
        break
    }
    
    // Update position if it changed, using a tolerance for floating point issues
    if (Math.abs(newTop - currentTop) > 1) {
      container.style.setProperty('top', `${newTop}px`, 'important')
    }
  }
}

// Make sure hideWidget function is properly defined
function hideWidget() {
  // console.log('🎯 hideWidget function called')
  
  // Also hide glass widget if it's showing
  if (isShowingGlass) {
    hideGlassWidget()
  }
  
  // Remove highlight
  removeHighlight()
  
  // Clear selection
  currentSelection = null
  
  const container = document.getElementById('ai-widget-container')
  if (container) {
    // console.log('🗑️ Removing widget container')
    
    // Unmount React component
    ReactDOM.unmountComponentAtNode(container)
    
    // Remove the container from DOM
    container.remove()
    
    // console.log('✅ Widget removed successfully')
  } else {
    // console.log('❌ No widget container found to remove')
  }
  
  // Reset position state
  currentPosition = null
  currentWidgetHeight = 280
  selectedTextForGlass = ''
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
  // console.log('🖱️ Mouse up event detected')
  
  // Don't trigger if clicking inside the widget or glass widget
  const container = document.getElementById('ai-widget-container')
  const glassContainer = document.getElementById('glass-trigger-container')
  if ((container && container.contains(e.target)) || (glassContainer && glassContainer.contains(e.target))) {
    // console.log('🚫 Click inside widget, ignoring')
    return
  }
  
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  
  // console.log('📝 Selected text:', selectedText)
// console.log('📏 Selected text length:', selectedText.length)
  
  if (selectedText.length > 0) {
    // console.log('✅ Text selected, attempting to show glass widget...')
    
    // Get selection coordinates FIRST while selection is still valid
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    /* console.log('📐 Original rect from selection:', {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
    }) */
    
    // Store the current selection AFTER getting rect
    if (selection.rangeCount > 0) {
      currentSelection = selection.getRangeAt(0).cloneRange()
      // console.log('📌 Stored selection range for glass widget')
      
      // Create highlight element immediately
      createHighlight()
    }
    
    // Show glass widget with the rect we got while selection was valid
    showGlassWidget(selectedText, rect)
  } else {
    // console.log('❌ No text selected or selection is empty')
    // Hide glass widget if no text is selected
    if (isShowingGlass) {
      hideGlassWidget()
    }
  }
})

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape key - close widget
  if (e.key === 'Escape') {
    hideWidget()
  }
  
  // Only handle widget positioning shortcuts if widget is open
  const container = document.getElementById('ai-widget-container')
  if (!container) return
  
      // Check for Cmd/Ctrl + arrow keys (not just Cmd/Ctrl alone)
    if ((e.metaKey || e.ctrlKey) && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
      
      const widgetWidth = 672
      const widgetHeight = currentWidgetHeight || 280
      const padding = 20
      
      // State-aware movement system
      const currentPos = currentPosition || getCurrentPosition()
      
      // If this is the first movement, go to TOP_RIGHT (home position)
      if (!currentPosition) {
        moveWidgetToPosition('TOP_RIGHT')
        return
      }
      
      // Movement rules based on current position
      const movementRules = {
        'TOP_RIGHT': {
          'ArrowDown': 'BOTTOM_RIGHT',
          'ArrowLeft': 'TOP_LEFT'
        },
        'TOP_LEFT': {
          'ArrowDown': 'BOTTOM_LEFT',
          'ArrowRight': 'TOP_RIGHT'
        },
        'BOTTOM_LEFT': {
          'ArrowUp': 'TOP_LEFT',
          'ArrowRight': 'BOTTOM_RIGHT'
        },
        'BOTTOM_RIGHT': {
          'ArrowUp': 'TOP_RIGHT',
          'ArrowLeft': 'BOTTOM_LEFT'
        }
      }
      
      const rules = movementRules[currentPos]
      if (rules && rules[e.key]) {
        moveWidgetToPosition(rules[e.key])
      } else {
        // console.log(`📍 No movement rule for ${e.key} from ${currentPos}`)
      }
    }
    
    // Check for Cmd/Ctrl + K to trigger copy button
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      
      const container = document.getElementById('ai-widget-container')
      if (!container) return
      
      // Find and click the copy button (first button in the action buttons area)
      const actionButtons = container.querySelectorAll('button')
      if (actionButtons.length >= 2) {
        // The copy button is the first button in the action buttons area
        actionButtons[0].click()
        // console.log('📋 Triggered copy button via ⌘+K')
      } else {
        // console.log('⚠️ Copy button not found')
      }
    }
  }
)

// Handle clicks outside widget
document.addEventListener('click', (e) => {
  // Don't close if we're in the middle of showing a widget
  if (isShowingWidget) {
    // console.log('🚫 Widget is being shown, ignoring click')
    return
  }
  
  const container = document.getElementById('ai-widget-container')
  const glassContainer = document.getElementById('glass-trigger-container')
  
  // Check if click is outside both widgets
  const clickedOutsideMain = container && !container.contains(e.target)
  const clickedOutsideGlass = glassContainer && !glassContainer.contains(e.target)
  
  if (container && clickedOutsideMain) {
    // console.log('🖱️ Click outside main widget, closing...')
    hideWidget()
  } else if (container) {
    // console.log('🖱️ Click inside main widget, keeping open')
  }
  
  // Handle glass widget clicks separately (only if enough time has passed)
  if (glassContainer && clickedOutsideGlass && !clickedOutsideMain && glassContainer.dataset.allowClickOutside === 'true') {
    // console.log('🔮 Click outside glass widget, hiding glass...')
    hideGlassWidget()
  }
})

// Prevent selection loss when clicking inside widget
document.addEventListener('mousedown', (e) => {
  const container = document.getElementById('ai-widget-container')
  const glassContainer = document.getElementById('glass-trigger-container')
  if ((container && container.contains(e.target)) || (glassContainer && glassContainer.contains(e.target))) {
    // Prevent the default behavior that would clear the selection
    e.stopPropagation()
    // console.log('🛡️ Preventing selection loss on widget click')
  }
})

// Also prevent selection loss on focus events
document.addEventListener('focusin', (e) => {
  const container = document.getElementById('ai-widget-container')
  const glassContainer = document.getElementById('glass-trigger-container')
  if ((container && container.contains(e.target)) || (glassContainer && glassContainer.contains(e.target))) {
    // console.log('🛡️ Preventing selection loss on widget focus')
  }
})

// --- Scroll Handling Logic ---
let isScrolling = false

function handleScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updatePositionsOnScroll()
      isScrolling = false
    })
    isScrolling = true
  }
}

function updatePositionsOnScroll() {
  if (!currentSelection) return

  const rect = currentSelection.getBoundingClientRect()

  // Hide everything if the selection is out of the viewport
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    if (isShowingGlass) hideGlassWidget()
    removeHighlight()
    return
  }

  // Update highlight position
  removeHighlight()
  createHighlight()

  // Update glass widget position
  if (isShowingGlass && glassContainer) {
    const x = rect.right + 8
    const y = rect.bottom + 8
    glassContainer.style.left = `${x}px`
    glassContainer.style.top = `${y}px`
  }
}

document.addEventListener('scroll', handleScroll, { passive: true, capture: true })

// Add this at the end to test if the script is running
document.addEventListener('DOMContentLoaded', () => {
  // console.log('🚀 DOM loaded, content script is active!')
  
  // Test if we can create elements
  const testDiv = document.createElement('div')
  testDiv.textContent = 'AI Widget Test'
  testDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 9999;'
  document.body.appendChild(testDiv)
  
  // Remove after 3 seconds
  setTimeout(() => testDiv.remove(), 3000)
})



