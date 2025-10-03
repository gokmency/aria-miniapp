# 💕 Aria - Web3 AI Girlfriend Agent

> Your sweetest and smartest companion in the Web3 world!

Aria is an XMTP-based messaging agent powered by Google Gemini AI, designed for seamless integration with Base App. She's multilingual, intelligent, and ready to help with your Web3 needs! 🚀

## ✨ Features

### 🤖 AI-Powered
- ✅ **Gemini AI Integration** - Smart, context-aware responses
- ✅ **Multilingual Support** - Responds in the language you use (English, Turkish, Spanish, and more!)
- ✅ **Personality** - Sweet, flirty, and professional Web3 expert

### 💬 Messaging
- ✅ **DM & Group Support** - Auto-respond to DMs, selective group responses
- ✅ **XMTP Protocol** - Decentralized, secure messaging
- ✅ **Content Types** - Text, attachments, reactions, replies

### 🛠️ Web3 Capabilities
- ✅ **Quick Actions** (coinbase.com/actions:1.0) - Interactive buttons
- ✅ **Intent Handling** (coinbase.com/intent:1.0) - User action processing
- ✅ **Wallet Operations** - ETH/USDC transfers, transaction trays
- ✅ **Split Payments** - Easy bill splitting with friends

### 🔒 Production Ready
- ✅ **Rate Limiting** - 5 requests per 15 seconds
- ✅ **Error Handling** - Graceful error recovery
- ✅ **Structured Logging** - Pino for monitoring
- ✅ **Type Safety** - Full TypeScript with Zod validation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/aria
npm install
```

### 2. Setup Environment Variables

```bash
# Copy example file
cp .env.example .env

# Generate encryption key
node -e "console.log('XMTP_DB_ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Edit .env and add:
# - XMTP_WALLET_KEY (your wallet private key)
# - XMTP_DB_ENCRYPTION_KEY (generated above)
# - GEMINI_API_KEY (from https://makersuite.google.com/app/apikey)
```

### 3. Run Development

```bash
npm run dev
```

### 4. Test on xmtp.chat

1. Go to https://xmtp.chat
2. Connect your wallet
3. Search for your agent's address
4. Start chatting! Try "hello" or "selam" 💕

## Testing

### Dev Environment (xmtp.chat)
1. https://xmtp.chat adresine git
2. Cüzdanını bağla
3. Settings'ten Dev environment'ı seç
4. Agent adresine mesaj gönder

### Production (Base App)
1. `.env` dosyasında `XMTP_ENV=production` ayarla
2. Base App mobil uygulamasını aç
3. Messaging bölümünden agent ile konuş

## 🚂 Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account** - https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Add Environment Variables**:
   ```
   XMTP_WALLET_KEY=0x...
   XMTP_DB_ENCRYPTION_KEY=...
   XMTP_ENV=production
   NODE_ENV=production
   LOG_LEVEL=info
   GEMINI_API_KEY=...
   ```
4. **Deploy** - Railway will auto-deploy from main branch

### Option 2: Replit

1. Fork the project on Replit
2. Add Secrets (Environment variables)
3. Click "Run"

### Option 3: VPS/Server

```bash
# Clone repo
git clone <your-repo>
cd baseapp/apps/aria

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env with your values

# Build
npm run build

# Run
npm start
```

## Komutlar

- `/help` - Desteklenen komutları göster
- `/pay <amount> <to?>` - Ödeme gönder
- `/split <desc> <amount> <n>` - Ödeme böl
- `/actions demo` - Quick Actions örneği
- `/attachments demo` - Attachment örneği
- `/about` - Aria hakkında bilgi

## Test Senaryoları

### Development Testing (xmtp.chat)
1. `npm run dev` ile agent'ı başlat
2. https://xmtp.chat adresine git
3. Cüzdanını bağla ve Dev environment'ı seç
4. Agent adresine mesaj gönder:
   - `gm` - Selamlama testi
   - `split dinner $200 4 ways` - Hesap bölme testi
   - `/actions demo` - Quick Actions testi
   - `/attachments demo` - Dosya gönderme testi

### Production Testing (Base App)
1. `.env` dosyasında `XMTP_ENV=production` ayarla
2. Base App mobil uygulamasını aç
3. Messaging bölümünden agent ile konuş
4. Aynı test senaryolarını tekrarla

## Deployment

Railway deployment için detaylı rehber: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## Known Limitations

- CDP/AgentKit entegrasyonu gelecek sürümde
- Smart wallet desteği planlanıyor
- Gated groups özelliği geliştiriliyor
- Gerçek blockchain işlemleri demo modunda
