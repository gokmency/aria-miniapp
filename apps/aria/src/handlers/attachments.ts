import type { MessageContext } from '@xmtp/agent-sdk';
import { sendText, sendAttachment, sendRemoteAttachment, CONTENT_TYPES } from '@/utils/content.js';
import { handleError } from '@/utils/errors.js';

/**
 * Handle attachment messages
 */
export async function handleAttachment(ctx: MessageContext): Promise<void> {
  try {
    const content = ctx.message.content;
    
    if (typeof content === 'object' && content !== null) {
      const attachment = content as any;
      
      // Log attachment info
      console.log('Received attachment:', {
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.data?.length || 0
      });

      // Send acknowledgment
      await sendText(ctx, `📎 Dosya alındı: ${attachment.filename || 'Bilinmeyen dosya'}`);
      
      // Process different file types
      if (attachment.mimeType?.startsWith('image/')) {
        await handleImageAttachment(ctx, attachment);
      } else if (attachment.mimeType?.startsWith('text/')) {
        await handleTextAttachment(ctx, attachment);
      } else {
        await sendText(ctx, 'Bu dosya türü henüz desteklenmiyor.');
      }
    }
  } catch (error) {
    handleError(error);
    await sendText(ctx, 'Dosya işlenirken bir hata oluştu.');
  }
}

/**
 * Handle image attachments
 */
async function handleImageAttachment(ctx: MessageContext, attachment: any): Promise<void> {
  try {
    await sendText(ctx, `🖼️ Resim alındı! Boyut: ${attachment.data?.length || 0} bytes`);
    
    // In a real implementation, you might:
    // - Upload to IPFS or other storage
    // - Process the image
    // - Generate thumbnails
    // - Extract metadata
    
    await sendText(ctx, 'Resim başarıyla işlendi!');
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Handle text attachments
 */
async function handleTextAttachment(ctx: MessageContext, attachment: any): Promise<void> {
  try {
    // Convert Uint8Array to string
    const textContent = new TextDecoder().decode(attachment.data);
    
    await sendText(ctx, `📄 Metin dosyası alındı:\n\`\`\`\n${textContent.substring(0, 500)}${textContent.length > 500 ? '...' : ''}\n\`\`\``);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Send demo attachment
 */
export async function sendDemoAttachment(ctx: MessageContext): Promise<void> {
  try {
    // Create a simple text file
    const demoText = `Merhaba! Bu Aria'dan bir demo dosyasıdır.

Özellikler:
- Güvenli dosya paylaşımı
- Onchain işlemler
- Quick Actions
- Grup mesajlaşması

Aria ile daha fazlasını keşfedin! 🚀`;

    const textBytes = new TextEncoder().encode(demoText);
    
    await sendAttachment(ctx, 'aria-demo.txt', 'text/plain', textBytes);
    await sendText(ctx, 'Demo dosyası gönderildi! 📎');
  } catch (error) {
    handleError(error);
    await sendText(ctx, 'Demo dosyası gönderilirken bir hata oluştu.');
  }
}

/**
 * Send demo remote attachment
 */
export async function sendDemoRemoteAttachment(ctx: MessageContext): Promise<void> {
  try {
    // Use a public image URL for demo
    const imageUrl = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Aria+Demo';
    
    await sendRemoteAttachment(
      ctx,
      imageUrl,
      'aria-demo-image.png',
      'image/png'
    );
    
    await sendText(ctx, 'Demo resim gönderildi! 🖼️');
  } catch (error) {
    handleError(error);
    await sendText(ctx, 'Demo resim gönderilirken bir hata oluştu.');
  }
}

/**
 * Check if content is an attachment
 */
export function isAttachmentMessage(contentType: string): boolean {
  return contentType === CONTENT_TYPES.ATTACHMENT || 
         contentType === CONTENT_TYPES.REMOTE_STATIC_ATTACHMENT;
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/json',
    'application/pdf'
  ];
  
  return allowedTypes.includes(mimeType);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
