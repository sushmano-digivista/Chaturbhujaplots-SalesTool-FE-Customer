/**
 * PageLoader — Duplex house splash (redesigned to match reference image).
 * Left section: tall 2-story cream/beige. Right section: lower dark brown.
 * Draw phase: 0→2.5s. Paint phase: 2.5→3.0s. Minimum display: 3.5s.
 */
import { useEffect, useState } from 'react'

const CSS = `
  .hp { fill:transparent; stroke:#2a1008; stroke-linecap:round; stroke-linejoin:round; }
  .hl { fill:none; stroke:#2a1008; stroke-linecap:round; }

  #h-lw  { stroke-width:2.5; stroke-dasharray:615; stroke-dashoffset:615; animation:draw .70s ease .00s forwards,fillLW .50s ease 2.5s forwards; }
  #h-rw  { stroke-width:2.5; stroke-dasharray:480; stroke-dashoffset:480; animation:draw .60s ease .60s forwards,fillRW .50s ease 2.5s forwards; }
  #h-lr  { stroke-width:3;   stroke-dasharray:348; stroke-dashoffset:348; animation:draw .30s ease 1.05s forwards,fillDF .50s ease 2.5s forwards; }
  #h-rr  { stroke-width:3;   stroke-dasharray:282; stroke-dashoffset:282; animation:draw .28s ease 1.25s forwards,fillDF .50s ease 2.5s forwards; }
  #h-lfw { stroke-width:2;   stroke-dasharray:254; stroke-dashoffset:254; animation:draw .24s ease 1.45s forwards,fillWN .50s ease 2.5s forwards; }
  #h-llf { stroke-width:2;   stroke-dasharray:260; stroke-dashoffset:260; animation:draw .24s ease 1.55s forwards,fillLA .50s ease 2.5s forwards; }
  #h-lgw { stroke-width:2;   stroke-dasharray:402; stroke-dashoffset:402; animation:draw .26s ease 1.72s forwards,fillWN .50s ease 2.5s forwards; }
  #h-ruw { stroke-width:2;   stroke-dasharray:302; stroke-dashoffset:302; animation:draw .25s ease 1.86s forwards,fillWN .50s ease 2.5s forwards; }
  #h-rbl { stroke-width:3;   stroke-dasharray:256; stroke-dashoffset:256; animation:draw .22s ease 1.96s forwards,fillDF .50s ease 2.5s forwards; }
  #h-rgw { stroke-width:2;   stroke-dasharray:256; stroke-dashoffset:256; animation:draw .22s ease 2.06s forwards,fillWN .50s ease 2.5s forwards; }
  #h-rep { stroke-width:2;   stroke-dasharray:162; stroke-dashoffset:162; animation:draw .16s ease 2.16s forwards,fillEP .50s ease 2.5s forwards; }
  .h-lv  { stroke-width:1;   stroke-dasharray:65;  stroke-dashoffset:65;  animation:draw .14s ease 2.24s forwards; }
  .h-lh  { stroke-width:1;   stroke-dasharray:67;  stroke-dashoffset:67;  animation:draw .12s ease 2.32s forwards; }
  .h-ev  { stroke-width:1.5; stroke-dasharray:56;  stroke-dashoffset:56;  animation:draw .12s ease 2.28s forwards; }
  .h-bb  { stroke-width:1.5; stroke-dasharray:7;   stroke-dashoffset:7;   animation:draw .07s ease 2.36s forwards; }
  #h-s1  { stroke-width:1.5; stroke-dasharray:82;  stroke-dashoffset:82;  animation:draw .10s ease 2.36s forwards,fillST .50s ease 2.5s forwards; }
  #h-s2  { stroke-width:1.5; stroke-dasharray:72;  stroke-dashoffset:72;  animation:draw .09s ease 2.41s forwards,fillST .50s ease 2.5s forwards; }
  #h-s3  { stroke-width:1.5; stroke-dasharray:62;  stroke-dashoffset:62;  animation:draw .08s ease 2.45s forwards,fillST .50s ease 2.5s forwards; }
  #h-gr  { stroke-width:1.5; stroke-dasharray:655; stroke-dashoffset:655; animation:draw .20s ease 2.42s forwards,fillGR .50s ease 2.5s forwards; }
  #h-bl  { stroke-width:1.5; stroke-dasharray:170; stroke-dashoffset:170; animation:draw .16s ease 2.48s forwards,fillBU .50s ease 2.5s forwards; }
  #h-bm  { stroke-width:1.5; stroke-dasharray:130; stroke-dashoffset:130; animation:draw .13s ease 2.52s forwards,fillBU .50s ease 2.5s forwards; }
  #h-bri { stroke-width:1.5; stroke-dasharray:130; stroke-dashoffset:130; animation:draw .13s ease 2.55s forwards,fillBU .50s ease 2.5s forwards; }

  @keyframes draw   { to { stroke-dashoffset:0 } }
  @keyframes fillLW { to { fill:#f2ede0 } }
  @keyframes fillRW { to { fill:#7a3e22 } }
  @keyframes fillDF { to { fill:#341608 } }
  @keyframes fillWN { to { fill:#9ac0d8 } }
  @keyframes fillLA { to { fill:#c08040 } }
  @keyframes fillEP { to { fill:#47200c } }
  @keyframes fillST { to { fill:#d0c4b0 } }
  @keyframes fillGR { to { fill:#4a9a22 } }
  @keyframes fillBU { to { fill:#2a7010 } }
  @keyframes logoPulse {
    0%,100%{ transform:scale(1);    filter:brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6))  drop-shadow(0 0 10px rgba(201,168,76,.35)); }
    50%    { transform:scale(1.03); filter:brightness(1.9) drop-shadow(0 0 52px rgba(201,168,76,.80)) drop-shadow(0 0 14px rgba(201,168,76,.50)); }
  }
  @keyframes shimmer {
    0%   { background-position:200% 0; width:0%;   }
    50%  { background-position:  0% 0; width:100%; }
    100% { background-position:-200% 0; width:100%; }
  }
`

