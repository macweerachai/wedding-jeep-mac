/* extras.js — หน้าเปิดซอง · ปุ่ม RSVP ลอย · RSVP popup · แกลเลอรีรูป
   ใส่ใน index.html และ rsvp.html (โหลดหลัง i18n.js และ shared.js, หลังสคริปต์ของหน้า)

   วิธีใส่รูป: อัปโหลดรูปไว้ในโฟลเดอร์ photos/ แล้วเติมชื่อไฟล์ในรายการด้านล่าง
   (ถ้ารายการว่าง จะโชว์ช่องรูปเปล่าไว้ก่อน — พอใส่รูปแล้วช่องเปล่าจะหายเอง) */
(function () {
  'use strict';

  /* ====================== แก้ตรงนี้ ====================== */
  var PHOTOS = {
    prewedding: [
      // 'photos/prewed-01.jpg',
      // 'photos/prewed-02.jpg',
    ],
    venue: [
      // 'photos/venue-01.jpg',
      // 'photos/venue-02.jpg',
    ]
  };
  var PLACEHOLDER_COUNT = { prewedding: 5, venue: 3 };
  // วิดีโอ: ใส่ลิงก์ YouTube (แนะนำ ตั้งเป็น Unlisted) หรือไฟล์ mp4 ในโฟลเดอร์ photos/ เช่น 'photos/prewed.mp4' (ว่าง = ยังไม่แสดง)
  var VIDEOS = { prewedding: undefined, venue: undefined };   // ใส่ลิงก์ YouTube หรือ 'photos/xxx.mp4' เพื่อแสดงวิดีโอ (undefined = ไม่แสดงช่องวิดีโอ ไม่เปลืองพื้นที่)
  // ลิงก์อัลบั้ม Google Photos (แชร์แบบ "ทุกคนที่มีลิงก์") ไว้ให้กดดูรูป/วิดีโอทั้งหมด (ว่าง = ไม่แสดงปุ่ม)
  var ALBUMS = { prewedding: '', venue: '' };
  // กำหนดการ (พิธีบ่าย เลี้ยงเย็น) — แก้เวลา/ข้อความตรงนี้ได้เลย
  var SCHEDULE = {
    th: [['16:00', 'เจ้าบ่าวเจ้าสาว\nพร้อมหน้างาน', 'couple'], ['16:19', 'แห่ขันหมาก\nสวมแหวน\nรับไหว้', 'rings'], ['16:40', 'รดน้ำสังข์', 'conch'], ['18:00 – 22:00', 'งานเลี้ยงฉลอง', 'dinner']],
    en: [['4:00 PM', 'Bride & groom arrive', 'couple'], ['4:19 PM', 'Khan Maak & ring ceremony', 'rings'], ['4:40 PM', 'Water blessing', 'conch'], ['6:00 – 10:00 PM', 'Wedding reception', 'dinner']],
    ja: [['16:00', '新郎新婦 会場入り', 'couple'], ['16:19', 'カンマーク・指輪の交換', 'rings'], ['16:40', '水かけの儀', 'conch'], ['18:00 – 22:00', '披露宴', 'dinner']]
  };
  // ไอคอนเส้นบางของกำหนดการ (วาดเอง)
  var SVGW = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
  var SCHED_ICONS = {
    couple: SVGW + '<circle cx="17" cy="13" r="4.5"/><path d="M17 17.5c-3.5 0-6 2.5-6.5 6L9 40h16l-1.5-16.5c-.5-3.5-3-6-6.5-6z"/><path d="M12.5 13.5c-1.5 5 1 10-2 14"/><circle cx="31" cy="13" r="4.5"/><path d="M25 40V25c0-3.5 2.5-6 6-6s6 2.5 6 6v15"/><path d="M29 19l2 3 2-3"/><path d="M41 6l1 2.5L44.5 9.5 42 10.5 41 13l-1-2.5-2.5-1 2.5-1z"/></svg>',
    rings: SVGW + '<circle cx="18" cy="29" r="9.5"/><circle cx="29" cy="29" r="9.5"/><path d="M25.5 13.5l3.5-4 3.5 4-3.5 4.5z"/><path d="M29 18v1.5"/><path d="M38 9l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
    conch: SVGW + '<path d="M9 30c3 6 13 9 22 6s10-11 6-17c-3.5-5-11-6-15-2-3.5 3.5-2.5 9 1.5 10.5 3 1 5.5-1 5-3.5s-3-3-4.5-1.5"/><path d="M37 19l6-4"/><path d="M9 30l-3 6 7-2"/><path d="M14 8c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5z"/><path d="M22 4c0 1.5-1.5 2.3-1.5 3.8a1.5 1.5 0 0 0 3 0c0-1.5-1.5-2.3-1.5-3.8z"/></svg>',
    dinner: SVGW + '<circle cx="24" cy="26" r="11"/><circle cx="24" cy="26" r="7"/><path d="M22 24.5c0-1.5 2-2 2-.5 0-1.5 2-1 2 .5 0 1.5-2 3-2 3s-2-1.5-2-3z"/><path d="M7 14v7a2.5 2.5 0 0 0 5 0v-7M9.5 14v26"/><path d="M41 14c-2.5 2-3 8-1 11h1v15"/></svg>'
  };
  var SS = {
    th: { dateLine: 'วันศุกร์ที่ 19 กุมภาพันธ์ 2570', venueLine: 'ณ ห้องริมนที ริมธารา พระราม 3', theme: 'โทนสีการแต่งกาย :', cal: 'เพิ่มลงปฏิทิน', calG: 'Google Calendar', calI: 'Apple / Outlook (.ics)' },
    en: { dateLine: 'Friday, 19 February 2027', venueLine: 'Rim Natee Room · Rimtara, Rama 3', theme: 'Theme :', cal: 'ADD TO CALENDAR', calG: 'Google Calendar', calI: 'Apple / Outlook (.ics)' },
    ja: { dateLine: '2027年2月19日（金）', venueLine: 'リムターラ（ラマ3世）リムナティ・ルーム', theme: 'ドレスコード :', cal: 'カレンダーに追加', calG: 'Google カレンダー', calI: 'Apple / Outlook (.ics)' }
  };
  // ข้อมูลที่จอดรถ (แสดงเมื่อกดปุ่ม)
  var PARKING = {
    th: { btn: 'ข้อมูลการจอดรถ', lines: ['ที่จอดรถจอดได้ 300 คัน 🚕🚙', 'จอดได้ที่ ชั้น G, B, B1', '🚙 ขับเข้ามา รับบัตรที่ป้อมยาม แจ้ง รปภ. ว่ามา "ริมธารา งานแต่ง"', 'กรณีที่จอดชั้น G เต็ม (ชั้นเดียวกับร้าน) รปภ. จะให้เลี้ยวเข้าจอดชั้น B, B1 และชั้นอื่นๆ โดยช่องจอด รปภ. จะแจ้งให้อีกครั้ง'], note: 'อย่าลืมนำสลิปบัตรจอดมาประทับตราด้วยนะครับ ส่วนบัตรแข็งแนะนำเก็บไว้ที่รถ · จอดฟรี 8 ชม.' },
    en: { btn: 'Parking information', lines: ['Parking for 300 cars 🚕🚙', 'Available on floors G, B and B1', '🚙 Drive in, take a ticket at the guard booth and tell security you are here for "Rimtara wedding"', 'If floor G (same floor as the restaurant) is full, security will direct you to B, B1 or other floors and will point out a space.'], note: 'Please bring your parking slip to be stamped at the event. Keep the hard card in your car. Free parking for 8 hours.' },
    ja: { btn: '駐車場のご案内', lines: ['駐車場は300台分 🚕🚙', 'G階・B階・B1階に駐車できます', '🚙 入口でカードを受け取り、警備員に「リムターラ 結婚式」と伝えてください', 'G階（レストランと同じ階）が満車の場合は、警備員がB階・B1階などへご案内します。'], note: '駐車券は会場でスタンプを押してください。ハードカードは車内に置いたままで構いません。8時間まで無料です。' }
  };
  // รูปหน้าแรกแบบเต็มจอ: อัปโหลดไว้ใน photos/ แล้วใส่ชื่อไฟล์ (ว่าง = ใช้หน้าตาเดิมแบบไม่มีรูป)
  // img = รูปจอคอม (แนวนอน) · imgMobile = รูปจอมือถือ (แนวตั้ง) ถ้าไม่ใส่ จะใช้ img เดียวกัน
  // pos / posMobile = จุดโฟกัสของรูปเมื่อถูกครอบ เช่น '50% 20%' (ซ้าย-ขวา  บน-ล่าง) ปรับให้เห็นหน้าคู่บ่าวสาว
  var HERO = { img: '', imgMobile: '', pos: '50% 25%', posMobile: '50% 20%' };
  // เพลงตอนกดเปิดซอง: อัปโหลดไฟล์เพลง (.mp3) ไว้ในโฟลเดอร์ music/ แล้วใส่ชื่อไฟล์ เช่น 'music/until-i-found-you.mp3' (ว่าง = ไม่มีเพลง)
  var MUSIC = { src: 'music/wedding-piano.mp3', volume: 0.55 };
  var FLOORPLAN = 'photos/floorplan.png';   // รูปผังโต๊ะที่เด้งขึ้นมาเมื่อกดปุ่ม "ดูผังโต๊ะ"
  var MAP_QUERY = 'ริมธารา Rimtara พระราม 3'; // คำค้นของ Google Maps (ถ้าหมุดเพี้ยน เปลี่ยนเป็นชื่อ/ที่อยู่เต็ม หรือพิกัด เช่น '13.7,100.5')
  /* ======================================================= */

  var L = window.WED_LANG || 'th';
  var S = {
    th: { tap: 'แตะเพื่อเปิดซอง', kick1: 'Our Moments', h1: 'ความทรงจำของเรา', kick2: 'Venue Gallery', h2: 'บรรยากาศสถานที่', venueTitle: 'สถานที่จัดงาน', direction: 'นำทาง', album: 'ดูทั้งหมดใน Google Photos', scan: 'สแกน QR code หรือกดปุ่ม', tables: 'ดูผังโต๊ะ',
          soon: 'รูปภาพกำลังจะมาเร็วๆ นี้', close: 'ปิด', prev: 'ก่อนหน้า', next: 'ถัดไป', rsvp: 'ตอบรับคำเชิญ', top: 'The Wedding of' },
    en: { tap: 'Tap to open', kick1: 'Our Moments', h1: 'Our Moments', kick2: 'Venue Gallery', h2: 'Venue Photos', venueTitle: 'The Venue', direction: 'DIRECTION', album: 'View all in Google Photos', scan: 'Scan the QR code or tap the button', tables: 'Table plan',
          soon: 'Photos coming soon', close: 'Close', prev: 'Previous', next: 'Next', rsvp: 'RSVP', top: 'The Wedding of' },
    ja: { tap: 'タップして開く', kick1: 'Our Moments', h1: 'ふたりの思い出', kick2: 'Venue Gallery', h2: '会場の雰囲気', venueTitle: '会場', direction: '経路案内', album: 'Googleフォトで全て見る', scan: 'QRコードを読み取るか、ボタンをタップ', tables: 'テーブル配置図',
          soon: '写真は近日公開', close: '閉じる', prev: '前へ', next: '次へ', rsvp: 'ご出欠の回答', top: 'The Wedding of' }
  };
  function tx(k) { return (S[L] && S[L][k]) || (SS[L] && SS[L][k]) || S.th[k] || SS.th[k] || k; }

  var qs = location.search;
  var isEmbed = /[?&]embed=1/.test(qs);
  var codeParam = (function () {
    var m = qs.match(/[?&]code=([^&]+)/);
    try { return m ? decodeURIComponent(m[1]).trim() : ''; } catch (e) { return ''; }
  })();
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m10 8.5 5.5 3.5-5.5 3.5z" fill="currentColor"/></svg>';
  var ICON_IMG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m5.5 17 4.5-5 3.5 3.5 2-2 3 3.5"/></svg>';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ================= rsvp.html : โหมดฝัง + กรอกรหัสอัตโนมัติ ================= */
  if (isEmbed) root.classList.add('embed');

  var lookupBtn = document.getElementById('lookupBtn');
  if (lookupBtn && codeParam) {
    var codeInput = document.getElementById('code');
    if (codeInput) {
      codeInput.value = codeParam;
      setTimeout(function () { lookupBtn.click(); }, 0);
    }
  }

  /* ต่อจากนี้เฉพาะหน้าแรก */
  if (!document.body.classList.contains('home')) return;

  /* ================= RSVP popup ================= */
  var sheet, back, frame, lastFocus, framedCode = null;

  function buildSheet() {
    back = el('div', 'rs-back');
    sheet = el('div', 'rs-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', tx('rsvp'));
    var close = el('button', 'rs-close', ICON_X);
    close.type = 'button';
    close.setAttribute('aria-label', tx('close'));
    close.addEventListener('click', closeRsvp);
    back.addEventListener('click', closeRsvp);
    frame = el('iframe');
    frame.title = tx('rsvp');
    sheet.appendChild(close);
    sheet.appendChild(frame);
    document.body.appendChild(back);
    document.body.appendChild(sheet);
  }

  function openRsvp(code) {
    if (!sheet) buildSheet();
    code = code || '';
    if (framedCode !== code) {
      frame.src = 'rsvp.html?embed=1' + (code ? '&code=' + encodeURIComponent(code) : '');
      framedCode = code;
    }
    lastFocus = document.activeElement;
    root.classList.add('rs-open', 'lock');
    var c = sheet.querySelector('.rs-close');
    setTimeout(function () { if (c) c.focus(); }, 50);
  }

  function closeRsvp() {
    root.classList.remove('rs-open', 'lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('a[href="rsvp.html"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      openRsvp(codeParam);
    });
  });

  /* ================= ปุ่ม RSVP ลอย ================= */
  var fab = el('a', 'btn btn-primary fab-rsvp');
  fab.href = 'rsvp.html';
  fab.textContent = (window.t && window.t('nav_rsvp')) || tx('rsvp');
  fab.addEventListener('click', function (e) { e.preventDefault(); openRsvp(codeParam); });
  document.body.appendChild(fab);

  var heroOut = false, rsvpIn = false;
  function updateFab() { fab.classList.toggle('show', heroOut && !rsvpIn); }
  if ('IntersectionObserver' in window) {
    var hero = document.querySelector('.hero');
    var rsvpBlock = document.querySelector('.rsvp-block');
    if (hero) new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; updateFab(); }, { threshold: 0.15 }).observe(hero);
    if (rsvpBlock) new IntersectionObserver(function (en) { rsvpIn = en[0].isIntersecting; updateFab(); }, { threshold: 0.2 }).observe(rsvpBlock);
  } else {
    heroOut = true; updateFab();
  }

  /* ================= แกลเลอรี + lightbox ================= */
  var lb, lbImg, lbCount, lbList = [], lbIndex = 0;

  function buildLightbox() {
    lb = el('div', 'lb');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lbImg = el('img');
    lbImg.alt = '';
    lbCount = el('div', 'lb-count');
    var bc = el('button', 'lb-btn lb-close', ICON_X); bc.type = 'button'; bc.setAttribute('aria-label', tx('close'));
    var bp = el('button', 'lb-btn lb-prev', ICON_L); bp.type = 'button'; bp.setAttribute('aria-label', tx('prev'));
    var bn = el('button', 'lb-btn lb-next', ICON_R); bn.type = 'button'; bn.setAttribute('aria-label', tx('next'));
    bc.addEventListener('click', closeLb);
    bp.addEventListener('click', function () { stepLb(-1); });
    bn.addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) stepLb(dx < 0 ? 1 : -1);
      x0 = null;
    });
    [lbImg, bc, bp, bn, lbCount].forEach(function (n) { lb.appendChild(n); });
    document.body.appendChild(lb);
  }
  function showLb() {
    lbImg.src = lbList[lbIndex];
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbList.length;
    lb.classList.toggle('single', lbList.length < 2);
  }
  function openLb(list, i) {
    if (!lb) buildLightbox();
    lbList = list; lbIndex = i; showLb();
    lb.classList.add('on'); root.classList.add('lock');
  }
  function stepLb(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('on', 'plan');
    if (!root.classList.contains('rs-open')) root.classList.remove('lock');
  }

  function ytId(u) {
    var m = String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }
  function buildVideo(url) {
    var w = el('div', 'gal-video');
    if (!url) { w.classList.add('ph'); w.innerHTML = ICON_PLAY; return w; }
    var id = ytId(url);
    if (id) {
      w.innerHTML = '<iframe loading="lazy" allowfullscreen title="video" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" ' +
        'src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0"></iframe>';
    } else {
      var v = el('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata'; v.src = url;
      w.appendChild(v);
    }
    return w;
  }

  /* สไลด์รูปเลื่อนอัตโนมัติ (ปัดด้วยนิ้วได้, หยุดเมื่อแตะ/เมาส์ชี้, หยุดเมื่ออยู่นอกจอ) */
  var SLIDE_MS = 4000;
  function autoSlide(track, dots) {
    var n = track.children.length, cur = 0, timer = null, hold = false, visible = false;
    function width() { return track.clientWidth; }
    function go(i) { cur = (i + n) % n; track.scrollTo({ left: cur * width(), behavior: reduceMotion ? 'auto' : 'smooth' }); }
    function tick() { if (!hold && visible) go(cur + 1); }
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / Math.max(width(), 1));
      if (i !== cur || !dots.children[i].classList.contains('on')) {
        cur = i;
        for (var k = 0; k < dots.children.length; k++) dots.children[k].classList.toggle('on', k === i);
      }
    }, { passive: true });
    Array.prototype.forEach.call(dots.children, function (d, i) { d.addEventListener('click', function () { go(i); }); });
    ['pointerdown', 'touchstart', 'mouseenter', 'focusin'].forEach(function (ev) { track.addEventListener(ev, function () { hold = true; }, { passive: true }); });
    ['pointerup', 'touchend', 'mouseleave', 'focusout'].forEach(function (ev) { track.addEventListener(ev, function () { setTimeout(function () { hold = false; }, 2500); }, { passive: true }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .35 }).observe(track);
    } else visible = true;
    if (!reduceMotion) timer = setInterval(tick, SLIDE_MS);
  }

  function buildGallery(id, kick, head, list, nPh, rowClass, video, album) {
    var sec = el('section', 'section gal');
    sec.id = id;
    sec.innerHTML = '<div class="section-head"><p class="kicker-en">' + kick + '</p><h2>' + head + '</h2></div>';
    if (video !== undefined) sec.appendChild(buildVideo(video));
    var slider = el('div', 'gal-slider');
    var track = el('div', 'gal-track');
    var dots = el('div', 'gal-dots');
    var n = list.length || nPh;
    for (var i = 0; i < n; i++) {
      var slide;
      if (list.length) {
        slide = el('button', 'gal-item');
        slide.type = 'button';
        var img = el('img');
        img.src = list[i]; img.alt = ''; img.loading = i ? 'lazy' : 'eager'; img.decoding = 'async';
        (function (b, idx) {
          img.addEventListener('error', function () { b.classList.add('ph'); b.innerHTML = ICON_IMG; b.disabled = true; });
          b.addEventListener('click', function () { openLb(list, idx); });
        })(slide, i);
        slide.appendChild(img);
      } else {
        slide = el('div', 'gal-item ph', ICON_IMG);
      }
      track.appendChild(slide);
      var d = el('span', i ? '' : 'on'); dots.appendChild(d);
    }
    slider.appendChild(track);
    if (n > 1) slider.appendChild(dots);
    sec.appendChild(slider);
    if (list.length > 1) autoSlide(track, dots);
    if (!list.length && !video) sec.appendChild(el('p', 'gal-soon', tx('soon')));
    if (album) {
      var a = el('a', 'btn btn-ghost gal-album');
      a.href = album; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = tx('album');
      sec.appendChild(a);
    }
    return sec;
  }

  /* ลำดับหน้า (กะทัดรัด): หน้าแรก → การ์ดเชิญ → กำหนดการ → ความทรงจำ → สถานที่ → ตอบรับ → LINE → แบ่งปันรูป */
  var schedEl = document.getElementById('schedule');
  var where = schedEl && schedEl.closest('section');
  var moments = buildGallery('moments', tx('kick1'), tx('h1'), PHOTOS.prewedding, PLACEHOLDER_COUNT.prewedding, '', VIDEOS.prewedding, ALBUMS.prewedding);
  if (where) where.insertAdjacentElement('afterend', moments);
  else { var invite = document.getElementById('invite'); if (invite) invite.insertAdjacentElement('afterend', moments); }
  if (where) {
    /* ===== The Venue: แผนที่เต็มความกว้าง + ที่อยู่ + ปุ่มนำทาง ===== */
    var E = (window.WED_CONFIG && WED_CONFIG.EVENT) || {};
    var q = encodeURIComponent(MAP_QUERY);
    var ms = el('section', 'section venue-full');
    ms.id = 'venue-map';
    ms.innerHTML =
      '<div class="section-head"><p class="kicker-en">The Venue</p><h2></h2></div>' +
      '<p class="venue-addr"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span></span></p>' +
      '<a class="btn btn-ghost venue-dir" target="_blank" rel="noopener"></a>' +
      '<div class="venue-map"><iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen ' +
      'src="https://www.google.com/maps?q=' + q + '&hl=' + (L === 'ja' ? 'ja' : (L === 'en' ? 'en' : 'th')) + '&z=17&output=embed"></iframe></div>';
    ms.querySelector('h2').textContent = tx('venueTitle');
    ms.querySelector('.venue-addr span').textContent = L === 'th' ? 'ห้องริมนที ชั้น G อาคาร SV City ถนนพระราม 3' : (E.venueRoom || '');
    var dir = ms.querySelector('.venue-dir');
    dir.textContent = tx('direction');
    dir.href = 'https://www.google.com/maps/dir/?api=1&destination=' + q;
    /* ข้อมูลที่จอดรถ: พับเก็บ กดแล้วค่อยแสดง */
    var pk = PARKING[L] || PARKING.th;
    var det = el('details', 'venue-park');
    det.innerHTML = '<summary></summary><div class="park-body"><ul></ul><p class="park-note"></p></div>';
    det.querySelector('summary').textContent = '🚗 ' + pk.btn;
    var ul = det.querySelector('ul');
    pk.lines.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    det.querySelector('.park-note').textContent = pk.note;
    ms.appendChild(det);
    /* แผนที่ก่อน แล้วตามด้วยรูป/วิดีโอบรรยากาศสถานที่ (ทั้งคู่อยู่ก่อนกำหนดการ) */
    moments.insertAdjacentElement('afterend', ms);
    /* รูปบรรยากาศสถานที่: แสดงเฉพาะเมื่อมีรูป/วิดีโอจริง (ไม่เปลืองพื้นที่) */
    if (PHOTOS.venue.length || VIDEOS.venue) {
      ms.insertAdjacentElement('afterend',
        buildGallery('venue', tx('kick2'), tx('h2'), PHOTOS.venue, PLACEHOLDER_COUNT.venue, '', VIDEOS.venue, ALBUMS.venue));
    }
    /* ปุ่มดูผังโต๊ะ ย้ายมาอยู่ในส่วนสถานที่ (ส่วน RSVP ด้านล่างซ่อนไว้ ใช้ปุ่มหน้าแรก + ปุ่มลอยแทน) */
    var tbl = document.querySelector('.rsvp-block a[href="tables.html"]');
    if (tbl) {
      tbl.classList.add('venue-tables'); ms.appendChild(tbl);
      /* กดแล้วเด้งผังโต๊ะขึ้นมาเป็น popup (ซูม/ปิดได้) แทนการเปิดหน้าใหม่ */
      tbl.addEventListener('click', function (e) { e.preventDefault(); openLb([FLOORPLAN], 0); lb.classList.add('plan'); });
    }
  }

  /* กำหนดการ: แถวไอคอนแนวนอน + วันที่/สถานที่ + โทนสีการแต่งกาย (รวมเป็นส่วนเดียว) */
  if (schedEl) {
    var SI = SCHED_ICONS;
    var sec2 = schedEl.closest('section');
    sec2.classList.add('sched-block');
    schedEl.className = 'sched-icons';
    schedEl.innerHTML = '';
    (SCHEDULE[L] || SCHEDULE.th).forEach(function (r) {
      var d = el('div', 'sched-item');
      d.innerHTML = '<span class="sched-ic" aria-hidden="true">' + (SI[r[2]] || '') + '</span><span class="sched-dot" aria-hidden="true"></span>';
      var t = el('p', 'sched-time');
      var parts = r[0].split(' – ');
      t.textContent = parts.join('–');
      if (parts[1]) t.classList.add('long');
      var lb = el('p', 'sched-label'); lb.textContent = r[1];
      d.appendChild(t); d.appendChild(lb);
      schedEl.appendChild(d);
    });
    /* ย้ายโทนสีการแต่งกายมาเป็นบรรทัด THEME ใต้กำหนดการ แล้วซ่อนส่วนเดิม */
    var sw = document.querySelector('.swatches');
    if (sw) {
      var dressSec = sw.closest('section');
      var th = el('div', 'sched-theme');
      var lab = el('span', 'sched-theme-l'); lab.textContent = tx('theme');
      th.appendChild(lab);
      Array.prototype.forEach.call(sw.querySelectorAll('figure'), function (f) {
        var dot = el('span', 'sched-sw'); dot.style.cssText = f.querySelector('span').getAttribute('style');
        dot.title = f.textContent.trim(); th.appendChild(dot);
      });
      sec2.appendChild(th);
      if (dressSec && dressSec !== sec2) dressSec.remove();
    }
  }

  /* ฟอนต์ Jost สำหรับตัวเลขนับถอยหลังในหน้าแรก */
  var fl = document.createElement('link'); fl.rel = 'stylesheet';
  fl.href = 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Jost:wght@300;400;500&display=swap';
  document.head.appendChild(fl);

  /* ===== เพิ่มลงปฏิทิน: วางท้ายส่วนกำหนดการ ===== */
  var schedSec = document.querySelector('.sched-block');
  if (schedSec) {
    var EVT = { s: '20270219T090000Z', e: '20270219T150000Z',
      title: 'งานแต่งงาน จิ๊บ & แม็ค (Jeep & Mac Wedding)', place: 'ห้องริมนที ริมธารา พระราม 3 (Rimtara Rama 3), SV City, Bangkok' };
    var site = location.href.split(/[?#]/)[0];
    var cal = el('div', 'cal-wrap');
    cal.innerHTML = '<button type="button" class="cal-btn" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg><span></span></button>' +
      '<div class="cal-menu" hidden><a class="cal-g" target="_blank" rel="noopener"></a><a class="cal-i" download="Jeep-Mac-Wedding.ics"></a></div>';
    var cb = cal.querySelector('.cal-btn'), cm = cal.querySelector('.cal-menu');
    cb.querySelector('span').textContent = tx('cal');
    cb.addEventListener('click', function (e) { e.stopPropagation(); cm.hidden = !cm.hidden; cb.setAttribute('aria-expanded', String(!cm.hidden)); });
    document.addEventListener('click', function () { cm.hidden = true; cb.setAttribute('aria-expanded', 'false'); });
    var cg = cal.querySelector('.cal-g');
    cg.textContent = tx('calG');
    cg.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(EVT.title) +
      '&dates=' + EVT.s + '/' + EVT.e + '&location=' + encodeURIComponent(EVT.place) + '&details=' + encodeURIComponent(site);
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JeepMac//Wedding//TH', 'BEGIN:VEVENT', 'UID:jeep-mac-20270219@wedding',
      'DTSTAMP:20261006T000000Z', 'DTSTART:' + EVT.s, 'DTEND:' + EVT.e, 'SUMMARY:' + EVT.title,
      'LOCATION:' + EVT.place.replace(/,/g, '\\,'), 'DESCRIPTION:' + site,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + EVT.title, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var ci = cal.querySelector('.cal-i');
    ci.textContent = tx('calI');
    ci.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    schedSec.appendChild(cal);
  }

  /* หน้าแรก: ใช้เส้นคั่นมีหัวใจตรงกลางแทน & */
  var heroAmp = document.querySelector('.hero-names .amp');
  if (heroAmp) {
    heroAmp.innerHTML = '<svg viewBox="0 0 260 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
      '<path d="M4 22h96"/><path d="M160 22h96"/><path d="M130 34c-10-7-17-12-17-19 0-5 4-8 8-8 4 0 7 2 9 5 2-3 5-5 9-5 4 0 8 3 8 8 0 7-7 12-17 19z"/></g></svg>' +
      '<span class="visually-hidden">&amp;</span>';
    heroAmp.classList.add('amp-heart');
  }
  /* การ์ดคำเชิญ: เปลี่ยนเส้นคั่นรูปข้าวหลามตัดเป็นหัวใจเหมือนหน้าแรก */
  var invOrn = document.querySelector('.invite .ornament');
  if (invOrn) {
    invOrn.innerHTML = '<svg viewBox="0 0 260 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
      '<path d="M4 22h96"/><path d="M160 22h96"/><path d="M130 34c-10-7-17-12-17-19 0-5 4-8 8-8 4 0 7 2 9 5 2-3 5-5 9-5 4 0 8 3 8 8 0 7-7 12-17 19z"/></g></svg>';
    invOrn.classList.add('orn-heart');
  }
  /* ภาษาอังกฤษ/ญี่ปุ่น: ไม่แสดงหัวข้อเล็กภาษาอังกฤษซ้ำเหนือหัวข้อหลัก (แสดงภาษาเดียว) */
  root.classList.add('lang-' + L);

  /* ===== ชื่อบ่าวสาว: ตัวเขียน (Bride / Groom) + ชื่ออังกฤษตัวพิมพ์ใหญ่ + ชื่อเต็ม ===== */
  var NAMES = { bride: { label: 'Bride', en: 'WANPEN' }, groom: { label: 'Groom', en: 'WEERACHAI' } };
  var persons = document.querySelectorAll('.couple .person');
  ['bride', 'groom'].forEach(function (k, i) {
    var pp = persons[i]; if (!pp) return;
    var lb = el('p', 'p-script'); lb.textContent = NAMES[k].label;
    var en = el('p', 'p-en'); en.textContent = NAMES[k].en;
    pp.insertBefore(lb, pp.firstChild);
  });
  var couple = document.querySelector('.couple');
  if (couple) couple.classList.add('couple-v2');
  /* ชื่อท้ายหน้าแบบตัวเขียน */
  var ftk = document.querySelector('.site-footer .kicker-en');
  if (ftk) ftk.innerHTML = '<span class="ft-date">19 · 02 · 2027</span>';

  /* แบ่งปันความทรงจำ: ปุ่มเพิ่มรูปกับปุ่มดูรูปเปิดอัลบั้มเดียวกัน → เหลือปุ่มเดียว */
  var gUp = document.getElementById('galleryUploadBtn'), gView = document.getElementById('galleryViewBtn');
  if (gUp && gView) {
    gView.style.display = 'none';
    var gl = gUp.querySelector('span');
    if (gl) gl.textContent = { th: 'เพิ่มรูป / ดูรูปของทุกคน', en: 'Add & view photos', ja: '写真を追加・見る' }[L] || 'เพิ่มรูป / ดูรูปของทุกคน';
  }

  /* ข้อความที่ไม่ได้อยู่ในระบบ i18n เดิม */
  var scan = document.getElementById('lineScanText'); if (scan) scan.textContent = tx('scan');
  var tb = document.getElementById('tablesBtnText'); if (tb) tb.textContent = tx('tables');

  /* ================= Esc ปิดชั้นบนสุด ================= */
  document.addEventListener('keydown', function (e) {
    if (lb && lb.classList.contains('on')) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') stepLb(-1);
      else if (e.key === 'ArrowRight') stepLb(1);
    } else if (e.key === 'Escape' && root.classList.contains('rs-open')) {
      closeRsvp();
    }
  });

  /* ================= หน้าเปิดซอง ================= */
  /* ===== เพลงประกอบ: เล่นเมื่อกดเปิดซอง + ปุ่มเปิด/ปิดเพลงมุมจอ ===== */
  var bgm = null, bgmBtn = null;
  function setBgmBtn() { if (bgmBtn) bgmBtn.classList.toggle('on', !!(bgm && !bgm.paused)); }
  function playBgm() {
    if (!bgm) return;
    bgm.volume = 0;
    var pr = bgm.play();
    if (pr && pr.catch) pr.catch(function () { setBgmBtn(); });
    var v = 0, tgt = MUSIC.volume || 0.55;
    var fi = setInterval(function () { v = Math.min(tgt, v + tgt / 20); bgm.volume = v; if (v >= tgt) clearInterval(fi); }, 100);
  }
  if (MUSIC.src) {
    bgm = new Audio(MUSIC.src);
    bgm.loop = true; bgm.preload = 'auto';
    bgm.addEventListener('play', setBgmBtn); bgm.addEventListener('pause', setBgmBtn);
    bgmBtn = el('button', 'bgm-btn', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>');
    bgmBtn.type = 'button';
    bgmBtn.setAttribute('aria-label', 'Music on/off');
    bgmBtn.addEventListener('click', function () { if (bgm.paused) playBgm(); else bgm.pause(); });
    document.body.appendChild(bgmBtn);
    document.addEventListener('visibilitychange', function () { if (document.hidden && !bgm.paused) { bgm.pause(); bgm._resume = true; } else if (!document.hidden && bgm._resume) { bgm._resume = false; playBgm(); } });
  }

  var seen = false;
  try { seen = sessionStorage.getItem('wed_cover') === '1'; } catch (e) { /* ใช้ไม่ได้ก็แสดงตามปกติ */ }
  var skip = /[?&]nocover/.test(qs);

  function afterCover() {
    window.scrollTo(0, 0);
    if (codeParam) openRsvp(codeParam);   // ลิงก์เฉพาะแขก ?code=XXXX → เปิดฟอร์มให้เลย
  }

  if (seen || skip) {
    if (codeParam && !skip) setTimeout(function () { openRsvp(codeParam); }, 400);
    return;
  }

  var cover = el('div', 'cover');
  cover.setAttribute('role', 'dialog');
  cover.setAttribute('aria-modal', 'true');
  cover.setAttribute('aria-label', tx('tap'));
  cover.innerHTML =
    '<p class="kicker-en cv-top">' + tx('top') + '</p>' +
    '<p class="cv-names">Jeep &amp; Mac</p>' +
    '<p class="cv-date">19 · 02 · 2027</p>' +
    '<div class="cv-env" role="button" tabindex="0" aria-label="' + tx('tap') + '">' +
      '<span class="cv-back"></span>' +
      '<span class="cv-card"><b>Jeep &amp; Mac</b><i>19.02.2027</i></span>' +
      '<span class="cv-front"></span>' +
      '<span class="cv-flap"></span>' +
      '<span class="cv-seal"><img src="ww-monogram.png" alt=""></span>' +
    '</div>' +
    '<p class="cv-hint">' + tx('tap') + '</p>';
  document.body.appendChild(cover);
  root.classList.add('lock');

  var opening = false;
  function openCover() {
    if (opening) return;
    opening = true;
    playBgm();   // การแตะเปิดซองนับเป็นการกดของผู้ใช้ เบราว์เซอร์จึงยอมให้เล่นเสียง
    try { sessionStorage.setItem('wed_cover', '1'); } catch (e) { /* ข้าม */ }
    cover.classList.add('open');
    setTimeout(function () {
      cover.classList.add('gone');
      setTimeout(function () {
        cover.remove();
        root.classList.remove('lock');
        afterCover();
      }, reduceMotion ? 20 : 600);
    }, reduceMotion ? 30 : 1700);
  }
  var env = cover.querySelector('.cv-env');
  cover.addEventListener('click', openCover);
  env.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCover(); }
  });
  setTimeout(function () { env.focus({ preventScroll: true }); }, 100);
})();
