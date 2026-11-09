B = []
def cb(ch, tIn, tOut, ct, spoken, what, source, pr="med", verify=False, bench="", notes="", **kw):
    r = {"chapter": ch, "tIn": round(tIn, 3), "tOut": round(tOut, 3), "spoken": spoken, "cover_type": ct,
         "what": what, "source": source, "priority": pr, "verify": verify, "bench": bench, "notes": notes}
    r.update(kw); B.append(r)
