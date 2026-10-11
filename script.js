'use strict';

/* ============================================================
   Хелперы
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const rand = (a, b) => Math.random() * (b - a) + a;

function plural(n, forms) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}
function pad2(n) { return String(n).padStart(2, '0'); }

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function safeStorage(kind, key, val) {
  try {
    const s = kind === 'session' ? sessionStorage : localStorage;
    if (val === undefined) return s.getItem(key);
    s.setItem(key, val);
  } catch (e) { return null; }
}

/* ============================================================
   Фон: летающие сердечки + взрыв сердечек
   ============================================================ */
(function initHearts() {
  const box = $('#hearts');
  if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const icons = ['💗', '💖', '💕', '✨', '💞', '🌸'];
  const count = window.innerWidth < 700 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = icons[i % icons.length];
    s.style.left = rand(0, 100) + '%';
    s.style.fontSize = rand(14, 30) + 'px';
    s.style.animationDuration = rand(14, 28) + 's';
    s.style.animationDelay = (-rand(0, 28)) + 's';
    box.appendChild(s);
  }
})();

function burst(x, y, n = 10) {
  const icons = ['💗', '💖', '💕', '💞', '✨'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'burst';
    s.textContent = icons[i % icons.length];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const ang = rand(0, Math.PI * 2), dist = rand(50, 140);
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * dist - 30 + 'px');
    s.style.setProperty('--rot', rand(-60, 60) + 'deg');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

/* ============================================================
   Приветственный экран
   ============================================================ */
(function initIntro() {
  const intro = $('#intro');
  if (!intro) return;
  if (safeStorage('session', 'entered') === '1') {
    intro.remove();
    return;
  }
  document.body.style.overflow = 'hidden';
  $('#introBtn').addEventListener('click', e => {
    burst(e.clientX, e.clientY, 14);
    safeStorage('session', 'entered', '1');
    intro.classList.add('gone');
    document.body.style.overflow = '';
    setTimeout(() => intro.remove(), 900);
  });
})();

/* ============================================================
   Навигация
   ============================================================ */
const sidebar = $('#sidebar');
const burgerBtn = $('#burgerBtn');
const overlay = $('#overlay');

function setMenu(open) {
  sidebar.classList.toggle('open', open);
  burgerBtn.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  burgerBtn.setAttribute('aria-expanded', String(open));
}
burgerBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
overlay.addEventListener('click', () => setMenu(false));

const PAGES = $$('.page').map(p => p.id);

function showPage(id, push = true) {
  if (!PAGES.includes(id)) id = 'home';
  $$('.page').forEach(p => p.classList.toggle('active', p.id === id));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === id));
  setMenu(false);
  if (push) {
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id !== 'videos') $$('.video-grid video').forEach(v => v.pause());
  if (id === 'sky') skyCtl.start(); else skyCtl.stop();
  observeReveals();
}
$$('.nav-btn').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));
window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));

/* ============================================================
   Появление при прокрутке
   ============================================================ */
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.12 })
  : null;

function observeReveals() {
  $$('.reveal:not(.in)').forEach(el => {
    if (revealObserver) revealObserver.observe(el); else el.classList.add('in');
  });
}

/* ============================================================
   Счётчик и годовщина
   ============================================================ */
const START = new Date(2024, 9, 12, 22, 51); // 12 октября 2024, 22:51
const START_SHIFT = START - new Date(2024, 9, 12); // 22 ч 51 мин от полуночи

