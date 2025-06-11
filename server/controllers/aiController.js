// controllers/aiController.js
const axios = require('axios');

// @desc    Send message to Gemini AI
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // Enhanced prompt for concise, well-formatted responses
    const systemPrompt = `You are a concise and helpful programming tutor. 

RESPONSE RULES:
- Keep responses SHORT and FOCUSED (2-4 paragraphs max)
- Use simple, clear language
- NO markdown headers (#, ##, ###) - use **bold** for emphasis instead
- Structure with short paragraphs and bullet points
- Include brief code examples only when essential
- End with a quick actionable tip
- Avoid long explanations - be direct and helpful

FORMAT EXAMPLE:
Understanding **JavaScript Variables**

Variables store data values. Think of them as labeled boxes that hold information.

**Basic Types:**
• let - for changing values
• const - for fixed values  
• var - older style (avoid in new code)

**Quick Example:**
\`\`\`javascript
let userName = "John";
const maxScore = 100;
\`\`\`

**Tip:** Start with 'let' and 'const' - they're safer and clearer than 'var'.`;

    const userPrompt = `${context || ''}

User Question: ${message}

Provide a concise, well-structured answer following the format rules above.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600, // Reduced for more concise responses
          topP: 0.85,
          topK: 40
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      }
    );

    let reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      reply = formatAIResponse(reply);
      res.status(200).json({ success: true, message: reply });
    } else {
      throw new Error('Invalid response from Gemini');
    }

  } catch (error) {
    console.error('AI chat error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      error: error.response?.data?.error?.message || error.message
    });
  }
};

// Enhanced response formatting for better chat display
const formatAIResponse = (text) => {
  return text
    .trim()
    // Remove any markdown headers and replace with bold text
    .replace(/^#{1,6}\s*(.+)$/gm, '**$1**')
    // Clean up excessive line breaks
    .replace(/\n{4,}/g, '\n\n\n')
    // Ensure proper spacing around lists
    .replace(/\n([•\-\*])/g, '\n$1')
    // Ensure proper spacing around code blocks
    .replace(/```(\w+)?\n/g, '\n```$1\n')
    .replace(/\n```(\w+)?\n/g, '\n\n```$1\n')
    .replace(/```\n/g, '```\n')
    // Clean up bullet points formatting
    .replace(/^\s*[\-\*]\s*/gm, '• ')
    // Ensure paragraphs have proper spacing
    .replace(/\n([A-Z])/g, '\n\n$1')
    // Final cleanup
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Additional endpoint for getting quick programming tips
const getQuickTip = async (req, res) => {
  try {
    const { topic } = req.body;
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOU_ACTUAL_PASSWORD';
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const prompt = `Give me one quick, practical tip about ${topic || 'programming'} in 2-3 sentences. Make it actionable and beginner-friendly.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 150,
          topP: 0.9
        }
      }
    );

    const tip = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (tip) {
      res.status(200).json({ success: true, tip: tip.trim() });
    } else {
      throw new Error('No tip generated');
    }

  } catch (error) {
    console.error('Quick tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to get tip right now.'
    });
  }
};

module.exports = {
  chatWithAI,
  getQuickTip
};