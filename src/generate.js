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

function generateQR() {
  const img = document.getElementById('qrcode');
  const w = document.getElementById('width').value;
  const h = document.getElementById('height').value;
  const msg = document.getElementById('textarea').value;
  img.width = w;
  img.height = h;
  const wxh = w + 'x' + h;
  img.src = 'https://chart.apis.google.com/chart?cht=qr&chs=' + wxh + '&choe=Shift_JIS&chl=' + msg;
  img.classList.remove('d-none');
}

loadConfig();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const generateQRButton = document.getElementById("generateQR");
if (generateQRButton) {
  generateQRButton.onclick = generateQR;
}