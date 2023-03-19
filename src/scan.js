function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  const promises = [
    loadAudio("/simple-QR/mp3/correct3.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    correctAudio = audioBuffers[0];
  });
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
    playAudio(correctAudio);
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
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
loadAudios();
let correctAudio;
let prevTime = 0;
const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const loadingMessage = document.getElementById("loadingMessage");
const outputMessage = document.getElementById("outputMessage");
const outputData = document.getElementById("outputData");
const worker = initWorker();
initScan();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("copyToClipboard").onclick = copyToClipboard;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
