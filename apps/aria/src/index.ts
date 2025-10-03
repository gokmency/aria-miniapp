import 'dotenv/config';
import { Agent } from '@xmtp/agent-sdk';
import { validateEnv } from '@/services/env.js';
import { createLogger, logAgentStart } from '@/services/logger.js';
import { handleError } from '@/utils/errors.js';
import { handleTextMessage, isTextMessage, initializeGemini } from '@/handlers/text.js';
import { handleIntent, isIntentMessage, extractIntentContent } from '@/handlers/intent.js';
import { handleAttachment, isAttachmentMessage } from '@/handlers/attachments.js';
import { CONTENT_TYPES } from '@/utils/content.js';

// Global error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function main() {
  try {
    // Validate environment variables
    const config = validateEnv();
    
    // Initialize logger
    const logger = createLogger(config);
    
    // Initialize Gemini AI
    initializeGemini(config.geminiApiKey);
    logger.info('Gemini AI initialized successfully');
    
    // Create agent
    const agent = await Agent.createFromEnv({
      env: config.env
    });
    
    // Log agent startup
    logAgentStart(agent.address || 'unknown', config.env);
    
    // Agent event handlers
    agent.on('start', (ctx) => {
      logger.info({
        event: 'agent_started',
        address: agent.address,
        env: config.env
      }, 'Aria agent started successfully');
      
      if (config.env === 'dev') {
        console.log(`🚀 Aria is online`);
        console.log(`📱 Test on xmtp.chat with address: ${agent.address}`);
      } else {
        console.log(`🚀 Aria is online in production mode`);
        console.log(`📱 Address: ${agent.address}`);
      }
    });

    // Handle message events (covers all content types)
    agent.on('message', async (ctx: any) => {
      const contentType = ctx.message.contentType;
      
      try {
        if (isTextMessage(contentType)) {
          await handleTextMessage(ctx);
        } else if (isIntentMessage(contentType)) {
          const intentContent = extractIntentContent(ctx);
          if (intentContent) {
            await handleIntent(ctx, intentContent);
          }
        } else if (isAttachmentMessage(contentType)) {
          await handleAttachment(ctx);
        } else {
          logger.info({
            event: 'unknown_content_type',
            contentType,
            sender: await ctx.getSenderAddress()
          }, `Unknown content type: ${JSON.stringify(contentType)}`);
        }
      } catch (error) {
        handleError(error, { 
          contentType, 
          sender: await ctx.getSenderAddress()
        });
      }
    });

    // Handle group events
    agent.on('group', async (ctx) => {
      logger.info({
        event: 'group_event',
        groupId: (ctx.conversation as any).topic || ctx.conversation.id
      }, 'Group event');
    });

    // Handle errors
    agent.on('unhandledError', (error) => {
      handleError(error, { event: 'agent_error' });
    });
    
    // Start the agent
    await agent.start();
    
    // Keep the process running
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await agent.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await agent.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start Aria agent:', error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
