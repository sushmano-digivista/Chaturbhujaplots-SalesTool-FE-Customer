/**
 * PageLoader — Real estate logo style splash screen.
 * Gold arc draws first, then buildings left→right in silhouette,
 * then roofs fill gold, walls fill dark (logo effect).
 */
import { useEffect, useState } from 'react'

const CSS = `
  .hp { fill:transparent; stroke:#d4c4a0; stroke-linecap:round; stroke-linejoin:round; }
  #h-arc { stroke:#C9A84C; stroke-width:3.5; fill:none; stroke-dasharray:285; stroke-dashoffset:285; animation:draw .75s ease .00s forwards; }
  #h-cr  { stroke-width:2.5; stroke-dasharray:123; stroke-dashoffset:123; animation:draw .28s ease .65s forwards,fillRF .5s ease 2.5s forwards; }
  #h-lr  { stroke-width:2.5; stroke-dasharray:99;  stroke-dashoffset:99;  animation:draw .22s ease 1.10s forwards,fillRF .5s ease 2.5s forwards; }
  #h-rr  { stroke-width:2.5; stroke-dasharray:110; stroke-dashoffset:110; animation:draw .25s ease 1.38s forwards,fillRF .5s ease 2.5s forwards; }
  #h-flr { stroke-width:2;   stroke-dasharray:52;  stroke-dashoffset:52;  animation:draw .14s ease 1.76s forwards,fillRF .5s ease 2.5s forwards; }
  #h-frr { stroke-width:2;   stroke-dasharray:52;  stroke-dashoffset:52;  animation:draw .14s ease 1.80s forwards,fillRF .5s ease 2.5s forwards; }
  #h-clc { stroke-width:2;   stroke-dasharray:90;  stroke-dashoffset:90;  animation:draw .18s ease .88s forwards,fillWL .5s ease 2.5s forwards; }
  #h-crc { stroke-width:2;   stroke-dasharray:62;  stroke-dashoffset:62;  animation:draw .14s ease .96s forwards,fillWL .5s ease 2.5s forwards; }
  #h-lc  { stroke-width:2;   stroke-dasharray:74;  stroke-dashoffset:74;  animation:draw .16s ease 1.26s forwards,fillWL .5s ease 2.5s forwards; }
  #h-rc  { stroke-width:2;   stroke-dasharray:78;  stroke-dashoffset:78;  animation:draw .16s ease 1.57s forwards,fillWL .5s ease 2.5s forwards; }
  #h-cb  { stroke-width:2.5; stroke-dasharray:308; stroke-dashoffset:308; animation:draw .38s ease 1.00s forwards,fillWL .5s ease 2.5s forwards; }
  #h-lb  { stroke-width:2.5; stroke-dasharray:200; stroke-dashoffset:200; animation:draw .28s ease 1.32s forwards,fillWL .5s ease 2.5s forwards; }
  #h-rb  { stroke-width:2.5; stroke-dasharray:244; stroke-dashoffset:244; animation:draw .32s ease 1.60s forwards,fillWL .5s ease 2.5s forwards; }
  #h-flb { stroke-width:2;   stroke-dasharray:102; stroke-dashoffset:102; animation:draw .16s ease 1.78s forwards,fillWL .5s ease 2.5s forwards; }
  #h-frb { stroke-width:2;   stroke-dasharray:96;  stroke-dashoffset:96;  animation:draw .16s ease 1.83s forwards,fillWL .5s ease 2.5s forwards; }
  .h-cw  { stroke-width:1.5; stroke-dasharray:62;  stroke-dashoffset:62;  animation:draw .13s ease 2.00s forwards,fillWN .5s ease 2.5s forwards; }
  .h-lw  { stroke-width:1.5; stroke-dasharray:52;  stroke-dashoffset:52;  animation:draw .11s ease 2.04s forwards,fillWN .5s ease 2.5s forwards; }
  .h-rw  { stroke-width:1.5; stroke-dasharray:52;  stroke-dashoffset:52;  animation:draw .11s ease 2.07s forwards,fillWN .5s ease 2.5s forwards; }
  .h-sw  { stroke-width:1.5; stroke-dasharray:36;  stroke-dashoffset:36;  animation:draw .09s ease 2.11s forwards,fillWN .5s ease 2.5s forwards; }
  #h-cd  { stroke-width:1.5; stroke-dasharray:94;  stroke-dashoffset:94;  animation:draw .11s ease 2.15s forwards,fillWN .5s ease 2.5s forwards; }
  #h-ld  { stroke-width:1.5; stroke-dasharray:68;  stroke-dashoffset:68;  animation:draw .09s ease 2.18s forwards,fillWN .5s ease 2.5s forwards; }
  #h-gnd { stroke:#C9A84C; stroke-width:2.5; fill:none; stroke-linecap:round; stroke-dasharray:280; stroke-dashoffset:280; animation:draw .22s ease 2.22s forwards; }

  @keyframes draw   { to { stroke-dashoffset:0 } }
  @keyframes fillRF { to { fill:#C9A84C } }
  @keyframes fillWL { to { fill:#243c2a } }
  @keyframes fillWN { to { fill:#0d1e12 } }
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
  return (
    <div style={{ position:'fixed', inset:0,
      background:'radial-gradient(ellipse at center,#0f2d1a 0%,#081a0f 100%)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      <style>{CSS}</style>

      <svg viewBox="0 0 280 195" width="240" style={{maxWidth:'88vw', display:'block', marginBottom:2}}
        xmlns="http://www.w3.org/2000/svg">
        <path id="h-arc" d="M 32,131 A 115,115 0 0,1 248,131"/>
        <polyline id="h-flr" className="hp" points="4,162 19,142 34,162"/>
        <rect     id="h-flb" className="hp" x="5"   y="161" width="28" height="23"/>
        <rect               className="hp h-sw" x="10"  y="168" width="9"  height="9"/>
        <rect     id="h-lc"  className="hp" x="37"  y="112" width="10" height="30"/>
        <polyline id="h-lr"  className="hp" points="20,148 52,112 84,148"/>
        <rect     id="h-lb"  className="hp" x="21"  y="147" width="62" height="37"/>
        <rect               className="hp h-lw" x="30"  y="155" width="13" height="13"/>
        <rect               className="hp h-lw" x="50"  y="155" width="13" height="13"/>
        <rect     id="h-ld"  className="hp" x="58"  y="163" width="14" height="21"/>
        <rect     id="h-clc" className="hp" x="112" y="65"  width="10" height="36"/>
        <rect     id="h-crc" className="hp" x="150" y="80"  width="9"  height="22"/>
        <polyline id="h-cr"  className="hp" points="90,110 130,65 170,110"/>
        <rect     id="h-cb"  className="hp" x="91"  y="109" width="78" height="75"/>
        <rect               className="hp h-cw" x="100" y="118" width="16" height="15"/>
        <rect               className="hp h-cw" x="122" y="118" width="16" height="15"/>
        <rect               className="hp h-cw" x="144" y="118" width="16" height="15"/>
        <rect               className="hp h-cw" x="100" y="140" width="16" height="15"/>
        <rect               className="hp h-cw" x="144" y="140" width="16" height="15"/>
        <rect     id="h-cd"  className="hp" x="120" y="158" width="20" height="26"/>
        <rect     id="h-rc"  className="hp" x="233" y="100" width="9"  height="32"/>
        <polyline id="h-rr"  className="hp" points="172,138 210,100 248,138"/>
        <rect     id="h-rb"  className="hp" x="173" y="137" width="74" height="47"/>
        <rect               className="hp h-rw" x="182" y="146" width="13" height="13"/>
        <rect               className="hp h-rw" x="200" y="146" width="13" height="13"/>
        <rect               className="hp h-rw" x="182" y="164" width="13" height="13"/>
        <rect               className="hp h-rw" x="200" y="164" width="13" height="13"/>
        <polyline id="h-frr" className="hp" points="244,166 258,148 272,166"/>
        <rect     id="h-frb" className="hp" x="245" y="165" width="26" height="19"/>
        <rect               className="hp h-sw" x="252" y="171" width="8"  height="8"/>
        <path id="h-gnd" d="M 3,188 C 70,194 210,194 277,188"/>
      </svg>

      <img src="/chaturbhuja-logo.webp" alt="Chaturbhuja Properties & Infra"
        style={{ width:300, maxWidth:'80vw', objectFit:'contain',
          animation:'logoPulse 2s ease-in-out infinite',
          filter:'brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6)) drop-shadow(0 0 10px rgba(201,168,76,.35))' }}/>

      <div style={{marginTop:16, width:180, height:2, background:'rgba(255,255,255,.07)', borderRadius:2, overflow:'hidden'}}>
        <div style={{ height:'100%',
          background:'linear-gradient(90deg,transparent,#C9A84C,#e8cf7a,#C9A84C,transparent)',
          backgroundSize:'300% 100%', animation:'shimmer 1.6s ease-in-out infinite', borderRadius:2 }}/>
      </div>
    </div>
  )
}
