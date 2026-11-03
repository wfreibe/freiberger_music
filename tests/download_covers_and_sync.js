const https = require('https');
const fs = require('fs');
const path = require('path');

const episodes = [
  { num: 1, slug: 'kapitel-01-athen', videoId: 'mFlu63ixea0', title: 'Die Stadt über der Stadt', subtitle: 'Eine Erinnerung an Athen', place: 'athens', duration: '17:31', bpm: 120 },
  { num: 2, slug: 'kapitel-02-zakynthos', videoId: 'SGIPOr37FGo', title: 'Jung genug, dem Horizont zu glauben', subtitle: 'Eine Erinnerung an Zakynthos', place: 'zakynthos', duration: '22:23', bpm: 124 },
  { num: 3, slug: 'kapitel-03-korfu', videoId: 'QxlfYFukqPc', title: 'Grün, das keinen Horizont brauchte', subtitle: 'Eine Erinnerung an Korfu', place: 'corfu', duration: '17:53', bpm: 118 },
  { num: 4, slug: 'kapitel-04-piraeus-naxos', videoId: 'C987RXDOBXg', title: 'Die Ader hinaus in die Welt', subtitle: 'Von Athen nach Naxos', place: 'athens', duration: '20:28', bpm: 126 },
  { num: 5, slug: 'kapitel-05-naxos', videoId: '_yDPQxWTi3k', title: 'Stimmen unter freiem Himmel', subtitle: 'Eine Erinnerung an Naxos', place: 'naxos', duration: '20:50', bpm: 128 },
  { num: 6, slug: 'kapitel-06-santorini', videoId: '7GSmcCNjK-k', title: 'Der Sprung und der Fall', subtitle: 'Eine Erinnerung an Santorini', place: 'santorini', duration: '21:15', bpm: 125 },
  { num: 7, slug: 'kapitel-07-kreta', videoId: '1BumkaxNeVc', title: 'Drei Motoren unter einem jungen Himmel', subtitle: 'Eine Erinnerung an Kreta', place: 'crete', duration: '23:30', bpm: 127 },
  { num: 8, slug: 'kapitel-08-santorini-die-hand', videoId: 'qhopAuzIMpw', title: 'Die Hand, die bleibt', subtitle: 'Eine Erinnerung an Santorini', place: 'santorini', duration: '21:16', bpm: 122 },
  { num: 9, slug: 'kapitel-09-naxos-das-tor', videoId: 'QnkkH3MLwF8', title: 'Das Tor, das uns wiedersah', subtitle: 'Eine Erinnerung an Naxos', place: 'naxos', duration: '17:05', bpm: 126 },
  { num: 10, slug: 'kapitel-10-kos', videoId: '0VK8VV8YcEY', title: 'Vor dem ersten Schlag', subtitle: 'Eine Erinnerung an Kos', place: 'kos', duration: '17:05', bpm: 120 },
  { num: 11, slug: 'kapitel-11-rhodos', videoId: '4IrJb9gCyTc', title: 'Zwei Flaschen auf einem Tisch', subtitle: 'Eine Erinnerung an Rhodos', place: 'rhodes', duration: '19:30', bpm: 125 },
  { num: 12, slug: 'epilog-was-das-meer-bewahrte', videoId: 'EsAG0h01TfE', title: 'Epilog: Was das Meer bewahrte', subtitle: 'Ein Rückblick auf Griechenland', place: 'naxos', duration: '07:13', bpm: 129, featured: 1 }
];

const targetDirs = [
  path.resolve(__dirname, '../covers/episodes'),
  path.resolve(__dirname, '../frontend/public/covers/episodes')
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
  for (const ep of episodes) {
    const url = `https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`;
    console.log(`Downloading cover for ${ep.title} (${ep.videoId})...`);
    for (const d of targetDirs) {
      const dest = path.join(d, `${ep.slug}.jpg`);
      await downloadFile(url, dest);
    }
  }
  console.log('All episode covers downloaded successfully!');
}

run();
