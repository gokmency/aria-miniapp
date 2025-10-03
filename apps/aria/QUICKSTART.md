# 🚀 Aria Agent - Hızlı Başlangıç

## 1. Environment Ayarları

```bash
cd apps/aria
cp env.example .env
```

`.env` dosyasını düzenle:

```bash
# XMTP Agent Configuration
XMTP_WALLET_KEY=0x... # Buraya private key gerekli
XMTP_DB_ENCRYPTION_KEY=... # Random bir string
XMTP_ENV=dev # dev veya production

# Application Configuration
NODE_ENV=development
LOG_LEVEL=info
```

## 2. Anahtarları Oluştur

Eğer XMTP örnek projesini klonladıysan:

```bash
npm run gen:keys
```

Bu komut otomatik olarak `.env` dosyasını oluşturacak.

**VEYA** manuel olarak:

1. Private key için bir Ethereum cüzdanı oluştur (MetaMask, vb.)
2. Private key'i `XMTP_WALLET_KEY` olarak ekle
3. Encryption key için random bir string oluştur:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Development Modda Çalıştır

```bash
npm run dev
```

## 4. Test Et

### Dev Environment (xmtp.chat)

1. https://xmtp.chat adresine git
2. Cüzdanını bağla
3. Settings → Environment → **Dev** seç
4. Agent adresine (console'da gösterilir) mesaj gönder
5. Test mesajları:
   - `gm` - Selamlama
   - `/help` - Yardım menüsü
   - `split dinner $200 4 ways` - Hesap bölme
   - `/actions demo` - Quick Actions örneği

### Production (Base App)

1. `.env` dosyasında `XMTP_ENV=production` yap
2. Base App mobil uygulamasını aç
3. Messaging bölümünden agent adresine mesaj gönder

## 5. Production Build

```bash
npm run build
npm start
```

## 🔍 Sorun Giderme

### "Environment validation failed" Hatası
- `.env` dosyasının var olduğundan emin ol
- Tüm zorunlu alanların dolu olduğunu kontrol et

### "Logger not initialized" Hatası
- Agent'ın düzgün başlatıldığından emin ol
- Console'da "Aria agent started" mesajını gör

### Agent cevap vermiyor
- **DM'lerde**: Her mesaja cevap vermeli
- **Gruplarda**: Sadece `@aria` mention veya reply'da cevap verir

## 📱 Komutlar

- `/help` - Yardım menüsü
- `/about` - Aria hakkında
- `pay $<miktar> to <kişi>` - Ödeme (demo)
- `split <açıklama> $<miktar> <n> ways` - Hesap böl
- `/actions demo` - Quick Actions örneği
- `/attachments demo` - Dosya örneği

## 🎯 Sonraki Adımlar

1. ✅ Lokal test
2. 🔄 Basename al (base.org/names)
3. 🚀 Railway'e deploy et (RAILWAY_DEPLOYMENT.md)
4. 📝 Base App submission formu doldur

Başarılar! 🎉

