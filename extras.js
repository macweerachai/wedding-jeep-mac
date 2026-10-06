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
  var VIDEOS = { prewedding: '', venue: undefined };   // venue: ใส่ '' เพื่อโชว์ช่องวิดีโอเปล่า หรือใส่ลิงก์ได้เลย
  // ลิงก์อัลบั้ม Google Photos (แชร์แบบ "ทุกคนที่มีลิงก์") ไว้ให้กดดูรูป/วิดีโอทั้งหมด (ว่าง = ไม่แสดงปุ่ม)
  var ALBUMS = { prewedding: '', venue: '' };
  var MAP_QUERY = 'ริมธารา Rimtara พระราม 3'; // คำค้นของ Google Maps (ถ้าหมุดเพี้ยน เปลี่ยนเป็นชื่อ/ที่อยู่เต็ม หรือพิกัด เช่น '13.7,100.5')
  /* ======================================================= */

  var L = window.WED_LANG || 'th';
  var S = {
    th: { tap: 'แตะเพื่อเปิดซอง', kick1: 'Our Moments', h1: 'ความทรงจำของเรา', kick2: 'Venue Gallery', h2: 'บรรยากาศสถานที่', venueTitle: 'สถานที่จัดงาน', direction: 'นำทาง (DIRECTION)', album: 'ดูทั้งหมดใน Google Photos', scan: 'สแกน QR code หรือกดปุ่ม', tables: 'ดูผังโต๊ะ',
          soon: 'รูปภาพกำลังจะมาเร็วๆ นี้', close: 'ปิด', prev: 'ก่อนหน้า', next: 'ถัดไป', rsvp: 'ตอบรับคำเชิญ', top: 'The Wedding of' },
    en: { tap: 'Tap to open', kick1: 'Our Moments', h1: 'Our Moments', kick2: 'Venue Gallery', h2: 'Venue Photos', venueTitle: 'The Venue', direction: 'DIRECTION', album: 'View all in Google Photos', scan: 'Scan the QR code or tap the button', tables: 'Table plan',
          soon: 'Photos coming soon', close: 'Close', prev: 'Previous', next: 'Next', rsvp: 'RSVP', top: 'The Wedding of' },
    ja: { tap: 'タップして開く', kick1: 'Our Moments', h1: 'ふたりの思い出', kick2: 'Venue Gallery', h2: '会場の雰囲気', venueTitle: '会場', direction: '経路案内 (DIRECTION)', album: 'Googleフォトで全て見る', scan: 'QRコードを読み取るか、ボタンをタップ', tables: 'テーブル配置図',
          soon: '写真は近日公開', close: '閉じる', prev: '前へ', next: '次へ', rsvp: 'ご出欠の回答', top: 'The Wedding of' }
  };
  function tx(k) { return (S[L] && S[L][k]) || S.th[k] || k; }

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
  }
  function openLb(list, i) {
    if (!lb) buildLightbox();
    lbList = list; lbIndex = i; showLb();
    lb.classList.add('on'); root.classList.add('lock');
  }
  function stepLb(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('on');
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

  function buildGallery(id, kick, head, list, nPh, rowClass, video, album) {
    var sec = el('section', 'section gal');
    sec.id = id;
    sec.innerHTML = '<div class="section-head"><p class="kicker-en">' + kick + '</p><h2>' + head + '</h2></div>';
    if (video !== undefined) sec.appendChild(buildVideo(video));
    var grid = el('div', rowClass || 'gal-grid');
    if (list.length) {
      list.forEach(function (src, i) {
        var b = el('button', 'gal-item');
        b.type = 'button';
        var img = el('img');
        img.src = src; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
        img.addEventListener('error', function () { b.classList.add('ph'); b.innerHTML = ICON_IMG; b.disabled = true; });
        b.appendChild(img);
        b.addEventListener('click', function () { openLb(list, i); });
        grid.appendChild(b);
      });
    } else {
      for (var i = 0; i < nPh; i++) grid.appendChild(el('div', 'gal-item ph', ICON_IMG));
    }
    sec.appendChild(grid);
    if (!list.length && !video) sec.appendChild(el('p', 'gal-soon', tx('soon')));
    if (album) {
      var a = el('a', 'btn btn-ghost gal-album');
      a.href = album; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = tx('album');
      sec.appendChild(a);
    }
    return sec;
  }

  var invite = document.getElementById('invite');
  if (invite) {
    invite.insertAdjacentElement('afterend',
      buildGallery('moments', tx('kick1'), tx('h1'), PHOTOS.prewedding, PLACEHOLDER_COUNT.prewedding, '', VIDEOS.prewedding, ALBUMS.prewedding));
  }
  var schedEl = document.getElementById('schedule');
  var where = schedEl && schedEl.closest('section');
  if (where) {
    /* ===== The Venue: แผนที่เต็มความกว้าง + ที่อยู่ + ปุ่มนำทาง ===== */
    var E = (window.WED_CONFIG && WED_CONFIG.EVENT) || {};
    var q = encodeURIComponent(MAP_QUERY);
    var ms = el('section', 'section venue-full');
    ms.id = 'venue-map';
    ms.innerHTML =
      '<div class="section-head"><p class="kicker-en">The Venue</p><h2></h2></div>' +
      '<p class="venue-room"></p>' +
      '<div class="venue-map"><iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen ' +
      'src="https://www.google.com/maps?q=' + q + '&hl=' + (L === 'ja' ? 'ja' : (L === 'en' ? 'en' : 'th')) + '&z=17&output=embed"></iframe></div>' +
      '<p class="venue-addr"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span></span></p>' +
      '<a class="btn btn-ghost venue-dir" target="_blank" rel="noopener"></a>';
    ms.querySelector('h2').textContent = E.venueName || '';
    ms.querySelector('.venue-room').textContent = tx('venueTitle');
    ms.querySelector('.venue-addr span').textContent = E.venueRoom || '';
    var dir = ms.querySelector('.venue-dir');
    dir.textContent = tx('direction');
    dir.href = 'https://www.google.com/maps/dir/?api=1&destination=' + q;
    /* แผนที่ก่อน แล้วตามด้วยรูป/วิดีโอบรรยากาศสถานที่ (ทั้งคู่อยู่ก่อนกำหนดการ) */
    where.insertAdjacentElement('beforebegin', ms);
    where.insertAdjacentElement('beforebegin',
      buildGallery('venue', tx('kick2'), tx('h2'), PHOTOS.venue, PLACEHOLDER_COUNT.venue, 'gal-row', VIDEOS.venue, ALBUMS.venue));
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
