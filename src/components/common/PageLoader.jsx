/**
 * PageLoader — branded full-screen splash shown while React fetches initial data.
 * Matches the native HTML splash in index.html so the transition is seamless.
 */
export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0b2415',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <img
        src="/chaturbhuja-logo.webp"
        alt="Chaturbhuja Properties & Infra"
        style={{
          width: 260, maxWidth: '75vw',
          objectFit: 'contain',
          animation: 'splashPulse 1.8s ease-in-out infinite',
          filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.4))',
        }}
      />
      <div style={{
        marginTop: 20,
        fontFamily: 'Georgia, serif',
        fontSize: 13,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.8)',
        animation: 'splashFadeIn 1.2s ease forwards',
        opacity: 0,
      }}>
        Properties &amp; Infra
      </div>
      <div style={{
        marginTop: 32,
        width: 160, height: 2,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #C9A84C, #e2bf64, #C9A84C)',
          backgroundSize: '200% 100%',
          animation: 'splashShimmer 1.4s ease-in-out infinite',
          borderRadius: 2,
        }} />
      </div>
      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1);    opacity: 1;    }
          50%       { transform: scale(1.04); opacity: 0.88; }
        }
        @keyframes splashFadeIn { to { opacity: 1; } }
        @keyframes splashShimmer {
          0%   { background-position: 200% 0; width: 0%;    }
          50%  { background-position:   0% 0; width: 100%;  }
          100% { background-position:-200% 0; width: 100%;  }
        }
      `}</style>
    </div>
  )
}
