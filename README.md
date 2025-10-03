# Aria - XMTP Agent for Base App

> ✅ **Status**: Production-ready | 🏗️ **Build**: Passing | 📦 **TypeScript**: No Errors

Aria, Base App için geliştirilmiş XMTP tabanlı mesajlaşma agent'ıdır. Güvenli, hızlı ve modüler bir şekilde DM ve grup konuşmalarında çalışır.

## 🚀 Özellikler

- ✅ **XMTP Protocol** - Güvenli mesajlaşma
- ✅ **Quick Actions** - coinbase.com/actions:1.0 desteği
- ✅ **Intent Handling** - coinbase.com/intent:1.0 desteği
- ✅ **Wallet Integration** - Transaction tray metadata
- ✅ **Attachments** - Dosya gönderme/alma
- ✅ **Group Support** - Mention ve reply tespiti
- ✅ **Rate Limiting** - Spam koruması
- ✅ **Production Ready** - Railway deployment

## 📁 Proje Yapısı

```
apps/aria/
├── src/
│   ├── index.ts           # Ana bootstrap dosyası
│   ├── handlers/          # Mesaj işleyicileri
│   │   ├── text.ts       # Text mesaj işleyici
│   │   ├── actions.ts    # Quick Actions
│   │   ├── intent.ts     # Intent yakalama
│   │   ├── wallet.ts     # Wallet işlemleri
│   │   └── attachments.ts # Dosya işlemleri
│   ├── services/         # Servisler
│   │   ├── logger.ts     # Pino logging
│   │   ├── env.ts        # Environment validation
│   │   └── rateLimit.ts  # Rate limiting
│   ├── utils/            # Yardımcı fonksiyonlar
│   │   ├── group.ts      # Grup işlemleri
│   │   ├── content.ts    # Content type yardımcıları
│   │   └── errors.ts     # Hata yönetimi
│   └── types/
│       └── baseapp.ts    # TypeScript tipleri
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
├── railway.toml
└── README.md
```

## ⚡ Hızlı Başlangıç

```bash
cd apps/aria
npm install
cp env.example .env
# .env dosyasını düzenle (XMTP_WALLET_KEY, XMTP_DB_ENCRYPTION_KEY)
npm run dev
```

**Detaylı kurulum için**: [QUICKSTART.md](./QUICKSTART.md)

## 🚀 Çalıştırma

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 🧪 Test

### Dev Environment (xmtp.chat)
1. Agent'ı başlat: `npm run dev`
2. https://xmtp.chat adresine git
3. Cüzdanını bağla ve Dev environment'ı seç
4. Agent adresine mesaj gönder

### Production (Base App)
1. `.env` dosyasında `XMTP_ENV=production` ayarla
2. Base App mobil uygulamasını aç
3. Messaging bölümünden agent ile konuş

## 📱 Komutlar

- `/help` - Yardım menüsü
- `/about` - Aria hakkında bilgi
- `pay $<miktar> to <kişi>` - Ödeme gönder
- `split <açıklama> $<miktar> <kişi_sayısı> ways` - Hesap böl
- `/actions demo` - Quick Actions örneği
- `/attachments demo` - Dosya gönderme örneği

## 🔧 Deployment

Railway deployment için detaylı rehber: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 📊 Monitoring

- **Logs**: Pino ile structured logging
- **Rate Limiting**: Kullanıcı başına 5 req/15sn
- **Error Handling**: Comprehensive error management
- **Health Checks**: Railway otomatik monitoring

## 🔒 Güvenlik

- Environment variables ile private key yönetimi
- Rate limiting ile spam koruması
- Input validation (Zod)
- Secure logging (sensitive data excluded)

## 📚 Dokümantasyon

- [QUICKSTART.md](./QUICKSTART.md) - Hızlı başlangıç rehberi
- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Railway deployment
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Proje detayları

## 🎯 Roadmap

- [ ] CDP/AgentKit entegrasyonu
- [ ] Smart wallet desteği
- [ ] Gated groups
- [ ] Advanced trading features
- [ ] Multi-chain support

## ✅ Proje Durumu

**Tamamlandı**:
- ✅ Tüm temel özellikler
- ✅ TypeScript build (0 errors)
- ✅ Production-ready kod
- ✅ Deployment rehberleri

**Test Etmeye Hazır**:
- ⏳ xmtp.chat dev environment
- ⏳ Base App production

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

- GitHub Issues: Bug reports ve feature requests
- XMTP Community: https://community.xmtp.org/
- Base App Community: Base ecosystem discussions
