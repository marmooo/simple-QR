function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.documentElement.dataset.theme = 'dark';
  }
}
loadConfig();

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.documentElement.dataset.theme = 'dark';
  }
}

var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var navMessage = document.getElementById("navMessage");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

// navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(function(stream) {
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
  video.srcObject = stream;
  video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
  video.play();
  requestAnimationFrame(tick);
}).catch(function(err) {
  alert(err.message);
});

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

function tick() {
  loadingMessage.innerText = "⌛ Loading video..."
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    if (outputData.innerText == '') {
      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        drawLine(code.location.topLeftCorner, code.location.topRightCorner, 'red');
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, 'red');
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, 'red');
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, 'red');
        navMessage.hidden = true;
        outputMessage.hidden = false;
        outputData.parentElement.hidden = false;
        var msg = Encoding.codeToString(Encoding.convert(code.binaryData, {to:'UNICODE', from:'AUTO'}));
        outputData.innerText = msg;
        try {
          new URL(msg);
          outputData.href = msg;
        } catch {
        }
        var sound = new Audio();
        sound.src = '/simple-QR/success.mp3';
        sound.play();
      } else {
        navMessage.hidden = false;
        outputMessage.hidden = true;
        outputData.parentElement.hidden = true;
      }
    }
  }
  requestAnimationFrame(tick);
}

function iosCopyToClipboard(el) {

    // resolve the element
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    // handle iOS as a special case
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {

        // save current contentEditable/readOnly status
        var editable = el.contentEditable;
        var readOnly = el.readOnly;

        // convert to editable with readonly to stop iOS keyboard opening
        el.contentEditable = true;
        el.readOnly = true;

        // create a selectable range
        var range = document.createRange();
        range.selectNodeContents(el);

        // select the range
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);

        // restore contentEditable/readOnly to original state
        el.contentEditable = editable;
        el.readOnly = readOnly;
    }
    else {
        el.select();
    }

    // execute copy command
    document.execCommand('copy');
}

function copyToClipboard(el) {
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = outputData.innerText;
  iosCopyToClipboard(input);
  document.body.removeChild(input);
  alert('OK!');
}
