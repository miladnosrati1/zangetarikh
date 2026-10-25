/**
 * پادکست «زنگ تاریخ» | Zangetarikh Podcast
 * تعاملات، انیمیشن ذرات معلق طلایی، پخش‌کننده کست‌باکس و مانیتورینگ تلگرام
 */

(function () {
  'use strict';

  // ==========================================
  // ۱. سیستم ذرات معلق طلایی (Golden Dust Canvas)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // تعداد ذرات بر اساس عرض صفحه (برای عملکرد بی‌نقص روی گوشی‌ها)
    const particleCount = width < 600 ? 35 : 60;

    class GoldParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.2 + 0.6; // اندازه ذره
        this.speedY = Math.random() * 0.45 + 0.15; // سرعت صعود ملایم
        this.speedX = (Math.random() - 0.5) * 0.25; // نوسان عرضی
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 + 0.005;
        this.alpha = Math.random() * 0.6 + 0.2; // شفافیت پایه
        this.maxAlpha = this.alpha;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.angle += this.angleSpeed;
        this.x += Math.sin(this.angle) * 0.35 + this.speedX;

        // تپش ملایم درخشش
        this.pulseAngle += this.pulseSpeed;
        this.alpha = (Math.sin(this.pulseAngle) * 0.3 + 0.7) * this.maxAlpha;

        // بازگشت ذره وقتی از بالای صفحه خارج می‌شود
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // گرادیان ملایم درخشان طلایی
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 238, 170, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${this.alpha * 0.7})`);
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = this.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new GoldParticle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    // بهینه‌سازی باتری و منابع: توقف هنگام خارج شدن از تب مرورگر
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animateParticles();
      }
    });

    initParticles();
    animateParticles();
  }

  // ==========================================
  // ۲. نوای صوتی زنگ تاریخی با Web Audio API
  // ==========================================
  let audioCtx = null;
  let isSoundEnabled = false;
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconActive = document.getElementById('sound-icon-active');
  const soundIconMuted = document.getElementById('sound-icon-muted');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // شبیه‌سازی زنگ باستانی و کاسه تبتی (Harmonic Chime Synthesizer)
  function playAncientChime(freq = 432) {
    if (!audioCtx || !isSoundEnabled) return;
    try {
      const now = audioCtx.currentTime;

      // ساخت دو نوسان‌ساز برای تولید صدای عمیق و طنین‌انداز زنگ
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now); // فرکانس پایه زنگ

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now); // هارمونیک پنجم

      // منحنی محو شدن آرام صدا (Long Bell Decay)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.8);
      osc2.stop(now + 2.8);
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;

      if (isSoundEnabled) {
        soundIconActive.style.display = 'block';
        soundIconMuted.style.display = 'none';
        soundToggleBtn.setAttribute('title', 'قطع نوای پس‌زمینه');
        showToast('نوای زنگ تاریخی فعال شد 🔔');
        playAncientChime(432);
      } else {
        soundIconActive.style.display = 'none';
        soundIconMuted.style.display = 'block';
        soundToggleBtn.setAttribute('title', 'پخش نوای تاریخی');
        showToast('صدا غیرفعال شد');
      }
    });
  }

  // ==========================================
  // ۳. اشتراک‌گذاری صفحه و کپی لینک (Share API)
  // ==========================================
  const shareBtn = document.getElementById('share-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotice || !toastText) return;
    toastText.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (isSoundEnabled) playAncientChime(528);
      trackEvent('اشتراک‌گذاری صفحه', window.location.href);

      const shareData = {
        title: 'پادکست زنگ تاریخ | میلاد نصرتی',
        text: 'شنیدن روایتی جذاب از ریشه‌ها و رازهای تاریخ در پادکست زنگ تاریخ',
        url: window.location.href,
      };

      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        try {
          await navigator.share(shareData);
          showToast('با موفقیت به اشتراک گذاشته شد ✨');
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard(window.location.href);
          }
        }
      } else {
        copyToClipboard(window.location.href);
      }
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('لینک پادکست کپی شد! 📋');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('لینک پادکست کپی شد! 📋');
    } catch (e) {
      showToast('امکان کپی خودکار فراهم نشد');
    }
    document.body.removeChild(tempInput);
  }

  // ==========================================
  // ۴. مدیریت پخش‌کننده کست‌باکس (Castbox In-App Player)
  // ==========================================
  const togglePlayerBtn = document.getElementById('toggle-player-btn');
  const castboxWrapper = document.getElementById('castbox-iframe-wrapper');
  const playerToggleText = document.getElementById('player-toggle-text');

  if (togglePlayerBtn && castboxWrapper) {
    togglePlayerBtn.addEventListener('click', () => {
      if (isSoundEnabled) playAncientChime(460);
      const isCurrentlyCollapsed = castboxWrapper.classList.contains('collapsed');

      if (isCurrentlyCollapsed) {
        castboxWrapper.classList.remove('collapsed');
        togglePlayerBtn.classList.remove('collapsed');
        togglePlayerBtn.setAttribute('aria-expanded', 'true');
        if (playerToggleText) playerToggleText.textContent = 'بستن پلیر';
        trackEvent('باز کردن پلیر کست‌باکس', 'In-App Castbox Player');
      } else {
        castboxWrapper.classList.add('collapsed');
        togglePlayerBtn.classList.add('collapsed');
        togglePlayerBtn.setAttribute('aria-expanded', 'false');
        if (playerToggleText) playerToggleText.textContent = 'نمایش پلیر';
      }
    });
  }

  // ==========================================
  // ۵. گردونه حکمت و نقل‌قول‌های تاریخی
  // ==========================================
  const historicalQuotes = [
    {
      text: '«تاریخ تکرار نمی‌شود، اما اغلب هم‌آهنگ و هم‌قافیه پیش می‌رود.»',
      author: 'مارک تواین'
    },
    {
      text: '«تمدن‌ها از درون فرو می‌ریزند، پیش از آنکه از بیرون فتح شوند.»',
      author: 'ویل دورانت'
    },
    {
      text: '«گذشته چراغ راه آینده است؛ آن کس که گذشته را به یاد نسپارد، محکوم به زیستن در تاریکی است.»',
      author: 'ابن خلدون'
    },
    {
      text: '«جهان یادگار است و ما رفتنی؛ به گیتی نماند به جز مردمی.»',
      author: 'فردوسی بزرگ'
    },
    {
      text: '«تاریخ، داستان جست‌وجوی بی‌پایان انسان برای درک کیستی و سرنوشت خویش است.»',
      author: 'آرنولد توین‌بی'
    },
    {
      text: '«هرگز فراموش مکن از کجا آمده‌ای، تا بدانی به کدامین سو رهسپاری.»',
      author: 'کوروش بزرگ'
    }
  ];

  let currentQuoteIndex = 0;
  const quoteTextElem = document.getElementById('quote-text');
  const quoteAuthorElem = document.getElementById('quote-author');
  const refreshQuoteBtn = document.getElementById('refresh-quote-btn');

  function renderQuote(index) {
    if (!quoteTextElem || !quoteAuthorElem) return;
    
    quoteTextElem.style.opacity = '0';
    quoteAuthorElem.style.opacity = '0';
    
    setTimeout(() => {
      const q = historicalQuotes[index];
      quoteTextElem.textContent = q.text;
      quoteAuthorElem.textContent = `— ${q.author}`;
      quoteTextElem.style.opacity = '1';
      quoteAuthorElem.style.opacity = '1';
    }, 200);
  }

  if (refreshQuoteBtn) {
    refreshQuoteBtn.addEventListener('click', () => {
      if (isSoundEnabled) playAncientChime(576);
      currentQuoteIndex = (currentQuoteIndex + 1) % historicalQuotes.length;
      renderQuote(currentQuoteIndex);
    });
  }

  // ==========================================
  // ۶. اسکرول به بالای صفحه (Back to Top)
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isSoundEnabled) playAncientChime(648);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // ۷. ماژول مانیتورینگ و ارسال نوتیفیکیشن تلگرام
  // ==========================================
  const pageLoadTime = Date.now();
  let lastTrackTime = 0;

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'موبایل (iOS / iPhone)';
    if (/Android/.test(ua)) return 'موبایل (Android)';
    if (/Windows/.test(ua)) return 'رایانه (Windows)';
    if (/Macintosh/.test(ua)) return 'رایانه (macOS / Mac)';
    if (/Linux/.test(ua)) return 'رایانه (Linux)';
    return 'سایر دستگاه‌ها';
  }

  function getReferrerSource() {
    const ref = document.referrer;
    if (!ref) return 'مستقیم / بیو اینستاگرام';
    if (ref.includes('instagram.com')) return 'اینستاگرام (Instagram)';
    if (ref.includes('t.me') || ref.includes('telegram')) return 'تلگرام (Telegram)';
    if (ref.includes('google.com')) return 'جستجوی گوگل';
    if (ref.includes('youtube.com')) return 'یوتیوب (YouTube)';
    return ref;
  }

  function getTehranTime() {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Asia/Tehran'
      }).format(new Date());
    } catch (e) {
      return new Date().toLocaleTimeString('fa-IR');
    }
  }

  function trackEvent(title, url, eventType = 'click') {
    const config = window.ZANGE_CONFIG;
    if (!config || !config.ENABLE_TELEGRAM_NOTIFICATIONS) return;

    // کنترل عدم ارسال رگباری (Throttle)
    const now = Date.now();
    const throttleMs = (config.THROTTLE_SECONDS || 2) * 1000;
    if (now - lastTrackTime < throttleMs) return;
    lastTrackTime = now;

    const durationSeconds = Math.round((now - pageLoadTime) / 1000);
    const payload = {
      eventType: eventType,
      title: title,
      url: url,
      device: getDeviceType(),
      referrer: getReferrerSource(),
      duration: durationSeconds,
      time: getTehranTime()
    };

    // روش ۱: استفاده از وب‌هوک واسط (Google Apps Script یا Cloudflare Worker)
    if (config.WEBHOOK_URL && config.WEBHOOK_URL.trim().length > 10) {
      try {
        const payloadString = JSON.stringify(payload);
        // استفاده از sendBeacon برای اطمینان از ارسال حتی در صورت خروج سریع از صفحه
        if (navigator.sendBeacon) {
          const blob = new Blob([payloadString], { type: 'application/json' });
          navigator.sendBeacon(config.WEBHOOK_URL, blob);
        } else {
          fetch(config.WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: payloadString,
            keepalive: true
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Webhook notification error:', err);
      }
      return;
    }

    // روش ۲: ارسال مستقیم به API تلگرام (در صورت تنظیم BOT_TOKEN و CHAT_ID)
    const direct = config.DIRECT_TELEGRAM;
    if (direct && direct.BOT_TOKEN && direct.CHAT_ID) {
      try {
        const messageText = `🔔 <b>کلیک جدید روی لینک‌های زنگ تاریخ!</b>\n\n` +
                            `🎯 <b>بخش:</b> ${title}\n` +
                            `🔗 <b>مقصد:</b> ${url}\n` +
                            `📱 <b>دستگاه:</b> ${payload.device}\n` +
                            `🌐 <b>ورودی از:</b> ${payload.referrer}\n` +
                            `⏱️ <b>حضور در صفحه:</b> ${durationSeconds} ثانیه\n` +
                            `📅 <b>زمان:</b> ${payload.time}`;

        const telegramApiUrl = `https://api.telegram.org/bot${direct.BOT_TOKEN}/sendMessage`;
        fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: direct.CHAT_ID,
            text: messageText,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }),
          keepalive: true
        }).catch(() => {});
      } catch (err) {
        console.warn('Direct telegram notification error:', err);
      }
    }
  }

  // اتصال شنونده کلیک به تمام لینک‌ها و کارت‌ها
  const trackedLinks = document.querySelectorAll('a[data-track-name], .link-card, .youtube-spotlight-card, .ep-btn-listen');
  trackedLinks.forEach((elem) => {
    elem.addEventListener('click', () => {
      if (isSoundEnabled) playAncientChime(480);
      const title = elem.getAttribute('data-track-name') || elem.querySelector('.link-title')?.textContent?.trim() || elem.textContent?.trim() || 'لینک ناشناس';
      const url = elem.getAttribute('href') || '-';
      trackEvent(title, url, 'click');
    });
  });

  // ثبت بازدید کلی صفحه (در صورت فعال بودن در تنظیمات)
  if (window.ZANGE_CONFIG && window.ZANGE_CONFIG.NOTIFY_ON_PAGE_VIEW) {
    setTimeout(() => {
      trackEvent('بازدید از صفحه لندینگ', window.location.href, 'page_view');
    }, 1500);
  }

  // افکت اولیه برای نقل‌قول
  renderQuote(0);

})();
