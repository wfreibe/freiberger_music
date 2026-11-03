const https = require('https');
const fs = require('fs');

const videos = JSON.parse(fs.readFileSync('tests/playlist_videos.json', 'utf-8'));

async function fetchVideoDetails(videoId) {
  const postData = JSON.stringify({
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20240101.00.00',
        hl: 'de',
        gl: 'DE'
      }
    },
    videoId: videoId
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'www.youtube.com',
      path: '/youtubei/v1/player',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const details = json.videoDetails || {};
          const lengthSeconds = parseInt(details.lengthSeconds || '0');
          const minutes = Math.floor(lengthSeconds / 60);
          const seconds = lengthSeconds % 60;
          const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          resolve({
            videoId,
            title: details.title,
            author: details.author,
            duration,
            lengthSeconds,
            description: details.shortDescription
          });
        } catch (e) {
          resolve({ videoId, error: e.message });
        }
      });
    });
    req.on('error', (e) => resolve({ videoId, error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const enriched = [];
  for (const v of videos) {
    console.log(`Fetching details for ${v.title} (${v.videoId})...`);
    const det = await fetchVideoDetails(v.videoId);
    enriched.push({
      ...v,
      ...det
    });
  }
  fs.writeFileSync('tests/enriched_videos.json', JSON.stringify(enriched, null, 2), 'utf-8');
  console.log('Saved enriched videos to tests/enriched_videos.json');
}

run();
