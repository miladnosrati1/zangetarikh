/**
 * کد واسط رایگان گوگل (Google Apps Script) برای ارسال نوتیفیکیشن کلیک‌ها به تلگرام
 * 
 * نحوه راه‌اندازی (فقط ۱ دقیقه):
 * ۱. به آدرس https://script.google.com بروید و با جیمیل خود وارد شوید.
 * ۲. روی دکمه "New project" (پروژه جدید) کلیک کنید.
 * ۳. کدهای موجود در ادیتور را پاک کرده و تمام کدهای این فایل را در آن کپی کنید.
 * ۴. متغیرهای BOT_TOKEN و CHAT_ID را با مشخصات ربات خود در زیر پر کنید.
 * ۵. از گوشه بالا سمت راست روی دکمه "Deploy" و سپس "New deployment" کلیک کنید.
 * ۶. چرخ‌دنده (Select type) را بزنید و "Web app" را انتخاب کنید:
 *    - Description: Zangetarikh Notifier
 *    - Execute as: Me (ایمیل شما)
 *    - Who has access: Anyone (هر کسی)
 * ۷. روی دکمه "Deploy" کلیک کنید و دسترسی‌های لازم را تایید فرمایید.
 * ۸. آدرس "Web app URL" داده‌شده را کپی کنید و در فایل telemetry-config.js در بخش WEBHOOK_URL قرار دهید.
 */

// توکن ربات تلگرام خود که از @BotFather دریافت کرده‌اید
const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";

// آیدی عددی چت شما در تلگرام (از @userinfobot می‌توانید بگیرید)
const CHAT_ID = "YOUR_CHAT_ID_HERE";

function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter || {};
    }

    const eventType = payload.eventType || "کلیک روی لینک";
    const title = payload.title || "لینک ناشناس";
    const url = payload.url || "-";
    const referrer = payload.referrer || "مستقیم / بیو";
    const device = payload.device || "نامشخص";
    const time = payload.time || new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" });
    const duration = payload.duration ? `${payload.duration} ثانیه` : "بلافاصله";

    // ساخت پیام جذاب تلگرامی
    let message = "";
    if (eventType === "page_view") {
      message = "👁️ <b>بازدید جدید از لندینگ‌پیج زنگ تاریخ!</b>\n\n" +
                `📱 <b>دستگاه:</b> ${device}\n` +
                `🌐 <b>ورودی از:</b> ${referrer}\n` +
                `📅 <b>زمان:</b> ${time}`;
    } else {
      message = "🔔 <b>کلیک جدید روی لینک‌های زنگ تاریخ!</b>\n\n" +
                `🎯 <b>بخش:</b> ${title}\n` +
                `🔗 <b>آدرس مقصد:</b> ${url}\n` +
                `📱 <b>دستگاه:</b> ${device}\n` +
                `🌐 <b>ورودی از:</b> ${referrer}\n` +
                `⏱️ <b>حضور در صفحه:</b> ${duration}\n` +
                `📅 <b>زمان:</b> ${time}`;
    }

    sendTelegramMessage(message);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "online", service: "Zangetarikh Telegram Notifier" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendTelegramMessage(text) {
  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(telegramUrl, options);
}
