mkdir -p docs
cp -r src/* docs
drop-inline-css -r src -o docs
minify -r docs -o .
cp node_modules/@maslick/koder/zbar.js src/koder/
cp node_modules/@maslick/koder/zbar.wasm src/koder/
cp node_modules/@maslick/koder/browser.js src/koder/
