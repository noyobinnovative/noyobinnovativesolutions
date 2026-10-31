(function () {
  'use strict';
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = window.NOYOB || {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Mobile menu and services dropdown ---------- */
  var btn = $('#menuBtn'), nav = $('#nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  $$('.sub-toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      var p = t.closest('.has-sub');
      var open = p.classList.toggle('open');
      t.setAttribute('aria-expanded', open);
    });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      $$('.has-sub.open').forEach(function (p) { p.classList.remove('open'); });
      if (nav) nav.classList.remove('open');
    }
  });

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Headline word-by-word entrance ---------- */
  var h1 = $('.split-h1');
  if (h1 && !reduce) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', words.join(' '));
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + esc(w) + '</span></span>';
    }).join(' ');
  }

  /* ---------- Mobile: stacked project cards ---------- */
  var stack = $$('.work-grid .work-card'), stackMq = window.matchMedia('(max-width: 760px)');
  function stackCards() {
    if (!stack.length) return;
    if (!stackMq.matches || reduce) { stack.forEach(function (c) { c.style.scale = ''; }); return; }
    stack.forEach(function (c, i) {
      var nx = stack[i + 1];
      if (!nx || c.hidden || nx.hidden) { c.style.scale = ''; return; }
      var top = parseFloat(getComputedStyle(c).top) || 0;
      var p = Math.max(0, Math.min(1, 1 - (nx.getBoundingClientRect().top - (top + 16)) / (window.innerHeight * 0.55)));
      c.style.scale = (1 - 0.06 * p).toFixed(3);
    });
  }

  /* ---------- Scroll progress, header shadow, back to top ---------- */
  var header = $('#header'), bar = $('#progress'), toTop = $('#toTop'), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = doc.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 700);
    stackCards();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', stackCards);
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Config: contact details, booking, social ---------- */
  $$('[data-cfg]').forEach(function (el) {
    var k = el.getAttribute('data-cfg'), v = String(C[k] || '').trim();
    if (!v) { el.hidden = true; return; }
    el.hidden = false;
    var a = $('a', el);
    if (a) {
      if (k === 'email') { a.href = 'mailto:' + v; a.textContent = v; }
      else if (k === 'phone') { a.href = 'tel:' + v.replace(/[^\d+]/g, ''); a.textContent = v; }
      else if (k === 'whatsapp') { a.href = 'https://wa.me/' + v.replace(/\D/g, ''); }
      else if (k === 'booking') { a.href = v; }
    } else { var s = $('.val', el) || el; s.textContent = v; }
  });
  $$('[data-cfg-btn]').forEach(function (el) {
    var v = String(C[el.getAttribute('data-cfg-btn')] || '').trim();
    if (v) { el.href = v; el.target = '_blank'; el.rel = 'noopener'; el.hidden = false; }
  });
  $$('[data-net]').forEach(function (a) {
    var n = a.getAttribute('data-net'), S = C.social || {}, u = n === 'whatsapp' ? (C.whatsapp ? 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') : (S.whatsapp || '')) : (S[n] || '');
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; } else { a.classList.add('off'); }
  });
  $$('[data-social]').forEach(function (box) {
    var S = C.social || {}, names = { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', x: 'X' };
    var html = Object.keys(names).filter(function (k) { return S[k]; }).map(function (k) {
      return '<a href="' + esc(S[k]) + '" target="_blank" rel="noopener">' + names[k] + '</a>';
    }).join('');
    if (html) box.innerHTML = html; else box.hidden = true;
  });
  if (C.whatsapp) {
    var wa = doc.createElement('a');
    wa.className = 'wa';
    wa.href = 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent('Hello Noyob Innovative, I would like to discuss a project.');
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
    doc.body.appendChild(wa);
  }

  /* ---------- Work (case studies) ---------- */
  var workGrid = $('#workGrid');
  if (workGrid) {
    var projects = (window.NOYOB_PROJECTS || []).slice();
    var empty = $('#workEmpty'), filters = $('#workFilters');
    var limit = parseInt(workGrid.getAttribute('data-limit'), 10) || 0;
    var card = function (p) {
      var thumb = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' : '<span class="pi" aria-hidden="true"></span>';
      var det = '';
      if (p.challenge || p.solution || p.result) {
        det = '<details><summary>Read the case study</summary><dl>' +
          (p.challenge ? '<dt>The challenge</dt><dd>' + esc(p.challenge) + '</dd>' : '') +
          (p.solution ? '<dt>Our solution</dt><dd>' + esc(p.solution) + '</dd>' : '') +
          (p.result ? '<dt>The result</dt><dd>' + esc(p.result) + '</dd>' : '') +
          (p.tech && p.tech.length ? '<dt>Technology</dt><dd>' + esc(p.tech.join(', ')) + '</dd>' : '') +
          '</dl></details>';
      }
      var link = p.url ? '<a class="btn btn-ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">Visit project</a>' : '';
      return '<article class="work-card reveal" data-cat="' + esc(p.category) + '"><div class="work-thumb">' + thumb + '</div><div class="work-body"><p class="cat">' +
        esc(p.category) + '</p><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' + det + link + '</div></article>';
    };
    if (projects.length) {
      if (empty) empty.hidden = true;
      var shown = limit ? projects.slice(0, limit) : projects;
      workGrid.innerHTML = shown.map(card).join('');
      workGrid.hidden = false;
      $$('.work-card', workGrid).forEach(function (c) { c.classList.add('in'); });
      if (filters && !limit) {
        var cats = ['All'].concat(projects.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
        filters.innerHTML = cats.map(function (c, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>'; }).join('');
        filters.hidden = false;
        filters.addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b) return;
          $$('button', filters).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          $$('.work-card', workGrid).forEach(function (c) { c.hidden = b.textContent !== 'All' && c.getAttribute('data-cat') !== b.textContent; });
        });
      }
    }
  }

  /* ---------- Careers (open roles) ---------- */
  var jobList = $('#jobList');
  if (jobList) {
    var jobs = window.NOYOB_JOBS || [];
    if (jobs.length) {
      var jh = $('#jobsEmpty'); if (jh) jh.hidden = true;
      jobList.hidden = false;
      jobList.innerHTML = jobs.map(function (j) {
        return '<div class="job"><div><h3>' + esc(j.title) + '</h3><p class="meta">' + esc([j.type, j.location].filter(Boolean).join(', ')) + '</p><p>' + esc(j.description) + '</p></div>' +
          '<a class="btn btn-primary apply" href="#apply" data-role="' + esc(j.title) + '">Apply for this role</a></div>';
      }).join('');
      jobList.addEventListener('click', function (e) {
        var a = e.target.closest('.apply'); if (!a) return;
        var f = $('#role'); if (!f) return;
        var want = a.getAttribute('data-role'), found = false;
        $$('option', f).forEach(function (o) { if (o.value.toLowerCase() === want.toLowerCase()) { f.value = o.value; found = true; } });
        if (!found) { var o = doc.createElement('option'); o.textContent = want; f.insertBefore(o, f.firstChild); f.value = want; }
      });
    }
  }

  /* ---------- Static work filters ---------- */
  $$('.filters[data-static]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', box).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var cat = b.getAttribute('data-cat');
      $$('.work-card').forEach(function (c) { c.hidden = cat !== 'all' && c.getAttribute('data-cat') !== cat; });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var groups = ['.kicker', '.h2', '.sub', '.service', '.why-item', '.principles li', '.step', '.pills li', '.stack div', '.faq details', '.contact-points li',
    '.form', '.problem', '.deliver li', '.post', '.work-card', '.job', '.cta', '.related a', '.areas li', '.info li', '.empty', '.next-steps li'];
  var targets = [];
  groups.forEach(function (sel) {
    $$(sel).forEach(function (el, i) {
      if (el.closest('.hero') || el.closest('.page-hero') || el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.setProperty('--d', ((i % 6) * 0.08) + 's');
      targets.push(el);
    });
  });
  $$('.reveal').forEach(function (el) { if (targets.indexOf(el) === -1) targets.push(el); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero parallax (home, pointer devices) ---------- */
  var hero = $('.hero'), mark = $('#mark');
  if (hero && mark && !reduce && window.matchMedia('(hover: hover)').matches) {
    var chips = $$('.chip', mark), svg = $('svg', mark);
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      chips.forEach(function (c) {
        var d = parseFloat(c.getAttribute('data-depth')) || 10;
        c.style.translate = (x * d * 2) + 'px ' + (y * d * 2) + 'px';
      });
      svg.style.translate = (x * -14) + 'px ' + (y * -14) + 'px';
    });
    hero.addEventListener('pointerleave', function () {
      chips.forEach(function (c) { c.style.translate = '0 0'; });
      svg.style.translate = '0 0';
    });
  }

  /* ---------- Forms (enquiry and careers) ---------- */
  $$('form[data-form]').forEach(function (form) {
    var status = $('.form-status', form), submit = $('button[type="submit"]', form);
    function setStatus(type, text) { status.className = 'form-status ' + type; status.textContent = text; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      $$('[required]', form).forEach(function (f) { if (!f.value.trim()) bad = true; });
      var em = form.elements.email ? form.elements.email.value.trim() : 'x@x.xx';
      if (bad || !/^\S+@\S+\.\S+$/.test(em)) {
        setStatus('err', 'Please fill in the required fields and enter a valid email address.');
        return;
      }
      var subject = form.getAttribute('data-subject') || 'Website enquiry';
      var name = form.elements.name ? form.elements.name.value.trim() : '';
      var lines = [];
      $$('input, select, textarea', form).forEach(function (f) {
        if (!f.name || f.name.charAt(0) === '_' || f.type === 'checkbox') return;
        if (f.value) lines.push(f.name.charAt(0).toUpperCase() + f.name.slice(1) + ': ' + f.value);
      });
      var summary = lines.join('\n');
      var endpoint = String(C.formEndpoint || '').trim();
      var email = String(C.email || '').trim();

      if (endpoint) {
        submit.classList.add('loading');
        setStatus('', 'Sending...');
        var fd = new FormData(form); fd.append('_subject', subject + (name ? ' from ' + name : ''));
        fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error('failed');
            form.reset();
            setStatus('ok', 'Thank you. We have received your message and will reply soon.');
          })
          .catch(function () { setStatus('err', 'Something went wrong. Please try again in a moment.'); })
          .then(function () { submit.classList.remove('loading'); });
      } else if (email) {
        window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject + (name ? ' from ' + name : '')) + '&body=' + encodeURIComponent(summary);
        setStatus('ok', 'Opening your email app with your message ready to send.');
      } else {
        setStatus('err', 'This form is not connected yet. Add your form endpoint or email in assets/config.js.');
      }
    });
  });
})();
