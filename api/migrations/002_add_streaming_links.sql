-- Add optional streaming links & direct MP3 audio url to releases
ALTER TABLE releases ADD COLUMN spotify_url TEXT;
ALTER TABLE releases ADD COLUMN apple_music_url TEXT;
ALTER TABLE releases ADD COLUMN audio_url TEXT;