function diffYMD(from, to) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) { m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function setCounter(id, labelId, n, forms) {
  $('#' + id).textContent = n;
  $('#' + labelId).textContent = plural(n, forms);
}

function updateCounter() {
  const now = new Date();
  // сдвигаем «сейчас» так, чтобы новый день отношений наступал в 22:51
  const { y, m, d } = diffYMD(START, new Date(now - START_SHIFT));
  setCounter('cYears', 'cYearsL', y, ['год', 'года', 'лет']);
  setCounter('cMonths', 'cMonthsL', m, ['месяц', 'месяца', 'месяцев']);
  setCounter('cDays', 'cDaysL', d, ['день', 'дня', 'дней']);

  const ms = now - START;
  const totalDays = Math.floor(ms / 864e5);
  $('#tDays').textContent = totalDays.toLocaleString('ru-RU');
  $('#tHours').textContent = Math.floor(ms / 36e5).toLocaleString('ru-RU');
  $('#tMinutes').textContent = Math.floor(ms / 6e4).toLocaleString('ru-RU');
  $('#sideDays').textContent = totalDays.toLocaleString('ru-RU');

  // ближайшая годовщина (в 22:51)
  let next = new Date(now.getFullYear(), START.getMonth(), START.getDate(), START.getHours(), START.getMinutes());
  const sameDay = now.toDateString() === next.toDateString();
  if (next < now && !sameDay) next = new Date(now.getFullYear() + 1, START.getMonth(), START.getDate(), START.getHours(), START.getMinutes());
  const years = next.getFullYear() - START.getFullYear();
  const msLeft = next - now;
  const card = $('#annivCard');
  const num = $('#annivNum');
  const yWord = plural(years, ['год', 'года', 'лет']);
  if (msLeft <= 0) {
    // годовщина уже наступила (до конца суток)
    num.classList.remove('hours');
    num.textContent = '🎉 Сегодня!';
    $('#annivText').textContent = `Нам ${years} ${yWord} вместе. С годовщиной, любимая! 💖`;
    card.classList.add('today');
  } else if (msLeft < 864e5) {
    // осталось меньше суток — часы, минуты и секунды
    const h = Math.floor(msLeft / 36e5);
    const mi = Math.floor((msLeft % 36e5) / 6e4);
    const se = Math.floor((msLeft % 6e4) / 1e3);
    num.classList.add('hours');
    num.textContent = `${h} ${plural(h, ['час', 'часа', 'часов'])} ${pad2(mi)} мин ${pad2(se)} сек`;
    $('#annivText').textContent = `до того, как нам исполнится ${years} ${yWord} вместе (в 22:51) 💞`;
    card.classList.remove('today');
  } else {
    const left = Math.floor(msLeft / 864e5);
    num.classList.remove('hours');
    num.textContent = `${left} ${plural(left, ['день', 'дня', 'дней'])}`;
    $('#annivText').textContent = `до того, как нам исполнится ${years} ${yWord} вместе 💞`;
    card.classList.remove('today');
  }
}
updateCounter();
setInterval(updateCounter, 1000);

/* ============================================================
   Хронология
   ============================================================ */
const timeline = [
  { date: '2 июля 2024', title: 'Первая переписка 🗓️', text: 'Начало отсчёта нашего с тобой общения.' },
  { date: '12 октября 2024', title: 'Начало отношений ❤️', text: 'День, когда мы официально стали парой и начали писать нашу общую историю любви.' },
  { date: '19 октября 2024', title: 'Первый поцелуй 💋', text: 'Момент, когда весь мир затих, уступив место стуку наших сердец.' },
  { date: '26 декабря 2024', title: 'Постановка сценки вместе 🎭', text: 'Наш творческий союз на сцене. Было безумно весело репетировать и зажигать вместе.' },
  { date: '31 декабря 2024', title: 'Первый Новый год 🎄', text: 'Волшебная зимняя ночь, бенгальские огни и самые искренние желания на двоих.' },
  { date: '25 января 2025', title: 'Первая совместная поездка 🧳', text: 'Дорога, новые виды и уютные разговоры. Наше первое маленькое путешествие.' },
  { date: '20 марта 2025', title: 'Мой день рождения вместе 🎂', text: 'Самый лучший подарок — твоё присутствие рядом и тепло твоих рук.' },
  { date: '9 апреля 2025', title: 'Твой день рождения 🎉', text: 'Праздник самой прекрасной и любимой девочки. День, когда всё цвело только для тебя.' },
  { date: '12 апреля 2025', title: 'Полгода отношений 🗓️', text: 'Половина счастливого года пролетела незаметно. 6 месяцев нежности, заботы и абсолютной любви.' },
  { date: '12 октября 2025', title: 'Год вместе 🥂', text: 'Целый год, полный смеха, музыки и самых тёплых моментов. И этот сайт родился именно тогда.' },
  { date: 'Осень 2025', title: 'Первые трудности 📚', text: 'Разные университеты, разные специальности, новое расписание. Было непросто, но мы справились и стали ещё ближе.' },
  { date: 'Конец 2025', title: 'Спасли друг друга 🛟', text: 'Когда одному из нас было особенно тяжело, другой оказался рядом. Мы доказали, что мы настоящая команда.' },
  { date: '31 декабря 2025', title: 'Новый год 2026 🎆', text: 'Второй наш Новый год. Куранты, мандарины и желание, чтобы так было всегда.' },
  { date: '20 марта 2026', title: 'Моё 18-летие 🎈', text: 'Мне исполнилось 18, и рядом снова была ты. Лучший способ войти во взрослую жизнь.' },
  { date: 'Август 2026', title: 'Наш первый отдых 🌴', text: 'Санаторий, тишина, прогулки и никаких забот. Первый настоящий отпуск только для нас двоих.' },
  { date: '12 октября 2026', title: 'Два года вместе 💍', text: 'Два года рядом. Я обновил наш уголок, потому что хочу, чтобы он рос вместе с нами.' },
  { date: 'Будущее…', title: 'Продолжение следует ✨', text: 'Впереди ещё сотни незабываемых дат, поездок и моментов, которые мы разделим вместе.', future: true }
];
(function renderTimeline() {
  const box = $('#timeline');
  timeline.forEach(t => {
    const item = document.createElement('div');
    item.className = 'tl-item reveal' + (t.future ? ' future' : '');
    item.innerHTML = `<div class="tl-card"><span class="tl-date">${t.date}</span><h3>${t.title}</h3><p>${t.text}</p></div>`;
    box.appendChild(item);
  });
})();

/* ============================================================
   Фотогалерея + лайтбокс
   ============================================================ */
const PHOTO_TOTAL = 50;
const photoCaptions = [
  'Самый лучший день 🥰', 'Твоя улыбка ✨', 'Милое свидание ☕', 'Навсегда вместе ❤️', 'Смешной момент 🤪',
  'Наши прогулки 🍁', 'Красавица моя 😍', 'Вместе уютно 🧸', 'Обожаю этот кадр 📸', 'Тёплые объятия 🫂',
  'Свет моих очей 🌟', 'Сладкие воспоминания 🍧', 'Самая лучшая пара 🫶', 'Любимый взгляд 👀', 'Наш маленький секрет 🤫',
  'Счастливы вместе 💕', 'Согревает душу 🔥', 'В твоих руках 🤍', 'Поймали момент ⚡', 'Рядом с тобой хорошо 🕊️',
  'Яркий день ☀️', 'Твоя нежность 🌸', 'Вечерние прогулки 🌃', 'Моя вселенная 🪐', 'Магия момента ✨',
  'Улыбнись мне опять 🙂', 'Словно в кино 🎬', 'Только мы двое 💫', 'Бесконечно люблю ∞', 'Вдохновение моё 🎨',
  'Красивый вечер 🥂', 'Солнечный зайчик 🐰', 'Половинка моя 🧩', 'Твоя поддержка важна ⚓', 'Гармония во всём ☯️',
  'Мечтатели ✨', 'Счастливые улыбки 😁', 'Лучшие воспоминания 💭', 'Хранитель моего сердца 🗝️', 'Самая родная 💞',
  'Покорила меня 🎯', 'Тёплый уютный день ☕', 'Моя гордость 💎', 'Радость каждого дня 🎢', 'Любовь в воздухе 🎈',
  'Свежий ветер 🌬️', 'Сердца бьются в такт ❤️', 'Счастливый финал дня 🌅', 'Мой любимый ангел 👼', 'Впереди ещё много нас ♾️'
];

const gallery = $('#galleryGrid');
let loadedPhotos = 0;

function updatePhotoCount() {
  const el = $('#photoCount');
  if (el) el.textContent = loadedPhotos ? `Всего кадров: ${loadedPhotos}.` : '';
}

(function renderGallery() {
  for (let i = 1; i <= PHOTO_TOTAL; i++) {
    const caption = photoCaptions[i - 1] || 'Наше фото 💕';
    const card = document.createElement('button');
    card.className = 'photo-card';
    card.type = 'button';
    card.innerHTML = `<img src="img/photo${i}.jpg" loading="lazy" alt="${caption}"><div class="photo-caption">${caption}</div>`;
    const img = card.querySelector('img');
    img.addEventListener('load', () => { img.classList.add('loaded'); loadedPhotos++; updatePhotoCount(); });
    img.addEventListener('error', () => card.remove());
    card.addEventListener('click', () => openLightbox(card));
    gallery.appendChild(card);
  }
})();

const lb = $('#lightbox');
let lbIndex = 0;
function lbItems() { return $$('.photo-card', gallery).filter(c => c.querySelector('img.loaded')); }

function openLightbox(card) {
  const items = lbItems();
  lbIndex = Math.max(0, items.indexOf(card));
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  renderLightbox();
}
function renderLightbox() {
  const items = lbItems();
  if (!items.length) return closeLightbox();
  lbIndex = (lbIndex + items.length) % items.length;
  const c = items[lbIndex];
  $('#lbImg').src = c.querySelector('img').currentSrc || c.querySelector('img').src;
  $('#lbCaption').textContent = c.querySelector('.photo-caption').textContent;
  $('#lbCount').textContent = `${lbIndex + 1} / ${items.length}`;
}
function closeLightbox() { lb.hidden = true; document.body.style.overflow = ''; }
$('#lbClose').addEventListener('click', closeLightbox);
$('#lbPrev').addEventListener('click', () => { lbIndex--; renderLightbox(); });
$('#lbNext').addEventListener('click', () => { lbIndex++; renderLightbox(); });
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lbIndex--; renderLightbox(); }
  if (e.key === 'ArrowRight') { lbIndex++; renderLightbox(); }
});
(function lbSwipe() {
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { lbIndex += dx < 0 ? 1 : -1; renderLightbox(); }
    x0 = null;
  });
})();

