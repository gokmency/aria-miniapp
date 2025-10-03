import { z } from 'zod';
import type { AgentConfig } from '@/types/baseapp.js';

// Environment validation schema
const envSchema = z.object({
  XMTP_WALLET_KEY: z.string().min(1, 'XMTP_WALLET_KEY is required'),
  XMTP_DB_ENCRYPTION_KEY: z.string().min(1, 'XMTP_DB_ENCRYPTION_KEY is required'),
  XMTP_ENV: z.enum(['dev', 'production'], {
    errorMap: () => ({ message: 'XMTP_ENV must be either "dev" or "production"' })
  }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  BASE_CHAIN_ID: z.string().transform(Number).optional(),
  BASE_RPC_URL: z.string().url().optional(),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required')
});

export function validateEnv(): AgentConfig {
  try {
    const env = envSchema.parse(process.env);
    
    return {
      env: env.XMTP_ENV,
      walletKey: env.XMTP_WALLET_KEY,
      dbEncryptionKey: env.XMTP_DB_ENCRYPTION_KEY,
      logLevel: env.LOG_LEVEL,
      baseChainId: env.BASE_CHAIN_ID,
      baseRpcUrl: env.BASE_RPC_URL,
      geminiApiKey: env.GEMINI_API_KEY
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
