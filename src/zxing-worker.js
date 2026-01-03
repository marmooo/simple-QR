import {
  prepareZXingModule,
  readBarcodesFromImageData,
} from "https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/reader/+esm";

await prepareZXingModule();

self.onmessage = async (event) => {
  const { data, width, height } = event.data;
  const imageData = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height,
  );
  try {
    const results = await readBarcodesFromImageData(imageData, {
      formats: ["QRCode"],
    });
    if (results.length > 0) {
      self.postMessage({
        data: results[0].text,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
