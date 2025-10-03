import pino from 'pino';
import type { AgentConfig } from '@/types/baseapp.js';

let logger: pino.Logger;

export function createLogger(config: AgentConfig): pino.Logger {
  if (logger) {
    return logger;
  }

  const options: any = {
    level: config.logLevel,
    formatters: {
      level: (label: string) => {
        return { level: label };
      }
    },
    timestamp: pino.stdTimeFunctions.isoTime
  };

  if (config.env === 'dev') {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    };
  }

  logger = pino(options);

  return logger;
}

export function getLogger(): pino.Logger {
  if (!logger) {
    throw new Error('Logger not initialized. Call createLogger() first.');
  }
  return logger;
}

// Helper functions for structured logging
export function logMessageReceived(from: string, content: string, isGroup: boolean): void {
  getLogger().info({
    event: 'message_received',
    from,
    content: content.substring(0, 100), // Truncate for privacy
    isGroup
  }, 'Message received');
}

export function logMessageSent(to: string, contentType: string): void {
  getLogger().info({
    event: 'message_sent',
    to,
    contentType
  }, 'Message sent');
}

export function logError(error: Error, context?: Record<string, unknown>): void {
  getLogger().error({
    event: 'error',
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    ...context
  }, 'Error occurred');
}

export function logAgentStart(address: string, env: string): void {
  getLogger().info({
    event: 'agent_start',
    address,
    env
  }, 'Agent started');
}

export function logQuickActionsSent(actionsId: string, actionCount: number): void {
  getLogger().info({
    event: 'quick_actions_sent',
    actionsId,
    actionCount
  }, 'Quick Actions sent');
}

export function logIntentReceived(intentId: string, actionId: string): void {
  getLogger().info({
    event: 'intent_received',
    intentId,
    actionId
  }, 'Intent received');
}
