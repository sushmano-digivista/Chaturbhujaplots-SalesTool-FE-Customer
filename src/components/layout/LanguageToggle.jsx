import { useLanguage } from '@/context/LanguageContext'
import styles from './LanguageToggle.module.css'

/**
 * LanguageToggle — pill-style EN ⇌ తె switch rendered inside the Navbar.
 * Reads / writes language via LanguageContext (persisted to localStorage).
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
      <span className={`${styles.option} ${isEnglish ? styles.active : ''}`}>EN</span>
      <span className={styles.divider}>|</span>
      <span className={`${styles.option} ${!isEnglish ? styles.active : ''}`}>తె</span>
    </button>
  )
}
