// === ФУНКЦИЯ ДЛЯ БУРГЕР МЕНЮ ===
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const burgerBtn = document.getElementById("burgerBtn");
  const overlay = document.getElementById("sidebarOverlay");
  
  if(sidebar && burgerBtn && overlay) {
    sidebar.classList.toggle("open");
    burgerBtn.classList.toggle("open");
    overlay.classList.toggle("open");
  }
}

function getDaysWord(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'дней';
  }
  if (lastDigit === 1) {
    return 'день';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }
  return 'дней';
}

// === СЧЕТЧИК ЛЮБВИ (12.10.2024) ===
const START_DATE = new Date(2024, 9, 12); // Месяцы в JS идут с 0 (9 - это октябрь)

function updateCounter() {
  const now = new Date();
  const diffTime = Math.abs(now - START_DATE);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const counterSpan = document.getElementById("loveCounter");
  if (counterSpan) {
    // Подставляем правильное слово в зависимости от количества дней
    counterSpan.textContent = diffDays + " " + getDaysWord(diffDays);
  }
}

// Запускаем счетчик
setInterval(updateCounter, 1000);
updateCounter();

// === ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ===
function showPage(pageId, btnElement) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-menu .nav-btn').forEach(b => b.classList.remove('active'));
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  if (btnElement) btnElement.classList.add('active');
  
  // Автоматически закрывать меню на мобилке после выбора страницы
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("open")) {
    toggleMenu();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-menu .nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pageId = btn.getAttribute('data-page');
    if (pageId) showPage(pageId, btn);
  });
});

// === ФОТОГАЛЕРЕЯ (50 фоток) ===
const photoCaptions = [
  "Самый лучший день 🥰","Твоя улыбка ✨","Милое свидание ☕","Навсегда вместе ❤️","Смешной момент 🤪",
  "Наши прогулки 🍁","Красавица моя 😍","Вместе уютно 🧸","Обожаю этот кадр 📸","Теплые объятия 🫂",
  "Свет моих очей 🌟","Сладкие воспоминания 🍧","Самая лучшая пара 🫶","Любимый взгляд 👀","Наш маленький секрет 🤫",
  "Счастливы вместе 💕","Согревает душу 🔥","В твоих руках 🤍","Поймали момент ⚡","Рядом с тобой хорошо 🕊️",
  "Яркий день ☀️","Твоя нежность 🌸","Вечерние прогулки 🌃","Моя вселенная 🪐","Магия момента ✨",
  "Улыбнись мне опять 🙂","Словно в кино 🎬","Только мы двое 🪐","Бесконечно люблю ∞","Вдохновение мое 🎨",
  "Красивый вечер 🥂","Солнечный зайчик 🐰","Половинка моя 🧩","Твоя поддержка важна ⚓","Гармония во всем ☯️",
  "Мечтатели ✨","Счастливые улыбки 😁","Лучшие воспоминания 💭","Хранитель моего сердца 🗝️","Самая родная 💞",
  "Покорила меня 🎯","Теплый уютный день ☕","Моя гордость 💎","Радость каждого дня 🎢","Любовь в воздухе 🎈",
  "Свежий ветер 🌬️","Сердца бьются в такт ❤️","Счастливый финал дня 🌅","Мой любимый ангел 👼","Впереди еще много нас ♾️"
];

const galleryDiv = document.getElementById("galleryGrid");
if (galleryDiv) {
  for (let i = 1; i <= 50; i++) {
    const idx = i-1;
    const caption = photoCaptions[idx] || "Наше фото 💕";
    const card = document.createElement("div");
    card.className = "photo-card";
    card.setAttribute("onclick", `openModal(this.querySelector('img').src)`);
    card.innerHTML = `<img src="img/photo${i}.jpg" onerror="this.src='https://picsum.photos/id/${60+i}/500/500?random=${i}'" alt="Фото"><div class="photo-caption">${caption}</div>`;
    galleryDiv.appendChild(card);
  }
}

function openModal(src) {
  const modal = document.getElementById("photoModal");
  const modalImg = document.getElementById("modalImg");
  if (modal && modalImg) {
    modalImg.src = src;
    modal.style.display = "flex";
  }
}

