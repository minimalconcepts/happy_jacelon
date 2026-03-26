const matrixCanvas = document.getElementById("matrixCanvas");
const textCanvas = document.getElementById("textCanvas");
const sceneFade = document.getElementById("sceneFade");
const fullscreenToggle = document.getElementById("fullscreenToggle");
const musicToggle = document.getElementById("musicToggle");
const soundtrack = document.getElementById("soundtrack");
const launchPrompt = document.getElementById("launchPrompt");
const startExperience = document.getElementById("startExperience");
const rotateMessage = document.getElementById("rotateMessage");
const introCopy = document.querySelector(".intro-copy");
const album = document.getElementById("album");
const albumTrack = document.getElementById("albumTrack");
const albumBanner = document.getElementById("albumBanner");
const albumPrompt = document.getElementById("albumPrompt");
const albumCountdown = document.getElementById("albumCountdown");
const finalScene = document.getElementById("finalScene");
const curtainTop = document.getElementById("curtainTop");
const curtainBottom = document.getElementById("curtainBottom");
const heartCaption = document.getElementById("heartCaption");
const albumCards = Array.from(document.querySelectorAll(".memory-card"));
const albumImages = Array.from(document.querySelectorAll(".photo"));
const debugParams = new URLSearchParams(window.location.search);
const debugStage = debugParams.get("stage");
const debugFreeze = debugParams.get("freeze") === "1";

const matrixCtx = matrixCanvas.getContext("2d");
const textCtx = textCanvas.getContext("2d");

const state = {
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  matrixDrops: [],
  matrixFontSize: 16,
  matrixTimer: null,
  messageFrame: null,
  phase: "intro",
  resizeTimer: null,
  phraseTimer: null,
  albumTimer: null,
  phraseIndex: 0,
  currentBoard: null,
  albumCountdownStarted: false,
  albumHeartMode: false,
  musicReady: false,
  musicMissing: false,
  musicPlaying: false,
  isPaused: false,
  appStarted: false,
  resumeMusicOnUnpause: false,
  launchApproved: false,
  messageBackdropCanvas: null,
  messageBackdropKey: ""
};

const ledFont = {
  H: [[1, 0, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]],
  A: [[0, 1, 0], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]],
  P: [[1, 1, 0], [1, 0, 1], [1, 1, 0], [1, 0, 0], [1, 0, 0]],
  Y: [[1, 0, 1], [1, 0, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
  B: [[1, 1, 0], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 1, 0]],
  I: [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]],
  R: [[1, 1, 0], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 0, 1]],
  T: [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
  D: [[1, 1, 0], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 0]],
  E: [[1, 1, 1], [1, 0, 0], [1, 1, 0], [1, 0, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0]]
};

const ledWords = ["HAPPY", "BIRTHDAY", "BESTY"];
const phrases = [
  "Eres tan encantadora",
  "Eres tan unica|y especial",
  "Como un|Lamborghini Veneno",
  "Tan querida|como el rally",
  "Tan hermosa|como un Porsche 912",
  "Mirada fina|tipo Koenigsegg",
  "Corazon tierno|como un Miata",
  "Gracias|por ser tu",
  "Te amamos|como eres"
];
const lyricBackdropLines = [
  "feliz cumpleanos besty",
  "gracias por existir",
  "mi persona favorita",
  "siempre a tu lado",
  "brillas bonito",
  "eres luz en mi vida"
];
const debugPhraseIndex = Math.max(0, Math.min(phrases.length - 1, Number(debugParams.get("phrase") || 0)));
const ledGlyphs = buildGlyphMap({
  " ": "000/000/000/000/000/000/000",
  "?": "01110/10001/00010/00100/00100/00000/00100",
  A: "01110/10001/10001/11111/10001/10001/10001",
  B: "11110/10001/10001/11110/10001/10001/11110",
  C: "01111/10000/10000/10000/10000/10000/01111",
  D: "11110/10001/10001/10001/10001/10001/11110",
  E: "11111/10000/10000/11110/10000/10000/11111",
  F: "11111/10000/10000/11110/10000/10000/10000",
  G: "01111/10000/10000/10111/10001/10001/01110",
  H: "10001/10001/10001/11111/10001/10001/10001",
  I: "11111/00100/00100/00100/00100/00100/11111",
  J: "00111/00010/00010/00010/10010/10010/01100",
  K: "10001/10010/10100/11000/10100/10010/10001",
  L: "10000/10000/10000/10000/10000/10000/11111",
  M: "10001/11011/10101/10101/10001/10001/10001",
  N: "10001/11001/10101/10011/10001/10001/10001",
  O: "01110/10001/10001/10001/10001/10001/01110",
  P: "11110/10001/10001/11110/10000/10000/10000",
  Q: "01110/10001/10001/10001/10101/10010/01101",
  R: "11110/10001/10001/11110/10100/10010/10001",
  S: "01111/10000/10000/01110/00001/00001/11110",
  T: "11111/00100/00100/00100/00100/00100/00100",
  U: "10001/10001/10001/10001/10001/10001/01110",
  V: "10001/10001/10001/10001/10001/01010/00100",
  W: "10001/10001/10001/10101/10101/10101/01010",
  X: "10001/10001/01010/00100/01010/10001/10001",
  Y: "10001/10001/01010/00100/00100/00100/00100",
  Z: "11111/00001/00010/00100/01000/10000/11111",
  0: "01110/10001/10011/10101/11001/10001/01110",
  1: "00100/01100/00100/00100/00100/00100/01110",
  2: "01110/10001/00001/00010/00100/01000/11111",
  3: "11110/00001/00001/01110/00001/00001/11110",
  4: "00010/00110/01010/10010/11111/00010/00010",
  5: "11111/10000/10000/11110/00001/00001/11110",
  6: "01110/10000/10000/11110/10001/10001/01110",
  7: "11111/00001/00010/00100/01000/01000/01000",
  8: "01110/10001/10001/01110/10001/10001/01110",
  9: "01110/10001/10001/01111/00001/00001/01110"
});
const pauseResolvers = [];
const launchResolvers = [];

