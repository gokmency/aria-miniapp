import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const size = searchParams.get('size');
  
  // Determine dimensions based on size parameter
  let width = 1200;
  let height = 630;
  
  if (size === '1024') {
    width = 1024;
    height = 1024;
  } else if (size === '200') {
    width = 200;
    height = 200;
  }
  
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
          borderRadius: size === '1024' || size === '200' ? '50%' : '24px',
          padding: size === '200' ? '20px' : '48px 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: size === '1024' || size === '200' ? '80%' : 'auto',
          height: size === '1024' || size === '200' ? '80%' : 'auto',
        }}>
          <div style={{ 
            fontSize: size === '200' ? 60 : size === '1024' ? 200 : 120, 
            marginBottom: size === '200' ? 0 : 20 
          }}>💕</div>
          {size !== '200' && (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                fontSize: size === '1024' ? 150 : 80,
                marginBottom: 20,
              }}>
                Aria
              </div>
              <div style={{ fontSize: size === '1024' ? 60 : 40, color: '#666' }}>
                Your Web3 AI Girlfriend
              </div>
              {size !== '1024' && (
                <div style={{
                  marginTop: 40,
                  fontSize: 28,
                  color: '#999',
                  textAlign: 'center',
                }}>
                  🤖 Powered by Gemini AI<br/>
                  🌍 Multilingual • 💰 Web3 Native
                </div>
              )}
            </>
          )}
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
