const fs = require('fs');
const path = require('path');

// Función para obtener los archivos de video de un directorio
function getVideoFiles(directory) {
    return fs.readdirSync(directory)
             .filter(file => file.toLowerCase().endsWith('.mp4'))
             .map(file => path.join(directory, file).replace(/\\/g, '/'));
}

// Directorio principal que contiene subdirectorios de videos
const mainDirectory = '../public/videos'; // Asegúrate de ajustar esto a tu directorio principal

// Leer los subdirectorios
const videoSets = fs.readdirSync(mainDirectory, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

// Crear el objeto videoSources
const videoSources = {};
videoSets.forEach(set => {
    videoSources[set] = getVideoFiles(path.join(mainDirectory, set));
});

// Convertir el objeto en una cadena para exportar
const exportString = `const videoSources = ${JSON.stringify(videoSources, null, 2)};\n\nexport default videoSources;`;

// Escribir el archivo
fs.writeFileSync('videoSourcesALL1.js', exportString);

console.log('Archivo videoSources.js generado con éxito.');