function setCanvasSize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);

  const width = window.innerWidth;
  const height = window.innerHeight;

  matrixCanvas.width = width * state.dpr;
  matrixCanvas.height = height * state.dpr;
  textCanvas.width = width * state.dpr;
  textCanvas.height = height * state.dpr;

  matrixCanvas.style.width = `${width}px`;
  matrixCanvas.style.height = `${height}px`;
  textCanvas.style.width = `${width}px`;
  textCanvas.style.height = `${height}px`;

  matrixCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  textCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  matrixCtx.imageSmoothingEnabled = false;
  textCtx.imageSmoothingEnabled = false;
  invalidateMessageBackdrop();

  resetMatrix();

  if (state.phase === "message-led" || state.phase === "debug-message") {
    state.currentBoard = createLedBoard(phrases[state.phraseIndex]);
    drawLedBoard(state.currentBoard, 1, performance.now());
  }
}

function resetMatrix() {
  const columns = Math.ceil(window.innerWidth / state.matrixFontSize);
  state.matrixDrops = Array.from(
    { length: columns },
    () => -Math.floor(Math.random() * 40) - 4
  );
}

function drawMatrix() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  matrixCtx.fillStyle = "rgba(2, 3, 10, 0.12)";
  matrixCtx.fillRect(0, 0, width, height);
  matrixCtx.fillStyle = "#ff4da6";
  matrixCtx.font = `${state.matrixFontSize}px monospace`;

  state.matrixDrops.forEach((drop, index) => {
    const char = String(Math.floor(Math.random() * 10));
    const x = index * state.matrixFontSize;
    const y = drop * state.matrixFontSize;

    if (y >= -state.matrixFontSize) {
      matrixCtx.fillText(char, x, y);
    }

    if (y > height && Math.random() > 0.975) {
      state.matrixDrops[index] = -Math.floor(Math.random() * 24);
    }

    state.matrixDrops[index] += 1;
  });
}

function startMatrix() {
  stopMatrix();
  matrixCtx.fillStyle = "#02030a";
  matrixCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  drawMatrix();
  state.matrixTimer = window.setInterval(drawMatrix, 42);
}

function stopMatrix() {
  if (state.matrixTimer) {
    window.clearInterval(state.matrixTimer);
    state.matrixTimer = null;
  }
}

function clearTextCanvas() {
  textCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function invalidateMessageBackdrop() {
  state.messageBackdropCanvas = null;
  state.messageBackdropKey = "";
}

async function wait(ms) {
  let remaining = ms;

  while (remaining > 0) {
    await waitForActiveScene();

    const step = Math.min(remaining, 60);
    await new Promise((resolve) => window.setTimeout(resolve, step));
    remaining -= step;
  }
}

function cancelMessageFrame() {
  if (state.messageFrame) {
    window.cancelAnimationFrame(state.messageFrame);
    state.messageFrame = null;
  }
}

function isPortraitMobile() {
  return window.innerWidth < 900 && window.innerHeight > window.innerWidth;
}

function resolvePauseWaiters() {
  while (pauseResolvers.length) {
    const resolve = pauseResolvers.shift();
    resolve();
  }
}

function waitForActiveScene() {
  if (!state.isPaused) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    pauseResolvers.push(resolve);
  });
}

async function applyPauseState(paused) {
  if (state.isPaused === paused) {
    return;
  }

  state.isPaused = paused;
  rotateMessage.classList.toggle("is-visible", paused);

  if (paused) {
    if (state.phase === "intro") {
      stopMatrix();
    }

    if (soundtrack && !soundtrack.paused && state.musicPlaying) {
      state.resumeMusicOnUnpause = true;
      soundtrack.pause();
    }

    return;
  }

  if (state.phase === "intro" && state.appStarted) {
    startMatrix();
  }

  if (state.resumeMusicOnUnpause && state.musicReady) {
    state.resumeMusicOnUnpause = false;

    try {
      await soundtrack.play();
      state.musicPlaying = true;
    } catch (error) {
      state.musicPlaying = false;
    }

    updateMusicToggle();
  }

  resolvePauseWaiters();
}