/* ============================================================
   Музыка
   ============================================================ */
const songNames = [
  'Если весь мир замолчит', 'Ты - мой котенок', 'Спасибо, любимая', 'Начало',
  'Когда тебе так тяжело', 'Внутри нашего времени', 'Момент', 'Первое время',
  'Мы сильнее, чем вчера', 'Между обычными днями', 'Выше неба', 'Первый поцелуй',
  'Мы как свет', 'Такая красивая', 'Зажигай', 'За партой',
  'Навсегда звучим', 'Это про нас', 'Лето внутри нас', 'Каникулы',
  'Между строк', 'По пути', 'Танцуй, пока горит ночь', 'В разработке',
  'Тихо о главном', 'Просто с тобой', 'Праздник внутри', 'В разработке',
  'Лучик солнца', 'С тобой легче дышать', 'Ты сегодня сияешь', 'В разработке',
  'Дом', 'Сценарий не писали', 'Твой день', 'В разработке',
  'Мой восход', 'Это все про тебя', 'С днем рождения', 'В разработке',
  'Иголки', 'Вкус лета', 'Каждый день', 'В разработке',
  'Нормально', 'Фонари', 'В разработке', 'В разработке',
  'Оплот', 'Громче, чем все', 'В разработке', 'В разработке'
].map(s => s.trim());

// индекс остаётся прежним => файл songs/song{index+1}.mp3 не меняется
const isReady = i => songNames[i] && songNames[i] !== 'В разработке';
const ALL_IDS = songNames.map((_, i) => i).filter(isReady);
const playlistsMap = {
  all: ALL_IDS,
  sad: ALL_IDS.filter(i => i % 4 === 0),
  happy: ALL_IDS.filter(i => i % 4 === 1),
  party: ALL_IDS.filter(i => i % 4 === 2),
  history: ALL_IDS.filter(i => i % 4 === 3)
};

const audio = $('#audio');
const songsBox = $('#songs');
const titleEl = $('#title');
const playBtn = $('#playBtn');
const disc = $('#disc');
const fillEl = $('#progressFill');
let currentPlaylist = playlistsMap.all;
let currentSong = null;
let isPlaying = false;
let shuffleOn = false;

audio.volume = 0.8;

