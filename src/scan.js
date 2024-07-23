function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function createAudioContext() {
  if (globalThis.AudioContext) {
    return new globalThis.AudioContext();
  } else {
    console.error("Web Audio API is not supported in this browser");
    return null;
  }
}

function unlockAudio() {
  if (audioContext) {
    audioContext.resume();
  } else {
    audioContext = createAudioContext();
    loadAudio("correct", "/simple-QR/mp3/correct3.mp3");
  }
  document.removeEventListener("pointerdown", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

async function loadAudio(name, url) {
  if (!audioContext) return;
  if (audioBufferCache[name]) return audioBufferCache[name];
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferCache[name] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error(`Loading audio ${name} error:`, error);
    throw error;
  }
}

function playAudio(name, volume) {
  if (!audioContext) return;
  const audioBuffer = audioBufferCache[name];
  if (!audioBuffer) {
    console.error(`Audio ${name} is not found in cache`);
    return;
  }
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  const gainNode = audioContext.createGain();
  if (volume) gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  sourceNode.connect(gainNode);
  sourceNode.start();
}

function tick(time) {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvasElement.width = width;
    canvasElement.height = height;
    canvas.drawImage(video, 0, 0, width, height);
    if (time - prevTime > 500) {
      prevTime = time;
      const imageData = canvas.getImageData(0, 0, width, height);
      worker.postMessage({
        data: imageData.data,
        width: width,
        height: height,
      });
    }
  } else {
    loadingMessage.textContent = "⌛ Loading video...";
  }
  requestAnimationFrame(tick);
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  alert("クリップボードにコピーしました。");
}

function initWorker() {
  const worker = new Worker("/simple-QR/koder.js");
  worker.onmessage = (ev) => {
    const code = ev.data.data;
    if (!code) return;
    outputMessage.hidden = false;
    outputData.parentElement.hidden = false;
    outputData.textContent = code;
    try {
      new URL(code);
      outputData.href = code;
    } catch {
      // skip
    }
    playAudio("correct");
  };
  return worker;
}

function initScan() {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: "environment" },
  }).then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.play();
    requestAnimationFrame(tick);
  }).catch((err) => {
    alert(err.message);
  });
}

loadConfig();
let prevTime = 0;
let audioContext;
const audioBufferCache = {};
const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d", { willReadFrequently: true });
const loadingMessage = document.getElementById("loadingMessage");
const outputMessage = document.getElementById("outputMessage");
const outputData = document.getElementById("outputData");
const worker = initWorker();
initScan();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("copyToClipboard").onclick = copyToClipboard;
document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