export default function PageLoader() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 3500); return () => clearTimeout(t) }, [])
  if (gone) return null

  const lvX = [36, 49, 62, 75]
  const lhY = [69, 86, 103]
  const evX = [254, 260, 266, 272]
  const bbX = [171,179,187,195,203,211,219,227,235,243,251,259,267,275]

  return (
    <div style={{ position:'fixed', inset:0,
      background:'radial-gradient(ellipse at center,#0f2d1a 0%,#081a0f 100%)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      <style>{CSS}</style>

      {/* Duplex house SVG */}
      <svg viewBox="0 0 300 225" width="230" style={{maxWidth:'85vw', display:'block', marginBottom:-2}}
        xmlns="http://www.w3.org/2000/svg">

        {/* Grass + bushes (bottom layer) */}
        <rect id="h-gr"  className="hp" x="0"   y="200" width="300" height="25" rx="3"/>
        <ellipse id="h-bl"  className="hp" cx="55"  cy="206" rx="35" ry="12"/>
        <ellipse id="h-bm"  className="hp" cx="162" cy="206" rx="26" ry="11"/>
        <ellipse id="h-bri" className="hp" cx="222" cy="206" rx="26" ry="11"/>

        {/* Main walls */}
        <rect id="h-lw" className="hp" x="15"  y="45"  width="150" height="155"/>
        <rect id="h-rw" className="hp" x="163" y="82"  width="120" height="118"/>

        {/* Roof overhangs */}
        <rect id="h-lr" className="hp" x="10"  y="33"  width="158" height="14"/>
        <rect id="h-rr" className="hp" x="158" y="70"  width="125" height="14"/>

        {/* Left windows + lattice */}
        <rect id="h-lfw" className="hp" x="95"  y="52"  width="62"  height="63"/>
        <rect id="h-llf" className="hp" x="23"  y="52"  width="65"  height="63"/>
        <rect id="h-lgw" className="hp" x="23"  y="127" width="134" height="65"/>

        {/* Right windows + balcony + entry */}
        <rect id="h-ruw" className="hp" x="170" y="89"  width="107" height="42"/>
        <rect id="h-rbl" className="hp" x="163" y="129" width="120" height="6"/>
        <rect id="h-rgw" className="hp" x="170" y="138" width="72"  height="54"/>
        <rect id="h-rep" className="hp" x="249" y="138" width="25"  height="54"/>

        {/* Lattice verticals */}
        {lvX.map(x => <line key={x} className="hl h-lv" x1={x} y1="52" x2={x} y2="115"/>)}
        {/* Lattice horizontals */}
        {lhY.map(y => <line key={y} className="hl h-lh" x1="23" y1={y} x2="88" y2={y}/>)}
        {/* Entry stripes */}
        {evX.map(x => <line key={x} className="hl h-ev" x1={x} y1="138" x2={x} y2="192"/>)}
        {/* Balcony bars */}
        {bbX.map(x => <line key={x} className="hl h-bb" x1={x} y1="129" x2={x} y2="135"/>)}

        {/* Steps */}
        <rect id="h-s1" className="hp" x="256" y="163" width="30" height="10"/>
        <rect id="h-s2" className="hp" x="261" y="173" width="25" height="10"/>
        <rect id="h-s3" className="hp" x="266" y="183" width="20" height="10"/>
      </svg>

      {/* Logo */}
      <img src="/chaturbhuja-logo.webp" alt="Chaturbhuja Properties & Infra"
        style={{ width:300, maxWidth:'80vw', objectFit:'contain',
          animation:'logoPulse 2s ease-in-out infinite',
          filter:'brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6)) drop-shadow(0 0 10px rgba(201,168,76,.35))' }}/>

      {/* Shimmer bar */}
      <div style={{marginTop:18, width:180, height:2, background:'rgba(255,255,255,.07)', borderRadius:2, overflow:'hidden'}}>
        <div style={{ height:'100%',
          background:'linear-gradient(90deg,transparent,#C9A84C,#e8cf7a,#C9A84C,transparent)',
          backgroundSize:'300% 100%', animation:'shimmer 1.6s ease-in-out infinite', borderRadius:2 }}/>
      </div>
    </div>
  )
}
