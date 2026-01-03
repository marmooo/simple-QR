import {
  prepareZXingModule,
  writeBarcode,
} from "https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/writer/+esm";

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

async function generateQR() {
  const msg = document.getElementById("textarea").value;
  const result = await writeBarcode(msg, { format: "QRCode" });
  const { width, height } = result.symbol;
  const container = document.getElementById("qrcode");
  container.innerHTML = result.svg;
  const svg = container.querySelector("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

loadConfig();
await prepareZXingModule();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const generateQRButton = document.getElementById("generateQR");
if (generateQRButton) {
  generateQRButton.onclick = generateQR;
}
