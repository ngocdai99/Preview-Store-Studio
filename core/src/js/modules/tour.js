// Store Preview Studio · Interactive Guided Tour Engine

const SPS_TOUR_STEPS = [
  {
    target: '#storeSwitcher',
    fallbackTarget: '.header-center',
    title: 'Multi-Store & Device Engine',
    desc: 'Switch between Apple App Store and Google Play instantly. Preview iPhone, iPad, and Android tablets with realistic device frames and adaptive light/dark themes.'
  },
  {
    target: '#btnPresetPill',
    fallbackTarget: '#workspaceBar',
    title: 'Curated Presets & Instant Sandbox',
    desc: 'Explore curated store listings for SaaS, Fitness, Meditation, Gaming, and EdTech, or click "+ Your App" to start drafting your own product directly in your browser.'
  },
  {
    target: '#editorPanel',
    fallbackTarget: '.editor',
    title: 'Real-Time ASO Listing Editor',
    desc: 'Fine-tune App Title, Subtitle, Promotional Text, Categories, and Descriptions. Click Focus-Link buttons to highlight exact fields on the live preview.'
  },
  {
    target: '#icoDropZone',
    fallbackTarget: '#f-name',
    title: 'Store Compliance & Icon Inspector',
    desc: 'Audit your app icon for Apple alpha channel rejections, 1024×1024 / 512×512 sizing, and squircle corner radii.'
  },
  {
    target: '#workspaceExportDropdown',
    fallbackTarget: '#btnExport',
    title: 'Export Deliverables',
    desc: 'Generate 3x Ultra HD PNG device mockups, store-ready clipboard text, complete LISTING_METADATA.md reports, and portable JSON backups.'
  }
];

let currentTourStep = -1;
let tourOverlayElements = null;

