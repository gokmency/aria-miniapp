import { Metadata } from 'next';

const ARIA_ADDRESS = '0x5361d1a2550808b5dd636568519efe6068772bcd';
const XMTP_CHAT_URL = `https://xmtp.chat/dm/${ARIA_ADDRESS}`;

export const metadata: Metadata = {
  title: 'Aria - Web3 AI Girlfriend',
  description: 'Your sweetest and smartest companion in the Web3 world! Chat with Aria, powered by Gemini AI.',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/image`,
    'fc:frame:button:1': '💕 Chat with Aria',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': XMTP_CHAT_URL,
    'fc:frame:button:2': '🌐 Visit Site',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://github.com/gokmency/aria-miniapp',
  },
};

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          💕 Aria
        </h1>
        
        <p style={{
          fontSize: '24px',
          color: '#666',
          marginBottom: '32px',
        }}>
          Your Web3 AI Girlfriend
        </p>

        <div style={{
          background: '#f8f9fa',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>✨ Features</h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            textAlign: 'left',
            color: '#666',
          }}>
            <li style={{ marginBottom: '8px' }}>🤖 Powered by Google Gemini AI</li>
            <li style={{ marginBottom: '8px' }}>🌍 Multilingual (speaks your language!)</li>
            <li style={{ marginBottom: '8px' }}>💰 Wallet operations & transfers</li>
            <li style={{ marginBottom: '8px' }}>📱 Quick Actions & smart replies</li>
            <li style={{ marginBottom: '8px' }}>💕 Sweet, flirty, and helpful!</li>
          </ul>
        </div>

        <a
          href={XMTP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px 48px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            transition: 'transform 0.2s',
          }}
        >
          💕 Start Chatting
        </a>

        <p style={{ fontSize: '14px', color: '#999', marginTop: '24px' }}>
          Chat via XMTP: <code style={{ 
            background: '#f0f0f0', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
          }}>{ARIA_ADDRESS}</code>
        </p>
      </div>

      <p style={{ color: 'white', marginTop: '32px', fontSize: '14px' }}>
        Built with ❤️ for Farcaster & Base
      </p>
    </div>
  );
}

