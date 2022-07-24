function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function drawLine(a,b,c){canvas.beginPath(),canvas.moveTo(a.x,a.y),canvas.lineTo(b.x,b.y),canvas.lineWidth=4,canvas.strokeStyle=c,canvas.stroke()}function tick(){if(loadingMessage.textContent="⌛ Loading video...",video.readyState===video.HAVE_ENOUGH_DATA)if(loadingMessage.hidden=!0,canvasElement.hidden=!1,canvasElement.height=video.videoHeight,canvasElement.width=video.videoWidth,canvas.drawImage(video,0,0,canvasElement.width,canvasElement.height),outputData.textContent==""){const b=canvas.getImageData(0,0,canvasElement.width,canvasElement.height),a=jsQR(b.data,b.width,b.height,{inversionAttempts:"dontInvert"});if(a){drawLine(a.location.topLeftCorner,a.location.topRightCorner,"red"),drawLine(a.location.topRightCorner,a.location.bottomRightCorner,"red"),drawLine(a.location.bottomRightCorner,a.location.bottomLeftCorner,"red"),drawLine(a.location.bottomLeftCorner,a.location.topLeftCorner,"red"),navMessage.hidden=!0,outputMessage.hidden=!1,outputData.parentElement.hidden=!1;const b=Encoding.codeToString(Encoding.convert(a.binaryData,{to:"UNICODE",from:"AUTO"}));outputData.textContent=b;try{new URL(b),outputData.href=b}catch{}const c=new Audio;c.src="/simple-QR/success.mp3",c.play()}else navMessage.hidden=!1,outputMessage.hidden=!0,outputData.parentElement.hidden=!0}requestAnimationFrame(tick)}function iosCopyToClipboard(a){if(a=typeof a=="string"?document.querySelector(a):a,navigator.userAgent.match(/ipad|ipod|iphone/i)){const d=a.contentEditable,e=a.readOnly;a.contentEditable=!0,a.readOnly=!0;const b=document.createRange();b.selectNodeContents(a);const c=window.getSelection();c.removeAllRanges(),c.addRange(b),a.setSelectionRange(0,999999),a.contentEditable=d,a.readOnly=e}else a.select();document.execCommand("copy")}function copyToClipboard(){const a=document.createElement("textarea");document.body.appendChild(a),a.value=outputData.textContent,iosCopyToClipboard(a),document.body.removeChild(a),alert("OK!")}loadConfig();const video=document.createElement("video"),canvasElement=document.getElementById("canvas"),canvas=canvasElement.getContext("2d"),loadingMessage=document.getElementById("loadingMessage"),navMessage=document.getElementById("navMessage"),outputMessage=document.getElementById("outputMessage"),outputData=document.getElementById("outputData");navigator.mediaDevices.getUserMedia===void 0&&(navigator.mediaDevices.getUserMedia=function(b){const a=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return a?new Promise(function(c,d){a.call(navigator,b,c,d)}):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(a){video.srcObject=a,video.setAttribute("playsinline",!0),video.play(),requestAnimationFrame(tick)}).catch(function(a){alert(a.message)}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode;const copyToClipboardButton=document.getElementById("copyToClipboard");copyToClipboardButton&&(copyToClipboardButton.onclick=copyToClipboard)