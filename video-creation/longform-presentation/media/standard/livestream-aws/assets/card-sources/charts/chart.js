/* chart.js: the builder of this video's system-design chart (see chart.css for the look). Copied unchanged from
   clip-evals/assets/card-sources/charts/chart.js (the last scripted video's kit); only this first line differs.

   A chart is written ONCE, as <template id="chart"> holding a <div class="stage"> in absolute pixels (nothing in
   the layout is measured from text, so a font can never move a node or a wire), plus a STATES table:

     buildChart({
       "<frame id>": { on: [keys], show: [keys], cls: { key: "class" } },
       ...
     })

   For every state it clones the template into <section class="frame chart" id="<frame id>"> (the frame shoot.py
   screenshots to <frame id>.png) and adds .on (lit) to every element whose data-k lists a key in `on`, .show to every
   element in `show` (the parts the spec says APPEAR), and any extra class in `cls`. So the states of one chart are
   the same DOM with different classes: pixel-identical except for what is lit.

   buildChart(states, { portrait: true }) builds the 9:16 cut: every frame gets the class "portrait" (1080x1920,
   chart.css PART 3) and the phone rules below.

   Self-checks, each one a page error, so shoot.py prints FAIL:
     - a key that matches nothing (a typo would silently light nothing);
     - a font weight the charts use that did not load (shoot.py itself only checks the regular 400 weight, which is
       why a hidden 400-weight primer is added: without it a page that sets Playfair only at 900 fails shoot.py);
     - text that spills out of its node, and text of two different labels or nodes that overlap;
     - text smaller than the floor (22px at 16:9, 28px in portrait, where it is read on a phone);
     - text too near an edge (20px at 16:9; in portrait 60px from the sides, and nothing below y 1450, the lower
       third a phone's interface covers). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  // arrowheads and glows, defined once, used by every frame's wires
  function marker(id, fill) {
    return '<marker id="' + id + '" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="15" markerHeight="15" ' +
      'markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1.2 L11.5,6 L1,10.8 Z" fill="' + fill + '"/></marker>';
  }
  function glow(id, sd) {
    // userSpaceOnUse: a perfectly straight line has a zero-height box, and a box-relative filter region would erase it.
    // The region covers BOTH frames (1920x1080 and the portrait 1080x1920): anything outside it is clipped away.
    return '<filter id="' + id + '" filterUnits="userSpaceOnUse" x="-40" y="-40" width="2000" height="2000">' +
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + sd + '" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  }
  function addDefs() {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("width", "0");
    s.setAttribute("height", "0");
    s.setAttribute("aria-hidden", "true");
    s.style.position = "absolute";
    s.innerHTML = "<defs>" +
      marker("ah-rest", "#4a5263") + marker("ah-cyan", "#00c2ff") + marker("ah-gold", "#ffd700") +
      marker("ah-red", "#ff4060") + marker("ah-white", "#e8eaf0") +
      glow("glow-cyan", 3.2) + glow("glow-soft", 2.2) + "</defs>";
    document.body.insertBefore(s, document.body.firstChild);
  }
  function addPrimer() {
    var d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden";
    d.innerHTML = "<span style=\"font-family:'Playfair Display';font-weight:400\">a</span>" +
      "<span style=\"font-family:'DM Sans';font-weight:400\">a</span>" +
      "<span style=\"font-family:'JetBrains Mono';font-weight:400\">a</span>";
    document.body.insertBefore(d, document.body.firstChild);
  }

  function apply(sec, keys, cls) {
    (keys || []).forEach(function (k) {
      var els = sec.querySelectorAll('[data-k~="' + k + '"]');
      if (!els.length) throw new Error("chart " + sec.id + ': key "' + k + '" matches nothing');
      els.forEach(function (e) { e.classList.add(cls); });
    });
  }

  // ---- the QA pass (after the fonts are in) ----
  function usedFonts(rects) {
    // every family + weight that visible text in the frames is actually set in
    var seen = {};
    rects.forEach(function (x) {
      var cs = getComputedStyle(x.el), fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      seen[cs.fontWeight + " " + fam] = [cs.fontWeight, fam];
    });
    return Object.keys(seen).map(function (k) { return seen[k]; });
  }
  function visible(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
    }
    return true;
  }
  function owner(el) { return el.closest("[data-own], .badge, .tab, .pill, .node, .wl, .head, .corner, .zl"); }
  function textRects(root) {
    var out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (!n.textContent.trim() || !visible(n.parentElement)) continue;
      var r = document.createRange();
      r.selectNodeContents(n);
      Array.prototype.forEach.call(r.getClientRects(), function (q) {
        if (q.width > 0.5 && q.height > 0.5) out.push({ r: q, el: n.parentElement, own: owner(n.parentElement), t: n.textContent.trim() });
      });
    }
    return out;
  }
  function hit(a, b, pad) {
    return a.left < b.right - pad && b.left < a.right - pad && a.top < b.bottom - pad && b.top < a.bottom - pad;
  }
  function check() {
    var errs = [], all = [];
    document.querySelectorAll("section.frame.chart").forEach(function (sec) {
      var fr = sec.getBoundingClientRect(), rects = textRects(sec);
      var portrait = sec.classList.contains("portrait");
      var side = portrait ? 60 : 20, floorPx = portrait ? 28 : 22, lowest = portrait ? fr.top + 1450 : fr.bottom - 20;
      all = all.concat(rects);
      rects.forEach(function (x) {
        // inside the frame (portrait: clear of the sides and of the phone's lower third)
        if (x.r.left < fr.left + side || x.r.right > fr.right - side || x.r.top < fr.top + 20 || x.r.bottom > lowest)
          errs.push(sec.id + ': "' + x.t + '" is outside the safe area');
        // legible: never under the floor
        var fs = parseFloat(getComputedStyle(x.el).fontSize);
        if (fs < floorPx - 0.01) errs.push(sec.id + ': "' + x.t + '" is ' + fs + 'px, under the ' + floorPx + 'px floor');
        // inside its node (tabs and number badges sit on the border on purpose)
        var nd = x.el.closest(".node");
        if (nd && !x.el.closest(".tab, .badge")) {
          var b = nd.getBoundingClientRect();
          if (x.r.left < b.left + 4 || x.r.right > b.right - 4 || x.r.top < b.top + 2 || x.r.bottom > b.bottom - 2)
            errs.push(sec.id + ': "' + x.t + '" spills out of its node');
        }
      });
      // two different labels or nodes never overlap
      for (var i = 0; i < rects.length; i++) for (var j = i + 1; j < rects.length; j++) {
        var a = rects[i], b = rects[j];
        if (a.own === b.own) continue;
        if (hit(a.r, b.r, 1)) errs.push(sec.id + ': "' + a.t + '" overlaps "' + b.t + '"');
      }
    });
    usedFonts(all).forEach(function (u) {
      if (!document.fonts.check(u[0] + ' 24px "' + u[1] + '"')) errs.push("font not loaded: " + u[1] + " " + u[0]);
    });
    window.__chartQA = errs;
    if (errs.length) throw new Error("CHART QA: " + errs.slice(0, 12).join(" | "));
  }

  window.buildChart = function (states, opts) {
    opts = opts || {};
    addDefs();
    addPrimer();
    var tpl = document.getElementById("chart");
    Object.keys(states).forEach(function (id) {
      var st = states[id];
      var sec = document.createElement("section");
      sec.className = "frame chart" + (opts.portrait ? " portrait" : "");
      sec.id = id;
      sec.appendChild(tpl.content.cloneNode(true));
      apply(sec, st.on, "on");
      apply(sec, st.show, "show");
      Object.keys(st.cls || {}).forEach(function (k) { apply(sec, [k], st.cls[k]); });
      document.body.appendChild(sec);
    });
    document.fonts.ready.then(function () { setTimeout(check, 0); });
  };
})();