// === МУЗЫКАЛЬНЫЙ ПЛЕЕР ===
const songNames = [
  "Если весь мир замолчит","Ты - мой котенок","Спасибо, любимая", "Начало",
  "Когда тебе так тяжело", "Внутри нашего времени", "Момент", "Первое время",
  "Мы сильнее, чем вчера","Между обычными днями","Выше неба", "Первый поцелуй",
  "Мы как свет","Такая красивая","Зажигай", "За партой",
  "Навсегда звучим","Это про нас","Лето внутри нас", "Каникулы",
  "Между строк","По пути","Танцуй, пока горит ночь", "Новый первый год",
  "Тихо о главном","Просто с тобой", "Праздник внутри", "Билеты до Ярославля",
  "Лучик солнца","С тобой легче дышать","Ты сегодня сияешь", "Март и Апрель",
  "Дом", "Сценарий не писали","Твой день", "В разработке",
  "Мой восход","Это все про тебя","С днем рождения", "В разработке",
  "Иголки","Вкус лета","Каждый день", "В разработке",
  "Нормально", "Фонари", "Искры", "В разработке",
  "Оплот", "Громче, чем все", "Лето навсегда", "В разработке"
];

const playlistsMap = {
  all: [...Array(songNames.length).keys()],
  sad: [0,4,8,12,16,20,24,28,32,36,40,44,48].filter(i => i < songNames.length),
  happy: [1,5,9,13,17,21,25,29,33,37,41,45,49].filter(i => i < songNames.length),
  party: [2,6,10,14,18,22,26,30,34,38,42,46,50].filter(i => i < songNames.length),
  history: [3,7,11,15,19,23,27,31,35,39,43,47,51].filter(i => i < songNames.length)
};

let currentPlaylist = [...playlistsMap.all];
let currentSongIndex = null;
let isPlaying = false;

const songsContainer = document.getElementById("songs");
const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const playBtnCtrl = document.getElementById("playBtn");
const progressFillEl = document.getElementById("progressFill");
const currentTimeSpan = document.getElementById("currentTime");
const durationSpan = document.getElementById("duration");

function renderSongs() {
  if (!songsContainer) return;
  songsContainer.innerHTML = "";
  currentPlaylist.forEach(globalIndex => {
    const div = document.createElement("div");
    div.className = "song";
    if (currentSongIndex === globalIndex) div.classList.add("playing");
    div.innerHTML = `<div class="song-title">${songNames[globalIndex]}</div><div class="song-desc">💗 Для тебя</div>`;
    div.onclick = () => playSong(globalIndex);
    songsContainer.appendChild(div);
  });
}

function loadPlaylist(name, btnEl) {
  currentPlaylist = [...(playlistsMap[name] || playlistsMap.all)];
  document.querySelectorAll(".playlist-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderSongs();
}

function playSong(index) {
  if (index === undefined || !songNames[index]) return;
  
  const allVideos = document.querySelectorAll('.video-grid video');
  allVideos.forEach(v => v.pause());

  currentSongIndex = index;
  audio.src = `songs/song${index+1}.mp3`; // С фиксом папки songs/
  audio.play().catch(e => console.log("audio play error", e));
  isPlaying = true;
  if (playBtnCtrl) playBtnCtrl.textContent = "⏸️";
  if (titleEl) titleEl.textContent = songNames[index];
  renderSongs();
}

function togglePlay() {
  if (currentSongIndex === null) {
    if (currentPlaylist.length) playSong(currentPlaylist[0]);
    return;
  }
  if (isPlaying) {
    audio.pause();
    if (playBtnCtrl) playBtnCtrl.textContent = "▶️";
    isPlaying = false;
  } else {
    const allVideos = document.querySelectorAll('.video-grid video');
    allVideos.forEach(v => v.pause());

    audio.play();
    if (playBtnCtrl) playBtnCtrl.textContent = "⏸️";
    isPlaying = true;
  }
}

function nextSong() {
  if (!currentPlaylist.length) return;
  let idx = currentPlaylist.indexOf(currentSongIndex);
  if (idx === -1) idx = 0;
  const next = (idx + 1) % currentPlaylist.length;
  playSong(currentPlaylist[next]);
}
function prevSong() {
  if (!currentPlaylist.length) return;
  let idx = currentPlaylist.indexOf(currentSongIndex);
  if (idx === -1) idx = 0;
  const prev = (idx - 1 + currentPlaylist.length) % currentPlaylist.length;
  playSong(currentPlaylist[prev]);
}

function formatTime(sec) { if (isNaN(sec)) return "0:00"; const m = Math.floor(sec/60); const s = Math.floor(sec%60); return m + ":" + (s<10?"0"+s:s); }

if (audio) {
  audio.ontimeupdate = () => { if (audio.duration) { const percent = (audio.currentTime/audio.duration)*100; if(progressFillEl) progressFillEl.style.width = percent+"%"; if(currentTimeSpan) currentTimeSpan.textContent = formatTime(audio.currentTime); } };
  audio.onloadedmetadata = () => { if(durationSpan) durationSpan.textContent = formatTime(audio.duration); };
  audio.onended = nextSong;
}
const progressBarDiv = document.getElementById("progressBar");
if(progressBarDiv) progressBarDiv.onclick = (e) => { const rect = e.currentTarget.getBoundingClientRect(); const percent = (e.clientX - rect.left)/rect.width; if(audio.duration) audio.currentTime = percent * audio.duration; };

document.querySelectorAll(".playlist-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const listName = btn.getAttribute("data-playlist");
    if (listName) loadPlaylist(listName, btn);
  });
});

