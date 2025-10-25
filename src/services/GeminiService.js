import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBxcxji-GxXQlkRtsljCJk2IFGl_q43_GU';
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  constructor() {
    // Use the stable Gemini 2.5 Flash model
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    this.chatHistory = new Map(); // Store chat history per expert
  }

  // Get or create chat session for a specific expert
  getChatSession(expertId) {
    if (!this.chatHistory.has(expertId)) {
      this.chatHistory.set(expertId, []);
    }
    return this.chatHistory.get(expertId);
  }

  // Test API connection and list available models
  async testConnection() {
    try {
      console.log('Testing Gemini API connection...');
      
      // Try a simple test request
      const result = await this.model.generateContent('Hello, are you working?');
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API test successful:', text);
      return { success: true, message: text };
    } catch (error) {
      console.error('Gemini API test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send message to Gemini AI
  async sendMessage(expertId, userMessage, expertContext) {
    try {
      const chatHistory = this.getChatSession(expertId);
      
      // Create system prompt based on expert context
      const systemPrompt = this.createSystemPrompt(expertContext);
      
      // Build conversation context
      let conversationContext = systemPrompt + "\n\n";
      
      // Add recent chat history (last 6 messages to keep context manageable)
      const recentHistory = chatHistory.slice(-6);
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          conversationContext += `User: ${msg.parts[0].text}\n`;
        } else if (msg.role === 'model') {
          conversationContext += `Assistant: ${msg.parts[0].text}\n`;
        }
      }
      
      // Add current user message
      conversationContext += `User: ${userMessage}\nAssistant:`;

      // Generate response using generateContent
      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      const aiResponse = response.text();

      // Update chat history
      chatHistory.push(
        { role: 'user', parts: [{ text: userMessage }] },
        { role: 'model', parts: [{ text: aiResponse }] }
      );

      return {
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        message: "I'm having trouble connecting right now. Please try again in a moment.",
        error: error.message
      };
    }
  }

  // Create system prompt based on expert context
  createSystemPrompt(expertContext) {
    const { name, specialty, prompt } = expertContext;
    
    return `You are ${name}, a ${specialty} expert. ${prompt}

Your role is to provide helpful, accurate, and encouraging advice related to ${specialty.toLowerCase()}. Keep your responses concise but informative, and maintain a supportive and professional tone. Always prioritize user safety and recommend consulting healthcare professionals when appropriate.

Guidelines:
- Provide practical, actionable advice
- Use encouraging and motivating language
- Keep responses under 200 words when possible
- Ask follow-up questions to better understand the user's needs
- Suggest specific exercises, techniques, or strategies when relevant
- Always emphasize proper form and safety`;
  }

  // Clear chat history for a specific expert
  clearChatHistory(expertId) {
    this.chatHistory.delete(expertId);
  }

  // Clear all chat history
  clearAllChatHistory() {
    this.chatHistory.clear();
  }
}

export default new GeminiService();
