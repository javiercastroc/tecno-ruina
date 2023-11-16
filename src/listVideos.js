const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'videos');
const videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.mp4'));

const output = videoFiles.map(file => `./videos/${file}`);
fs.writeFileSync(path.join(__dirname, 'videoSources.js'), `export default ${JSON.stringify(output)};`);
