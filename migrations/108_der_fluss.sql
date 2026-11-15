INSERT INTO books (slug, title, author, language, menu_label, sort_order, show_in_navigation, is_published, formats, content_blocks)
SELECT 'der-fluss-kennt-keine-erben', 'Der Fluss kennt keine Erben', 'Werner Freiberger', 'de',
       'DER FLUSS KENNT KEINE ERBEN', 70, 1, 1, 'BUCH',
       '[{"id":"existing-content","type":"legacy","enabled":true,"data":{}},{"id":"fluss-playlist","type":"link","enabled":true,"data":{"href":"https://www.youtube.com/playlist?list=PLMwXitdFTZtQ","label":"Playlist auf YouTube","style":"button"}},{"id":"fluss-epubli","type":"link","enabled":true,"data":{"href":"https://www.epubli.com/?s=Werner+Freiberger","label":"Bücher von Werner Freiberger bei epubli","style":"button"}}]'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE slug='der-fluss-kennt-keine-erben')
  AND NOT EXISTS (SELECT 1 FROM pages WHERE slug='der-fluss-kennt-keine-erben')
  AND NOT EXISTS (SELECT 1 FROM content_urls WHERE path='/der-fluss-kennt-keine-erben');
