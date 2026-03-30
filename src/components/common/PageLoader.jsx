/**
 * PageLoader — branded splash: animated house (above) + logo (below), 5s loop.
 * House draws itself stroke-by-stroke then holds, resets and repeats.
 */
import { useEffect, useState } from 'react'

export default function PageLoader() {
  // Enforce minimum display of 5s so one full house animation cycle is always seen
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(t)
  }, [])

  // CSS keyframes as a string — same timing as index.html native splash
  const css = `
    @keyframes hChimney { 0%,4%  {stroke-dashoffset:60}  12%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:60} }
    @keyframes hRoof    { 0%,12% {stroke-dashoffset:140} 30%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:140} }
    @keyframes hWalls   { 0%,28% {stroke-dashoffset:225} 50%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:225} }
    @keyframes hDoor    { 0%,46% {stroke-dashoffset:90}  59%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:90} }
    @keyframes hWinL    { 0%,55% {stroke-dashoffset:62}  65%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:62} }
    @keyframes hWinR    { 0%,62% {stroke-dashoffset:62}  72%{stroke-dashoffset:0}  90%{stroke-dashoffset:0}  95%,100%{stroke-dashoffset:62} }
    @keyframes logoPulse {
      0%,100%{ transform:scale(1);    filter:brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6)) drop-shadow(0 0 10px rgba(201,168,76,.35)); }
      50%    { transform:scale(1.03); filter:brightness(1.9) drop-shadow(0 0 52px rgba(201,168,76,.8)) drop-shadow(0 0 14px rgba(201,168,76,.5)); }
    }
    @keyframes shimmer {
      0%   { background-position:200% 0; width:0%;    }
      50%  { background-position:  0% 0; width:100%;  }
      100% { background-position:-200% 0; width:100%; }
    }
  `

  const strokeBase = {
    fill: 'none', stroke: '#C9A84C',
    strokeLinecap: 'round', strokeLinejoin: 'round',
  }

  const anim = (name, dasharray) => ({
    ...strokeBase,
    strokeDasharray: dasharray,
    strokeDashoffset: dasharray,
    animation: `${name} 5s linear infinite`,
  })

  if (ready) return null // hand off to actual content

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #0f2d1a 0%, #081a0f 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <style>{css}</style>

      {/* House — ABOVE logo, base touching logo top */}
      <svg viewBox="0 0 110 95" width="100" height="86"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', marginBottom: -6 }}>
        <polyline style={{ ...anim('hChimney', 60),  strokeWidth: 3   }} points="68,12 68,2 78,2 78,18" />
        <polyline style={{ ...anim('hRoof',    140), strokeWidth: 3.5 }} points="5,48 55,8 105,48" />
        <rect     style={{ ...anim('hWalls',   225), strokeWidth: 3.5 }} x="15" y="48" width="80" height="42" />
        <rect     style={{ ...anim('hDoor',    90),  strokeWidth: 2.5 }} x="43" y="68" width="24" height="22" rx="1" />
        <rect     style={{ ...anim('hWinL',    62),  strokeWidth: 2   }} x="21" y="55" width="18" height="16" rx="1" />
        <rect     style={{ ...anim('hWinR',    62),  strokeWidth: 2   }} x="71" y="55" width="18" height="16" rx="1" />
      </svg>

      {/* Logo — below the house */}
      <img
        src="/chaturbhuja-logo.webp"
        alt="Chaturbhuja Properties & Infra"
        style={{
          width: 320, maxWidth: '82vw',
          objectFit: 'contain',
          animation: 'logoPulse 2s ease-in-out infinite',
          filter: 'brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,0.6)) drop-shadow(0 0 10px rgba(201,168,76,0.35))',
        }}
      />

      {/* Shimmer bar */}
      <div style={{ marginTop: 22, width: 180, height: 2,
        background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #C9A84C, #e8cf7a, #C9A84C, transparent)',
          backgroundSize: '300% 100%',
          animation: 'shimmer 1.6s ease-in-out infinite',
          borderRadius: 2,
        }} />
      </div>
    </div>
  )
}
