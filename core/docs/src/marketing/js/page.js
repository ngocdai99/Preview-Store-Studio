    // Interactive FAQ Accordion (Keyboard & Screen-Reader Accessible)
    function toggleFaq(el) {
      var item = el.closest ? el.closest('.faq-item') : el.parentElement;
      if (item) {
        var isActive = item.classList.toggle('active');
        var q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      }
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('faq-question')) {
        e.preventDefault();
        toggleFaq(e.target);
      }
    });

    // Marketing Page Dark/Light Theme Switcher
    (function () {
      var btn = document.getElementById('pageThemeBtn') || document.getElementById('btnUi');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        if (document.body) document.body.removeAttribute('data-theme');
        try {
          localStorage.setItem('store_preview_mkt_theme_v2', next);
          localStorage.setItem('store_preview_marketing_theme', next);
        } catch (e) {}

        // Synchronize Mini-Studio theme
        if (typeof window.setMiniStudioTheme === 'function') {
          window.setMiniStudioTheme(next);
        }
        window.dispatchEvent(new CustomEvent('marketingThemeChange', { detail: next }));
      });
    })();

    // Smooth Scroll & Scrollspy for Floating Header Navigation
    (function initNavbarNavigation() {
      var navLinks = document.querySelectorAll('.nav-link-item[href^="#"]');
      if (!navLinks.length) return;

      var sections = [];
      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var targetEl = document.getElementById(id);
        if (targetEl) {
          sections.push({ id: id, link: link, el: targetEl });
        }
      });

      if (!sections.length) return;

      var ticking = false;
      var userSelectedTarget = null;
      var unlockTimer = null;
      var pill = document.querySelector('.nav-pill-indicator');

      function movePillTo(link, animate) {
        if (!pill || !link) return;
        if (animate === false) {
          pill.style.transition = 'none';
        }
        pill.style.transform = 'translate3d(' + link.offsetLeft + 'px, ' + link.offsetTop + 'px, 0)';
        pill.style.width = link.offsetWidth + 'px';
        pill.style.height = link.offsetHeight + 'px';
        pill.style.opacity = '1';
        if (animate === false) {
          pill.offsetHeight; // force reflow
          pill.style.transition = '';
        }
      }

      function setActiveLink(activeLink, animate) {
        if (!activeLink) return;
        navLinks.forEach(function (link) {
          if (link === activeLink) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        movePillTo(activeLink, animate);
      }

      function clearUserSelectedTarget() {
        userSelectedTarget = null;
        if (unlockTimer) {
          clearTimeout(unlockTimer);
          unlockTimer = null;
        }
      }

      // ONLY release userSelectedTarget when user manually gestures (wheel, touch drag, key scroll)
      ['wheel', 'touchmove'].forEach(function (evt) {
        window.addEventListener(evt, function () {
          clearUserSelectedTarget();
        }, { passive: true });
      });

      window.addEventListener('keydown', function (e) {
        if ([32, 33, 34, 35, 36, 38, 40].indexOf(e.keyCode) !== -1) {
          clearUserSelectedTarget();
        }
      });

      function scrollToSection(targetEl, targetLink) {
        if (!targetLink || !targetEl) return;

        // 1. Immediately switch the active link and glide the pill
        userSelectedTarget = targetLink;
        setActiveLink(targetLink, true);

        // 2. Clear any pending unlock timer
        if (unlockTimer) clearTimeout(unlockTimer);

        // 3. Smooth scroll to target position with sticky navbar offset
        var navbarOffset = 88;
        var elementPosition = targetEl.getBoundingClientRect().top;
        var offsetPosition = elementPosition + (window.pageYOffset || document.documentElement.scrollTop) - navbarOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });

        // 4. Release lock safely after smooth scroll completes (1400ms)
        unlockTimer = setTimeout(function () {
          clearUserSelectedTarget();
        }, 1400);
      }

      // Attach click handlers to all nav links
      sections.forEach(function (item) {
        item.link.addEventListener('click', function (e) {
          e.preventDefault();
          scrollToSection(item.el, item.link);
        });
      });

      // Global smooth scrolling for all in-page anchor links (#showcase, #pricing, etc.)
      document.addEventListener('click', function (e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        var href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        var targetId = href.slice(1);
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          var matchedLink = null;
          for (var i = 0; i < sections.length; i++) {
            if (sections[i].id === targetId) {
              matchedLink = sections[i].link;
              break;
            }
          }
          scrollToSection(targetEl, matchedLink);
        }
      });

      // Also handle logo click to scroll to top and select Studio
      var brandLogo = document.querySelector('.nav-brand[href="#"]');
      if (brandLogo) {
        brandLogo.addEventListener('click', function (e) {
          e.preventDefault();
          userSelectedTarget = sections[0].link;
          setActiveLink(sections[0].link, true);
          if (unlockTimer) clearTimeout(unlockTimer);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          unlockTimer = setTimeout(clearUserSelectedTarget, 1000);
        });
      }

      function updateActiveNav() {
        // If user explicitly clicked a target and hasn't manually scrolled away,
        // keep that target active! Never let intermediate scroll frames hijack or flick!
        if (userSelectedTarget) {
          ticking = false;
          return;
        }

        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;
        var activationOffset = 180; // Distance below header to activate section

        // If at the bottom of the page, activate the last section
        if (scrollY + windowHeight >= docHeight - 60) {
          setActiveLink(sections[sections.length - 1].link);
          ticking = false;
          return;
        }

        // If at the top of the page, activate the first section
        if (scrollY < 120) {
          setActiveLink(sections[0].link);
          ticking = false;
          return;
        }

        // Find the current section from top down
        var currentSection = sections[0];
        for (var i = 0; i < sections.length; i++) {
          var top = sections[i].el.getBoundingClientRect().top + scrollY;
          if (scrollY >= top - activationOffset) {
            currentSection = sections[i];
          }
        }

        setActiveLink(currentSection.link);
        ticking = false;
      }

      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(updateActiveNav);
          ticking = true;
        }
      }, { passive: true });

      window.addEventListener('resize', function () {
        var currentActive = document.querySelector('.nav-link-item.active');
        if (currentActive) {
          movePillTo(currentActive, false);
        }
        if (!ticking) {
          window.requestAnimationFrame(updateActiveNav);
          ticking = true;
        }
      }, { passive: true });

      // Run on page load - initialize pill position without jump animation
      var initialActive = document.querySelector('.nav-link-item.active') || sections[0].link;
      setActiveLink(initialActive, false);
      updateActiveNav();
    })();
