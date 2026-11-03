import { Fragment } from 'preact';
import { currentLang, setLanguage, type Language } from '../i18n';

const languages: { code: Language; label: string }[] = [
  { code: 'de', label: 'Auf Deutsch umschalten' },
  { code: 'en', label: 'Switch to English' },
  { code: 'fr', label: 'Passer en français' },
];

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  return <div class={`lang-switcher ${mobile ? 'mobile-lang' : ''}`}>
    {languages.map(({ code, label }, index) => <Fragment key={code}>
      {index > 0 && <span class="lang-divider" aria-hidden="true">|</span>}
      <button type="button" class={`lang-btn ${currentLang.value === code ? 'active' : ''}`}
        aria-label={label} aria-pressed={currentLang.value === code} lang={code}
        onClick={() => setLanguage(code)}>{code.toUpperCase()}</button>
    </Fragment>)}
  </div>;
}
