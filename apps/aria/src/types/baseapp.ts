import { z } from 'zod';

// Base App Content Types
export const ActionsContentSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  actions: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    imageUrl: z.string().url().optional(),
    style: z.enum(['primary', 'secondary', 'danger']).optional(),
    expiresAt: z.string().optional()
  })).min(1).max(10),
  expiresAt: z.string().optional()
});

export const IntentContentSchema = z.object({
  id: z.string().min(1),
  actionId: z.string().min(1),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional()
});

export type ActionsContent = z.infer<typeof ActionsContentSchema>;
export type IntentContent = z.infer<typeof IntentContentSchema>;

// Action Types
export type ActionStyle = 'primary' | 'secondary' | 'danger';

export interface Action {
  id: string;
  label: string;
  imageUrl?: string;
  style?: ActionStyle;
  expiresAt?: string;
}

// Wallet Send Calls Metadata
export interface TransactionTrayMetadata {
  description: string;
  hostname: string;
  faviconUrl: string;
  title: string;
}

// Agent Configuration
export interface AgentConfig {
  env: 'dev' | 'production';
  walletKey: string;
  dbEncryptionKey: string;
  logLevel: string;
  baseChainId?: number;
  baseRpcUrl?: string;
  geminiApiKey: string;
}
