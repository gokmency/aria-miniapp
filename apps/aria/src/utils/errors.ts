import { getLogger } from '@/services/logger.js';

export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'RATE_LIMIT_ERROR', context);
    this.name = 'RateLimitError';
  }
}

export class WalletError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'WALLET_ERROR', context);
    this.name = 'WalletError';
  }
}

export class ContentError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONTENT_ERROR', context);
    this.name = 'ContentError';
  }
}

/**
 * Handle errors gracefully and log them
 */
export function handleError(error: unknown, context?: Record<string, unknown>): void {
  const logger = getLogger();
  
  if (error instanceof AgentError) {
    logger.warn({
      event: 'agent_error',
      error: {
        name: error.name,
        code: error.code,
        message: error.message
      },
      context: { ...context, ...error.context }
    }, `Agent error: ${error.message}`);
  } else if (error instanceof Error) {
    logger.error({
      event: 'unexpected_error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    }, `Unexpected error: ${error.message}`);
  } else {
    logger.error({
      event: 'unknown_error',
      error: String(error),
      context
    }, 'Unknown error occurred');
  }
}

/**
 * Create a user-friendly error message
 */
export function createUserFriendlyMessage(error: unknown): string {
  if (error instanceof RateLimitError) {
    return 'Çok fazla mesaj gönderiyorsunuz. Lütfen biraz bekleyin.';
  }
  
  if (error instanceof ValidationError) {
    return 'Mesajınız geçersiz format içeriyor. Lütfen tekrar deneyin.';
  }
  
  if (error instanceof WalletError) {
    return 'Cüzdan işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
  }
  
  if (error instanceof ContentError) {
    return 'Mesaj içeriği işlenirken bir hata oluştu. Lütfen tekrar deneyin.';
  }
  
  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Record<string, unknown>
) {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return undefined;
    }
  };
}

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): void {
  const missing = requiredFields.filter(field => {
    const value = obj[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
}
