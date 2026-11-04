// Store Preview Studio · Demo Mode & Feature Gating Guard

function isDemoMode() {
  return typeof window !== 'undefined' && !!window.SPS_DEMO_MODE;
}

const DEMO_PAYWALL_CONFIGS = {
  'export-png': {
    title: 'Unlock 4K Ultra HD Mockup Exports',
    desc: 'Export pristine 4K Retina device frames, transparent cutouts, and screen-only mockups ready for App Store & Google Play marketing.',
    mainFeature: 'Pristine 4K Ultra HD & Retina mockups (zero watermarks)'
  },
  'export-copy': {
    title: 'Unlock 1-Click Clipboard Store Metadata',
    desc: 'Instantly copy structured, validated metadata formatted specifically for App Store Connect and Google Play Console.',
    mainFeature: '1-Click formatted clipboard export for both stores'
  },
  'export-markdown': {
    title: 'Unlock Store Listing Documents',
    desc: 'Export structured, submission-ready store listing documents with character counts, store compliance audits, and release notes.',
    mainFeature: 'Store-ready submission documents & character compliance reports'
  },
  'export-json': {
    title: 'Unlock Project Backup & Team Handoff',
    desc: 'Save and restore entire store configurations, custom screenshots, and metadata with portable .json project files.',
    mainFeature: 'Full project save, backup, and restore capabilities'
  },
  'import-json': {
    title: 'Unlock Project JSON Import',
    desc: 'Import saved project backups and templates seamlessly into Store Preview Studio.',
    mainFeature: 'Open and load unlimited .json project configs'
  },
  'store-import': {
    title: 'Unlock 1-Click App Store Importer',
    desc: 'Clone live Apple App Store listings by URL or ID. Automatically populate icons, screenshots, ratings, categories, and descriptions in seconds.',
    mainFeature: 'Instant App Store cloning from any public URL or ID'
  },
  'upload-shots': {
    title: 'Upload Unlimited Screenshots',
    desc: 'Demo mode allows testing up to 2 screenshots in RAM. Upgrade to Full Studio for up to 10 screenshots per device, iPad layouts, and persistent local storage.',
    mainFeature: 'Full 10-screenshot gallery per device with offline persistence'
  },
  'phone-screenshots': {
    title: 'Unlock Phone Screenshots (iPhone & Android)',
    desc: 'Upload, manage, and validate up to 10 high-resolution screenshots for both Apple iPhone and Google Play Android phones with real-time store compliance checks and 100% offline persistence.',
    mainFeature: 'Full 10-screenshot gallery for iPhone & Android with offline persistence'
  },
  'google-tablet': {
    title: 'Unlock Android Tablet Previews',
    desc: 'Preview and validate store listings for 7-inch and 10-inch Android tablets with authentic bezels, responsive viewports, and compliance audits.',
    mainFeature: '7-inch & 10-inch Android tablet layouts and mockup exports'
  },
  'apple-ipad': {
    title: 'Unlock iPad Pro 13" Previews',
    desc: 'Preview and validate Universal Apple App Store listings on 13-inch iPad Pro mockups with authentic bezels, responsive viewports, and compliance audits.',
    mainFeature: 'iPad Pro 13" device preview and high-resolution exports'
  },
  'ipad-screenshots': {
    title: 'Unlock iPad Pro Screenshots Card',
    desc: 'Upload, manage, and validate up to 10 high-resolution iPad Pro 13" screenshots (2048×2732 or 2064×2752 px) with real-time Apple compliance checks.',
    mainFeature: 'Full iPad Pro screenshot suite and store deliverables'
  },
  'tablet-screenshots': {
    title: 'Unlock Tablet Screenshots Card',
    desc: 'Upload, manage, and audit 7-inch and 10-inch Android tablet screenshots up to 8 MB with Google Play compliance checks.',
    mainFeature: '7-inch & 10-inch Android tablet screenshot suite'
  },
  'feature-graphic': {
    title: 'Unlock Google Play Feature Graphic',
    desc: 'Upload, inspect, and validate 1024×500 px promotional graphics required for Google Play store featuring, promo video banners, and Google Ads.',
    mainFeature: '1024×500 px Feature Graphic validator and real-time live preview'
  },
  'default': {
    title: 'Unlock Full Studio',
    desc: 'A standalone workspace to design, preview, and export store-ready listings.',
    mainFeature: 'Pristine 4K Ultra HD & Retina mockups (zero watermarks)'
  }
};

