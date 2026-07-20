# Zamlandı — bekleme listesi sitesi

Abonelik zam takip fikrini insanlara anlatan ve gerçekten isteyen olup olmadığını
e-posta toplayarak ölçen bir doğrulama (landing page) sitesi. Hiçbir API anahtarı
gerektirmez.

## Kurulum ve çalıştırma

```bash
cd zamlandi
npm install
npm start
```

Sunucu http://localhost:3000 adresinde çalışır.

## Nasıl çalışıyor

- `public/index.html` — fikri anlatan, e-posta toplayan tek sayfalık site.
- `server.js` — `/api/waitlist` ile gelen e-postaları doğrular, tekrar edenleri
  ayıklar, `data/waitlist.json` dosyasına kaydeder. `/api/waitlist/count` ile
  kaçtı kişinin listede olduğunu gösterir (sosyal kanıt için, gerçek sayı).

## Sırada ne var

Bu site sadece **fikri doğrulamak** için. Yeterince e-posta toplanırsa (ör. 50-100
kişi), gerçek ürünün ilk sürümünü (kullanıcı girişi, abonelik ekleme, fiyat geçmişi,
hatırlatmalar) konuşup kurabiliriz.

## Notlar

- `data/waitlist.json` kişisel veri (e-posta) içerir, `.gitignore` ile versiyon
  kontrolü dışında tutuldu.
- Toplanan e-postaları başka bir amaçla kullanmadan önce (ör. toplu e-posta
  gönderimi), KVKK kapsamında açık rıza metni eklemen gerekir.