function renderSongs() {
  songsBox.innerHTML = '';
  currentPlaylist.forEach((id, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'song' + (id === currentSong ? ' playing' : '') + (id === currentSong && !isPlaying ? ' paused' : '');
    b.innerHTML = `
      <div class="song-num">${n + 1}</div>
      <div class="eq"><i></i><i></i><i></i></div>
      <div class="song-body"><div class="song-title">${songNames[id]}</div><div class="song-desc">💗 Для тебя</div></div>`;
    b.addEventListener('click', () => (id === currentSong ? togglePlay() : playSong(id)));
    songsBox.appendChild(b);
  });
}

function setPlayingUI(on) {
  isPlaying = on;
  playBtn.textContent = on ? '⏸' : '▶';
  disc.classList.toggle('spin', on);
  $$('.song.playing', songsBox).forEach(s => s.classList.toggle('paused', !on));
}

function playSong(id) {
  if (!isReady(id)) return;
  $$('.video-grid video').forEach(v => v.pause());
  currentSong = id;
  audio.src = `songs/song${id + 1}.mp3`;
  audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  setPlayingUI(true);
  titleEl.textContent = songNames[id];
  renderSongs();
}

function togglePlay() {
  if (currentSong === null) {
    if (currentPlaylist.length) playSong(currentPlaylist[0]);
    return;
  }
  if (isPlaying) {
    audio.pause();
    setPlayingUI(false);
  } else {
    $$('.video-grid video').forEach(v => v.pause());
    audio.play().then(() => setPlayingUI(true)).catch(() => {});
    setPlayingUI(true);
  }
}

function step(dir) {
  if (!currentPlaylist.length) return;
  if (shuffleOn && currentPlaylist.length > 1) {
    let id;
    do { id = currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)]; } while (id === currentSong);
    return playSong(id);
  }
  let idx = currentPlaylist.indexOf(currentSong);
  if (idx === -1) idx = dir > 0 ? -1 : 0;
  playSong(currentPlaylist[(idx + dir + currentPlaylist.length) % currentPlaylist.length]);
}

function fmt(sec) {
  if (!isFinite(sec)) return '0:00';
  return Math.floor(sec / 60) + ':' + pad2(Math.floor(sec % 60));
}

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  fillEl.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  $('#currentTime').textContent = fmt(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => { $('#duration').textContent = fmt(audio.duration); });
audio.addEventListener('ended', () => step(1));
audio.addEventListener('error', () => {
  if (currentSong === null) return;
  toast('Не удалось загрузить трек 😔');
  setPlayingUI(false);
});

$('#progressBar').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});
$('#playBtn').addEventListener('click', togglePlay);
$('#prevBtn').addEventListener('click', () => step(-1));
$('#nextBtn').addEventListener('click', () => step(1));
$('#volume').addEventListener('input', e => { audio.volume = e.target.value; });
$('#shuffleSongBtn').addEventListener('click', e => {
  shuffleOn = !shuffleOn;
  e.currentTarget.classList.toggle('on', shuffleOn);
  toast(shuffleOn ? 'Случайный порядок включён 🔀' : 'Обычный порядок');
});

$$('#playlistChips .chip').forEach(btn => btn.addEventListener('click', () => {
  $$('#playlistChips .chip').forEach(b => b.classList.toggle('active', b === btn));
  currentPlaylist = playlistsMap[btn.dataset.playlist] || playlistsMap.all;
  renderSongs();
}));

// видео и музыка не играют одновременно
$$('.video-grid video').forEach(v => v.addEventListener('play', () => {
  if (!audio.paused) { audio.pause(); setPlayingUI(false); }
  $$('.video-grid video').forEach(o => { if (o !== v) o.pause(); });
}));

renderSongs();

/* ============================================================
   Причины любви
   ============================================================ */
