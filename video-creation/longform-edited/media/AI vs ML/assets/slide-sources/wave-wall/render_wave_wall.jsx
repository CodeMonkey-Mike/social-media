// AI vs ML wave-wall (kt-wave-wall): render Mike's Scene_22 template with SHIP (outlined white, comp Text_1) and
// TRAIN (filled ML green #1EFF06, comp Text_2) on black. Pattern: video-creation/skills/effects-library/scripts/render_text_wall.jsx.
// Each phrase is repeated with the template's bullet and scaled horizontally so it spans the template's own width (the Offset
// wrap stays seamless). The template font (Monument Extended) lists in AE here but renders as a serif fallback, so the text is
// set in Montserrat-Black and widened by the layer's X scale toward the template's wide look (the render_text_wall.jsx rule).
// Never saves over the template.
(function () {
    var ROOT = "C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/AI vs ML/";
    var HERE = ROOT + "assets/slide-sources/wave-wall/";
    var OUT = ROOT + "_previews/slide-builder/wave-wall-raw.mov";
    var SECONDS = 4;
    var BULLET = String.fromCharCode(8226);
    var PHRASES = { "Text_1": "SHIP", "Text_2": "TRAIN" };
    var FONT = "Montserrat-Black";
    var TARGET_SX = 118; // widen the narrower Montserrat toward Monument Extended's proportions
    var log = new File(HERE + "render.log");
    log.encoding = "UTF-8";
    log.open("w");
    function arr(v) { var s = []; for (var k = 0; k < v.length; k++) s.push(Math.round(v[k] * 1000) / 1000); return "[" + s.join(", ") + "]"; }
    try {
        app.beginSuppressDialogs();
        var proj = app.open(new File(HERE + "tpl/MOGRT.aep"));
        function comp(name) {
            for (var i = 1; i <= proj.numItems; i++) {
                if (proj.item(i) instanceof CompItem && proj.item(i).name === name) return proj.item(i);
            }
            throw new Error("no comp " + name);
        }
        var main = comp("22");
        var cp = main.layer("CONTROL PANEL");
        var names = ["Text_1_Color", "Text_2_Color", "Shadow_Color", "BG_Color"];
        for (var c = 0; c < names.length; c++) {
            log.writeln(names[c] + " before " + arr(cp.effect(names[c])("Color").valueAtTime(0, false)));
        }
        cp.effect("Text_1_Color")("Color").setValue([1, 1, 1, 1]);
        cp.effect("Text_2_Color")("Color").setValue([30 / 255, 255 / 255, 6 / 255, 1]);
        cp.effect("BG_Color")("Color").setValue([0, 0, 0, 1]);
        log.writeln("Text_1_Color after " + arr(cp.effect("Text_1_Color")("Color").valueAtTime(0, false)));
        log.writeln("Text_2_Color after " + arr(cp.effect("Text_2_Color")("Color").valueAtTime(0, false)));
        log.writeln("BG_Checkbox " + cp.effect("BG_Checkbox ")("Checkbox").valueAtTime(0, false));

        for (var key in PHRASES) {
            var tc = comp(key);
            var L = tc.layer(1);
            var prop = L.property("Source Text");
            var td = prop.valueAtTime(0, false);
            var r0 = L.sourceRectAtTime(0, false);
            var sc0 = L.property("Scale").valueAtTime(0, false);
            var pos0 = L.property("Position").valueAtTime(0, false);
            var an0 = L.property("Anchor Point").valueAtTime(0, false);
            var shown0 = r0.width * sc0[0] / 100;
            var left0 = pos0[0] + (r0.left - an0[0]) * sc0[0] / 100;
            log.writeln(key + " before '" + td.text + "' font=" + td.font + " size=" + td.fontSize + " rect left=" + r0.left + " w=" + r0.width + " scale=" + arr(sc0) + " pos=" + arr(pos0) + " anchor=" + arr(an0) + " shown w=" + shown0 + " left=" + left0 + " comp " + tc.width + "x" + tc.height);
            var best = null;
            for (var reps = 1; reps <= 5; reps++) {
                var txt = "";
                for (var k = 0; k < reps; k++) txt += PHRASES[key] + " " + BULLET + " ";
                txt += " ";
                td.text = txt;
                td.font = FONT;
                prop.setValue(td);
                var r = L.sourceRectAtTime(0, false);
                var sx = 100 * shown0 / r.width;
                log.writeln("  try reps=" + reps + " w=" + r.width + " sx=" + sx);
                if (best === null || Math.abs(Math.log(sx / TARGET_SX)) < Math.abs(Math.log(best.sx / TARGET_SX))) best = { reps: reps, txt: txt, sx: sx };
            }
            td.text = best.txt;
            td.font = FONT;
            prop.setValue(td);
            var r2 = L.sourceRectAtTime(0, false);
            L.property("Scale").setValue([best.sx, sc0[1]]);
            // keep the text's left edge where the template had it
            var newPos = [left0 - (r2.left - an0[0]) * best.sx / 100, pos0[1]];
            if (pos0.length > 2) newPos.push(pos0[2]);
            L.property("Position").setValue(newPos);
            var td2 = prop.valueAtTime(0, false);
            log.writeln(key + " after '" + td2.text + "' font=" + td2.font + " reps=" + best.reps + " scaleX=" + best.sx + " pos=" + arr(newPos));
        }

        main.frameRate = 30;
        main.workAreaStart = 0;
        main.workAreaDuration = SECONDS;
        var rqi = proj.renderQueue.items.add(main);
        rqi.timeSpanStart = 0;
        rqi.timeSpanDuration = SECONDS;
        var om = rqi.outputModule(1);
        om.applyTemplate("Lossless");
        om.file = new File(OUT);
        log.writeln("rendering to " + om.file.fsName);
        proj.renderQueue.render();
        log.writeln("rendered status=" + rqi.status);
        app.endSuppressDialogs(false);
    } catch (e) {
        log.writeln("ERROR " + String(e) + " line " + e.line);
    }
    log.writeln("DONE");
    log.close();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    app.quit();
})();
