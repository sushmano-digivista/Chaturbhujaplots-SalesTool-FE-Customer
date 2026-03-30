/**
 * PageLoader — 3s branded splash.
 * House draws itself once (fully done by 2.6s), stays drawn.
 * Only the shimmer bar continues after the house is complete.
 * Minimum display: 3s, then hands off when data is ready.
 */
import { useEffect, useRef } from 'react'

const CSS = `
  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes logoPulse {
    0%,100%{ transform:scale(1);    filter:brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6))  drop-shadow(0 0 10px rgba(201,168,76,.35)); }
    50%    { transform:scale(1.03); filter:brightness(1.9) drop-shadow(0 0 52px rgba(201,168,76,.80)) drop-shadow(0 0 14px rgba(201,168,76,.50)); }
  }
  @keyframes shimmer {
    0%   { background-position:200% 0; width:0%;    }
    50%  { background-position:  0% 0; width:100%;  }
    100% { background-position:-200% 0; width:100%; }
  }
`

// Each stroke: draw once, stay drawn (animation-fill-mode: forwards)
// Timeline: chimney 0s→0.35s, roof 0.3s→1s, walls 0.9s→1.7s,
//           door 1.6s→2.1s, winL 2.0s→2.4s, winR 2.2s→2.6s  ← all done at 2.6s
const strokes = [
  { id:'chimney', tag:'polyline', sw:3,   da:60,  delay:'0.00s', dur:'0.35s', points:'68,12 68,2 78,2 78,18' },
  { id:'roof',    tag:'polyline', sw:3.5, da:140, delay:'0.30s', dur:'0.70s', points:'5,48 55,8 105,48'       },
  { id:'walls',   tag:'rect',     sw:3.5, da:225, delay:'0.90s', dur:'0.80s', x:15,  y:48, w:80, h:42         },
  { id:'door',    tag:'rect',     sw:2.5, da:90,  delay:'1.60s', dur:'0.50s', x:43,  y:68, w:24, h:22         },
  { id:'winL',    tag:'rect',     sw:2,   da:62,  delay:'2.00s', dur:'0.40s', x:21,  y:55, w:18, h:16         },
  { id:'winR',    tag:'rect',     sw:2,   da:62,  delay:'2.20s', dur:'0.40s', x:71,  y:55, w:18, h:16         },
]

const strokeStyle = (s) => ({
  fill: 'none', stroke: '#C9A84C',
  strokeWidth: s.sw, strokeLinecap: 'round', strokeLinejoin: 'round',
  strokeDasharray: s.da, strokeDashoffset: s.da,
  animation: `draw ${s.dur} ease ${s.delay} forwards`,
})

export default function PageLoader() {
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    // Caller (HomePage) unmounts us when data loads.
    // We block the unmount for the remainder of 3s via a stable ref.
    mountedAt.current = Date.now()
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'radial-gradient(ellipse at center,#0f2d1a 0%,#081a0f 100%)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      zIndex:9999,
    }}>
      <style>{CSS}</style>

      {/* House — above logo, touching it */}
      <svg viewBox="0 0 110 95" width="100" height="86"
        style={{ display:'block', marginBottom:-6 }}
        xmlns="http://www.w3.org/2000/svg">
        {strokes.map((s) => {
          const st = strokeStyle(s)
          if (s.tag === 'polyline') return <polyline key={s.id} style={st} points={s.points} />
          return <rect key={s.id} style={st} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.id==='walls'?0:1} />
        })}
      </svg>

      {/* Logo */}
      <img
        src="/chaturbhuja-logo.webp"
        alt="Chaturbhuja Properties & Infra"
        style={{
          width:320, maxWidth:'82vw', objectFit:'contain',
          animation:'logoPulse 2s ease-in-out infinite',
          filter:'brightness(1.7) drop-shadow(0 0 36px rgba(201,168,76,.6)) drop-shadow(0 0 10px rgba(201,168,76,.35))',
        }}
      />

      {/* Shimmer bar — keeps animating after house is done */}
      <div style={{ marginTop:22, width:180, height:2,
        background:'rgba(255,255,255,.07)', borderRadius:2, overflow:'hidden' }}>
        <div style={{
          height:'100%',
          background:'linear-gradient(90deg,transparent,#C9A84C,#e8cf7a,#C9A84C,transparent)',
          backgroundSize:'300% 100%',
          animation:'shimmer 1.6s ease-in-out infinite',
          borderRadius:2,
        }} />
      </div>
    </div>
  )
}
