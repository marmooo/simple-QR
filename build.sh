dir=docs
cp -r src/* $dir
minify src/index.html > $dir/index.html
minify src/generate/index.html > $dir/generate/index.html
minify src/scan/index.html > $dir/scan/index.html
minify src/index.js > $dir/index.js
minify src/sw.js > $dir/sw.js

