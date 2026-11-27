/* group1.js: the line icons and two markup helpers the six group-1 charts share (livestream-aws). Loaded after
   chart.js; every chart page builds its <template id="chart"> from these, then calls buildChart (chart.js). */
(function () {
  "use strict";
  var P = {
    pc: '<rect x="2.6" y="3.6" width="18.8" height="12.6" rx="1.8"/><path d="M8.5 20.4h7M12 16.2v4.2"/>',
    graph: '<circle cx="5" cy="5.6" r="2.4"/><circle cx="19" cy="5.6" r="2.4"/><circle cx="12" cy="18.4" r="2.4"/>' +
      '<path d="M7.4 5.6h9.2M6.2 7.8l4.6 8.4M17.8 7.8l-4.6 8.4"/>',
    db: '<ellipse cx="12" cy="5.4" rx="7.6" ry="2.9"/><path d="M4.4 5.4v13.2c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.4"/>' +
      '<path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9"/>',
    browser: '<rect x="2.4" y="3.6" width="19.2" height="16.8" rx="2.6"/><path d="M2.4 8.8h19.2"/>' +
      '<circle cx="5.9" cy="6.2" r=".9" fill="currentColor" stroke="none"/><circle cx="9.1" cy="6.2" r=".9" fill="currentColor" stroke="none"/>',
    chip: '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="1.6"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".6"/>' +
      '<path d="M9.4 2.6v3.6M14.6 2.6v3.6M9.4 17.8v3.6M14.6 17.8v3.6M2.6 9.4h3.6M2.6 14.6h3.6M17.8 9.4h3.6M17.8 14.6h3.6"/>',
    wave: '<path d="M3 12h1.6M7 8.4v7.2M11 4.6v14.8M15 8v8M19 10.4v3.2M21 12h0"/>',
    film: '<rect x="2.6" y="4" width="18.8" height="16" rx="2.2"/><path d="M10 8.8l5.4 3.2-5.4 3.2z" fill="currentColor"/>',
    send: '<path d="M21.4 2.6L10.6 13.4"/><path d="M21.4 2.6l-6.9 18.8-3.9-8-8-3.9z"/>',
    folder: '<path d="M2.8 6.6c0-.9.7-1.6 1.6-1.6h4.7l2.1 2.6h8.4c.9 0 1.6.7 1.6 1.6v9.6c0 .9-.7 1.6-1.6 1.6H4.4c-.9 0-1.6-.7-1.6-1.6z"/>',
    face: '<path d="M3.6 8.2V5.4c0-1 .8-1.8 1.8-1.8h2.8M15.8 3.6h2.8c1 0 1.8.8 1.8 1.8v2.8M20.4 15.8v2.8c0 1-.8 1.8-1.8 1.8h-2.8M8.2 20.4H5.4c-1 0-1.8-.8-1.8-1.8v-2.8"/>' +
      '<circle cx="12" cy="10.2" r="2.9"/><path d="M7.4 17.2c.8-2.3 2.6-3.5 4.6-3.5s3.8 1.2 4.6 3.5"/>',
    mail: '<rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2"/><path d="M3.4 6.2l8.6 6.8 8.6-6.8"/>',
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.6c.6-4 3.5-6.4 7.2-6.4s6.6 2.4 7.2 6.4"/>',
    dash: '<rect x="2.6" y="3.6" width="18.8" height="16.8" rx="2.2"/><path d="M2.6 8.4h18.8M7.4 17v-4.2M12 17v-6M16.6 17v-2.6"/>',
    key: '<circle cx="7.6" cy="16.4" r="4.2"/><path d="M10.6 13.4l9.6-9.6M16.6 7.4l2.8 2.8M14.2 9.8l2 2"/>',
    shield: '<path d="M12 2.6l7.6 3v5.6c0 4.9-3.2 8.6-7.6 10.2-4.4-1.6-7.6-5.3-7.6-10.2V5.6z"/>',
    shieldok: '<path d="M12 2.6l7.6 3v5.6c0 4.9-3.2 8.6-7.6 10.2-4.4-1.6-7.6-5.3-7.6-10.2V5.6z"/><path d="M8.6 12.2l2.4 2.4 4.6-4.8"/>',
    lock: '<rect x="4.6" y="10.4" width="14.8" height="10.4" rx="2"/><path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7v5.2l3.4 2"/>',
    pause: '<rect x="6.2" y="5" width="3.8" height="14" rx="1"/><rect x="14" y="5" width="3.8" height="14" rx="1"/>',
    stop: '<rect x="5.6" y="5.6" width="12.8" height="12.8" rx="2.2"/>',
    play: '<path d="M7 4.8l12 7.2-12 7.2z"/>',
    tool: '<path d="M14.6 6.2a4.2 4.2 0 0 0 5.2 5.2l-8.6 8.6a2.3 2.3 0 0 1-3.3-3.3l8.6-8.6"/><path d="M14.6 6.2l2.2-2.2a4.2 4.2 0 0 1 3 7.4"/>',
    plug: '<path d="M9 2.8v4.4M15 2.8v4.4M6.6 7.2h10.8v3.6a5.4 5.4 0 0 1-10.8 0zM12 16.2v5"/>',
    vault: '<rect x="2.8" y="3.8" width="18.4" height="16.4" rx="2.2"/><circle cx="12" cy="12" r="4.2"/><path d="M12 7.8v1.6M12 14.6v1.6M7.8 12h1.6M14.6 12h1.6M5.6 20.2v1.4M18.4 20.2v1.4"/>',
    bolt: '<path d="M13.2 2.6L4.6 13.6h6.6l-1 7.8 8.6-11h-6.6z"/>',
    terminal: '<rect x="2.6" y="4" width="18.8" height="16" rx="2.2"/><path d="M6.6 9.4l3.4 2.8-3.4 2.8M12.4 15h5"/>',
    py: '<path d="M8.6 3.6h4.6a3 3 0 0 1 3 3v3.2H9.4a3 3 0 0 0-3 3v1.6H5.4a2.8 2.8 0 0 1-2.8-2.8V9.4a3 3 0 0 1 3-3h3zM15.4 20.4h-4.6a3 3 0 0 1-3-3v-3.2h6.8a3 3 0 0 0 3-3V9.6h1a2.8 2.8 0 0 1 2.8 2.8v2.2a3 3 0 0 1-3 3h-3z"/>',
    check: '<path d="M5 12.6l4.4 4.4L19 7.4"/>',
    down: '<path d="M12 3.6v16M5.6 13.4l6.4 6.4 6.4-6.4"/>',
    cross: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"/>',
    cpu: '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="1.6"/><path d="M9.4 2.6v3.6M14.6 2.6v3.6M9.4 17.8v3.6M14.6 17.8v3.6M2.6 9.4h3.6M2.6 14.6h3.6M17.8 9.4h3.6M17.8 14.6h3.6"/>',
    vm: '<rect x="2.6" y="3.6" width="18.8" height="16.8" rx="2.2"/><rect x="6.2" y="7.2" width="11.6" height="9.6" rx="1.2"/>',
    tags: '<path d="M3.4 12.6V4.4c0-.6.4-1 1-1h8.2l8 8a1.4 1.4 0 0 1 0 2l-7.2 7.2a1.4 1.4 0 0 1-2 0z"/><circle cx="8" cy="8" r="1.4"/>'
  };
  // the agent mark of the chart family (clip-evals legend): a filled 4-point star
  var STAR = '<path d="M12 2.2c.9 5.2 4.6 8.9 9.8 9.8-5.2.9-8.9 4.6-9.8 9.8-.9-5.2-4.6-8.9-9.8-9.8 5.2-.9 8.9-4.6 9.8-9.8z" fill="currentColor" stroke="none"/>';

  window.ICO = function (name, size, cls, sw) {
    var body = name === "star" ? STAR : P[name];
    if (!body) throw new Error("group1.js: no icon " + name);
    return '<svg class="ico' + (cls ? " " + cls : "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };

  // an AWS box: { k: data-k keys, x, y, w, h, name, desc, cls, style, sub: true for the sentence-case sub, extra: inner html after the desc }
  window.SVC = function (o) {
    return '<div class="node svc' + (o.cls ? " " + o.cls : "") + '" data-k="' + o.k + '" style="left:' + o.x + 'px;top:' + o.y +
      'px;width:' + o.w + 'px;height:' + o.h + 'px' + (o.style ? ";" + o.style : "") + '">' +
      (o.pre || "") + '<div class="sn">' + o.name + '</div>' +
      (o.desc ? '<div class="sd' + (o.sub ? " sub" : "") + '">' + o.desc + '</div>' : "") + (o.extra || "") + '</div>';
  };

  // a wire: keys, path, extra classes
  window.WIRE = function (k, d, cls) {
    return '<path class="wr' + (cls ? " " + cls : "") + '" data-k="' + k + '" d="' + d + '"/>';
  };
})();