const MINI_STUDIO_TOAST_MAP = {
  'export-png': {
    title: '4K Ultra HD Export',
    desc: 'Export pristine, watermark-free 4K mockups ready for store marketing.'
  },
  'export-copy': {
    title: 'Store Metadata Clipboard',
    desc: 'Copy formatted metadata directly for App Store Connect & Google Play.'
  },
  'export-markdown': {
    title: 'Store Listing Documents',
    desc: 'Export structured listing documents with compliance audits & character counts.'
  },
  'export-json': {
    title: 'Project Backup Export',
    desc: 'Save and restore complete workspace configurations & custom assets.'
  },
  'import-json': {
    title: 'Project JSON Import',
    desc: 'Open and load saved .json project files and templates seamlessly.'
  },
  'store-import': {
    title: '1-Click App Store Clone',
    desc: 'Clone live Apple App Store listings by URL or ID in seconds.'
  },
  'upload-shots': {
    title: 'Screenshot Upload Limit',
    desc: 'Demo mode is limited to 2 screenshots. Full Version supports up to 10 screenshots.'
  },
  'phone-screenshots': {
    title: 'Phone Screenshots Gallery',
    desc: 'Upload and manage up to 10 full-resolution screenshots with compliance checks.'
  },
  'google-tablet': {
    title: 'Android Tablet Previews',
    desc: 'Preview and validate 7-inch & 10-inch Android tablet layouts.'
  },
  'apple-ipad': {
    title: 'iPad Pro 13" Previews',
    desc: 'Preview and validate Universal Apple App Store listings on iPad Pro 13".'
  },
  'ipad-screenshots': {
    title: 'iPad Screenshots Upload',
    desc: 'Upload and manage dedicated 13" iPad Pro screenshots (2048×2732 px).'
  },
  'tablet-screenshots': {
    title: 'Tablet Screenshots Upload',
    desc: 'Upload 7" and 10" Android tablet screenshots with Play Store audits.'
  },
  'feature-graphic': {
    title: 'Feature Graphic (1024×500)',
    desc: 'Upload and inspect Google Play promotional graphics required for store featuring.'
  },
  'default': {
    title: 'Exclusive Feature',
    desc: 'Available in Plus Edition & Pro Studio.'
  }
};

let msLocalToastTimer = null;

