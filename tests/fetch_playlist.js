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
  browseId: 'VLPLetVEDapYTxM'
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
      fs.writeFileSync('tests/playlist_videos.json', JSON.stringify(videos, null, 2), 'utf-8');
      console.log(`Successfully saved ${videos.length} videos to tests/playlist_videos.json`);
    } catch (err) {
      console.error('Error:', err);
    }
  });
});

req.write(postData);
req.end();
