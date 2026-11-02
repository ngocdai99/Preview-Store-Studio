// Launching Soon / Early Bird Modal Controller
(function initLaunchModal() {
  var backdrop = document.getElementById('launchModalBackdrop');
  if (!backdrop) return;

  var card = document.getElementById('launchModalCard');
  var closeBtn = document.getElementById('launchModalClose');
  var form = document.getElementById('launchModalForm');
  var emailInput = document.getElementById('launchEmailInput');
  var submitBtn = document.getElementById('launchSubmitBtn');
  var successWrap = document.getElementById('launchModalSuccess');
  var closeSuccessBtn = document.getElementById('launchCloseSuccessBtn');
  var badgeText = document.getElementById('launchModalBadgeText');
  var currentTier = 'Plus Edition';
  var currentPrice = '$29';
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyb4fMRBy4fw8S7CxrvTj_DHh7WTUcAcgZ0ospEMLlvm2E__2eFk2aoAveDrprvXtX6/exec';

  function openLaunchModal(tierName, tierPrice, originalPrice) {
    var perkTitle = document.getElementById('launchPerkTitle');
    var perkSub = document.getElementById('launchPerkSub');

    var badge = document.getElementById('launchModalBadge');

    if (tierName === 'Pro Studio') {
      currentTier = 'Pro Studio';
      currentPrice = '$39';
      if (badge) {
        badge.classList.remove('tier-plus');
        badge.classList.add('tier-pro');
      }
      if (badgeText) badgeText.textContent = 'Pro Studio · $39 Early Bird';
      if (perkTitle) perkTitle.textContent = 'Guaranteed Launch Price';
      if (perkSub) perkSub.textContent = 'Lock in $39 one-time pricing before it increases to regular $59.';
    } else {
      currentTier = 'Plus Edition';
      currentPrice = '$29';
      if (badge) {
        badge.classList.remove('tier-pro');
        badge.classList.add('tier-plus');
      }
      if (badgeText) badgeText.textContent = 'Plus Edition · $29 Early Bird';
      if (perkTitle) perkTitle.textContent = 'Guaranteed Launch Price';
      if (perkSub) perkSub.textContent = 'Lock in $29 one-time pricing before it increases to regular $39.';
    }

    // Always reset to initial form state
    var perks = document.getElementById('launchPerksGrid');
    if (perks) {
      perks.hidden = false;
      perks.style.display = '';
    }
    if (form) {
      form.hidden = false;
      form.style.display = '';
    }
    if (successWrap) {
      successWrap.hidden = true;
      successWrap.classList.remove('is-visible');
    }

    // Check if user already submitted before
    try {
      var saved = localStorage.getItem('preview_studio_waitlist');
      if (saved) {
        var data = JSON.parse(saved);
        if (data && data.email && emailInput) {
          emailInput.value = data.email;
        }
      }
    } catch (e) {}

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Track launch modal impression on Clarity
    if (typeof window.clarity === 'function') {
      window.clarity('event', 'launch_modal_opened');
    }

    setTimeout(function () {
      if (emailInput) emailInput.focus();
    }, 150);
  }

  function closeLaunchModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeLaunchModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeLaunchModal);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) {
      closeLaunchModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeLaunchModal();
    }
  });

  // Bind to all pricing and buy buttons
  var buyButtons = document.querySelectorAll('.btn-buy-plus, .btn-buy-pro, .btn-buy, [href*="gumroad.com"], [data-launch-modal]');
  buyButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var tierName = btn.getAttribute('data-name') || (btn.classList.contains('btn-buy-pro') ? 'Pro Studio' : 'Plus Edition');
      var tierPrice = btn.getAttribute('data-price') || (btn.classList.contains('btn-buy-pro') ? '$39' : '$29');
      var originalPrice = btn.getAttribute('data-original') || (btn.classList.contains('btn-buy-pro') ? '$59' : '$39');
      if (typeof window.trackInviteEvent === 'function') {
        window.trackInviteEvent('click_buy', { tier: tierName, price: tierPrice });
      }
      openLaunchModal(tierName, tierPrice, originalPrice);
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (emailInput ? emailInput.value : '').trim();
      if (!email || email.indexOf('@') === -1) {
        if (emailInput) emailInput.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      var vApp = window.spsVerifiedApp || null;
      if (!vApp) {
        try {
          var savedV = sessionStorage.getItem('sps_verified_app');
          if (savedV) vApp = JSON.parse(savedV);
        } catch (e) {}
      }
      var appId = (vApp && vApp.appid) ? vApp.appid : '';
      var appName = (vApp && vApp.app) ? vApp.app : '';
      var devName = (vApp && vApp.dev) ? vApp.dev : '';

      if (typeof window.trackInviteEvent === 'function') {
        window.trackInviteEvent('early_bird_signup', { email: email, tier: currentTier });
      }

      // Save to localStorage
      try {
        var waitlistData = {
          email: email,
          tier: currentTier,
          price: currentPrice,
          appid: appId,
          app: appName,
          dev: devName,
          time: new Date().toISOString()
        };
        localStorage.setItem('preview_studio_waitlist', JSON.stringify(waitlistData));
      } catch (err) {}

      // Send to Google Sheet Web App
      var targetUrl = window.SPS_WAITLIST_ENDPOINT || GOOGLE_SCRIPT_URL;
      if (targetUrl) {
        try {
          fetch(targetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              email: email,
              tier: currentTier,
              price: currentPrice,
              appid: appId,
              app: appName,
              dev: devName,
              timestamp: new Date().toISOString()
            })
          });
        } catch (postErr) {
          console.warn('[Waitlist] Error posting to sheet:', postErr);
        }
      }

      // Track conversion event on Clarity
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'early_bird_signup');
      }

      setTimeout(function () {
        if (form) {
          form.hidden = true;
          form.style.display = 'none';
        }
        var perks = document.getElementById('launchPerksGrid');
        if (perks) {
          perks.hidden = true;
          perks.style.display = 'none';
        }
        if (successWrap) {
          successWrap.hidden = false;
          successWrap.classList.add('is-visible');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get Early Invite';
        }
      }, 300);
    });
  }

  // Expose global opener if needed
  window.openLaunchModal = openLaunchModal;
  window.closeLaunchModal = closeLaunchModal;
})();
