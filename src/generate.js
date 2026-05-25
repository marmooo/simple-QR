import {
  prepareZXingModule,
  writeBarcode,
} from "https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/writer/+esm";

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
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

await prepareZXingModule();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const generateQRButton = document.getElementById("generateQR");
if (generateQRButton) {
  generateQRButton.onclick = generateQR;
}
