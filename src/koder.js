importScripts("/simple-QR/koder/zbar.js");
importScripts("/simple-QR/koder/browser.js");

(async () => {
  const koder = await new Koder().initialize({
    wasmDirectory: "/simple-QR/koder",
  });

  self.addEventListener("message", (event) => {
    const data = event.data;
    const scanResult = koder.decode(data.data, data.width, data.height);
    postMessage({ data: scanResult });
  });
})();
