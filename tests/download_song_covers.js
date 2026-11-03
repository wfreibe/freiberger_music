const https = require('https');
const fs = require('fs');
const path = require('path');

const songs = [
  { slug: 'die-stadt-die-mich-sah', videoId: '3-_lDTXqijw' },
  { slug: 'das-meer-das-uns-bewahrte', videoId: 'd87nefPuDgU' },
  { slug: 'der-himmel-kannte-unsere-namen', videoId: 'ZSzFRGumV9Q' },
  { slug: 'bevor-das-licht-einen-namen-hatte', videoId: 'dvLEsXrZXJ8' },
  { slug: 'als-der-horizont-uns-wiedersah', videoId: '3iGRwql0ug8' },
  { slug: 'was-das-meer-bewahrte', videoId: 'UbpEoFPuQEo' },
  { slug: 'bis-unter-dem-wasser-wieder-land-erscheint', videoId: 'pVy3cQxnpm0' },
  { slug: 'wo-das-gruen-uns-wiederfand', videoId: '5WFzRxamMPs' },
  { slug: 'wo-die-asche-atmet', videoId: 'YTb6bBPs7sc' },
  { slug: 'der-puls-der-uns-verband', videoId: 'gonZwH0MBlU' }
];

const targetDirs = [
  path.resolve(__dirname, '../covers/songs'),
  path.resolve(__dirname, '../frontend/public/covers/songs')
];

for (const d of targetDirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

async function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve();
    });
  });
}

async function run() {
  for (const s of songs) {
    const url = `https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`;
    console.log(`Downloading song cover for ${s.slug} (${s.videoId})...`);
    for (const d of targetDirs) {
      const dest = path.join(d, `${s.slug}.jpg`);
      await downloadFile(url, dest);
    }
  }
  console.log('All song covers downloaded successfully!');
}

run();
