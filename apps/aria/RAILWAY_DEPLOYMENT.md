# Aria Agent - Railway Deployment Guide

## Railway'a Deploy Etme

### 1. Railway Hesabı Oluştur
- https://railway.app adresine git
- GitHub hesabınla giriş yap

### 2. Projeyi Bağla
- "New Project" butonuna tıkla
- "Deploy from GitHub repo" seçeneğini seç
- Bu repository'yi seç
- `apps/aria` klasörünü root directory olarak ayarla

### 3. Environment Variables Ayarla
Railway dashboard'da "Variables" sekmesine git ve şu değişkenleri ekle:

```bash
XMTP_WALLET_KEY=0x... # Agent private key
XMTP_DB_ENCRYPTION_KEY=... # Database encryption key
XMTP_ENV=production
NODE_ENV=production
LOG_LEVEL=info
```

### 4. Deploy Et
- Railway otomatik olarak deploy edecek
- Logs sekmesinden deployment'ı takip et
- "Deployments" sekmesinden durumu kontrol et

### 5. Domain Ayarla
- "Settings" sekmesine git
- "Domains" bölümünden custom domain ekleyebilirsin
- Railway otomatik HTTPS sağlar

## Environment Variables Açıklaması

| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `XMTP_WALLET_KEY` | Agent'ın private key'i | `0x1234...` |
| `XMTP_DB_ENCRYPTION_KEY` | Database şifreleme anahtarı | `abc123...` |
| `XMTP_ENV` | XMTP environment | `production` |
| `NODE_ENV` | Node.js environment | `production` |
| `LOG_LEVEL` | Log seviyesi | `info` |

## Monitoring

### Logs
- Railway dashboard'da "Logs" sekmesini kullan
- Real-time log takibi yapabilirsin
- Log levels: debug, info, warn, error

### Metrics
- CPU ve memory kullanımını takip et
- Network trafiğini izle
- Error rate'leri kontrol et

### Health Checks
- Railway otomatik health check yapar
- Agent çalışmıyorsa otomatik restart eder

## Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   - Railway dashboard'da Variables sekmesini kontrol et
   - Tüm gerekli değişkenlerin ayarlandığından emin ol

2. **Build Failures**
   - Logs sekmesinde build hatalarını kontrol et
   - `package.json` ve `tsconfig.json` dosyalarını kontrol et

3. **Runtime Errors**
   - Application logs'u kontrol et
   - XMTP connection'larını kontrol et

4. **Memory Issues**
   - Railway plan'ını upgrade et
   - Memory leak'leri kontrol et

## Production Checklist

- [ ] Environment variables ayarlandı
- [ ] Production build test edildi
- [ ] Logs düzgün çalışıyor
- [ ] Health checks geçiyor
- [ ] Domain ayarlandı (opsiyonel)
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi hazır

## Scaling

Railway otomatik scaling sağlar:
- CPU kullanımına göre instance sayısını artırır
- Memory kullanımını optimize eder
- Network trafiğine göre load balancing yapar

## Security

- Environment variables Railway'de şifrelenir
- HTTPS otomatik sağlanır
- Private keys asla log'larda görünmez
- Rate limiting aktif