function syncOrientationState() {
  applyPauseState(isPortraitMobile());
}

function resolveLaunchWaiters() {
  while (launchResolvers.length) {
    const resolve = launchResolvers.shift();
    resolve();
  }
}

function waitForLaunchApproval() {
  if (state.launchApproved || debugStage) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    launchResolvers.push(resolve);
  });
}

function approveLaunch() {
  if (state.launchApproved) {
    return;
  }

  state.launchApproved = true;
  document.body.classList.remove("launch-mode");

  if (launchPrompt) {
    launchPrompt.classList.remove("is-visible");
  }

  resolveLaunchWaiters();
}

function setupLaunchPrompt() {
  if (!launchPrompt || !startExperience) {
    state.launchApproved = true;
    document.body.classList.remove("launch-mode");
    return;
  }

  if (debugStage) {
    state.launchApproved = true;
    launchPrompt.classList.remove("is-visible");
    document.body.classList.remove("launch-mode");
    return;
  }

  launchPrompt.classList.add("is-visible");
  startExperience.addEventListener("click", approveLaunch);
}

function setCanvasLayers({ matrixVisible, textVisible }) {
  matrixCanvas.style.display = matrixVisible ? "block" : "none";
  textCanvas.style.display = textVisible ? "block" : "none";
}

function updateMusicToggle() {
  if (!musicToggle) {
    return;
  }

  musicToggle.classList.toggle("is-playing", state.musicPlaying);
  musicToggle.classList.toggle("is-missing", state.musicMissing);
  musicToggle.setAttribute("aria-pressed", String(state.musicPlaying));

  if (state.musicMissing) {
    musicToggle.textContent = "Agregar cancion";
    return;
  }

  musicToggle.textContent = state.musicPlaying ? "Pausar musica" : "Musica";
}

async function toggleMusic() {
  if (!soundtrack || !musicToggle) {
    return;
  }

  if (state.musicMissing || !state.musicReady) {
    updateMusicToggle();
    return;
  }

  if (state.musicPlaying) {
    soundtrack.pause();
    state.musicPlaying = false;
    updateMusicToggle();
    return;
  }

  try {
    await soundtrack.play();
    state.musicPlaying = true;
  } catch (error) {
    state.musicPlaying = false;
  }

  updateMusicToggle();
}

function setupMusic() {
  if (!soundtrack || !musicToggle) {
    return;
  }

  soundtrack.volume = 0.58;

  const handleReady = () => {
    state.musicReady = true;
    state.musicMissing = false;
    updateMusicToggle();
  };

  const handleMissing = () => {
    state.musicReady = false;
    state.musicPlaying = false;
    state.musicMissing = true;
    updateMusicToggle();
  };

  soundtrack.addEventListener("canplay", handleReady);
  soundtrack.addEventListener("play", () => {
    state.musicPlaying = true;
    updateMusicToggle();
  });
  soundtrack.addEventListener("pause", () => {
    state.musicPlaying = false;
    updateMusicToggle();
  });
  soundtrack.addEventListener("error", handleMissing);
  musicToggle.addEventListener("click", toggleMusic);
  soundtrack.load();
  window.setTimeout(() => {
    if (!state.musicReady && (soundtrack.networkState === 3 || soundtrack.error)) {
      handleMissing();
    }
  }, 1200);
  updateMusicToggle();
}

function updateFullscreenToggle() {
  if (!fullscreenToggle) {
    return;
  }

  const supported = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);
  fullscreenToggle.classList.toggle("is-hidden", !supported);
  fullscreenToggle.classList.toggle("is-active", Boolean(document.fullscreenElement));
  fullscreenToggle.textContent = document.fullscreenElement ? "Salir pantalla" : "Pantalla completa";
}

async function toggleFullscreen() {
  if (!document.fullscreenEnabled || !document.documentElement.requestFullscreen) {
    updateFullscreenToggle();
    return;
  }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });

      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      }
    }
  } catch (error) {
    // Some mobile browsers silently reject fullscreen without a trusted gesture.
  }

  updateFullscreenToggle();
}

function setupFullscreen() {
  if (!fullscreenToggle) {
    return;
  }

  fullscreenToggle.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenToggle);
  updateFullscreenToggle();
}

