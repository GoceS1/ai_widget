1. Executive Summary
   The project is to create a sophisticated, context-aware AI writing assistant that functions as a Chrome extension. The core idea is to provide a seamless, in-place text editing and generation experience. The user selects text on any webpage, and a minimalist, "soft glass" styled widget appears, offering a suite of AI-powered writing tools.

2. Core Problem to Solve
   To eliminate the cumbersome workflow of copying text to a separate AI chat interface and pasting the result back. This tool brings the power of a conversational AI directly to the user's cursor.

3. Functional Requirements
   **Text Selection Workflow:**

   - User selects text on any webpage (e.g., writing an email, composing a document)
   - Widget automatically appears with the selected text context
   - All AI operations work with the SELECTED text, not textarea input

   **Widget Activation & Behavior:**

   - Widget appears when text is selected on any webpage
   - Selected text is passed to the widget for AI processing
   - Textarea serves dual purpose: custom prompt input AND AI response display

   **Shortcut Buttons (Primary Actions):**

   - **Improve**: AI improves the selected text
   - **Make Professional**: AI makes the selected text more professional
   - **Make Shorter**: AI makes the selected text more concise
   - **Fix Grammar**: AI fixes grammar and improves clarity
   - All shortcuts process the SELECTED text from the webpage

   **Custom Prompting:**

   - Large textarea for custom commands (e.g., "translate to French", "rewrite in casual tone")
   - Custom prompts are applied to the SELECTED text, not textarea content
   - Submit via Command + Enter keyboard shortcut
   - Format: "Custom prompt: [selected text]"

   **Copy Functionality:**

   - Copy button in top-right corner copies AI-generated responses
   - User can copy AI response and paste it back into their original text
   - Enables seamless integration with existing workflows

   **Persona Selector:**

   - Dropdown menu for writing style selection (Default, Professional, Casual, etc.)
   - Affects AI response tone and style

4. UI/UX & Design Requirements
   **Design Philosophy:**

   - "Soft glass" or "glassmorphism" aesthetic
   - Semi-transparent, blurred backdrop effect
   - Rounded corners and subtle borders
   - Dark theme optimized for readability

   **Layout Structure:**

   - Header: Persona selector (left) + Copy/Close buttons (right)
   - Main area: Large textarea for custom prompts and AI responses
   - Footer: 2x2 grid of shortcut action buttons
   - Keyboard hint: "Press ⌘+Enter to execute custom prompts"

   **Interactive Elements:**

   - All buttons have hover effects and smooth transitions
   - Textarea placeholder: "Write, edit, or ask anything..."
   - Icons from Lucide library for consistency

5. Technology Stack
   **Frontend (Chrome Extension):**

   - Framework: React
   - Build Tool: Vite
   - Styling: Tailwind CSS
   - Component Library: Shadcn UI
   - Icons: lucide-react

   **Backend (API Server):**

   - Framework: Node.js with Express
   - Dependencies: cors, dotenv, openai

   **AI Service:**

   - OpenAI API (using a model like GPT-4o) with streaming enabled

6. User Experience Flow

   1. **Select Text**: User highlights text on any webpage
   2. **Widget Appears**: AI writing widget appears with selected text context
   3. **Choose Action**: User clicks shortcut button OR types custom prompt
   4. **AI Processing**: Selected text is sent to OpenAI with chosen instruction
   5. **Review Response**: AI-generated text appears in the textarea
   6. **Copy & Use**: User copies AI response and pastes it back into original text
   7. **Seamless Integration**: No need to leave the current webpage or context

7. Key Benefits
   - **Context-Aware**: Always works with the text you're currently editing
   - **No Context Switching**: Stay on the same webpage while getting AI assistance
   - **Flexible Input**: Use shortcuts for common tasks or custom prompts for specific needs
   - **Professional Quality**: AI-powered improvements for any writing task
   - **Universal Compatibility**: Works on any website with selectable text
