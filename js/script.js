// Mukhaeral Portfolio
// No external libraries. Handles: mobile menu, active nav link, certificate dialog, copy email.

(function () {
    'use strict';

    var header = document.querySelector('.site-header');
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    var behind = Array.prototype.slice.call(document.querySelectorAll('main, .site-footer'));

    // ---------- Mobile menu ----------
    function setMenu(open) {
        header.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('no-scroll', open);
        // Keep keyboard focus and screen readers inside the open menu.
        behind.forEach(function (el) { el.inert = open; });
    }

    toggle.addEventListener('click', function () {
        setMenu(!header.classList.contains('nav-open'));
    });

    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 721px)').addEventListener('change', function (e) {
        if (e.matches) setMenu(false);
    });

    // ---------- Active section link ----------
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) { a.removeAttribute('aria-current'); });
                var active = map[entry.target.id];
                if (active) active.setAttribute('aria-current', 'true');
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        Object.keys(map).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        // Hero is not in the nav: clear the highlight when it is on screen.
        var hero = document.getElementById('home');
        if (hero) {
            new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    links.forEach(function (a) { a.removeAttribute('aria-current'); });
                }
            }, { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
        }
    }

    // ---------- Certificate dialog ----------
    document.querySelectorAll('[data-dialog]').forEach(function (btn) {
        var dialog = document.getElementById(btn.getAttribute('data-dialog'));
        if (!dialog) return;

        btn.addEventListener('click', function () {
            if (typeof dialog.showModal === 'function') dialog.showModal();
            else dialog.setAttribute('open', '');
        });

        dialog.addEventListener('click', function (e) {
            // Close on backdrop click or on the Close button.
            if (e.target === dialog || e.target.closest('[data-close]')) {
                if (typeof dialog.close === 'function') dialog.close();
                else dialog.removeAttribute('open');
            }
        });
    });

    // ---------- Copy email (progressive enhancement) ----------
    // The row stays hidden unless the browser can copy to the clipboard;
    // the mailto link always works without JavaScript.
    var copyBtn = document.getElementById('copy-email');
    if (copyBtn && navigator.clipboard && window.isSecureContext) {
        var copyRow = copyBtn.closest('.copy-row');
        var copyStatus = copyRow.querySelector('.copy-status');
        var copyTimer;
        copyRow.hidden = false;

        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(function () {
                copyStatus.textContent = 'Email address copied.';
            }, function () {
                copyStatus.textContent = 'Could not copy. Please use the address above.';
            });
            clearTimeout(copyTimer);
            copyTimer = setTimeout(function () { copyStatus.textContent = ''; }, 3000);
        });
    }
})();