async function animateLEDWord(word) {
  await waitForActiveScene();

  const isMobile = window.innerWidth < 700;
  const baseDotSize = isMobile ? 7 : 16;
  const baseSpacing = isMobile ? 5 : 10;
  const baseLetterGap = isMobile ? 11 : 30;

  function buildWordLeds(dotSize, spacing, letterGap) {
    const rawLeds = [];
    let cursorX = 0;

    for (let letterIndex = 0; letterIndex < word.length; letterIndex += 1) {
      const letter = ledFont[word[letterIndex]];
      if (!letter) {
        continue;
      }

      for (let row = 0; row < letter.length; row += 1) {
        for (let col = 0; col < letter[row].length; col += 1) {
          if (letter[row][col] !== 1) {
            continue;
          }

          rawLeds.push({
            x: cursorX + col * (dotSize + spacing),
            y: row * (dotSize + spacing)
          });
        }
      }

      cursorX += 3 * (dotSize + spacing) + letterGap;
    }

    return rawLeds;
  }

  let dotSize = baseDotSize;
  let spacing = baseSpacing;
  let letterGap = baseLetterGap;
  let rawLeds = buildWordLeds(dotSize, spacing, letterGap);
  let maxX = Math.max(...rawLeds.map((led) => led.x));
  const availableWidth = window.innerWidth * (isMobile ? 0.84 : 0.74);
  const wordWidth = maxX + dotSize;

  if (wordWidth > availableWidth) {
    const scale = Math.max(0.66, availableWidth / wordWidth);
    dotSize = Math.max(5, baseDotSize * scale);
    spacing = Math.max(3, baseSpacing * scale);
    letterGap = Math.max(7, baseLetterGap * scale);
    rawLeds = buildWordLeds(dotSize, spacing, letterGap);
    maxX = Math.max(...rawLeds.map((led) => led.x));
  }

  const maxY = Math.max(...rawLeds.map((led) => led.y));
  const offsetX = (window.innerWidth - (maxX + dotSize)) / 2;
  const offsetY = (window.innerHeight - (maxY + dotSize)) / 2;
  const leds = rawLeds.map((led) => ({
    x: Math.round(led.x + offsetX),
    y: Math.round(led.y + offsetY)
  }));

  clearTextCanvas();

  for (let index = 0; index < leds.length; index += 1) {
    const led = leds[index];

    textCtx.beginPath();
    textCtx.arc(led.x, led.y, dotSize / 2, 0, Math.PI * 2);
    textCtx.fillStyle = "#ff4da6";
    textCtx.shadowBlur = 16;
    textCtx.shadowColor = "#ff4da6";
    textCtx.fill();

    if (index % 2 === 0) {
      await wait(24);
    }
  }

  textCtx.shadowBlur = 0;
  await wait(760);
  clearTextCanvas();
  await wait(140);
}

async function playIntroSequence() {
  await waitForActiveScene();
  state.phase = "intro";
  setCanvasLayers({ matrixVisible: true, textVisible: true });
  introCopy.classList.add("is-visible");
  startMatrix();

  for (const word of ledWords) {
    await animateLEDWord(word);
    await wait(180);
  }

  introCopy.classList.remove("is-visible");
  await wait(500);
  await transitionToMessageScene();
  startMessageSequence();
}

async function transitionToMessageScene() {
  stopMatrix();

  if (sceneFade) {
    sceneFade.classList.add("is-active");
  }

  await wait(240);
  matrixCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  setCanvasLayers({ matrixVisible: false, textVisible: true });
  await wait(220);

  if (sceneFade) {
    sceneFade.classList.remove("is-active");
  }

  await wait(220);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function buildGlyphMap(rawMap) {
  const glyphs = {};

  Object.entries(rawMap).forEach(([char, rows]) => {
    glyphs[char] = rows.split("/");
  });

  return glyphs;
}

function normalizeLedChunk(message) {
  return message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLedMessage(message) {
  return normalizeLedChunk(String(message).replace(/[|\n]+/g, " "));
}

function getGlyph(char) {
  return ledGlyphs[char] || ledGlyphs["?"];
}

function getGlyphWidth(char) {
  return char === " " ? 3 : getGlyph(char)[0].length;
}

function splitLongLedWord(word, maxChars) {
  if (word.length <= maxChars) {
    return [word];
  }

  const parts = [];

  for (let index = 0; index < word.length; index += maxChars) {
    parts.push(word.slice(index, index + maxChars));
  }

  return parts;
}

function wrapLedMessage(message, maxChars) {
  const lines = [];
  const blocks = String(message)
    .replace(/\|/g, "\n")
    .split(/\n+/)
    .map((chunk) => normalizeLedChunk(chunk))
    .filter(Boolean);

  blocks.forEach((block) => {
    const words = block
      .split(" ")
      .flatMap((word) => splitLongLedWord(word, maxChars))
      .filter(Boolean);
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;

      if (candidate.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    });

    if (current) {
      lines.push(current);
    }
  });

  return lines;
}

function measureLedColumns(line) {
  let columns = 0;

  for (let index = 0; index < line.length; index += 1) {
    columns += getGlyphWidth(line[index]) + 1;
  }

  return Math.max(0, columns - 1);
}

function getLedPanel() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 700;
  const panelWidth = Math.min(width * 0.86, isMobile ? width - 28 : 760);
  const panelHeight = Math.min(height * 0.66, isMobile ? height - 34 : 320);
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  const padding = isMobile ? 18 : 26;

  return {
    x: panelX,
    y: panelY,
    width: panelWidth,
    height: panelHeight,
    padding,
    isMobile
  };
}

