// Render Mike's Scene_23 wall with the phrase TOO LATE?. Never saves over the template.
(function () {
    var ROOT = "D:/video-work/bullish-on-kaspa/text-wall/";
    var log = new File(ROOT + "render.log");
    log.encoding = "UTF-8";
    log.open("w");
    var TEXT = "TOO LATE? ";
    var FONTS = ["MonumentExtended-Ultrabold", "Montserrat-Black"];
    var SECONDS = 4;
    try {
        app.beginSuppressDialogs();
        var proj = app.open(new File(ROOT + "tpl/MOGRT.aep"));
        function comp(name) {
            for (var i = 1; i <= proj.numItems; i++) {
                if (proj.item(i) instanceof CompItem && proj.item(i).name === name) return proj.item(i);
            }
            throw new Error("no comp " + name);
        }
        var names = ["T_1", "T_2"];
        for (var n = 0; n < names.length; n++) {
            var c = comp(names[n]);
            var prop = c.layer(1).property("Source Text");
            var td = prop.value;
            log.writeln(names[n] + " before: " + td.text + " font=" + td.font + " size=" + td.fontSize + " fill=" + td.applyFill + " stroke=" + td.applyStroke + " sw=" + (td.applyStroke ? td.strokeWidth : 0));
            td.text = TEXT;
            td.font = "Montserrat-Black";
            prop.setValue(td);
            var l = c.layer(1);
            var r = l.sourceRectAtTime(0, false);
            var sx = 100 * 1560 / r.width;
            var pos = l.property("Position").value;
            l.property("Scale").setValue([sx, 100]);
            var r2 = l.sourceRectAtTime(0, false);
            var cx = r2.left + r2.width / 2;
            l.property("Anchor Point").setValue([cx, l.property("Anchor Point").value[1]]);
            l.property("Position").setValue([c.width / 2, pos[1]]);
            log.writeln(names[n] + " font=" + prop.value.font + " width=" + r.width + " scaleX=" + sx);
        }
        var main = comp("23");
        main.frameRate = 30;
        main.workAreaStart = 0;
        main.workAreaDuration = SECONDS;
        var rqi = proj.renderQueue.items.add(main);
        rqi.timeSpanStart = 0;
        rqi.timeSpanDuration = SECONDS;
        var om = rqi.outputModule(1);
        om.applyTemplate("Lossless");
        om.file = new File(ROOT + "wall-raw.mov");
        log.writeln("rendering to " + om.file.fsName);
        proj.renderQueue.render();
        log.writeln("rendered status=" + rqi.status);
        app.endSuppressDialogs(false);
    } catch (e) {
        log.writeln("ERROR " + e.toString() + " line " + e.line);
    }
    log.writeln("DONE");
    log.close();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    app.quit();
})();
