/* =========================================================
   v2.js — เพิ่มส่วนใหม่แบบการ์ดออนไลน์เลื่อนดู (โหลดหลัง extras.js)
   ไม่แตะ RSVP / LINE / i18n / backend เดิม
   ========================================================= */
(function () {
  'use strict';
  var L = window.WED_LANG || 'th';
  var T = {
    th: {
      calSub: 'บันทึกวันสำคัญของเรา', calFoot: 'วันศุกร์ที่ 19 กุมภาพันธ์ 2570',
      ovalSub: 'วันแห่งความรักของเรา', ovalNote: 'แล้วพบกันที่ห้องริมนที · SV City พระราม 3',
      dressNote: 'ร่วมแต่งกายโทนสีนี้ เพื่อให้ภาพวันนี้สวยไปด้วยกัน',
      galSub: 'ความทรงจำของเราสองคน', galLine: 'JIB & MAC · 2027',
      yesSub: 'วันที่ฉันตอบตกลง', yesQuote: '“จากวันนั้นที่บอกว่า YES… สู่วันที่เราจะเดินไปด้วยกันตลอดไป”',
      giftSub: 'ร่วมแสดงความยินดี', giftNote: 'การมาร่วมงานของทุกท่านคือของขวัญที่ดีที่สุด หากประสงค์ร่วมอวยพรเพิ่มเติม สแกนได้ที่นี่',
      giftName: 'พร้อมเพย์ · วันเพ็ญ', days: ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
    },
    en: {
      calSub: 'Save our special date', calFoot: 'Friday, 19 February 2027',
      ovalSub: 'The day we say I do', ovalNote: 'See you at Rimtara Room · SV City Rama 3',
      dressNote: 'Please join us in these colours so our memories match beautifully.',
      galSub: 'Little moments of us', galLine: 'JIB & MAC · 2027',
      yesSub: 'Our love story', yesQuote: '“From the day I said yes… to every day after, together.”',
      giftSub: 'With love', giftNote: 'Your presence is the greatest gift. If you wish to send your blessing, you can scan here.',
      giftName: 'PromptPay · Wanpen', days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    },
    ja: {
      calSub: '大切な日を空けておいてください', calFoot: '2027年2月19日（金）',
      ovalSub: '二人の特別な日', ovalNote: 'SV City ラマ3世通り リムタラ ルームでお待ちしています',
      dressNote: 'この色合いでお越しいただけると嬉しいです',
      galSub: '二人の思い出', galLine: 'JIB & MAC · 2027',
      yesSub: '「はい」と答えた日', yesQuote: '「あの日の YES から、これからもずっと一緒に」',
      giftSub: 'お祝い', giftNote: 'ご出席いただけることが何よりの贈り物です。お祝いはこちらからどうぞ。',
      giftName: 'PromptPay · Wanpen', days: ['月', '火', '水', '木', '金', '土', '日']
    }
  };
  var t = T[L] || T.th;
  document.documentElement.classList.add('js-v2');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function band(tone, id, inner) {
    var s = el('section', 'v2-band ' + tone); if (id) s.id = id;
    var i = el('div', 'v2-in', inner); s.appendChild(i); return s;
  }
  function head(title, sub) { return '<h2 class="v2-script v2-pop">' + title + '</h2><p class="v2-sub v2-pop" style="--d:.1s">' + sub + '</p>'; }

  /* 1) รูปวงกลมบ่าวสาว */
  var people = document.querySelectorAll('#invite .person');
  ['photos/bride.jpg', 'photos/groom.jpg'].forEach(function (src, i) {
    if (!people[i]) return;
    var f = el('div', 'p-photo v2-pop', '<img src="' + src + '" alt="" loading="lazy">');
    f.style.setProperty('--d', (i * .15) + 's');
    people[i].insertBefore(f, people[i].firstChild);
  });

  /* 2) ปฏิทินกุมภาพันธ์ 2027 (1 ก.พ. = วันจันทร์, 28 วัน) */
  var cells = t.days.map(function (d) { return '<span class="dw">' + d + '</span>'; }).join('');
  for (var d = 1; d <= 28; d++) cells += '<span' + (d === 19 ? ' class="day19"' : '') + '>' + d + '</span>';
  var calBand = band('blush', 'v2-calendar',
    head('Save the Date', t.calSub) +
    '<div class="v2-cal v2-pop" style="--d:.2s"><div class="v2-cal-h">February 2027</div>' +
    '<div class="v2-cal-grid">' + cells + '</div><p class="v2-cal-foot">' + t.calFoot + '</p></div>');
  var invite = document.getElementById('invite');
  if (invite) invite.insertAdjacentElement('afterend', calBand);

  /* 3) แกลเลอรีคอลลาจ แทนสไลด์เดิม */
  var shots = [
    ['studio-3.jpg', 'frame big'], ['studio-2.jpg', 'rect half tilt-l'], ['studio-4.jpg', 'rect half tilt-r'],
    ['prewed-02.jpg', 'circle third'], ['prewed-03.jpg', 'circle third'], ['prewed-04.jpg', 'circle third'],
    ['studio-1.jpg', 'frame c4']
  ];
  var g = shots.map(function (s, i) {
    return '<button type="button" class="v2-ph v2-pop ' + s[1] + '" style="--d:' + ((i % 3) * .12) + 's" data-src="photos/' + s[0] + '" aria-label="ดูรูป">' +
      '<img src="photos/' + s[0] + '" alt="" loading="lazy"></button>';
  }).join('');
  var galBand = band('cream', 'v2-gallery', head('Our Gallery', t.galSub) + '<div class="v2-collage">' + g + '</div><p class="v2-tagline v2-pop">' + t.galLine + '</p>');
  var moments = document.getElementById('moments');
  var anchor = moments || document.querySelector('#schedule') && document.querySelector('#schedule').closest('section');
  if (anchor) anchor.insertAdjacentElement(moments ? 'beforebegin' : 'afterend', galBand);
  if (moments) moments.hidden = true;

  /* 4) The moment I said YES */
  var yesBand = band('butter', 'v2-story',
    head('The moment I said YES', t.yesSub) +
    '<div class="v2-story"><div class="v2-arch v2-pop" style="--d:.15s"><img src="photos/prewed-01.jpg" alt="" loading="lazy"></div>' +
    '<p class="v2-quote v2-pop" style="--d:.25s">' + t.yesQuote + '</p></div>');
  galBand.insertAdjacentElement('afterend', yesBand);

  /* 5) กรอบวงรี Our Special Day — หลังกำหนดการ/แผนที่ */
  var ovalBand = band('blush', 'v2-special',
    head('Our Special Day', t.ovalSub) +
    '<div class="v2-oval v2-pop" style="--d:.15s"><img src="photos/studio-3.jpg" alt="" loading="lazy"></div>' +
    '<p class="v2-note v2-pop" style="--d:.25s">' + t.ovalNote + '</p>');
  var after = document.querySelector('.sched-block') || document.getElementById('venue-map') || yesBand;
  after.insertAdjacentElement('afterend', ovalBand);

  /* 6) Dress code เป็นหัวใจ */
  var sw = document.querySelector('.swatches');
  if (sw) {
    var hearts = el('div', 'v2-hearts');
    sw.querySelectorAll('figure').forEach(function (f, i) {
      var c = f.querySelector('span').style.getPropertyValue('--sw');
      var h = el('figure', 'v2-pop', '<i style="--c:' + c + '"></i>');
      h.style.setProperty('--d', (i * .1) + 's');
      h.appendChild(f.querySelector('figcaption').cloneNode(true));
      hearts.appendChild(h);
    });
    sw.replaceWith(hearts);
  }

  /* 7) A Special Gift — ป้าย QR ห้อยพู่ หลังส่วน LINE */
  var tassel = '<svg class="v2-tassel" viewBox="0 0 26 60" aria-hidden="true"><circle cx="13" cy="6" r="5" fill="#b08a4a"/>' +
    '<path d="M8 12h10l3 46H5z" fill="#d9bf98"/><path d="M8 12h10v5H8z" fill="#b08a4a"/>' +
    '<path d="M9 20v36M12 20v38M15 20v38M18 20v36" stroke="#b08a4a" stroke-width=".7" opacity=".55"/></svg>';
  var giftBand = band('butter', 'v2-gift',
    head('A Special Gift', t.giftSub) +
    '<p class="v2-note v2-pop" style="--d:.15s">' + t.giftNote + '</p>' +
    '<div class="v2-gift v2-pop" style="--d:.25s"><div class="v2-gift-tag"><img src="photos/promptpay.png" alt="PromptPay QR">' +
    '<p>' + t.giftName + '</p></div>' + tassel + '</div>');
  var line = document.getElementById('lineAdd');
  (line || ovalBand).insertAdjacentElement('afterend', giftBand);

  /* lightbox ของคอลลาจ */
  var lb = el('div', 'v2-lb', '<img alt=""><button type="button" aria-label="ปิด">×</button>');
  lb.hidden = true; document.body.appendChild(lb);
  function closeLb() { lb.hidden = true; }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  galBand.addEventListener('click', function (e) {
    var b = e.target.closest('.v2-ph'); if (!b) return;
    lb.querySelector('img').src = b.getAttribute('data-src'); lb.hidden = false;
  });

  /* ลอยขึ้นเมื่อเลื่อนถึง */
  var pops = document.querySelectorAll('.v2-pop');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    pops.forEach(function (p) { io.observe(p); });
  } else pops.forEach(function (p) { p.classList.add('in'); });
})();
