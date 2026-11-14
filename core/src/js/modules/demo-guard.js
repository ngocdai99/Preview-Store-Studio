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
    title: 'Unlock Custom Screenshot Uploads',
    desc: 'Demo mode is for previewing curated presets and imported apps. Upgrade to Full Studio to upload custom screenshots, manage multi-device galleries, and export deliverables.',
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
    title: 'Unlock iPad Previews',
    desc: 'Preview and validate Universal Apple App Store listings on iPad mockups with realistic bezels, responsive viewports, and compliance audits.',
    mainFeature: 'iPad device preview and high-resolution exports'
  },
  'ipad-screenshots': {
    title: 'Unlock iPad Screenshots Card',
    desc: 'Upload, manage, and validate up to 10 high-resolution iPad screenshots (2048×2732 or 2064×2752 px) with real-time Apple compliance checks.',
    mainFeature: 'Full iPad screenshot suite and store deliverables'
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
  'upload-icon': {
    title: 'Unlock Custom App Icon Upload',
    desc: 'Upload, validate, and inspect your master 1024×1024 or 512×512 app icons with automated transparency audits, squircle masks, and retina previews.',
    mainFeature: 'Master App Icon uploader & store pre-flight compliance audit'
  },
  'icon-resize': {
    title: 'Unlock App Icon Resizer & Formatter',
    desc: 'Auto-format, crop, pad, and scale app icons to exact 1024×1024 and 512×512 store specifications.',
    mainFeature: 'Automated 1-click icon resizer and store compliance optimizer'
  },
  'custom-draft': {
    title: 'Create Your Custom App Listing',
    desc: 'Draft your own app listing from scratch with custom metadata, icon uploads, screenshot galleries, and high-resolution exports in Full Studio.',
    mainFeature: 'Unlimited custom app drafts with local browser persistence'
  },
  'edit-metadata': {
    title: 'Unlock Full Description & Release Notes Editing',
    desc: 'Customize Promotional Text, What\'s New release notes, and Full Descriptions with real-time character limit audits in Full Studio.',
    mainFeature: 'Full promotional copy, release notes & description editor'
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
    title: 'Custom Screenshot Upload',
    desc: 'Upload custom screenshots and manage multi-device galleries in Full Studio.'
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
    title: 'iPad Previews',
    desc: 'Preview and validate Universal Apple App Store listings on iPad.'
  },
  'ipad-screenshots': {
    title: 'iPad Screenshots Upload',
    desc: 'Upload and manage dedicated iPad screenshots (2048×2732 px).'
  },
  'tablet-screenshots': {
    title: 'Tablet Screenshots Upload',
    desc: 'Upload 7" and 10" Android tablet screenshots with Play Store audits.'
  },
  'feature-graphic': {
    title: 'Feature Graphic (1024×500)',
    desc: 'Upload and inspect Google Play promotional graphics required for store featuring.'
  },
  'upload-icon': {
    title: 'Custom App Icon Upload',
    desc: 'Upload your own master app icon with compliance audits in Plus & Pro Edition.'
  },
  'icon-resize': {
    title: 'App Icon Resizer & Formatter',
    desc: 'Resize, pad, and format icons to store specifications in Plus & Pro Edition.'
  },
  'custom-draft': {
    title: 'Create Your Custom App',
    desc: 'Drafting custom app listings is included in Plus & Pro Edition.'
  },
  'edit-metadata': {
    title: 'Description & Release Notes',
    desc: 'Promotional Text, What\'s New & Full Description are editable in Plus & Pro Edition.'
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
          <span class="ms-toast-lock" id="msToastLock" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <b id="msToastTitle">Exclusive Feature</b>
        </div>
        <span id="msToastDesc">Available in Plus Edition &amp; Pro Studio</span>
      </div>
      <a href="/#pricing" target="_top" class="ms-toast-cta" id="msToastCta">
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

      if (titleEl) titleEl.textContent = (context.title || conf.title);
      if (descEl) descEl.textContent = (context.desc || conf.desc);
      if (mainFeatEl) mainFeatEl.textContent = conf.mainFeature;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');

      const cta = $('demoUpgradeCta');
      if (cta) cta.focus();

      return true;
    }
  }

  // Use Mini Studio Toast system (context is parent page when embedded in iframe)
  const defaultItem = MINI_STUDIO_TOAST_MAP[featureKey] || MINI_STUDIO_TOAST_MAP['default'];
  const item = Object.assign({}, defaultItem, context && context.toast ? context.toast : {});
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
    const closeBtn = document.getElementById('presetPillCloseBtn');
    if (closeBtn) closeBtn.remove();

    const DEMO_LOCK_SVG = '<svg width="11.5" height="11.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    const appendLockIcon = (el, className = 'demo-lock-ico', title = 'Available in Full Studio', prepend = false) => {
      if (!el || typeof el.querySelector !== 'function' || el.querySelector('.' + className)) return null;
      const ico = document.createElement('span');
      ico.className = className;
      ico.setAttribute('aria-hidden', 'true');
      if (title) ico.title = title;
      ico.innerHTML = DEMO_LOCK_SVG;
      if (prepend && typeof el.insertBefore === 'function') {
        el.insertBefore(ico, el.firstChild || null);
      } else {
        el.appendChild(ico);
      }
      return ico;
    };
    const attachCardHeaderLock = (card, title = 'Available in Full Studio') => {
      if (!card || typeof card.querySelector !== 'function') return;
      const headerRight = card.querySelector('.card-header-right');
      if (headerRight) appendLockIcon(headerRight, 'demo-lock-ico', title, true);
    };
    const syncDynamicUploadLocks = () => {
      $$('.shot-upload-btn').forEach(btn => appendLockIcon(btn, 'demo-lock-corner', 'Custom uploads require Full Studio'));
    };
    const modalUploadBtn = $('msIconModalUploadBtn') || $('imageDetailModalUploadBtn');
    if (modalUploadBtn) appendLockIcon(modalUploadBtn, 'demo-lock-ico', 'Replacing assets requires Full Studio');
    const modalPrimaryBtn = $('iconActionPrimaryBtn');
    if (modalPrimaryBtn) {
      appendLockIcon(modalPrimaryBtn, 'demo-lock-ico', 'App Icon Resizer requires Plus or Pro Edition');
      modalPrimaryBtn.onclick = (e) => {
        if (modalPrimaryBtn.disabled) return;
        if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.isTestPreviewMode === 'function' && _g.IconResizer.isTestPreviewMode()) {
          _g.IconResizer.applyTransformation();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        requireFullVersion('icon-resize');
      };
    }

    // App Icon Studio Demo Sample Testing (Slide Carousel & Test Preview Mode)
    const initDemoIconSamples = () => {
      const _g = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});

      const applySampleToModal = (dataUrl, w, h, mime, label, sampleKey) => {
        if (!dataUrl) return;

        // 1. Tell IconResizer about the new active asset key
        if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setCurrentAssetKey === 'function') {
          _g.IconResizer.setCurrentAssetKey(sampleKey);
        }

        // 2. Activate test preview mode in resizer engine (prevents background draft mutations)
        if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setTestPreviewMode === 'function') {
          _g.IconResizer.setTestPreviewMode(true);
        }

        // Check if this sample already has a saved state (e.g. was resized or fitMode changed)
        const savedState = (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.getAssetState === 'function')
          ? _g.IconResizer.getAssetState(sampleKey)
          : null;

        const currentAsset = (savedState && savedState.isResized && savedState.transformedCurrent)
          ? savedState.transformedCurrent
          : dataUrl;

        // 3. Synchronize active asset pointer in modal scope
        if (typeof _activeModalAsset !== 'undefined') {
          _activeModalAsset = currentAsset;
        }

        // 4. Update img element
        const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
        if (imgEl) {
          imgEl.src = currentAsset;
        }

        // 5. Update IconLog / Itemized Audit
        if (typeof _g.IconLog !== 'undefined' && typeof _g.IconLog.inspectIcon === 'function') {
          const store = (typeof _g.IconLog.getTargetStore === 'function') ? _g.IconLog.getTargetStore() : 'apple';
          if (savedState && savedState.isResized && savedState.transformedCurrent) {
            _g.IconLog.inspectIcon(savedState.transformedCurrent, null, store);
          } else {
            _g.IconLog.inspectIcon(dataUrl, { size: Math.round((w || 800) * (h || 600) * 0.4), type: mime, name: label }, store);
          }
        } else if (typeof _g.inspectModalAsset === 'function') {
          _g.inspectModalAsset(currentAsset, { size: Math.round((w || 800) * (h || 600) * 0.4), type: mime, name: label });
        }

        // 6. Restore asset state in IconResizer (or set source if first time)
        if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.restoreAssetState === 'function') {
          _g.IconResizer.restoreAssetState(sampleKey, dataUrl);
        } else if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setSource === 'function') {
          _g.IconResizer.setSource(dataUrl);
        }

        // 7. Configure action button for test preview mode: disabled once already resized, no lock icon
        const primaryBtn = $('iconActionPrimaryBtn');
        if (primaryBtn) {
          primaryBtn.disabled = !!(savedState && savedState.isResized);
          const lock = primaryBtn.querySelector('.demo-lock-ico');
          if (lock) lock.remove();
          const btnText = $('iconActionPrimaryText');
          if (btnText) {
            btnText.textContent = 'Fix & Resize to Store Spec';
          }
        }
        const secTitle = $('appIconResizeSectionTitle');
        if (secTitle) secTitle.textContent = 'Test Asset Preview';
        const passNote = $('appIconFitPassNote');
        if (passNote) {
          passNote.style.display = (savedState && savedState.isResized) ? 'inline-block' : 'none';
        }
      };

      const setActiveCard = (activeId) => {
        const cards = (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function')
          ? document.querySelectorAll('.icon-demo-sample-card')
          : [];
        cards.forEach(c => c.classList.toggle('active', c.id === activeId));
      };

      const createFallbackAsset = (type) => {
        if (typeof document === 'undefined') return null;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        if (!ctx) return null;
        if (type === 'doraemon1') {
          c.width = 1200; c.height = 675;
          const grad = ctx.createLinearGradient(0, 0, 1200, 675);
          grad.addColorStop(0, '#0284c7'); grad.addColorStop(1, '#0369a1');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 675);
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(600, 310, 150, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(600, 310, 75, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.textAlign = 'center'; ctx.fillText('Test 1', 600, 560);
          return { url: c.toDataURL('image/jpeg'), w: 1200, h: 675, type: 'image/jpeg' };
        } else if (type === 'doraemon2') {
          c.width = 735; c.height = 416;
          const grad = ctx.createLinearGradient(0, 0, 735, 416);
          grad.addColorStop(0, '#4f46e5'); grad.addColorStop(1, '#7c3aed');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, 735, 416);
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(367, 190, 95, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#4f46e5'; ctx.beginPath(); ctx.arc(367, 190, 48, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.textAlign = 'center'; ctx.fillText('Test 2', 367, 350);
          return { url: c.toDataURL('image/jpeg'), w: 735, h: 416, type: 'image/jpeg' };
        } else if (type === 'doraemon3') {
          c.width = 686; c.height = 914;
          const grad = ctx.createLinearGradient(0, 0, 686, 914);
          grad.addColorStop(0, '#0d9488'); grad.addColorStop(1, '#059669');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, 686, 914);
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(343, 400, 140, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0d9488'; ctx.beginPath(); ctx.arc(343, 400, 70, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.textAlign = 'center'; ctx.fillText('Test 3', 343, 680);
          return { url: c.toDataURL('image/png'), w: 686, h: 914, type: 'image/png' };
        }
        return null;
      };

      const loadSample = (sampleKey, label, w, h, mime, cardId) => {
        setActiveCard(cardId);
        let dataUrl = '';
        if (typeof _g.DEMO_SAMPLE_ASSETS !== 'undefined' && _g.DEMO_SAMPLE_ASSETS[sampleKey]) {
          dataUrl = _g.DEMO_SAMPLE_ASSETS[sampleKey];
        } else {
          const fallback = createFallbackAsset(sampleKey);
          if (fallback) dataUrl = fallback.url;
        }
        if (dataUrl) {
          applySampleToModal(dataUrl, w, h, mime, label, sampleKey);
        }
      };

      const card1 = $('demoSampleCard1');
      if (card1) {
        card1.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          loadSample('doraemon1', 'Test 1', 1200, 675, 'image/jpeg', 'demoSampleCard1');
        });
      }

      const card2 = $('demoSampleCard2');
      if (card2) {
        card2.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          loadSample('doraemon2', 'Test 2', 735, 416, 'image/jpeg', 'demoSampleCard2');
        });
      }

      const card3 = $('demoSampleCard3');
      if (card3) {
        card3.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          loadSample('doraemon3', 'Test 3', 686, 914, 'image/png', 'demoSampleCard3');
        });
      }

      const cardPreset = $('demoSampleCardPreset');
      if (cardPreset) {
        cardPreset.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          // Save current asset state before switching to preset (keeps other test assets in memory)
          if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setCurrentAssetKey === 'function') {
            _g.IconResizer.setCurrentAssetKey('preset');
          }

          setActiveCard('demoSampleCardPreset');
          if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setTestPreviewMode === 'function') {
            _g.IconResizer.setTestPreviewMode(false);
          }
          const primaryBtn = $('iconActionPrimaryBtn');
          if (primaryBtn) {
            primaryBtn.style.display = 'inline-flex';
            primaryBtn.disabled = false;
            appendLockIcon(primaryBtn, 'demo-lock-ico', 'App Icon Resizer requires Plus or Pro Edition');
          }
          const fitContainer = $('appIconFitContainer');
          const fitPlaceholder = $('appIconFitPlaceholder');
          if (fitContainer) fitContainer.style.display = 'flex';
          if (fitPlaceholder) fitPlaceholder.style.display = 'none';
          const passNote = $('appIconFitPassNote');
          if (passNote) passNote.style.display = 'inline-block';
          const statusMsg = $('iconResizeStatusMsg');
          if (statusMsg) statusMsg.style.display = 'none';
          const secTitle = $('appIconResizeSectionTitle');
          if (secTitle) secTitle.textContent = 'Your App Icon';

          let orig = (typeof ICON !== 'undefined' && ICON) ? ICON : '';
          let tStore = 'apple';
          try {
            if (_g.IconLog && typeof _g.IconLog.getTargetStore === 'function') {
              tStore = _g.IconLog.getTargetStore();
            }
          } catch (err) {}

          if (typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON) {
            if (tStore === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) {
              orig = CUSTOM_ICON_512;
            } else if (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) {
              orig = CUSTOM_ICON_1024;
            }
          }

          if (orig) {
            if (typeof _activeModalAsset !== 'undefined') {
              _activeModalAsset = orig;
            }
            const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
            if (imgEl) imgEl.src = orig;

            if (typeof _g.IconLog !== 'undefined' && typeof _g.IconLog.inspectIcon === 'function') {
              _g.IconLog.inspectIcon(orig, null, tStore);
            } else if (typeof _g.inspectModalAsset === 'function') {
              _g.inspectModalAsset(orig, null);
            }
            if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.restoreAssetState === 'function') {
              _g.IconResizer.restoreAssetState('preset', orig);
            } else if (typeof _g.IconResizer !== 'undefined' && typeof _g.IconResizer.setSource === 'function') {
              _g.IconResizer.setSource(orig);
            }
          }
        });
      }


      // Populate card thumbnails directly from DEMO_SAMPLE_ASSETS for 0ms load
      if (typeof _g.DEMO_SAMPLE_ASSETS !== 'undefined') {
        const t1 = card1 ? card1.querySelector('img') : null;
        if (t1 && _g.DEMO_SAMPLE_ASSETS.doraemon1) t1.src = _g.DEMO_SAMPLE_ASSETS.doraemon1;
        const t2 = card2 ? card2.querySelector('img') : null;
        if (t2 && _g.DEMO_SAMPLE_ASSETS.doraemon2) t2.src = _g.DEMO_SAMPLE_ASSETS.doraemon2;
        const t3 = card3 ? card3.querySelector('img') : null;
        if (t3 && _g.DEMO_SAMPLE_ASSETS.doraemon3) t3.src = _g.DEMO_SAMPLE_ASSETS.doraemon3;
      }

      const presetThumb = $('demoSamplePresetThumb');
      if (presetThumb) {
        const cur = (typeof ICON !== 'undefined' && ICON) ? ICON : '';
        if (cur) presetThumb.src = cur;
      }
    };
    initDemoIconSamples();

    // Demo Mode: Reorder Editor Cards 2, 3, 4 -> Metrics (2), Description (3), Phone Screenshots (4)
    {
      const editorPanel = $('editorPanel');
      const identityCardEl = $('identityCard');
      const statsCardEl = $('statsCard');
      const contentCardEl = $('contentCard');
      const shotsCardEl = $('shotsCard');
      if (editorPanel && identityCardEl && statsCardEl && contentCardEl && shotsCardEl) {
        identityCardEl.after(statsCardEl, contentCardEl, shotsCardEl);
        const setCardNum = (card, num) => {
          const badge = card.querySelector('.card-header .card-num');
          if (badge) {
            badge.textContent = String(num);
          }
        };
        setCardNum(statsCardEl, 2);
        setCardNum(contentCardEl, 3);
        setCardNum(shotsCardEl, 4);
      }
    }
    
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

            <div class="menu-div" style="margin: 6px 0;"></div>

            <button type="button" class="menu-item active-export" id="optResetAllData" title="Reset all data and reload">
              <span class="mi-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <polyline points="23 20 23 14 17 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
              </span>
              <span class="mi-t">
                <span class="mi-name-row">
                  <span class="mi-title-wrap">
                    <span class="mi-name">Reset Workspace</span>
                    <svg class="mi-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </span>
                <small>Clear all data &amp; reload</small>
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
            <p class="ms-side-card-desc">Export pristine 4K print-ready mockups, Android tablet previews &amp; instant store submission bundles.</p>
          </div>

          <div class="ms-side-highlights">
            <div class="ms-menu-section-title" style="padding:0; margin-bottom:6px;">Highlights</div>
            <div class="ms-side-link" id="btnHlClean" role="button" tabindex="0">
              <span>4K Ultra HD Export</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="ms-side-link" id="btnHlTablet" role="button" tabindex="0">
              <span>Android Tablet Layouts</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="ms-side-link" id="btnHlOffline" role="button" tabindex="0">
              <span>Store Listing Markdown</span>
              <svg class="ms-side-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      `;

      // Shared Demo 2x Retina Mockup export runner (with watermark + busy button state)
      const runDemoRetinaExport = async (triggerBtn) => {
        if (menuExport) menuExport.classList.remove('show');
        try {
          if (typeof window.clarity === 'function') {
            window.clarity('event', 'demo_export_retina_click');
          }
        } catch (_) {}
        if (typeof exportPNG !== 'function') return;

        if (triggerBtn && triggerBtn.classList && triggerBtn.classList.contains('demo-export-retina-btn')) {
          if (triggerBtn.disabled) return;
          const fullLbl = triggerBtn.querySelector('.demo-export-lbl-full');
          const shortLbl = triggerBtn.querySelector('.demo-export-lbl-short');
          const origFull = fullLbl ? fullLbl.textContent : '';
          const origShort = shortLbl ? shortLbl.textContent : '';
          triggerBtn.disabled = true;
          triggerBtn.classList.add('is-exporting');
          if (fullLbl) fullLbl.textContent = 'Rendering...';
          if (shortLbl) shortLbl.textContent = 'Exporting...';
          try {
            await exportPNG(2, { watermark: true, allowDemo: true });
          } finally {
            triggerBtn.disabled = false;
            triggerBtn.classList.remove('is-exporting');
            if (fullLbl && origFull) fullLbl.textContent = origFull;
            if (shortLbl && origShort) shortLbl.textContent = origShort;
          }
        } else {
          await exportPNG(2, { watermark: true, allowDemo: true });
        }
      };

      // 0. Direct 1-click "Download Mockup [Retina]" button next to the Menu button
      const exportDropdownEl = $('workspaceExportDropdown');
      if (exportDropdownEl && exportDropdownEl.parentNode && !$('btnDemoExportRetina')) {
        const directExportBtn = document.createElement('button');
        directExportBtn.type = 'button';
        directExportBtn.className = 'demo-export-retina-btn';
        directExportBtn.id = 'btnDemoExportRetina';
        directExportBtn.setAttribute('aria-label', 'Download Mockup Retina PNG');
        directExportBtn.title = 'Download live device mockup in 2x Retina HD';
        directExportBtn.innerHTML = `
          <span class="btn-spinner demo-export-spinner" aria-hidden="true"></span>
          <span class="demo-export-ico demo-export-ico-img" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </span>
          <span class="demo-export-ico demo-export-ico-dl" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </span>
          <span class="demo-export-lbl-full">Download Mockup</span>
          <span class="demo-export-lbl-short">Export</span>
          <span class="mi-supa-tag demo-export-retina-tag">Retina</span>
        `;
        directExportBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          runDemoRetinaExport(directExportBtn);
        };
        exportDropdownEl.parentNode.insertBefore(directExportBtn, exportDropdownEl);
      }

      // 1. Download Mockup 2x PNG with Watermark (Menu item fallback)
      const btnExportMockup = $('btnExportMockup4K');
      if (btnExportMockup) {
        btnExportMockup.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          runDemoRetinaExport(btnExportMockup);
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

      // 3. Reset Action on Demo Menu (Same behavior as Core Studio)
      const btnResetDemo = $('optResetAllData');
      if (btnResetDemo) {
        btnResetDemo.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          menuExport.classList.remove('show');
          if (typeof showResetConfirmModal === 'function' && typeof resetFactoryStorage === 'function') {
            showResetConfirmModal(
              resetFactoryStorage,
              'Reset All Data?',
              'Clear all stored data and reload to clean state.',
              'Reset'
            );
          }
        };
      }
    }

    // Add consistent lock icons and click locks to Google 7" and 10" Tablet selectors
    const tabletGatedIds = ['optGoogleTab7', 'optGoogleTab10'];
    tabletGatedIds.forEach(id => {
      const item = $(id);
      if (item) {
        appendLockIcon(item, 'demo-lock-ico', 'Android tablet previews require Full Studio');
        item.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          const stageMenu = $('menuGoogleDevice');
          if (stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');
          requireFullVersion('google-tablet');
        }, true);
      }
    });

    // Add lock icon on Phone Screenshots header & lock upload buttons / hide delete actions
    const shotsCard = $('shotsCard');
    if (shotsCard) {
      attachCardHeaderLock(shotsCard, 'Custom screenshot uploads require Full Studio');

      const addShotBtn = $('addShot');
      if (addShotBtn) appendLockIcon(addShotBtn, 'demo-lock-ico', 'Custom screenshot uploads require Full Studio');

      // Intercept upload, add slot, and remove triggers on Phone Screenshots card (keep header collapse, tooltips, inspect)
      shotsCard.addEventListener('click', e => {
        if (e.target.closest('.card-header, .info-tip-btn, .shot-inspect-btn')) return;
        if (e.target.closest('.shot-remove-btn')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          requireFullVersion('upload-shots');
          return;
        }
        const addBtn = e.target.closest('#addShot');
        if (addBtn) {
          e.preventDefault();
          e.stopImmediatePropagation();
          requireFullVersion('upload-shots');
          return;
        }
        const isUploadTrigger = e.target.closest('.shot-upload-btn, .shot-thumb-wrap.is-placeholder');
        if (isUploadTrigger) {
          e.preventDefault();
          e.stopImmediatePropagation();
          requireFullVersion('upload-shots');
          return;
        }
      }, true);

      // Intercept file drag-and-drop on Phone Screenshots card
      shotsCard.addEventListener('dragover', e => {
        const dt = e.dataTransfer;
        if (dt && Array.from(dt.types || []).includes('Files')) {
          e.preventDefault();
        }
      }, true);

      shotsCard.addEventListener('drop', e => {
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          requireFullVersion('upload-shots');
        }
      }, true);

      // Intercept file input as failsafe
      const shotFileInput = $('shotFile');
      if (shotFileInput) {
        shotFileInput.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          requireFullVersion('upload-shots');
        }, true);
      }
    }

    // Gated Editor Form Cards: Allow normal expand/collapse, but intercept and block uploads/deletions
    const gatedUploadCards = [
      {
        cardId: 'ipadCard',
        paywallKey: 'ipad-screenshots',
        uploadSelectors: ['#addIpadShot', '.shot-upload-btn', '.shot-remove-btn'],
        lockBtnIds: ['addIpadShot'],
        fileInputIds: ['ipadShotFile']
      },
      {
        cardId: 'tabCard',
        paywallKey: 'tablet-screenshots',
        uploadSelectors: ['#tab7Add', '#tab10Add', '.shot-upload-btn', '.shot-remove-btn'],
        lockBtnIds: ['tab7Add', 'tab10Add'],
        fileInputIds: ['tab7File', 'tab10File']
      },
      {
        cardId: 'featureCard',
        paywallKey: 'feature-graphic',
        uploadSelectors: ['#featureUp', '#featureDropZone', '#featurePrev', '#featureRemove'],
        lockBtnIds: [],
        fileInputIds: ['featureFile']
      }
    ];

    gatedUploadCards.forEach(({ cardId, paywallKey, uploadSelectors, lockBtnIds, fileInputIds }) => {
      const card = $(cardId);
      if (card) {
        attachCardHeaderLock(card, 'Available in Full Studio');

        (lockBtnIds || []).forEach(btnId => {
          const b = $(btnId);
          if (b) appendLockIcon(b, 'demo-lock-ico', 'Available in Full Studio');
        });

        // Intercept upload & irreversible delete trigger clicks inside card body only
        card.addEventListener('click', e => {
          // Allow normal header collapse/expand, tooltips, and inspection
          if (e.target.closest('.card-header, .info-tip-btn, #featureInspect')) return;

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

    // Keep dynamic screenshot row upload buttons badged with lock corner icon across preset/store switches
    syncDynamicUploadLocks();
    if (typeof MutationObserver === 'function') {
      ['slist', 'ipadSlist', 'tab7List', 'tab10List'].forEach(listId => {
        const listEl = $(listId);
        if (listEl) {
          new MutationObserver(syncDynamicUploadLocks).observe(listEl, { childList: true });
        }
      });
    }

    // 6. Gated Metadata Input Fields (Card 1 Identity inputs stay editable; Description card fields locked with live focus-link highlight & lock icons)
    attachCardHeaderLock($('contentCard'), 'Description & Release Notes editing requires Full Studio');

    const lockedFieldIds = ['f-promo', 'f-new', 'f-desc'];
    const lockedFieldKeys = {
      'f-promo': 'promo',
      'f-new': 'new',
      'f-desc': 'desc'
    };

    lockedFieldIds.forEach(id => {
      const fieldKey = lockedFieldKeys[id];
      const el = $(id);
      if (el) {
        el.readOnly = true;
        el.classList.add('demo-locked-input', 'demo-disabled-input');
        el.removeAttribute('title');
        
        const triggerPaywallAndHighlight = () => {
          if (typeof setFieldFocus === 'function') {
            setFieldFocus(fieldKey, true);
          }
          requireFullVersion('edit-metadata');
        };

        el.addEventListener('click', () => {
          triggerPaywallAndHighlight();
        });

        el.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') return;
          e.preventDefault();
          triggerPaywallAndHighlight();
        });

        el.addEventListener('paste', (e) => {
          e.preventDefault();
          triggerPaywallAndHighlight();
        });

        // Also allow clicking the parent .fg label/wrapper to trigger highlight & paywall, and show field lock icon
        const fg = el.closest('.fg');
        if (fg) {
          const lblEl = fg.querySelector('.lr label');
          if (lblEl) appendLockIcon(lblEl, 'demo-lock-ico', 'Locked in Demo Mode');
          fg.style.cursor = 'pointer';
          fg.addEventListener('click', e => {
            if (e.target.closest('.info-tip-btn, .tag, input, textarea')) return;
            triggerPaywallAndHighlight();
          });
        }
      }
    });

    // 7. Gated App Icon Upload (Intercept uploads while maintaining icon yellow highlight)
    const triggerIconPaywallAndHighlight = () => {
      if (typeof setFieldFocus === 'function') {
        setFieldFocus('icon', true);
      }
      requireFullVersion('upload-icon');
    };

    const icoUpBtn = $('icoUp');
    if (icoUpBtn) {
      icoUpBtn.classList.add('demo-sample-guided-btn');
      icoUpBtn.title = 'Inspect, test & resize app icon';
      icoUpBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (typeof openImageDetailModal === 'function') {
          openImageDetailModal({ src: (typeof ICON !== 'undefined' ? ICON : ''), type: 'icon', store: (typeof store !== 'undefined' ? store : 'apple') });
        } else {
          triggerIconPaywallAndHighlight();
        }
      }, true);
    }

    const featureRemoveBtn = $('featureRemove');
    if (featureRemoveBtn) {
      featureRemoveBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        requireFullVersion('feature-graphic');
      }, true);
    }

    // Add lock icon on Card 1 identity upload & dropzone
    const icoRemoveBtn = $('icoRemove');
    if (icoRemoveBtn) {
      icoRemoveBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        triggerIconPaywallAndHighlight();
      }, true);
    }

    const icoDropZone = $('icoDropZone');
    if (icoDropZone) {
      icoDropZone.title = 'Inspect, test & resize app icon';
      icoDropZone.addEventListener('click', e => {
        if (e.target.closest('#icoInspect, .info-tip-btn')) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (typeof openImageDetailModal === 'function') {
          openImageDetailModal({ src: (typeof ICON !== 'undefined' ? ICON : ''), type: 'icon', store: (typeof store !== 'undefined' ? store : 'apple') });
        } else {
          triggerIconPaywallAndHighlight();
        }
      }, true);

      icoDropZone.addEventListener('keydown', e => {
        if (e.target.closest('#icoInspect, .info-tip-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (typeof openImageDetailModal === 'function') {
            openImageDetailModal({ src: (typeof ICON !== 'undefined' ? ICON : ''), type: 'icon', store: (typeof store !== 'undefined' ? store : 'apple') });
          } else {
            triggerIconPaywallAndHighlight();
          }
        }
      }, true);

      icoDropZone.addEventListener('dragover', e => {
        const dt = e.dataTransfer;
        if (dt && Array.from(dt.types || []).includes('Files')) {
          e.preventDefault();
        }
      }, true);

      icoDropZone.addEventListener('drop', e => {
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          triggerIconPaywallAndHighlight();
        }
      }, true);
    }

    const icoFile = $('icoFile');
    if (icoFile) {
      icoFile.disabled = true;
      icoFile.addEventListener('change', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        icoFile.value = '';
        triggerIconPaywallAndHighlight();
      }, true);
    }

    // 8. Gated "+ Your App" Custom Draft Button (Intercept ONLY "+ Your App", allow viewing existing draft)
    const btnDraft = $('btnDraft');
    if (btnDraft) {
      const syncDraftLock = () => {
        if (!btnDraft.classList.contains('has-draft')) {
          appendLockIcon(btnDraft, 'demo-lock-ico', 'Custom app drafts require Full Studio');
        }
      };
      syncDraftLock();
      if (typeof MutationObserver === 'function') {
        new MutationObserver(syncDraftLock).observe(btnDraft, { childList: true, attributes: true, attributeFilter: ['class'] });
      }
      btnDraft.addEventListener('click', e => {
        if (e.target.closest('#msPillResetBtn')) return;
        // If user already has an active or saved draft (e.g. via ?appid=... or store import), allow viewing their draft
        const hasDraft = (typeof hasUserDraft === 'function' && hasUserDraft()) ||
                         (typeof userDraft !== 'undefined' && !!userDraft) ||
                         btnDraft.classList.contains('has-draft');
        if (hasDraft) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        requireFullVersion('custom-draft');
      }, true);
    }

    const btnCopyPreset = $('btnCopyPresetToDraft');
    if (btnCopyPreset) {
      btnCopyPreset.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        requireFullVersion('custom-draft');
      }, true);
    }
  }
}

if (typeof document !== 'undefined') {
  // Ensure default Dark Mode in Demo Mode if user has not explicitly set a preference
  try {
    const demoUiPref = localStorage.getItem('store_preview_studio_demo_ui');
    const curUi = demoUiPref || 'dark';
    document.documentElement.dataset.ui = curUi;
    if (typeof applyUiTheme === 'function') {
      applyUiTheme(curUi);
    }
  } catch (_) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoGuard);
  } else {
    initDemoGuard();
  }
}
