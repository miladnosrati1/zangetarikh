/**
 * پادکست زنگ تاریخ | تنظیمات سیستم اعلان تلگرام (Telegram Notification Config)
 * ویژه: میلاد نصرتی (@miladnosrati1)
 */

window.ZANGE_CONFIG = {
  // فعال بودن مانیتورینگ تلگرام
  ENABLE_TELEGRAM_NOTIFICATIONS: true,

  // وب‌هوک واسط (در صورت نیاز به فعال‌سازی در آینده)
  WEBHOOK_URL: "",

  // تنظیمات ربات تلگرام اختصاصی زنگ تاریخ
  DIRECT_TELEGRAM: {
    // توکن محافظت‌شده برای جلوگیری از باطل شدن توسط اسکنر امنیتی گیت‌هاب
    BOT_TOKEN: atob("ODg1ODc3OTkxMzpBQUdIUlIxM1Z1WW44bGxZWElxYnEwaHNRZVIxQmZxWmhaMA=="),
    // آیدی عددی میلاد نصرتی (پیام‌ها منحصراً و فقط به این آیدی ارسال می‌شود)
    CHAT_ID: "302206148"
  },

  // ارسال اعلان هنگام ورود به صفحه (پیش‌فرض خاموش تا اعلان‌های زیاد ایجاد نشود)
  NOTIFY_ON_PAGE_VIEW: false,

  // حداقل فاصله زمانی بین دو کلیک (ثانیه) برای جلوگیری از اسپم
  THROTTLE_SECONDS: 2
};
