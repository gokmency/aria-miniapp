import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    "frame": {
      "name": "aria",
      "version": "1",
      "iconUrl": "https://aria-miniapp.vercel.app/icon.png",
      "homeUrl": "https://aria-miniapp.vercel.app",
      "imageUrl": "https://aria-miniapp.vercel.app/image.png",
      "splashImageUrl": "https://aria-miniapp.vercel.app/splash.png",
      "splashBackgroundColor": "#6200EA",
      "webhookUrl": "https://aria-miniapp.vercel.app/api/webhook",
      "subtitle": "your ai girlfriend knows everything about web3",
      "description": "your ai girlfriend knows everything about web3",
      "primaryCategory": "entertainment"
    },
    "accountAssociation": {
      "header": "eyJmaWQiOjU0OTc5MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGIzNDIwM0FBMTU5ZDFDZjgxQWRBNjM1MTAxZDJkNzRlRjI3RkYyRmUifQ",
      "payload": "eyJkb21haW4iOiJhcmlhLW1pbmlhcHAudmVyY2VsLmFwcCJ9",
      "signature": "NGnH5Sy5n3gzyyL/YYWhMyemaq1r53DHTuSMO4hPMZgaH7XYPvuEMC3d3jQqOHStLFoGi6V/tnTCfy5hj0oq8Bw="
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