const loveReasons = [
  'Ты улыбаешься так, что у меня внутри всё тает. 🥰',
  'С тобой я могу быть настоящим собой и дурачиться как ребёнок. 🧸',
  'Твоя забота заставляет меня чувствовать себя самым нужным. 🫂',
  'У тебя самый милый смех во всей вселенной. ✨',
  'Ты поддерживаешь меня даже в самых безумных идеях. ⚓',
  'Твои глаза… в них можно смотреть бесконечно. 👀',
  'Рядом с тобой любые проблемы кажутся пустяком. 🕊️',
  'Ты невероятно талантливая и вдохновляешь меня каждый день. 🎨',
  'Мне безумно нравится просто держать тебя за руку. ❤️',
  'Ты умеешь поднимать мне настроение одним сообщением. 📱',
  'Твой музыкальный вкус — наш плеер тому доказательство! 🎧',
  'Ты — мой лучший друг и любимая девочка в одном лице. 💞',
  'То, как ты морщишь носик или обижаешься, — запрещённый уровень милоты. 😍',
  'С тобой даже молчание становится уютным и особенным. ☕',
  'Потому что ты — моё лучшее решение в жизни. ♾️',
  'Ты делаешь обычные дни особенными, даже ничего не делая. 🌤️',
  'Рядом с тобой я хочу становиться лучше. 🌱',
  'Ты помнишь мелочи, которые для меня важнее всего. 🧠',
  'Твои объятия — самое безопасное место на Земле. 🏠',
  'Ты умеешь удивлять, даже когда мне кажется, что я знаю тебя наизусть. 🎁',
  'Мне нравится, как ты говоришь, когда чем-то увлечена. 🎤',
  'Ты терпишь мои странности и любишь меня вместе с ними. 🫶',
  'С тобой мне хочется строить планы на будущее. 🗺️',
  'У тебя доброе сердце, и это чувствуется во всём. 💗',
  'Я скучаю по тебе, даже когда ты в соседней комнате. 🕰️',
  'Ты — моя любимая точка на любой карте. 📍',
  'Ты вдохновляешь меня просто тем, что ты есть. 🌟',
  'С тобой я смеюсь чаще, чем с кем-либо ещё. 😂',
  'Мне нравится засыпать и просыпаться с мыслью о тебе. 🌙',
  'За всё это время я ни разу не пожалел, что выбрал тебя. 💍',
  'Ты умеешь слушать так, будто для тебя нет ничего важнее. 👂',
  'Ты красивая и когда нарядная, и когда только проснулась. 🌷',
  'Ты превращаешь любую поездку в приключение. 🚉',
  'Мне нравится, как ты радуешься мелочам. 🍬',
  'С тобой я не боюсь быть неидеальным. 🪞',
  'Твоё «я рядом» помогает лучше любых лекарств. 🫖',
  'Ты — причина, по которой я жду выходных. 📆',
  'Рядом с тобой я становлюсь смелее. 🦁',
  'С тобой я чувствую себя дома, даже далеко от дома. 🏡',
  'Я люблю, как ты засыпаешь у меня на плече. 😴',
  'Ты не сдаёшься, даже когда сложно, и это меня восхищает. 💪',
  'Мы пережили первые трудности и стали только крепче. 🧱',
  'Ты умеешь спасать меня одним своим присутствием. 🛟',
  'Ты — моё любимое «спокойной ночи» и «доброе утро». 🌅',
  'Ты не даёшь мне опускать руки. 🔥',
  'С тобой любой Новый год становится волшебным. 🎆',
  'Ты делаешь мой день рождения настоящим праздником. 🎈',
  'Наши шутки понимаем только мы двое, и это наше секретное оружие. 🤭',
  'Ты умная, и мне нравится тебя слушать. 🎓',
  'Ты умеешь отдыхать вместе, а не просто рядом. 🌴',
  'Ты верила в меня, когда я сам в себя не верил. 🌠',
  'Мне нравится, как пахнут твои волосы. 🌸',
  'Ты заботишься обо мне, даже когда устала сама. 🍵',
  'Ты — мой самый красивый сюрприз судьбы. 🎀',
  'С тобой я научился не бояться трудностей. 🛡️',
  'Ты хранишь наши воспоминания так же бережно, как и я. 📔',
  'Ты обнимаешь так, что мир на минуту останавливается. 🌍',
  'С тобой хочется встречать каждую годовщину. 🥂',
  'Ты делаешь меня счастливым просто своим «привет». 👋',
  'Потому что мы выбираем друг друга снова и снова. 💫'
];

const REASONS_KEY = 'reasonsOpened';
const opened = new Set();
try {
  JSON.parse(safeStorage('local', REASONS_KEY) || '[]').forEach(i => {
    if (Number.isInteger(i) && i >= 0 && i < loveReasons.length) opened.add(i);
  });
} catch (e) { /* пустое хранилище */ }
let curReason = -1;

const reasonBox = $('#reasonBox');
const reasonGrid = $('#reasonGrid');

function splitReason(t) {
  const m = t.match(/^(.*\S)\s+(\S+)$/);
  return m ? { text: m[1], emoji: m[2] } : { text: t, emoji: '💗' };
}

function renderReasonGrid() {
  reasonGrid.innerHTML = '';
  loveReasons.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    const isOpen = opened.has(i);
    b.className = 'rtile' + (isOpen ? ' open' : '') + (i === curReason ? ' cur' : '');
    if (isOpen) {
      const p = splitReason(t);
      b.innerHTML = `<div class="re">${p.emoji}</div><div class="rn">№${i + 1}</div><div class="rt">${p.text}</div>`;
    } else {
      b.innerHTML = `<div class="rn">${i + 1}</div><div class="rh">💗</div>`;
    }
    b.addEventListener('click', e => {
      showReason(i, e.clientX, e.clientY);
      reasonBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    reasonGrid.appendChild(b);
  });
}

function updateReasonMeter() {
  const total = loveReasons.length, n = opened.size;
  $('#reasonProgress').textContent = n === total
    ? 'Все причины открыты — и это только начало 💕'
    : `Открыто причин: ${n} из ${total}`;
  $('#reasonPct').textContent = Math.round((n / total) * 100) + '%';
  $('#reasonBar').style.width = (n / total) * 100 + '%';
}

function showReason(i, x, y) {
  if (x !== undefined) burst(x, y, 8);
  reasonBox.classList.add('swap');
  setTimeout(() => {
    curReason = i;
    opened.add(i);
    safeStorage('local', REASONS_KEY, JSON.stringify([...opened]));
    $('#reasonText').textContent = loveReasons[i];
    $('#reasonNum').textContent = `Причина №${i + 1}`;
    reasonBox.classList.remove('swap');
    renderReasonGrid();
    updateReasonMeter();
  }, 220);
}

$('#reasonBtn').addEventListener('click', e => {
  let pool = loveReasons.map((_, i) => i).filter(i => !opened.has(i));
  if (!pool.length) pool = loveReasons.map((_, i) => i).filter(i => i !== curReason);
  showReason(pool[Math.floor(Math.random() * pool.length)], e.clientX, e.clientY);
});

renderReasonGrid();
updateReasonMeter();

/* ============================================================
   Ачивки
   ============================================================ */
