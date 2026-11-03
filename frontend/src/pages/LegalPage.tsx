import { useState } from 'preact/hooks';
import { t } from '../i18n';
import { navigate } from '../router';

export function LegalPage() {
  const [activeTab, setActiveTab] = useState<'imprint' | 'privacy'>('imprint');

  return (
    <div class="content-section" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '48px', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          class="btn-editorial btn-editorial-ghost"
          style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '10px' }}
        >
          ← {t('legal_back_archive')}
        </button>

        <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '8px' }}>
          {t('legal_header_super')}
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px' }}>
          {t('legal_title')}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '650px' }}>
          {t('legal_subtitle')}
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('imprint')}
            class={`view-toggle-btn ${activeTab === 'imprint' ? 'active' : ''}`}
            style={{ fontSize: '12px', padding: '10px 20px' }}
          >
            § {t('legal_tab_imprint')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            class={`view-toggle-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            style={{ fontSize: '12px', padding: '10px 20px' }}
          >
            🔒 {t('legal_tab_privacy')}
          </button>
        </div>

        <div style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(212, 180, 131, 0.08)', border: '1px solid rgba(212, 180, 131, 0.2)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          ⚖️ {t('legal_disclaimer')}
        </div>
      </div>

      {/* TAB 1: IMPRESSUM */}
      {activeTab === 'imprint' && (
        <article class="legal-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '36px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
            </h2>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '6px' }}>
              Werner Freiberger
            </div>
            <div>freiberger.music</div>
            <div>Am Moränenhügel 7</div>
            <div>83558 Maitenbeth</div>
            <div>Deutschland</div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Kontakt
            </h3>
            <div>E-Mail: <a href="mailto:info@freiberger.music" style={{ color: 'var(--accent-sand)', textDecoration: 'none' }}>info@freiberger.music</a></div>
            <div>Website: <a href="https://freiberger.music" style={{ color: 'var(--accent-sand)', textDecoration: 'none' }}>https://freiberger.music</a></div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Verantwortlich für journalistisch-redaktionelle Inhalte
            </h3>
            <p style={{ fontSize: '14px' }}>
              Gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV):<br />
              <strong>Werner Freiberger</strong><br />
              Am Moränenhügel 7<br />
              83558 Maitenbeth
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Urheberrecht & Leistungsschutzrechte
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Die auf dieser Website veröffentlichten Inhalte, Werke und multimedialen Schöpfungen — insbesondere alle musikalischen Kompositionen, Klanglandschaften, literarischen Texte und Buchauszüge, Fotografien, Artworks, Grafiken und kartografischen Darstellungen — unterliegen dem deutschen Urheberrecht und Leistungsschutzrecht.
            </p>
            <p style={{ fontSize: '14px' }}>
              Jede vom deutschen Urheber- und Leistungsschutzrecht nicht zugelassene Verwertung (insbesondere Vervielfältigung, Bearbeitung, Übersetzung, Einspeisung in KI-Trainingsmodelle, Verbreitung und öffentliche Wiedergabe) bedarf der vorherigen schriftlichen Zustimmung des Urhebers Werner Freiberger.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Haftungsausschluss (Disclaimer)
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              <strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter (z. B. YouTube), auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>
        </article>
      )}

      {/* TAB 2: DATENSCHUTZ */}
      {activeTab === 'privacy' && (
        <article class="legal-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '36px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          {/* Privacy Banner Highlight */}
          <div style={{ background: 'rgba(56, 119, 128, 0.1)', border: '1px solid rgba(56, 119, 128, 0.3)', borderRadius: '6px', padding: '16px 20px', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-turquoise)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ✓ 100% Tracking- und werbefrei (Kein Cookie-Banner erforderlich)
            </div>
            <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)' }}>
              Diese Website setzt bewusst <strong>keine</strong> Tracking-Cookies, <strong>keine</strong> Werbenetzwerke und <strong>keine</strong> externen Analysedienste (wie Google Analytics, Meta-Pixel etc.) ein. Sie surfen hier vollständig ohne Werbetracking.
            </p>
          </div>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
              1. Datenschutz auf einen Blick & Verantwortlicher
            </h2>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
              Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <div style={{ fontSize: '14px', background: 'var(--bg-surface-elevated)', padding: '14px 18px', borderRadius: '6px', marginBottom: '14px' }}>
              <strong>Werner Freiberger</strong><br />
              Am Moränenhügel 7<br />
              83558 Maitenbeth, Deutschland<br />
              E-Mail: <a href="mailto:info@freiberger.music" style={{ color: 'var(--accent-sand)' }}>info@freiberger.music</a>
            </div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              2. Hosting & Bereitstellung der Website (DomainFactory)
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Wir hosten diese Website bei der <strong>DomainFactory GmbH</strong> (c/o WeWork, Neuturmstraße 5, 80331 München, Deutschland).
            </p>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Beim Aufruf unserer Webseiten erfasst der Webserver automatisch sogenannte Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
            </p>
            <ul style={{ fontSize: '13px', paddingLeft: '24px', marginBottom: '12px' }}>
              <li>Browsertyp und Browserversion</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer URL (die zuvor besuchte Seite)</li>
              <li>Hostname des zugreifenden Rechners / anonymisierte IP-Adresse</li>
              <li>Uhrzeit und Datum der Serveranfrage</li>
            </ul>
            <p style={{ fontSize: '14px' }}>
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der Stabilität, Sicherheit und fehlerfreien Auslieferung unseres Webangebots.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              3. Cookies & Lokaler Speicher (Local Storage)
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Wir verwenden <strong>keine</strong> einwilligungspflichtigen Tracking- oder Werbe-Cookies.
            </p>
            <p style={{ fontSize: '14px' }}>
              Zur Steigerung des Nutzungskomforts verwendet diese Website den lokalen Speicher Ihres Browsers (<em>Local Storage</em>) ausschließlich zur Speicherung technisch notwendiger Einstellungen:
              Ihre gewählte Spracheinstellung (<code>de</code> oder <code>en</code>). Diese Speicherung ist rein funktional und erfolgt gemäß § 25 Abs. 2 Nr. 2 TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz) ohne Erforderlichkeit eines Cookie-Banners.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              4. 2-Click-Einbindung von YouTube-Videos
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Unsere Website bindet Videos der Plattform YouTube (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) über eine datenschutzfreundliche <strong>2-Click-Lösung</strong> und die datenschutzoptimierte Domain <code>youtube-nocookie.com</code> ein.
            </p>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              <strong>Wie funktioniert die 2-Click-Lösung?</strong> Beim bloßen Aufrufen unserer Website wird <em>keine</em> Verbindung zu den Servern von YouTube oder Google hergestellt. Erst wenn Sie aktiv auf „Audiovisuellen Stream laden“ oder den Play-Button klicken, willigen Sie ein, dass der externe Player geladen wird (Art. 6 Abs. 1 lit. a DSGVO). Dabei können von Google Daten (z. B. IP-Adresse, Geräteinformationen) erhoben werden.
            </p>
            <p style={{ fontSize: '14px' }}>
              Weitere Informationen zum Datenschutz bei YouTube finden Sie in der Datenschutzerklärung von Google unter:{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-sand)' }}>
                https://policies.google.com/privacy
              </a>.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              5. Web Audio API (Ägäis-Ambient-Klang)
            </h3>
            <p style={{ fontSize: '14px' }}>
              Die zuschaltbare Ambient-Klanglandschaft (sanfte Ägäis-Wellen) wird in Echtzeit rein prozedural durch die Web Audio API im Browser Ihres Endgeräts synthetisiert. Dabei werden keinerlei Audiodaten oder Nutzerdaten über das Internet übertragen.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              6. Ihre Rechte als betroffene Person
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              Sie haben nach der DSGVO jederzeit das Recht auf:
            </p>
            <ul style={{ fontSize: '13px', paddingLeft: '24px', marginBottom: '12px' }}>
              <li><strong>Auskunft</strong> über Ihre bei uns gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
              <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
              <li><strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)</li>
              <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
              <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            </ul>
            <p style={{ fontSize: '14px' }}>
              Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde zu.
            </p>
          </section>
        </article>
      )}
    </div>
  );
}
