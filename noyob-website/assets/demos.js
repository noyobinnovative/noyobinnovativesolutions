(function () {
  'use strict';
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(n, d) { return n.toLocaleString('en-IN', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function pulse(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function countTo(el, from, to, ms, d, prefix) {
    var t0 = null;
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / ms, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (prefix || '') + fmt(from + (to - from) * e, d);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  var DEMOS = {};

  /* ---------------------------------------------------------- POS (tablet) */
  DEMOS.pos = function (root, R) {
    var P = [['Premium Basmati Rice', 520, 'p-rice'], ['Extra Virgin Olive Oil', 690, 'p-oil'], ['Assam Tea Leaves', 180, 'p-tea'], ['Filter Coffee Powder', 240, 'p-coffee'], ['Mixed Fruit Jam', 210, 'p-jam'], ['Whole Wheat Bread', 60, 'p-bread']];
    var items = $$('.pos-item', root), list = R('list'), cart = {}, order = [], shown = { sub: 0, gst: 0, tot: 0 };
    function money(n) { return '₹' + fmt(n, 2); }
    function totals() {
      var s = 0; order.forEach(function (k) { s += P[k][1] * cart[k]; });
      var g = Math.round(s * 5) / 100, t = s + g;
      countTo(R('sub'), shown.sub, s, 350, 2, '₹'); countTo(R('gst'), shown.gst, g, 350, 2, '₹'); countTo(R('tot'), shown.tot, t, 350, 2, '₹');
      shown = { sub: s, gst: g, tot: t }; R('charge').textContent = 'Charge ' + money(t);
    }
    function add(k) {
      pulse(items[k], 'tap');
      var li = list.querySelector('[data-k="' + k + '"]');
      if (!cart[k]) { cart[k] = 0; order.push(k); li = doc.createElement('li'); li.setAttribute('data-k', k); li.className = 'new'; list.appendChild(li); } else { pulse(li, 'bump'); }
      cart[k]++;
      li.innerHTML = '<span class="th"><svg class="art" viewBox="0 0 100 100"><use href="#' + P[k][2] + '"/></svg></span><span class="nm">' + P[k][0] + '<small>' + cart[k] + ' × ₹' + P[k][1] + '</small></span><b>₹' + fmt(P[k][1] * cart[k]) + '</b>';
      totals();
    }
    var stock = [124, 210, 11, 56];
    function setRow(i, v, low) {
      var tr = R('r' + i); tr.querySelector('.n').textContent = v; pulse(tr, 'flash');
      var chip = tr.querySelector('.chip-s');
      if (low) { chip.className = 'chip-s low'; chip.textContent = 'Low stock'; }
    }
    return [
      { dur: 6200, reset: function () { cart = {}; order = []; shown = { sub: 0, gst: 0, tot: 0 }; list.innerHTML = ''; R('sub').textContent = '₹0.00'; R('gst').textContent = '₹0.00'; R('tot').textContent = '₹0.00'; R('charge').textContent = 'Charge ₹0.00'; R('charge').classList.remove('pulse'); },
        run: function (at) { at(500, function () { add(0); }); at(1250, function () { add(2); }); at(2000, function () { add(4); }); at(2750, function () { add(5); }); at(3450, function () { add(5); }); at(4500, function () { R('charge').classList.add('pulse'); }); } },
      { dur: 4800, reset: function () { ['m0', 'm1', 'm2'].forEach(function (m) { R(m).classList.remove('sel'); }); R('qr').classList.remove('on'); R('ok').classList.remove('on'); R('pst').textContent = 'Choose a payment method'; },
        run: function (at) { at(500, function () { R('m1').classList.add('sel'); }); at(1100, function () { R('qr').classList.add('on'); R('pst').textContent = 'Scan to pay with any UPI app'; }); at(2700, function () { R('ok').classList.add('on'); }); } },
      { dur: 4200, reset: function () { var names = [124, 210, 11, 56]; names.forEach(function (v, i) { var tr = R('r' + i); tr.querySelector('.n').textContent = v; tr.classList.remove('flash'); var c = tr.querySelector('.chip-s'); c.className = 'chip-s ok'; c.textContent = 'In stock'; }); },
        run: function (at) { at(500, function () { setRow(0, 123); }); at(1100, function () { setRow(1, 209); }); at(1700, function () { setRow(2, 10, true); }); at(2300, function () { setRow(3, 54); }); } },
      { dur: 4600, reset: function () { $$('.chart i', root).forEach(function (b) { b.style.height = '0'; }); R('k1').textContent = '₹4,81,420'; R('k2').textContent = '611'; var rc = R('recent'); var n = rc.querySelector('.new'); if (n) n.remove(); },
        run: function (at) {
          at(150, function () { $$('.chart i', root).forEach(function (b) { b.style.height = b.getAttribute('data-h') + '%'; }); });
          at(1300, function () { var li = doc.createElement('li'); li.className = 'new'; li.innerHTML = '<span>#00418</span><b>₹1,081.50</b><em>UPI</em>'; R('recent').insertBefore(li, R('recent').firstChild); countTo(R('k1'), 481420, 482501, 700, 0, '₹'); countTo(R('k2'), 611, 612, 700, 0, ''); });
        } }
    ];
  };

  /* ---------------------------------------------------------- AI car scan (phone) */
  DEMOS.car = function (root, R) {
    var dots = $$('i', R('dots')), langEls = $$('[data-en]', root), names = ['Front', 'Right front', 'Right side', 'Rear', 'Left side', 'Roof'];
    function flash() { pulse(R('flash'), 'go'); }
    function lang(l) {
      langEls.forEach(function (e) { e.textContent = e.getAttribute('data-' + l); });
      R('rep').setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr'); R('le').classList.toggle('on', l === 'en'); R('la').classList.toggle('on', l === 'ar');
    }
    return [
      { dur: 5600, reset: function () { R('pill').textContent = 'Align the car inside the frame'; R('angle').textContent = 'Angle 1 of 6 · Front'; dots.forEach(function (d) { d.classList.remove('on'); }); },
        run: function (at) {
          at(1100, function () { R('pill').textContent = 'Hold steady'; });
          [[1800, 1], [2450, 2], [3050, 3], [3600, 4], [4100, 5], [4600, 6]].forEach(function (s) {
            at(s[0], function () { flash(); dots[s[1] - 1].classList.add('on'); R('angle').textContent = s[1] < 6 ? 'Angle ' + (s[1] + 1) + ' of 6 · ' + names[s[1]] : 'All 6 angles captured'; if (s[1] === 6) R('pill').textContent = 'Ready for AI check'; });
          });
        } },
      { dur: 4800, reset: function () { R('pill2').textContent = 'AI scanning…'; R('scan').classList.remove('go'); R('d1').classList.remove('on'); R('d2').classList.remove('on'); R('found').classList.remove('on'); },
        run: function (at) { at(300, function () { R('scan').classList.add('go'); }); at(1250, function () { R('d1').classList.add('on'); }); at(1850, function () { R('d2').classList.add('on'); }); at(2500, function () { R('found').classList.add('on'); R('pill2').textContent = 'Analysis complete'; }); } },
      { dur: 4200, reset: function () { R('after').style.clipPath = 'inset(0 0 0 100%)'; R('line').style.left = '100%'; R('t1').classList.remove('on'); R('t2').classList.remove('on'); R('t3').classList.remove('on'); },
        run: function (at) { at(400, function () { R('after').style.clipPath = 'inset(0 0 0 0%)'; R('line').style.left = '0%'; }); at(1900, function () { R('after').style.clipPath = 'inset(0 0 0 50%)'; R('line').style.left = '50%'; }); at(2500, function () { R('t1').classList.add('on'); }); at(2800, function () { R('t2').classList.add('on'); }); at(3100, function () { R('t3').classList.add('on'); }); } },
      { dur: 6400, reset: function () { lang('en'); ['f1', 'f2', 'sum', 'act'].forEach(function (k) { R(k).classList.remove('on'); }); },
        run: function (at) { at(300, function () { R('f1').classList.add('on'); }); at(750, function () { R('f2').classList.add('on'); }); at(1200, function () { R('sum').classList.add('on'); }); at(1600, function () { R('act').classList.add('on'); }); at(3000, function () { lang('ar'); }); at(5200, function () { lang('en'); }); } }
    ];
  };

  /* ---------------------------------------------------------- Grocery delivery (phone) */
  DEMOS.app = function (root, R) {
    var prices = [58, 180, 42, 96], count = 0, total = 0, raf = 0;
    function addItem(i) { var b = R('a' + i); b.textContent = '✓'; b.classList.add('done'); count++; total += prices[i]; R('bar').classList.add('on'); R('cnt').textContent = 'View cart · ' + count + (count === 1 ? ' item' : ' items'); R('ctot').textContent = '₹' + total; }
    var route = R('route'), len = route.getTotalLength();
    var prog = R('prog'); prog.style.strokeDasharray = len; prog.style.strokeDashoffset = len;
    function place(p) {
      var pt = route.getPointAtLength(len * p);
      R('cour').setAttribute('transform', 'translate(' + (pt.x - 50) + ' ' + (pt.y - 290) + ')');
      prog.style.strokeDashoffset = len * (1 - p);
      R('eta').textContent = 'Arriving in ' + Math.max(3, Math.round(12 - 9 * p)) + ' min';
      R('tbar').style.width = (30 + 62 * p) + '%';
    }
    return [
      { dur: 5600, reset: function () { count = 0; total = 0; [0, 1, 2, 3].forEach(function (i) { var b = R('a' + i); b.textContent = '+'; b.classList.remove('done'); }); R('bar').classList.remove('on'); R('cnt').textContent = 'View cart · 0 items'; R('ctot').textContent = '₹0'; },
        run: function (at) { at(700, function () { addItem(0); }); at(1600, function () { addItem(1); }); at(2500, function () { addItem(3); }); } },
      { dur: 5400, reset: function () { R('sl0').classList.remove('on'); R('sl1').classList.remove('on'); R('pay').classList.remove('press', 'load'); R('paytxt').textContent = 'Pay with UPI'; R('done').classList.remove('on'); },
        run: function (at) { at(600, function () { R('sl0').classList.add('on'); }); at(1700, function () { R('pay').classList.add('press'); }); at(1950, function () { R('pay').classList.remove('press'); R('pay').classList.add('load'); R('paytxt').textContent = 'Processing'; }); at(3000, function () { R('done').classList.add('on'); }); } },
      { dur: 5600, reset: function () { cancelAnimationFrame(raf); place(0); R('st1').classList.add('on'); },
        stop: function () { cancelAnimationFrame(raf); },
        run: function (at) { var t0 = null, D = 4300; at(500, function () { (function f(t) { if (t0 === null) t0 = t; var p = Math.min((t - t0) / D, 1); place(p); if (p < 1) raf = requestAnimationFrame(f); })(performance.now()); }); } },
      { dur: 4400, reset: function () { R('dt').classList.remove('go'); R('burst').classList.remove('go'); $$('i', R('stars')).forEach(function (s) { s.classList.remove('on'); }); R('re').classList.remove('pulse'); },
        run: function (at) { at(300, function () { R('dt').classList.add('go'); R('burst').classList.add('go'); }); $$('i', R('stars')).forEach(function (s, i) { at(1000 + i * 260, function () { s.classList.add('on'); }); }); at(2700, function () { R('re').classList.add('pulse'); }); } }
    ];
  };

  /* ---------------------------------------------------------- engine */
  function init(root) {
    var kind = root.getAttribute('data-demo'), make = DEMOS[kind];
    if (!make || root.getAttribute('data-ready')) return;
    root.setAttribute('data-ready', '1');
    var R = function (n) { return root.querySelector('[data-r="' + n + '"]'); };
    var steps = make(root, R), screens = $$('.scr', root), btns = $$('.demo-step', root), toggle = $('.demo-toggle', root);
    var timers = [], cur = -1, paused = false, started = false, FAST = !!window.__FAST, fastq = [];

    function clear() { timers.forEach(clearTimeout); timers = []; if (cur >= 0 && steps[cur].stop) steps[cur].stop(); }
    function at(ms, fn) { if (FAST) { fastq.push([ms, fn]); } else { timers.push(setTimeout(fn, ms)); } }
    function show(i) {
      screens.forEach(function (s, k) { s.classList.toggle('on', k === i); s.classList.toggle('out', k < i); });
      btns.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); b.classList.remove('run'); });
      void root.offsetWidth; btns[i].classList.add('run');
    }
    function go(i) {
      clear(); cur = i; show(i);
      if (steps[i].reset) steps[i].reset();
      steps[i].run(at);
      if (FAST) { fastq.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (q) { q[1](); }); fastq = []; return; }
      if (!paused && !reduce) at(steps[i].dur, function () { go((i + 1) % steps.length); });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
    toggle.addEventListener('click', function () {
      paused = !paused; root.classList.toggle('paused', paused);
      toggle.setAttribute('aria-pressed', paused); toggle.textContent = paused ? 'Play animation' : 'Pause animation';
      if (paused) clear(); else go(cur < 0 ? 0 : cur);
    });

    function fit() {
      var dev = $('.dev', root), scale = $('.demo-scale', root), stage = $('.demo-stage', root);
      var phone = dev.classList.contains('phone'), bw = phone ? 340 : 760, bh = phone ? 690 : 500;
      var cs = getComputedStyle(stage), avail = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var s = Math.min(1, avail / bw, phone ? 620 / bh : 1);
      scale.style.width = (bw * s) + 'px'; scale.style.height = (bh * s) + 'px'; dev.style.transform = 'scale(' + s + ')';
    }
    root.__go = go;
    if (FAST) return;
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe($('.demo-stage', root)); else window.addEventListener('resize', fit);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) { if (!started) { started = true; go(0); } else if (!paused && !reduce) { go(cur < 0 ? 0 : cur); } }
          else if (started) { clear(); }
        });
      }, { threshold: 0.35 }).observe(root);
    } else { started = true; go(0); }
  }

  $$('.demo').forEach(init);
})();
