/**
 * پادکست «زنگ تاریخ» | Zangetarikh Podcast
 * تعاملات، انیمیشن ذرات معلق طلایی و امکانات صوتی-ارتباطی
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
  // ۴. گردونه حکمت و نقل‌قول‌های تاریخی
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
  // ۵. اسکرول به بالای صفحه (Back to Top)
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
  // ۶. فیدبک لمسی و صوتی کارت‌های پلتفرم
  // ==========================================
  const linkCards = document.querySelectorAll('.link-card, .youtube-spotlight-card');
  linkCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      // هاور نرم
    });
    card.addEventListener('click', () => {
      if (isSoundEnabled) {
        playAncientChime(480);
      }
    });
  });

  // افکت اولیه برای نقل‌قول
  renderQuote(0);

})();