function chooseLedLayout(message, panel) {
  const normalizedMessage = normalizeLedMessage(message);
  const innerWidth = panel.width - panel.padding * 2;
  const innerHeight = panel.height - panel.padding * 2;
  const maxChars = Math.min(22, Math.max(9, normalizedMessage.length));
  const longestWordLength = Math.max(
    1,
    ...String(message)
      .replace(/\|/g, " ")
      .split(/\s+/)
      .map((word) => normalizeLedChunk(word).length)
      .filter(Boolean)
  );
  let bestLayout = null;

  for (let lineLength = maxChars; lineLength >= 8; lineLength -= 1) {
    if (lineLength < Math.min(longestWordLength, 14)) {
      continue;
    }

    const lines = wrapLedMessage(normalizedMessage, lineLength);

    if (!lines.length || lines.length > 4) {
      continue;
    }

    const textCols = Math.max(...lines.map((line) => measureLedColumns(line)));
    const textRows = lines.length * 7 + (lines.length - 1) * 2;
    const pitch = Math.floor(Math.min(innerWidth / textCols, innerHeight / textRows));

    if (pitch < 6) {
      continue;
    }

    const gap = Math.max(1, Math.round(pitch * 0.16));
    const cell = Math.max(4, pitch - gap);
    const gridCols = Math.max(textCols, Math.floor((innerWidth + gap) / pitch));
    const gridRows = Math.max(textRows, Math.floor((innerHeight + gap) / pitch));
    const score = pitch * 12 - lines.length * 6 - textCols * 0.02;

    if (!bestLayout || score > bestLayout.score) {
      bestLayout = {
        lines,
        textCols,
        textRows,
        pitch,
        cell,
        gap,
        gridCols,
        gridRows,
        score
      };
    }
  }

  if (bestLayout) {
    return bestLayout;
  }

  const fallbackLines = wrapLedMessage(normalizedMessage, 8);

  return {
    lines: fallbackLines,
    textCols: Math.max(...fallbackLines.map((line) => measureLedColumns(line))),
    textRows: fallbackLines.length * 7 + (fallbackLines.length - 1) * 2,
    pitch: 6,
    cell: 5,
    gap: 1,
    gridCols: Math.floor((innerWidth + 1) / 6),
    gridRows: Math.floor((innerHeight + 1) / 6)
  };
}

function createLedBoard(message) {
  const panel = getLedPanel();
  const layout = chooseLedLayout(message, panel);
  const gridWidth = layout.gridCols * layout.pitch - layout.gap;
  const gridHeight = layout.gridRows * layout.pitch - layout.gap;
  const gridX = panel.x + (panel.width - gridWidth) / 2;
  const gridY = panel.y + (panel.height - gridHeight) / 2;
  const textStartRow = Math.floor((layout.gridRows - layout.textRows) / 2);
  const activeMap = new Set();
  const leds = [];

  layout.lines.forEach((line, lineIndex) => {
    const baseRow = textStartRow + lineIndex * 9;
    const lineWidth = measureLedColumns(line);
    let cursorCol = Math.floor((layout.gridCols - lineWidth) / 2);

    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      const char = line[charIndex];
      const glyph = getGlyph(char);

      if (char !== " ") {
        glyph.forEach((row, rowIndex) => {
          for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
            if (row[colIndex] === "1") {
              activeMap.add(`${baseRow + rowIndex}:${cursorCol + colIndex}`);
            }
          }
        });
      }

      cursorCol += getGlyphWidth(char) + 1;
    }
  });

  for (let row = 0; row < layout.gridRows; row += 1) {
    for (let col = 0; col < layout.gridCols; col += 1) {
      leds.push({
        x: gridX + col * layout.pitch + layout.cell / 2,
        y: gridY + row * layout.pitch + layout.cell / 2,
        active: activeMap.has(`${row}:${col}`)
      });
    }
  }

  const activeIndices = [];

  leds.forEach((led, index) => {
    if (led.active) {
      activeIndices.push(index);
    }
  });

  activeIndices.sort((left, right) => {
    const leftLed = leds[left];
    const rightLed = leds[right];
    return (leftLed.y - rightLed.y) || (leftLed.x - rightLed.x);
  });

  return {
    panel,
    leds,
    activeIndices,
    cell: layout.cell,
    pitch: layout.pitch,
    radius: Math.max(2, layout.cell * 0.34),
    message: normalizeLedMessage(message)
  };
}

