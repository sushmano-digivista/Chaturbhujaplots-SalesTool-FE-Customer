/**
 * PageLoader — Duplex house draws itself stroke-by-stroke (2.5s),
 * then fills with colour (paint phase, 0.45s), then shimmer bar continues.
 * Minimum display: 3.5s so the full painted duplex is always visible.
 */
import { useEffect, useState } from 'react'

const CSS = `
  .hp { fill:transparent; stroke:#3d2010; stroke-linecap:round; stroke-linejoin:round; }
  .hl { fill:none; stroke:#5a3520; stroke-linecap:round; }

  #h-lw  { stroke-width:2.5; stroke-dasharray:556; stroke-dashoffset:556; animation:draw .65s ease .00s forwards,fillLW .45s ease 2.5s forwards; }
  #h-rw  { stroke-width:2.5; stroke-dasharray:466; stroke-dashoffset:466; animation:draw .60s ease .50s forwards,fillRW .45s ease 2.5s forwards; }
  #h-lr  { stroke-width:2.5; stroke-dasharray:338; stroke-dashoffset:338; animation:draw .28s ease .95s forwards,fillDF .45s ease 2.5s forwards; }
  #h-rr  { stroke-width:2.5; stroke-dasharray:286; stroke-dashoffset:286; animation:draw .25s ease 1.15s forwards,fillDF .45s ease 2.5s forwards; }
  #h-wgl { stroke-width:1.5; stroke-dasharray:274; stroke-dashoffset:274; animation:draw .25s ease 1.35s forwards,fillWN .45s ease 2.5s forwards; }
  #h-lf  { stroke-width:1.5; stroke-dasharray:228; stroke-dashoffset:228; animation:draw .22s ease 1.55s forwards,fillLA .45s ease 2.5s forwards; }
  #h-wul { stroke-width:1.5; stroke-dasharray:206; stroke-dashoffset:206; animation:draw .20s ease 1.72s forwards,fillWN .45s ease 2.5s forwards; }
  #h-wgr { stroke-width:1.5; stroke-dasharray:270; stroke-dashoffset:270; animation:draw .24s ease 1.86s forwards,fillWN .45s ease 2.5s forwards; }
  #h-ep  { stroke-width:1.5; stroke-dasharray:152; stroke-dashoffset:152; animation:draw .16s ease 2.02s forwards,fillEP .45s ease 2.5s forwards; }
  #h-wur { stroke-width:1.5; stroke-dasharray:170; stroke-dashoffset:170; animation:draw .16s ease 2.12s forwards,fillWN .45s ease 2.5s forwards; }
  .h-ev  { stroke-width:1;   stroke-dasharray:32;  stroke-dashoffset:32;  animation:draw .10s ease 2.18s forwards; }
  .h-lv  { stroke-width:1;   stroke-dasharray:47;  stroke-dashoffset:47;  animation:draw .14s ease 2.22s forwards; }
  .h-lh  { stroke-width:1;   stroke-dasharray:65;  stroke-dashoffset:65;  animation:draw .12s ease 2.30s forwards; }
  #h-bal { stroke-width:2.5; stroke-dasharray:250; stroke-dashoffset:250; animation:draw .22s ease 2.20s forwards,fillDF .45s ease 2.5s forwards; }
  .h-bb  { stroke-width:1.5; stroke-dasharray:5;   stroke-dashoffset:5;   animation:draw .07s ease 2.38s forwards; }
  #h-s1  { stroke-width:1.5; stroke-dasharray:86;  stroke-dashoffset:86;  animation:draw .10s ease 2.38s forwards,fillST .45s ease 2.5s forwards; }
  #h-s2  { stroke-width:1.5; stroke-dasharray:74;  stroke-dashoffset:74;  animation:draw .09s ease 2.43s forwards,fillST .45s ease 2.5s forwards; }
  #h-s3  { stroke-width:1.5; stroke-dasharray:62;  stroke-dashoffset:62;  animation:draw .08s ease 2.47s forwards,fillST .45s ease 2.5s forwards; }
  #h-gr  { stroke-width:1.5; stroke-dasharray:592; stroke-dashoffset:592; animation:draw .22s ease 2.45s forwards,fillGR .45s ease 2.5s forwards; }
  #h-bl  { stroke-width:1.5; stroke-dasharray:146; stroke-dashoffset:146; animation:draw .16s ease 2.52s forwards,fillBU .45s ease 2.5s forwards; }
  #h-bm  { stroke-width:1.5; stroke-dasharray:107; stroke-dashoffset:107; animation:draw .13s ease 2.56s forwards,fillBU .45s ease 2.5s forwards; }
  #h-bri { stroke-width:1.5; stroke-dasharray:113; stroke-dashoffset:113; animation:draw .14s ease 2.59s forwards,fillBU .45s ease 2.5s forwards; }

  @keyframes draw   { to { stroke-dashoffset:0 } }
  @keyframes fillLW { to { fill:#f0ebe0 } }
  @keyframes fillRW { to { fill:#8b5e3c } }
  @keyframes fillDF { to { fill:#3d2314 } }
  @keyframes fillWN { to { fill:#b8d4ec } }
  @keyframes fillLA { to { fill:#c4904a } }
  @keyframes fillEP { to { fill:#4a2810 } }
  @keyframes fillST { to { fill:#c8b8a8 } }
  @keyframes fillGR { to { fill:#5a9e3a } }
  @keyframes fillBU { to { fill:#3d7a20 } }
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

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'radial-gradient(ellipse at center,#0f2d1a 0%,#081a0f 100%)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      zIndex:9999,
    }}>
      <style>{CSS}</style>

      {/* ── Duplex house SVG — above logo ── */}
      <svg viewBox="0 0 280 196" width="220" style={{maxWidth:'82vw', display:'block', marginBottom:-4}}
        xmlns="http://www.w3.org/2000/svg">
        {/* Ground + plants */}
        <rect id="h-gr"  className="hp" x="0"   y="183" width="280" height="13" rx="2"/>
        <ellipse id="h-bl"  className="hp" cx="50"  cy="185" rx="30" ry="9"/>
        <ellipse id="h-bm"  className="hp" cx="145" cy="185" rx="22" ry="8"/>
        <ellipse id="h-bri" className="hp" cx="212" cy="185" rx="22" ry="9"/>
        {/* Main walls */}
        <rect id="h-lw" className="hp" x="10"  y="50"  width="145" height="133"/>
        <rect id="h-rw" className="hp" x="152" y="68"  width="118" height="115"/>
        {/* Roof overhangs */}
        <rect id="h-lr" className="hp" x="5"   y="37"  width="153" height="15"/>
        <rect id="h-rr" className="hp" x="147" y="55"  width="127" height="15"/>
        {/* Left windows + lattice */}
        <rect id="h-wgl" className="hp" x="18"  y="112" width="70" height="66"/>
        <rect id="h-lf"  className="hp" x="18"  y="57"  width="65" height="47"/>
        <rect id="h-wul" className="hp" x="91"  y="57"  width="55" height="47"/>
        {/* Right windows + entry */}
        <rect id="h-wgr" className="hp" x="158" y="110" width="67" height="68"/>
        <rect id="h-ep"  className="hp" x="158" y="74"  width="43" height="32"/>
        <rect id="h-wur" className="hp" x="205" y="74"  width="52" height="32"/>
        {/* Entry stripes */}
        {[165,172,179,186,193].map(x => <line key={x} className="hl h-ev" x1={x} y1="74" x2={x} y2="106"/>)}
        {/* Lattice verticals */}
        {[29,40,51,62,73].map(x => <line key={x} className="hl h-lv" x1={x} y1="57" x2={x} y2="104"/>)}
        {/* Lattice horizontals */}
        {[69,81,93].map(y => <line key={y} className="hl h-lh" x1="18" y1={y} x2="83" y2={y}/>)}
        {/* Balcony rail + bars */}
        <rect id="h-bal" className="hp" x="152" y="68" width="118" height="5"/>
        {[160,168,176,184,192,200,208,216,224,232,240,248,256,264].map(x => (
          <line key={x} className="hl h-bb" x1={x} y1="68" x2={x} y2="73"/>
        ))}
        {/* Steps */}
        <rect id="h-s1" className="hp" x="238" y="156" width="34" height="8"/>
        <rect id="h-s2" className="hp" x="244" y="164" width="28" height="8"/>
        <rect id="h-s3" className="hp" x="250" y="172" width="22" height="8"/>
      </svg>

      {/* Logo */}
      <img src="/chaturbhuja-logo.webp" alt="Chaturbhuja Properties & Infra"
        style={{
          width:320, maxWidth:'82vw', objectFit:'contain',
          animation:'logoPulse 2s ease-in-out infinite',
          filter:'brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6)) drop-shadow(0 0 10px rgba(201,168,76,.35))',
        }}
      />

      {/* Shimmer bar — continues after paint completes */}
      <div style={{marginTop:20, width:180, height:2, background:'rgba(255,255,255,.07)', borderRadius:2, overflow:'hidden'}}>
        <div style={{
          height:'100%',
          background:'linear-gradient(90deg,transparent,#C9A84C,#e8cf7a,#C9A84C,transparent)',
          backgroundSize:'300% 100%',
          animation:'shimmer 1.6s ease-in-out infinite',
          borderRadius:2,
        }}/>
      </div>
    </div>
  )
}
