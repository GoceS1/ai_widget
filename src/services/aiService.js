import OpenAI from 'openai'

// Initialize OpenAI client
let openai = null

// Function to initialize OpenAI with API key
function initializeOpenAI(apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for browser extensions
  })
}

// System prompts for each action
const SYSTEM_PROMPTS = {
  improve: `You are an expert writing assistant. Your sole task is to improve the user's selected text.

Analyze the provided text and rewrite it to enhance its clarity, flow, and overall readability. Your goal is to make the text more engaging and easier to understand for its intended audience.

**Guidelines:**
- Improve sentence structure for better rhythm and impact.
- Replace weak or vague words with more precise and powerful alternatives.
- Ensure smooth transitions between ideas.

**Constraints:**
- **Crucially, you must preserve the original tone and intent of the text.** Do not make it more formal or casual.
- Do not add any new information or opinions.
- The length of the rewritten text should be similar to the original.
- Your output must ONLY be the rewritten text. Do not include any preambles, apologies, or explanations like "Here is the improved version:".`,

  professional: `You are a corporate communications expert. Your purpose is to rewrite the user's selected text to have a professional and formal tone suitable for a business or academic setting.

**Guidelines:**
- Replace casual language, slang, colloquialisms, and overly familiar expressions with standard professional vocabulary.
- Eliminate contractions (e.g., rewrite "don't" as "do not," "it's" as "it is").
- Rephrase sentences to be more formal, clear, and respectful.
- Ensure the final text projects competence and authority.

**Constraints:**
- You must retain the core meaning and all critical information from the original text. The goal is a change in tone, not content.
- Your output must ONLY be the rewritten text. Do not add any conversational text or explanations.`,

  shorter: `You are an expert copyeditor specializing in concise communication. Your only function is to make the user's selected text shorter and more direct.

Ruthlessly condense the text by removing all unnecessary words, filler phrases, and redundancies. Your goal is to communicate the original message in the most efficient way possible.

**Guidelines:**
- Eliminate verbose sentences and get straight to the point.
- Use stronger verbs and prefer the active voice.
- Combine sentences where appropriate to reduce word count.

**Constraints:**
- **You must preserve the core meaning and all essential information of the original text.** Do not remove critical details in the name of brevity.
- The output must ONLY be the condensed text. Do not provide any commentary or introductory phrases.`,

  grammar: `You are an automated proofreading tool. Your only task is to correct objective errors in the user's selected text.

Analyze the text and fix all spelling, grammar, and punctuation mistakes.

**Constraints:**
- **This is critical: You MUST NOT rewrite sentences for style, clarity, or tone.**
- Only make the minimum changes necessary to correct objective errors. If a sentence is grammatically correct but sounds awkward, you must leave it unchanged.
- Do not alter the author's vocabulary or sentence structure unless it is grammatically incorrect.
- Your output must ONLY be the corrected text. Do not include any notes, explanations, or conversational phrases.`
}

// Function to process text with AI
export async function processTextWithAI(action, selectedText, customPrompt = null) {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please set your API key in the extension popup.')
  }
  
  try {
    const systemPrompt = SYSTEM_PROMPTS[action]
    const userPrompt = customPrompt || selectedText

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    return {
      success: true,
      text: response.choices[0].message.content.trim()
    }
  } catch (error) {
    console.error('AI processing error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Function to set API key
export function setApiKey(apiKey) {
  initializeOpenAI(apiKey)
}
