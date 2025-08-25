#!/bin/bash

# Build content script
echo "Building content script..."
npx vite build --config vite.single.config.js

# Check if content script build was successful
if [ $? -eq 0 ]; then
    echo "✅ Content script build successful"
else
    echo "❌ Content script build failed"
    exit 1
fi

# Build popup
echo "Building popup..."
npx vite build --config vite.popup.config.js

# Check if popup build was successful
if [ $? -eq 0 ]; then
    echo "✅ Popup build successful"
else
    echo "❌ Popup build failed"
    exit 1
fi

# Create dist directory and copy files
echo "Copying files to dist directory..."
mkdir -p dist
cp manifest.json dist/
mkdir -p dist/icons

# Copy the CSS file
cp src/styles/content.css dist/

# Copy built files
cp dist-content/content.js dist/
cp dist-popup/popup.js dist/

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

# Clean up temporary directories
rm -rf dist-content dist-popup

echo "Build complete! Extension files are in the dist/ folder."
