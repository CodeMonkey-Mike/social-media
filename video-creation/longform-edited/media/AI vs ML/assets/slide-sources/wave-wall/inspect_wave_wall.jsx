// AI vs ML wave-wall: INSPECT the Scene_22 template (comps, layers, text, controls, fonts). Never saves.
(function () {
    var ROOT = "C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/AI vs ML/assets/slide-sources/wave-wall/";
    var log = new File(ROOT + "inspect.log");
    log.encoding = "UTF-8";
    log.open("w");
    function dumpProps(g, ind, depth) {
        if (depth > 4) return;
        var n = 0;
        try { n = g.numProperties; } catch (e0) { return; }
        for (var i = 1; i <= n; i++) {
            var line = ind + "#" + i;
            try {
                var p = g.property(i);
                line = ind + p.name + " [" + p.matchName + "]";
                if (/ADBE (Marker|Time Remapping|Mask Parade|Layer Styles|Plane Options|Extrsn Options|Material Options|Audio Group|Layer Sets)/.test(p.matchName)) continue;
                if (p.propertyType === PropertyType.PROPERTY) {
                    var vt = p.propertyValueType;
                    if (vt !== PropertyValueType.NO_VALUE && vt !== PropertyValueType.CUSTOM_VALUE) {
                        var v = p.value;
                        if (vt === PropertyValueType.TEXT_DOCUMENT) {
                            var t = "TEXT '" + v.text + "'";
                            try { t += " font=" + v.font + " size=" + v.fontSize + " fill=" + v.applyFill + " stroke=" + v.applyStroke + " tracking=" + v.tracking; } catch (et) { t += " (doc " + String(et) + ")"; }
                            try { if (v.applyFill) t += " fc=" + v.fillColor; } catch (ef) {}
                            try { if (v.applyStroke) t += " sc=" + v.strokeColor + " sw=" + v.strokeWidth; } catch (es) {}
                            v = t;
                        }
                        line += " = " + v;
                    }
                    try { if (p.numKeys > 0) line += " keys=" + p.numKeys + " (t0=" + p.keyTime(1) + " v0=" + p.keyValue(1) + ", tN=" + p.keyTime(p.numKeys) + " vN=" + p.keyValue(p.numKeys) + ")"; } catch (ek) {}
                    try { if (p.expressionEnabled) line += " EXPR: " + p.expression.split(String.fromCharCode(13)).join(" ").split(String.fromCharCode(10)).join(" | ").substring(0, 500); } catch (ex) {}
                    log.writeln(line);
                } else {
                    log.writeln(line);
                    dumpProps(p, ind + "  ", depth + 1);
                }
            } catch (e) { log.writeln(line + " ERR " + String(e)); }
        }
    }
    try {
        app.beginSuppressDialogs();
        var proj = app.open(new File(ROOT + "tpl/MOGRT.aep"));
        for (var i = 1; i <= proj.numItems; i++) {
            var it = proj.item(i);
            if (!(it instanceof CompItem)) { log.writeln("ITEM " + it.name + " " + it.typeName); continue; }
            try {
            var hdr = "===== COMP '" + it.name + "'";
            try { hdr += " " + it.width + "x" + it.height; } catch (e1) { hdr += " size?"; }
            try { hdr += " dur=" + it.duration; } catch (e2) { hdr += " dur?"; }
            try { hdr += " fps=" + it.frameRate; } catch (e3) { hdr += " fps?"; }
            try { hdr += " layers=" + it.numLayers; } catch (e4) { hdr += " layers?"; }
            log.writeln(hdr);
            for (var l = 1; l <= it.numLayers; l++) {
                var L = it.layer(l);
                var lh = "--- layer " + l + " '" + L.name + "'";
                try { lh += " in=" + L.inPoint + " out=" + L.outPoint + " start=" + L.startTime + " enabled=" + L.enabled + (L.source ? " src=" + L.source.name : ""); } catch (e5) { lh += " (times?) " + e5; }
                log.writeln(lh);
                dumpProps(L, "    ", 0);
            }
            } catch (ec) { log.writeln("COMP ERR " + String(ec)); }
        }
        try {
            var fams = {};
            var all = app.fonts.allFonts;
            for (var a = 0; a < all.length; a++) for (var b = 0; b < all[a].length; b++) {
                var f = all[a][b];
                if (/montserrat|monument|arial black/i.test(f.familyName)) log.writeln("FONT " + f.postScriptName + " | " + f.familyName + " | " + f.styleName);
            }
        } catch (e) { log.writeln("fonts ERR " + e); }
        app.endSuppressDialogs(false);
    } catch (e) {
        log.writeln("ERROR " + e.toString() + " line " + e.line);
    }
    log.writeln("DONE");
    log.close();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    app.quit();
})();
