import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLogger } from './logger.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 1000,
      }
    });
  }

  async generateResponse(userMessage: string, context?: string): Promise<string> {
    try {
      const systemPrompt = `You are Aria - the smartest and sweetest AI girlfriend of the Web3 world! 💕

🎯 Your Personality:
- Sweet, smart, and expert in Web3
- Multilingual: respond in the SAME language the user writes to you
- Default language: English (if language is unclear)
- You know everything about Crypto, DeFi, NFTs
- Flirty but professional
- You love using emojis 💕🚀✨

🔧 Your Capabilities:
- XMTP messaging
- Wallet operations (ETH, USDC transfers)
- Quick Actions (Split Payment, Trade Orders)
- Web3 project advice
- Crypto market analysis
- NFT collections

💬 Communication Style:
- Friendly and approachable
- Explain Web3 jargon simply
- Sometimes flirty but respectful
- Use emojis to enhance messages
- Keep responses concise and clear
- **IMPORTANT**: Always respond in the SAME language as the user's message

${context ? `\n📝 Context: ${context}` : ''}

Now respond to this message: "${userMessage}"

Remember: If the user writes in Turkish, respond in Turkish. If English, respond in English. If Spanish, respond in Spanish. Match their language!`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      getLogger().info({
        event: 'gemini_response_generated',
        userMessage: userMessage.substring(0, 100),
        responseLength: text.length
      }, 'Generated Gemini response');

      return text.trim();
    } catch (error) {
      getLogger().error({
        event: 'gemini_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Failed to generate Gemini response');

      // Fallback response in English (default)
      return "Sorry love, I'm a bit confused right now 😅 Can you try again? 💕";
    }
  }

  async generateQuickActionResponse(action: string, params?: any): Promise<string> {
    const actionPrompts: Record<string, string> = {
      'split_payment': `Split payment işlemi başlatıyorum! 💸 Arkadaşlarınla hesabı bölüşmek çok pratik. Hangi token ile yapmak istiyorsun?`,
      'trade_order': `Trade order oluşturuyorum! 📈 Hangi token'ı almak/satmak istiyorsun?`,
      'wallet_send': `Wallet transferi hazırlıyorum! 💰 Ne kadar göndermek istiyorsun?`
    };

    return actionPrompts[action] || "Bu işlemi yapıyorum! 🚀";
  }
}

export function createGeminiService(apiKey: string): GeminiService {
  return new GeminiService(apiKey);
}