function showMiniStudioToast(item) {
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const payload = {
    title: (item && item.title) || 'Exclusive Feature',
    desc: (item && item.desc) || 'Available in Plus Edition & Pro Studio.',
    ctaText: (item && item.ctaText) || 'Buy Now',
    url: (item && item.url) || '/#pricing',
    tagText: (item && item.tagText) || 'BUY'
  };

  // 1. When inside an iframe on the /try page, show toast on parent page context!
  if (isEmbedded) {
    try {
      window.parent.postMessage({
        type: 'sps-mini-toast',
        toast: payload
      }, '*');
      return;
    } catch (_) {}
  }

  // 2. Standalone page mode (/try.html): render in local document context
  let t = $('msToast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'ms-toast';
    t.id = 'msToast';
    t.hidden = true;
    t.innerHTML = `
      <div class="ms-toast-body">
        <div class="ms-toast-header-row">
          <span class="ms-tag plus buy" id="msToastTag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            BUY
          </span>
          <b id="msToastTitle">Exclusive Feature</b>
        </div>
        <span id="msToastDesc">Available in Plus Edition &amp; Pro Studio</span>
      </div>
      <a href="/#pricing" class="ms-toast-cta" id="msToastCta">
        <span>Buy Now</span>
      </a>
      <button type="button" class="ms-toast-close" id="msToastClose" aria-label="Close notification">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    document.body.appendChild(t);

    const closeBtn = t.querySelector('#msToastClose');
    if (closeBtn) {
      closeBtn.onclick = () => {
        t.classList.remove('show');
        setTimeout(() => { t.hidden = true; }, 300);
      };
    }
  }

  const titleEl = t.querySelector('#msToastTitle');
  if (titleEl) titleEl.textContent = payload.title;

  const descEl = t.querySelector('#msToastDesc');
  if (descEl) descEl.textContent = payload.desc;

  const ctaEl = t.querySelector('#msToastCta');
  if (ctaEl) {
    ctaEl.href = payload.url;
    const ctaSpan = ctaEl.querySelector('span');
    if (ctaSpan) ctaSpan.textContent = payload.ctaText;
  }

  t.hidden = false;
  void t.offsetWidth;
  t.classList.add('show');

  clearTimeout(msLocalToastTimer);
  msLocalToastTimer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 300);
  }, 4500);
}

function requireFullVersion(featureKey, context = {}) {
  // Allow explicit modal opening only when explicitly flagged in context
  if (context && context.showModal) {
    const modal = $('demoUpgradeModal');
    if (modal) {
      const conf = DEMO_PAYWALL_CONFIGS[featureKey] || DEMO_PAYWALL_CONFIGS['default'];
      const titleEl = $('demoUpgradeTitle');
      const descEl = $('demoUpgradeDesc');
      const mainFeatEl = $('demoUpgradeFeatureMain');

      if (titleEl) titleEl.textContent = conf.title;
      if (descEl) descEl.textContent = conf.desc;
      if (mainFeatEl) mainFeatEl.textContent = conf.mainFeature;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');

      const cta = $('demoUpgradeCta');
      if (cta) cta.focus();

      return true;
    }
  }

  // Use Mini Studio Toast system (context is parent page when embedded in iframe)
  const item = MINI_STUDIO_TOAST_MAP[featureKey] || MINI_STUDIO_TOAST_MAP['default'];
  showMiniStudioToast(item);
  return false;
}

function closeDemoUpgradeModal() {
  const modal = $('demoUpgradeModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function initDemoGuard() {
  const modal = $('demoUpgradeModal');
  if (!modal) return;

  const closeBtn = $('demoUpgradeClose');
  if (closeBtn) closeBtn.onclick = closeDemoUpgradeModal;

  const dismissBtn = $('demoUpgradeDismiss');
  if (dismissBtn) dismissBtn.onclick = closeDemoUpgradeModal;

  modal.addEventListener('click', e => {
    if (e.target === modal) closeDemoUpgradeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeDemoUpgradeModal();
    }
  });

  if (isDemoMode()) {
    document.body.classList.add('sps-demo-mode');
    
    // Setup Mini Studio Supabase Menu in Demo Mode
    const menuExport = $('menuExport');
    if (menuExport) {
      menuExport.classList.add('ms-supabase-menu');
      menuExport.innerHTML = `
        <div class="ms-menu-main-cols">
          <!-- Col 1: Features / Export Assets -->
          <div class="ms-menu-col">
            <div class="ms-menu-section-title">Features</div>
            
            <button type="button" class="menu-item active-export" id="btnExportMockup4K" title="Export current live device stage in 2x Retina HD">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-title-wrap">
                    <span class="mi-name">Download Mockup</span>
                    <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                  <span class="mi-supa-tag" id="msMockupBadgeGroup">Retina</span>
                </span>
                <small>With watermark</small>
              </span>
            </button>

            <button type="button" class="menu-item is-locked" id="btnExportClean4K" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Clean Mockup</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>No watermark · Studio print-ready</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>

            <button type="button" class="menu-item is-locked" id="btnExportScreenOnly" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Screen Only</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>Store UI without device bezel</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>
          </div>

          <!-- Col 2: Modules / Metadata & Project -->
          <div class="ms-menu-col">
            <div class="ms-menu-section-title">Modules</div>

            <button type="button" class="menu-item menu-item-copy is-locked" id="btnCopyText" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Copy Metadata</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>Title, subtitle &amp; descriptions</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>

            <button type="button" class="menu-item is-locked" id="btnExportMD" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Export Metadata</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>Full store listing document</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>

            <button type="button" class="menu-item is-locked" id="btnExportJSON" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Export Project</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>Full backup of text &amp; images</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>

            <button type="button" class="menu-item is-locked" id="btnImportJSON" tabindex="-1">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-name">Import Project</span>
                  <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
                <small>Restore workspace from backup</small>
              </span>
              <span class="mi-lock-ico" aria-hidden="true" title="Included in Plus Edition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
            </button>
          </div>
        </div>

        <!-- Col 3: Side Panel (Supabase customer stories / promo style) -->
        <div class="ms-menu-side-col">
          <div class="ms-menu-section-title">Plus Edition &rsaquo;</div>
          
          <div class="ms-menu-side-card" id="btnUpgradeCard" role="button" tabindex="0">
            <div class="ms-side-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>Unlock Full Studio</span>
            </div>
            <p class="ms-side-card-desc">Export pristine 4K print-ready mockups, iPad 13" previews &amp; instant store submission bundles.</p>
          </div>

          <div class="ms-side-highlights">
            <div class="ms-menu-section-title" style="padding:0; margin-bottom:6px;">Highlights</div>
            <div class="ms-side-link" id="btnHlClean" role="button" tabindex="0">
              <span>4K Ultra HD Export</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="ms-side-link" id="btnHlTablet" role="button" tabindex="0">
              <span>iPad Pro &amp; Tablet Layouts</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="ms-side-link" id="btnHlOffline" role="button" tabindex="0">
              <span>Store Listing Markdown</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      `;

      // 1. Download Mockup 2x PNG with Watermark
      const btnExportMockup = $('btnExportMockup4K');
      if (btnExportMockup) {
        btnExportMockup.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          menuExport.classList.remove('show');
          if (typeof exportPNG === 'function') {
            exportPNG(2, { watermark: true, allowDemo: true });
          }
        };
      }

      // 2. Locked Mockup actions -> trigger tailored paywalls
      const lockedActions = [
        { id: 'btnExportClean4K', key: 'export-png' },
        { id: 'btnExportScreenOnly', key: 'export-png' },
        { id: 'btnCopyText', key: 'export-copy' },
        { id: 'btnExportMD', key: 'export-markdown' },
        { id: 'btnExportJSON', key: 'export-json' },
        { id: 'btnImportJSON', key: 'import-json' },
        { id: 'btnUpgradeCard', key: 'default' },
        { id: 'btnHlClean', key: 'export-png' },
        { id: 'btnHlTablet', key: 'google-tablet' },
        { id: 'btnHlOffline', key: 'export-markdown' }
      ];

      lockedActions.forEach(({ id, key }) => {
        const el = $(id);
        if (el) {
          el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuExport.classList.remove('show');
            requireFullVersion(key);
          };
        }
      });
    }

    // Add Buy badges and click locks to Google 7" and 10" Tablet selectors
    const tabletGatedIds = ['optGoogleTab7', 'optGoogleTab10'];
    tabletGatedIds.forEach(id => {
      const item = $(id);
      if (item) {
        if (!item.querySelector('.demo-locked-badge')) {
          const badge = document.createElement('span');
          badge.className = 'demo-locked-badge btn-primary';
          badge.textContent = 'Buy';
          item.appendChild(badge);
        }
        item.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          const stageMenu = $('menuGoogleDevice');
          if (stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');
          requireFullVersion('google-tablet');
        }, true);
      }
    });

    // Add Buy badge and click lock to Apple iPad selector
    const appleIpadBtn = $('optAppleIpad');
    if (appleIpadBtn) {
      if (!appleIpadBtn.querySelector('.demo-locked-badge')) {
        const badge = document.createElement('span');
        badge.className = 'demo-locked-badge btn-primary';
        badge.textContent = 'Buy';
        appleIpadBtn.appendChild(badge);
      }
      appleIpadBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const stageMenu = $('menuAppleDevice');
        if (stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');
        requireFullVersion('apple-ipad');
      }, true);
    }

    // Gated Editor Form Cards: Allow normal expand/collapse, but intercept and block uploads
    const gatedUploadCards = [
      {
        cardId: 'ipadCard',
        paywallKey: 'ipad-screenshots',
        uploadSelectors: ['#addIpadShot', '.shot-upload-btn'],
        fileInputIds: ['ipadShotFile']
      },
      {
        cardId: 'tabCard',
        paywallKey: 'tablet-screenshots',
        uploadSelectors: ['#tab7Add', '#tab10Add', '.shot-upload-btn'],
        fileInputIds: ['tab7File', 'tab10File']
      },
      {
        cardId: 'featureCard',
        paywallKey: 'feature-graphic',
        uploadSelectors: ['#featureUp', '#featureDropZone', '#featurePrev'],
        fileInputIds: ['featureFile']
      }
    ];

    gatedUploadCards.forEach(({ cardId, paywallKey, uploadSelectors, fileInputIds }) => {
      const card = $(cardId);
      if (card) {
        // Add subtle Buy badge on header right without blocking expand/collapse
        const headerRight = card.querySelector('.card-header-right');
        if (headerRight && !headerRight.querySelector('.demo-locked-badge')) {
          const badge = document.createElement('span');
          badge.className = 'demo-locked-badge btn-primary';
          badge.textContent = 'Buy';
          badge.style.pointerEvents = 'none';
          headerRight.insertBefore(badge, headerRight.firstChild);
        }

        // Intercept upload trigger clicks inside card body only
        card.addEventListener('click', e => {
          // Allow normal header collapse/expand, tooltips, inspection, and removal
          if (e.target.closest('.card-header, .info-tip-btn, #featureRemove, #featureInspect')) return;

          const isUploadTrigger = uploadSelectors.some(sel => e.target.closest(sel));
          if (isUploadTrigger) {
            e.preventDefault();
            e.stopImmediatePropagation();
            requireFullVersion(paywallKey);
          }
        }, true);

        // Intercept file drag-and-drop uploads
        card.addEventListener('dragover', e => {
          const dt = e.dataTransfer;
          if (dt && Array.from(dt.types || []).includes('Files')) {
            e.preventDefault();
          }
        }, true);

        card.addEventListener('drop', e => {
          const files = e.dataTransfer && e.dataTransfer.files;
          if (files && files.length > 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            requireFullVersion(paywallKey);
          }
        }, true);

        // Intercept file input change events as failsafe
        fileInputIds.forEach(fId => {
          const input = $(fId);
          if (input) {
            input.addEventListener('change', e => {
              e.preventDefault();
              e.stopImmediatePropagation();
              input.value = '';
              requireFullVersion(paywallKey);
            }, true);
          }
        });
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoGuard);
  } else {
    initDemoGuard();
  }
}
