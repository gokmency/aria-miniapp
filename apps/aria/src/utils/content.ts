import type { MessageContext } from '@xmtp/agent-sdk';

// XMTP Content Types
export const CONTENT_TYPES = {
  TEXT: 'xmtp.org/text:1.0',
  ATTACHMENT: 'xmtp.org/attachment:1.0',
  REMOTE_STATIC_ATTACHMENT: 'xmtp.org/remoteStaticAttachment:1.0',
  REACTION: 'xmtp.org/reaction:1.0',
  REPLY: 'xmtp.org/reply:1.0',
  GROUP_MEMBERSHIP_CHANGE: 'xmtp.org/group_membership_change:1.0',
  GROUP_UPDATED: 'xmtp.org/group_updated:1.0',
  READ_RECEIPT: 'xmtp.org/readReceipt:1.0',
  WALLET_SEND_CALLS: 'xmtp.org/walletSendCalls:1.0',
  TRANSACTION_REFERENCE: 'xmtp.org/transactionReference:1.0',
  // Base App specific
  ACTIONS: 'coinbase.com/actions:1.0',
  INTENT: 'coinbase.com/intent:1.0'
} as const;

/**
 * Send a reaction to a message
 */
export async function sendReaction(ctx: MessageContext, emoji: string): Promise<void> {
  try {
    await ctx.sendReaction(emoji);
  } catch (error) {
    console.error('Failed to send reaction:', error);
  }
}

/**
 * Send a text message
 */
export async function sendText(ctx: MessageContext, text: string): Promise<void> {
  try {
    await ctx.sendText(text);
  } catch (error) {
    console.error('Failed to send text:', error);
    throw error;
  }
}

/**
 * Send a reply to a specific message
 */
export async function sendReply(ctx: MessageContext, text: string, replyToId?: string): Promise<void> {
  try {
    await ctx.sendTextReply(text);
  } catch (error) {
    console.error('Failed to send reply:', error);
    throw error;
  }
}

/**
 * Send an attachment
 */
export async function sendAttachment(
  ctx: MessageContext, 
  filename: string, 
  mimeType: string, 
  data: Uint8Array
): Promise<void> {
  try {
    await ctx.conversation.send({
      filename,
      mimeType,
      data
    }, {
      contentType: CONTENT_TYPES.ATTACHMENT
    } as any);
  } catch (error) {
    console.error('Failed to send attachment:', error);
    throw error;
  }
}

/**
 * Send a remote static attachment
 */
export async function sendRemoteAttachment(
  ctx: MessageContext,
  url: string,
  filename: string,
  mimeType: string
): Promise<void> {
  try {
    await ctx.conversation.send({
      url,
      filename,
      mimeType
    }, {
      contentType: CONTENT_TYPES.REMOTE_STATIC_ATTACHMENT
    } as any);
  } catch (error) {
    console.error('Failed to send remote attachment:', error);
    throw error;
  }
}

/**
 * Send wallet send calls
 */
export async function sendWalletSendCalls(
  ctx: MessageContext,
  calls: any[],
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const senderAddress = await ctx.getSenderAddress();
    await ctx.conversation.send({
      version: '1.0',
      from: senderAddress,
      calls,
      metadata
    }, {
      contentType: CONTENT_TYPES.WALLET_SEND_CALLS
    } as any);
  } catch (error) {
    console.error('Failed to send wallet send calls:', error);
    throw error;
  }
}

/**
 * Send transaction reference
 */
export async function sendTransactionReference(
  ctx: MessageContext,
  transactionHash: string,
  networkId: number
): Promise<void> {
  try {
    await ctx.conversation.send({
      networkId,
      reference: transactionHash,
      metadata: {
        transactionHash,
        networkId
      }
    }, {
      contentType: CONTENT_TYPES.TRANSACTION_REFERENCE
    } as any);
  } catch (error) {
    console.error('Failed to send transaction reference:', error);
    throw error;
  }
}

/**
 * Check if content is a specific type
 */
export function isContentType(contentType: string, expectedType: string): boolean {
  return contentType === expectedType;
}

/**
 * Get content type from message
 */
export function getContentType(ctx: MessageContext): string {
  const contentType = ctx.message.contentType as any;
  
  // Handle different contentType formats
  if (typeof contentType === 'string') {
    return contentType;
  }
  
  if (contentType && typeof contentType === 'object') {
    // Format: { authorityId: 'xmtp.org', typeId: 'text', versionMajor: 1, versionMinor: 0 }
    if (contentType.authorityId && contentType.typeId) {
      return `${contentType.authorityId}/${contentType.typeId}:${contentType.versionMajor || 1}.${contentType.versionMinor || 0}`;
    }
  }
  
  return CONTENT_TYPES.TEXT;
}