function renderMessageBackdrop(context, board) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const panel = board.panel;
  const baseGradient = context.createLinearGradient(0, 0, width, height);
  baseGradient.addColorStop(0, "#03050f");
  baseGradient.addColorStop(0.52, "#14112a");
  baseGradient.addColorStop(1, "#040812");
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, width, height);

  const orbA = {
    x: width * 0.22,
    y: height * 0.3,
    radius: width * 0.24,
    color: "rgba(255, 111, 175, 0.18)"
  };
  const orbB = {
    x: width * 0.77,
    y: height * 0.68,
    radius: width * 0.22,
    color: "rgba(255, 198, 110, 0.16)"
  };

  [orbA, orbB].forEach((orb) => {
    const glow = context.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
    glow.addColorStop(0, orb.color);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  });

  context.save();
  context.strokeStyle = "rgba(255,198,110,0.11)";
  context.lineWidth = 2;
  context.beginPath();

  for (let x = -40; x <= width + 40; x += 10) {
    const y = height * 0.52 + Math.sin(x / 32) * 10;
    if (x === -40) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.stroke();
  context.restore();

  context.save();
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = `700 ${Math.max(18, Math.min(width * 0.05, 40))}px Trebuchet MS, Arial, sans-serif`;
  context.shadowBlur = 0;

  const lanes = [
    Math.max(30, panel.y - 30),
    panel.y + panel.height * 0.3,
    panel.y + panel.height * 0.7
  ];

  lanes.forEach((laneY, laneIndex) => {
    const phrase = lyricBackdropLines[(state.phraseIndex + laneIndex) % lyricBackdropLines.length].toUpperCase();
    const color = laneIndex % 2 === 0 ? "rgba(255,111,175,0.11)" : "rgba(255,198,110,0.1)";
    context.fillStyle = color;
    context.fillText(phrase, width * (laneIndex % 2 === 0 ? 0.34 : 0.68), laneY);
  });

  context.restore();

  context.save();
  context.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 0; y < height; y += 4) {
    context.fillRect(0, y, width, 1);
  }
  context.restore();
}

function getMessageBackdrop(board) {
  const key = [
    window.innerWidth,
    window.innerHeight,
    state.dpr,
    state.phraseIndex,
    Math.round(board.panel.x),
    Math.round(board.panel.y),
    Math.round(board.panel.width),
    Math.round(board.panel.height)
  ].join(":");

  if (state.messageBackdropCanvas && state.messageBackdropKey === key) {
    return state.messageBackdropCanvas;
  }

  const backdrop = document.createElement("canvas");
  backdrop.width = Math.max(1, Math.round(window.innerWidth * state.dpr));
  backdrop.height = Math.max(1, Math.round(window.innerHeight * state.dpr));

  const backdropCtx = backdrop.getContext("2d");
  backdropCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  backdropCtx.imageSmoothingEnabled = false;
  renderMessageBackdrop(backdropCtx, board);

  state.messageBackdropCanvas = backdrop;
  state.messageBackdropKey = key;
  return backdrop;
}

function drawMessageBackdrop(now, board) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const panel = board.panel;
  const backdrop = getMessageBackdrop(board);

  textCtx.drawImage(backdrop, 0, 0, backdrop.width, backdrop.height, 0, 0, width, height);

  const sweepWidth = Math.max(120, panel.width * 0.32);
  const travel = (now * 0.12) % (panel.width + sweepWidth * 2);
  const sweepX = panel.x - sweepWidth + travel;
  const sweepGradient = textCtx.createLinearGradient(sweepX - sweepWidth, 0, sweepX + sweepWidth, 0);
  sweepGradient.addColorStop(0, "rgba(255,255,255,0)");
  sweepGradient.addColorStop(0.5, "rgba(255,214,138,0.08)");
  sweepGradient.addColorStop(1, "rgba(255,255,255,0)");
  textCtx.fillStyle = sweepGradient;
  textCtx.fillRect(panel.x - 24, panel.y - 18, panel.width + 48, panel.height + 36);
}

function drawLedBoard(board, progress, now) {
  clearTextCanvas();
  drawMessageBackdrop(now, board);

  const { panel, leds, activeIndices } = board;
  const visibility = Math.max(0, Math.min(1, progress));
  const pulse = (0.94 + Math.sin(now / 220) * 0.06) * visibility;

  textCtx.save();
  drawRoundedRect(textCtx, panel.x, panel.y, panel.width, panel.height, 28);
  textCtx.fillStyle = `rgba(7, 13, 36, ${0.76 + visibility * 0.14})`;
  textCtx.fill();
  textCtx.strokeStyle = "rgba(255,255,255,0.1)";
  textCtx.lineWidth = 1;
  textCtx.stroke();

  drawRoundedRect(textCtx, panel.x + 10, panel.y + 10, panel.width - 20, panel.height - 20, 22);
  textCtx.fillStyle = "rgba(1, 5, 14, 0.42)";
  textCtx.fill();

  textCtx.fillStyle = "rgba(255, 198, 110, 0.1)";
  textCtx.fillRect(panel.x + 16, panel.y + 14, panel.width - 32, 6);
  textCtx.restore();

  leds.forEach((led) => {
    textCtx.beginPath();
    textCtx.arc(led.x, led.y, board.radius * 0.62, 0, Math.PI * 2);
    textCtx.fillStyle = led.active ? "rgba(255, 124, 181, 0.14)" : "rgba(255,255,255,0.05)";
    textCtx.fill();
  });

  for (let index = 0; index < activeIndices.length; index += 1) {
    const led = leds[activeIndices[index]];
    textCtx.beginPath();
    textCtx.arc(led.x, led.y, board.radius * (1.1 + visibility * 0.75), 0, Math.PI * 2);
    textCtx.fillStyle = `rgba(255, 111, 175, ${0.14 * pulse})`;
    textCtx.fill();

    textCtx.beginPath();
    textCtx.arc(led.x, led.y, board.radius * (0.55 + visibility * 0.53), 0, Math.PI * 2);
    textCtx.fillStyle = `rgba(255, 126, 186, ${0.96 * pulse})`;
    textCtx.fill();

    textCtx.beginPath();
    textCtx.arc(led.x, led.y, board.radius * (0.22 + visibility * 0.22), 0, Math.PI * 2);
    textCtx.fillStyle = `rgba(255, 246, 251, ${0.18 + visibility * 0.82})`;
    textCtx.fill();
  }
}