function createTourDOM() {
  if (tourOverlayElements) return tourOverlayElements;

  const backdrop = document.createElement('div');
  backdrop.className = 'sps-tour-backdrop';
  backdrop.id = 'spsTourBackdrop';

  const spotlight = document.createElement('div');
  spotlight.className = 'sps-tour-spotlight';
  spotlight.id = 'spsTourSpotlight';

  const popover = document.createElement('div');
  popover.className = 'sps-tour-popover';
  popover.id = 'spsTourPopover';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'true');

  popover.innerHTML = `
    <div class="sps-tour-header">
      <span class="sps-tour-step-badge btn-white" id="spsTourStepBadge">Step 1 of 5</span>
      <button type="button" class="sps-tour-close-btn" id="spsTourCloseBtn" aria-label="Close tour" title="Close tour [ESC]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <h3 class="sps-tour-title" id="spsTourTitle"></h3>
    <p class="sps-tour-desc" id="spsTourDesc"></p>
    <div class="sps-tour-footer">
      <div class="sps-tour-dots" id="spsTourDots"></div>
      <div class="sps-tour-actions">
        <button type="button" class="sps-tour-btn sps-tour-btn-skip" id="spsTourSkipBtn">Skip</button>
        <button type="button" class="sps-tour-btn sps-tour-btn-back" id="spsTourBackBtn">Back</button>
        <button type="button" class="sps-tour-btn sps-tour-btn-next btn-primary" id="spsTourNextBtn">Next</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(spotlight);
  document.body.appendChild(popover);

  backdrop.onclick = endTour;
  $('spsTourCloseBtn').onclick = endTour;
  $('spsTourSkipBtn').onclick = endTour;
  $('spsTourBackBtn').onclick = prevTourStep;
  $('spsTourNextBtn').onclick = nextTourStep;

  tourOverlayElements = { backdrop, spotlight, popover };
  return tourOverlayElements;
}

function updateTourDots(activeIdx, total) {
  const container = $('spsTourDots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'sps-tour-dot' + (i === activeIdx ? ' active' : '');
    container.appendChild(dot);
  }
}

function positionTourElements(targetEl) {
  if (!tourOverlayElements) return;
  const { spotlight, popover } = tourOverlayElements;
  const rect = targetEl ? targetEl.getBoundingClientRect() : null;

  if (!rect || rect.width === 0 || rect.height === 0) {
    // Center spotlight fallback
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    spotlight.style.top = `${cy - 20}px`;
    spotlight.style.left = `${cx - 20}px`;
    spotlight.style.width = '40px';
    spotlight.style.height = '40px';
    spotlight.style.opacity = '0';

    popover.style.top = `${cy - 120}px`;
    popover.style.left = `${cx - 165}px`;
    return;
  }

  const pad = 6;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const width = Math.min(window.innerWidth, rect.width + pad * 2);
  const height = Math.min(window.innerHeight, rect.height + pad * 2);

  spotlight.style.top = `${top}px`;
  spotlight.style.left = `${left}px`;
  spotlight.style.width = `${width}px`;
  spotlight.style.height = `${height}px`;
  spotlight.style.opacity = '1';

  // Calculate Popover Position
  const popoverWidth = 330;
  const popoverHeight = 210;
  const margin = 14;

  let pTop = rect.bottom + margin;
  let pLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);

  // If overflowing bottom, position above target
  if (pTop + popoverHeight > window.innerHeight - 10) {
    pTop = Math.max(10, rect.top - popoverHeight - margin);
  }

  // Clamp horizontal bounds
  pLeft = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, pLeft));

  popover.style.top = `${pTop}px`;
  popover.style.left = `${pLeft}px`;
}

function ensureEditPanelActive() {
  const mtabs = document.querySelector('.mtabs');
  const isTabsMode = (mtabs && window.getComputedStyle(mtabs).display !== 'none') || (typeof window !== 'undefined' && window.innerWidth <= 980);
  if (!isTabsMode) return;

  if (typeof setPanel === 'function') {
    setPanel('edit');
  } else {
    document.body.dataset.panel = 'edit';
    const editBtn = document.querySelector('.mtabs button[data-p="edit"]');
    if (editBtn) editBtn.click();
  }
}

function showTourStep(index) {
  if (index < 0 || index >= SPS_TOUR_STEPS.length) {
    endTour();
    return;
  }

  currentTourStep = index;
  ensureEditPanelActive();
  createTourDOM();

  const step = SPS_TOUR_STEPS[index];
  let targetEl = document.querySelector(step.target);
  if (!targetEl && step.fallbackTarget) {
    targetEl = document.querySelector(step.fallbackTarget);
  }

  if (targetEl && typeof targetEl.scrollIntoView === 'function') {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  $('spsTourStepBadge').textContent = `Step ${index + 1} of ${SPS_TOUR_STEPS.length}`;
  $('spsTourTitle').textContent = step.title;
  $('spsTourDesc').textContent = step.desc;

  const backBtn = $('spsTourBackBtn');
  const nextBtn = $('spsTourNextBtn');

  if (backBtn) {
    backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  }

  if (nextBtn) {
    nextBtn.textContent = index === SPS_TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next';
  }

  updateTourDots(index, SPS_TOUR_STEPS.length);

  setTimeout(() => {
    positionTourElements(targetEl);
  }, 50);
}

function nextTourStep() {
  if (currentTourStep < SPS_TOUR_STEPS.length - 1) {
    showTourStep(currentTourStep + 1);
  } else {
    endTour();
    if (typeof showToast === 'function') {
      showToast('Tour completed! Enjoy exploring Store Preview Studio.', 'ok');
    }
  }
}

function prevTourStep() {
  if (currentTourStep > 0) {
    showTourStep(currentTourStep - 1);
  }
}

function startTour(stepIndex = 0) {
  currentTourStep = -1;
  ensureEditPanelActive();
  showTourStep(stepIndex);
  document.addEventListener('keydown', handleTourKeydown);
  window.addEventListener('resize', handleTourResize);
}

function relocateTourButton() {
  const btn = $('btnStartTour');
  const btnUi = $('btnUi');
  const headerRight = document.querySelector('header .right');
  if (!btn || !headerRight) return;

  if (typeof window !== 'undefined' && !relocateTourButton._resizeBound) {
    relocateTourButton._resizeBound = true;
    window.addEventListener('resize', relocateTourButton);
  }

  try {
    const completed = localStorage.getItem('sps_tour_completed') === 'true';
    let isDemoMobile = false;
    if (typeof isDemoMode === 'function' && isDemoMode()) {
      isDemoMobile = typeof window !== 'undefined' && window.innerWidth <= 980;
    }

    if (completed || isDemoMobile) {
      if (btnUi && btnUi.parentNode === headerRight) {
        if (btn.nextElementSibling !== btnUi || btn.parentNode !== headerRight) {
          headerRight.insertBefore(btn, btnUi);
        }
      } else if (btn.parentNode !== headerRight) {
        headerRight.appendChild(btn);
      }
      btn.classList.add('in-header');
    } else {
      const navMain = document.querySelector('.workspace-nav-main');
      const presetPill = $('btnPresetPill');
      if (navMain && btn.parentNode !== navMain) {
        btn.classList.remove('in-header');
        if (presetPill && presetPill.parentNode === navMain) {
          navMain.insertBefore(btn, presetPill);
        } else {
          navMain.appendChild(btn);
        }
      }
    }
    if (typeof syncAllVtPills === 'function') syncAllVtPills();
  } catch (_) {}
}

function endTour() {
  currentTourStep = -1;
  document.removeEventListener('keydown', handleTourKeydown);
  window.removeEventListener('resize', handleTourResize);

  if (tourOverlayElements) {
    const { backdrop, spotlight, popover } = tourOverlayElements;
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    if (spotlight && spotlight.parentNode) spotlight.parentNode.removeChild(spotlight);
    if (popover && popover.parentNode) popover.parentNode.removeChild(popover);
    tourOverlayElements = null;
  }

  try {
    localStorage.setItem('sps_tour_completed', 'true');
  } catch (_) {}
  relocateTourButton();
}

function handleTourKeydown(e) {
  if (currentTourStep < 0) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    endTour();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    nextTourStep();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevTourStep();
  }
}

function handleTourResize() {
  if (currentTourStep < 0) return;
  ensureEditPanelActive();
  const step = SPS_TOUR_STEPS[currentTourStep];
  if (!step) return;
  let targetEl = document.querySelector(step.target);
  if (!targetEl && step.fallbackTarget) {
    targetEl = document.querySelector(step.fallbackTarget);
  }
  positionTourElements(targetEl);
}

function initTour() {
  const btn = $('btnStartTour');
  if (btn) {
    btn.onclick = () => startTour(0);
  }

  relocateTourButton();

  // If in demo mode and first time visiting, auto-offer tour after brief delay
  if (typeof isDemoMode === 'function' && isDemoMode()) {
    try {
      const hasSeen = localStorage.getItem('sps_tour_completed');
      if (!hasSeen) {
        setTimeout(() => {
          if (currentTourStep === -1 && !document.querySelector('.confirm-modal-backdrop.open')) {
            startTour(0);
          }
        }, 1200);
      }
    } catch (_) {}
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTour);
  } else {
    initTour();
  }
}
