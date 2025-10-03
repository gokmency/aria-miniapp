import type { MessageContext } from '@xmtp/agent-sdk';
import type { ActionsContent, Action } from '@/types/baseapp.js';
import { ActionsContentSchema } from '@/types/baseapp.js';
import { sendReaction, sendText, CONTENT_TYPES } from '@/utils/content.js';
import { logQuickActionsSent } from '@/services/logger.js';
import { AgentError, ValidationError, handleError } from '@/utils/errors.js';

/**
 * Create payment actions for splitting bills
 */
export function createPaymentActions(
  to: string,
  amounts: number[],
  id: string,
  expiresAt?: string
): ActionsContent {
  const actions: Action[] = amounts.map((amount, index) => ({
    id: `send_${amount}`,
    label: `$${amount} gönder`,
    style: 'primary' as const
  }));

  actions.push({
    id: 'custom_amount',
    label: 'Özel miktar',
    style: 'secondary' as const
  });

  return {
    id,
    description: `${to} kişisine ödeme seçenekleri`,
    actions,
    expiresAt
  };
}

/**
 * Create demo actions for testing
 */
export function createDemoActions(id: string): ActionsContent {
  return {
    id,
    description: 'Aria ile neler yapabilirsiniz?',
    actions: [
      {
        id: 'help',
        label: 'Yardım',
        style: 'primary'
      },
      {
        id: 'pay',
        label: 'Ödeme Gönder',
        style: 'primary'
      },
      {
        id: 'split',
        label: 'Hesap Böl',
        style: 'secondary'
      },
      {
        id: 'trade',
        label: 'Trade Emri',
        style: 'secondary'
      }
    ]
  };
}

/**
 * Send Quick Actions message
 */
export async function sendQuickActions(
  ctx: MessageContext,
  actionsContent: ActionsContent
): Promise<void> {
  try {
    // Validate the actions content
    const validatedContent = ActionsContentSchema.parse(actionsContent);
    
    // Send the actions with proper content type
    await ctx.conversation.send(validatedContent, {
      contentType: CONTENT_TYPES.ACTIONS
    } as any);

    logQuickActionsSent(validatedContent.id, validatedContent.actions.length);
    
    // Send fallback text for unsupported clients
    const fallbackText = createFallbackText(validatedContent);
    await sendText(ctx, fallbackText);
  } catch (error) {
    handleError(error, { actionsId: actionsContent.id });
    
    // Send a simple text message as fallback
    await sendText(ctx, 'Özür dilerim, şu anda Quick Actions kullanılamıyor. İşte seçenekleriniz:\n\n' + createFallbackText(actionsContent));
  }
}

/**
 * Create fallback text for unsupported clients
 */
function createFallbackText(actions: ActionsContent): string {
  const actionList = actions.actions
    .map((action, index) => `[${index + 1}] ${action.label}`)
    .join('\n');

  return `${actions.description}\n\n${actionList}\n\nSeçmek için numarayı yazın.`;
}

/**
 * Handle payment splitting request
 */
export async function handleSplitPayment(
  ctx: MessageContext,
  description: string,
  amount: number,
  participants: number
): Promise<void> {
  try {
    const perPerson = Math.round((amount / participants) * 100) / 100;
    const amounts = [perPerson, perPerson * 2, perPerson * 3];
    
    const actionsId = `split_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
    
    const actions = createPaymentActions(
      `${participants} kişi`,
      amounts,
      actionsId,
      expiresAt
    );

    await sendQuickActions(ctx, actions);
  } catch (error) {
    handleError(error, { description, amount, participants });
    await sendText(ctx, 'Hesap bölme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

/**
 * Handle demo actions request
 */
export async function handleDemoActions(ctx: MessageContext): Promise<void> {
  try {
    const actionsId = `demo_${Date.now()}`;
    const actions = createDemoActions(actionsId);
    
    await sendQuickActions(ctx, actions);
  } catch (error) {
    handleError(error);
    await sendText(ctx, 'Demo özellikler yüklenirken bir hata oluştu.');
  }
}

/**
 * Parse split payment command
 * Format: split dinner $200 4 ways
 */
export function parseSplitCommand(text: string): {
  description: string;
  amount: number;
  participants: number;
} | null {
  const match = text.match(/split\s+(.+?)\s+\$?(\d+(?:\.\d{2})?)\s+(\d+)\s+ways?/i);
  
  if (!match) {
    return null;
  }

  return {
    description: match[1].trim(),
    amount: parseFloat(match[2]),
    participants: parseInt(match[3], 10)
  };
}

/**
 * Parse pay command
 * Format: pay $50 to alice
 */
export function parsePayCommand(text: string): {
  amount: number;
  to: string;
} | null {
  const match = text.match(/pay\s+\$?(\d+(?:\.\d{2})?)\s+to\s+(.+)/i);
  
  if (!match) {
    return null;
  }

  return {
    amount: parseFloat(match[1]),
    to: match[2].trim()
  };
}
