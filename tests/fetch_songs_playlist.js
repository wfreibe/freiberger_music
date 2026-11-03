const https = require('https');
const fs = require('fs');

const postData = JSON.stringify({
  context: {
    client: {
      clientName: 'WEB',
      clientVersion: '2.20240101.00.00',
      hl: 'de',
      gl: 'DE'
    }
  },
  browseId: 'VLPLIcnGWUVhwf4'
});

const req = https.request({
  hostname: 'www.youtube.com',
  path: '/youtubei/v1/browse',
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
      const items = json.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
      const videos = [];
      if (items) {
        for (const it of items) {
          const m = it.lockupViewModel;
          if (m) {
            const title = m.metadata?.lockupMetadataViewModel?.title?.content;
            const videoId = m.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;
            const thumb = m.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url;
            videos.push({ title, videoId, thumb });
          }
        }
      }
      console.log(`Found ${videos.length} songs in playlist PLIcnGWUVhwf4:`);
      console.log(JSON.stringify(videos, null, 2));
      fs.writeFileSync('tests/songs_playlist.json', JSON.stringify(videos, null, 2), 'utf-8');
    } catch (err) {
      console.error('Parse error:', err);
    }
  });
});

req.on('error', err => console.error('Req error:', err));
req.write(postData);
req.end();
