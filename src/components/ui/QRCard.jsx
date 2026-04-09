import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './QRCard.module.css'

export default function QRCard({ waNumber, title, subtitle, size = 160 }) {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const svgRef = useRef(null)

  const waUrl = 'https://wa.me/' + waNumber

  const downloadQR = () => {
    const svg = svgRef.current && svgRef.current.querySelector('svg')
    if (!svg) return
    const padding = 32
    const qrSize = size * 2
    const canvas = document.createElement('canvas')
    canvas.width  = qrSize + padding * 2
    canvas.height = qrSize + padding * 2 + 80
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0a1e12'
    ctx.fillRect(0, 0, canvas.width, 44)
    ctx.fillStyle = '#C9A84C'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Chaturbhuja Properties & Infra', canvas.width / 2, 28)
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = function() {
      ctx.drawImage(img, padding, 52, qrSize, qrSize)
      ctx.fillStyle = '#444'
      ctx.font = '13px sans-serif'
      ctx.fillText('Scan to chat on WhatsApp', canvas.width / 2, qrSize + padding + 64)
      ctx.fillStyle = '#0a1e12'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText('www.chaturbhujaplots.in', canvas.width / 2, qrSize + padding + 82)
      const link = document.createElement('a')
      link.download = 'chaturbhuja-whatsapp-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className={styles.card}>
      <div className={styles.qrWrap} ref={svgRef}>
        <QRCodeSVG
          value={waUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#0a1e12"
          level="M"
          includeMargin={true}
        />
      </div>
      <div className={styles.waIcon}>💬</div>
      <h4 className={styles.title}>{title || (isTe ? 'వాట్సాప్ QR' : 'WhatsApp QR')}</h4>
      <p className={styles.subtitle}>{subtitle || (isTe ? 'స్కాన్ చేసి మాతో చాట్ చేయండి' : 'Scan to chat with us instantly')}</p>
      <button className={styles.downloadBtn} onClick={downloadQR}>
        ⬇ {isTe ? 'QR డౌన్‌లోడ్' : 'Download QR'}
      </button>
    </div>
  )
}
