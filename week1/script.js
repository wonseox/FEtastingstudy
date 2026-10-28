/* =========================================================
   1. 곡 목록
   ---------------------------------------------------------
   mp3 파일이 없어도 바로 들을 수 있도록, 악보(음 이름:박자)로
   소리를 직접 만들어 재생합니다.

   ▶ 내 mp3 파일로 바꾸려면:
     - 같은 폴더에 music 폴더를 만들고 mp3 파일을 넣은 뒤
     - 아래 곡 정보에서 notes, bpm 대신  src: "music/내노래.mp3"  를 쓰세요.
   ========================================================= */
const tracks = [
  {
    title: "다와가",
    artist: "뱃사공",
    colors: ["#ff9a8b", "#ff6a88"],
    src : "music/다와가.mp3"
  },
  {
    title: "youth",
    artist: "오왼",
    colors: ["#6a85ff", "#7de2d1"],
    src : "music/youth.mp3"
  },
  {
    title: "엘리제를 위하여",
    artist: "베토벤",
    colors: ["#f6d365", "#fda085"],
    src : "music/다와가.mp3"
  }
];

/* =========================================================
   2. 악보 → 소리 만들기 (src 가 있는 곡은 이 부분을 쓰지 않아요)
   ========================================================= */
const SAMPLE_RATE = 22050;
const OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// "C#4" 같은 음 이름 → 주파수(Hz)
function noteToFreq(name) {
  const m = name.match(/^([A-G])(#?)(\d)$/);
  const midi = 12 * (Number(m[3]) + 1) + OFFSETS[m[1]] + (m[2] ? 1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// 악보 문장 → WAV 파일 주소(blob URL)
function makeWavUrl(notesText, bpm) {
  const notes = notesText.split(" ").map(function (token) {
    const parts = token.split(":");
    return { name: parts[0], seconds: Number(parts[1]) * 60 / bpm };
  });

  const total = notes.reduce(function (sum, n) { return sum + n.seconds; }, 0);
  const samples = new Float32Array(Math.ceil(total * SAMPLE_RATE));

  let start = 0;
  notes.forEach(function (n) {
    const length = Math.floor(n.seconds * SAMPLE_RATE);
    if (n.name !== "R") {
      const freq = noteToFreq(n.name);
      for (let i = 0; i < length; i++) {
        const t = i / SAMPLE_RATE;
        const wave =
          Math.sin(2 * Math.PI * freq * t) +
          0.4 * Math.sin(4 * Math.PI * freq * t) +
          0.2 * Math.sin(6 * Math.PI * freq * t);
        const attack = Math.min(1, t / 0.01);          // 소리가 부드럽게 시작
        const decay = Math.exp(-2.5 * t / n.seconds);  // 점점 작아짐
        samples[start + i] = 0.3 * wave * attack * decay;
      }
    }
    start += length;
  });

  // 16비트 WAV 파일 형식으로 포장
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeText = function (offset, text) {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  writeText(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);                 // PCM
  view.setUint16(22, 1, true);                 // 모노
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 32767, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

/* =========================================================
   3. 화면 요소 가져오기
   ========================================================= */
const audio    = document.getElementById("audio");
const cover    = document.getElementById("cover");
const titleEl  = document.getElementById("title");
const artistEl = document.getElementById("artist");
const seek     = document.getElementById("seek");
const current  = document.getElementById("current");
const duration = document.getElementById("duration");
const playBtn  = document.getElementById("play");
const prevBtn  = document.getElementById("prev");
const nextBtn  = document.getElementById("next");
const volume   = document.getElementById("volume");
const list     = document.getElementById("list");

let index = 0;

/* =========================================================
   4. 기능
   ========================================================= */
// 초 → "m:ss"
function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

// 커버 색을 곡마다 다르게
function gradient(colors) {
  return "linear-gradient(135deg, " + colors[0] + ", " + colors[1] + ")";
}

// 곡 불러오기 (재생은 하지 않음)
function loadTrack(i) {
  index = i;
  const track = tracks[i];

  if (!track.src) {
    track.src = makeWavUrl(track.notes, track.bpm); // 처음 한 번만 만들기
  }
  audio.src = track.src;

  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  cover.style.background = gradient(track.colors);
  seek.value = 0;
  current.textContent = "0:00";
  duration.textContent = "0:00";

  // 재생목록에서 지금 곡만 active 클래스 붙이기
  document.querySelectorAll(".track").forEach(function (button, n) {
    button.classList.toggle("active", n === i);
  });
}

function playTrack(i) {
  loadTrack(i);
  audio.play();
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function prev() { playTrack((index - 1 + tracks.length) % tracks.length); }
function next() { playTrack((index + 1) % tracks.length); }

/* =========================================================
   5. 재생목록 그리기
   ========================================================= */
tracks.forEach(function (track, i) {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.className = "track";

  const thumb = document.createElement("span");
  thumb.className = "track-thumb";
  thumb.style.background = gradient(track.colors);

  const info = document.createElement("span");
  const name = document.createElement("span");
  name.className = "track-name";
  name.textContent = track.title;
  const by = document.createElement("span");
  by.className = "track-by";
  by.textContent = track.artist;
  info.append(name, by);

  button.append(thumb, info);
  button.addEventListener("click", function () { playTrack(i); });
  li.appendChild(button);
  list.appendChild(li);
});

/* =========================================================
   6. 이벤트 연결
   ========================================================= */
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

// 재생 / 일시정지 상태가 바뀔 때 버튼 모양과 LP판 회전을 맞춰요
audio.addEventListener("play", function () {
  playBtn.textContent = "⏸";
  playBtn.setAttribute("aria-label", "일시정지");
  cover.classList.add("playing");
});
audio.addEventListener("pause", function () {
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "재생");
  cover.classList.remove("playing");
});

// 곡 길이를 알게 되었을 때
audio.addEventListener("loadedmetadata", function () {
  seek.max = audio.duration;
  duration.textContent = formatTime(audio.duration);
});

// 재생 중 계속 호출: 바와 시간 갱신
audio.addEventListener("timeupdate", function () {
  seek.value = audio.currentTime;
  current.textContent = formatTime(audio.currentTime);
});

// 곡이 끝나면 다음 곡
audio.addEventListener("ended", next);

// 바를 움직이면 그 위치로 이동
seek.addEventListener("input", function () {
  audio.currentTime = seek.value;
});

// 볼륨 조절
volume.addEventListener("input", function () {
  audio.volume = volume.value;
});

/* =========================================================
   7. 시작
   ========================================================= */
audio.volume = volume.value;
loadTrack(0);