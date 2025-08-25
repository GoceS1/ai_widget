#!/bin/bash

# Build content script with Vite
npm run build

# Copy manifest and create popup.html
cp manifest.json dist/
mkdir -p dist/icons

# Copy the CSS file
cp src/styles/content.css dist/

# Create popup.html
cat > dist/popup.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Writing Widget</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./popup.js"></script>
</body>
</html>
EOF

echo "Build complete! Extension files are in the dist/ folder."
