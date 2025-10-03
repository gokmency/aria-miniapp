import type { MessageContext } from '@xmtp/agent-sdk';
import type { TransactionTrayMetadata } from '@/types/baseapp.js';
import { sendWalletSendCalls, sendTransactionReference, CONTENT_TYPES } from '@/utils/content.js';
import { AgentError, WalletError, handleError } from '@/utils/errors.js';

export interface WalletSendCallParams {
  to: string;
  amount: number;
  token: string;
  chainId: number;
  metadata?: Record<string, any>;
}

/**
 * Create wallet send calls for token transfers
 */
export async function createWalletSendCalls(
  ctx: MessageContext,
  params: WalletSendCallParams
): Promise<void> {
  try {
    const { to, amount, token, chainId, metadata } = params;
    
    // Create the transaction tray metadata
    const trayMetadata: TransactionTrayMetadata = {
      description: `${token} transfer`,
      hostname: 'aria.chat',
      faviconUrl: 'https://aria.chat/favicon.ico',
      title: 'Aria — Your Onchain Assistant',
      ...metadata
    };

    // Create wallet send call
    const calls = [{
      to: to,
      value: '0',
      data: createTransferCallData(token, amount, to),
      gasLimit: '21000'
    }];

    await sendWalletSendCalls(ctx, calls, trayMetadata);
  } catch (error) {
    handleError(error, params as any);
    throw new WalletError('Failed to create wallet send calls', params as any);
  }
}

/**
 * Create transfer call data (simplified for demo)
 * In production, you'd use proper contract ABI encoding
 */
function createTransferCallData(token: string, amount: number, to: string): string {
  // This is a simplified example
  // In production, you'd use proper ERC-20 transfer encoding
  const amountWei = (amount * 1e6).toString(16).padStart(64, '0'); // USDC has 6 decimals
  const toAddress = to.slice(2).padStart(64, '0');
  
  // ERC-20 transfer function signature: transfer(address,uint256)
  return `0xa9059cbb${toAddress}${amountWei}`;
}

/**
 * Handle USDC transfer on Base
 */
export async function handleUSDCTransfer(
  ctx: MessageContext,
  amount: number,
  recipient: string
): Promise<void> {
  try {
    await createWalletSendCalls(ctx, {
      to: recipient,
      amount: amount,
      token: 'USDC',
      chainId: 8453, // Base mainnet
      metadata: {
        description: `Send $${amount} USDC`,
        hostname: 'aria.chat',
        faviconUrl: 'https://aria.chat/favicon.ico',
        title: 'Aria — USDC Transfer'
      }
    });
  } catch (error) {
    handleError(error, { amount, recipient });
    throw error;
  }
}

/**
 * Handle ETH transfer
 */
export async function handleETHTransfer(
  ctx: MessageContext,
  amount: number,
  recipient: string
): Promise<void> {
  try {
    const ethWei = (amount * 1e18).toString();
    
    const calls = [{
      to: recipient,
      value: ethWei,
      data: '0x',
      gasLimit: '21000'
    }];

    const trayMetadata: TransactionTrayMetadata = {
      description: `Send ${amount} ETH`,
      hostname: 'aria.chat',
      faviconUrl: 'https://aria.chat/favicon.ico',
      title: 'Aria — Your Onchain Assistant'
    };

    await sendWalletSendCalls(ctx, calls, trayMetadata);
  } catch (error) {
    handleError(error, { amount, recipient });
    throw error;
  }
}

/**
 * Send transaction reference after successful transaction
 */
export async function sendTransactionReceipt(
  ctx: MessageContext,
  transactionHash: string,
  networkId: number = 8453
): Promise<void> {
  try {
    await sendTransactionReference(ctx, transactionHash, networkId);
  } catch (error) {
    handleError(error, { transactionHash, networkId });
    throw error;
  }
}

/**
 * Create demo wallet send call for testing
 */
export async function createDemoWalletCall(ctx: MessageContext): Promise<void> {
  try {
    const senderAddress = await ctx.getSenderAddress();
    
    await createWalletSendCalls(ctx, {
      to: senderAddress, // Send to self for demo
      amount: 1,
      token: 'USDC',
      chainId: 8453,
      metadata: {
        description: 'Demo USDC transfer',
        isDemo: true
      }
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Parse token amount from text
 * Supports formats like: $50, 50 USDC, 0.1 ETH
 */
export function parseTokenAmount(text: string): {
  amount: number;
  token: string;
} | null {
  // Match $50 or 50 USDC or 0.1 ETH
  const match = text.match(/(?:^\$?(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s+(USDC|ETH|BTC))/i);
  
  if (!match) {
    return null;
  }

  const amount = parseFloat(match[1] || match[2]);
  const token = match[3]?.toUpperCase() || 'USDC';

  return { amount, token };
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