function animateLedPhrase(message) {
  cancelMessageFrame();
  state.currentBoard = createLedBoard(message);
  invalidateMessageBackdrop();

  return new Promise((resolve) => {
    const turnOnDuration = 320;
    const holdDuration = 2250 + Math.min(2400, state.currentBoard.message.length * 78);
    const fadeOutDuration = 180;
    const totalDuration = turnOnDuration + holdDuration + fadeOutDuration;
    const start = performance.now();
    let pausedAt = null;
    let pausedDuration = 0;

    function frame(now) {
      if (state.isPaused) {
        if (pausedAt === null) {
          pausedAt = now;
        }

        state.messageFrame = window.requestAnimationFrame(frame);
        return;
      }

      if (pausedAt !== null) {
        pausedDuration += now - pausedAt;
        pausedAt = null;
      }

      const elapsed = now - start - pausedDuration;
      const turnOnProgress = Math.min(1, elapsed / turnOnDuration);
      const fadeOutProgress = elapsed <= turnOnDuration + holdDuration
        ? 1
        : 1 - Math.min(1, (elapsed - turnOnDuration - holdDuration) / fadeOutDuration);
      const progress = Math.max(0, Math.min(turnOnProgress, fadeOutProgress));

      drawLedBoard(state.currentBoard, progress, now);

      if (elapsed < totalDuration) {
        state.messageFrame = window.requestAnimationFrame(frame);
        return;
      }

      resolve();
    }

    state.messageFrame = window.requestAnimationFrame(frame);
  });
}

async function startMessageSequence() {
  state.phase = "message-led";
  state.phraseIndex = 0;
  setCanvasLayers({ matrixVisible: false, textVisible: true });
  stopMatrix();
  matrixCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  clearTextCanvas();

  for (let index = 0; index < phrases.length; index += 1) {
    state.phraseIndex = index;
    await animateLedPhrase(phrases[index]);
    await wait(120);
  }

  cancelMessageFrame();
  clearTextCanvas();
  await wait(220);
  showAlbum();
}

function clearPhraseTimer() {
  if (state.phraseTimer) {
    window.clearTimeout(state.phraseTimer);
    state.phraseTimer = null;
  }
}

function stopMessageSequence() {
  cancelMessageFrame();
  clearPhraseTimer();
}

function setAlbumMessage(prompt = "", countdown = "") {
  albumPrompt.textContent = prompt;
  albumCountdown.textContent = countdown;
  albumBanner.classList.toggle("is-visible", Boolean(prompt || countdown));
}

function clearAlbumTimer() {
  if (state.albumTimer) {
    window.clearTimeout(state.albumTimer);
    state.albumTimer = null;
  }
}

function buildCurtains() {
  curtainTop.innerHTML = "";
  curtainBottom.innerHTML = "";

  albumCards.forEach((card, index) => {
    const tile = card.cloneNode(true);
    tile.classList.remove("memory-card");
    tile.classList.add("curtain-card");

    if (index < 10) {
      curtainTop.appendChild(tile);
    } else {
      curtainBottom.appendChild(tile);
    }
  });
}

async function playFinalScene() {
  state.albumHeartMode = true;
  album.classList.add("is-heart-mode");
  albumTrack.classList.add("is-locked", "is-hidden");
  buildCurtains();
  finalScene.classList.remove("is-opening", "is-closing", "show-heart", "show-beat");
  finalScene.classList.add("is-visible");
  heartCaption.classList.remove("is-visible");

  void finalScene.offsetWidth;

  finalScene.classList.add("is-closing");
  await wait(820);

  finalScene.classList.add("show-beat");
  await wait(180);
  finalScene.classList.remove("is-closing");
  curtainTop.style.opacity = "1";
  curtainBottom.style.opacity = "1";
  finalScene.classList.add("is-opening");
  await wait(3260);

  curtainTop.style.transform = "translateY(-240%)";
  curtainBottom.style.transform = "translateY(240%)";
  curtainTop.style.opacity = "0";
  curtainBottom.style.opacity = "0";
  finalScene.classList.add("show-heart");
  heartCaption.classList.add("is-visible");
  setAlbumMessage("", "");
}

async function startAlbumCountdown() {
  if (state.albumCountdownStarted || state.albumHeartMode) {
    return;
  }

  state.albumCountdownStarted = true;
  albumTrack.classList.add("is-locked");
  setAlbumMessage("Espera", "3");

  for (const number of ["3", "2", "1"]) {
    setAlbumMessage("Espera", number);
    await wait(1000);
  }

  setAlbumMessage("Espera", "");
  await playFinalScene();
}

