import type { MessageContext } from '@xmtp/agent-sdk';
import type { IntentContent } from '@/types/baseapp.js';
import { IntentContentSchema } from '@/types/baseapp.js';
import { sendText, sendReaction } from '@/utils/content.js';
import { logIntentReceived } from '@/services/logger.js';
import { AgentError, ValidationError, handleError } from '@/utils/errors.js';
import { createWalletSendCalls } from './wallet.js';

/**
 * Handle intent messages from Quick Actions
 */
export async function handleIntent(ctx: MessageContext, intentContent: IntentContent): Promise<void> {
  try {
    // Validate the intent content
    const validatedIntent = IntentContentSchema.parse(intentContent);
    
    logIntentReceived(validatedIntent.id, validatedIntent.actionId);

    // Send processing reaction
    await sendReaction(ctx, '⌛');

    // Handle different action types
    switch (validatedIntent.actionId) {
      case 'send_10':
        await handleSendAmount(ctx, 10, validatedIntent);
        break;
      case 'send_20':
        await handleSendAmount(ctx, 20, validatedIntent);
        break;
      case 'send_50':
        await handleSendAmount(ctx, 50, validatedIntent);
        break;
      case 'custom_amount':
        await handleCustomAmount(ctx, validatedIntent);
        break;
      case 'help':
        await handleHelpIntent(ctx);
        break;
      case 'pay':
        await handlePayIntent(ctx);
        break;
      case 'split':
        await handleSplitIntent(ctx);
        break;
      case 'trade':
        await handleTradeIntent(ctx);
        break;
      default:
        await handleUnknownIntent(ctx, validatedIntent.actionId);
    }

    // Send success reaction
    await sendReaction(ctx, '✅');
  } catch (error) {
    handleError(error, { intentId: intentContent.id, actionId: intentContent.actionId });
    await sendReaction(ctx, '❌');
    await sendText(ctx, 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

/**
 * Handle sending a specific amount
 */
async function handleSendAmount(
  ctx: MessageContext, 
  amount: number, 
  intent: IntentContent
): Promise<void> {
  try {
    const senderAddress = await ctx.getSenderAddress();
    
    // For demo purposes, we'll create a wallet send call
    // In production, you'd integrate with actual wallet services
    await createWalletSendCalls(ctx, {
      to: senderAddress, // In real scenario, this would be the recipient
      amount: amount,
      token: 'USDC',
      chainId: 8453 // Base mainnet
    });

    await sendText(ctx, `$${amount} ödeme işlemi başlatıldı. Cüzdanınızı kontrol edin.`);
  } catch (error) {
    handleError(error, { amount, intentId: intent.id });
    throw error;
  }
}

/**
 * Handle custom amount request
 */
async function handleCustomAmount(ctx: MessageContext, intent: IntentContent): Promise<void> {
  await sendText(ctx, 'Özel miktar için lütfen şu formatta yazın:\n`pay $<miktar> to <kişi>`\n\nÖrnek: `pay $25 to alice`');
}

/**
 * Handle help intent
 */
async function handleHelpIntent(ctx: MessageContext): Promise<void> {
  const helpText = `🤖 **Aria - Onchain Asistanınız**

**Komutlar:**
• \`/help\` - Bu yardım mesajını göster
• \`/pay $<miktar> to <kişi>\` - Ödeme gönder
• \`/split <açıklama> $<miktar> <kişi_sayısı> ways\` - Hesap böl
• \`/actions demo\` - Quick Actions örneği
• \`/attachments demo\` - Dosya gönderme örneği
• \`/about\` - Aria hakkında bilgi

**Örnekler:**
• \`split dinner $200 4 ways\`
• \`pay $50 to alice\`
• \`@aria trade ETH\`

Aria ile güvenli, hızlı ve kolay onchain işlemler yapabilirsiniz! 🚀`;

  await sendText(ctx, helpText);
}

/**
 * Handle pay intent
 */
async function handlePayIntent(ctx: MessageContext): Promise<void> {
  await sendText(ctx, 'Ödeme göndermek için şu formatta yazın:\n`pay $<miktar> to <kişi>`\n\nÖrnek: `pay $25 to alice`');
}

/**
 * Handle split intent
 */
async function handleSplitIntent(ctx: MessageContext): Promise<void> {
  await sendText(ctx, 'Hesap bölmek için şu formatta yazın:\n`split <açıklama> $<miktar> <kişi_sayısı> ways`\n\nÖrnek: `split dinner $200 4 ways`');
}

/**
 * Handle trade intent
 */
async function handleTradeIntent(ctx: MessageContext): Promise<void> {
  await sendText(ctx, 'Trade emirleri şu anda geliştiriliyor. Yakında ETH, BTC ve diğer tokenlar için otomatik trade emirleri verebileceksiniz! 📈');
}

/**
 * Handle unknown intent
 */
async function handleUnknownIntent(ctx: MessageContext, actionId: string): Promise<void> {
  await sendText(ctx, `Bilinmeyen işlem: ${actionId}. Lütfen geçerli bir seçenek seçin.`);
}

/**
 * Check if content is an intent message
 */
export function isIntentMessage(contentType: string): boolean {
  return contentType === 'coinbase.com/intent:1.0';
}

/**
 * Extract intent content from message
 */
export function extractIntentContent(ctx: MessageContext): IntentContent | null {
  try {
    const content = ctx.message.content;
    if (typeof content === 'object' && content !== null) {
      return content as IntentContent;
    }
    return null;
  } catch (error) {
    return null;
  }
}