const allVideos = document.querySelectorAll('.video-grid video');
allVideos.forEach(video => {
  video.addEventListener('play', () => {
    if (audio && !audio.paused) {
      audio.pause();
      isPlaying = false;
      if (playBtnCtrl) playBtnCtrl.textContent = "▶️";
    }
    allVideos.forEach(otherVideo => {
      if (otherVideo !== video) otherVideo.pause();
    });
  });
});

renderSongs();

// === ЛОГИКА РАНДОМАЙЗЕРА ПРИЧИН ===
const loveReasons = [
  "Ты улыбаешься так, что у меня внутри всё тает. 🥰",
  "С тобой я могу быть настоящим собой и дурачиться как ребёнок. 🧸",
  "Твоя забота заставляет меня чувствовать себя самым нужным котиком на свете. 🫂",
  "У тебя самый милый и заразительный смех во всей вселенной. ✨",
  "Ты поддерживаешь меня даже в самых безумных идеях. За это я тебя обожаю! ⚓",
  "Твои глаза... в них можно смотреть бесконечно и забывать обо всём. 👀",
  "Рядом с тобой любые проблемы кажутся просто пустяком. 🕊️",
  "Ты невероятно талантливая и вдохновляешь меня становиться лучше каждый день. 🎨",
  "Мне безумно нравится просто держать тебя за руку и никуда не отпускать. ❤️",
  "Ты умеешь поднимать мне настроение одной лишь эсэмэской. 📱",
  "Твой невероятный музыкальный вкус (наш плеер тому доказательство!). 🎧",
  "Ты — мой самый лучший друг и любимая девочка в одном лице. 💞",
  "То, как ты морщишь носик или обижаешься — это запрещённый уровень милоты. 😍",
  "С тобой даже простое молчание становится уютным и особенным. ☕",
  "Потому что ты — моё лучшее решение в жизни. ♾️",
  "Ты мой самый любимый, пушистый и вредный котёнок. 🐾",
  "Даже если у тебя выдался супер-тяжёлый день, помни: ты со всем справишься, а я всегда рядом. 💪💗",
  "Ты моё персональное солнышко, которое светит даже через самые хмурые тучи. ☀️",
  "Пожелание дня: улыбнись прямо сейчас, тебе это безумно идёт! 😊",
  "Я готов отдать тебе все алмазы мира и все алмазы в Майнкрафте! 💎",
  "Мой самый главный и любимый геймер. С тобой хоть в огонь, хоть в шахту за углем. 🎮",
  "Ты заслуживаешь всего самого лучшего в этом мире, просто помни об этом. 🌟",
  "Если тебе вдруг станет грустно — закрой глаза и почувствуй, как сильно я тебя обнимаю. 🫂",
  "Никому не отдавай моё любимое худи, оно на тебе сидит в сто раз круче, чем на мне! 🧥",
  "Ты невероятная, сильная и очень умная девочка. Я безумно тобой горжусь. 🥇",
  "Пожалуйста, не забывай вовремя кушать и тепло одеваться. 🧦🥧",
  "Ты моё вдохновение для создания этого сайта и вообще для всего на свете. 💻❤️",
  "С тобой даже поездка в самом душном автобусе превращается в романтическое путешествие. 🚌💞",
  "Ты умеешь делать каждый день особенным, просто потому что ты в нём есть. 🗓️",
  "Посылаю тебе виртуальный кусь и миллион самых нежных поцелуев! 💋😼",
  "Ты заставляешь моё сердце биться чаще, даже когда просто проходишь мимо. 🔥",
  "Спасибо тебе за твою бесконечную нежность, теплоту и терпение. 🌸",
  "Помни: для меня ты всегда на первом месте. Что бы ни случилось. 🎯",
  "Ты — та самая искра, которая превратила мою жизнь в яркое и крутое приключение. ⚡",
  "Ложись спать пораньше, сонному котёнку нужно восстанавливать свои милые силы! 🥱🛌",
  "Ты лучше любого горячего шоколада греешь меня этой зимой и вообще в любое время года. 🍫",
  "Мы — лучшая команда во всей вселенной. Наш дуэт непобедим! 🤝🎭",
  "Ты моя маленькая радость и моё огромное счастье. 💝",
  "Мне так повезло найти тебя среди миллиардов людей. Это чистая магия. 🌌",
  "Пусть этот день принесёт тебе много поводов для твоей прекрасной улыбки! 🎰",
  "Ты котенок, которому официально разрешено воровать еду из моей тарелки.",
  "Твой голос для меня — самый лучший трек во всём этом плеере. 🎙️🎶",
  "Просто знай, что кто-то прямо сейчас думает о тебе и очень сильно скучает. 💭",
  "Ты особенная. Никогда не позволяй никому (и даже своим мыслям) заставить тебя в этом усомниться. 💎",
  "Обожаю наши локальные мемы, от которых смеёмся только мы двое. 🤪",
  "Ты наполняешь мою жизнь смыслом, уютом и кучей ярких красок. 🎨✨",
  "Самый красивый, милый и очаровательный цветочек в моём мире — это ты. 🌹",
  "Ты умеешь любить так искренне, что это меняет всё вокруг к лучшему. 🤍",
];

