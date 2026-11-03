"""Import the verified October 2026 audiobook playlists into the local installation DB."""
import json, re, sqlite3
from pathlib import Path
root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'scripts/audiobook-playlists.json').read_text(encoding='utf-8'))
for edition in data.values():
    assert [v['chapter'] for v in edition['videos']] == list(range(1, 13))
    assert len({v['id'] for v in edition['videos']}) == 12
    assert all(re.fullmatch(r'[A-Za-z0-9_-]{11}', v['id']) for v in edition['videos'])
with sqlite3.connect(root / 'storage/freiberger.sqlite') as db:
    db.execute('PRAGMA foreign_keys=ON')
    de = db.execute("SELECT r.id,c.chapter_number FROM releases r JOIN chapters c ON r.chapter_id=c.id JOIN series s ON r.series_id=s.id WHERE s.slug='hoerbuch-die-orte-die-uns-sahen'").fetchall()
    assert sorted(n for _,n in de) == list(range(1,13))
    ids = {n:id for id,n in de}
    for video in data['de']['videos']:
        n=video['chapter']; title=re.sub(r', Hörbuch$', '', video['title']); title=re.sub(r'^\d+\s+', '', title)
        if n != 12: title=f'Kapitel {n}: {title}'
        db.execute('UPDATE releases SET title=?,type=?,youtube_id=?,youtube_playlist_id=?,duration=?,cover=?,audio_url=?,sort_order=? WHERE id=?',
            (title,'audiobook',video['id'],data['de']['playlist'],video['duration'],f"https://i.ytimg.com/vi/{video['id']}/mqdefault.jpg",'',100+n,ids[n]))
    db.execute("UPDATE series SET description='Das deutschsprachige Hörbuch zu Die Orte, die uns sahen.' WHERE slug='hoerbuch-die-orte-die-uns-sahen'")
    db.execute("INSERT INTO series(slug,title,description,sort_order) VALUES(?,?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title,description=excluded.description",('livre-audio-les-lieux-qui-nous-ont-vus','LES LIEUX QUI NOUS ONT VUS · LIVRE AUDIO','Le livre audio en français, en douze chapitres.',4))
    series=db.execute("SELECT id FROM series WHERE slug='livre-audio-les-lieux-qui-nous-ont-vus'").fetchone()[0]
    for video in data['fr']['videos']:
        n=video['chapter']; title=re.sub(r', livre audio$', '', video['title']); title=re.sub(r'^\d+\s+', '', title)
        title=('Épilogue : ' if n==12 else f'Chapitre {n} : ')+title
        db.execute('''INSERT INTO releases(slug,title,type,cover,youtube_id,youtube_playlist_id,duration,genre,series_id,sort_order,featured)
          VALUES(?,?,?,?,?,?,?,?,?,?,0) ON CONFLICT(slug) DO UPDATE SET title=excluded.title,type=excluded.type,cover=excluded.cover,youtube_id=excluded.youtube_id,youtube_playlist_id=excluded.youtube_playlist_id,duration=excluded.duration,series_id=excluded.series_id,sort_order=excluded.sort_order''',
          (f'livre-audio-chapitre-{n:02}',title,'audiobook',f"https://i.ytimg.com/vi/{video['id']}/mqdefault.jpg",video['id'],data['fr']['playlist'],video['duration'],'Livre audio',series,200+n))
    # Preserve the owner's previously requested replacement in the full reinstall.
    db.execute("UPDATE releases SET youtube_id='elMGltCaFfM',type='song',bpm=130,duration='6:19' WHERE slug='als-der-horizont-uns-wiedersah' AND youtube_id='3iGRwql0ug8'")
    assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
    assert not db.execute('PRAGMA foreign_key_check').fetchall()
print('Updated 12 German chapters; upserted 12 French chapters. Integrity and foreign keys: OK.')
