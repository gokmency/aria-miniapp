import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Farcaster webhook received:', body);
    
    // Farcaster event'lerini handle et
    const { type, data } = body;
    
    switch (type) {
      case 'frame.opened':
        console.log('Aria frame opened by user:', data?.fid);
        break;
      case 'frame.closed':
        console.log('Aria frame closed by user:', data?.fid);
        break;
      case 'frame.button_clicked':
        console.log('Button clicked:', data?.button);
        break;
      default:
        console.log('Unknown event type:', type);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'Aria Farcaster Webhook',
    timestamp: new Date().toISOString()
  });
}
