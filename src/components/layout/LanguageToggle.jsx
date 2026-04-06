import { useLanguage } from '@/context/LanguageContext'
import styles from './LanguageToggle.module.css'

/**
 * LanguageToggle — segmented pill with sliding gold indicator.
 * EN / తె — switches global language via LanguageContext.
 */
export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  const isEnglish = language === 'en'

  return (
    <button
      className={styles.toggle}
      onClick={toggleLanguage}
      aria-label={isEnglish ? 'Switch to Telugu' : 'Switch to English'}
      title={isEnglish ? 'తెలుగులో చూడండి' : 'View in English'}
    >
      {/* Animated sliding gold pill */}
      <span
        className={styles.slider}
        style={{ transform: isEnglish ? 'translateX(0%)' : 'translateX(100%)' }}
      />
      {/* EN segment */}
      <span className={`${styles.seg} ${isEnglish ? styles.segActive : styles.segInactive}`}>
        EN
      </span>
      {/* తె segment */}
      <span className={`${styles.seg} ${!isEnglish ? styles.segActive : styles.segInactive}`}>
        తె
      </span>
    </button>
  )
}
