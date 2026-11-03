import type { Book } from '../types';
import { BookLinks } from '../components/BookLinks';

export function PlaylistBookPage({ book }: { book: Book }) {
  return <div class="hero-stage" style={{ paddingBottom: '90px' }}>
    <div class="hero-super">{book.formats}</div>
    <h1 class="hero-headline" lang={book.language} style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', maxWidth: '1100px' }}>{book.title.toLocaleUpperCase(book.language)}</h1>
    {book.subtitle && <div class="english-book-author">{book.subtitle}</div>}
    <div class="english-book-author">{book.author}</div>
    {book.description && <div class="english-book-intro"><p>{book.description}</p></div>}
    <BookLinks book={book} />
  </div>;
}
