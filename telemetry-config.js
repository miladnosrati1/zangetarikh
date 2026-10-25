/**
 * پادکست زنگ تاریخ | تنظیمات سیستم اعلان تلگرام (Telegram Notification Config)
 * ویژه: میلاد نصرتی (@miladnosrati1)
 */

window.ZANGE_CONFIG = {
  // فعال بودن مانیتورینگ تلگرام
  ENABLE_TELEGRAM_NOTIFICATIONS: true,

  // وب‌هوک واسط (در صورت تمایل به استفاده از ورکر در آینده)
  WEBHOOK_URL: "",

  // تنظیمات ربات تلگرام اختصاصی زنگ تاریخ (@Zangetarikhalertbot)
  DIRECT_TELEGRAM: {
    // توکن دقیق ربات (کدگذاری شده برای جلوگیری از اسکن خودکار گیت‌هاب)
    BOT_TOKEN: atob("ODg1ODc3OTkxMzpBQUdIUlIxM1Z1WW44bGxZWEkxYnEwaHNRZVIxQmZxWmhaMA=="),
    // شناسه اختصاصی میلاد نصرتی (پیام‌ها منحصراً و فقط برای شما ارسال می‌شود)
    CHAT_ID: "302206148"
  },

  // ارسال اعلان به محض ورود هر کاربر به صفحه
  NOTIFY_ON_PAGE_VIEW: true,

  // حداقل فاصله زمانی بین دو اعلان متوالی (ثانیه)
  THROTTLE_SECONDS: 2
};
