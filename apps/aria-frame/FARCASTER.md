# 🎯 Farcaster Mini App Setup

## 📝 Manifest Location

Farcaster requires the manifest at a specific location:
```
https://your-domain.com/.well-known/farcaster.json
```

Our manifest is accessible at:
```
https://aria-miniapp.vercel.app/.well-known/farcaster.json
```

## 🔗 Important URLs

| Endpoint | URL | Description |
|----------|-----|-------------|
| Manifest | `/.well-known/farcaster.json` | Main manifest file |
| Manifest API | `/api/manifest` | JSON API endpoint |
| Webhook | `/api/webhook` | Farcaster events receiver |
| Home | `/` | Main frame page |
| OG Image | `/api/image` | Open Graph image |

## 🎨 Required Assets

Place these files in `/public/`:

- `icon.png` (256x256) - App icon
- `image.png` (1200x630) - Preview image
- `splash.png` (1200x630) - Splash screen

## 🚀 Farcaster Submission

1. **Deploy to Vercel**
   - Push to GitHub
   - Vercel auto-deploys

2. **Verify Manifest**
   ```bash
   curl https://aria-miniapp.vercel.app/.well-known/farcaster.json
   ```

3. **Submit to Farcaster**
   - Go to: https://warpcast.com/~/developers
   - Register Mini App
   - Provide manifest URL
   - Wait for approval

## 📋 Manifest Contents

```json
{
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
    "header": "...",
    "payload": "...",
    "signature": "..."
  }
}
```

## 🔐 Account Association

The `accountAssociation` binds your domain to your Farcaster account (FID: 549790).

This proves you own both the domain and the Farcaster account.

## 🎉 What Happens Next?

Once approved by Farcaster:
1. ✅ App appears in Warpcast Apps menu
2. ✅ Users can install & launch Aria
3. ✅ Webhook receives user events
4. ✅ Full Mini App experience!

## 🧪 Testing

Test your manifest:
```bash
# Check manifest is accessible
curl https://aria-miniapp.vercel.app/.well-known/farcaster.json

# Check webhook is working
curl https://aria-miniapp.vercel.app/api/webhook

# View the frame
open https://aria-miniapp.vercel.app
```

## 📚 Resources

- [Farcaster Mini Apps Docs](https://docs.farcaster.xyz/developers/mini-apps)
- [Warpcast Developer Portal](https://warpcast.com/~/developers)
- [Farcaster Discord](https://discord.gg/farcaster)
