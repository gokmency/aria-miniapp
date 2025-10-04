import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 120, marginBottom: 20 }}>💕</div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 80,
            marginBottom: 20,
          }}>
            Aria
          </div>
          <div style={{ fontSize: 40, color: '#666' }}>
            Your Web3 AI Girlfriend
          </div>
          <div style={{
            marginTop: 40,
            fontSize: 28,
            color: '#999',
            textAlign: 'center',
          }}>
            🤖 Powered by Gemini AI<br/>
            🌍 Multilingual • 💰 Web3 Native
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

