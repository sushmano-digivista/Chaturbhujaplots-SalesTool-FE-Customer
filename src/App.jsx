import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import HomePage    from '@/pages/HomePage'
import ProjectPage from '@/pages/project/ProjectPage'
import ScrollToTop from '@/components/common/ScrollToTop'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:          1,
      staleTime:      0,          // always fetch fresh — DB changes show immediately
      gcTime:         5 * 60_000, // keep cache in memory 5 min (was: default 5 min)
      throwOnError:   false,
      refetchOnWindowFocus: true, // refetch when user switches back to the tab
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      </Routes>

      {/* ── Scroll to top button — appears after scrolling 300px ── */}
      <ScrollToTop />
    </QueryClientProvider>
  )
}

