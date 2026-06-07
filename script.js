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
  "Между строк","По пути","Танцуй, пока горит ночь", "В разработке",
  "Тихо о главном","Просто с тобой", "Праздник внутри", "В разработке",
  "Лучик солнца","С тобой легче дышать","Ты сегодня сияешь", " В разработке",
  "Дом", "Сценарий не писали","Твой день", "В разработке",
  "Мой восход","Это все про тебя","С днем рождения", "В разработке",
  "Иголки","Вкус лета","Каждый день", "В разработке",
  "Нормально", "Фонари", "В разработке", "В разработке",
  "Оплот", "Громче, чем все", "В разработке", "В разработке"
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