function handleAlbumScroll() {
  if (state.phase !== "album" || state.albumCountdownStarted || state.albumHeartMode) {
    return;
  }

  const nearEnd = albumTrack.scrollLeft + albumTrack.clientWidth >= albumTrack.scrollWidth - 32;
  if (nearEnd) {
    startAlbumCountdown();
  }
}

function showParticleDebug() {
  state.phase = debugFreeze ? "debug-message" : "message-led";
  state.phraseIndex = Math.min(debugPhraseIndex, phrases.length - 1);
  setCanvasLayers({ matrixVisible: false, textVisible: true });
  stopMatrix();
  matrixCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  state.currentBoard = createLedBoard(phrases[state.phraseIndex]);
  drawLedBoard(state.currentBoard, debugFreeze ? 1 : 0.92, performance.now());
}

function showFinalDebugState() {
  showAlbum();
  state.albumHeartMode = true;
  album.classList.add("is-heart-mode");
  albumTrack.classList.add("is-locked", "is-hidden");
  buildCurtains();
  finalScene.classList.add("is-visible", "show-beat", "show-heart", "is-opening");
  curtainTop.style.transform = "translateY(-240%)";
  curtainBottom.style.transform = "translateY(240%)";
  curtainTop.style.opacity = "0";
  curtainBottom.style.opacity = "0";
  heartCaption.classList.add("is-visible");
  setAlbumMessage("", "");
}

function runDebugStage() {
  if (debugStage === "album") {
    showAlbum();
    return;
  }

  if (debugStage === "heart") {
    showAlbum();
    window.setTimeout(() => {
      playFinalScene();
    }, 120);
    return;
  }

  if (debugStage === "heart-static") {
    showFinalDebugState();
    return;
  }

  if (debugStage === "particles") {
    showParticleDebug();
    return;
  }

  playIntroSequence();
}

function showAlbum() {
  stopMessageSequence();
  clearTextCanvas();
  setCanvasLayers({ matrixVisible: false, textVisible: false });
  clearAlbumTimer();
  state.albumCountdownStarted = false;
  state.albumHeartMode = false;
  album.classList.remove("is-heart-mode");
  albumTrack.classList.remove("is-locked", "is-heart-mode", "is-hidden");
  albumTrack.scrollLeft = 0;
  finalScene.classList.remove("is-visible", "is-closing", "is-opening", "show-heart");
  finalScene.classList.remove("show-beat");
  curtainTop.style.removeProperty("transform");
  curtainBottom.style.removeProperty("transform");
  curtainTop.style.removeProperty("opacity");
  curtainBottom.style.removeProperty("opacity");
  curtainTop.innerHTML = "";
  curtainBottom.innerHTML = "";
  heartCaption.classList.remove("is-visible");
  setAlbumMessage("", "");
  album.classList.add("is-visible");
  state.phase = "album";
}

function updateOrientationMessage() {
  syncOrientationState();
}

async function startWhenReady() {
  if (state.appStarted) {
    return;
  }

  state.appStarted = true;
  await waitForActiveScene();
  await waitForLaunchApproval();
  await waitForActiveScene();
  runDebugStage();
}

function handleResize() {
  window.clearTimeout(state.resizeTimer);
  state.resizeTimer = window.setTimeout(() => {
    setCanvasSize();
    updateOrientationMessage();
    window.scrollTo(0, 1);
  }, 150);
}

function createPlaceholderDataUri(index) {
  const hueA = (index * 27 + 320) % 360;
  const hueB = (hueA + 60) % 360;
  const number = String(index + 1).padStart(2, "0");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hueA} 88% 68%)" />
          <stop offset="100%" stop-color="hsl(${hueB} 86% 70%)" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="20%" r="65%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.38)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" rx="72" fill="url(#bg)" />
      <rect width="800" height="1000" rx="72" fill="url(#glow)" />
      <circle cx="400" cy="360" r="170" fill="rgba(255,255,255,0.14)" />
      <text x="400" y="420" text-anchor="middle" font-size="170" font-family="Arial, sans-serif" font-weight="700" fill="rgba(255,255,255,0.92)">${number}</text>
      <text x="400" y="720" text-anchor="middle" font-size="54" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.88)">Recuerdo</text>
      <text x="400" y="790" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.72)">para reemplazar luego</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyPlaceholderImage(image, index) {
  if (image.dataset.placeholderApplied === "1") {
    return;
  }

  image.dataset.placeholderApplied = "1";
  image.classList.remove("is-missing");
  image.src = createPlaceholderDataUri(index);
}

function wireImageFallbacks() {
  albumImages.forEach((image, index) => {
    const handleMissing = () => applyPlaceholderImage(image, index);

    if (image.complete && (!image.naturalWidth || image.naturalWidth === 0)) {
      handleMissing();
    }

    image.addEventListener("error", handleMissing, { once: true });
  });
}

function init() {
  setCanvasSize();
  updateOrientationMessage();
  setupLaunchPrompt();
  setupFullscreen();
  setupMusic();
  wireImageFallbacks();
  albumTrack.addEventListener("scroll", handleAlbumScroll, { passive: true });
  window.scrollTo(0, 1);
  startWhenReady();
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);
window.addEventListener("load", init);
