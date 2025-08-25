import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { setApiKey } from './services/aiService.js'

const Popup = () => {
  const [apiKey, setApiKeyState] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load saved API key using new API
    chrome.storage.sync.get(['openai_api_key']).then((result) => {
      if (result.openai_api_key) {
        setApiKeyState(result.openai_api_key)
      }
    }).catch((error) => {
      console.error('Error loading API key:', error)
    })
  }, [])

  const handleSave = async () => {
    try {
      // Save to Chrome storage using the new API
      await chrome.storage.sync.set({ openai_api_key: apiKey })
      
      // Set the API key in the service
      setApiKey(apiKey)
      setIsSaved(true)
      
      // Send message to content script to reload API key
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_API_KEY' })
      }
      
      // Reset saved message after 2 seconds
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error('Error saving API key:', error)
    }
  }

  return (
    <div style={{
      width: '400px',
      padding: '20px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    }}>
      <h1 style={{
        margin: '0 0 20px 0',
        fontSize: '24px',
        color: '#333'
      }}>
        AI Writing Widget
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: '#333'
        }}>
          OpenAI API Key:
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          placeholder="sk-..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <button
        onClick={handleSave}
        style={{
          background: '#007AFF',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {isSaved ? 'Saved!' : 'Save API Key'}
      </button>
      
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>How to use:</strong>
        <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: '#007AFF' }}>OpenAI</a></li>
          <li>Paste it above and click Save</li>
          <li>Select text on any webpage</li>
          <li>Use the AI widget to improve your writing!</li>
        </ol>
      </div>
    </div>
  )
}

// Render the popup
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Popup />)
