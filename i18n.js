/* ระบบ 3 ภาษา (ไทย / English / 日本語)
   - เลือกภาษาจาก ?lang= → ค่าที่เคยเลือก → ภาษาเครื่อง → ไทย
   - ใส่ data-i18n="key" (ข้อความ), data-i18n-html (มี <br>), data-i18n-ph (placeholder)
   - ในสคริปต์เรียก t('key') หรือ t('key', {n: 3})
   ต้องโหลดหลัง config.js และก่อนสคริปต์ของหน้า */
(function () {
  var LANGS = ['th', 'en', 'ja'];
  var D = {
    th: {
      /* common */
      back: '← กลับหน้าแรก', nav_rsvp: 'ตอบรับคำเชิญ', nav_seat: 'ค้นหาที่นั่ง',
      conn_err: 'เชื่อมต่อไม่ได้ ลองอีกครั้ง',
      /* home */
      t_home: 'Jeep & Mac · งานแต่งงาน 19.02.2027',
      hero_nick: 'จิ๊บ & แม็ค', hero_day: 'ศุกร์', hero_time: '16:00 น.', hero_venue: 'ริมธารา Rimtara พระราม 3',
      cd_d: 'วัน', cd_h: 'ชั่วโมง', cd_m: 'นาที', cd_s: 'วินาที',
      invite_lead: 'สอง W หนึ่งรักตลอดไป',
      invite_text: 'มีความยินดีเรียนเชิญท่านร่วมเป็นเกียรติ<br>ในพิธีมงคลสมรสและงานเลี้ยงฉลอง ระหว่าง',
      bride_role: 'เจ้าสาว', bride_name: 'วันเพ็ญ เก่งกล้า', bride_nick: '(จิ๊บ)', bride_parent: 'บุตรีของ คุณเปรม เก่งกล้า',
      groom_role: 'เจ้าบ่าว', groom_name: 'วีระชัย จิตสุวรรณทยา', groom_nick: '(แม็ค)', groom_parent: 'บุตรของ คุณโสภา จิตสุวรรณทยา',
      when_h: 'วันและสถานที่', date_label: 'วันงาน', venue_label: 'สถานที่', map_btn: 'เปิด Google Maps',
      sched_h: 'กำหนดการ',
      dress_h: 'โทนสีการแต่งกาย', c_pink: 'ชมพูอ่อน', c_cream: 'ครีม', c_brown: 'น้ำตาล', c_gold: 'ทอง',
      dress_note: 'ขอความกรุณาร่วมแต่งกายในโทนสีข้างต้น เพื่อให้ภาพความทรงจำของวันนี้งดงามไปด้วยกัน',
      gallery_h: 'แบ่งปันความทรงจำ', gallery_desc: 'ร่วมเก็บภาพความประทับใจในวันของเราไว้ด้วยกัน',
      gallery_upload_btn: 'เพิ่มรูปของคุณ', gallery_view_btn: 'ชมภาพจากทุกคน',
      gallery_note: 'การเพิ่มรูปต้องลงชื่อเข้าใช้บัญชี Google แต่ผู้ที่มีลิงก์สามารถเปิดชมอัลบั้มได้',
      rsvp_h: 'ตอบรับคำเชิญ', checking: 'กำลังตรวจสอบ…',
      st_err: 'เชื่อมต่อไม่ได้', st_err_msg: 'ลองรีเฟรชหน้านี้อีกครั้ง หรือติดต่อแม็คโดยตรง',
      st_open: 'เปิดรับ RSVP อยู่', st_open_msg: 'กดปุ่ม "ตอบรับคำเชิญ" ด้านล่างเพื่อยืนยันการเข้าร่วมงาน',
      st_closed: 'ปิดรับ RSVP แล้ว', st_closed_msg: 'หากมีการเปลี่ยนแปลง กรุณาติดต่อแม็คโดยตรง',
      footer: 'ขอบคุณที่มาร่วมเป็นส่วนหนึ่งของความทรงจำ',
      /* rsvp */
      t_rsvp: 'ตอบรับคำเชิญ · Jeep & Mac',
      r_eyebrow: 'ขอเรียนเชิญ', r_h1: 'ตอบรับคำเชิญ', r_desc: 'กรอกรหัสคำเชิญที่ระบุในการ์ด/ข้อความเชิญ เพื่อยืนยันการเข้าร่วมงาน',
      r_step1: 'ยืนยันคำเชิญ', r_code: 'รหัสคำเชิญ (Party Code)', r_code_ph: 'เช่น ABC123', r_lookup: 'ค้นหา',
      r_notfound: 'ไม่พบรหัสคำเชิญนี้ ตรวจสอบอีกครั้งหรือติดต่อแม็ค',
      r_hello: 'สวัสดีครับ/ค่ะ คุณ{name}', r_max: 'จำนวนที่นั่งสูงสุด', r_seats: '{n} ที่นั่ง',
      r_step2: 'แจ้งจำนวนผู้ร่วมงาน', r_attending: 'จะเข้าร่วมงานหรือไม่', r_yes: 'มาร่วมงานแน่นอน', r_no: 'ไม่สามารถมาได้',
      r_people: 'รายชื่อผู้ที่จะเข้าร่วม', r_add: '+ เพิ่มรายชื่อ',
      r_pname: 'ชื่อ-นามสกุล', r_pnick: 'ชื่อเล่น', r_pdiet: 'อาหาร/แพ้อาหาร (ถ้ามี)', r_remove: 'ลบรายชื่อนี้',
      r_phone: 'เบอร์โทรติดต่อ (สำหรับติดต่อกลับเท่านั้น)', r_submit: 'ยืนยันการตอบรับ',
      r_over: 'เกินจำนวนที่นั่งสูงสุด ({n} ที่)', r_fillall: 'กรุณากรอกชื่อให้ครบทุกคน', r_needone: 'กรุณาเพิ่มรายชื่ออย่างน้อย 1 คน',
      r_closed: 'ขณะนี้ปิดรับการตอบรับแล้ว', r_exceeds: 'จำนวนรายชื่อเกินที่นั่งที่กำหนด ({n} ที่)',
      r_fail: 'ส่งไม่สำเร็จ ลองอีกครั้ง', r_ok: 'บันทึกการตอบรับเรียบร้อยแล้ว ขอบคุณครับ/ค่ะ 🙏',
      /* seat */
      t_seat: 'ค้นหาที่นั่ง · Jeep & Mac',
      s_eyebrow: 'พบกันที่งาน', s_h1: 'ค้นหาที่นั่งของคุณ', s_desc: 'พิมพ์ชื่อหรือชื่อเล่นเพื่อค้นหาเลขโต๊ะของคุณในงาน',
      s_step1: 'ค้นหาชื่อในรายชื่อแขก', s_label: 'ชื่อ หรือ ชื่อเล่น', s_ph: 'เช่น สมชาย หรือ ชาย', s_btn: 'ค้นหา',
      s_min: 'กรุณาพิมพ์อย่างน้อย 2 ตัวอักษร', s_none: 'ไม่พบชื่อนี้ในรายชื่อผู้ยืนยันเข้าร่วมงาน', s_table: 'โต๊ะ {n}'
    },
    en: {
      back: '← Back to home', nav_rsvp: 'RSVP', nav_seat: 'Find my seat',
      conn_err: 'Connection failed. Please try again.',
      t_home: 'Jeep & Mac · Wedding 19.02.2027',
      hero_nick: 'Jeep & Mac', hero_day: 'Fri', hero_time: '4:00 PM', hero_venue: 'Rimtara, Rama 3 · Bangkok',
      cd_d: 'Days', cd_h: 'Hours', cd_m: 'Min', cd_s: 'Sec',
      invite_lead: 'Two hearts, one story',
      invite_text: 'Together with our families, we joyfully request<br>the honour of your presence at the wedding of',
      bride_role: 'Bride', bride_name: 'Wanpen Kangkla', bride_nick: '"Jeep"', bride_parent: 'Daughter of Mrs. Prem Kangkla',
      groom_role: 'Groom', groom_name: 'Weerachai Jitsuwantaya', groom_nick: '"Mac"', groom_parent: 'Son of Mrs. Sopha Jitsuwantaya',
      when_h: 'Date & Venue', date_label: 'Date', venue_label: 'Venue', map_btn: 'Open in Google Maps',
      sched_h: 'Schedule',
      dress_h: 'Dress Code Colours', c_pink: 'Blush pink', c_cream: 'Cream', c_brown: 'Brown', c_gold: 'Gold',
      dress_note: "We'd love for you to dress in these tones so the memories of our day look beautiful together.",
      gallery_h: 'Shared Memories', gallery_desc: 'Help us collect the memories from our big day',
      gallery_upload_btn: 'Add your photos', gallery_view_btn: "See everyone's photos",
      gallery_note: 'Adding photos requires signing in with a Google account, but anyone with the link can view the album.',
      rsvp_h: 'Kindly Reply', checking: 'Checking…',
      st_err: 'Connection failed', st_err_msg: 'Please refresh this page, or contact Mac directly.',
      st_open: 'RSVP is open', st_open_msg: 'Tap "RSVP" below to confirm your attendance.',
      st_closed: 'RSVP is closed', st_closed_msg: 'For any changes, please contact Mac directly.',
      footer: 'Thank you for being part of our story',
      t_rsvp: 'RSVP · Jeep & Mac',
      r_eyebrow: "You're invited", r_h1: 'RSVP', r_desc: 'Enter the invitation code from your card or message to confirm your attendance.',
      r_step1: 'Verify your invitation', r_code: 'Invitation code (Party Code)', r_code_ph: 'e.g. ABC123', r_lookup: 'Look up',
      r_notfound: 'Invitation code not found. Please check again or contact Mac.',
      r_hello: 'Hello, {name}', r_max: 'Maximum seats', r_seats: '{n} seats',
      r_step2: 'Guest details', r_attending: 'Will you attend?', r_yes: 'Yes, I will attend', r_no: "Sorry, I can't make it",
      r_people: 'Guests attending', r_add: '+ Add guest',
      r_pname: 'Full name', r_pnick: 'Nickname', r_pdiet: 'Dietary needs / allergies (if any)', r_remove: 'Remove this guest',
      r_phone: 'Phone number (for follow-up only)', r_submit: 'Send my reply',
      r_over: 'You have reached the maximum of {n} seats', r_fillall: 'Please enter a name for every guest', r_needone: 'Please add at least 1 guest',
      r_closed: 'RSVP is now closed', r_exceeds: 'Too many guests for your invitation ({n} seats)',
      r_fail: 'Could not send. Please try again.', r_ok: 'Your reply has been saved. Thank you! 🙏',
      t_seat: 'Find my seat · Jeep & Mac',
      s_eyebrow: 'See you there', s_h1: 'Find your seat', s_desc: 'Type your name or nickname to find your table number.',
      s_step1: 'Search the guest list', s_label: 'Name or nickname', s_ph: 'e.g. Somchai', s_btn: 'Search',
      s_min: 'Please type at least 2 characters', s_none: 'This name was not found among confirmed guests', s_table: 'Table {n}'
    },
    ja: {
      back: '← ホームへ戻る', nav_rsvp: 'ご出欠の回答', nav_seat: 'お席を探す',
      conn_err: '接続できませんでした。もう一度お試しください。',
      t_home: 'Jeep & Mac · 結婚式 2027.02.19',
      hero_nick: 'ジップ & マック', hero_day: '金', hero_time: '16:00', hero_venue: 'リムターラ（ラマ3世通り・バンコク）',
      cd_d: '日', cd_h: '時間', cd_m: '分', cd_s: '秒',
      invite_lead: 'ふたりで紡ぐ、これからの物語。',
      invite_text: '私たちの結婚式ならびに披露宴に<br>ぜひご臨席賜りたく、ご案内申し上げます',
      bride_role: '新婦', bride_name: 'ワンペン・カンクラー', bride_nick: '（ジップ）', bride_parent: '母　プレーム・カンクラー',
      groom_role: '新郎', groom_name: 'ウィーラチャイ・ジットスワンタヤー', groom_nick: '（マック）', groom_parent: '母　ソーパー・ジットスワンタヤー',
      when_h: '日時・会場', date_label: '日時', venue_label: '会場', map_btn: 'Google マップで開く',
      sched_h: 'タイムスケジュール',
      dress_h: 'ドレスコード', c_pink: 'ペールピンク', c_cream: 'クリーム', c_brown: 'ブラウン', c_gold: 'ゴールド',
      dress_note: '当日の思い出がより美しく残るよう、上記のカラーでのご来場をお願いいたします。',
      gallery_h: '思い出の共有', gallery_desc: '当日の思い出をぜひ一緒に残してください',
      gallery_upload_btn: '写真を追加する', gallery_view_btn: 'みんなの写真を見る',
      gallery_note: '写真の追加にはGoogleアカウントでのログインが必要ですが、リンクをお持ちの方はどなたでもアルバムをご覧いただけます。',
      rsvp_h: 'ご出欠のご回答', checking: '確認中…',
      st_err: '接続できません', st_err_msg: 'ページを再読み込みするか、マックまで直接ご連絡ください。',
      st_open: '回答受付中', st_open_msg: '下の「ご出欠の回答」ボタンからご回答ください。',
      st_closed: '回答受付終了', st_closed_msg: '変更がある場合は、マックまで直接ご連絡ください。',
      footer: '私たちの大切な日にお越しいただき、ありがとうございます',
      t_rsvp: 'ご出欠の回答 · Jeep & Mac',
      r_eyebrow: 'ご招待', r_h1: 'ご出欠の回答', r_desc: '招待状またはメッセージに記載の招待コードを入力してください。',
      r_step1: '招待の確認', r_code: '招待コード（Party Code）', r_code_ph: '例：ABC123', r_lookup: '検索',
      r_notfound: '招待コードが見つかりません。再度ご確認いただくか、マックまでご連絡ください。',
      r_hello: '{name} 様', r_max: 'ご招待人数（上限）', r_seats: '{n} 名',
      r_step2: 'ご出席者の情報', r_attending: 'ご出欠', r_yes: '出席します', r_no: '欠席します',
      r_people: 'ご出席者のお名前', r_add: '+ 出席者を追加',
      r_pname: 'お名前（フルネーム）', r_pnick: 'ニックネーム', r_pdiet: '食事制限・アレルギー（あれば）', r_remove: 'この方を削除',
      r_phone: '電話番号（ご連絡用のみ）', r_submit: '回答を送信',
      r_over: 'ご招待人数の上限（{n} 名）に達しています', r_fillall: 'すべての出席者のお名前をご入力ください', r_needone: '出席者を1名以上追加してください',
      r_closed: '現在、回答の受付は終了しています', r_exceeds: '出席者数がご招待人数（{n} 名）を超えています',
      r_fail: '送信できませんでした。もう一度お試しください。', r_ok: 'ご回答を受け付けました。ありがとうございます🙏',
      t_seat: 'お席を探す · Jeep & Mac',
      s_eyebrow: '会場でお会いしましょう', s_h1: 'お席を探す', s_desc: 'お名前またはニックネームを入力して、テーブル番号をご確認ください。',
      s_step1: 'ゲストリストから検索', s_label: 'お名前またはニックネーム', s_ph: '例：ソムチャイ', s_btn: '検索',
      s_min: '2文字以上入力してください', s_none: '出席確定のゲストリストにこのお名前は見つかりませんでした', s_table: 'テーブル {n}'
    }
  };

  /* ข้อมูลงานจาก config.js (ภาษาไทย) → ฉบับแปล */
  var EVENT_I18N = {
    en: {
      dateText: 'Friday, 19 February 2027',
      venueName: 'Rimtara, Rama 3',
      venueRoom: 'Rim Natee Room, G Floor, SV City Building, Rama 3 Road, Bangkok',
      schedule: [
        { time: '4:00 PM', label: 'Engagement · Khan Maak procession · Tea ceremony · Water blessing' },
        { time: '6:00 PM', label: 'Wedding reception · Chinese banquet dinner' }
      ]
    },
    ja: {
      dateText: '2027年2月19日（金）',
      venueName: 'リムターラ（ラマ3世）',
      venueRoom: 'SVシティビル G階「リムナティ・ルーム」（バンコク ラマ3世通り）',
      schedule: [
        { time: '16:00', label: '婚約の儀・カンマーク行列・献茶の儀・水かけの儀' },
        { time: '18:00', label: '披露宴・中華料理のディナー' }
      ]
    }
  };

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var q = (location.search.match(/[?&]lang=(th|en|ja)/) || [])[1];
  var nav = (navigator.language || '').slice(0, 2);
  var lang = q || store('wed_lang') || (nav === 'ja' ? 'ja' : nav === 'en' ? 'en' : 'th');
  if (LANGS.indexOf(lang) < 0) lang = 'th';
  if (q) store('wed_lang', q);

  window.WED_LANG = lang;
  window.t = function (key, vars) {
    var s = (D[lang] && D[lang][key]) || D.th[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };

  if (window.WED_CONFIG && EVENT_I18N[lang]) {
    var ev = window.WED_CONFIG.EVENT, tr = EVENT_I18N[lang];
    Object.keys(tr).forEach(function (k) { ev[k] = tr[k]; });
  }

  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });

  /* ปุ่มสลับภาษา มุมขวาบน */
  var bar = document.createElement('div');
  bar.className = 'lang-switch';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Language');
  [['th', 'TH'], ['en', 'EN'], ['ja', 'JP']].forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = p[1];
    b.setAttribute('lang', p[0]);
    if (p[0] === lang) { b.className = 'on'; b.setAttribute('aria-pressed', 'true'); }
    b.addEventListener('click', function () {
      if (p[0] === lang) return;
      store('wed_lang', p[0]);
      var url = location.pathname + location.search.replace(/[?&]lang=(th|en|ja)/, '') + location.hash;
      location.replace(url);
    });
    bar.appendChild(b);
  });
  document.body.appendChild(bar);
})();
