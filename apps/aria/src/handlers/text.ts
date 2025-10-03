import type { MessageContext } from '@xmtp/agent-sdk';
import { sendText, sendReaction, CONTENT_TYPES } from '@/utils/content.js';
import { shouldRespond, extractMessageContent, getSenderAddress, isDirectMessage } from '@/utils/group.js';
import { logMessageReceived, logMessageSent } from '@/services/logger.js';
import { checkRateLimit, getRateLimitInfo } from '@/services/rateLimit.js';
import { handleError, RateLimitError } from '@/utils/errors.js';
import { handleSplitPayment, parseSplitCommand, parsePayCommand, handleDemoActions } from './actions.js';
import { handleUSDCTransfer, parseTokenAmount, isValidAddress } from './wallet.js';
import { sendDemoAttachment, sendDemoRemoteAttachment } from './attachments.js';
import { createGeminiService } from '@/services/gemini.js';

// Global Gemini service instance
let geminiService: any = null;

/**
 * Initialize Gemini service
 */
export function initializeGemini(apiKey: string): void {
  geminiService = createGeminiService(apiKey);
}

/**
 * Handle incoming text messages
 */
export async function handleTextMessage(ctx: MessageContext): Promise<void> {
  try {
    const message = ctx.message.content as string;
    const senderAddress = getSenderAddress(ctx);
    const isGroup = !isDirectMessage(ctx);

    // Log the received message
    logMessageReceived(senderAddress, message, isGroup);

    // Check if we should respond to this message
    if (!shouldRespond(ctx)) {
      return;
    }

    // Check rate limiting
    if (!checkRateLimit(senderAddress)) {
      const rateLimitInfo = getRateLimitInfo(senderAddress);
      const resetTime = new Date(rateLimitInfo.resetTime).toLocaleTimeString('tr-TR');
      
      // Send rate limit message but don't process it further
      await sendText(ctx, `Çok fazla mesaj gönderiyorsunuz. ${resetTime} tarihinde tekrar deneyin.`);
      
      // Log that we're skipping due to rate limit
      console.log('Rate limit exceeded, skipping message processing');
      return;
    }

    // Extract clean message content (remove mentions)
    const cleanMessage = extractMessageContent(ctx);
    const lowerMessage = cleanMessage.toLowerCase().trim();

    // Handle different commands
    if (lowerMessage === 'gm' || lowerMessage === 'hello' || lowerMessage === 'hi') {
      await handleGreeting(ctx);
    } else if (lowerMessage === '/help') {
      await handleHelp(ctx);
    } else if (lowerMessage === '/about') {
      await handleAbout(ctx);
    } else if (lowerMessage.startsWith('/split')) {
      await handleSplitCommand(ctx, cleanMessage);
    } else if (lowerMessage.startsWith('/pay')) {
      await handlePayCommand(ctx, cleanMessage);
    } else if (lowerMessage === '/actions demo') {
      await handleDemoActions(ctx);
    } else if (lowerMessage === '/attachments demo') {
      await handleAttachmentsDemo(ctx);
    } else if (lowerMessage.startsWith('split ')) {
      await handleSplitCommand(ctx, cleanMessage);
    } else if (lowerMessage.startsWith('pay ')) {
      await handlePayCommand(ctx, cleanMessage);
    } else if (lowerMessage.includes('split') && lowerMessage.includes('$')) {
      await handleSplitCommand(ctx, cleanMessage);
    } else if (lowerMessage.includes('pay') && lowerMessage.includes('$')) {
      await handlePayCommand(ctx, cleanMessage);
    } else {
      await handleGeneralMessage(ctx, cleanMessage);
    }

    logMessageSent(senderAddress, CONTENT_TYPES.TEXT);
  } catch (error) {
    handleError(error, { 
      sender: getSenderAddress(ctx), 
      message: ctx.message.content 
    });
    
    try {
      await sendReaction(ctx, '❌');
      await sendText(ctx, 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } catch (sendError) {
      console.error('Failed to send error message:', sendError);
    }
  }
}

/**
 * Handle greeting messages
 */
async function handleGreeting(ctx: MessageContext): Promise<void> {
  const greetings = [
    'gm! 👋 Nasıl yardımcı olabilirim?',
    'Merhaba! Aria burada, ne yapmak istiyorsunuz?',
    'Selam! Onchain işlemlerinizde yardımcı olabilirim.',
    'Hey! Hangi işlemi yapmak istiyorsunuz?'
  ];
  
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  await sendText(ctx, randomGreeting);
}

/**
 * Handle help command
 */
async function handleHelp(ctx: MessageContext): Promise<void> {
  const helpText = `🤖 **Aria - Onchain Asistanınız**

**Temel Komutlar:**
• \`/help\` - Bu yardım mesajını göster
• \`/about\` - Aria hakkında bilgi

**Ödeme İşlemleri:**
• \`pay $<miktar> to <kişi>\` - Ödeme gönder
• \`split <açıklama> $<miktar> <kişi_sayısı> ways\` - Hesap böl

**Demo Özellikler:**
• \`/actions demo\` - Quick Actions örneği
• \`/attachments demo\` - Dosya gönderme örneği

**Örnekler:**
• \`split dinner $200 4 ways\`
• \`pay $50 to alice\`
• \`@aria trade ETH\`

**Grup Mesajlaşması:**
Gruplarda sadece \`@aria\` ile mention edilince veya mesajıma reply gelince cevap veririm.

Aria ile güvenli, hızlı ve kolay onchain işlemler yapabilirsiniz! 🚀`;

  await sendText(ctx, helpText);
}

/**
 * Handle about command
 */
async function handleAbout(ctx: MessageContext): Promise<void> {
  const aboutText = `🤖 **Aria Hakkında**

Aria, Base App için geliştirilmiş XMTP tabanlı bir mesajlaşma agent'ıdır.

**Özellikler:**
• ✅ Güvenli mesajlaşma (XMTP)
• ✅ Quick Actions ile kolay işlemler
• ✅ Grup ve DM desteği
• ✅ Dosya paylaşımı
• ✅ Onchain işlemler
• ✅ Rate limiting ve güvenlik

**Teknolojiler:**
• XMTP Protocol
• Base Blockchain
• TypeScript
• Node.js

**Geliştirici:** Aria Team
**Versiyon:** 1.0.0
**Lisans:** MIT

Daha fazla bilgi için: https://aria.chat`;

  await sendText(ctx, aboutText);
}

/**
 * Handle split command
 */
async function handleSplitCommand(ctx: MessageContext, message: string): Promise<void> {
  const splitInfo = parseSplitCommand(message);
  
  if (!splitInfo) {
    await sendText(ctx, 'Hesap bölme formatı: `split <açıklama> $<miktar> <kişi_sayısı> ways`\n\nÖrnek: `split dinner $200 4 ways`');
    return;
  }

  const { description, amount, participants } = splitInfo;
  
  if (amount <= 0 || participants <= 0) {
    await sendText(ctx, 'Miktar ve kişi sayısı pozitif olmalıdır.');
    return;
  }

  await handleSplitPayment(ctx, description, amount, participants);
}

/**
 * Handle pay command
 */
async function handlePayCommand(ctx: MessageContext, message: string): Promise<void> {
  const payInfo = parsePayCommand(message);
  
  if (!payInfo) {
    await sendText(ctx, 'Ödeme formatı: `pay $<miktar> to <kişi>`\n\nÖrnek: `pay $50 to alice`');
    return;
  }

  const { amount, to } = payInfo;
  
  if (amount <= 0) {
    await sendText(ctx, 'Miktar pozitif olmalıdır.');
    return;
  }

  // For demo purposes, we'll create a wallet send call
  try {
    await handleUSDCTransfer(ctx, amount, to);
    await sendText(ctx, `$${amount} ${to} kişisine gönderilmek üzere hazırlandı. Cüzdanınızı kontrol edin.`);
  } catch (error) {
    handleError(error, { amount, to });
    await sendText(ctx, 'Ödeme işlemi sırasında bir hata oluştu.');
  }
}

/**
 * Handle attachments demo
 */
async function handleAttachmentsDemo(ctx: MessageContext): Promise<void> {
  await sendText(ctx, 'Demo dosyaları gönderiliyor...');
  
  try {
    await sendDemoAttachment(ctx);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await sendDemoRemoteAttachment(ctx);
  } catch (error) {
    handleError(error);
    await sendText(ctx, 'Demo dosyaları gönderilirken bir hata oluştu.');
  }
}

/**
 * Handle general messages with Gemini AI
 */
async function handleGeneralMessage(ctx: MessageContext, message: string): Promise<void> {
  if (geminiService) {
    try {
      // Generate AI response
      const context = isDirectMessage(ctx) ? 'DM' : 'Group chat';
      const aiResponse = await geminiService.generateResponse(message, context);
      
      // Send AI response (single message only)
      await sendText(ctx, aiResponse);
    } catch (error) {
      console.error('Gemini error:', error);
      // Fallback to simple response
      await sendText(ctx, 'Üzgünüm canım, şu anda biraz karışık düşünüyorum 😅 Tekrar dener misin? 💕');
    }
  } else {
    // Fallback responses if Gemini is not available
    const responses = [
      'Anladım! Size nasıl yardımcı olabilirim?',
      'İlginç! Daha fazla bilgi verebilir misiniz?',
      'Bu konuda size yardımcı olabilirim. Ne yapmak istiyorsunuz?',
      'Komutlar için `/help` yazabilirsiniz.',
      'Onchain işlemlerinizde yardımcı olabilirim!'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await sendText(ctx, randomResponse);
  }
}

/**
 * Check if content is a text message
 */
export function isTextMessage(contentType: any): boolean {
  // Handle both string and object formats
  if (typeof contentType === 'string') {
    return contentType === CONTENT_TYPES.TEXT;
  }
  
  if (contentType && typeof contentType === 'object') {
    return contentType.authorityId === 'xmtp.org' && contentType.typeId === 'text';
  }
  
  return false;
}

/**
 * Extract text content from message
 */
export function extractTextContent(ctx: MessageContext): string {
  const content = ctx.message.content;
  return typeof content === 'string' ? content : '';
}