const rarityClass = {
  'Обычная': 'r-common', 'Сюжетная': 'r-story', 'Редкая': 'r-rare', 'Эпическая': 'r-epic',
  'Золото': 'r-gold', 'Легендарная': 'r-legend', 'Платина': 'r-plat', 'Секретная': 'r-secret', 'Скрытая легенда': 'r-hidden'
};
const achievements = [
  { icon: '❤️', title: 'Легендарное начало', desc: 'Официально вступить в отношения 12 октября 2024 года.', rarity: 'Сюжетная' },
  { icon: '💋', title: 'Синхронизация сердец', desc: 'Первый поцелуй, заблокировавший все посторонние шумы в мире.', rarity: 'Сюжетная' },
  { icon: '🗓️', title: 'Первый коннект', desc: 'Начать переписку 2 июля 2024 и понять, что это надолго.', rarity: 'Обычная' },
  { icon: '🟩', title: 'Квадратная любовь', desc: 'Построить первый совместный дом в Minecraft и не взорвать его крипером.', rarity: 'Редкая' },
  { icon: '💎', title: 'Алмазы для принцессы', desc: 'Отдать ей всю найденную в шахте алмазную руду.', rarity: 'Эпическая' },
  { icon: '🛌', title: 'Рядом в кубах', desc: 'Поставить две кровати рядом в Майнкрафте. Вы прекрасны.', rarity: 'Секретная' },
  { icon: '⚔️', title: 'Защитник года', desc: 'Отбить любимую от толпы зомби и скелетов в ночной чащобе.', rarity: 'Обычная' },
  { icon: '🎮', title: 'Топ-геймеры', desc: 'Провести весь день за играми, забыв про существование остального мира.', rarity: 'Золото' },
  { icon: '🧳', title: 'Первооткрыватели', desc: 'Совершить первую совместную поездку в другой город 25 января 2025 года.', rarity: 'Редкая' },
  { icon: '🚌', title: 'Дорожный романс', desc: 'Успешно пережить долгую поездку, заснув на плече друг у друга.', rarity: 'Обычная' },
  { icon: '🗺️', title: 'Покорители новых локаций', desc: 'Пройти пешком рекордное количество шагов.', rarity: 'Редкая' },
  { icon: '🎒', title: 'Тяжёлая ноша', desc: 'Нести все сумки и рюкзаки, пока она красиво идёт рядом.', rarity: 'Обычная' },
  { icon: '🎭', title: 'Звёзды Бродвея', desc: 'Поставить сценку вместе 26 декабря 2024. Творческий союз на максимум!', rarity: 'Золото' },
  { icon: '🎄', title: 'Новогоднее комбо', desc: 'Встретить первый совместный Новый год под бенгальские огни.', rarity: 'Сюжетная' },
  { icon: '🎂', title: 'Лучший подарок', desc: 'Отпраздновать день рождения вместе 20 марта.', rarity: 'Обычная' },
  { icon: '🎉', title: 'День королевы', desc: 'Сделать 9 апреля самым незабываемым днём.', rarity: 'Эпическая' },
  { icon: '🗓️', title: 'Полгода на орбите', desc: 'Преодолеть отметку в 6 месяцев идеальных отношений 12 апреля 2025.', rarity: 'Золото' },
  { icon: '🥂', title: 'Год позади', desc: 'Дойти до первой годовщины 12 октября 2025 и не сбавить обороты.', rarity: 'Золото' },
  { icon: '💍', title: 'Два года в строю', desc: 'Встретить вторую годовщину 12 октября 2026. Уровень сложности: легко, потому что вместе.', rarity: 'Эпическая' },
  { icon: '🫂', title: 'Антистресс-объятия', desc: 'Обнять так сильно, чтобы разом прошли все тревоги и усталость.', rarity: 'Обычная' },
  { icon: '👀', title: 'Чтение мыслей', desc: 'Посмотреть друг на друга и одновременно сказать одну и ту же глупость.', rarity: 'Редкая' },
  { icon: '📞', title: 'Ночной дозор', desc: 'Проболтать по телефону или в дискорде до самого рассвета.', rarity: 'Обычная' },
  { icon: '💬', title: 'Спам любовью', desc: 'Отправить за день более 500 сообщений и стикеров с сердечками.', rarity: 'Обычная' },
  { icon: '📸', title: 'Фотосессия без остановки', desc: 'Сделать 50+ милых фоток за один день (и заполнить ими галерею сайта).', rarity: 'Редкая' },
  { icon: '🤪', title: 'Локальный мем', desc: 'Придумать шутку, которую понимаете только вы двое.', rarity: 'Обычная' },
  { icon: '🍕', title: 'Фуд-шеринг', desc: 'Отдать любимой последний, самый вкусный кусочек пиццы или ролл.', rarity: 'Легендарная' },
  { icon: '🧸', title: 'Похититель худи', desc: 'Забрать любимую кофту или худи, и теперь это общая вещь.', rarity: 'Легендарная' },
  { icon: '🥱', title: 'Сонное царство', desc: 'Синхронно зевнуть во время просмотра фильма.', rarity: 'Обычная' },
  { icon: '🩹', title: 'Служба поддержки', desc: 'Успокоить, привезти вкусняшек и поднять настроение, когда грустно.', rarity: 'Эпическая' },
  { icon: '🔥', title: 'Искра, буря, безумие', desc: 'Чувствовать бабочек в животе спустя месяцы отношений так же, как в первый день.', rarity: 'Платина' },
  { icon: '🎧', title: 'Музыкальные критики', desc: 'Вместе собрать этот плейлист и спорить, какой трек круче.', rarity: 'Редкая' },
  { icon: '📚', title: 'Разные университеты', desc: 'Начать учиться в разных местах и не потерять друг друга.', rarity: 'Эпическая' },
  { icon: '🧠', title: 'Разные специальности', desc: 'Объяснять друг другу свою учёбу и делать вид, что всё поняли.', rarity: 'Обычная' },
  { icon: '🛟', title: 'Спасение утопающего', desc: 'Вытащить друг друга из тяжёлого момента.', rarity: 'Легендарная' },
  { icon: '🛡️', title: 'Закалка трудностями', desc: 'Пройти первые испытания отношений и стать сильнее.', rarity: 'Золото' },
  { icon: '🎆', title: 'Новый год 2026', desc: 'Встретить 31 декабря второй совместный Новый год.', rarity: 'Сюжетная' },
  { icon: '🥂', title: 'Загадай желание', desc: 'Загадать под бой курантов одно и то же желание.', rarity: 'Редкая' },
  { icon: '🎈', title: 'Совершеннолетие', desc: 'Отпраздновать 18-летие вместе 20 марта 2026.', rarity: 'Эпическая' },
  { icon: '🕯️', title: 'Задуть все свечи', desc: 'Не отвлекаться на торт и успеть загадать желание.', rarity: 'Обычная' },
  { icon: '🌴', title: 'Первый отпуск', desc: 'Съездить вдвоём в санаторий в августе 2026.', rarity: 'Золото' },
  { icon: '🧖', title: 'Режим релакса', desc: 'Провести целый день без суеты, ничего не планируя.', rarity: 'Редкая' },
  { icon: '🍽️', title: 'Санаторное питание', desc: 'Пробовать всё меню по очереди и выбирать любимое.', rarity: 'Обычная' },
  { icon: '🌅', title: 'Рассвет на двоих', desc: 'Встретить рассвет и не пожалеть о недосыпе.', rarity: 'Редкая' },
  { icon: '🌌', title: 'Звёздные мечтатели', desc: 'Смотреть на небо и придумывать названия созвездиям.', rarity: 'Эпическая' },
  { icon: '📱', title: 'Всегда на связи', desc: 'Отвечать друг другу быстрее, чем кто-либо ещё.', rarity: 'Обычная' },
  { icon: '🗓️', title: 'Мастер расписаний', desc: 'Найти время на встречу при самом сумасшедшем графике.', rarity: 'Редкая' },
  { icon: '📖', title: 'Сессия пройдена', desc: 'Поддерживать друг друга во время экзаменов и зачётов.', rarity: 'Золото' },
  { icon: '☕', title: 'Кофе для героя', desc: 'Привезти тёплый напиток тому, кто не спал над конспектами.', rarity: 'Обычная' },
  { icon: '🎁', title: 'Мастер сюрпризов', desc: 'Сделать приятный сюрприз без всякого повода.', rarity: 'Эпическая' },
  { icon: '🎬', title: 'Киноклуб на двоих', desc: 'Досмотреть фильм до конца, не уснув на плече.', rarity: 'Обычная' },
  { icon: '🍜', title: 'Мишлен у нас дома', desc: 'Приготовить вместе ужин, который почти получился.', rarity: 'Редкая' },
  { icon: '🌧️', title: 'Под одним зонтом', desc: 'Идти домой под дождём и не заметить, что промокли.', rarity: 'Обычная' },
  { icon: '🔐', title: 'Общий секрет', desc: 'Хранить тайну, о которой знаете только вы двое.', rarity: 'Секретная' },
  { icon: '🏅', title: 'Верность до конца', desc: 'Не отказаться друг от друга, даже когда было тяжело.', rarity: 'Платина' },
  { icon: '🧩', title: 'Недостающий пазл', desc: 'Понять, что вы подходите друг другу идеально.', rarity: 'Легендарная' },
  { icon: '💌', title: 'Письмо от сердца', desc: 'Написать признание, которое хочется перечитывать.', rarity: 'Редкая' },
  { icon: '🌍', title: 'Целый мир на двоих', desc: 'Составить список мест, куда обязательно поедете вместе.', rarity: 'Эпическая' },
  { icon: '🐾', title: 'Следы рядом', desc: 'Пройтись по свежему снегу, оставляя две цепочки следов.', rarity: 'Обычная' },
  { icon: '🔮', title: 'Предсказатель', desc: 'Угадать мысли друг друга за секунду до слов.', rarity: 'Секретная' },
  { icon: '🏡', title: 'Мечта о доме', desc: 'Представить, как будет выглядеть ваш общий дом.', rarity: 'Золото' },
  { icon: '🌠', title: 'Второй год на орбите', desc: 'Дойти до второй годовщины и захотеть большего.', rarity: 'Платина' },
  { icon: '♾️', title: 'Скрытая ачивка: Навсегда', desc: 'Заблокировать это достижение невозможно, прогресс выполнения: бесконечность.', rarity: 'Скрытая легенда' }
];
(function renderAchievements() {
  const list = $('#achievementsList');
  achievements.forEach(a => {
    const card = document.createElement('div');
    card.className = `ach reveal ${rarityClass[a.rarity] || 'r-common'}`;
    card.innerHTML = `
      <div class="ach-icon">${a.icon}</div>
      <div><h3>${a.title}<span class="ach-rarity">${a.rarity}</span></h3><p>${a.desc}</p></div>`;
    list.appendChild(card);
  });
  $('#achCount').textContent = `${achievements.length} / ${achievements.length}`;
})();