// Переменная, которая будет хранить индекс прошлой фразы
let lastReasonIndex = null;

function generateReason() {
  const display = document.getElementById("reasonDisplay");
  if (!display || loveReasons.length <= 1) return;
  
  // Добавляем красивый эффект затухания перед сменой текста
  display.style.opacity = 0;
  display.style.transform = "scale(0.95)";
  display.style.transition = "all 0.15s ease";
  
  setTimeout(() => {
    let randomIndex;
    
    // Цикл работает до тех пор, пока новый индекс совпадает с предыдущим
    do {
      randomIndex = Math.floor(Math.random() * loveReasons.length);
    } while (randomIndex === lastReasonIndex);
    
    // Запоминаем текущий индекс, чтобы он не выпал в следующий раз
    lastReasonIndex = randomIndex;
    
    // Меняем текст и плавно возвращаем видимость
    display.textContent = loveReasons[randomIndex];
    display.style.opacity = 1;
    display.style.transform = "scale(1)";
  }, 150);
}

// === ЛОГИКА ИГРОВЫХ ДОСТИЖЕНИЙ (30 АЧИВОК) ===
const gamesAchievements = [
  // Сюжетные / Начало
  { icon: "❤️", title: "Легендарное начало", desc: "Официально вступить в отношения 12 октября 2024 года.", rarity: "Сюжетная" },
  { icon: "💋", title: "Синхронизация сердец", desc: "Первый поцелуй, заблокировавший все посторонние шумы в мире.", rarity: "Сюжетная" },
  { icon: "🗓️", title: "Первый коннект", desc: "Начать переписку 2 июля 2024 и понять, что это надолго.", rarity: "Обычная" },
  
  // Майнкрафт / Игры
  { icon: "🟩", title: "Квадратная любовь", desc: "Построить первый совместный дом в Minecraft и не взорвать его крипером.", rarity: "Редкая" },
  { icon: "💎", title: "Алмазы для принцессы", desc: "Отдать ей всю найденную в шахте алмазную руду.", rarity: "Эпическая" },
  { icon: "🛌", title: "Рядом в кубах", desc: "Поставить две кровати рядом в Майнкрафте. Вы прекрасны.", rarity: "Секретная" },
  { icon: "⚔️", title: "Защитник года", desc: "Отбить любимую от толпы зомби и скелетов в ночной чащобе.", rarity: "Обычная" },
  { icon: "🎮", title: "Топ-Геймеры", desc: "Провести весь день за играми, забыв про существование остального мира.", rarity: "Золото" },

  // Поездки / Путешествия
  { icon: "🧳", title: "Первооткрыватели", desc: "Совершить первую совместную поездку в другой город 25 января 2025 года.", rarity: "Редкая" },
  { icon: "🚌", title: "Дорожный романс", desc: "Успешно пережить долгую поездку на автобусе/поезде, заснув на плече друг у друга.", rarity: "Обычная" },
  { icon: "🗺️", title: "Покорители новых локаций", desc: "Пройти пешком рекордное количество шагов.", rarity: "Редкая" },
  { icon: "🎒", title: "Тяжелая ноша", desc: "Нести все сумки и рюкзаки, пока она красиво идет рядом.", rarity: "Обычная" },

  // Творчество / Жизнь
  { icon: "🎭", title: "Звезды Бродвея", desc: "Поставить сценку вместе 26 декабря 2024. Творческий союз на максимум!", rarity: "Золото" },
  { icon: "🎄", title: "Новогоднее комбо", desc: "Встретить первый совместный Новый год под бенгальские огни.", rarity: "Сюжетная" },
  { icon: "🎂", title: "Лучший подарок", desc: "Отпраздновать день рождения вместе 20 марта.", rarity: "Обычная" },
  { icon: "🎉", title: "День Королевы", desc: "Сделать 9 апреля самым незабываемым днем.", rarity: "Эпическая" },
  { icon: "🗓️", title: "Полгода на орбите", desc: "Преодолеть отметку в 6 месяцев идеальных отношений 12 апреля 2025.", rarity: "Золото" },

  // Романтика / Милота
  { icon: "🫂", title: "Антистресс-объятия", desc: "Обнять так сильно, чтобы разом прошли все тревоги и усталость.", rarity: "Обычная" },
  { icon: "👀", title: "Чтение мыслей", desc: "Посмотреть друг на друга и одновременно сказать одну и ту же глупость.", rarity: "Редкая" },
  { icon: "📞", title: "Ночной дозор", desc: "Проболтать по телефону или в дискорде до самого рассвета.", rarity: "Обычная" },
  { icon: "💬", title: "Спам любовью", desc: "Отправить за день более 500 сообщений и стикеров с сердечками.", rarity: "Обычная" },
  { icon: "📸", title: "Фотосессия без остановки", desc: "Сделать 50+ милых фоток за один день (и заполнить ими галерею сайта).", rarity: "Редкая" },
  
  // Юмор / Мемы
  { icon: "🤪", title: "Локальный мем", desc: "Придумать шутку, которую понимаете только вы двое.", rarity: "Обычная" },
  { icon: "🍕", title: "Фуд-шеринг", desc: "Отдать любимой последний, самый вкусный кусочек пиццы или ролл.", rarity: "Легендарная" },
  { icon: "🧸", title: "Похититель худи", desc: "Забрать любимую кофту/худи, и теперь это общая вещь.", rarity: "Легендарная" },
  { icon: "🥱", title: "Сонное царство", desc: "Синхронно зевнуть во время просмотра фильма.", rarity: "Обычная" },

  // Прокачка отношений
  { icon: "🩹", title: "Служба поддержки", desc: "Успокоить, привезти вкусняшек и поднять настроение, когда грустно.", rarity: "Эпическая" },
  { icon: "🔥", title: "Искра, буря, безумие", desc: "Почувствовать бабочки в животе спустя месяцы отношений так же, как в первый день.", rarity: "Платина" },
  { icon: "🎧", title: "Музыкальные критики", desc: "Вместе собрать этот плейлист и спорить, какой трек круче.", rarity: "Редкая" },
  { icon: "♾️", title: "Скрытая ачивка: Навсегда", desc: "Заблокировать это достижение невозможно, прогресс выполнения: бесконечность.", rarity: "Скрытая легенда" }
];

function renderAchievements() {
  const listEl = document.getElementById("achievementsList");
  if (!listEl) return;
  listEl.innerHTML = "";
  
  gamesAchievements.forEach(ach => {
    const card = document.createElement("div");
    card.className = "achievement-card";
    card.innerHTML = `
      <div class="achieve-icon">${ach.icon}</div>
      <div class="achieve-info">
        <h3>${ach.title} <span class="achieve-rarity">${ach.rarity}</span></h3>
        <p>${ach.desc}</p>
      </div>
    `;
    listEl.appendChild(card);
  });
}

// Запуск отрисовки
renderAchievements();