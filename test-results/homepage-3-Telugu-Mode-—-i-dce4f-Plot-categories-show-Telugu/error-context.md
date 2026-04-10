# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.js >> 3. Telugu Mode — i18n >> 3.5 Plot categories show Telugu
- Location: src\tests\e2e\homepage.spec.js:148:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=ప్లాట్ విభాగాలు').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=ప్లాట్ విభాగాలు').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4] [cursor=pointer]:
      - generic:
        - generic: ✦
        - generic: ★
        - generic: ✸
        - generic: ◆
        - generic: ✦
        - generic: ✸
        - generic: ★
        - generic: ◆
      - generic [ref=e5]:
        - generic [ref=e6]:
          - generic [ref=e7]: ✦ Grand Launch Event ✦
          - generic [ref=e8]:
            - text: Trimbak Oaks
            - emphasis [ref=e9]: Phase II
            - text: — Brochure Launch
          - generic [ref=e10]:
            - generic [ref=e11]: 📅 11th April 2026 | 10:00 AM
            - generic [ref=e12]: 📍 Padmavathi Icon, Vijayawada
            - generic [ref=e13]: 🍽️ Lunch follows
        - generic [ref=e14]:
          - generic [ref=e16]:
            - generic [ref=e17]: "00"
            - generic [ref=e18]: Days
          - generic [ref=e19]:
            - generic [ref=e20]: ":"
            - generic [ref=e21]:
              - generic [ref=e22]: "20"
              - generic [ref=e23]: Hours
          - generic [ref=e24]:
            - generic [ref=e25]: ":"
            - generic [ref=e26]:
              - generic [ref=e27]: "04"
              - generic [ref=e28]: Mins
          - generic [ref=e29]:
            - generic [ref=e30]: ":"
            - generic [ref=e31]:
              - generic [ref=e32]: "20"
              - generic [ref=e33]: Secs
        - generic [ref=e34]:
          - link "Register Interest →" [ref=e35]:
            - /url: https://wa.me/919948709041?text=Hi!%20I'm%20interested%20in%20Trimbak%20Oaks%20Phase%20II%20Brochure%20Launch%20on%2011th%20April%202026.%20Please%20share%20details!
          - button "View Project" [ref=e36]
        - generic: ▲
    - navigation [ref=e37]:
      - link "Chaturbhuja Properties & Infra" [ref=e38] [cursor=pointer]:
        - /url: /
        - img "Chaturbhuja Properties & Infra" [ref=e39]
      - generic [ref=e40]:
        - button "Portfolio" [ref=e42] [cursor=pointer]:
          - text: Portfolio
          - img [ref=e43]
        - button "Gallery" [ref=e45] [cursor=pointer]
        - button "Videos" [ref=e46] [cursor=pointer]
        - button "Amenities" [ref=e47] [cursor=pointer]
        - button "Location" [ref=e48] [cursor=pointer]
        - button "Contact" [ref=e49] [cursor=pointer]
        - button "Switch to Telugu" [ref=e50] [cursor=pointer]:
          - generic [ref=e51]: EN
          - generic [ref=e52]: తె
        - button "Enquire Now →" [ref=e53] [cursor=pointer]:
          - text: Enquire Now
          - generic [ref=e54]: →
    - main [ref=e55]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - generic [ref=e58]:
            - generic [ref=e59]: "APCRDA Proposed Layout · LP No: 35/2025"
            - generic [ref=e61]: AP RERA · P06060125894
            - generic [ref=e63]: 25 Years · 15+ Projects · 1200+ Families
          - heading "Premium Plots in Andhra Pradesh" [level=1] [ref=e65]:
            - text: Premium Plots in
            - emphasis [ref=e66]: Andhra Pradesh
          - paragraph [ref=e67]: A name rooted in integrity — Chaturbhuja Properties & Infra has been shaping Andhra Pradesh's real estate landscape for 25 years. Under the leadership of Mr. Donepudi Durga Prasad, we have placed 1200+ families in homes they are proud of, across 15+ APCRDA & RERA approved ventures in the Krishna–NTR–Guntur corridor.
          - generic [ref=e68]:
            - button "View Available Plots" [ref=e69] [cursor=pointer]:
              - img [ref=e70]
              - text: View Available Plots
            - button "Schedule Site Visit" [ref=e73] [cursor=pointer]:
              - img [ref=e74]
              - text: Schedule Site Visit
            - button "Download Brochure" [ref=e76] [cursor=pointer]:
              - img [ref=e77]
              - text: Download Brochure
          - generic [ref=e80]:
            - generic [ref=e81]:
              - generic [ref=e82]: 25+
              - generic [ref=e83]: Years in Industry
            - generic [ref=e84]:
              - generic [ref=e85]: 15+
              - generic [ref=e86]: Projects Delivered
            - generic [ref=e87]:
              - generic [ref=e88]: 1200+
              - generic [ref=e89]: Happy Customers
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e95]: M
            - generic [ref=e97]:
              - generic [ref=e98]: Marketing Director
              - generic [ref=e99]: M Siva Nageswara Rao
              - link "+91 99487 09041" [ref=e100] [cursor=pointer]:
                - /url: tel:+91 99487 09041
                - img [ref=e101]
                - text: +91 99487 09041
            - generic [ref=e103]:
              - link "Call" [ref=e104] [cursor=pointer]:
                - /url: tel:+91 99487 09041
                - img [ref=e105]
                - generic [ref=e107]: Call Us
              - link "WhatsApp" [ref=e108] [cursor=pointer]:
                - /url: https://wa.me/919948709041?text=%F0%9F%8F%A1%20Hello!%20I'm%20interested%20in%20owning%20a%20dream%20plot%20with%20Chaturbhuja%20Properties%20%26%20Infra.%20%F0%9F%8F%A1%20Kindly%20share%20details%20on%20available%20plots%2C%20pricing%20and%20location.%20Looking%20forward%20to%20hearing%20from%20you!
                - button "WhatsApp" [ref=e109]:
                  - img [ref=e110]
          - generic [ref=e112]: Limited Time Offer
          - heading "Plots Closing Fast! Lock In Current Rates" [level=3] [ref=e114]:
            - text: Plots Closing Fast
            - emphasis [ref=e115]: "!"
            - text: Lock In Current Rates
          - paragraph [ref=e116]: Prices are set to rise next quarter. Secure your plot today before the revision hits.
          - generic [ref=e117]:
            - generic [ref=e118]:
              - generic [ref=e119]: 🟡
              - generic [ref=e120]: "4"
              - generic [ref=e121]:
                - text: Projects Open
                - generic [ref=e122]: For Booking
            - generic [ref=e124]:
              - generic [ref=e125]: ✅
              - generic [ref=e126]: "11"
              - generic [ref=e127]:
                - text: Projects
                - generic [ref=e128]: Completed
            - generic [ref=e130]:
              - generic [ref=e131]: 🏠
              - generic [ref=e132]: 1200+
              - generic [ref=e133]:
                - text: Happy
                - generic [ref=e134]: Families
          - generic [ref=e137]:
            - generic [ref=e138]: 🟡 4 Open for Booking
            - generic [ref=e139]: ✅ 11 Completed & Sold
          - generic [ref=e140]:
            - generic [ref=e141]:
              - generic [ref=e142]: 25+
              - generic [ref=e143]: Years of Trust
            - generic [ref=e144]:
              - generic [ref=e145]: 100%
              - generic [ref=e146]: Clear Title
            - generic [ref=e147]:
              - generic [ref=e148]: RERA
              - generic [ref=e149]: Registered
          - generic [ref=e150]:
            - button "Explore All Projects →" [ref=e151] [cursor=pointer]
            - link "WhatsApp" [ref=e152] [cursor=pointer]:
              - /url: https://wa.me/919948709041?text=%F0%9F%8F%A1%20Hello!%20I'm%20interested%20in%20owning%20a%20dream%20plot%20with%20Chaturbhuja%20Properties%20%26%20Infra.%20%F0%9F%8F%A1%20Kindly%20share%20details%20on%20available%20plots%2C%20pricing%20and%20location.%20Looking%20forward%20to%20hearing%20from%20you!
              - button "WhatsApp" [ref=e153]:
                - img [ref=e154]
      - generic [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]: Our Portfolio
          - heading "A Legacy of Excellence" [level=2] [ref=e160]:
            - text: A Legacy of
            - emphasis [ref=e161]: Excellence
          - paragraph [ref=e162]: 10+ projects across the Krishna–Guntur corridor — 1200+ families settled, 100% CRDA & RERA approved.
        - generic [ref=e163]:
          - generic [ref=e164]:
            - generic [ref=e165]: 🏗️
            - generic [ref=e166]: 10+
            - generic [ref=e167]: Projects Delivered
          - generic [ref=e168]:
            - generic [ref=e169]: 🏠
            - generic [ref=e170]: 1200+
            - generic [ref=e171]: Happy Customers
          - generic [ref=e172]:
            - generic [ref=e173]: 🏆
            - generic [ref=e174]: 15+
            - generic [ref=e175]: Years in Industry
          - generic [ref=e176]:
            - generic [ref=e177]: ✅
            - generic [ref=e178]: 100%
            - generic [ref=e179]: APCRDA / RERA
        - generic [ref=e180]:
          - generic [ref=e181]:
            - heading "Open for Booking" [level=3] [ref=e183]
            - generic [ref=e184]: 4 projects
          - generic [ref=e185]:
            - generic [ref=e186] [cursor=pointer]:
              - generic [ref=e189]: Featured
              - generic [ref=e190]:
                - heading "Anjana Paradise" [level=3] [ref=e191]
                - paragraph [ref=e192]: 📍 Paritala, Near Amaravati
              - generic [ref=e193]:
                - generic [ref=e194]:
                  - generic [ref=e195]: ☀️ East
                  - generic [ref=e196]: "113"
                - generic [ref=e197]:
                  - generic [ref=e198]: 🌙 West
                  - generic [ref=e199]: "122"
              - generic [ref=e200]:
                - generic [ref=e201]: CRDA Proposed Layout
                - generic [ref=e202]: AP RERA Registered
                - generic [ref=e203]: 100% Clear Title
              - generic [ref=e204]:
                - generic [ref=e205]:
                  - generic [ref=e206]: Starting from
                  - generic [ref=e207]: Rs.24.8L
                - generic [ref=e208]: Tap for details →
            - generic [ref=e209] [cursor=pointer]:
              - generic [ref=e212]: Upcoming
              - generic [ref=e213]:
                - heading "Trimbak Oaks" [level=3] [ref=e214]
                - paragraph [ref=e215]: 📍 Penamaluru, Near Vijayawada
              - generic [ref=e216]:
                - generic [ref=e217]: CRDA Approved
                - generic [ref=e218]: RERA Registered
                - generic [ref=e219]: 100% Clear Title
              - generic [ref=e220]:
                - generic [ref=e221]:
                  - generic [ref=e222]: Starting from
                  - generic [ref=e223]: Coming Soon
                - generic [ref=e224]: Tap for details →
            - generic [ref=e225] [cursor=pointer]:
              - generic [ref=e228]: Limited
              - generic [ref=e229]:
                - heading "Aparna Legacy" [level=3] [ref=e230]
                - paragraph [ref=e231]: 📍 Chevitikallu, Gateway of Amaravati Capital Region
              - generic [ref=e232]:
                - generic [ref=e233]:
                  - generic [ref=e234]: ☀️ East
                  - generic [ref=e235]: "119"
                - generic [ref=e236]:
                  - generic [ref=e237]: 🌙 West
                  - generic [ref=e238]: "138"
              - generic [ref=e239]:
                - generic [ref=e240]: APCRDA Proposed Layout
                - generic [ref=e241]: 100% Vastu Compliant
                - generic [ref=e242]: 100% Clear Title
              - generic [ref=e243]:
                - generic [ref=e244]:
                  - generic [ref=e245]: Starting from
                  - generic [ref=e246]: Rs.26L
                - generic [ref=e247]: Tap for details →
            - generic [ref=e248] [cursor=pointer]:
              - generic [ref=e251]: Hot
              - generic [ref=e252]:
                - heading "Varaha Virtue" [level=3] [ref=e253]
                - paragraph [ref=e254]: 📍 Pamarru, Krishna District
              - generic [ref=e255]:
                - generic [ref=e256]:
                  - generic [ref=e257]: ☀️ East
                  - generic [ref=e258]: "79"
                - generic [ref=e259]:
                  - generic [ref=e260]: 🌙 West
                  - generic [ref=e261]: "53"
              - generic [ref=e262]:
                - generic [ref=e263]: APCRDA Proposed Layout
                - generic [ref=e264]: NH-16 Frontage
                - generic [ref=e265]: 100% Clear Title
              - generic [ref=e266]:
                - generic [ref=e267]:
                  - generic [ref=e268]: Starting from
                  - generic [ref=e269]: Rs.25L
                - generic [ref=e270]: Tap for details →
        - generic [ref=e271]:
          - generic [ref=e272]:
            - heading "Completed & Sold Out" [level=3] [ref=e274]
            - generic [ref=e275]: 6 projects · 317+ plots
          - generic [ref=e276]:
            - generic [ref=e277]:
              - generic [ref=e278]: ✓
              - generic [ref=e279]: Nandana Vihar
              - generic [ref=e280]: 📍 Kanumuru
              - generic [ref=e281]: 64 plots · 2022
            - generic [ref=e282]:
              - generic [ref=e283]: ✓
              - generic [ref=e284]: County
              - generic [ref=e285]: 📍 Edupugallu
              - generic [ref=e286]: 48 plots · 2021
            - generic [ref=e287]:
              - generic [ref=e288]: ✓
              - generic [ref=e289]: Pearl
              - generic [ref=e290]: 📍 Kankipadu
              - generic [ref=e291]: 36 plots · 2020
            - generic [ref=e292]:
              - generic [ref=e293]: ✓
              - generic [ref=e294]: Empire
              - generic [ref=e295]: 📍 Penamaluru
              - generic [ref=e296]: 72 plots · 2019
            - generic [ref=e297]:
              - generic [ref=e298]: ✓
              - generic [ref=e299]: Pride
              - generic [ref=e300]: 📍 Nepalli
              - generic [ref=e301]: 42 plots · 2018
            - generic [ref=e302]:
              - generic [ref=e303]: ✓
              - generic [ref=e304]: Prime
              - generic [ref=e305]: 📍 Kankipadu
              - generic [ref=e306]: 55 plots · 2017
      - generic [ref=e307]:
        - generic [ref=e308]:
          - generic [ref=e309]: Visual Tour
          - heading "Photo Gallery" [level=2] [ref=e310]:
            - text: Photo
            - emphasis [ref=e311]: Gallery
        - generic [ref=e312]:
          - generic [ref=e313] [cursor=pointer]:
            - img "All Ready To Buy Ventures" [ref=e314]
            - generic [ref=e316]: All Ready To Buy Ventures
          - generic [ref=e325] [cursor=pointer]:
            - img "Aparna Legacy Chevitikallu Home" [ref=e326]
            - generic [ref=e328]: Aparna Legacy Chevitikallu Home
          - generic [ref=e329] [cursor=pointer]:
            - img "Plot Landscape" [ref=e330]
            - generic [ref=e332]: Plot Landscape
          - generic [ref=e353] [cursor=pointer]:
            - img "Anjana Paradise Paritala Home" [ref=e354]
            - generic [ref=e356]: Anjana Paradise Paritala Home
          - generic [ref=e387] [cursor=pointer]:
            - img "Plot Landscape" [ref=e388]
            - generic [ref=e390]: Plot Landscape
      - generic [ref=e391]:
        - generic [ref=e392]:
          - generic [ref=e393]: Watch & Explore
          - heading "Project Videos" [level=2] [ref=e394]:
            - text: Project
            - emphasis [ref=e395]: Videos
        - generic [ref=e396]:
          - generic [ref=e397] [cursor=pointer]:
            - img [ref=e401]
            - generic [ref=e403]:
              - generic [ref=e404]: Anjana Paradise @ Paritala
              - generic [ref=e405]: Anjana_Paradise.mp4
          - generic [ref=e406] [cursor=pointer]:
            - img [ref=e410]
            - generic [ref=e412]:
              - generic [ref=e413]: Anjana Paradise @ Paritala
              - generic [ref=e414]: Detailed_View.mp4
          - generic [ref=e415] [cursor=pointer]:
            - img [ref=e419]
            - generic [ref=e421]:
              - generic [ref=e422]: Aparna Legacy @ Chevitikallu
              - generic [ref=e423]: 001.mp4
          - generic [ref=e424] [cursor=pointer]:
            - img [ref=e428]
            - generic [ref=e430]:
              - generic [ref=e431]: Aparna Legacy @ Chevitikallu
              - generic [ref=e432]: 002.mp4
          - generic [ref=e433] [cursor=pointer]:
            - img [ref=e437]
            - generic [ref=e439]:
              - generic [ref=e440]: Varaha Virtue @ Pamarru
              - generic [ref=e441]: 001.mp4
          - generic [ref=e442] [cursor=pointer]:
            - img [ref=e446]
            - generic [ref=e448]:
              - generic [ref=e449]: Varaha Virtue @ Pamarru
              - generic [ref=e450]: 002.mp4
          - generic [ref=e451] [cursor=pointer]:
            - img [ref=e455]
            - generic [ref=e457]:
              - generic [ref=e458]: Varaha Virtue @ Pamarru
              - generic [ref=e459]: 003.mp4
      - generic [ref=e461]:
        - generic [ref=e462]: Investment Opportunity
        - heading "Invest ₹2 Today —" [level=2] [ref=e463]
        - heading "Receive ₹20 Tomorrow" [level=2] [ref=e464]
        - paragraph [ref=e466]: “If you invest 2 rupees now, in a few years it will be 10 times your investment.”
        - generic [ref=e467]:
          - generic [ref=e468]:
            - generic [ref=e469]: 10×
            - generic [ref=e470]: Expected Return
          - generic [ref=e471]:
            - generic [ref=e472]: 5–7
            - generic [ref=e473]: Years Horizon
          - generic [ref=e474]:
            - generic [ref=e475]: Safe
            - generic [ref=e476]: CRDA + RERA
        - button "Book Your Plot Now →" [ref=e477] [cursor=pointer]
      - generic [ref=e478]:
        - generic [ref=e479]:
          - generic [ref=e480]: Why Chaturbhuja
          - heading "Why Invest With Us?" [level=2] [ref=e481]:
            - text: Why Invest With
            - emphasis [ref=e482]: Us?
          - paragraph [ref=e483]: Four premium ventures across the Krishna–NTR–Guntur corridor — each APCRDA approved, RERA registered, 100% clear title.
        - generic [ref=e484]:
          - generic [ref=e485]:
            - generic [ref=e486]: 🛣️
            - heading "Near National Highway" [level=4] [ref=e487]
            - paragraph [ref=e488]: Direct access to NH-16, connecting major cities.
          - generic [ref=e489]:
            - generic [ref=e490]: 🏛️
            - heading "8 km from Amaravati" [level=4] [ref=e491]
            - paragraph [ref=e492]: Minutes from AP's new capital city.
          - generic [ref=e493]:
            - generic [ref=e494]: 🚆
            - heading "Road & Rail Connectivity" [level=4] [ref=e495]
            - paragraph [ref=e496]: Proposed express highway and railway expansion.
          - generic [ref=e497]:
            - generic [ref=e498]: 🏭
            - heading "Logistic Hub, Paritala" [level=4] [ref=e499]
            - paragraph [ref=e500]: Upcoming industrial and logistics corridor.
          - generic [ref=e501]:
            - generic [ref=e502]: 🎓
            - heading "Educational & Medical" [level=4] [ref=e503]
            - paragraph [ref=e504]: SRM, NRI Medical College within 10 km.
          - generic [ref=e505]:
            - generic [ref=e506]: 🏏
            - heading "Mulapadu Stadium" [level=4] [ref=e507]
            - paragraph [ref=e508]: International-grade cricket stadium nearby.
      - generic [ref=e509]:
        - generic [ref=e510]:
          - generic [ref=e511]: Plot Categories
          - heading "Explore Available Plots" [level=2] [ref=e512]:
            - text: Explore
            - emphasis [ref=e513]: Available Plots
          - paragraph [ref=e514]: 242 plots across 3 categories. Click any category to see plot numbers and enquire directly.
        - generic [ref=e515]:
          - button "Anjana Paradise Paritala 242 plots" [ref=e516] [cursor=pointer]:
            - generic [ref=e517]: Anjana Paradise
            - generic [ref=e518]: Paritala
            - generic [ref=e519]: 242 plots
          - button "Aparna Legacy Chevitikallu 273 plots" [ref=e520] [cursor=pointer]:
            - generic [ref=e521]: Aparna Legacy
            - generic [ref=e522]: Chevitikallu
            - generic [ref=e523]: 273 plots
          - button "Varaha Virtue Pamarru 132 plots" [ref=e524] [cursor=pointer]:
            - generic [ref=e525]: Varaha Virtue
            - generic [ref=e526]: Pamarru
            - generic [ref=e527]: 132 plots
          - button "Trimbak Oaks Penamaluru 🔜 Upcoming" [ref=e528] [cursor=pointer]:
            - generic [ref=e529]: Trimbak Oaks
            - generic [ref=e530]: Penamaluru
            - generic [ref=e531]: 🔜 Upcoming
        - 'button "Price Range East: ₹13,000 | West: ₹12,500 + ₹1,000 Dev. View full pricing ▼" [ref=e533] [cursor=pointer]':
          - generic [ref=e534]: Price Range
          - generic [ref=e535]:
            - text: "East: ₹13,000 | West: ₹12,500"
            - generic [ref=e536]: + ₹1,000 Dev.
          - generic [ref=e537]: View full pricing ▼
        - generic [ref=e538]:
          - generic [ref=e541] [cursor=pointer]:
            - img [ref=e543]
            - generic [ref=e549]:
              - generic [ref=e550]: East-Facing
              - generic [ref=e551]: Morning sunlight — ideal for Vaastu and wellness.
            - generic [ref=e552]:
              - generic [ref=e553]: "112"
              - generic [ref=e554]: PLOTS
            - button "Expand plot list" [ref=e555]: ▾
          - generic [ref=e558] [cursor=pointer]:
            - img [ref=e560]
            - generic [ref=e565]:
              - generic [ref=e566]: West-Facing
              - generic [ref=e567]: Evening sunlight with open western views.
            - generic [ref=e568]:
              - generic [ref=e569]: "122"
              - generic [ref=e570]: PLOTS
            - button "Expand plot list" [ref=e571]: ▾
          - generic [ref=e574] [cursor=pointer]:
            - img [ref=e576]
            - generic [ref=e581]:
              - generic [ref=e582]: Corner Plots
              - generic [ref=e583]: Premium corner plots with maximum road frontage.
            - generic [ref=e584]:
              - generic [ref=e585]: "8"
              - generic [ref=e586]: PLOTS
            - button "Expand plot list" [ref=e587]: ▾
        - generic [ref=e588]:
          - heading "By Plot Size" [level=3] [ref=e589]
          - generic [ref=e590]:
            - generic [ref=e591]:
              - generic [ref=e592]: "101"
              - generic [ref=e593]: 33'×50' ft
              - generic [ref=e594]: 183 Sq Yd
              - generic [ref=e595]: Contact us
              - button "Enquire Now" [ref=e596] [cursor=pointer]
            - generic [ref=e597]:
              - generic [ref=e598]: "33"
              - generic [ref=e599]: 33'×52' ft
              - generic [ref=e600]: 191 Sq Yd
              - generic [ref=e601]: Contact us
              - button "Enquire Now" [ref=e602] [cursor=pointer]
            - generic [ref=e603]:
              - generic [ref=e604]: "24"
              - generic [ref=e605]: 33'×58' ft
              - generic [ref=e606]: 213 Sq Yd
              - generic [ref=e607]: Contact us
              - button "Enquire Now" [ref=e608] [cursor=pointer]
            - generic [ref=e609]:
              - generic [ref=e610]: "13"
              - generic [ref=e611]: 50'×50' ft
              - generic [ref=e612]: 278 Sq Yd
              - generic [ref=e613]: Contact us
              - button "Enquire Now" [ref=e614] [cursor=pointer]
            - generic [ref=e615]:
              - generic [ref=e616]: "13"
              - generic [ref=e617]: 33'×54' ft
              - generic [ref=e618]: 198 Sq Yd
              - generic [ref=e619]: Contact us
              - button "Enquire Now" [ref=e620] [cursor=pointer]
      - generic [ref=e621]:
        - generic [ref=e622]:
          - generic [ref=e623]: What We Offer
          - heading "World-Class Amenities" [level=2] [ref=e624]:
            - text: World-Class
            - emphasis [ref=e625]: Amenities
          - paragraph [ref=e626]: Every detail crafted for a refined, future-ready lifestyle.
        - generic [ref=e627]:
          - button "Infrastructure 12" [ref=e628] [cursor=pointer]:
            - text: Infrastructure
            - generic [ref=e629]: "12"
          - button "Lifestyle 5" [ref=e630] [cursor=pointer]:
            - text: Lifestyle
            - generic [ref=e631]: "5"
          - button "Utilities 6" [ref=e632] [cursor=pointer]:
            - text: Utilities
            - generic [ref=e633]: "6"
        - generic [ref=e634]:
          - generic [ref=e635]:
            - generic [ref=e636]: 🏛️
            - generic [ref=e637]: Grand Entrance Arch
          - generic [ref=e638]:
            - generic [ref=e639]: 🛣️
            - generic [ref=e640]: 60ft & 40ft CC Roads
          - generic [ref=e641]:
            - generic [ref=e642]: 🚧
            - generic [ref=e643]: BT Roads Throughout Layout
          - generic [ref=e644]:
            - generic [ref=e645]: 🔒
            - generic [ref=e646]: Compound Wall
          - generic [ref=e647]:
            - generic [ref=e648]: 🔐
            - generic [ref=e649]: Security Arch
          - generic [ref=e650]:
            - generic [ref=e651]: 🔢
            - generic [ref=e652]: Name & Number Display Board
          - generic [ref=e653]:
            - generic [ref=e654]: 🌊
            - generic [ref=e655]: Drainage System
          - generic [ref=e656]:
            - generic [ref=e657]: 💡
            - generic [ref=e658]: Underground Electricity
          - generic [ref=e659]:
            - generic [ref=e660]: 🌙
            - generic [ref=e661]: Designed LED Street Lights
          - generic [ref=e662]:
            - generic [ref=e663]: 🌳
            - generic [ref=e664]: Avenue Plantation
          - generic [ref=e665]:
            - generic [ref=e666]: 🅿️
            - generic [ref=e667]: Visitor Parking
          - generic [ref=e668]:
            - generic [ref=e669]: ✅
            - generic [ref=e670]: CRDA Proposed Layout
      - generic [ref=e671]:
        - generic [ref=e672]:
          - generic [ref=e673]: Find Us
          - heading "Location & Connectivity" [level=2] [ref=e674]:
            - text: Location &
            - emphasis [ref=e675]: Connectivity
          - paragraph [ref=e676]: All ventures located in prime corridors of Andhra Pradesh.
        - generic [ref=e677]:
          - button "Anjana Paradise Paritala" [ref=e678] [cursor=pointer]:
            - generic [ref=e680]: Anjana Paradise
            - generic [ref=e681]: Paritala
          - button "Aparna Legacy Chevitikallu" [ref=e682] [cursor=pointer]:
            - generic [ref=e684]: Aparna Legacy
            - generic [ref=e685]: Chevitikallu
          - button "Varaha Virtue Pamarru" [ref=e686] [cursor=pointer]:
            - generic [ref=e688]: Varaha Virtue
            - generic [ref=e689]: Pamarru
          - button "Trimbak Oaks Penamaluru" [ref=e690] [cursor=pointer]:
            - generic [ref=e692]: Trimbak Oaks
            - generic [ref=e693]: Penamaluru
        - generic [ref=e694]:
          - generic [ref=e695]:
            - iframe [ref=e696]:
              
            - generic [ref=e697]:
              - generic [ref=e698]: 📍 Anjana Paradise
              - generic [ref=e699]: Paritala, Krishna District, AP 521180
              - generic [ref=e700]:
                - generic [ref=e701]: CRDA Approved
                - generic [ref=e702]: RERA Registered
              - button "Open in Maps" [ref=e703] [cursor=pointer]
            - generic [ref=e705]:
              - generic [ref=e708]:
                - generic [ref=e709]: Anjana Paradise
                - generic [ref=e710]: Paritala, Krishna District, AP 521180
              - button "Get Directions" [ref=e711] [cursor=pointer]:
                - img [ref=e712]
                - text: Get Directions
          - generic:
            - iframe [ref=e714]:
              
            - generic:
              - generic:
                - generic:
                  - generic: Aparna Legacy
                  - generic: Chevitikallu, NTR District, AP 521212
              - button "Get Directions":
                - img
                - text: Get Directions
          - generic:
            - iframe [ref=e715]:
              
            - generic:
              - generic:
                - generic:
                  - generic: Varaha Virtue
                  - generic: Pamarru, Krishna District, AP 521157
              - button "Get Directions":
                - img
                - text: Get Directions
          - generic:
            - iframe [ref=e716]:
              
            - generic:
              - generic:
                - generic:
                  - generic: Trimbak Oaks
                  - generic: Penamaluru, Krishna District, AP 521139
              - button "Get Directions":
                - img
                - text: Get Directions
        - generic [ref=e717]:
          - generic [ref=e718]:
            - generic [ref=e719]: 🛣️
            - generic [ref=e720]:
              - generic [ref=e721]: NH-16 National Highway
              - generic [ref=e722]: Adjacent — direct access
            - generic [ref=e723]: 0 km
          - generic [ref=e724]:
            - generic [ref=e725]: 🏛️
            - generic [ref=e726]:
              - generic [ref=e727]: Amaravati Capital
              - generic [ref=e728]: New AP State Capital
            - generic [ref=e729]: 8 km
          - generic [ref=e730]:
            - generic [ref=e731]: 🎓
            - generic [ref=e732]:
              - generic [ref=e733]: Engineering Colleges
              - generic [ref=e734]: Amrita Sai, MVR, MIC
            - generic [ref=e735]: 5 km
          - generic [ref=e736]:
            - generic [ref=e737]: 🏥
            - generic [ref=e738]:
              - generic [ref=e739]: Nimra Medical College
              - generic [ref=e740]: Healthcare hub
            - generic [ref=e741]: 7 km
          - generic [ref=e742]:
            - generic [ref=e743]: 🏏
            - generic [ref=e744]:
              - generic [ref=e745]: Mulapadu Stadium
              - generic [ref=e746]: International Cricket
            - generic [ref=e747]: 6 km
          - generic [ref=e748]:
            - generic [ref=e749]: 🎬
            - generic [ref=e750]:
              - generic [ref=e751]: Cine Studio
              - generic [ref=e752]: Govt. proposed, Nandigama
            - generic [ref=e753]: Nearby
          - generic [ref=e754]:
            - generic [ref=e755]: 🚉
            - generic [ref=e756]:
              - generic [ref=e757]: Railway Connectivity
              - generic [ref=e758]: Govt. proposed, Amaravati–Paritala
            - generic [ref=e759]: Proposed
          - generic [ref=e760]:
            - generic [ref=e761]: 🏭
            - generic [ref=e762]:
              - generic [ref=e763]: Logistic Hub
              - generic [ref=e764]: Govt. proposed, Paritala
            - generic [ref=e765]: Proposed
          - generic [ref=e766]:
            - generic [ref=e767]: 🙏
            - generic [ref=e768]:
              - generic [ref=e769]: Hanuman Temple
              - generic [ref=e770]: Just minutes away
            - generic [ref=e771]: Nearby
      - generic [ref=e773]:
        - generic [ref=e774]:
          - generic [ref=e775]: Get In Touch
          - heading "Write to Us — Send Message" [level=2] [ref=e776]:
            - text: Write to Us —
            - emphasis [ref=e777]: Send Message
          - paragraph [ref=e778]: Our team is available 7 days a week. Call Us, Send WhatsApp or fill the form.
          - generic [ref=e779]:
            - generic [ref=e780]:
              - generic [ref=e781]: ✓
              - text: Free site visit with transport
            - generic [ref=e782]:
              - generic [ref=e783]: ✓
              - text: No-obligation consultation
            - generic [ref=e784]:
              - generic [ref=e785]: ✓
              - text: Flexible payment plans
            - generic [ref=e786]:
              - generic [ref=e787]: ✓
              - text: Home loan assistance
          - generic [ref=e788]:
            - link "📞 Call Us +91 99487 09041" [ref=e789] [cursor=pointer]:
              - /url: tel:+91 99487 09041
              - generic [ref=e790]: 📞
              - generic [ref=e791]:
                - generic [ref=e792]: Call Us
                - generic [ref=e793]: +91 99487 09041
            - button "Send WhatsApp" [ref=e794] [cursor=pointer]:
              - img [ref=e795]
        - generic [ref=e797]:
          - heading "Send Message" [level=3] [ref=e798]
          - generic [ref=e799]:
            - button "📞 Request Callback" [ref=e800] [cursor=pointer]
            - button "🗓️ Schedule Site Visit" [ref=e801] [cursor=pointer]
          - generic [ref=e802]:
            - text: We typically respond within
            - strong [ref=e803]: 30 minutes
            - text: during business hours (9am–7pm).
          - generic [ref=e805]:
            - img [ref=e807]
            - button "WhatsApp" [ref=e811] [cursor=pointer]:
              - img [ref=e812]
            - heading "Scan & Chat on WhatsApp" [level=4] [ref=e814]
            - paragraph [ref=e815]: Scan this QR to start a WhatsApp chat instantly
            - button "⬇ Download QR" [ref=e816] [cursor=pointer]
    - contentinfo [ref=e817]:
      - generic [ref=e819]:
        - generic [ref=e820]:
          - generic [ref=e821]:
            - img "Chaturbhuja Properties & Infra" [ref=e822]
            - paragraph [ref=e823]: Building Dreams Across Andhra Pradesh — 25 Years of Trust. 15+ Projects Delivered, 1200+ Happy Customers.
            - generic [ref=e824]:
              - generic [ref=e825]: CRDA Approved
              - generic [ref=e826]: AP RERA Registered
              - generic [ref=e827]: 25 Yrs · 15+ Projects
            - generic [ref=e828]:
              - link "Facebook" [ref=e829] [cursor=pointer]:
                - /url: https://www.facebook.com/profile.php?id=61575447640354
                - img [ref=e830]
              - link "YouTube" [ref=e832] [cursor=pointer]:
                - /url: https://www.youtube.com/@Chaturbhujaplots
                - img [ref=e833]
          - generic [ref=e836]:
            - heading "Quick Links" [level=5] [ref=e837]
            - button "› Portfolio" [ref=e838] [cursor=pointer]:
              - generic [ref=e839]: ›
              - text: Portfolio
            - button "› Gallery" [ref=e840] [cursor=pointer]:
              - generic [ref=e841]: ›
              - text: Gallery
            - button "› Videos" [ref=e842] [cursor=pointer]:
              - generic [ref=e843]: ›
              - text: Videos
            - button "› Amenities" [ref=e844] [cursor=pointer]:
              - generic [ref=e845]: ›
              - text: Amenities
            - button "› Location" [ref=e846] [cursor=pointer]:
              - generic [ref=e847]: ›
              - text: Location
            - button "› Contact" [ref=e848] [cursor=pointer]:
              - generic [ref=e849]: ›
              - text: Contact
          - generic [ref=e850]:
            - heading "Our Projects" [level=5] [ref=e851]
            - generic [ref=e852]: Anjana Paradise @ Paritala
            - generic [ref=e854]: Trimbak Oaks @ Penamaluru
            - generic [ref=e856]: Aparna Legacy @ Chevitikallu
            - generic [ref=e858]: Varaha Virtue @ Pamarru
            - generic [ref=e860]: + VSR Grand @ Thadigadapa
          - generic [ref=e861]:
            - heading "Call Us" [level=5] [ref=e862]
            - generic [ref=e863] [cursor=pointer]:
              - link "📞 +91 99487 09041" [ref=e864]:
                - /url: tel:+91 99487 09041
                - generic [ref=e865]: 📞
                - generic [ref=e866]: +91 99487 09041
              - link "Send WhatsApp" [ref=e867]:
                - /url: https://wa.me/919948709041?text=%F0%9F%8F%A1%20Hello!%20I'm%20interested%20in%20owning%20a%20dream%20plot%20with%20Chaturbhuja%20Properties%20%26%20Infra.%20%F0%9F%8F%A1%20Kindly%20share%20details%20on%20available%20plots%2C%20pricing%20and%20location.%20Looking%20forward%20to%20hearing%20from%20you!
                - button "Send WhatsApp" [ref=e868]:
                  - img [ref=e869]
            - link "✉ msnraoooo@gmail.com" [ref=e871] [cursor=pointer]:
              - /url: mailto:msnraoooo@gmail.com
              - generic [ref=e872]: ✉
              - generic [ref=e873]: msnraoooo@gmail.com
            - generic [ref=e874] [cursor=pointer]:
              - generic [ref=e875]: 📍
              - generic [ref=e876]: Vijayawada, Andhra Pradesh
            - link "🌐 www.chaturbhujaplots.in" [ref=e877] [cursor=pointer]:
              - /url: https://www.chaturbhujaplots.in
              - generic [ref=e878]: 🌐
              - generic [ref=e879]: www.chaturbhujaplots.in
        - generic [ref=e880]:
          - generic [ref=e881]: © 2026 Chaturbhuja Properties & Infra. All rights reserved.
          - generic [ref=e882]: CRDA Approved · RERA Registered · 100% Clear Title
        - generic [ref=e883]:
          - text: Developed by
          - link "SM Solutions & Technologies" [ref=e884] [cursor=pointer]:
            - /url: https://www.smsolutionstech.com
    - button "Chat on WhatsApp" [ref=e886] [cursor=pointer]:
      - img [ref=e887]
  - button "Back to top" [ref=e889] [cursor=pointer]: ↑
