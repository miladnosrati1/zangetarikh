/**
 * کد واسط Cloudflare Worker برای ارسال اعلان کلیک‌ها به تلگرام
 * 
 * نحوه راه‌اندازی در کلودفلر:
 * ۱. در داشبورد Cloudflare به بخش Workers & Pages رفته و یک ورکر جدید بسازید.
 * ۲. کدهای این فایل را در آن جایگزین کنید.
 * ۳. در بخش Settings > Variables، متغیرهای محیطی زیر را ست کنید (یا مستقیماً در کد بنویسید):
 *    - BOT_TOKEN: توکن ربات تلگرام
 *    - CHAT_ID: آیدی چت تلگرام
 * ۴. آدرس Worker URL خود (مثلاً https://zangetarikh-bot.workers.dev) را در telemetry-config.js قرار دهید.
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "online" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const data = await request.json();
      const botToken = env.BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";
      const chatId = env.CHAT_ID || "YOUR_CHAT_ID_HERE";

      const title = data.title || "لینک ناشناس";
      const url = data.url || "-";
      const referrer = data.referrer || "مستقیم / بیو";
      const device = data.device || "نامشخص";
      const duration = data.duration ? `${data.duration} ثانیه` : "بلافاصله";
      const time = data.time || new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" });

      let text = "🔔 <b>کلیک جدید روی لینک‌های زنگ تاریخ!</b>\n\n" +
                 `🎯 <b>بخش:</b> ${title}\n` +
                 `🔗 <b>آدرس مقصد:</b> ${url}\n` +
                 `📱 <b>دستگاه:</b> ${device}\n` +
                 `🌐 <b>ورودی از:</b> ${referrer}\n` +
                 `⏱️ <b>حضور در صفحه:</b> ${duration}\n` +
                 `📅 <b>زمان:</b> ${time}`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      });

      return new Response(JSON.stringify({ status: "success" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
