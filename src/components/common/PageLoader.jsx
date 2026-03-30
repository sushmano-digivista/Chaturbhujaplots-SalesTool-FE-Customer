/**
 * PageLoader — branded full-screen splash shown while React fetches initial data.
 * Shows the Chaturbhuja logo + an animated house that draws itself stroke by stroke.
 */
export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #0f2d1a 0%, #081a0f 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      {/* Logo — larger, brighter */}
      <img
        src="/chaturbhuja-logo.webp"
        alt="Chaturbhuja Properties & Infra"
        style={{
          width: 320, maxWidth: '82vw',
          objectFit: 'contain',
          animation: 'logoPulse 2s ease-in-out infinite',
          filter: 'brightness(1.6) drop-shadow(0 0 32px rgba(201,168,76,0.55)) drop-shadow(0 0 8px rgba(201,168,76,0.3))',
        }}
      />

      {/* Animated house — draws itself */}
      <svg viewBox="0 0 110 95" width="90" height="78"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: 24, opacity: 0.92 }}>
        {/* Chimney */}
        <polyline points="68,12 68,2 78,2 78,18"
          fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: 'draw 0.4s ease forwards 0.1s' }} />
        {/* Roof */}
        <polyline points="5,48 55,8 105,48"
          fill="none" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 140, strokeDashoffset: 140, animation: 'draw 0.9s ease forwards 0.4s' }} />
        {/* Walls */}
        <rect x="15" y="48" width="80" height="42"
          fill="none" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round"
          style={{ strokeDasharray: 225, strokeDashoffset: 225, animation: 'draw 1s ease forwards 1.1s' }} />
        {/* Door */}
        <rect x="43" y="68" width="24" height="22" rx="1"
          fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 90, strokeDashoffset: 90, animation: 'draw 0.65s ease forwards 1.9s' }} />
        {/* Window left */}
        <rect x="21" y="55" width="18" height="16" rx="1"
          fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
          style={{ strokeDasharray: 62, strokeDashoffset: 62, animation: 'draw 0.5s ease forwards 2.35s' }} />
        {/* Window right */}
        <rect x="71" y="55" width="18" height="16" rx="1"
          fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
          style={{ strokeDasharray: 62, strokeDashoffset: 62, animation: 'draw 0.5s ease forwards 2.6s' }} />
      </svg>

      {/* Gold shimmer bar */}
      <div style={{ marginTop: 28, width: 180, height: 2,
        background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #C9A84C, #e8cf7a, #C9A84C, transparent)',
          backgroundSize: '300% 100%',
          animation: 'shimmer 1.6s ease-in-out infinite',
          borderRadius: 2,
        }} />
      </div>

      <style>{`
        @keyframes logoPulse {
          0%,100% { transform:scale(1);    filter:brightness(1.6) drop-shadow(0 0 32px rgba(201,168,76,.55)) drop-shadow(0 0 8px rgba(201,168,76,.3)); }
          50%      { transform:scale(1.03); filter:brightness(1.8) drop-shadow(0 0 48px rgba(201,168,76,.75)) drop-shadow(0 0 12px rgba(201,168,76,.5)); }
        }
        @keyframes draw    { to { stroke-dashoffset: 0; } }
        @keyframes shimmer {
          0%   { background-position:200% 0; width:0%;   }
          50%  { background-position:  0% 0; width:100%; }
          100% { background-position:-200% 0; width:100%; }
        }
      `}</style>
    </div>
  )
}
