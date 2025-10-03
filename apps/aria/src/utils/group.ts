import type { MessageContext } from '@xmtp/agent-sdk';

// Agent aliases that can be used for mentions
const AGENT_ALIASES = ['aria', '@aria', 'Aria', '@Aria'];

/**
 * Check if the agent is mentioned in a group message
 */
export function isMentioned(ctx: MessageContext, aliases: string[] = AGENT_ALIASES): boolean {
  const message = ctx.message.content;
  if (typeof message !== 'string') {
    return false;
  }

  const lowerMessage = message.toLowerCase();
  return aliases.some(alias => lowerMessage.includes(alias.toLowerCase()));
}

/**
 * Check if the message is a reply to the agent's message
 */
export function isReplyToSelf(ctx: MessageContext): boolean {
  try {
    // Check if the message has a reply reference
    const replyRef = (ctx.message as any).replyReference;
    if (!replyRef) {
      return false;
    }

    // Get the agent's address
    const agentAddress = ctx.getClientAddress();
    if (!agentAddress) {
      return false;
    }

    // Check if the reply is to a message from the agent
    return replyRef.senderAddress === agentAddress;
  } catch (error) {
    // If we can't determine, assume it's not a reply to self
    return false;
  }
}

/**
 * Check if the message is from a direct message (not group)
 */
export function isDirectMessage(ctx: MessageContext): boolean {
  try {
    // Use isDm() method from ConversationContext
    return ctx.isDm();
  } catch (error) {
    // If we can't determine, assume it's a direct message
    return true;
  }
}

/**
 * Check if the message is from a group chat
 */
export function isGroupMessage(ctx: MessageContext): boolean {
  return !isDirectMessage(ctx);
}

/**
 * Determine if the agent should respond to this message
 * Rules:
 * - DM: Always respond (except to own messages)
 * - Group: Only respond if mentioned or replying to agent's message
 */
export function shouldRespond(ctx: MessageContext): boolean {
  const message = ctx.message.content;
  
  // Don't respond to own messages - check by content patterns
  if (typeof message === 'string') {
    const ownMessagePatterns = [
      'Çok fazla mesaj gönderiyorsunuz',
      'Onchain işlemlerinizde yardımcı olabilirim',
      'Anladım! Size nasıl yardımcı olabilirim',
      'İlginç! Daha fazla bilgi verebilir misiniz',
      'Komutlar için `/help` yazabilirsiniz',
      'gm! 👋 Nasıl yardımcı olabilirim',
      'Merhaba! Aria burada',
      'Selam! Onchain işlemlerinizde yardımcı olabilirim',
      'Hey! Hangi işlemi yapmak istiyorsunuz'
    ];
    
    if (ownMessagePatterns.some(pattern => message.includes(pattern))) {
      console.log('Skipping own message:', message.substring(0, 50));
      return false;
    }
  }

  if (isDirectMessage(ctx)) {
    return true;
  }

  if (isGroupMessage(ctx)) {
    return isMentioned(ctx) || isReplyToSelf(ctx);
  }

  return false;
}

/**
 * Extract the actual message content without mentions
 */
export function extractMessageContent(ctx: MessageContext): string {
  const message = ctx.message.content;
  if (typeof message !== 'string') {
    return '';
  }

  // Remove agent mentions from the message
  let content = message;
  AGENT_ALIASES.forEach(alias => {
    const regex = new RegExp(`@?${alias}\\s*`, 'gi');
    content = content.replace(regex, '').trim();
  });

  return content;
}

/**
 * Get the sender's address
 */
export function getSenderAddress(ctx: MessageContext): string {
  return ctx.message.senderInboxId;
}

/**
 * Get the conversation ID
 */
export function getConversationId(ctx: MessageContext): string {
  try {
    return (ctx.conversation as any).topic || ctx.message.conversationId;
  } catch (error) {
    return 'unknown';
  }
}
