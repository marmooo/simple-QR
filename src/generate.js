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

function generateQR() {
  const img = document.getElementById('qrcode');
  const w = document.getElementById('width').value;
  const h = document.getElementById('height').value;
  const msg = document.getElementById('textarea').value;
  img.width = w;
  img.height = h;
  // const wxh = w + 'x' + h;
  // img.src = 'https://chart.apis.google.com/chart?cht=qr&chs=' + wxh + '&choe=Shift_JIS&chl=' + msg;
  QRCode.toCanvas(img, msg, { width:w, height:h });
  img.classList.remove('d-none');
}

loadConfig();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const generateQRButton = document.getElementById("generateQR");
if (generateQRButton) {
  generateQRButton.onclick = generateQR;
}
