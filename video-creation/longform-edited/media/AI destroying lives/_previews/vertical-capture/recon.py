import sys, json
sys.path.insert(0,'.')
from receipts_run import *
SITES = {
 "INDEED": ("https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/",
   ["The Labor Market Is Tilting Toward Seniority","July 23, 2026","Differences across industries","All of these factors may be at least partially at play","There is a growing belief that AI"]),
 "CSH": ("https://csh.ac.at/news/how-is-generative-ai-impacting-the-freelance-job-market/",
   ["How Is Generative AI","04.02.2025","over 3 million job postings","A novel paper led by"]),
 "HDH": ("https://cyprusshippingnews.com/2026/02/27/robotization-wave-hits-shipyards/",
   ["Robotisation wave hits shipyards","According to industry sources on Feb. 24","(129 units)","Major domestic shipbuilders"]),
 "C13": ("https://weldingworkforcedata.com", ["320,500","80,000","MORE THAN 157,000","Why is Demand So High","Shining a light"]),
 "C15": ("https://newsroom.bmwgroup.com/global/bmw-group-advances-the-use-of-physical-ai-in-production-with-figure-03-project-in-spartanburg",
   ["Having already successfully completed a pilot","25.06.2026","Our 11-month deployment"]),
 "C16": ("https://www.agilityrobotics.com/content/digit-moves-over-100k-totes", ["Digit Moves Over 100,000 Totes","100,000"]),
 "C17": ("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", ["centimeter","learning how to weld","Persona"]),
 "KH": ("https://www.koreaherald.com/article/10883355", ["2027","field"]),
 "C22": ("https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm", ["Duties","Order parts, supplies","What General Maintenance"]),
 "C24": ("https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/", ["Tedrake","demonstrations"]),
 "C26": ("https://www.aboutamazon.com/news/retail/amazon-shop-direct-external-stores", ["agentic AI handles the entire purchase"]),
 "C25": ("https://www.1x.tech/order", ["US Deliveries start 2026","Home Robot","$499"]),
 "C4": ("https://www.bls.gov/emp/tables/fastest-declining-occupations.htm", ["Table 1.5","Word processors and typists"]),
 "C5": ("https://www.bls.gov/news.release/ecopro.nr0.htm", ["Although the growing adoption of AI","production occupations (-0.4 percent)"]),
}
only = sys.argv[1:] or list(SITES)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for k in only:
        url, ph = SITES[k]
        try:
            ctx, page = load(b, url, wait=4500)
            info = prep(page)
            h = page.evaluate("document.documentElement.scrollHeight")
            print("==", k, "height", h, info)
            for t in ph:
                try: print("   ", repr(t), find(page, t))
                except Exception as e: print("   ", repr(t), "NOT FOUND")
            page.screenshot(path=f"recon-{k}.png", animations="disabled")
            ctx.close()
        except Exception as e:
            print("==", k, "FAIL", str(e).splitlines()[0])
    b.close()
