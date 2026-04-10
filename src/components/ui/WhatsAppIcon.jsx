// WhatsApp brand button — circular green pill with white logo. Renders as a clickable <button>.
export default function WhatsAppIcon({ size = 44, onClick, title = 'WhatsApp', className = '' }) {
  const Inner = (
    <svg xmlns="http://www.w3.org/2000/svg" width={size * 0.6} height={size * 0.6}
         viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.91 2.722.91.33 0 .602-.03.854-.115.545-.2 1.17-.945 1.318-1.504.043-.157.057-.33.057-.487 0-.387-.015-.43-.315-.6-.214-.106-2.378-1.247-2.4-1.247zM16.14 25.5c-1.685 0-3.43-.502-4.915-1.344l-3.43 1.072 1.086-3.312a9.29 9.29 0 0 1-1.53-5.125c0-5.137 4.188-9.325 9.326-9.325 4.92 0 9.13 4.187 9.13 9.325s-4.21 9.325-9.13 9.325zm0-20.5C9.808 5 4.634 10.17 4.634 16.5c0 2.072.56 4.102 1.616 5.884L4 29l6.78-2.181a11.58 11.58 0 0 0 5.36 1.33c6.332 0 11.506-5.17 11.506-11.5S22.472 5 16.14 5z" />
    </svg>
  )
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#25D366',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,211,102,0.45)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  }
  return (
    <button type="button" onClick={onClick} aria-label={title} title={title}
      className={className} style={style}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
      {Inner}
    </button>
  )
}