```

# Test source

```ts
  50  |   test('1.5 Hero section is visible', async ({ page }) => {
  51  |     await page.goto(BASE)
  52  |     await expect(page.locator('#hero, [class*="hero"], section').first()).toBeVisible()
  53  |   })
  54  | 
  55  |   test('1.6 No console errors on load', async ({ page }) => {
  56  |     const errors = []
  57  |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  58  |     await page.goto(BASE)
  59  |     await page.waitForTimeout(2000)
  60  |     const critical = errors.filter(e => !e.includes('favicon') && !e.includes('DevTools'))
  61  |     expect(critical.length).toBe(0)
  62  |   })
  63  | })
  64  | 
  65  | // ══════════════════════════════════════════════════════════════════════════════
  66  | // SUITE 2 — English Mode (default)
  67  | // ══════════════════════════════════════════════════════════════════════════════
  68  | test.describe('2. English Mode — Content', () => {
  69  |   test.beforeEach(async ({ page }) => {
  70  |     await page.goto(BASE)
  71  |     await switchToEnglish(page)
  72  |   })
  73  | 
  74  |   test('2.1 Hero headline visible in English', async ({ page }) => {
  75  |     const hero = page.locator('h1, [class*="heroH"], [class*="headline"]').first()
  76  |     await expect(hero).toBeVisible()
  77  |     const text = await hero.textContent()
  78  |     expect(text?.length).toBeGreaterThan(5)
  79  |   })
  80  | 
  81  |   test('2.2 "View Available Plots" CTA button visible', async ({ page }) => {
  82  |     await expect(page.locator('button:has-text("View Available Plots"), a:has-text("View Available Plots")').first()).toBeVisible()
  83  |   })
  84  | 
  85  |   test('2.3 Navbar has Portfolio link', async ({ page }) => {
  86  |     await expect(page.locator('nav').locator('text=Portfolio').first()).toBeVisible()
  87  |   })
  88  | 
  89  |   test('2.4 Why Chaturbhuja section visible', async ({ page }) => {
  90  |     await page.locator('#highlights, [id="highlights"], section').nth(2).scrollIntoViewIfNeeded().catch(() => {})
  91  |     await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  92  |   })
  93  | 
  94  |   test('2.5 Amenities section has tabs', async ({ page }) => {
  95  |     await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
  96  |     await expect(page.locator('text=What We Offer').first()).toBeVisible()
  97  |   })
  98  | 
  99  |   test('2.6 Location section visible with 4 project tabs', async ({ page }) => {
  100 |     await page.locator('#location, [id="location"]').scrollIntoViewIfNeeded().catch(() => {})
  101 |     await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  102 |     await expect(page.locator('text=Aparna Legacy').first()).toBeVisible()
  103 |     await expect(page.locator('text=Varaha Virtue').first()).toBeVisible()
  104 |     await expect(page.locator('text=Trimbak Oaks').first()).toBeVisible()
  105 |   })
  106 | 
  107 |   test('2.7 Plots section shows East-Facing / West-Facing', async ({ page }) => {
  108 |     await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
  109 |     await expect(page.locator('text=East-Facing').first()).toBeVisible()
  110 |     await expect(page.locator('text=West-Facing').first()).toBeVisible()
  111 |   })
  112 | 
  113 |   test('2.8 Footer visible with tagline', async ({ page }) => {
  114 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  115 |     await page.waitForTimeout(500)
  116 |     await expect(page.locator('footer').first()).toBeVisible()
  117 |   })
  118 | })
  119 | 
  120 | // ══════════════════════════════════════════════════════════════════════════════
  121 | // SUITE 3 — Telugu Mode (i18n)
  122 | // ══════════════════════════════════════════════════════════════════════════════
  123 | test.describe('3. Telugu Mode — i18n', () => {
  124 |   test.beforeEach(async ({ page }) => {
  125 |     await page.goto(BASE)
  126 |     await switchToTelugu(page)
  127 |   })
  128 | 
  129 |   test('3.1 Hero CTA changes to Telugu', async ({ page }) => {
  130 |     const cta = page.locator('button:has-text("అందుబాటులోని"), button:has-text("ఇప్పుడే")').first()
  131 |     await expect(cta).toBeVisible()
  132 |   })
  133 | 
  134 |   test('3.2 Navbar shows Telugu text', async ({ page }) => {
  135 |     const nav = page.locator('nav')
  136 |     const text = await nav.textContent()
  137 |     expect(text).toMatch(/[\u0C00-\u0C7F]/)
  138 |   })
  139 | 
  140 |   test('3.3 Why Chaturbhuja shows Telugu', async ({ page }) => {
  141 |     await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  142 |   })
  143 | 
  144 |   test('3.4 Amenities section shows Telugu heading', async ({ page }) => {
  145 |     await expect(page.locator('text=అత్యాధునిక సౌకర్యాలు').first()).toBeVisible()
  146 |   })
  147 | 
  148 |   test('3.5 Plot categories show Telugu', async ({ page }) => {
  149 |     await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
> 150 |     await expect(page.locator('text=ప్లాట్ విభాగాలు').first()).toBeVisible()
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  151 |   })
  152 | 
  153 |   test('3.6 Location section shows Telugu heading', async ({ page }) => {
  154 |     await expect(page.locator('text=మమ్మల్ని కనుగొనండి').first()).toBeVisible()
  155 |   })
  156 | 
  157 |   test('3.7 No raw key strings visible (e.g. "sections.highlights")', async ({ page }) => {
  158 |     const body = await page.locator('body').textContent()
  159 |     const rawKeys = body?.match(/\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer)\.[a-z]+/g) || []
  160 |     const filtered = rawKeys.filter(k => !k.includes('localhost') && !k.includes('.jsx') && !k.includes('.js'))
  161 |     expect(filtered.length).toBe(0)
  162 |   })
  163 | 
  164 |   test('3.8 Switching back to English restores EN content', async ({ page }) => {
  165 |     await switchToEnglish(page)
  166 |     await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  167 |   })
  168 | })
  169 | 
  170 | // ══════════════════════════════════════════════════════════════════════════════
  171 | // SUITE 4 — Project Pages
  172 | // ══════════════════════════════════════════════════════════════════════════════
  173 | test.describe('4. Project Pages', () => {
  174 |   const PROJECTS = [
  175 |     { id: 'anjana',  name: 'Anjana Paradise',  loc: 'Paritala' },
  176 |     { id: 'aparna',  name: 'Aparna Legacy',    loc: 'Chevitikallu' },
  177 |     { id: 'varaha',  name: 'Varaha Virtue',    loc: 'Pamarru' },
  178 |     { id: 'trimbak', name: 'Trimbak Oaks',     loc: 'Penamaluru' },
  179 |   ]
  180 | 
  181 |   for (const proj of PROJECTS) {
  182 |     test(`4.${PROJECTS.indexOf(proj)+1} ${proj.name} page loads`, async ({ page }) => {
  183 |       await page.goto(`${BASE}/project/${proj.id}`)
  184 |       await expect(page.locator(`text=${proj.name}`).first()).toBeVisible()
  185 |     })
  186 | 
  187 |     test(`4.${PROJECTS.indexOf(proj)+5} ${proj.name} has project tabs`, async ({ page }) => {
  188 |       await page.goto(`${BASE}/project/${proj.id}`)
  189 |       await expect(page.locator('text=Home, text=హోమ్, [class*="tab"]').first()).toBeVisible()
  190 |     })
  191 |   }
  192 | 
  193 |   test('4.9 Anjana Paradise pricing visible', async ({ page }) => {
  194 |     await page.goto(`${BASE}/project/anjana`)
  195 |     // Click Overview tab
  196 |     await page.locator('text=Overview, text=వివరణ').first().click()
  197 |     await page.waitForTimeout(500)
  198 |     await expect(page.locator('text=PLOT PRICING, text=ప్లాట్ ధరలు').first()).toBeVisible()
  199 |   })
  200 | 
  201 |   test('4.10 Anjana amenities tab works', async ({ page }) => {
  202 |     await page.goto(`${BASE}/project/anjana`)
  203 |     await page.locator('text=Amenities, text=సౌకర్యాలు').first().click()
  204 |     await page.waitForTimeout(500)
  205 |     await expect(page.locator('[class*="amGrid"], [class*="amItem"]').first()).toBeVisible()
  206 |   })
  207 | 
  208 |   test('4.11 Project page EN→TE translation works', async ({ page }) => {
  209 |     await page.goto(`${BASE}/project/anjana`)
  210 |     await switchToTelugu(page)
  211 |     await page.waitForTimeout(500)
  212 |     const header = await page.locator('nav, header').first().textContent()
  213 |     expect(header).toMatch(/[\u0C00-\u0C7F]/)
  214 |   })
  215 | 
  216 |   test('4.12 Back to Home button works', async ({ page }) => {
  217 |     await page.goto(`${BASE}/project/anjana`)
  218 |     await page.locator('text=Back to Home, text=హోమ్‌కు తిరిగి').first().click()
  219 |     await expect(page).toHaveURL(BASE + '/')
  220 |   })
  221 | })
  222 | 
  223 | // ══════════════════════════════════════════════════════════════════════════════
  224 | // SUITE 5 — Navigation
  225 | // ══════════════════════════════════════════════════════════════════════════════
  226 | test.describe('5. Navigation', () => {
  227 |   test('5.1 Portfolio dropdown opens on click', async ({ page }) => {
  228 |     await page.goto(BASE)
  229 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  230 |     await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  231 |   })
  232 | 
  233 |   test('5.2 Clicking Anjana from dropdown navigates to project page', async ({ page }) => {
  234 |     await page.goto(BASE)
  235 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  236 |     await page.locator('[class*="dropCard"]:has-text("Anjana")').first().click()
  237 |     await expect(page).toHaveURL(/\/project\/anjana/)
  238 |   })
  239 | 
  240 |   test('5.3 View All Projects link works', async ({ page }) => {
  241 |     await page.goto(BASE)
  242 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  243 |     await page.locator('text=View All Projects').first().click()
  244 |     await expect(page).toHaveURL(/\/#portfolio|\/portfolio|\//)
  245 |   })
  246 | 
  247 |   test('5.4 404 page shows for unknown route', async ({ page }) => {
  248 |     const res = await page.goto(`${BASE}/unknown-page-xyz`)
  249 |     await expect(page.locator('text=404, text=Page Not Found').first()).toBeVisible()
  250 |   })
```