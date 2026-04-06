import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import HomePage           from '@/pages/HomePage'
import ProjectPage        from '@/pages/project/ProjectPage'
import RegressionTestPage from '@/pages/RegressionTestPage'
import ScrollToTop        from '@/components/common/ScrollToTop'
import { LanguageProvider } from '@/context/LanguageContext'
import { i18nApi } from '@/api'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:          1,
      staleTime:      0,
      gcTime:         5 * 60_000,
      throwOnError:   false,
      refetchOnWindowFocus: true,
    },
  },
})

// Inner component so useQuery runs inside QueryClientProvider
function AppWithLanguage() {
  const { data: dbTranslations } = useQuery({
    queryKey: ['i18n'],
    queryFn:  i18nApi.getAll,
    staleTime: 0,
    retry: 1,
    placeholderData: null,
  })

  return (
    <LanguageProvider dbTranslations={dbTranslations}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--green)', color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', borderRadius: '100px', padding: '12px 22px',
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/"                  element={<HomePage />} />
        <Route path="/project/:id"       element={<ProjectPage />} />
        <Route path="/project/:id/:tab"  element={<ProjectPage />} />
        <Route path="/regression-test"   element={<RegressionTestPage />} />
      </Routes>
      <ScrollToTop />
    </LanguageProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithLanguage />
    </QueryClientProvider>
  )
}
