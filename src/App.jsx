import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import HomePage    from '@/pages/HomePage'
import ProjectPage from '@/pages/project/ProjectPage'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000, throwOnError: false },
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
    </QueryClientProvider>
  )
}