/* ============================================================
   Звёздное небо
   ============================================================ */
const skyCtl = (function () {
  const wrap = $('#skyWrap');
  const cv = $('#skyCanvas');
  const ctx = cv.getContext('2d');
  const starsBox = $('#skyStars');
  const linesSvg = $('#skyLines');
  const body = $('#skyCardBody');
  const items = timeline;
  const n = items.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MONTHS = {
    'января': 'янв', 'февраля': 'фев', 'марта': 'мар', 'апреля': 'апр', 'мая': 'мая', 'июня': 'июн',
    'июля': 'июл', 'августа': 'авг', 'сентября': 'сен', 'октября': 'окт', 'ноября': 'ноя', 'декабря': 'дек'
  };

  let W = 0, H = 0, field = [], shoots = [];
  let raf = 0, running = false, nextShoot = 0, current = -1, revealed = false;
  const pos = [], starEls = [], lineEls = [];

  function shortDate(d) {
    if (/^Будущее/.test(d)) return 'скоро';
    if (/^(Осень|Конец|Август)/.test(d)) return d.replace('Август', 'авг');
    return d.replace(/^(\d+) (\S+) (\d{4})$/, (m, dd, mon, y) => `${dd} ${MONTHS[mon] || mon} ${y}`);
  }

  items.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'star' + (t.future ? ' future' : '');
    b.style.setProperty('--d', ((i * 0.83) % 3).toFixed(2) + 's');
    b.setAttribute('aria-label', t.title);
    b.innerHTML = `<span class="core"></span><span class="slabel ${i % 2 ? 'up' : 'down'}">${shortDate(t.date)}</span>`;
    b.addEventListener('click', () => select(i, true));
    starsBox.appendChild(b);
    starEls.push(b);
  });
  for (let k = 0; k < n - 1; k++) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('class', 'sline');
    linesSvg.appendChild(l);
    lineEls.push(l);
  }

  function layout() {
    const mobile = wrap.clientWidth < 640;
    wrap.classList.toggle('mobile', mobile);
    items.forEach((_, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      const jit = Math.sin(i * 12.9898) * 0.5;
      let x, y;
      if (mobile) {
        y = 7 + 58 * t;
        x = 50 + 30 * Math.sin(t * Math.PI * 3.2 + 0.4) + jit * 4;
      } else {
        x = 6 + 88 * t;
        y = 36 + 22 * Math.sin(t * Math.PI * 2.6 + 0.9) + jit * 5;
      }
      pos[i] = { x: Math.min(94, Math.max(6, x)), y: Math.min(72, Math.max(12, y)) };
      starEls[i].style.left = pos[i].x + '%';
      starEls[i].style.top = pos[i].y + '%';
    });
    lineEls.forEach((l, k) => {
      l.setAttribute('x1', pos[k].x); l.setAttribute('y1', pos[k].y);
      l.setAttribute('x2', pos[k + 1].x); l.setAttribute('y2', pos[k + 1].y);
    });
  }

  function resize() {
    layout();
    const r = wrap.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['255,255,255', '255,214,228', '214,196,255'];
    const count = Math.round((W * H) / 4200);
    field = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3, p: Math.random() * 6.28, s: Math.random() * 1.6 + 0.4,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
    draw(performance.now());
  }

  function shoot() {
    if (!W) return;
    shoots.push({
      x: rand(0, W * 0.65), y: rand(0, H * 0.35),
      vx: rand(7, 11), vy: rand(3, 5.5), life: 70, max: 70
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const sec = t / 1000;
    for (const s of field) {
      const a = reduce ? 0.7 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(sec * s.s + s.p));
      ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fill();
    }
    for (let k = shoots.length - 1; k >= 0; k--) {
      const m = shoots[k];
      m.x += m.vx; m.y += m.vy; m.life--;
      const tx = m.x - m.vx * 14, ty = m.y - m.vy * 14;
      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${Math.max(m.life / m.max, 0)})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      if (m.life <= 0 || m.x > W + 40 || m.y > H + 40) shoots.splice(k, 1);
    }
  }

  function loop(t) {
    if (!running) return;
    draw(t);
    if (t > nextShoot) { shoot(); nextShoot = t + rand(5000, 9000); }
    raf = requestAnimationFrame(loop);
  }

  function select(i, user) {
    current = ((i % n) + n) % n;
    starEls.forEach((el, k) => el.classList.toggle('active', k === current));
    lineEls.forEach((l, k) => l.classList.toggle('hot', k === current - 1 || k === current));
    const t = items[current];
    body.classList.add('swap');
    setTimeout(() => {
      $('#skyDate').textContent = t.date;
      $('#skyTitle').textContent = t.title;
      $('#skyText').textContent = t.text;
      $('#skyCount').textContent = `Звезда ${current + 1} из ${n}`;
      body.classList.remove('swap');
    }, user ? 160 : 0);
    if (user) {
      const r = starEls[current].getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 6);
      if (wrap.classList.contains('mobile')) $('#skyCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function reveal() {
    revealed = true;
    starEls.forEach((el, i) => setTimeout(() => el.classList.add('lit'), 150 + i * 140));
    lineEls.forEach((l, k) => setTimeout(() => l.classList.add('lit'), 300 + k * 140));
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    if (!revealed) {
      reveal();
      select(items.reduce((a, t, i) => (t.future ? a : i), 0), false);
    }
    nextShoot = performance.now() + 2500;
    if (reduce) { draw(0); running = false; return; }
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function wish(e) {
    if (!reduce) { shoot(); setTimeout(shoot, 350); }
    burst(e.clientX, e.clientY, 10);
    toast('Желание загадано 💫 Оно обязательно сбудется');
  }

  $('#skyPrev').addEventListener('click', () => select(current - 1, true));
  $('#skyNext').addEventListener('click', () => select(current + 1, true));
  $('#wishBtn').addEventListener('click', wish);

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (wrap.offsetParent !== null) resize(); }, 200);
  });

  return { start, stop };
})();

/* ============================================================
   Старт
   ============================================================ */
showPage(location.hash.slice(1) || 'home', false);
observeReveals();