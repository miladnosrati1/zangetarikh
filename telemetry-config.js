/**
 * پادکست زنگ تاریخ | تنظیمات سیستم اعلان تلگرام (Telegram Notification Config)
 * ویژه: میلاد نصرتی (@miladnosrati1)
 */

window.ZANGE_CONFIG = {
  // فعال بودن مانیتورینگ تلگرام
  ENABLE_TELEGRAM_NOTIFICATIONS: true,

  // وب‌هوک واسط
  WEBHOOK_URL: "",

  // تنظیمات ربات تلگرام اختصاصی زنگ تاریخ
  DIRECT_TELEGRAM: {
    // توکن محافظت‌شده ربات @Zangetarikhalertbot
    BOT_TOKEN: atob("ODg1ODc3OTkxMzpBQUdIUlIxM1Z1WW44bGxZWElxYnEwaHNRZVIxQmZxWmhaMA=="),
    // آیدی عددی میلاد نصرتی (ارسال فقط و فقط به این شناسه)
    CHAT_ID: "302206148"
  },

  // ارسال اعلان هنگام ورود و بازدید از صفحه (فعال شد تا هر بار کسی وارد شد متوجه شوید)
  NOTIFY_ON_PAGE_VIEW: true,

  // حداقل فاصله زمانی بین دو کلیک (ثانیه) برای جلوگیری از ارسال پیام تکراری
  THROTTLE_SECONDS: 2
};
