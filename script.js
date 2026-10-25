/**
 * پادکست «زنگ تاریخ» | Zangetarikh Podcast
 * تعاملات، انیمیشن ذرات معلق طلایی، سربرگ‌های دسته‌بندی، حباب‌های موضوعی و مانیتورینگ تلگرام
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

    // تعداد ذرات متناسب با عرض صفحه
    const particleCount = width < 600 ? 35 : 60;

    class GoldParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = Math.random() * 0.45 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 + 0.005;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.maxAlpha = this.alpha;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.angle += this.angleSpeed;
        this.x += Math.sin(this.angle) * 0.35 + this.speedX;

        this.pulseAngle += this.pulseSpeed;
        this.alpha = (Math.sin(this.pulseAngle) * 0.3 + 0.7) * this.maxAlpha;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
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
  // ۲. اشتراک‌گذاری صفحه و کپی لینک (Share API)
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
  // ۴. مدیریت سیستم سربرگ‌ها (Segmented Tabs)
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === targetTabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      const isTarget = pane.id === `pane-${targetTabId}`;
      pane.classList.toggle('active', isTarget);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // ==========================================
  // ۵. حباب‌های تعاملی موضوعات پادکست زنگ تاریخ
  // ==========================================
  const topicsData = {
    'civilization': {
      emoji: '🏛️',
      title: 'تمدن‌های کهن و میان‌رودان',
      subtitle: 'فصل اول و دوم پادکست زنگ تاریخ',
      desc: 'در زنگ تاریخ ما روایت را از نقطه صفرِ زمان آغاز کردیم؛ از تکامل انسان و گذر از دوران پارینه‌سنگی به انقلاب کشاورزی و پیدایش نخستین سکونت‌گاه‌های تاریخ در خاور نزدیک. سپس شکوه تمدن‌های میان‌رودان (سومر، اکد، بابل، آشور، عیلامیان و دره سند)، پیدایش خط میخی، نخستین قانون‌نامه‌ها و رازهای ناگفته شهرهای باستانی را با جزئیات جذاب و مستند واکاوی کردیم.',
      tabTarget: 'stream'
    },
    'ancient-iran': {
      emoji: '👑',
      title: 'شکوه تاریخ ایران باستان',
      subtitle: 'فصل سوم، چهارم و پنجم پادکست زنگ تاریخ',
      desc: 'روایتی موشکافانه، مستند و بدون تعصب از هویت و سرگذشت فلات ایران؛ از اتحاد قبایل ماد تا تشکیل نخستین امپراتوری چندفرهنگی تاریخ توسط کوروش بزرگ هخامنشی و نظام کشورداری داریوش. سپس تحلیل دوران هلنیستی و سلوکیان و نبردهای شکوهمند اشکانیان و پارت‌ها در برابر امپراتوری روم باستان و استقامت بی‌بدیل ایرانیان.',
      tabTarget: 'stream'
    },
    'myths': {
      emoji: '📜',
      title: 'اساطیر، آیین‌ها و ناگفته‌ها',
      subtitle: 'مرز باریک میان افسانه و حقیقت در تاریخ',
      desc: 'تفکیک واقعیت‌های مستند تاریخی از افسانه‌پردازی‌ها و باورهای عامیانه؛ رازگشایی از جشن‌ها و آیین‌های کهن ملی ایرانیان (مانند فلسفه پیدایش شب یلدا و مهرگان)، روان‌شناسی حاکمان باستان، زندگی روزمره مردم عادی، جایگاه زنان در ایران باستان و زوایای پنهان تاریخ که کمتر در متون عمومی بازگو شده‌اند.',
      tabTarget: 'stream'
    },
    'independent': {
      emoji: '🎙️',
      title: 'روایتگری مستقل و تحلیلی',
      subtitle: 'پژوهش و اجرای میلاد نصرتی با تکیه بر اسناد معتبر',
      desc: 'پادکست زنگ تاریخ به دور از تعصبات ایدئولوژیک، شعارزدگی یا نگاه گزینشی تولید می‌شود. تمامی اپیزودها بر پایه کتیبه‌های کشف‌شده، داده‌های نوین باستان‌شناسی و پژوهش‌های مورخان و ایران‌شناسان برجسته جهان تدوین شده‌اند تا چراغی روشنگر برای درک ریشه‌های دیروز و فهم مسائل امروز ما باشد.',
      tabTarget: 'stream'
    }
  };

  const topicModalOverlay = document.getElementById('topic-modal-overlay');
  const modalIconBadge = document.getElementById('modal-icon-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBodyDesc = document.getElementById('modal-body-desc');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBtnCloseSecondary = document.getElementById('modal-btn-close-secondary');
  const modalBtnExplore = document.getElementById('modal-btn-explore');

  let currentModalTabTarget = 'stream';

  function openTopicModal(topicKey) {
    const data = topicsData[topicKey];
    if (!data || !topicModalOverlay) return;

    modalIconBadge.textContent = data.emoji;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalBodyDesc.textContent = data.desc;
    currentModalTabTarget = data.tabTarget || 'stream';

    topicModalOverlay.classList.add('open');
    topicModalOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeTopicModal() {
    if (!topicModalOverlay) return;
    topicModalOverlay.classList.remove('open');
    topicModalOverlay.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.pill-btn[data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicKey = btn.getAttribute('data-topic');
      openTopicModal(topicKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeTopicModal);
  if (modalBtnCloseSecondary) modalBtnCloseSecondary.addEventListener('click', closeTopicModal);
  if (topicModalOverlay) {
    topicModalOverlay.addEventListener('click', (e) => {
      if (e.target === topicModalOverlay) closeTopicModal();
    });
  }

  if (modalBtnExplore) {
    modalBtnExplore.addEventListener('click', () => {
      closeTopicModal();
      switchTab(currentModalTabTarget);
      document.querySelector('.category-tabs-container')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================
  // ۶. گردونه حکمت و نقل‌قول‌های علمی و معتبر تاریخ
  // ==========================================
  const historicalQuotes = [
    {
      text: '«تاریخ در باطن خود، اندیشیدن، پژوهش و واکاوی دقیق برای یافتن علل و اسباب واقعی رویدادهاست.»',
      author: 'ابن خلدون (مقدمه)'
    },
    {
      text: '«این پژوهش را نگاشتم تا آنچه آدمیان پدید آورده‌اند، به دست فراموشی سپرده نشود.»',
      author: 'هرودوت (دیباچه تواریخ)'
    },
    {
      text: '«روایت من نه اثری برای خوشامد زودگذر شنوندگان، بلکه نگاشته‌ای ماندگار برای درک حقیقت انسان در تمام اعصار است.»',
      author: 'توسیدید (تاریخ جنگ‌های پلوپونزی)'
    },
    {
      text: '«تاریخ، گفتگوی بی‌پایان و ناگسستنی میان دیروز و امروز و میان انسان امروز با جامعه گذشته است.»',
      author: 'ادوارد هالکار کار (تاریخ چیست؟)'
    },
    {
      text: '«گذشته هرگز نمرده است؛ تاریخ همان حال است که با چراغ پژوهش به کندوکاوش نشسته‌ایم.»',
      author: 'ویل دورانت (تاریخ تمدن)'
    },
    {
      text: '«اهورامزدا این بوم و بر را بپاید؛ از سپاه دشمن، از خشکسالی و از دروغ.»',
      author: 'داریوش بزرگ (کتیبه تخت‌جمشید DPa)'
    },
    {
      text: '«جهان یادگار است و ما رفتنی؛ به گیتی نماند به جز مردمی.»',
      author: 'فردوسی بزرگ (شاهنامه)'
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
      currentQuoteIndex = (currentQuoteIndex + 1) % historicalQuotes.length;
      renderQuote(currentQuoteIndex);
    });
  }

  // ==========================================
  // ۷. اسکرول به بالای صفحه (Back to Top)
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // ۸. ماژول مانیتورینگ و ارسال نوتیفیکیشن تلگرام
  // ==========================================
  const pageLoadTime = Date.now();
  const lastCategoryTimes = {};

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

  function trackEvent(title, url, eventType = 'click', category = 'general') {
    const config = window.ZANGE_CONFIG;
    if (!config || !config.ENABLE_TELEGRAM_NOTIFICATIONS) return;

    // بررسی کلیدهای مدیریت اعلان‌ها (NOTIFY_SWITCHES)
    const switches = config.NOTIFY_SWITCHES || {};
    if (category === 'page_view' && switches.PAGE_VIEW === false) return;
    if (category === 'podcast' && switches.PODCAST_CLICKS === false) return;
    if (category === 'youtube' && switches.YOUTUBE_CLICKS === false) return;
    if (category === 'connect' && switches.CONNECT_CLICKS === false) return;
    if (category === 'topic' && switches.TOPIC_BUBBLES === false) return;
    if (category === 'tab' && switches.TAB_SWITCH === false) return;

    const now = Date.now();
    const throttleMs = (config.THROTTLE_SECONDS || 2) * 1000;
    const lastTime = lastCategoryTimes[category] || 0;
    if (now - lastTime < throttleMs) return;
    lastCategoryTimes[category] = now;

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

    // روش ۱: در صورت فعال بودن وب‌هوک واسط
    if (config.WEBHOOK_URL && config.WEBHOOK_URL.trim().length > 10) {
      try {
        const payloadString = JSON.stringify(payload);
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

    // روش ۲: ارسال مستقیم به تلگرام اختصاصی میلاد نصرتی
    const direct = config.DIRECT_TELEGRAM;
    if (direct && direct.BOT_TOKEN && direct.CHAT_ID) {
      try {
        let messageText = '';
        if (eventType === 'page_view') {
          messageText = `👁️ <b>بازدید جدید از لندینگ‌پیج زنگ تاریخ!</b>\n\n` +
                        `📱 <b>دستگاه:</b> ${payload.device}\n` +
                        `🌐 <b>ورودی از:</b> ${payload.referrer}\n` +
                        `📅 <b>زمان:</b> ${payload.time}`;
        } else {
          messageText = `🔔 <b>کلیک جدید روی لینک‌های زنگ تاریخ!</b>\n\n` +
                        `🎯 <b>بخش:</b> ${title}\n` +
                        `🔗 <b>مقصد:</b> ${url}\n` +
                        `📱 <b>دستگاه:</b> ${payload.device}\n` +
                        `🌐 <b>ورودی از:</b> ${payload.referrer}\n` +
                        `⏱️ <b>حضور در صفحه:</b> ${durationSeconds} ثانیه\n` +
                        `📅 <b>زمان:</b> ${payload.time}`;
        }

        const telegramGetUrl = `https://api.telegram.org/bot${direct.BOT_TOKEN}/sendMessage?chat_id=${direct.CHAT_ID}&text=${encodeURIComponent(messageText)}&parse_mode=HTML&disable_web_page_preview=true`;

        // ارسال چندگانه جهت اطمینان صد درصدی بدون نیاز به CORS
        const beaconImg = new Image();
        beaconImg.src = telegramGetUrl;

        if (window.fetch) {
          fetch(telegramGetUrl, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
        }
      } catch (err) {
        console.warn('Direct telegram notification error:', err);
      }
    }
  }

  // ثبت شنونده‌های کلیک با تفکیک دقیق دسته‌بندی
  document.querySelectorAll('#pane-stream a').forEach((elem) => {
    elem.addEventListener('click', () => {
      const title = elem.getAttribute('data-track-name') || elem.querySelector('.link-title')?.textContent?.trim() || 'پادگیر';
      trackEvent(title, elem.getAttribute('href') || '-', 'click', 'podcast');
    });
  });

  document.querySelectorAll('#pane-youtube a').forEach((elem) => {
    elem.addEventListener('click', () => {
      trackEvent('کانال رسمی یوتیوب', elem.getAttribute('href') || '-', 'click', 'youtube');
    });
  });

  document.querySelectorAll('#pane-connect a').forEach((elem) => {
    elem.addEventListener('click', () => {
      const title = elem.getAttribute('data-track-name') || elem.querySelector('.link-title')?.textContent?.trim() || 'ارتباط و حمایت';
      trackEvent(title, elem.getAttribute('href') || '-', 'click', 'connect');
    });
  });

  // مقداردهی اولیه نقل‌قول
  renderQuote(0);

})();
